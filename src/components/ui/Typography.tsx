import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { FONTS } from '@constants/theme';

interface TypographyProps extends TextProps {
  variant?: keyof typeof FONTS;
  color?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = React.memo(({
  variant = 'regular',
  color,
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[FONTS[variant], color ? { color } : undefined, style]}
      {...props}
    >
      {children}
    </Text>
  );
});