import fs from 'node:fs/promises';
import ts, { isNamespaceImport } from 'typescript';
import path from 'node:path';
import { ImportInfo, ExportInfo, FunctionInfo, ParsedFile, FileInfo,  } from '../models/models';


export async function parseFile(fileInfo: FileInfo): Promise<ParsedFile> {

    console.log("entered the parseFile function with fileInfo:", fileInfo)

    const imports : ImportInfo[] = []

    const exports : ExportInfo[] = []
    
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

        if (ts.isVariableStatement(node)){
            const isExported = node.modifiers?.some(
                modifier => modifier.kind === ts.SyntaxKind.ExportKeyword
            )
           if (isExported){
            node.declarationList?.declarations.forEach(variable =>
                exports.push({
                    name: variable.name.getText(),
                    type: "variable"
                })
            )
           }
        }


        if (ts.isClassDeclaration(node)){

            const isExported = node.modifiers?.some(
                modifier => modifier.kind === ts.SyntaxKind.ExportKeyword
            )
            if (isExported){
                exports.push({
                    name : node.name?.text,
                    type : "class" 
                })
            }
        }

        if (ts.isFunctionDeclaration(node)) {

            const isExported = node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)

            if (isExported){
                exports.push({
                    name : node.name?.text,
                    type : node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword)? "default" : "function"
                })
            }

            const functionDetails: FunctionInfo = {
                name: node.name?.text || 'anonymous',
                parameters: node.parameters.map(param => param.name.getText()),
                async: node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.AsyncKeyword) || false,
                exported: node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword) || false,
                location: `${fileInfo.path}:${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1}`
            };
            functions.push(functionDetails);
        }


    const exportClause = node.exportClause;

    if (exportClause && ts.isNamedExports(exportClause)) {
        
            exportClause.elements.map(element => exports.push({
                name : element.name.text,
                type : "unknown"
            })
        );

}
        ts.forEachChild(node,visit)
    }
    visit(sourceFile)
    console.log(
        fileInfo,
        functions,
        imports,
        exports
    )
    return {
        file: fileInfo,
        functions,
        imports,
        exports
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

