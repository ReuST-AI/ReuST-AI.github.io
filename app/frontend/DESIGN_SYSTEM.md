# ReuST Design System

An award-winning design system built for the ReuST (Reuse of Structural Steel) application. This design system provides a comprehensive set of design tokens, components, and guidelines to create a consistent, accessible, and beautiful user experience.

## Table of Contents

- [Philosophy](#philosophy)
- [Design Tokens](#design-tokens)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Components](#components)
- [Animations](#animations)
- [Accessibility](#accessibility)
- [Dark Mode](#dark-mode)
- [Best Practices](#best-practices)

---

## Philosophy

The ReuST Design System is built on these core principles:

### 1. Industrial Elegance
Drawing inspiration from structural engineering and sustainability, the design balances professional aesthetics with modern UI patterns. Deep navy tones represent strength and reliability, while vibrant greens symbolize sustainability and environmental consciousness.

### 2. Accessibility First
Every component is built with WCAG 2.1 Level AA compliance in mind, ensuring the application is usable by everyone.

### 3. Performance Optimized
Leveraging Tailwind CSS for minimal bundle size and optimal runtime performance. All animations use GPU-accelerated transforms and opacity changes.

### 4. Mobile-First Responsive
All components are designed mobile-first and scale beautifully across all device sizes.

---

## Design Tokens

Design tokens are the foundation of the design system. They're defined in `src/shared/theme/designTokens.ts` and automatically integrated with Tailwind CSS.

### Usage

```typescript
import { designTokens } from '@/shared/theme/designTokens';

// Access tokens
const primaryColor = designTokens.colors.accent.primary;
const largeShadow = designTokens.boxShadow.lg;
```

---

## Color System

### Brand Colors

#### Navy (Primary Brand Color)
Deep, professional blue tones representing strength and engineering precision.

```tsx
// Usage
<div className="bg-brand-navy-800 text-white">...</div>
```

**Scale**: 50 (lightest) → 950 (darkest)

#### Steel (Neutral Grays)
Sophisticated gray tones for backgrounds and supporting UI elements.

```tsx
<div className="bg-brand-steel-100 dark:bg-brand-steel-800">...</div>
```

### Semantic Colors

#### Success (Green)
- **Use for**: Positive outcomes, successful operations, "reuse" recommendations
- **Shades**: `success`, `success-light`, `success-dark`, `success-bg`, `success-dark-bg`

```tsx
<div className="bg-success text-white">Reuse Recommended</div>
<Badge variant="success">Passed</Badge>
```

#### Warning (Amber)
- **Use for**: Caution states, important notices, intermediate results
- **Shades**: `warning`, `warning-light`, `warning-dark`, `warning-bg`, `warning-dark-bg`

```tsx
<div className="text-warning">Review Required</div>
```

#### Error (Red)
- **Use for**: Errors, destructive actions, failed validations
- **Shades**: `error`, `error-light`, `error-dark`, `error-bg`, `error-dark-bg`

```tsx
<Input error="This field is required" />
<Button variant="danger">Delete</Button>
```

#### Info (Blue)
- **Use for**: Informational messages, helpful tips, neutral notifications
- **Shades**: `info`, `info-light`, `info-dark`, `info-bg`, `info-dark-bg`

```tsx
<Toast type="info" title="Tip" message="..." />
```

### Accent Colors

#### Primary Accent (Sustainability Green)
The primary action color representing environmental sustainability.

```tsx
<Button variant="primary">Continue</Button>
<div className="text-accent-primary">...</div>
```

#### Secondary Accent (Blue)
Secondary action color for supporting interactions.

```tsx
<Button variant="secondary">Learn More</Button>
```

---

## Typography

### Font Families

#### Sans (Inter)
Primary typeface for all UI text. Clean, highly legible, and professionally designed.

```tsx
<p className="font-sans">Body text</p>
```

#### Display (Poppins)
For headings and prominent text requiring extra visual impact.

```tsx
<h1 className="font-display font-bold">ReuST Assessment</h1>
```

#### Mono (JetBrains Mono)
For code, technical data, and tabular information.

```tsx
<code className="font-mono">element_id: 12345</code>
```

### Type Scale

Based on a modular scale (1.25 ratio) with optimized line heights and letter spacing:

```tsx
<p className="text-xs">Extra small - 0.75rem</p>
<p className="text-sm">Small - 0.875rem</p>
<p className="text-base">Base - 1rem (default)</p>
<p className="text-lg">Large - 1.125rem</p>
<p className="text-xl">Extra large - 1.25rem</p>
<p className="text-2xl">2XL - 1.5rem</p>
<p className="text-3xl">3XL - 1.875rem</p>
<p className="text-4xl">4XL - 2.25rem</p>
<p className="text-5xl">5XL - 3rem</p>
<p className="text-6xl">6XL - 3.75rem</p>
```

### Font Weights

```tsx
<p className="font-light">Light (300)</p>
<p className="font-normal">Normal (400) - default</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>
<p className="font-extrabold">Extra Bold (800)</p>
```

### Text Utilities

```tsx
// Gradient text
<h1 className="text-gradient">Sustainable Future</h1>

// Balanced text wrapping
<p className="text-balance">Long heading text that wraps nicely</p>

// Truncate multiline
<p className="truncate-2-lines">...</p>
<p className="truncate-3-lines">...</p>
```

---

## Spacing & Layout

### Spacing Scale

Based on 4px base unit for perfect alignment:

```tsx
// Padding/Margin: p-{size}, m-{size}
<div className="p-4">16px padding</div>
<div className="m-6">24px margin</div>
<div className="px-8 py-4">32px horizontal, 16px vertical</div>
```

**Scale**: 0, px, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32

### Container

```tsx
// Centered container with responsive padding
<div className="container-custom">
  <div className="max-w-7xl">...</div>
</div>
```

### Border Radius

```tsx
<div className="rounded-sm">Small - 4px</div>
<div className="rounded">Default - 6px</div>
<div className="rounded-md">Medium - 8px</div>
<div className="rounded-lg">Large - 12px</div>
<div className="rounded-xl">XL - 16px</div>
<div className="rounded-2xl">2XL - 24px</div>
<div className="rounded-3xl">3XL - 32px</div>
<div className="rounded-full">Fully rounded</div>
```

---

## Components

### Button

Professional button component with multiple variants and states.

```tsx
import { Button } from '@/shared/components/Button';

// Variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Confirm</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// With icon
<Button icon={<PlusIcon className="w-5 h-5" />}>
  Add Item
</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

### Input

Enhanced input field with validation states and icons.

```tsx
import { Input } from '@/shared/components/Input';

// Basic
<Input
  label="Email"
  placeholder="Enter your email"
  type="email"
/>

// With validation
<Input
  label="Password"
  type="password"
  required
  error="Password is required"
/>

// Success state
<Input
  label="Username"
  success
  helpText="Username is available"
/>

// With icon
<Input
  label="Search"
  icon={<SearchIcon className="w-5 h-5" />}
  iconPosition="left"
/>
```

### Card

Versatile card component for grouping content.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/shared/components/Card';

<Card variant="elevated" hover>
  <CardHeader
    title="Assessment Results"
    subtitle="Completed on Jan 19, 2026"
    action={<Button size="sm">Edit</Button>}
  />
  <CardBody>
    <p>Your structural element analysis is complete.</p>
  </CardBody>
  <CardFooter>
    <Button fullWidth>View Details</Button>
  </CardFooter>
</Card>

// Variants
<Card variant="default">Default card</Card>
<Card variant="elevated">Elevated with shadow</Card>
<Card variant="outlined">Outlined border</Card>
<Card variant="glass">Glass morphism effect</Card>

// Interactive
<Card interactive>Clickable card</Card>
<Card hover>Hover effect</Card>
```

### Accordion

Collapsible content sections with smooth animations.

```tsx
import { Accordion } from '@/shared/components/Accordion';

<Accordion
  title="Visual Inspection"
  description="Upload images for AI analysis"
  badge="Step 1"
  variant="highlighted"
  defaultOpen
>
  <p>Content goes here...</p>
</Accordion>
```

### Badge

Small status indicators and labels.

```tsx
import { Badge } from '@/shared/components/Badge';

<Badge variant="success">Passed</Badge>
<Badge variant="warning">Review</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">Info</Badge>

// With dot indicator
<Badge variant="success" dot>Active</Badge>

// With icon
<Badge icon={<CheckIcon className="w-3 h-3" />}>
  Verified
</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Loader

Loading indicators with multiple styles.

```tsx
import { Loader, Skeleton } from '@/shared/components/Loader';

// Spinner
<Loader variant="spinner" size="md" />
<Loader variant="spinner" text="Loading..." />

// Dots
<Loader variant="dots" color="primary" />

// Pulse
<Loader variant="pulse" size="lg" />

// Skeleton loaders
<Skeleton variant="text" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width="100%" height={200} />
```

### FileUpload

Drag-and-drop file upload with validation.

```tsx
import { FileUpload } from '@/shared/components/FileUpload';

<FileUpload
  onFilesSelected={(files) => handleFiles(files)}
  accept="image/*"
  multiple
  maxSize={5 * 1024 * 1024} // 5MB
  description="PNG, JPG, JPEG"
/>
```

### Toast

Notification system for user feedback.

```tsx
import { Toast, ToastContainer } from '@/shared/components/Toast';

// Single toast
<Toast
  type="success"
  title="Success!"
  message="Your assessment has been saved."
  duration={5000}
  onClose={() => handleClose()}
/>

// With action
<Toast
  type="info"
  title="Update Available"
  message="A new version is ready."
  action={{
    label: "Update Now",
    onClick: () => update()
  }}
/>

// Toast container
<ToastContainer
  toasts={toastList}
  position="top-right"
/>
```

---

## Animations

### Built-in Animations

```tsx
// Fade
<div className="animate-fade-in">Fades in</div>

// Slide
<div className="animate-slide-in-bottom">Slides from bottom</div>
<div className="animate-slide-in-top">Slides from top</div>
<div className="animate-slide-in-left">Slides from left</div>
<div className="animate-slide-in-right">Slides from right</div>

// Scale
<div className="animate-scale-in">Scales in</div>

// Utility animations
<div className="animate-pulse">Pulsing</div>
<div className="animate-spin">Spinning</div>
<div className="animate-bounce">Bouncing</div>

// Shimmer effect (for loading states)
<div className="shimmer bg-gray-200">Loading...</div>

// Float effect
<div className="float">Floating element</div>
```

### Transition Utilities

```tsx
// Duration
<div className="transition-all duration-fastest">100ms</div>
<div className="transition-all duration-fast">200ms</div>
<div className="transition-all duration-300">300ms (default)</div>
<div className="transition-all duration-slow">400ms</div>

// Easing
<div className="transition-smooth">Smooth cubic-bezier</div>
<div className="transition-bounce">Bounce effect</div>
<div className="ease-in-out">Standard easing</div>
```

---

## Accessibility

### Focus States

All interactive elements have visible focus indicators:

```tsx
// Automatic focus ring on all components
<Button>Accessible button</Button>

// Custom focus
<div className="focus:ring-2 focus:ring-accent-primary">...</div>
```

### ARIA Attributes

Components include proper ARIA attributes:

```tsx
<Input
  label="Email"
  error="Invalid email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
```

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Logical tab order maintained
- Escape key closes modals and dropdowns
- Enter/Space activates buttons

### Screen Reader Support

- Semantic HTML elements used throughout
- Descriptive labels on all inputs
- Status messages announced properly
- Loading states communicated

---

## Dark Mode

Dark mode is fully supported throughout the design system.

### Implementation

```tsx
// Using ThemeProvider
import { ThemeProvider } from '@/shared/theme/ThemeProvider';

<ThemeProvider>
  <App />
</ThemeProvider>

// Theme toggle
import { ThemeToggle } from '@/shared/components/ThemeToggle';

<ThemeToggle />
```

### Usage in Components

```tsx
// Tailwind dark mode classes
<div className="bg-white dark:bg-brand-steel-900">
  <p className="text-gray-900 dark:text-white">
    Adapts to theme
  </p>
</div>
```

### Color Considerations

- All color combinations meet WCAG contrast requirements in both modes
- Shadows are adjusted for dark backgrounds
- Borders use appropriate opacity

---

## Best Practices

### Color Usage

1. **Use semantic colors** for states: success (green), warning (amber), error (red), info (blue)
2. **Primary accent** (green) for main CTAs and positive actions
3. **Brand navy** for headers and important UI elements
4. **Neutral grays** for backgrounds and secondary content

### Typography

1. **Headings**: Use `font-display` with `font-semibold` or `font-bold`
2. **Body text**: Use `font-sans` with `font-normal`
3. **Hierarchy**: Maintain clear size differences between heading levels
4. **Line length**: Keep text columns between 45-75 characters for readability

### Spacing

1. **Consistent gaps**: Use the spacing scale (4px base unit)
2. **Breathing room**: Add adequate padding to interactive elements
3. **Visual hierarchy**: Use spacing to group related elements

### Components

1. **Composition over props**: Compose smaller components rather than adding many props
2. **Accessibility**: Always include proper labels and ARIA attributes
3. **Responsive**: Test on mobile, tablet, and desktop
4. **Performance**: Avoid unnecessary re-renders

### Animations

1. **Purposeful motion**: Animate to guide attention or provide feedback
2. **Performance**: Use transform and opacity only when possible
3. **Respect preferences**: Honor `prefers-reduced-motion`
4. **Subtle**: Keep animations under 400ms for UI feedback

### Dark Mode

1. **Test both themes**: Always verify designs in light and dark mode
2. **Semantic colors**: Use theme-aware color classes
3. **Avoid hardcoded colors**: Use Tailwind classes or design tokens

---

## Examples

### Form Layout

```tsx
<Card>
  <CardHeader title="Assessment Details" />
  <CardBody>
    <div className="space-y-4">
      <Input
        label="Element ID"
        placeholder="Enter element ID"
        required
      />
      <Input
        label="Weight (kg)"
        type="number"
        helpText="Enter the element weight"
      />
      <div className="flex gap-3">
        <Button variant="secondary" fullWidth>
          Cancel
        </Button>
        <Button variant="primary" fullWidth>
          Continue
        </Button>
      </div>
    </div>
  </CardBody>
</Card>
```

### Results Display

```tsx
<Card variant="elevated">
  <CardHeader
    title="Assessment Complete"
    subtitle="Element ID: SE-12345"
  />
  <CardBody>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span>Overall Score</span>
        <Badge variant="success" size="lg">85%</Badge>
      </div>
      <div className="text-center p-6 bg-success-bg dark:bg-success-dark-bg rounded-lg">
        <h3 className="text-2xl font-bold text-success mb-2">
          Reuse Recommended
        </h3>
        <p className="text-sm text-success-dark dark:text-success-light">
          This element is suitable for reuse
        </p>
      </div>
    </div>
  </CardBody>
  <CardFooter>
    <Button variant="primary" fullWidth>
      Download Report
    </Button>
  </CardFooter>
</Card>
```

---

## Getting Started

### Installation

The design system is already integrated into the ReuST application. Simply import and use components:

```tsx
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Card } from '@/shared/components/Card';
```

### Extending

To add new components:

1. Create component in `src/shared/components/`
2. Use design tokens from `designTokens.ts`
3. Follow Tailwind CSS classes
4. Ensure accessibility (ARIA, keyboard navigation)
5. Support dark mode
6. Add TypeScript types
7. Document usage

---

## Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Heroicons**: https://heroicons.com/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

## Support

For questions or issues with the design system, please refer to the component files or consult the development team.

**Version**: 1.0.0
**Last Updated**: January 2026
