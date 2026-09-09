import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GradientCard, GradientVariant } from './GradientCard';
import { Icon, IconName } from './Icon';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface StatCardProps {
  label: string;
  value: number | string;
  iconName: IconName;
  variant: GradientVariant;
}

const ICON_BG: Record<GradientVariant, { bg: string; iconColor: string }> = {
  blue: { bg: '#1E3A8A', iconColor: '#FFFFFF' },
  orange: { bg: '#F97316', iconColor: '#FFFFFF' },
  green: { bg: '#059669', iconColor: '#FFFFFF' },
  pink: { bg: '#F43F5E', iconColor: '#FFFFFF' },
  purple: { bg: '#7C3AED', iconColor: '#FFFFFF' },
};

export function StatCard({ label, value, iconName, variant }: StatCardProps) {
  const iconTheme = ICON_BG[variant];

  return (
    <View style={styles.gridItem}>
      <GradientCard variant={variant} contentStyle={styles.cardContent}>
        <View style={styles.topRow}>
          <View style={[styles.iconBox, { backgroundColor: iconTheme.bg }]}>
            <Icon name={iconName} size={18} color={iconTheme.iconColor} />
          </View>
        </View>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.labelText} numberOfLines={1}>
          {label}
        </Text>
      </GradientCard>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    minWidth: '47%',
  },
  cardContent: {
    padding: Spacing.three,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  valueText: {
    fontSize: Typography.fontSizes['2xl'],
    fontWeight: Typography.fontWeights.bold,
    color: Colors.light.ink900,
  },
  labelText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.light.ink500,
    marginTop: 2,
  },
});
