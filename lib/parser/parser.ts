import fs from 'node:fs/promises';
import ts, { isNamespaceImport } from 'typescript';
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

            const importedNames = importVerifier(node)

            const importDetails = {
                source: (node.moduleSpecifier as ts.StringLiteral).text,
                importedNames: importedNames,
                isDefault: node.importClause?.name ? true : false,
                isNamespace: node.importClause?.namedBindings && ts.isNamespaceImport(node.importClause.namedBindings) ? true : false
            }   
            imports.push(importDetails)
        }

        if (ts.isFunctionDeclaration(node)) {
            const functionDetails: FunctionInfo = {
                name: node.name?.text || 'anonymous',
                parameters: node.parameters.map(param => param.name.getText()),
                async: node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.AsyncKeyword) || false,
                exported: node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword) || false,
                location: `${fileInfo.path}:${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1}`
            };
            functions.push(functionDetails);
        }

        if (ts.isExportDeclaration(node)){
            console.log("exports through destructering are: ",exportVerifier(node))
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
async function testParseFile() {
    const result = await parseFile({
        path: 'test-repo/example.ts',
        extension: '.ts',
        size: 1234,
        name: 'example.ts'
})

}

testParseFile()


function importVerifier(node: ts.ImportDeclaration): string[]{
    
    const importClause = node.importClause;

    if (!importClause){
        return []
    }

    const bindings = importClause?.namedBindings

    if (bindings && ts.isNamedImports(bindings)) {
        return bindings.elements.map(element => element.name.text);
    }

    if (bindings && ts.isNamespaceImport(bindings)) {
        return [bindings.name.text];
    }

    if (importClause?.name) {
        return [importClause?.name?.text];
    }

    return [];
}

function exportVerifier(node: ts.ExportDeclaration): string[]{
    
    const exportClause = node.exportClause
    
    if (exportClause && ts.isExportDeclaration){
        return exportClause?.elements?.map(element => element?.name.text)
    }
    return []
}