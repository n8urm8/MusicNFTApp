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
      Authorization: "Bearer <YOUR-API-SECRET-KEY>",
    },
    body: JSON.stringify({
      code,
      clientId: "<YOUR-CLIENT-ID>",
    }),
  });

  if (resp.status !== 200) {
    return res.status(500).json({ error: "Error getting user token" });
  }
  const { userToken } = await resp.json();

  return res.status(200).json({ userToken });
}