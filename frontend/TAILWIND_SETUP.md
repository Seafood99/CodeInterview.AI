# Tailwind CSS Setup

## Overview
This project has been configured with Tailwind CSS for styling.

## Installation
Tailwind CSS has been installed as a development dependency:
```bash
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
```

## Configuration Files

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### postcss.config.js
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom CSS here */
```

## Usage
You can now use Tailwind CSS classes in your React components:

```tsx
function MyComponent() {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">Hello Tailwind!</h1>
      <p className="text-lg">This is styled with Tailwind CSS</p>
    </div>
  );
}
```

## Development
To start the development server:
```bash
npm start
```

The Tailwind CSS classes will be automatically processed and available in your components.

## Building for Production
When you build the project with `npm run build`, Tailwind CSS will automatically purge unused styles to create an optimized CSS bundle.

