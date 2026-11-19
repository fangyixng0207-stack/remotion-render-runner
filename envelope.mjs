import fs from 'node:fs';
import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';

const [mode,source,target]=process.argv.slice(2);
const key=Buffer.from(process.env.RENDER_KEY||'','base64');
if(key.length!==32) throw Error('A 256-bit job key is required');
const bytes=fs.readFileSync(source);
if(mode==='seal') {
  const nonce=randomBytes(12);
  const cipher=createCipheriv('aes-256-gcm',key,nonce);
  const encrypted=Buffer.concat([cipher.update(bytes),cipher.final()]);
  fs.writeFileSync(target,Buffer.concat([Buffer.from('RM01'),nonce,cipher.getAuthTag(),encrypted]));
} else if(mode==='open') {
  if(bytes.subarray(0,4).toString()!=='RM01') throw Error('Invalid envelope');
  const decipher=createDecipheriv('aes-256-gcm',key,bytes.subarray(4,16));
  decipher.setAuthTag(bytes.subarray(16,32));
  const plain=Buffer.concat([decipher.update(bytes.subarray(32)),decipher.final()]);
  fs.writeFileSync(target,plain,{mode:0o600});
} else {
  throw Error('Use seal or open');
}
