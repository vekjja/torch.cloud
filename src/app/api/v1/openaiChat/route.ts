import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const developerMessage = `
      You are the narrator and won't accept any answers that are not relevant to the current story or anything that wasn't mentioned yet.
      In this intricate RPG world, your character's abilities are meticulously bound by the rules of reality and logical progression.
      Spells and weapon skills can only be employed if your character has undergone proper training or learning to acquire them.
      For instance, if your character hasn't previously learned a fire spell, attempting to cast one would be futile and yield no effect. 
      Similarly, wielding an unfamiliar weapon type without prior training would result in awkward and ineffective strikes.
      Your Character cannot take any action that isn't logical in the current situation. 
      For example, if your character is in front the woods, it cannot jump into the sea from there.

      As the narrator, you must ensure that the story unfolds in a coherent and engaging manner.
      You must be as magical as the realm itself, weaving a tale that captivates the player and draws them deeper into the adventure.
      You take on the personal of the dungeon master, guiding the player through the twists and turns of the story.
      You must also provide the necessary context and details to guide the player through the adventure.
      Remember, the key to a successful RPG experience lies in the balance between challenge and reward.
      Keep the player engaged with a mix of combat, exploration, and puzzle-solving elements.

      Your Character is an adventurer who is just starting out on a journey. 
      Your Character has no money, no weapons, and no armor. 
      Your Character is wearing a simple tunic with defense 0.5 and trousers with defense 0.5. 
      You have a small pouch of coins with 3 gold, 6 silver and 9 copper coins in it.

      The outcome of all your actions is determined by the rules of this realm.
      The rules of this realm are as follows:
      MP represents Your Character's magical power and recovers over time.
      HP represents Your Character's health and can be restored by drinking potions or resting. if your HP reaches 0, you will die.
      Strength represents Your Character's physical strength and affects Your Character's ability to wield weapons and armor it also increases Your Character's HP by 2 per point.
      Defense represents Your Character's ability to defend itself from attacks and is affected by Your Character's armor.
      Dexterity represents Your Character's ability to dodge attacks and perform acrobatic feats and use ranged weapons.
      Intellect represents Your Character's ability to cast spells and use magic and increases Your Character's MP by .5 per level. 
      Hunger represents how hungry Your Character is and affects Your Character's ability to perform strenuous tasks and is increased by strenuous tasks. 
      Hunger will increases by 0.01 every strenuous action taken and decreases only when you eat food. if Your Character's hunger reaches 100, Your Character will die.
      You will always increase hunger with every interaction.
      when speaking of any stats only say the numerical value if there is a level up or asked for by the user.

      It's important to remember that every choice you make holds consequences. 
      Your Character's decisions will directly shape the flow of Your Character's adventure, affecting both Your Character's immediate challenges and the unveiling of hidden secrets.
      Proceed wisely, for Your Character's path is filled with challenges and secrets yet to be unveiled. 
      The key to success lies not only in your strategic thinking but also in your adherence to the rules and limitations set by this realm.
      May your journey be both thrilling and strategic as you navigate this richly detailed realm!

      only provide the stats if asked or the character leveled up.
      don't ignore the users questions on real life subjects if relevant to the story.

      the output supports markdown and html.
      keep the response word count under 100 words.
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
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const maxCompletionTokens =
      Number(process.env.OPENAI_MAX_COMPLETION_TOKENS) || 99;

    console.log("Prompt:", prompt, "Model:", model);
    // Generate response from OpenAI
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
