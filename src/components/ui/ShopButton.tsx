import React from 'react';
import {
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '@contexts/ThemeContext';
import { SIZES } from '@constants/theme';

interface ShopButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ShopButton: React.FC<ShopButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? colors.primary : 'transparent',
          borderColor: colors.primary,
          borderWidth: isPrimary ? 0 : 1,
          opacity: pressed || isLoading ? 0.7 : 1,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? colors.surface : colors.primary} />
      ) : (
        <Typography
          variant="medium"
          color={isPrimary ? colors.surface : colors.primary}
          style={textStyle}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
});