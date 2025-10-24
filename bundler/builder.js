import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

import { transformFromAst } from 'babel-core';
const srcPath = path.join(__dirname, '../src');

let ID = 0

const MAINFILE = "main.js"

const removeModulesPlugin = () => ({
  visitor: {
    ImportDeclaration(path) {
      path.remove();
    },
  }
});

//maybe in the future :)
// const filesSrc = fs.readdirSync(srcPath).
//   filter(item => {
//     const fullPath = path.join(srcPath, item);
//     return fs.statSync(fullPath).isFile(); // only files
//   });

function createAsset(filename) {
  let filePath = (path.join(srcPath, filename));

  let content;

  try {
    //Reads the contents of the file and saves it to a variable as a string.
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      filePath = filePath + '.js';
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      throw err;
    }
  }

  //transforming code into an Abstract Syntax Tree (AST).
  const ast = parser.parse(content, {
    sourceType: 'module',
  });

  const dependencies = [];

  //Searching the AST for dependencies.
  traverse.default(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  let id = ID++;

  const { code } = transformFromAst(ast, null, {
    presets: [
      ["env", {
        modules: false
      }]
    ],
    plugins: [removeModulesPlugin]
  });

  return {
    id,
    filename,
    dependencies,
    code,
  };

}


function createGraph(entryFile) {
  const mainAsset = createAsset(entryFile);

  const queue = [mainAsset];

  const graph = new Map(); //relationGraph

  const processed = new Map(); //filename -> asset

  processed.set(mainAsset.filename, mainAsset);

  while (queue.length > 0) {
    const asset = queue.shift();

    asset.mapping = {}; // dependency -> id

    for (const ittDp of asset.dependencies) {

      let child = processed.get(ittDp);
      //dont rebuild assets, reuse it

      if (!child) {
        child = createAsset(ittDp);

        processed.set(ittDp, child);

        queue.push(child);
        /*
          Note the relationship between ittDp(like dependencieName) and child:
          ittDp: a dependency string being iterated (e.g., './sum.js')
          child: the actual asset object corresponding to that dependency path We map the dependency string to the child asset's ID
        */
      }

      asset.mapping[ittDp] = child.id;
      //bracket notation, variable object key
    }

    graph.set(asset.id, asset);
    // id -> asset
  }

  return graph;//relation graph
}

function createBundle(relGraph) {
  let str = "";

  let { code: mainCode, dependencies, mapping } = relGraph.get(0);

  let dependencyDepth = dependencies.length;

  for (let i = 0; i < dependencyDepth; i++) {
    str += relGraph.get(mapping[dependencies[i]]).code;
  }
  /*
  Dependencies, since they are organized in a queue-like order, end up being arranged in the correct declaration sequence — you’ll only need to place the main code at the end.
  */
  str += mainCode;

  str = str.replace(/export\s+/g, "");
  /*
  At the end, the functions are declared with export at the beginning — we’re going to remove that.
  */

  fs.writeFile('./dist/bundle.js', str, 'utf8', (err) => {
    if (err) throw err;
    console.log('Bundle criado com sucesso!');
  });
}
function build(file) {
  createBundle(createGraph(file));
}
// MAINFILE = "main.js" in /src/main.js 
build(MAINFILE);

//Currently, the code will only build (create bundle.js) from a single main file.
