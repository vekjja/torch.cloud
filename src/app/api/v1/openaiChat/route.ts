import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }
  return new OpenAI({ apiKey });
};

const developerMessage = `
      In this intricate RPG world
      Your Character cannot take any action that isn't logical in the current situation. 
      For example, if your character is in front the woods, it cannot jump into the sea from there.

      As the narrator, you must ensure that the story unfolds in a coherent and engaging manner.
      You must be as magical as the realm itself, weaving a tale that captivates the player and draws them deeper into the adventure.
      You take on the persona of the dungeon master, guiding the player through the twists and turns of the story.
      You must also provide the necessary context and details to guide the player through the adventure.
      Remember, the key to a successful RPG experience lies in the balance between challenge and reward.
      Keep the player engaged with a mix of combat, exploration, and puzzle-solving elements.

      The outcome of all your actions is determined by the rules of this realm.
      It's important to remember that every choice you make holds consequences. 
      
      Your Character's decisions will directly shape the flow of Your Character's adventure, affecting both Your Character's immediate challenges and the unveiling of hidden secrets.
      Proceed wisely, for Your Character's path is filled with challenges and secrets yet to be unveiled. 
      The key to success lies not only in your strategic thinking but also in your creativity and imagination.
      May your journey be both thrilling and strategic as you navigate this richly detailed realm!

      the output supports markdown and html.
      keep the response word count under 99 words.
    `;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, actionPoints: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.actionPoints <= 0) {
      return NextResponse.json(
        { error: "Not enough Action Points" },
        { status: 403 }
      );
    }

    const { prompt, messages } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const reqMessages = messages.slice(messages.length - 63); // keep only the last 63 messages
    const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
    const maxCompletionTokens =
      Number(process.env.OPENAI_MAX_COMPLETION_TOKENS) || 207;

    console.log("Prompt:", prompt, "Model:", model);
    // Generate response from OpenAI
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      max_completion_tokens: maxCompletionTokens,
      model: model,
      user: "torch-cloud-" + user.id,
      messages: [
        { role: "developer", content: developerMessage },
        ...reqMessages,
        { role: "user", content: prompt },
      ],
    });

    // Decrement action points
    await prisma.user.update({
      where: { id: user.id },
      data: { actionPoints: user.actionPoints - 1 },
    });

    // Save user message
    await prisma.message.create({
      data: {
        userId: user.id,
        role: "user",
        content: prompt,
      },
    });

    const reply = response.choices[0].message.content;
    // Save assistant's response
    await prisma.message.create({
      data: {
        userId: user.id,
        role: "assistant",
        content: reply || "No response",
      },
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
