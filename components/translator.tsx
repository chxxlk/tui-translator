import React, { useState } from "react";
import { Box, Text } from "ink";
import { useInput } from "ink";
import { getErrorMessage } from "../types/errors";
import { translate } from "../services/translate";
import type { HistoryItem } from "../types/history";
import { LanguageSelector } from "./LanguageSelector";
import { TextInputArea } from "./TextInputArea";
import { TranslationResult } from "./TranslationResult";
import { HistoryList } from "./HistoryList";

export default function Translator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("");
  const [mode, setMode] = useState<"selecting" | "typing">("selecting");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleLanguageSelect = (langCode: string) => {
    setTargetLang(langCode);
    setMode("typing");
  };

  const handleSubmit = async (value: string) => {
    if (loading || !value.trim()) {
      setResult(getErrorMessage("EMPTY_INPUT"));
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const translated = await translate(value, targetLang);
      setResult(translated);
      setHistory(prev => [
        {
          input: value,
          output: translated,
          target: targetLang,
        },
        ...prev.slice(0, 4)
      ]);
    } catch (err: unknown) {
      const code = err instanceof Error ? err.name : "UNKNOWN";
      console.error("TRANSLATE ERROR: ", err);
      setResult(getErrorMessage(code));
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  useInput((_, key) => {
    if (key.escape) {
      setMode("selecting");
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1} flexDirection="column">
        {/* <Text> 1. Pilih Bahasa Tujuan: <Text color="cyan" bold>{targetLang.toUpperCase()}</Text> */}
        {/*   {mode === "typing" && <Text dimColor> (Tekan ESC/Ctrl+C untuk keluar)</Text>} */}
        {/* </Text> */}

        {mode === "selecting" && (
          <LanguageSelector
            selectedLang={targetLang}
            onSelect={handleLanguageSelect}
          />
        )}
      </Box>

      {mode === "typing" && (
        <Box flexDirection="column">
          <TextInputArea
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
          />

          <TranslationResult loading={loading} result={result} />

          <HistoryList history={history} />

          {/* <Box marginTop={1}> */}
          {/*   <Text dimColor>Tip: Jalankan ulang aplikasi untuk ganti bahasa.</Text> */}
          {/* </Box> */}
        </Box>
      )}
    </Box>
  );
}
