import { GoogleGenAI, Type, type Schema } from "@google/genai";

// The vite.config.ts we created will replace process.env.API_KEY with your Vercel key.
// If you are running locally without Vercel, make sure you have a .env file or replace this string.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const OUTLINE_MODEL = "gemini-2.5-flash";
const WRITING_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-2.5-flash-image";

interface OutlineResponse {
  bookTitle: string;
  chapters: { title: string }[];
}

export const generateBookOutline = async (topic: string): Promise<OutlineResponse> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      bookTitle: {
        type: Type.STRING,
        description: "A catchy, creative title for the eBook.",
      },
      chapters: {
        type: Type.ARRAY,
        description: "A list of 4 chapters for the book.",
        items: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The title of the chapter.",
            },
          },
          required: ["title"],
        },
      },
    },
    required: ["bookTitle", "chapters"],
  };

  const prompt = `
    You are a professional book editor. 
    Create a compelling title and a 4-chapter outline for a short, engaging eBook about the following topic: 
    "${topic}".
    Ensure the chapter flow is logical and engaging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: OUTLINE_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as OutlineResponse;
  } catch (error) {
    console.error("Error generating outline:", error);
    throw new Error("Failed to generate book outline.");
  }
};

export const generateChapterContent = async (
  bookTitle: string,
  chapterTitle: string,
  chapterIndex: number,
  topic: string
): Promise<string> => {
  const prompt = `
    You are a ghostwriter for the book titled "${bookTitle}" about "${topic}".
    Write the content for Chapter ${chapterIndex + 1}: "${chapterTitle}".
    
    Guidelines:
    - Write approximately 300-400 words.
    - Use Markdown formatting.
    - Do NOT include the Chapter Title at the top.
    - Focus strictly on the content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: WRITING_MODEL,
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Content generation failed.";
  } catch (error) {
    console.error(`Error generating chapter ${chapterIndex}:`, error);
    return "An error occurred while writing this chapter.";
  }
};

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "3:4" | "16:9" = "1:1"): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: { aspectRatio },
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    return undefined;
  } catch (error) {
    console.warn("Image generation failed:", error);
    return undefined;
  }
};

export const generateBookCover = async (title: string, topic: string): Promise<string | undefined> => {
  const prompt = `A cinematic book cover for "${title}" about "${topic}". High quality, 4k, no text.`;
  return generateImage(prompt, "3:4");
};

export const generateChapterIllustration = async (chapterTitle: string, topic: string): Promise<string | undefined> => {
  const prompt = `Cinematic illustration for chapter "${chapterTitle}" in book about "${topic}". detailed, atmospheric, wide shot.`;
  return generateImage(prompt, "16:9");
};
