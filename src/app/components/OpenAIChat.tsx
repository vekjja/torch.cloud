// src/app/components/SignOutButton.tsx
"use client";

import { Box } from "@mui/material";
import CloudCicle from "@mui/icons-material/CloudCircle";

export default function OpenAIChat() {
  async function getChatCompletion() {
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4-turbo",
    //   messages: [{ role: "user", content: "Tell me a joke" }],
    // });
    // console.log(response.choices[0].message.content);
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        padding: 1,
        textAlign: "center",
      }}
    >
      <Box sx={{ width: "50vw" }}>
        <CloudCicle onClick={getChatCompletion} />
      </Box>
    </Box>
  );
}
