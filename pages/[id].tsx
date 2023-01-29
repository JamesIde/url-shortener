import redis from "@/lib/redisClient";
export default function Redirect() {
  return <></>;
}

export async function getServerSideProps(context: any) {
  const url = await redis.hget("urls", context.query.id);

  if (url) {
    return {
      redirect: {
        destination: url,
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
