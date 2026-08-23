import fs from 'node:fs/promises'
import path from 'node:path'
import { FileInfo } from '../models/models'


export async function scanDirectory(directory:string) : Promise<FileInfo[]>{
    

    const fileInfoList : FileInfo[] = []
    
    const entries = await fs.readdir(directory,{
        withFileTypes:true
    })

    for (const entry of entries){
        
        const entryPath = path.join(directory, entry.name)

        if (entry.isDirectory()){
            const childFiles =  await scanDirectory(entryPath)
            fileInfoList.push(...childFiles)
        }else if (entry.isFile()){
            console.log('the file is ',entry.name)
            const fileinfo : FileInfo = {
                name: entry.name,
                path: path.join(directory, entry.name),
                extension: path.extname(entry.name),
                size: (await fs.stat(path.join(directory, entry.name))).size
            }
            fileInfoList.push(fileinfo)
        }
    }
    return fileInfoList
}

