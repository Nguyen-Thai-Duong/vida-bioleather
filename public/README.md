# Public Folder - VIDA Bioleather

This folder contains static assets that are publicly accessible.

## How to Add Your Logo

1. **Place your logo file here** (e.g., `logo.png`, `logo.svg`)
   - Recommended size: 40x40 pixels or larger
   - Supported formats: PNG, SVG, JPG

2. **Update the Header component** (`components/Header.js`):
   - Find the logo section (around line 43)
   - Replace this:
     ```jsx
     <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
         <div className="text-white font-bold text-xl">VD</div>
     </div>
     ```
   - With this:
     ```jsx
     <Image src="/logo.png" width={40} height={40} alt="VIDA Logo" />
     ```

3. **Update the Footer component** (`components/Footer.js`):
   - Find the logo section (around line 17)
   - Replace the similar div with the Image component above

4. **Make sure to import Image at the top of both files**:
   ```jsx
   import Image from 'next/image';
   ```

## Other Static Files

You can also place other static files here:
- Favicon: `favicon.ico`
- Images for products
- PDF documents
- Any other public assets

These files will be accessible at: `http://yoursite.com/filename.ext`
