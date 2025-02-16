import { useState, useRef, useCallback, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import Torch from "./Torch";
import {
  playMenuSFX,
  playRandomBGM,
  stopAudio,
  narrateAudio,
  globalVoice,
} from "@/utils/audio";

interface Message {
  role: string;
  content: string;
}

const labelNames = [
  "Interact",
  "Enter Action",
  "e.g. Ask for Help",
  "e.g. Recap, Status",
  "e.g. Explore, Investigate",
  "You can be as detailed as you like",
];

export default function OpenAIChat() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionPoints, setActionPoints] = useState<number | null>(null);
  const [submitLabel, setSubmitLabel] = useState<string>("");
  const [voice, setVoice] = useState<string>(globalVoice);
  const messages = useRef<Message[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchActionPoints = useCallback(async () => {
    console.log("fetching action points");
    try {
      const res = await fetch("/api/v1/action-points");
      if (!res.ok) throw new Error("Failed to fetch action points");

      const data = await res.json();
      setActionPoints(data.actionPoints);
    } catch (error) {
      console.error("Error fetching action points:", error);
      setActionPoints(0);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    console.log("fetching messages");
    try {
      const res = await fetch("/api/v1/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data: Message[] = await res.json();
      messages.current = data;

      if (response === "") {
        const lastAssistantMessage = data.find(
          (msg) => msg.role === "assistant"
        );
        if (lastAssistantMessage) {
          setResponse(lastAssistantMessage.content);
        }
      }
      console.log("Messages Fetched:", messages.current);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [response]);

  useEffect(() => {
    if (session) {
      setSubmitLabel(labelNames[Math.floor(Math.random() * labelNames.length)]);
      fetchActionPoints();
      fetchMessages();
    }
  }, [session, fetchActionPoints, fetchMessages]);

  useEffect(() => {
    setVoice(globalVoice);
  }, []);

  const handleSubmit = async () => {
    playMenuSFX();
    // scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!input.trim()) return;
    if (actionPoints === null || actionPoints <= 0) {
      setResponse(`⚠️ Not enough Action Points to perform this action.
        \n⚔️ If you made it this far, You are a true Adventurer
        \n💲 The Option to Purchase More Action Points is Currently Unavailable.
        \n🖤 Please Consider Donating and Come Back Soon!.
        `);
      return;
    }

    setInput("");
    playRandomBGM();
    setLoading(true);
    stopAudio(audioRef.current);
    setResponse("\t🗡️🛡️Action Taken🛡️🗡️\n" + input);
    setSubmitLabel(labelNames[Math.floor(Math.random() * labelNames.length)]);

    console.log("Submitting:", input, "Messages:", messages.current);
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

      fetchActionPoints();
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error processing request");
    }

    setLoading(false);
  };

  const playTTS = async (text: string) => {
    try {
      console.log("Playing TTS audio", "Voice:", voice);
      const ttsRes = await fetch("/api/v1/openaiTTS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, voice: globalVoice }),
      });

      if (!ttsRes.ok) throw new Error("Failed to fetch TTS audio");

      // Convert response body to a blob
      const audioBlob = await ttsRes.blob();
      if (audioBlob.size === 0) {
        throw new Error("Received empty audio file.");
      }

      // Create a URL for the audio and play it
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.volume = 1.0;
      narrateAudio(audioRef.current);
    } catch (error) {
      console.error("Error playing TTS:", error);
    }
  };

  const handleNarrateClick = () => {
    narrateAudio(audioRef.current);
  };

  return (
    <Box sx={{ textAlign: "center", padding: 1 }}>
      <Torch sceneHeight={"40vh"} />
      {response && (
        <Box
          sx={{
            marginTop: 2,
            marginBottom: 2,
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
          <ReactMarkdown>{response}</ReactMarkdown>
        </Box>
      )}
      <Button
        color="secondary"
        onClick={handleNarrateClick}
        sx={{
          display:
            loading || response === "" || !audioRef.current ? "none" : "block",
          margin: "0 auto",
          marginTop: 2,
        }}
      >
        <RecordVoiceOverIcon sx={{ fontSize: 40 }} />
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        <TextField
          label={submitLabel}
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            width: "72vw",
            marginBottom: 2,
            display: loading ? "none" : "",
          }}
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
          sx={{ display: input.trim() ? "block" : "none" }}
        >
          {loading
            ? "Loading..."
            : `Use Action Point: ${actionPoints ?? "..."}`}
        </Button>
      </Box>
    </Box>
  );
}
