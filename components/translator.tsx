import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import { useInput } from "ink";
import { useState } from "react";
import { getErrorMessage } from "../types/errors";
import { LANGUAGES } from "../types/languages";
import { translate } from "../services/translate";
import type { HistoryItem } from "../types/history";

export default function Translator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("");
  const [mode, setMode] = useState<"selecting" | "typing">("selecting");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const items = LANGUAGES.map(lang => ({
    label: lang.label,
    value: lang.code
  }));

  const handleSelect = (item: { value: string }) => {
    setTargetLang(item.value);
    setMode("typing"); // Pindah ke input teks setelah pilih bahasa
  };

  const handleSubmit = async (value: string) => {
    // if (loading || !value) return;
    if (loading || !value.trim()) {
      setResult(getErrorMessage("EMPTY_INPUT"));
      return;
    }

    setLoading(true);
    setResult("");

    try {
      // Pastikan fungsi translate menerima parameter targetLang
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
    } catch (err: any) {
      const code = err instanceof Error ? err.name : "UNKNOWN";
      console.error("TRANSLATE ERROR: ", err);
      setResult(getErrorMessage(code));
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  useInput((input, key) => {
    if (key.escape) {
      setMode("selecting");
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* BAGIAN PILIH BAHASA */}
      <Box marginBottom={1} flexDirection="column">
        <Text>
          1. Pilih Bahasa Tujuan: <Text color="cyan" bold>{targetLang.toUpperCase()}</Text>
          {mode === "typing" && <Text dimColor> (Tekan ESC/Ctrl+C untuk keluar)</Text>}
        </Text>

        {mode === "selecting" && (
          <SelectInput items={items} onSelect={handleSelect} />
        )}
      </Box>

      {/* BAGIAN INPUT TEKS */}
      {mode === "typing" && (
        <Box flexDirection="column">
          <Box>
            <Text>2. Masukan teks: </Text>
            <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} />
          </Box>

          <Text dimColor>Tekan [Enter] untuk translate</Text>

          {loading && (
            <Box marginTop={1}>
              <Text color="yellow">⏳ Translating...</Text>
            </Box>
          )}

          {!loading && result && (
            <Box marginTop={1} borderStyle="round" borderColor="green" paddingX={1}>
              <Text>Hasil: <Text bold color="green">{result}</Text></Text>
            </Box>
          )}

          {history.length > 0 && (
            <Box flexDirection="column" marginTop={1}>
              <Text dimColor>History:</Text>

              {history.map((item, i) => (
                <Box key={i} flexDirection="column" marginBottom={1}>
                  <Text dimColor>
                    [{item.target.toUpperCase()}]
                  </Text>
                  <Text>
                    <Text color="yellow">In: </Text>{item.input}
                  </Text>
                  <Text>
                    <Text color="green">Out: </Text>{item.output}
                  </Text>
                </Box>
              ))}
            </Box>
          )}

          <Box marginTop={1}>
            <Text dimColor>Tip: Jalankan ulang aplikasi untuk ganti bahasa.</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
