import imagekit from "@/configs/imageKit";
import { openai } from "@/configs/openai";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

async function main(base64Image, mimeType) {
  const messages = [
    {
      role: "system",
      content: `
                You are a product listing assistant for an e-commerce store.
                Your job is to analyze an image of a product and generate
                structured data.

                Respond only with raw JSON (no code block, no markdown, no explanation).
                the JSON must strictly follow this schema:

                {
                    "name": string, //short product name
                    "description": string, // Marketing-friendly
                    description of product
                }
            `,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyze this image and return name + description",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    },
  ];

  const response = await openai.chat.completions.create({
    model: process.env.AI_MODEL,
    messages,
  });

  const raw = response.choices[0].message.content;
  const cleaned = raw.replace(/```json\s*([\s\S]*?)\s*```/, "$1").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error("AI did not return valid json");
  }

  return parsed;
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { base64Image, mimeType } = await req.json();
    const result = await main(base64Image, mimeType);

    return NextResponse.json({ ...result });
  } catch (e) {
    console.log("[AI_ERROR]");
    return NextResponse.json({ message: e.code || e.message }, { status: 400 });
  }
}
