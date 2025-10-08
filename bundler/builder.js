const fs = require('fs');
const path = require('path');

const {parse} = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const {transformFromAst} = require('babel-core');

let ID = 0;

function createAsset(filename) {
  filename = path.join(__dirname, filename);

  //Reads the contents of the file and saves it to a variable as a string.
  const content = fs.readFileSync(filename, 'utf-8');

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


console.log(createAsset('a.js'));

