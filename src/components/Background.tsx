import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

import { parseColor } from "../utils/ColorTool";

export type BackgroundProps = {
  onPress?: () => any;
  rounded?: boolean;
  backgroundColor?: string;
  outline?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  borderColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  clickable?: boolean;
};

export function Background({
  children,
  onPress,
  rounded,
  backgroundColor,
  outline,
  disabled,
  borderColor,
  paddingHorizontal,
  paddingVertical,
  clickable,
}: BackgroundProps) {
  const styles = StyleSheet.create({
    background: {
      borderRadius: rounded ? 8 : 0,
      paddingVertical: paddingVertical || 14,
      paddingHorizontal: paddingHorizontal || 10,
      margin: 5,
      backgroundColor: parseColor(
        backgroundColor || "#000000",
        backgroundColor && outline ? 0.5 : 0,
        outline
      ),
      borderStyle: "solid",
      borderWidth: outline ? 2 : 0,
      borderColor: parseColor(borderColor || "#000000"),
      opacity: disabled ? 0.3 : 1,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={clickable && !disabled ? 0.2 : 1}
    >
      <View style={styles.background}>{children}</View>
    </TouchableOpacity>
  );
}
