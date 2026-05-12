import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { LANGUAGES } from "../types/languages";

interface LanguageSelectorProps {
  selectedLang: string;
  onSelect: (langCode: string) => void;
}

export function LanguageSelector({ selectedLang, onSelect }: LanguageSelectorProps) {
  const items = LANGUAGES.map(lang => ({
    label: lang.label,
    value: lang.code
  }));

  const handleSelect = (item: { value: string }) => {
    onSelect(item.value);
  };

  return (
    <Box marginBottom={1} flexDirection="column">
      <Text>
        Pilih Bahasa Tujuan: <Text color="cyan" bold>{selectedLang.toUpperCase()}</Text>
      </Text>
      <SelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
}
