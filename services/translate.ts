import { getErrorMessage } from "../types/errors";

export async function translateToEnglish(text: string): Promise<string> {

  if (!text.trim()) {
    throw new Error(getErrorMessage("EMPTY_INPUT"));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 500);

  try {
    const res = await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        q: text,
        source: "id",
        target: "en",
        format: "text",
      }),
    });

    if (!res.ok) {
      throw new Error(getErrorMessage("BAD_RESPONSE"));
    };

    const data = await res.json();

    if (!data.translatedText) {
      throw new Error(getErrorMessage("INVALID_PAYLOAD"));
    };

    return data.translatedText;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(getErrorMessage("TIMEOUT"));
    }
    throw new Error("SERVICE_ERROR");
  } finally {
    clearTimeout(timeout);
  }
}
