import { sayName } from "./file2";
import { greet } from "./file1";

import foo from "./foo";
import { foo, bar } from "./foo";

import * as utils from "./utils";

import foo2, { bar } from "./foo";

import "./setup";

// WRONG — doesn't exist
import { something } from "./does-not-exist";

// WRONG — wrong path
import { Button } from "./components/Buttons";

function sayHello(name: string, age: number): void {
    console.log(`Hello, ${name}!`);
}

export function greet() {}

export const name = "Abu";

export default function main() {}

export { greet };