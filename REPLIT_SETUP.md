# Quick Replit Setup Guide

## Files You Must Create in Replit

### 1. `index.html` (in root directory)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>J1 Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 2. `src/main.tsx` (create new file)
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

### 3. `tsconfig.json` (in root directory)
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

### 4. `tsconfig.node.json` (in root directory)
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

## Folders to Copy (with all contents)

1. **Copy entire `src/app/` folder** → Replit `src/app/`
2. **Copy entire `src/styles/` folder** → Replit `src/styles/`
3. **Copy entire `src/imports/` folder** → Replit `src/imports/`
4. **Copy entire `utils/` folder** → Replit `utils/`
5. **Copy `vite.config.ts`** → Replit root
6. **Copy `package.json`** → Replit root (use the one from EXPORT_GUIDE.md with react/react-dom added)

## After Copying All Files

1. Open Replit Shell
2. Run: `npm install`
3. Run: `npm run dev`
4. Your app should start!

## File Structure Should Look Like:

```
your-replit-project/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── src/
│   ├── main.tsx (NEW FILE)
│   ├── app/
│   │   ├── App.tsx
│   │   └── components/
│   ├── imports/
│   │   ├── *.png files
│   └── styles/
│       ├── index.css
│       ├── fonts.css
│       ├── tailwind.css
│       ├── globals.css
│       └── theme.css
└── utils/
    └── supabase/
```

## Quick Checklist

- [ ] Created `index.html` in root
- [ ] Created `src/main.tsx`
- [ ] Created `tsconfig.json`
- [ ] Created `tsconfig.node.json`
- [ ] Copied `vite.config.ts`
- [ ] Copied/updated `package.json`
- [ ] Copied all `src/app/` files
- [ ] Copied all `src/styles/` files
- [ ] Copied all `src/imports/` images
- [ ] Copied `utils/` folder
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] App loads successfully!
