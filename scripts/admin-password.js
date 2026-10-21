import {randomBytes,scryptSync} from 'node:crypto';
import readline from 'node:readline';
// Input is hidden; only a salted hash is printed. Never pass passwords as CLI arguments.
if(!process.stdin.isTTY)throw new Error('Run in an interactive terminal.');
process.stdout.write('New admin password (minimum 12 characters): ');
readline.emitKeypressEvents(process.stdin);process.stdin.setRawMode(true);let password='';
process.stdin.on('keypress',(str,key)=>{if(key.ctrl&&key.name==='c')process.exit(1);if(key.name==='return'){process.stdin.setRawMode(false);if(password.length<12){console.error('\nUse at least 12 characters.');process.exit(1);}const salt=randomBytes(16).toString('hex');console.log(`\nADMIN_PASSWORD_HASH=${salt}:${scryptSync(password,salt,64).toString('hex')}`);process.exit(0);}if(key.name==='backspace')password=password.slice(0,-1);else if(str&&!key.ctrl)password+=str;});
