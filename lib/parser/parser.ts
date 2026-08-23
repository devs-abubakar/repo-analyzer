import fs from 'node:fs/promises';
import ts from 'typescript';
import path from 'node:path';
import { ImportInfo, FunctionInfo, ParsedFile, FileInfo,  } from '../models/models';





export async function parseFile(fileInfo: FileInfo): Promise<ParsedFile> {

    console.log("entered the parseFile function with fileInfo:", fileInfo)

    const imports : ImportInfo[] = []
    
    const functions : FunctionInfo[] = []

    const code = await fs.readFile(fileInfo.path, 'utf-8')

    const filePath = fileInfo.path

    const sourceFile = ts.createSourceFile(path.basename(filePath), code, ts.ScriptTarget.Latest, true);

    function visit(node: ts.Node) {
    
        if (ts.isImportDeclaration(node)) {

            const bindings = node.importClause?.namedBindings

            const importDetails = {
                source: (node.moduleSpecifier as ts.StringLiteral).text,
                importedNames: bindings?.elements.map(e => e.name.text) || [],
                isDefault: node.importClause?.name ? true : false,
                isNamespace: node.importClause?.namedBindings && ts.isNamespaceImport(node.importClause.namedBindings) ? true : false
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
    return {
        file: fileInfo,
        functions,
        imports
    }
}
