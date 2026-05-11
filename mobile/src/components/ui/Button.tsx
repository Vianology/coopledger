import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  style?: any;
}

export const Button = ({
  title,
  onPress,
  loading,
  variant = "primary",
  style,
}: ButtonProps) => {
  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return styles.textPrimary;
      case "secondary":
        return styles.textSecondary;
      case "tertiary":
        return styles.textTertiary;
      default:
        return styles.textPrimary;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primary;
      case "secondary":
        return styles.secondary;
      case "tertiary":
        return styles.tertiary;
      default:
        return styles.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getVariantStyle(), style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "tertiary" ? "#2d936c" : "#fff"}
        />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 8,
  },
  primary: {
    backgroundColor: "#2d936c",
  },
  secondary: {
    backgroundColor: "#7cc6fe",
  },
  tertiary: {
    backgroundColor: "#f2e3bc",
  },
  text: {
    fontSize: 16,
    fontFamily: "GoogleSansText-Medium",
  },
  textPrimary: {
    color: "#fff",
  },
  textSecondary: {
    color: "#fff",
  },
  textTertiary: {
    color: "#2d936c",
  },
});
