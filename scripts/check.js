import {readdir,readFile,access} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
for(const directory of ['public/js','server','scripts','tests'])for(const file of await readdir(directory)){if(file.endsWith('.js'))execFileSync(process.execPath,['--check',path.join(directory,file)]);}
const pages=(await readdir('public')).filter(f=>f.endsWith('.html'));for(const file of pages){const content=await readFile('public/'+file,'utf8');for(const match of content.matchAll(/(?:href|src)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)){await access('public'+match[1]);}if(!content.includes('<title>')||!content.includes('name="description"'))throw new Error('Missing SEO metadata: '+file);}
console.log(`Syntax and document checks passed for ${pages.length} pages.`);
