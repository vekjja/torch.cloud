import { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import Torch from "../three/Torch";
import {
  playMenuSFX,
  playRandomBGM,
  fadeOutBGM,
  playAudio,
  stopAudio,
} from "@/utils/audio";

interface Message {
  role: string;
  content: string;
}

const labelNames = [
  "Create Your Own Adventure",
  "Create your destiny",
  "Create your own story",
  "Create your own path",
  "What will you do next?",
  "What will you do now?",
  "What will you do?",
  "What will you choose?",
  "What will you decide?",
  "What world will you create?",
  "How will you tell your story?",
  "How will you create your world?",
  "How will you create your adventure?",
  "How will you create your destiny?",
  "Create the world you want to see",
  "Create the world you want to live in",
  "Create the world you want to explore",
  "Be the change you want to see",
  "Be the hero of your own story",
  "Be the hero of your own adventure",
  "Be the hero of your own destiny",
];

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

export default function OpenAIChat() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionPoints, setActionPoints] = useState<number | null>(null);
  const [submitLabel, setSubmitLabel] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messages = useRef<Message[]>([]);

  useEffect(() => {
    if (session) {
      fetchActionPoints();
      fetchMessages();
      setSubmitLabel(labelNames[Math.floor(Math.random() * labelNames.length)]);
    }
    console.log("Is mobile device:", isMobileDevice());
  }, [session]);

  const fetchActionPoints = async () => {
    try {
      const res = await fetch("/api/action-points");
      if (!res.ok) throw new Error("Failed to fetch action points");

      const data = await res.json();
      setActionPoints(data.actionPoints);
    } catch (error) {
      console.error("Error fetching action points:", error);
      setActionPoints(0);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/v1/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data: Message[] = await res.json();
      messages.current = data;

      const lastAssistantMessage = data
        .reverse()
        .find((msg) => msg.role === "assistant");
      if (lastAssistantMessage) setResponse(lastAssistantMessage.content);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSubmit = async () => {
    playMenuSFX();
    if (!input.trim()) return;
    if (actionPoints === null || actionPoints <= 0) {
      setResponse("⚠️ Not enough Action Points to perform this action.");
      return;
    }

    stopAudio(audioRef.current);
    setInput("");
    setResponse("🛡️ Action Point Used 🗡️  " + input);
    setLoading(true);
    setSubmitLabel(labelNames[Math.floor(Math.random() * labelNames.length)]);
    playRandomBGM();

    try {
      const res = await fetch("/api/v1/openaiChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, messages: messages.current }),
      });

      const data = await res.json();
      if (res.status !== 200) {
        setResponse(data.error || "Error processing request");
        return;
      }

      messages.current.push({ role: "user", content: input });
      messages.current.push({ role: "assistant", content: data.reply });

      await playTTS(data.reply);
      setResponse(data.reply);
      fadeOutBGM();

      fetchActionPoints();
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error processing request");
    }

    playAudio(audioRef.current);
    setLoading(false);
  };

  const playTTS = async (text: string) => {
    try {
      const ttsRes = await fetch("/api/v1/openaiTTS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (!ttsRes.ok) throw new Error("Failed to fetch TTS audio");

      const reader = ttsRes.body?.getReader();
      if (!reader) throw new Error("Failed to read TTS stream");

      const audioChunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        audioChunks.push(value);
      }

      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
    } catch (error) {
      console.error("Error playing TTS:", error);
    }
  };

  return (
    <Box sx={{ textAlign: "center", padding: 2 }}>
      <Torch />

      {/* Input & Submit Button Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <TextField
          label={submitLabel}
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ width: "72vw", marginBottom: 0.1 }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={loading}
          multiline // Allow multiline input
          minRows={1} // Minimum number of rows
          maxRows={4} // Maximum number of rows
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || actionPoints === 0}
        >
          {loading ? "Loading..." : `Action Points: ${actionPoints ?? "..."}`}
        </Button>
      </Box>

      {response && (
        <Box
          sx={{
            marginTop: 2,
            textAlign: "center",
            padding: 2,
            width: "72vw",
            border: "1px solid #B56719B7",
            borderRadius: "4px",
            backgroundColor: "#1e1e1e",
            color: "#fff",
            margin: "0 auto",
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}></Typography>
          <ReactMarkdown>{response}</ReactMarkdown>
        </Box>
      )}
    </Box>
  );
}
