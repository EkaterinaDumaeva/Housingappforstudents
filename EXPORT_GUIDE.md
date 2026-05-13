# Export Guide: Figma Make to Replit

This guide will help you transfer your Figma Make project to Replit.

## 📦 What You Need to Export

### 1. Core Application Files

#### `/src/app/` - Main Application
- `App.tsx` - Main app component
- All component files in `/src/app/components/`

#### `/src/styles/` - Styling
- `index.css`
- `fonts.css`
- `tailwind.css`
- `globals.css`
- `theme.css`

#### `/src/imports/` - Assets
- `1EB48CAB-5628-444E-A391-54A14BEAABAF.png`
- `80E81ED4-EC98-4911-B292-4DF2971664A3.png`
- `9FE3D119-9851-42D8-BE0E-ACDA58186D5D.png`

#### `/utils/` - Utility files
- Copy the entire utils folder

#### `/supabase/` - Backend (if using)
- Copy the entire supabase folder if you're using backend features

### 2. Configuration Files

Create these files in your Replit project root:

#### `package.json`
```json
{
  "name": "my-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.1",
    "@mui/icons-material": "7.3.5",
    "@mui/material": "7.3.5",
    "@popperjs/core": "2.11.8",
    "@radix-ui/react-accordion": "1.2.3",
    "@radix-ui/react-alert-dialog": "1.1.6",
    "@radix-ui/react-aspect-ratio": "1.1.2",
    "@radix-ui/react-avatar": "1.1.3",
    "@radix-ui/react-checkbox": "1.1.4",
    "@radix-ui/react-collapsible": "1.1.3",
    "@radix-ui/react-context-menu": "2.2.6",
    "@radix-ui/react-dialog": "1.1.6",
    "@radix-ui/react-dropdown-menu": "2.1.6",
    "@radix-ui/react-hover-card": "1.1.6",
    "@radix-ui/react-label": "2.1.2",
    "@radix-ui/react-menubar": "1.1.6",
    "@radix-ui/react-navigation-menu": "1.2.5",
    "@radix-ui/react-popover": "1.1.6",
    "@radix-ui/react-progress": "1.1.2",
    "@radix-ui/react-radio-group": "1.2.3",
    "@radix-ui/react-scroll-area": "1.2.3",
    "@radix-ui/react-select": "2.1.6",
    "@radix-ui/react-separator": "1.1.2",
    "@radix-ui/react-slider": "1.2.3",
    "@radix-ui/react-slot": "1.1.2",
    "@radix-ui/react-switch": "1.1.3",
    "@radix-ui/react-tabs": "1.1.3",
    "@radix-ui/react-toggle": "1.1.2",
    "@radix-ui/react-toggle-group": "1.1.2",
    "@radix-ui/react-tooltip": "1.1.8",
    "@supabase/supabase-js": "^2.105.4",
    "canvas-confetti": "1.9.4",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cmdk": "1.1.1",
    "date-fns": "3.6.0",
    "embla-carousel-react": "8.6.0",
    "input-otp": "1.4.2",
    "lucide-react": "0.487.0",
    "motion": "12.23.24",
    "next-themes": "0.4.6",
    "react": "18.3.1",
    "react-day-picker": "8.10.1",
    "react-dnd": "16.0.1",
    "react-dnd-html5-backend": "16.0.1",
    "react-dom": "18.3.1",
    "react-hook-form": "7.55.0",
    "react-popper": "2.3.0",
    "react-resizable-panels": "2.1.7",
    "react-responsive-masonry": "2.7.1",
    "react-router": "7.13.0",
    "react-slick": "0.31.0",
    "recharts": "2.15.2",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0",
    "tw-animate-css": "1.3.8",
    "vaul": "1.1.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "typescript": "^5.5.3",
    "vite": "6.3.5"
  }
}
```

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
```

#### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### `src/main.tsx`
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### `tsconfig.node.json`
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## 🚀 Step-by-Step Transfer Process

### Step 1: Create a New Replit Project
1. Go to [replit.com](https://replit.com)
2. Click "Create Repl"
3. Choose "React TypeScript" template
4. Name your project

### Step 2: Copy Files from Figma Make

#### Copy src folder structure:
```
src/
├── app/
│   ├── App.tsx
│   └── components/
│       ├── (all component files)
│       └── ui/
│           └── (all UI component files)
├── imports/
│   └── (all image files)
├── styles/
│   ├── index.css
│   ├── fonts.css
│   ├── tailwind.css
│   ├── globals.css
│   └── theme.css
└── main.tsx (create new)
```

#### Copy root files:
- Create `index.html` in root
- Copy `vite.config.ts`
- Copy/create `package.json`
- Copy/create `tsconfig.json` and `tsconfig.node.json`
- Copy `utils/` folder (if exists)
- Copy `supabase/` folder (if using backend)

### Step 3: Install Dependencies
In Replit's shell, run:
```bash
npm install
```

### Step 4: Start Development Server
```bash
npm run dev
```

## 📝 Important Notes

### File Import Adjustments
You may need to adjust some imports:
- **Figma asset imports**: If you see `import img from "figma:asset/..."`, replace with regular relative paths to your `/src/imports/` folder
- Example: `import img from "../imports/IMAGE_NAME.png"`

### Component Imports
Make sure all component imports use the correct paths:
```typescript
// Good
import { Button } from './components/ui/button'
import { AuthModal } from './components/AuthModal'

// Adjust if needed based on file location
```

### Environment Variables
If your app uses Supabase or other services:
1. Create a `.env` file in Replit
2. Add your environment variables:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## ✅ Verification Checklist

After copying everything:
- [ ] All files from `/src/app/` copied
- [ ] All files from `/src/styles/` copied
- [ ] All image assets copied to `/src/imports/`
- [ ] `package.json` created with all dependencies
- [ ] `vite.config.ts` copied
- [ ] `tsconfig.json` created
- [ ] `index.html` created in root
- [ ] `src/main.tsx` created
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] App renders correctly in browser

## 🐛 Common Issues

### Issue: "Cannot find module '@/...'"
**Solution**: Make sure `tsconfig.json` has the paths alias configured and `vite.config.ts` has the alias resolver.

### Issue: "figma:asset not found"
**Solution**: Replace `figma:asset/...` imports with relative paths to your actual image files in `/src/imports/`.

### Issue: Missing dependencies
**Solution**: Run `npm install` again. Check for any error messages and install missing packages individually.

### Issue: Tailwind styles not working
**Solution**: Make sure you have:
1. `@tailwindcss/vite` plugin in vite.config.ts
2. All CSS files imported in the correct order in `src/main.tsx` or `src/styles/index.css`

## 📞 Need Help?

If you encounter issues during the export:
1. Check the browser console for error messages
2. Check the Replit shell for build errors
3. Verify all file paths are correct
4. Make sure all dependencies are installed

---

**Good luck with your migration! 🎉**
