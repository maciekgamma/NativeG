import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import { Background } from "./Background";
import { parseColor } from "../utils/ColorTool";
import { useThemingExternal, basicPropertiesNames } from "../theme/Theme";

export type ButtonProps = {
  onPress?: () => any;
  text?: string;
  size?: "large" | "medium" | "small";
  rounded?: boolean;
  color?: string;
  borderColor?: string;
  backgroundColor?: string;
  outline?: boolean;
  disabled?: boolean;
};

export function Button({
  text,
  onPress,
  size,
  rounded,
  color,
  backgroundColor,
  outline,
  disabled,
  borderColor,
}: ButtonProps) {
  const externalThemingContext = useThemingExternal();
  const primaryColor = externalThemingContext.getProperty(
    basicPropertiesNames.primary
  );
  const onPrimaryColor = externalThemingContext.getProperty(
    basicPropertiesNames.onPrimary
  );

  const styles = StyleSheet.create({
    text: {
      color: parseColor(
        color || (outline ? primaryColor : onPrimaryColor) || "#000000"
      ),
      textAlign: "center",
      fontSize: size == "large" ? 24 : size == "small" ? 12 : 16,
      fontWeight: "bold",
    },
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={disabled ? 1 : 0.2}>
      <Background
        rounded={rounded}
        backgroundColor={
          backgroundColor || (outline ? "#ffff" : primaryColor) || "#ffffff"
        }
        outline={outline}
        disabled={disabled}
        borderColor={borderColor || primaryColor || "#000000"}
        clickable
      >
        <Text style={styles.text}>{text}</Text>
      </Background>
    </TouchableOpacity>
  );
}
