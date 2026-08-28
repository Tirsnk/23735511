import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '@contexts/ThemeContext';
import { SIZES } from '@constants/theme';

interface ShopInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const ShopInput: React.FC<ShopInputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="medium" color={colors.text} style={styles.label}>
          {label}
        </Typography>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
          style,
        ]}
        placeholderTextColor={colors.textLight}
        {...props}
      />
      {error && (
        <Typography variant="regular" color={colors.error} style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  label: {
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  errorText: {
    marginTop: 2,
    fontSize: 12,
  },
});