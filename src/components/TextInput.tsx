import React, { useState } from "react";
import {
  StyleSheet,
  TextInput as NativeTextInput,
  View,
  TextInputProps as NativeTextInputProps,
} from "react-native";

import { Background } from "./Background";
import { useThemingExternal, basicPropertiesNames } from "../theme/Theme";
import { parseColor } from "../utils/ColorTool";

export interface TextInputProps {
  size?: "large" | "medium" | "small";
  textAlign?: "left" | "right" | "center";
  outline?: boolean;
  rounded?: boolean;
  backgroundColor?: string;
  color?: string;
  defaultValue?: string;
  placeholder?: string;
  placeholderColor?: string;
  secureTextEntry?: boolean;
  keyboardType?: NativeTextInputProps["keyboardType"];
}

export function TextInput(props: TextInputProps) {
  const externalThemingContext = useThemingExternal();
  const surfaceColor = externalThemingContext.getProperty(
    basicPropertiesNames.surface
  );
  const onSurfaceColor = externalThemingContext.getProperty(
    basicPropertiesNames.onSurface
  );
  const [text, setText] = useState(props.defaultValue || "");

  const handleTextChange = (newText: string) => {
    setText(newText);
  };
  const styles = StyleSheet.create({
    input: {
      width: "100%",
      color: parseColor(props.color || onSurfaceColor || "#000000"),
      fontSize: props.size === "large" ? 22 : props.size === "small" ? 14 : 18,
      textAlign: props.textAlign || "center",
    },
  });

  return (
    <Background
      outline={props.outline === undefined ? true : props.outline}
      rounded={props.rounded}
      backgroundColor={props.backgroundColor || surfaceColor || "#ffffff"}
      paddingHorizontal={props.size === "small" ? 10 : 12}
    >
      <NativeTextInput
        style={styles.input}
        value={text}
        onChangeText={handleTextChange}
        placeholder={props.placeholder}
        placeholderTextColor={parseColor(props.placeholderColor || "grey")}
        secureTextEntry={props.secureTextEntry || false}
        keyboardType={props.keyboardType}
      />
    </Background>
  );
}
