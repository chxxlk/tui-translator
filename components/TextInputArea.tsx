import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export function TextInputArea({ value, onChange, onSubmit }: TextInputAreaProps) {
  return (
    <Box flexDirection="column">
      <Box>
        <Text>Masukan teks: </Text>
        <TextInput value={value} onChange={onChange} onSubmit={onSubmit} />
      </Box>
      <Text dimColor>Tekan [Enter] untuk translate</Text>
    </Box>
  );
}
