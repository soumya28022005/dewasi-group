import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Radius, Shadows } from '../theme';

export type GradientVariant = 'blue' | 'orange' | 'green' | 'pink' | 'purple';

interface GradientCardProps {
  children: React.ReactNode;
  variant?: GradientVariant;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const VARIANT_COLORS: Record<
  GradientVariant,
  { border: string; bgAccent: string; shadow: string }
> = {
  blue: {
    border: '#3B82F6',
    bgAccent: '#EFF6FF',
    shadow: '#1E3A8A',
  },
  orange: {
    border: '#F97316',
    bgAccent: '#FFF7ED',
    shadow: '#EA580C',
  },
  green: {
    border: '#10B981',
    bgAccent: '#ECFDF5',
    shadow: '#059669',
  },
  pink: {
    border: '#F43F5E',
    bgAccent: '#FFF1F2',
    shadow: '#E11D48',
  },
  purple: {
    border: '#8B5CF6',
    bgAccent: '#F5F3FF',
    shadow: '#6D28D9',
  },
};

export function GradientCard({
  children,
  variant = 'blue',
  style,
  contentStyle,
}: GradientCardProps) {
  const theme = VARIANT_COLORS[variant];

  return (
    <View
      style={[
        styles.outerContainer,
        {
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
        style,
      ]}
    >
      <View style={[styles.innerContainer, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    backgroundColor: Colors.light.surfaceWhite,
    ...Shadows.md,
  },
  innerContainer: {
    borderRadius: Radius.lg - 2,
    backgroundColor: Colors.light.surfaceWhite,
    overflow: 'hidden',
  },
});
