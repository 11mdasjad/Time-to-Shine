// Additional enquiry categories supplied by the business owner. These are dropdown
// options, not individual product cards or claims of manufacturing capability.
export const additionalServices = [
  'Printing Services For Label',
  'Printing Services For Flexo',
  'Printing Services For Box',
  'Printing Services For Booklet',
  'Offset Printing Services For Pamphlet',
  'Offset Printing Services',
  'Neon Sign Board Manufacturers',
  'Label Sticker Manufacturers',
  'Flex Sign Board Manufacturers',
  'Envelope Manufacturers',
  'Computer Graphic Designers',
  'Banner Manufacturers',
  'Acrylic Sign Board Manufacturers',
  'Sunpack Sheet Printing Services',
  'Catalogue Printing Services',
  'Pamphlet Printing Services',
  'Brochure Printing Services',
  'Flex Printing Services',
  'Book Printing Services',
  'Printing Services',
  'Visiting Card Manufacturers',
  'Vinyl Sticker Manufacturers',
  'Sign Board Manufacturers',
  'Sign Board Dealers',
  'Printing Press',
  'Printing Job Works',
  'Printing Services For Visiting Card',
  'Printing Services For Sticker',
  'Printing Services For Sign Board',
  'Printing Services For Poster',
  'Printers For Mug',
  'Printers For Letter Head',
  'Letter Head Wholesalers',
  'Digital Sublimation Printing Services',
  'Bulk Printing Services',
  'LED Sign Board Repair & Services',
  'Paper Bag Printing Services',
  'Laser Printing Services',
  'Print On Demand Services',
  'Bill Book Printing Services',
  'Flag Printing Services',
  'Certificate Printing Services',
  'Vinyl Printing Services',
  'Banner Printing Services',
  'Plastic Bag Printing Services',
  'Map Printing Services',
  'DTF Printing Services',
  'Board Printing Services',
  'Sunboard Printing Services',
  'Sublimation Printing Services',
  'Aadhar Card Printing Services',
  'ID Card Printing Services',
  'Vinyl Sticker Printing Services',
  'Digital Printing Press Wholesalers',
  'Color Printing Services',
  'Standees Printing Services',
  'Letter Press Printing Services',
  'Tent Card Manufacturers',
  'Label Sticker Printing Services',
  'Paper Printing Services'
].map(name=>({id:'enquiry-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name}));
export function enquiryServices(catalogue=[]){
  const names=new Set(catalogue.map(service=>service.name.toLowerCase()));
  return [...catalogue,...additionalServices.filter(service=>!names.has(service.name.toLowerCase()))];
}
export function serviceOptionsMarkup(catalogue=[]){
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const options=list=>list.map(s=>`<option value="${escape(s.id)}">${escape(s.name)}</option>`).join('');
  const extra=enquiryServices(catalogue).slice(catalogue.length).sort((a,b)=>a.name.localeCompare(b.name));
  return '<option value="">Choose a service</option>'+(catalogue.length?`<optgroup label="Popular printing services">${options(catalogue)}</optgroup>`:'')+`<optgroup label="More services">${options(extra)}</optgroup><option value="other">Other / Help me choose</option>`;
}
