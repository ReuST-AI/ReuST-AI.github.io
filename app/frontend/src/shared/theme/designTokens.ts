/**
 * Design Tokens - ReuST Design System
 *
 * This file defines all design primitives used throughout the application.
 * These tokens ensure consistency and enable easy theming.
 */

export const designTokens = {
  /**
   * Color System
   * Professional, accessible color palette with semantic meaning
   */
  colors: {
    // Brand Colors - Deep industrial blue palette
    brand: {
      navy: {
        50: '#f0f4f8',
        100: '#d9e2ec',
        200: '#bcccdc',
        300: '#9fb3c8',
        400: '#829ab1',
        500: '#627d98',
        600: '#486581',
        700: '#334e68',
        800: '#243b53',
        900: '#102a43',
        950: '#0a1929',
      },
      steel: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
    },

    // Semantic Colors
    semantic: {
      success: {
        light: '#10b981',
        DEFAULT: '#059669',
        dark: '#047857',
        bg: '#d1fae5',
        darkBg: '#064e3b',
      },
      warning: {
        light: '#f59e0b',
        DEFAULT: '#d97706',
        dark: '#b45309',
        bg: '#fef3c7',
        darkBg: '#78350f',
      },
      error: {
        light: '#ef4444',
        DEFAULT: '#dc2626',
        dark: '#b91c1c',
        bg: '#fee2e2',
        darkBg: '#7f1d1d',
      },
      info: {
        light: '#3b82f6',
        DEFAULT: '#2563eb',
        dark: '#1d4ed8',
        bg: '#dbeafe',
        darkBg: '#1e3a8a',
      },
    },

    // Accent Colors - Vibrant sustainability green
    accent: {
      primary: '#10b981',
      primaryHover: '#059669',
      secondary: '#3b82f6',
      secondaryHover: '#2563eb',
    },

    // Neutral Colors
    neutral: {
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',
    },
  },

  /**
   * Typography System
   * Type scale following a modular scale ratio of 1.25 (Major Third)
   */
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.016em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.011em' }],
      xl: ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.014em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.019em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.021em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.022em' }],
      '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.024em' }],
      '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  /**
   * Spacing System
   * Based on 4px base unit for perfect alignment
   */
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    11: '2.75rem',   // 44px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
  },

  /**
   * Border Radius System
   * From sharp to fully rounded
   */
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    DEFAULT: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    full: '9999px',
  },

  /**
   * Shadow System
   * Layered shadows for depth and elevation
   */
  boxShadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 30px 60px -15px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(16, 185, 129, 0.3)',
    glowLg: '0 0 40px rgba(16, 185, 129, 0.4)',
  },

  /**
   * Animation System
   * Duration and easing curves
   */
  animation: {
    duration: {
      fastest: '100ms',
      faster: '150ms',
      fast: '200ms',
      normal: '300ms',
      slow: '400ms',
      slower: '500ms',
      slowest: '700ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.45, 0, 0.55, 1)',
    },
  },

  /**
   * Z-Index System
   * Consistent stacking order
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },

  /**
   * Breakpoints
   * Mobile-first responsive design
   */
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  /**
   * Container Sizes
   * Max widths for content containers
   */
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },
} as const;

export type DesignTokens = typeof designTokens;
