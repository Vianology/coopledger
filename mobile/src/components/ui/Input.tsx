import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  error?: string;
  icon?: React.ReactNode;
  prefix?: string;
  multiline?: boolean;
}

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  icon,
  prefix,
  multiline,
}: InputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {prefix && (
          <View style={styles.prefixContainer}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        )}
        <TextInput
          style={[styles.input, multiline ? { height: 100, textAlignVertical: "top" } : null]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholderTextColor="#bdc9c1"
          multiline={multiline}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#3e4943",
    marginBottom: 8,
    fontWeight: "500",
    fontFamily: "GoogleSansText-Medium",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 48,
    overflow: "hidden",
  },
  inputWrapperError: {
    borderColor: "#ff3b30",
  },
  iconContainer: {
    paddingLeft: 12,
    paddingRight: 8,
    justifyContent: "center",
  },
  prefixContainer: {
    paddingLeft: 12,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    height: "100%",
    justifyContent: "center",
  },
  prefixText: {
    fontSize: 16,
    color: "#3e4943",
    fontFamily: "GoogleSansText-Regular",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000",
    fontFamily: "GoogleSansText-Regular",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "GoogleSansText-Regular",
  },
});
