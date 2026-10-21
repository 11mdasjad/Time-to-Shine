import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';
import {services,faqs,normalizeServices} from '../public/js/data.js';
const directory=path.resolve(process.env.DATA_DIR||'server/private');
const pool=process.env.DATABASE_URL?new pg.Pool({connectionString:process.env.DATABASE_URL}):null;
if(process.env.NODE_ENV==='production'&&!pool)throw new Error('Production requires DATABASE_URL and migrations.');
let chain=Promise.resolve();
const seed=()=>({catalogue:{services,faqs,portfolio:[],settings:{phone:"9999777681",email:"timetoshinegraphics@gmail.com",address:"A-125, Indira Kalyan Vihar, Okhla Phase-1, New Delhi – 110020"}},requests:[],audit:[]});
async function localRead(){await mkdir(directory,{recursive:true,mode:0o700});try{return JSON.parse(await readFile(path.join(directory,'data.json'),'utf8'));}catch(e){if(e.code==='ENOENT')return seed();throw e;}}
function mutate(fn){const job=chain.then(async()=>{const data=await localRead();const result=fn(data);const tmp=path.join(directory,'data.tmp');await writeFile(tmp,JSON.stringify(data,null,2),{mode:0o600});await rename(tmp,path.join(directory,'data.json'));return result;});chain=job.catch(()=>{});return job;}
export const store={
 async catalogue(){if(pool){const {rows}=await pool.query('SELECT value FROM site_settings WHERE key=$1',['catalogue']);const c=rows[0]?.value||seed().catalogue;return {...c,services:normalizeServices(c.services)};}const c=(await localRead()).catalogue;return {...c,services:normalizeServices(c.services)};},
 async updateCatalogue(catalogue){if(pool)await pool.query('INSERT INTO site_settings(key,value) VALUES ($1,$2) ON CONFLICT(key) DO UPDATE SET value=$2, updated_at=now()',['catalogue',catalogue]);else await mutate(d=>{d.catalogue=catalogue;});},
 async add(request){if(pool)await pool.query('INSERT INTO quotation_requests(id,reference,kind,customer,requirements,artwork,status,notes) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[request.id,request.reference,request.kind,request.customer,request.requirements,request.artwork,request.status,request.notes]);else await mutate(d=>d.requests.unshift(request));return request;},
 async list(){if(pool)return (await pool.query('SELECT * FROM quotation_requests ORDER BY created_at DESC LIMIT 1000')).rows;return (await localRead()).requests;},
 async get(id){if(pool)return (await pool.query('SELECT * FROM quotation_requests WHERE id=$1',[id])).rows[0];return (await localRead()).requests.find(r=>r.id===id);},
 async update(id,status,notes){if(pool)return (await pool.query('UPDATE quotation_requests SET status=$2,notes=$3,updated_at=now() WHERE id=$1 RETURNING id',[id,status,notes])).rowCount>0;return mutate(d=>{const r=d.requests.find(r=>r.id===id);if(!r)return false;Object.assign(r,{status,notes,updated_at:new Date().toISOString()});return true;});},
 async audit(action,target){if(pool)await pool.query('INSERT INTO admin_audit_logs(action,target) VALUES ($1,$2)',[action,target]);else await mutate(d=>d.audit.push({action,target,at:new Date().toISOString()}));}
};
export {directory};
