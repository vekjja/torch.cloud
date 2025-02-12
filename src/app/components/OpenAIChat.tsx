"use client";

import { useState, useRef } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { menuSelect } from "@/utils/audio";

// Explicitly define types for `code` component props
interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function OpenAIChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    menuSelect(0.8);
    if (!input.trim()) return;
    setLoading(true);

    try {
      // Fetch OpenAI Chat Response
      const res = await fetch("/api/v1/openaiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setResponse(data.reply || "No response received");

      // Call TTS API to get the audio file
      const ttsRes = await fetch("/api/v1/openaiTTS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: data.reply }),
      });

      if (!ttsRes.ok) {
        throw new Error("Failed to fetch TTS audio");
      }

      const audioBlob = await ttsRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create a temporary download link
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = "speech.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Play the downloaded audio
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error processing request");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ textAlign: "center", padding: 2 }}>
      <TextField
        label="Your Journey Begins..."
        variant="outlined"
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        sx={{ marginBottom: 2 }}
        onKeyUp={(e) => e.key === "Enter" && handleSubmit()}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Loading..." : "Take Action"}
      </Button>

      {response && (
        <Box
          sx={{
            marginTop: 2,
            textAlign: "left",
            padding: 2,
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#1e1e1e",
            color: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Response:
          </Typography>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).trim()}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {response}
          </ReactMarkdown>
        </Box>
      )}
    </Box>
  );
}
