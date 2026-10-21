import {readFile,writeFile,readdir} from 'node:fs/promises';
const base=process.env.SITE_URL;
if(!base||!/^https:\/\/[^/]+\/?$/.test(base))throw new Error('Set SITE_URL to the approved HTTPS domain (no path).');
if(process.env.BUSINESS_APPROVED!=='yes')throw new Error('Run only after owner approval: BUSINESS_APPROVED=yes');
const origin=base.replace(/\/$/,'');
const pages=(await readdir('public')).filter(f=>f.endsWith('.html')&&f!=='admin.html');
for(const file of pages){let html=await readFile('public/'+file,'utf8');html=html.replace('<meta name="robots" content="noindex,nofollow">','').replace(/<link rel="canonical"[^>]*>/g,'').replace(/<meta property="og:url"[^>]*>/g,'');html=html.replace('</head>',`<link rel="canonical" href="${origin}/${file}"><meta property="og:url" content="${origin}/${file}"></head>`);await writeFile('public/'+file,html);}
await writeFile('public/robots.txt',`User-agent: *\nDisallow: /admin.html\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile('public/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${origin}/${p}</loc></url>`).join('')}</urlset>`);
console.log('Approved-domain canonicals, sitemap and robots.txt prepared.');
