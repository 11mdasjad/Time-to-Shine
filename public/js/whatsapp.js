// Business WhatsApp number confirmed by the owner. International format, digits only.
export const WHATSAPP_NUMBER = '919999777681';
const clean = value => String(value ?? '').trim();
const line = value => clean(value).replace(/[\r\n]+/g, ' ');
export function buildEnquiryMessage(data, kind = 'contact') {
  const quote = kind === 'quote';
  const lines = [
    'Hello Time To Shine Graphics!', '',
    quote ? '*Printing Quote Enquiry*' : '*Website Enquiry*', '',
    '*Customer Details*',
    `Name: ${line(data.name)}`,
    `Phone: ${line(data.phone)}`,
  ];
  if (clean(data.email)) lines.push(`Email: ${line(data.email)}`);
  if (quote) {
    lines.push('', '*Printing Requirements*', `Service: ${line(data.serviceName)}`);
    if (clean(data.quantity)) lines.push(`Quantity: ${line(data.quantity)}`);
    if (clean(data.dimensions)) lines.push(`Size: ${line(data.dimensions)}`);
    if (clean(data.message)) lines.push('', '*Additional Details*', clean(data.message));
    lines.push('', 'Please confirm availability and share a quotation for my requirements.');
  } else {
    if (clean(data.serviceName)) lines.push('', '*Selected Service*', `Service: ${line(data.serviceName)}`);
    lines.push('', '*Message*', clean(data.message), '', 'Please help me with this enquiry.');
  }
  lines.push('', 'Thank you!');
  return lines.join('\n');
}
export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
