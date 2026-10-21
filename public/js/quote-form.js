import {enquiryServices,serviceOptionsMarkup} from './service-options.js?v=20261021-aadhaar';
import {buildEnquiryMessage,whatsappUrl} from './whatsapp.js?v=20261021-service-options';
import {mountUpload,postMultipart} from './file-upload.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const input=(name,label,type='text',required=true)=>`<label>${label}${required?' *':''}<input name="${name}" type="${type}" ${required?'required':''} ${type==='number'?'min="1" max="10000000" step="1"':''} ${type==='tel'?'pattern="[+0-9 ()-]{7,25}"':''} maxlength="${type==='email'?254:200}"></label>`;
const customer=()=>input('name','Your name')+input('company','Company','text',false)+input('phone','Phone number','tel')+input('email','Email address','email');
const privacy='<label class="checkbox"><input name="consent" type="checkbox" required value="yes"><span>I agree to be contacted about my request and have read the <a href="/privacy-policy.html" target="_blank">privacy notice</a>. *</span></label>';
function status(root,result){root.replaceChildren();const box=document.createElement('div');box.className='success';const title=document.createElement('h2');title.textContent='Request received.';const p=document.createElement('p');p.textContent=`Your reference is ${result.reference}. Keep it for follow-up. Your request is saved for review; this is not an order confirmation or price quotation.`;box.append(title,p);root.append(box);box.tabIndex=-1;box.focus();}
export function initQuote(services){mountWhatsAppForm(document.querySelector('#quote-root'),'quote',services);}
export function initUpload(){const root=document.querySelector('#upload-root');root.innerHTML=`<form><h2>Send Your Artwork</h2><div class="fields">${customer()}</div><div id="artwork"></div><label>Project notes *<textarea name="message" required maxlength="5000" placeholder="What would you like us to print?"></textarea></label>${privacy}<p class="error" role="alert"></p><button class="btn" type="submit">Submit Artwork ↗</button></form>`;const form=root.querySelector('form'),upload=mountUpload(root.querySelector('#artwork'));form.addEventListener('submit',async e=>{e.preventDefault();const error=root.querySelector('.error:last-of-type');if(!upload.getFile()){error.textContent='Please choose an artwork file.';return;}const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='Uploading…';const body=new FormData();body.append('data',JSON.stringify(Object.fromEntries(new FormData(form))));body.append('artwork',upload.getFile());try{status(root,await postMultipart('/api/artwork',body,upload.progress));}catch(err){error.textContent=err.message;button.disabled=false;button.textContent='Retry Upload ↗';}});}
export function initContact(services=[]){mountWhatsAppForm(document.querySelector('#contact-root'),'contact',services);}

function mountWhatsAppForm(root,kind,services=[]){
  const quote=kind==='quote';
  const choices=enquiryServices(services);
  root.innerHTML=`<div class="whatsapp-intro"><span class="whatsapp-badge">Chat directly on WhatsApp</span><h2>${quote?'Tell Us What You Need':'Let’s Talk Print'}</h2><p>Fill in a few details. Your message will be ready in WhatsApp.</p></div>
  <form novalidate>
    <div class="fields">${input('name','Your name')}${input('phone','Your phone number','tel')}
    <label class="${quote?'':'wide'}">Which service do you need? *<select name="service" required>${serviceOptionsMarkup(services)}</select></label>${quote?input('quantity','Quantity (optional)','number',false):''}
    <label class="wide">${quote?'Tell us a little more (optional)':'Your message *'}<textarea name="message" ${quote?'':'required'} maxlength="1000" placeholder="${quote?'For example: 50 black T-shirts with a front print for our team.':'What would you like to print or ask us?'}"></textarea></label>
    </div>
    ${quote?`<details class="extra-details"><summary>Add size or email (optional)</summary><div class="fields">${input('dimensions','Size, with units','text',false)}${input('email','Email address','email',false)}</div></details>`:''}
    <p class="notice">Your details will be shared with Time To Shine Graphics on WhatsApp. Review your message there and tap Send. <a href="/privacy-policy.html" target="_blank" rel="noopener">Privacy notice</a>.</p>
    ${quote?'<p class="notice">Have a design? Attach it directly in the WhatsApp chat.</p>':''}
    <p class="error" role="alert"></p>
    <button type="submit" class="btn whatsapp-btn">Continue to WhatsApp <span aria-hidden="true">↗</span></button>
    <div class="whatsapp-handoff" hidden role="status"><p>Your message is ready. Tap Send in WhatsApp to complete your enquiry.</p><a target="_blank" rel="noopener noreferrer">Open WhatsApp again ↗</a></div>
  </form>`;
  const form=root.querySelector('form');
  form.elements.name.autocomplete='name';form.elements.phone.autocomplete='tel';
  const params=new URLSearchParams(location.search);
  if(choices.some(s=>s.id===params.get('service'))||params.get('service')==='other')form.elements.service.value=params.get('service');
  if(quote){form.elements.email.autocomplete='email';if(params.has('bulk'))form.elements.message.value='I would like a quote for bulk printing. ';}
  const handoff=root.querySelector('.whatsapp-handoff');
  form.addEventListener('input',()=>{handoff.hidden=true;handoff.querySelector('a').removeAttribute('href');root.querySelector('.error').textContent='';});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    for(const field of [form.elements.name,form.elements.message])field.setCustomValidity(field.required&&!field.value.trim()?'Please fill in this field.':'');
    const invalid=[...form.elements].find(field=>field.willValidate&&!field.validity.valid);
    const folded=invalid?.closest('details');if(folded)folded.open=true;
    if(!form.reportValidity()){root.querySelector('.error').textContent='Please complete the required details correctly.';return;}
    const data=Object.fromEntries(new FormData(form));
    data.serviceName=choices.find(s=>s.id===data.service)?.name||'Other / Help me choose';
    const url=whatsappUrl(buildEnquiryMessage(data,kind));
    handoff.querySelector('a').href=url;handoff.hidden=false;
    root.querySelector('.error').textContent='';
    // Synchronous user-initiated navigation; no backend save or delivery claim.
    window.open(url,'_blank','noopener,noreferrer');
  });
}
