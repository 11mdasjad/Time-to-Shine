import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {services,faqs} from '../public/js/data.js';
const catalogue={services,faqs,portfolio:[],settings:{}};
let version=0;
async function render(file,query=''){const dom=new JSDOM(await readFile('public/'+file,'utf8'),{url:'http://localhost:4173/'+file+query,pretendToBeVisual:true});Object.assign(globalThis,{window:dom.window,document:dom.window.document,location:dom.window.location,FormData:dom.window.FormData,matchMedia:()=>({matches:false}),fetch:async()=>({ok:true,json:async()=>catalogue})});await import(`../public/js/main.js?test=${version++}`);return dom;}
test('all public pages render meaningful content and internal links resolve',async()=>{const files=(await readdir('public')).filter(f=>f.endsWith('.html')&&f!=='admin.html');for(const file of files){const dom=await render(file);assert.ok(document.querySelector('main h1'),file+' has heading');assert.ok(document.querySelector('main').textContent.length>100,file+' has content');for(const link of document.querySelectorAll('a[href]')){const url=new URL(link.href);if(url.origin===location.origin&&url.pathname.endsWith('.html'))assert.ok(files.includes(url.pathname.slice(1))||url.pathname==='/admin.html',url.pathname);}dom.window.close();}});
test('catalogue combines category/search and renders empty state',async()=>{const dom=await render('services.html');assert.equal(document.querySelectorAll('#catalogue .card').length,8);document.querySelector('[data-category="Apparel"]').click();assert.equal(document.querySelectorAll('#catalogue .card').length,2);const input=document.querySelector('#service-search');input.value='dtf';input.dispatchEvent(new dom.window.Event('input'));assert.equal(document.querySelectorAll('#catalogue .card').length,1);input.value='unmatched';input.dispatchEvent(new dom.window.Event('input'));assert.equal(document.querySelectorAll('#catalogue .card').length,0);assert.match(document.querySelector('#catalogue').textContent,/No matching/);dom.window.close();});
test('simple quote validates before opening WhatsApp with formatted details',async()=>{
  const dom=await render('get-a-quote.html','?service=dtf');
  const form=document.querySelector('#quote-root form');const opened=[];window.open=(...args)=>opened.push(args);
  const submit=()=>form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
  assert.equal(form.elements.service.value,'dtf');assert.equal(form.querySelectorAll('fieldset').length,0);
  submit();assert.equal(opened.length,0);
  form.elements.name.value='Aman & Sons';form.elements.phone.value='9999777681';form.elements.quantity.value='50';form.elements.message.value='Front print: blue & gold + logo';form.elements.dimensions.value='12 × 10 inches';
  submit();assert.equal(opened.length,1);const url=new URL(opened[0][0]);
  assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/919999777681');
  const message=url.searchParams.get('text');assert.match(message,/Name: Aman & Sons/);assert.match(message,/Service: DTF Printing & Transfers/);assert.match(message,/Quantity: 50/);assert.match(message,/12 × 10 inches/);assert.match(message,/blue & gold \+ logo/);
  assert.equal(opened[0][2],'noopener,noreferrer');assert.equal(document.querySelector('.whatsapp-handoff').hidden,false);
  assert.doesNotMatch(document.querySelector('.whatsapp-handoff').textContent,/received|saved|successfully sent/i);
  form.elements.quantity.value='51';form.elements.quantity.dispatchEvent(new dom.window.Event('input',{bubbles:true}));assert.equal(document.querySelector('.whatsapp-handoff').hidden,true);
  dom.window.close();
});
test('contact requires three simple fields and preserves Unicode and newlines in WhatsApp',async()=>{
  const dom=await render('contact.html');const form=document.querySelector('#contact-root form');const opened=[];window.open=(url)=>opened.push(url);
  assert.equal(form.querySelectorAll('input,textarea,select').length,3);
  form.elements.name.value='   ';form.elements.phone.value='9999777681';form.elements.message.value='नमस्ते, printing enquiry\nCards & flyers चाहिए।';
  const submit=()=>form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));submit();assert.equal(opened.length,0);
  form.elements.name.value='Asjad';submit();assert.equal(opened.length,1);
  const message=new URL(opened[0]).searchParams.get('text');assert.match(message,/Website Enquiry/);assert.ok(message.includes('नमस्ते, printing enquiry\nCards & flyers चाहिए।'));assert.ok(!message.includes('undefined'));
  assert.equal(form.elements.name.value,'Asjad');dom.window.close();
});
test('mobile menu exposes state and Escape closes it',async()=>{const dom=await render('index.html');const menu=document.querySelector('.menu');menu.click();assert.equal(menu.getAttribute('aria-expanded'),'true');document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(menu.getAttribute('aria-expanded'),'false');dom.window.close();});
