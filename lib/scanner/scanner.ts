import fs from 'node:fs/promises'
import path from 'node:path'
import { FileInfo } from '../models/file'


const directory = 'test-repo'


const directoryPath = path.join(process.cwd(),directory)
console.log('the working directory is ',directoryPath)


async function scanDirectory(directory:string) : Promise<FileInfo[]>{
    
    const fileInfoList : FileInfo[] = []
    
    const entries = await fs.readdir(directory,{
        withFileTypes:true
    })

    for (const entry of entries){
        if (entry.isDirectory()){
            const childFiles =  await scanDirectory(path.join(directory, entry.name))
            fileInfoList.push(...childFiles)
        }
        if (entry.isFile()){
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
    console.log('the file info list is ',fileInfoList)
    return fileInfoList
}

