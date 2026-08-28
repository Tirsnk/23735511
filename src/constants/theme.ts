// src/constants/theme.ts
export const LIGHT_COLORS = {
  primary: '#0F766E',
  secondary: '#F59E0B',
  background: '#F0FDFA',
  surface: '#FFFFFF',
  text: '#134E4A',
  textLight: '#5F7A77',
  border: '#CCFBF1',
  error: '#DC2626',
  success: '#16A34A',
};

export const DARK_COLORS = {
  primary: '#0F766E',
  secondary: '#F59E0B',
  background: '#042F2E',
  surface: '#0B4F4A',
  text: '#F0FDFA',
  textLight: '#99F6E4',
  border: '#115E59',
  error: '#EF4444',
  success: '#22C55E',
};

export const SIZES = {
  radius: 12,
  padding: 16,
};

export const FONTS = {
  regular: { fontSize: 14, fontWeight: '400' as const },
  medium: { fontSize: 14, fontWeight: '600' as const },
  bold: { fontSize: 16, fontWeight: '700' as const },
  title: { fontSize: 20, fontWeight: '700' as const },
};