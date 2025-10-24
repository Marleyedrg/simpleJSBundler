# simpleJSBundler

A simple project built to deepen understanding of how JavaScript module bundlers work under the hood.
 
### 1. Clone the repository

```bash
git clone git@github.com:Marleyedrg/simpleJSBundler.git
````

### 2. Navigate into the project folder

```bash
cd simpleJSBundler
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create your JavaScript files

Add your `.js` files inside the `/src` directory.

### 5. Build the bundle

```bash
node bundler/builder.js
```

This will generate a bundled file in the `/dist` directory.

### 6. Run the bundled file

```bash
node dist/bundler.js
```

---

## Result

If everything runs successfully, you’ll get your entire project (including all `import`, `export`, and `require` statements) packed together into a single JavaScript file — your custom-built bundler!

---

## Purpose

This project is for learning and experimenting with the internal mechanics of JS bundlers — such as dependency graphs, module resolution, and code transformation — without relying on tools like Webpack, Rollup, or Parcel.


