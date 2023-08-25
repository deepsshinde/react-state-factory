# SWC Compiler for react18 TS npm module.

## .swcrc

```json
"$schema": "https://json.schemastore.org/swc",
"jsc": {
  "parser": {
    "syntax": "typescript",
    "tsx": true,
    "dynamicImport": false,
    "decorators": false
  },
  "target": "es2020",
  "loose": false,
  "externalHelpers": false
},
"minify": true
}
```

## package.json
```json
{
  "main": "build/index.js",
  "types": "build/src/-entry-declaration-.d.ts",
  "files": ["build"],
  "scripts": {
    "start": "webpack-dev-server --port 3000 --mode development",
    "build": "webpack --mode production && npx -p typescript tsc",
    "prepublishOnly": "npm run build"
  },
  "devDependencies": {
    "@swc/cli": "^0.1.57",
    "@swc/core": "^1.3.0",
    "swc-loader": "^0.2.3",
    "typescript": "^4.10.0",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.11.0",
    "css-loader": "^3.3.1",
    "html-loader": "^4.1.0",
    "style-loader": "^3.3.1",
    "sass": "^1.54.9",
    "sass-loader": "^13.0.2",
  }
}
```

## webpack.config.js

```js
const path = require("path");

const buildConfig = (env, argv) => ({
  mode: argv.mode,  
  entry: (argv.mode === 'development') 
    ? './src/index.dev.js'
    : './src/DocLocator.js',
  output: (argv.mode === 'development')
    ? {
        clean: true,
        path: path.resolve(__dirname, 'dev'),
        filename: 'index.js',
      }
    : {
        clean: true,
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
      },
  module: {
    rules: [
      { test: /\.(js|jsx|ts|tsx)$/, include: path.resolve(__dirname, 'src'), exclude: /node_modules/, use: {loader: "swc-loader"} },
      { test: /\.(css|scss)$/, use: ["style-loader", "css-loader", "sass-loader"] },
      { test: /\.html$/, use: "html-loader" },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, './'),
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
    fallback: { "stream": require.resolve("stream-browserify") },
  },
  devServer: {
    allowedHosts: 'all',
  },
  externals: (argv.mode === 'development')
    ? {} 
    : {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
        umd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
        umd: 'react-dom',
      },
    },
});

module.exports = buildConfig;
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "CommonJS",
    "jsx": "preserve",
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "emitDeclarationOnly": true,
    "baseUrl": "./",
    "outDir": "./build"
  }
}
```