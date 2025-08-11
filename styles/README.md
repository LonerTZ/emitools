# CSS Structure Documentation

This directory contains all the CSS files for the EMI Calculator project, organized for maximum maintainability and reusability.

## File Structure

```
styles/
├── index.css          # Main entry point - imports all stylesheets
├── main.css           # Base styles, variables, and core layout
├── components.css     # Component-specific styles
├── test.css          # Test page specific styles
└── README.md         # This documentation file
```

## CSS Architecture

### 1. **index.css** - Main Entry Point
- Imports all other stylesheets in the correct order
- Provides a single point of entry for all styles
- Allows for easy global overrides

### 2. **main.css** - Base Styles
- CSS custom properties (variables)
- Base body and layout styles
- Card component base styles
- Animation keyframes
- Utility classes

### 3. **components.css** - Component Styles
- Header components
- Form elements and validation
- Button styles
- Result cards
- Progress bars
- Table components
- Alert components
- Responsive utilities

### 4. **test.css** - Test Page Styles
- Specific styling for the test page
- Independent of main calculator styles
- Focused on testing functionality

## CSS Variables

The project uses CSS custom properties for consistent theming:

```css
:root {
    --primary-color: #6366f1;      /* Main brand color */
    --secondary-color: #8b5cf6;    /* Secondary brand color */
    --success-color: #10b981;      /* Success states */
    --warning-color: #f59e0b;      /* Warning states */
    --danger-color: #ef4444;       /* Error states */
    --dark-color: #1f2937;         /* Dark text */
    --light-color: #f8fafc;        /* Light backgrounds */
}
```

## Component Classes

### Form Components
- `.form-section` - Wrapper for form sections
- `.form-row` - Grid layout for form fields
- `.form-group` - Individual form field wrapper
- `.form-label` - Form field labels
- `.form-control` - Input fields
- `.form-select` - Select dropdowns
- `.form-text` - Helper text below inputs

### Button Components
- `.btn-calculate` - Primary action button
- `.btn-reset` - Secondary action button
- `.btn-demo` - Demo page specific button
- `.btn-group-custom` - Button group container

### Card Components
- `.calculator-card` - Main calculator container
- `.demo-card` - Demo page cards
- `.result-card` - Result display cards
- `.example-card` - Example showcase cards

### Table Components
- `.table-container` - Table wrapper
- `.table-header` - Table header section
- `.table-title` - Table title
- `.table-actions` - Action buttons in table header

## Responsive Design

The CSS uses a mobile-first approach with breakpoints:

- **Default**: Mobile styles (up to 768px)
- **768px+**: Tablet and desktop styles
- **Grid layouts**: Automatically adjust columns based on screen size

## Best Practices

### 1. **Modularity**
- Each component has its own CSS section
- Styles are grouped by functionality
- Easy to find and modify specific components

### 2. **Maintainability**
- CSS variables for consistent theming
- Clear naming conventions
- Logical organization of styles

### 3. **Performance**
- Minimal CSS duplication
- Efficient selectors
- Optimized media queries

### 4. **Accessibility**
- High contrast color combinations
- Focus states for interactive elements
- Semantic HTML support

## Adding New Styles

### For New Components
1. Add styles to `components.css`
2. Use existing CSS variables for colors
3. Follow the established naming conventions
4. Include responsive behavior

### For New Pages
1. Create a new CSS file if needed
2. Import it in `index.css`
3. Use consistent styling patterns

### For Global Changes
1. Modify CSS variables in `main.css`
2. Update component styles as needed
3. Test across all pages

## Browser Support

- **Modern browsers**: Full support
- **CSS Grid**: IE11+ with fallbacks
- **CSS Variables**: IE11+ with fallbacks
- **Backdrop Filter**: Modern browsers only

## Troubleshooting

### Common Issues
1. **Styles not loading**: Check file paths in HTML
2. **CSS conflicts**: Verify import order in `index.css`
3. **Responsive issues**: Check media query breakpoints
4. **Variable issues**: Ensure CSS variables are defined

### Debugging
1. Use browser dev tools to inspect elements
2. Check CSS cascade and specificity
3. Verify CSS file loading in Network tab
4. Test responsive behavior at different screen sizes

## Future Enhancements

- [ ] CSS-in-JS implementation
- [ ] PostCSS processing
- [ ] CSS modules
- [ ] Design system documentation
- [ ] Component library
- [ ] Theme switching capability
