# ReuST Design System - Quick Reference

A quick reference guide for developers using the ReuST Design System.

## Quick Imports

```tsx
// Components
import { Button, Input, Card, Badge, Loader } from '@/shared/components';

// Design Tokens
import { designTokens } from '@/shared/theme/designTokens';

// Theme
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
```

## Common Patterns

### Standard Form

```tsx
<Card>
  <CardBody>
    <div className="space-y-4">
      <Input label="Name" required />
      <Input label="Email" type="email" />
      <Button variant="primary" fullWidth>Submit</Button>
    </div>
  </CardBody>
</Card>
```

### Status Badge

```tsx
<Badge variant="success">Passed</Badge>
<Badge variant="warning">Review</Badge>
<Badge variant="error">Failed</Badge>
```

### Loading State

```tsx
{isLoading ? (
  <Loader variant="spinner" text="Loading..." />
) : (
  <div>Content</div>
)}
```

## Color Classes Cheatsheet

### Brand
- `bg-brand-navy-{50-950}` - Deep industrial blue
- `bg-brand-steel-{50-900}` - Neutral grays
- `text-brand-navy-{50-950}`
- `text-brand-steel-{50-900}`

### Semantic
- `bg-success` `text-success` - Green (#10b981)
- `bg-warning` `text-warning` - Amber (#d97706)
- `bg-error` `text-error` - Red (#dc2626)
- `bg-info` `text-info` - Blue (#2563eb)

### Accent
- `bg-accent-primary` - Sustainability green
- `bg-accent-secondary` - Blue
- `hover:bg-accent-primary-hover`

## Spacing Scale (4px base)

```
p-1  = 4px      p-6  = 24px     p-16 = 64px
p-2  = 8px      p-8  = 32px     p-20 = 80px
p-3  = 12px     p-10 = 40px     p-24 = 96px
p-4  = 16px     p-12 = 48px     p-32 = 128px
```

## Typography Scale

```
text-xs   = 0.75rem    text-2xl  = 1.5rem
text-sm   = 0.875rem   text-3xl  = 1.875rem
text-base = 1rem       text-4xl  = 2.25rem
text-lg   = 1.125rem   text-5xl  = 3rem
text-xl   = 1.25rem    text-6xl  = 3.75rem
```

## Animation Classes

```tsx
// Fade
className="animate-fade-in"

// Slide
className="animate-slide-in-bottom"
className="animate-slide-in-top"
className="animate-slide-in-left"
className="animate-slide-in-right"

// Scale
className="animate-scale-in"

// Loading states
className="animate-pulse"
className="animate-spin"
className="shimmer"
```

## Responsive Breakpoints

```tsx
// Mobile first
sm:   640px   md:   768px
lg:   1024px  xl:   1280px
2xl:  1536px
```

## Shadow Scale

```tsx
shadow-xs    // Subtle
shadow-sm    // Small
shadow       // Default
shadow-md    // Medium
shadow-lg    // Large
shadow-xl    // Extra large
shadow-2xl   // Huge
shadow-glow  // Green glow
```

## Border Radius

```tsx
rounded-sm   // 4px
rounded      // 6px (default)
rounded-md   // 8px
rounded-lg   // 12px
rounded-xl   // 16px
rounded-2xl  // 24px
rounded-full // Fully rounded
```

## Button Variants

```tsx
variant="primary"   // Green, main CTA
variant="secondary" // White/outlined
variant="ghost"     // Transparent
variant="danger"    // Red, destructive
variant="success"   // Green confirmation
```

## Dark Mode

```tsx
// Always use dark: prefix
className="bg-white dark:bg-brand-steel-900"
className="text-gray-900 dark:text-white"
className="border-gray-200 dark:border-brand-steel-700"
```

## Utility Classes

```tsx
// Component styles
className="card"              // Card wrapper
className="card-hover"        // Hoverable card
className="glass"             // Glass morphism
className="btn"               // Button base
className="input"             // Input base
className="badge"             // Badge base
className="skeleton"          // Loading skeleton

// Layout
className="container-custom"  // Centered container
className="divider"           // Horizontal divider

// Text
className="text-gradient"     // Gradient text
className="text-balance"      // Balanced wrapping
className="truncate-2-lines"  // Truncate at 2 lines
```

## Common Component Props

### Button
```tsx
variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
size?: 'sm' | 'md' | 'lg'
loading?: boolean
fullWidth?: boolean
icon?: ReactNode
```

### Input
```tsx
label?: string
error?: string
helpText?: string
icon?: ReactNode
success?: boolean
```

### Card
```tsx
variant?: 'default' | 'elevated' | 'outlined' | 'glass'
padding?: 'none' | 'sm' | 'md' | 'lg'
hover?: boolean
interactive?: boolean
```

### Badge
```tsx
variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
size?: 'sm' | 'md' | 'lg'
dot?: boolean
icon?: ReactNode
```

### Loader
```tsx
variant?: 'spinner' | 'dots' | 'pulse'
size?: 'sm' | 'md' | 'lg' | 'xl'
color?: 'primary' | 'white' | 'gray'
text?: string
```

## Accessibility Checklist

- ✓ Use semantic HTML (`<button>`, `<input>`, etc.)
- ✓ Include labels on all form inputs
- ✓ Add ARIA attributes when needed
- ✓ Ensure keyboard navigation works
- ✓ Maintain focus indicators
- ✓ Test with screen reader
- ✓ Check color contrast (WCAG AA)
- ✓ Support both light and dark modes

## File Structure

```
src/shared/
├── components/       # UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── ...
├── theme/           # Theme configuration
│   ├── designTokens.ts
│   └── ThemeProvider.tsx
└── types/           # TypeScript types
```

## Tips

1. **Import from index**: `import { Button, Input } from '@/shared/components'`
2. **Use design tokens**: Reference `designTokens.ts` for consistent values
3. **Mobile-first**: Write mobile styles first, then add responsive variants
4. **Dark mode**: Always add `dark:` variants for color classes
5. **Accessibility**: Use semantic HTML and proper ARIA attributes
6. **Performance**: Prefer Tailwind classes over inline styles

## Common Mistakes to Avoid

❌ **Don't**
```tsx
// Hardcoded colors
<div style={{ color: '#10b981' }}>

// Missing dark mode
<div className="bg-white">

// Inline styles for spacing
<div style={{ padding: '16px' }}>
```

✅ **Do**
```tsx
// Use Tailwind classes
<div className="text-accent-primary">

// Include dark mode
<div className="bg-white dark:bg-brand-steel-900">

// Use spacing scale
<div className="p-4">
```

---

For complete documentation, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
