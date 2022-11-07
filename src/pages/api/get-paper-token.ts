import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Method not allowed" });
  }
  const body: { code: string } = req.body;
  const code = body.code;

  const resp = await fetch("https://paper.xyz/api/v1/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer e3d9e9da-612f-49ee-8058-a7d51eb1374a",
    },
    body: JSON.stringify({
      code,
      clientId: "5b224302-b031-4f54-847a-cc4a97f6e9e6",
    }),
  });

  if (resp.status !== 200) {
    return res.status(500).json({ error: "Error getting user token" });
  }
  const { userToken } = await resp.json();

  return res.status(200).json({ userToken });
}