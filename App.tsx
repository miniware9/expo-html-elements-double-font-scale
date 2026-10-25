import { useState, type ReactNode } from "react";
import { PixelRatio, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { H4 } from "@expo/html-elements";

// One line of text in a frame that reports its height, which follows the font
// size the line was drawn at.
function Case({ label, children }: { label: string; children: ReactNode }) {
  const [height, setHeight] = useState<number>();
  return (
    <View style={styles.case}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={styles.frame}
        onLayout={(event) => setHeight(Math.round(event.nativeEvent.layout.height))}
      >
        {children}
      </View>
      <Text style={styles.label}>Height: {height ?? "…"}</Text>
    </View>
  );
}

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.heading}>
        {Platform.OS}, font scale {PixelRatio.getFontScale()}
      </Text>
      <Case label="<H4>: h4 is 1em, 16 px">
        <H4 style={{ marginVertical: 0 }}>Heading</H4>
      </Case>
      <Case label="<Text> at fontSize 16, bold">
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Heading</Text>
      </Case>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 24, paddingTop: 64, gap: 32 },
  heading: { fontSize: 20, fontWeight: "bold" },
  case: { gap: 8 },
  label: { color: "#555" },
  frame: { alignSelf: "flex-start", borderWidth: 1, borderColor: "#999" },
});
