import { ImportInfo, ResolvedImport } from "../models/models";
import path from "path";
import fs from "node:fs/promises";

function isRelativeImport( source : string ) : boolean {
    return source.startsWith("./") || source.startsWith("../")
}
const extensions = [".ts", ".tsx", ".js", ".jsx"];

async function fileExists( filePath : string ) : Promise<boolean>{
    try {
        await fs.access(filePath);
        return true
    }catch {
        return false
    }
}

export async function resolveImport( 
    importerPath : string,
    importInfo : ImportInfo,
) : Promise<ResolvedImport> {
    if (!isRelativeImport(importInfo.source)){
        return {
            ...importInfo,
            resolvedPath : null
        }
    }
    
    const importDirectory = path.dirname(importerPath);

    const basePath = path.resolve(
    importDirectory,
    importInfo.source
    )

    const candidate = `${basePath}.${path.extname(importInfo.source)}`;
    console.log("Canditate is :",candidate)
    if (await fileExists(candidate)){
        return {
            ...importInfo,
            resolvedPath : candidate 
        }
    }
    return {
        ...importInfo,
        resolvedPath : null
    }
}

async function main() {
const result = await resolveImport(
    "test-repo/example.ts",
    {
        source: "./file1",
        importedNames: ["greet"],
        isDefault: false,
        isNamespace: false
    }
);
    console.log(result);
}

main();