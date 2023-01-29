import { v4 as uuid } from "uuid";
import redis from "@/lib/redisClient";
import { NextApiRequest, NextApiResponse } from "next";
export async function generateURL(req: NextApiRequest, res: NextApiResponse) {
  const url = req.body.url;
  if (!url) {
    return res.status(400).send("URL is required");
  }
  const validatedUrl = await checkHttps(url);

  const urlId = await generateUrlId(validatedUrl);

  const shortUrlId = await addToRedis(urlId, validatedUrl);
  if (shortUrlId) {
    const shortUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.PROD_URL}/${urlId}`
        : `http://localhost:3000/${urlId}`;

    return res.status(201).json({ shortUrl: shortUrl, longUrl: validatedUrl });
  } else {
    return res.status(500).send("Something went wrong generating the new URL");
  }
}

export async function getURLs(req: NextApiRequest, res: NextApiResponse) {
  const urls = await redis.hgetall("urls");
  const keys = Object.keys(urls);
  const records = keys.map((record) => {
    return {
      shortUrl:
        process.env.NODE_ENV === "production"
          ? `${process.env.PROD_URL}/${record}`
          : `http://localhost:3000/${record}`,
      longUrl: urls[record],
    };
  });

  return res.status(200).json(records);
}

export async function deleteUrl(req: NextApiRequest, res: NextApiResponse) {
  const urlId = req.body.urlId;
  if (!urlId) {
    return res.status(400).send("URL is required");
  }

  const deleted = await redis.hdel("urls", urlId);
  if (deleted) {
    return res.status(200).json({ message: "URL deleted" });
  } else {
    return res.status(500).send("Something went wrong deleting the URL");
  }
}

async function generateUrlId(url: string) {
  return uuid().slice(0, 6);
}

async function addToRedis(urlId: string, url: string) {
  return await redis.hset("urls", urlId, url);
}

async function checkHttps(url: string) {
  if (!/^https/.test(url)) {
    url = "https://" + url;
  }
  return url;
}
