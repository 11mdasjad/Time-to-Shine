import pg from 'pg';
import {readFile} from 'node:fs/promises';
const client=new pg.Client({connectionString:process.env.DATABASE_URL});
await client.connect();try{await client.query(await readFile(new URL('./migrations/001_initial.sql',import.meta.url),'utf8'));console.log('Migration 001 applied.');}finally{await client.end();}
