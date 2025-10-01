# simpleJSBundler
project just to build understanding about module bundles in js

~~~sh
npm init -y  
~~~
That command initializes a new Node.js project in your current directory.

it create a package.json.
like a  manifest for your project.

`-y` default setup 

Normally, if you just run npm init, it will ask you a series of questions to fill out the package.json file (What is the package name? What is the version? etc.).

~~~sh
echo "console.log("hi!");" > index.js
~~~

echo is a output terminal command.

### Output Redirection
when you put `>` it get output redirection :

    - If index.js doesn't exist, it will be created.

    - If index.js already exists, overwritten.

~~~sh
echo "console.log('hi!');" > index.js && node index.js
~~~
or 
~~~sh
echo "console.log(\"hi\");" > index.js && node index.js
~~~
we can connect creation with run code itself.

Take care with " and ' because terminal commands work token by token.
So when the shell sees an opening quote ("), it treats everything as a single token until it finds the next closing quote (") of the same type.

if we do:

~~~sh
echo "console.log("hi");" > index.js && node index.js
~~~
console.log(hi);
            ^
error 

it creates the file, but it can't run, because hi is treated as variable, look the index.js information

~~~js
console.log(hi);
~~~

so lets continue with the project.

we can run js in node right now, but it's commonJS, we "can't" use modules in nodeJS:

~~~js
//module.js
export function print(message){
    let message;

    console.log(message)
}
//index.js
import {print} from module.js;

print("hi!");
~~~
Try and you will see a error 

`SyntaxError: Cannot use import statement outside a module`

## If you want use modules:
### package.json file:
~~~json
{
  //...
  "type": "module",
  //...
}
~~~

### Use the .mjs File Extension
if you don't want to change your package.json, you can simply name them with the `.mjs` extension.

Node.js will automatically treat any file ending in `.mjs `as an ES Module.

`Imports are Asynchronous: The ESM import statement is asynchronous, while the CommonJS require() is synchronous. This has performance implications, especially in large applications.`

## What the bundler do?

The bundler outputs a file (or files) in a format that is compatible with your target environment.
    
    - For web browsers, this is often a single bundled file (using a format called an `IIFE`) that can run on older browsers.

    - For Node.js, you might transpile it to `CommonJS` for compatibility with an older version.


## IIFE (Immediately Invoked Function Expression)

`self-executing anonymous function`

[self-executing anonymous function](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)

Is a JavaScript function that is created and then run immediately...

~~~js
// standard IIFE
(function () {
  // statements…
})();

// arrow function variant
(() => {
  // statements…
})();

// async IIFE
(async () => {
  // statements…
})();
~~~

It's a foundational pattern that module bundlers use to keep each of your files code separate, safe from interfering with other files code when they are all combined into a single bundle.

To create an IIFE, you define an anonymous function

`function (){}, () => {0}`

And wrapping the function definition in a pair of parentheses

`The outer parentheses turn the function keyword into a function expression.`

`( function (){} )`

followed by another pair of parentheses () at the end. 

`the final parentheses execute it right away`

`(function (){})();`

##  If the code runs at the start, how can anything happen later?

### Event-Driven Programming

Think of it this way: 

  - the flow of an interactive program `isn't a straight line from top to bottom`.

  - The system first sets up listeners and then `waits`.

  - The program only reacts when the user` triggers an event` (click, type, mouse movement).

An IIFE is like setting up a temporary, private workbench. 

##### why it do it?
  
  - scope, it's the setup phase of functions on memore.

keeping the main environment (the global scope) clean, and save the function on memore.

Then the function is stored in a hidden way, waiting to be called, until it is triggered by an event.

#### Closure
