import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { colors, spacing, typography } = useTheme();

  const getButtonStyle = () => {
    let baseStyle = [styles.button];

    switch (variant) {
      case "primary":
        baseStyle.push({ backgroundColor: colors.primary });
        break;
      case "secondary":
        baseStyle.push({ backgroundColor: colors.secondary });
        break;
      case "accent":
        baseStyle.push({ backgroundColor: colors.accent });
        break;
      case "outline":
        baseStyle.push({
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.primary,
        });
        break;
      default:
        baseStyle.push({ backgroundColor: colors.primary });
    }

    switch (size) {
      case "sm":
        baseStyle.push({
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        });
        break;
      case "md":
        baseStyle.push({
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        });
        break;
      case "lg":
        baseStyle.push({
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
        });
        break;
      default:
        baseStyle.push({
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        });
    }

    if (disabled || loading) {
      baseStyle.push({ opacity: 0.6 });
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    let baseStyle = [styles.text];

    switch (variant) {
      case "outline":
        baseStyle.push({ color: colors.primary });
        break;
      default:
        baseStyle.push({ color: colors.white });
    }

    switch (size) {
      case "sm":
        baseStyle.push({ fontSize: typography.fontSize.sm });
        break;
      case "md":
        baseStyle.push({ fontSize: typography.fontSize.md });
        break;
      case "lg":
        baseStyle.push({ fontSize: typography.fontSize.lg });
        break;
      default:
        baseStyle.push({ fontSize: typography.fontSize.md });
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Button;
