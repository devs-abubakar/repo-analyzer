import fs from 'node:fs/promises';
import ts from 'typescript';
import path from 'node:path';
import { ImportInfo, FunctionInfo } from '../models/file';

const directory = 'test-repo';

const directoryPath = path.join(process.cwd(), directory);


async function parseFile(filePath: string) {

    const imports : ImportInfo[] = []
    
    const functions : FunctionInfo[] = []

    const code = await fs.readFile(path.join(filePath, 'example.ts'), 'utf-8');

    console.log(code)

    const sourceFile = ts.createSourceFile('example.ts', code, ts.ScriptTarget.Latest, true);
    console.log(sourceFile)

    function visit(node: ts.Node) {
        console.log('Visiting node:', ts.SyntaxKind[node.kind]);
        if (ts.isImportDeclaration(node)) {
            const importDetails = {
                source: (node.moduleSpecifier as ts.StringLiteral).text,
                importedNames: node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)
                
            }
            imports.push(importDetails)
        }

        if (ts.isFunctionDeclaration(node)) {
            const functionDetails: FunctionInfo = {
                name: node.name?.text || 'anonymous'
            };
            functions.push(functionDetails);
        }

        ts.forEachChild(node,visit)
    }
    visit(sourceFile)
    console.log('Imports found:', imports);
}

parseFile(directoryPath)