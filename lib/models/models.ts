export type FileInfo = {
    path: string;
    extension: string;
    size: number;
    name: string;
    
}

export type FunctionInfo = {
    name: string;
}

export type ImportInfo = {  
    source: string;
    importedNames: string[];
    isDefault: boolean;
    isNamespace: boolean;
}
export type ExportInfo = {
    name: string;
    type:"named"|"default";
}

export type ParsedFile = {
    file: FileInfo;
    functions: FunctionInfo[];
    imports: ImportInfo[];
}