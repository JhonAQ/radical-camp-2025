const fs = require('fs');

const adminPath = 'app/chanchito/AdminChanchito.tsx';
let adminCode = fs.readFileSync(adminPath, 'utf8');
adminCode = adminCode.replace(/toast\.success\((.*?)\)/g, 'alert($1)');
adminCode = adminCode.replace(/toast\.error\((.*?)\)/g, 'alert($1)');
fs.writeFileSync(adminPath, adminCode, 'utf8');

const userPath = 'app/chanchito/UserChanchito.tsx';
let userCode = fs.readFileSync(userPath, 'utf8');
userCode = userCode.replace('import { toast } from "sonner";', '');
userCode = userCode.replace(/toast\.success\((.*?)\)/g, 'alert($1)');
userCode = userCode.replace(/toast\.error\((.*?)\)/g, 'alert($1)');
fs.writeFileSync(userPath, userCode, 'utf8');
