import { getErrorMessage } from "../types/errors";

export async function translate(text: string, target: string): Promise<string> {

  if (!text.trim()) {
    const err = new Error(getErrorMessage("EMPTY_INPUT"));
    err.name = "EMPTY_INPUT";
    throw err;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        q: text,
        source: "auto",
        target,
        format: "text",
      }),
    });

    if (!res.ok) {
      const err = new Error(getErrorMessage("BAD_RESPONSE"));
      err.name = "BAD_RESPONSE";
      throw err;
    };

    const data = await res.json();

    if (!data.translatedText) {
      const err = new Error(getErrorMessage("INVALID_PAYLOAD"));
      err.name = "INVALID_PAYLOAD";
      throw err;
    };

    return data.translatedText;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        const timeoutErr = new Error(getErrorMessage("TIMEOUT"));
        timeoutErr.name = "TIMEOUT";
        throw timeoutErr;
      }
      throw err;
    }
    const serviceErr = new Error(getErrorMessage("SERVICE_ERROR"));
    serviceErr.name = "SERVICE_ERROR";
    throw serviceErr;
  } finally {
    clearTimeout(timeout);
  }
}
