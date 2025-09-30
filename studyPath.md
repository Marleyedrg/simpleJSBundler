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

### extra

we can set a variable in bash too

~~~sh
MESSAGE="console.log(\"hi\")"
~~~
important to be together `MESSAGE="hi!"`

~~~sh
echo "$MESSAGE" > index.js
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

### Your package.json file:
~~~json
{
  "name": "my-cool-app",
  "version": "1.0.0",
  "type": "module",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  }
}
~~~
### Use the .mjs File Extension
if you don't want to change your package.json, you can simply name them with the .mjs extension.

Node.js will automatically treat any file ending in .mjs as an ES Module.

`Imports are Asynchronous: The ESM import statement is asynchronous, while the CommonJS require() is synchronous. This has performance implications, especially in large applications.`

## What the bundler do?

The bundler outputs a file (or files) in a format that is compatible with your target environment.
    
    - For web browsers, this is often a single bundled file (using a format called an `IIFE`) that can run on older browsers.

    - For Node.js, you might transpile it to `CommonJS` for compatibility with an older version.


## IIFE (Immediately Invoked Function Expression)
Is a JavaScript function that is created and then run immediately...

It's a foundational pattern that module bundlers use to keep each of your files' code separate and safe from interfering with other files' code when they are all combined into a single bundle.
