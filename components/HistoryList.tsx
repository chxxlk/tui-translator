import React from "react";
import { Box, Text } from "ink";
import type { HistoryItem } from "../types/history";

interface HistoryListProps {
  history: HistoryItem[];
}

export function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) return null;

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text dimColor>History:</Text>

      {history.map((item, i) => (
        <Box key={i} flexDirection="column" marginBottom={1}>
          <Text dimColor>[{item.target.toUpperCase()}]</Text>
          <Text>
            <Text color="yellow">In: </Text>{item.input}
          </Text>
          <Text>
            <Text color="green">Out: </Text>{item.output}
          </Text>
        </Box>
      ))}
    </Box>
  );
}