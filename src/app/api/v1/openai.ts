import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { message } = req.body;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: message }],
      });

      res.status(200).json({ result: response.choices[0].message.content });
    } catch {
      res.status(500).json({ error: "Failed to fetch response from OpenAI" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
