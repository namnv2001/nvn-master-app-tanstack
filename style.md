# Style Guide

This document outlines common style rules and patterns used throughout the application. Use this as a reference when implementing new components.

## Color System

### Color Palette

The application uses a small set of semantic CSS variables defined in `styles.css` to drive the color system.

#### Core Colors

- `--primary`: `#27548A` – primary brand color for links, highlights, and key actions
- `--secondary`: `#F0E4D3` – secondary surface and accent color
- `--background`: `#FDFAF6` – main page background
- `--foreground`: `#222831` – main text color

#### Semantic Colors

- `--muted`: `#FDFAF6BF` – subtle background elements (75% of background)
- `--muted-foreground`: `#222831BF` – muted text (75% of foreground)
- `--link`: `var(--primary)` – link color
- `--border`: `var(--secondary)` – default border color

### CSS Variables

The application uses CSS variables defined in `styles.css` for consistent theming. Colors are defined as hex values and exposed via semantic tokens.

#### Light Mode Colors

- `--background`: Main background color
- `--foreground`: Main text color
- `--primary`: Primary brand color
- `--secondary`: Secondary color and borders
- `--muted`: Muted/subtle backgrounds
- `--muted-foreground`: Muted text color
- `--link`: Link color
- `--border`: Border color

#### Dark Mode

All core color variables have corresponding values defined inside the `.dark` class, so using semantic tokens (like `bg-background`, `text-foreground`, `text-link`) automatically adapts to dark mode. (inferred)

### Usage in Tailwind

Colors are accessible via Tailwind classes:

- `bg-background`, `text-foreground`
- `bg-primary`
- `bg-secondary`
- `bg-muted`, `text-muted-foreground`
- `border-border`
- `ring-ring`
- `text-link`

## Typography

### Font Families

- **Body**: System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`)
- **Code**: Monospace stack (`source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`)

### Font Smoothing

- `-webkit-font-smoothing: antialiased`
- `-moz-osx-font-smoothing: grayscale`

### Heading Sizes

- `h1`: `text-4xl md:text-5xl font-bold tracking-tight`
- `h2`: `text-3xl font-bold`
- `h3`: `text-2xl font-bold`
- `h4`: `text-xl font-bold`
- `h5`: `text-lg font-bold`
- `h6`: `text-base font-bold`

### Body Text

- Regular: `text-foreground`
- Muted: `text-muted-foreground`
- Leading: `leading-8` for paragraphs, `leading-7` for list items, `leading-relaxed` for summaries

## Spacing

### Common Spacing Patterns

- Container padding: `px-4 py-8 md:py-12`
- Section spacing: `mb-8`, `mb-12`
- Element gaps: `gap-2`, `gap-4`, `gap-6`
- Card padding: `px-6 py-6`
- List spacing: `space-y-2`, `mb-6`

### Responsive Spacing

- Use `md:` prefix for medium breakpoint adjustments
- Example: `py-8 md:py-12`

## Border Radius

### Radius Variables

- `--radius`: Base radius (0.625rem)
- `--radius-sm`: `calc(var(--radius) - 4px)`
- `--radius-md`: `calc(var(--radius) - 2px)`
- `--radius-lg`: `var(--radius)`
- `--radius-xl`: `calc(var(--radius) + 4px)`

### Common Usage

- Cards: `rounded-3xl` (base), `rounded-xl` (alternative)
- Buttons/Badges: `rounded-full` or `rounded-lg`
- Images: `rounded-xl` or `rounded-2xl`
- Code blocks: `rounded-xl`

## Component Patterns

### Cards

Base card pattern:

```tsx
className =
  'bg-card text-card-foreground flex flex-col gap-6 rounded-3xl border py-6 shadow-sm'
```

Interactive card patterns:

- Hover effects: `hover:shadow-lg hover:-translate-y-1 transition-all duration-300`
- Border transitions: `border-border/50 hover:border-border`
- Full height: `h-full` for equal-height cards in grids
- Overflow: `overflow-hidden` for contained content

### Badges

- Base: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold`
- Variants: `default`, `secondary`, `outline`
- Always include: `transition-colors`

### Buttons

- Base: Include hover states and transitions
- Example: `hover:bg-gray-700 rounded-lg transition-colors`
- Focus: `focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`

### Links

- Default: `text-link hover:underline underline-offset-4`
- Navigation: `text-muted-foreground hover:text-foreground transition-colors`

### Images

- Full width: `w-full h-auto`
- Cover: `w-full h-full object-cover`
- Container: `rounded-xl overflow-hidden`
- Aspect ratio: `aspect-video` for 16:9 ratio
- Hover effects: `group-hover:scale-105 transition-transform duration-300`
- Gradient overlays: `bg-gradient-to-t from-black/60 via-black/0 to-black/0` with `absolute inset-0`

## Layout Patterns

### Container

- Max width: `max-w-4xl mx-auto` (content), `max-w-5xl mx-auto` (wider content)
- Padding: `px-4` or `px-6`

### Flexbox

- Common: `flex items-center gap-4`
- Wrap: `flex flex-wrap items-center gap-4`
- Column: `flex flex-col gap-4`

### Grid

Common grid patterns:

- Responsive columns: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8`
- Auto rows: `grid auto-rows-min grid-rows-[auto_auto]`
- Grid positioning: `col-start-2 row-span-2 row-start-1 self-start justify-self-end`
- Container queries: `@container/card-header` for responsive grids
- Conditional grid columns: `has-data-[slot=card-action]:grid-cols-[1fr_auto]`

## Dark Mode

### Implementation

- Uses `@custom-variant dark (&:is(.dark *))`
- Apply dark mode classes: `dark:prose-invert`, `dark:bg-*`, etc.
- All color variables automatically switch in dark mode

## Markdown/Content Styling

### Prose Classes

- Container: `prose prose-lg dark:prose-invert max-w-none`

### Custom Markdown Components

- **Headings**: Use semantic sizes with appropriate margins (`mt-12 mb-6 first:mt-0` for h1)
- **Paragraphs**: `mb-6 leading-8 text-foreground`
- **Lists**: `list-disc list-outside mb-6 space-y-2 ml-6`
- **Blockquotes**: `border-l-4 border-primary pl-6 italic my-6 text-muted-foreground bg-muted/50 py-4 rounded-r-lg`
- **Code (inline)**: `bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground`
- **Code (block)**: `bg-muted p-6 rounded-xl my-6 overflow-x-auto border border-border`
- **Links**: `text-link hover:underline underline-offset-4`
- **Tables**: Wrapped in `overflow-x-auto`, with `border-collapse border border-border`
- **Table rows**: `border-b border-border hover:bg-muted/50 transition-colors`

## Transitions

### Common Patterns

- Colors: `transition-colors`
- Transforms: `transition-transform duration-300`
- All properties: `transition-all duration-300`
- Opacity: `transition-opacity duration-300`
- Always include transitions for interactive elements

### Group Hover Patterns

When using `group` class on parent, child elements can respond:

- Text color: `group-hover:text-primary`
- Scale: `group-hover:scale-105`
- Opacity: `group-hover:opacity-100` (with initial `opacity-0`)

## Shadows

### Usage

- Cards: `shadow-sm` (base), `hover:shadow-lg` (interactive)
- Sidebar/Modals: `shadow-2xl`
- Headers: `shadow-lg`

## Utilities

### Common Utility Classes

- `cn()`: Use for conditional class merging (from `@/lib/utils`)
- `data-slot`: Used for component identification and styling
- Focus states: Always include accessible focus indicators
- Line clamping: `line-clamp-2`, `line-clamp-3` for text truncation
- Negative margins: `-mx-4`, `-my-4` for overlapping elements
- Color opacity: `border-border/50` for semi-transparent borders
- Arbitrary selectors: `[.border-b]:pb-6`, `[.border-t]:pt-6` for conditional styling

## Best Practices

1. **Always use semantic color variables** instead of hardcoded colors
2. **Include transitions** for interactive elements
3. **Use responsive classes** with `md:` prefix for breakpoints
4. **Maintain consistent spacing** using the spacing scale
5. **Support dark mode** by using color variables that automatically adapt
6. **Use `cn()` utility** for conditional classes
7. **Include hover states** for interactive elements
8. **Maintain accessibility** with proper focus states and ARIA labels
