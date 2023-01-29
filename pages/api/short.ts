// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateURL, getURLs } from "@/services/url.service";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return generateURL(req, res);
  } else if (req.method === "GET" && !req.query.urlId) {
    return getURLs(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
