
import { sayName }  from './file2'
import { greet } from './file1'
import foo from "./foo";

import { foo, bar } from "./foo";

import * as utils from "./utils";

import foo, { bar } from "./foo";

import "./setup";

const greeting = greet('Hello, World!')
console.log(greeting)


function sayHello(name : string, age: number): void{
    console.log(`Hello, ${name}!, You are ${age} years old.`);
}

export function greet() {}

export const name = "Abu";

export class User {}

export default function main() {}

export { greet };

export { foo } from "./foo";

export * from "./utils";