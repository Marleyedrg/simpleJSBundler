const fs = require('fs');
const path = require('path');

const {parse} = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const {transformFromAst} = require('babel-core');

let ID = 0;

function createAsset(filename) {

  filePath = (path.join('src', filename)); 

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
  const ast = parse(content, {
    sourceType: 'module',
  });

  const dependencies = [];

 //Searching the AST for dependencies.
  traverse(ast, {
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


// console.log(createAsset('a'));

console.log(createGraph('index'));



