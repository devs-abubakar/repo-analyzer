export type FileInfo = {
    path: string;
    extension: string;
    size: number;
    name: string;
    
}

export type ResolvedImport = {
    source : string;
    resolvedPath : string | null;
    importedNames : string[];
    isDefault : boolean;
    isNamespace :boolean;
}

export type FunctionInfo = {
    name: string;
    parameters : string[];
    async : boolean;
    exported : boolean;
    location : string;
}

export type ImportInfo = {  
    source: string;
    importedNames: string[];
    isDefault: boolean;
    isNamespace: boolean;
}
export type ExportInfo = {
    name: string;
    type:"named"|"unknown"|"default"|"function"|"class"|"variable"|"re-export";
}

export type ParsedFile = {
    file: FileInfo;
    functions: FunctionInfo[];
    imports: ImportInfo[];
}