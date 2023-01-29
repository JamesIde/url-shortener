import { useEffect, useState } from "react";
import { url_model } from "@/@types/URL";
import { useRouter } from "next/router";
function URLs() {
  const router = useRouter();
  const [urls, setUrls] = useState<url_model[]>([]);
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  const fetchURLs = async () => {
    await fetch("/api/short", requestOptions).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUrls(data);
      }
    });
  };

  useEffect(() => {
    fetchURLs();
  }, []);

  function handleRedirect(shortUrl: string) {
    router.push(shortUrl);
  }

  return (
    <div>
      {urls &&
        urls.map((url) => {
          return (
            <div key={url.longUrl}>
              <p>{url.longUrl}</p>
              <a onClick={() => handleRedirect(url.shortUrl)}>{url.shortUrl}</a>
            </div>
          );
        })}
    </div>
  );
}
export default URLs;
