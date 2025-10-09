# Copilot Instructions for Orioclub

## Project Overview

Orioclub is a French-language static website for an orientation and academic opportunities club (Club d'Orientation et opportunités scolaires). The site provides information about the club, its members, upcoming events, and contact details.

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES6+)
- **No build tools**: Direct file serving (static site)
- **No framework**: Pure JavaScript with DOM manipulation
- **Styling**: Custom CSS with CSS custom properties (variables)
- **Fonts**: Google Fonts (Poppins, Pacifico) and custom fonts via @font-face

## File Structure

### Core Files
- `index.html` - Main HTML structure
- `styles.css` - All styles and animations
- `script.js` - All JavaScript functionality

### Configuration Files (Plain Text Format)
- `content.txt` - Site content and customization settings (hero title, subtitle, about text, font preferences, outline styles, squiggle styles)
- `members.txt` - Club member information (Format: `Name | Role | Description | Image`)
- `events.txt` - Upcoming events (Format: `Title | Date (YYYY-MM-DD) | Location | Description | Image`)

### Assets
- `assets/` - Images, icons, fonts, and other static resources
- `assets/fonts/` - Custom font files (.woff2, .woff, .ttf)

## Code Style & Conventions

### JavaScript
- Use `async/await` for asynchronous operations
- Functions are organized within a DOMContentLoaded event listener
- Use `fetch` API for loading external files
- Prefer `const` and `let` over `var`
- Use template literals for HTML string generation
- Handle errors gracefully with try-catch blocks
- Use semantic function names (e.g., `loadContent`, `parseMembers`, `renderMembers`)

### HTML
- Semantic HTML5 elements
- Accessibility features: ARIA labels, skip links, alt text
- French language (`lang="fr"`)
- Lazy loading for images (`loading="lazy"`)

### CSS
- CSS custom properties for theming (defined in `:root`)
- BEM-like naming convention for classes (e.g., `hero__title`, `members-card__avatar`)
- Mobile-first responsive design with media queries
- Animations respect `prefers-reduced-motion` and custom `.reduce-motion` class
- Use `clamp()` for responsive sizing

## Content File Format

All configuration files use a simple pipe-delimited format:
```
# Comments start with #
key | value
field1 | field2 | field3 | field4
```

Lines starting with `#` are ignored as comments.

## Key Features

1. **Dynamic Content Loading**: Content loaded from `.txt` files via JavaScript
2. **Customizable Typography**: Support for Google Fonts and custom fonts
3. **Accessibility**: Skip links, semantic HTML, ARIA labels, reduce-motion support
4. **Responsive Design**: Mobile-first approach with grid layouts
5. **Animation Controls**: User preference for reduced motion with localStorage persistence
6. **Dynamic Sections**: Events section only appears if events exist and are in the future

## Important Guidelines

### When modifying content files:
- Maintain the pipe-delimited format
- Keep comments in French for consistency
- Preserve format documentation in comments
- Dates must follow YYYY-MM-DD format in events.txt

### When modifying JavaScript:
- Keep all functionality within the DOMContentLoaded listener
- Use `cache: 'no-cache'` for content file fetches to ensure fresh data
- Maintain error handling for missing files
- Test dynamic content loading after changes

### When modifying CSS:
- Use existing CSS custom properties when possible
- Maintain the `.reduce-motion` class behavior for accessibility
- Keep animations smooth and performant
- Test responsive behavior at different viewport sizes

### Accessibility:
- Always include alt text for images
- Maintain ARIA labels for decorative elements (`aria-hidden="true"`)
- Ensure keyboard navigation works properly
- Respect user motion preferences

## Testing

Since this is a static site with no build process:
1. Test by opening `index.html` in a browser or using a local server
2. Verify content loading from all `.txt` files
3. Test responsive design at different screen sizes
4. Verify accessibility features (keyboard navigation, screen reader compatibility)
5. Test with and without optional files (poster.jpg, custom events)
6. Verify animation toggle functionality

## Language

- All user-facing content is in **French**
- Code comments can be in English or French
- Variable names and function names in English (conventional)
- UI text strings must remain in French
