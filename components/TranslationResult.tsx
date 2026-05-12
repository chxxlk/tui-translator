import React from "react";
import { Box, Text } from "ink";

interface TranslationResultProps {
  loading: boolean;
  result: string;
}

export function TranslationResult({ loading, result }: TranslationResultProps) {
  if (loading) {
    return (
      <Box marginTop={1}>
        <Text color="yellow">⏳ Translating...</Text>
      </Box>
    );
  }

  if (!result) return null;

  return (
    <Box marginTop={1} borderStyle="round" borderColor="green" paddingX={1}>
      <Text>Hasil: <Text bold color="green">{result}</Text></Text>
    </Box>
  );
}