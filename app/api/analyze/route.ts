import { scanDirectory } from '@/lib/scanner/scanner'
import { parseFile } from '@/lib/parser/parser'
import { FileInfo, ParsedFile } from '@/lib/models/models'

export async function GET(request: Request) {
    
    console.log("hit the get request in analyze route.ts")

    const scannerInfo: FileInfo[] = await scanDirectory('test-repo')

    console.log('Scanner info:', scannerInfo)

    const parsedFiles: ParsedFile[] = await Promise.all(
        scannerInfo.map(filleInfo => parseFile(filleInfo))
    )
    console.log('==========Parsed files:==========', parsedFiles, {depth: null})

    return Response.json(parsedFiles)
}