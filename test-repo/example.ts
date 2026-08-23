
import { sayName }  from './file2'
import { greet } from './file1'


const greeting = greet('Hello, World!')
console.log(greeting)


function sayHello(name : string): void{
    console.log(`Hello, ${name}!`);
}