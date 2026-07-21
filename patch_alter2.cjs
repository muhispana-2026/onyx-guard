const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `} catch (e) {
    console.log('Failed to alter database, maybe columns exist');
  }`;
const replaceStr = `} catch (e) {
    console.error('Failed to alter database', e);
  }`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('server.ts', content);
