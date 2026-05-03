import React from "react";
import { useState } from "react";
import { translateToEnglish } from "../services/translate";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { getErrorMessage } from "../types/errors";

export default function Translator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [requestId, setRequestId] = useState(0);

  const handleSubmit = async (value: string) => {

    if (loading) return;

    const currentId = requestId + 1;
    setRequestId(currentId);


    setLoading(true);
    setResult("");

    try {
      const translated = await translateToEnglish(value);

      if (currentId !== requestId + 1) return;

      setResult(translated);
    } catch (err: any) {
      // console.error("RAW_ERROR:", err);
      // setResult(getErrorMessage(err.message));
      if (err instanceof Error) {
        setResult(getErrorMessage(err.message));
        console.error("RAW_ERROR: ", err);
      } else {
        setResult("Unknown Error");
      }
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // render 
  return (
    <Box flexDirection="column">
      <Text>Masukan teks (ID  EN): </Text>
      <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} />
      <Text dimColor>Tekan enter untuk translate</Text>
      {loading && <Text dimColor color="white">Translating....</Text>}

      {
        !loading && result && (
          <Box marginTop={1}>
            <Text>Hasil : {result} </Text>
          </Box>
        )
      }
    </Box >
  );
}
