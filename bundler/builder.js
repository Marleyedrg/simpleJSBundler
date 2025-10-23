import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

import { transformFromAst } from 'babel-core';

let ID = 0;

const srcPath = path.join(__dirname, '../src');

function createAsset(filename) {

  let filePath = (path.join(srcPath, filename));

  let content;
  
  try {
    //Reads the contents of the file and saves it to a variable as a string.
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      filename = filename + '.js'
      filePath = filePath + '.js';
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      throw err;
    }
  }

   //transforming our code into an Abstract Syntax Tree (AST).
  const ast = parser.parse(content, {
    sourceType: 'module',
  });

  const dependencies = [];

 //Searching the AST for dependencies.
  traverse.default(ast, {
    ImportDeclaration: ({node}) => {
      dependencies.push(node.source.value);
    },
  });

  const id = ID++;
  //Transpilation to maintain compatibility.

  const {code} = transformFromAst(ast, null, {
    presets: ['env'],
    // is a popular bundle of rules that converts modern Js into an older version (ES5) 
  });

  return {
    id,
    filename,
    dependencies,
    code,
  };
}

function createGraph(entry) {
  //Entry file.
  const mainAsset = createAsset(entry);
  //Queue init.
  const queue = [mainAsset];

  for (const asset of queue) {
    //Creation of mapping to track dependecies.
    asset.mapping = {};

    const dirname = path.dirname(asset.filename);
  
    //Creating absolute paths.
    asset.dependencies.map(relativePath => {
            
      const absolutePath = path.join(dirname, relativePath);
      
      const child = createAsset(absolutePath);
      
      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
    
  }
  return queue;
}

const filesSrc = fs.readdirSync(srcPath).filter(item => {

  const fullPath = path.join(srcPath, item);
  

  return fs.statSync(fullPath).isFile(); // only files
});

//console.log(createGraph('index'));
console.log(filesSrc);

for (let f of filesSrc){
  
  console.log(createGraph(f))

}


