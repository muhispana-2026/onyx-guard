const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const search = '<< "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\",\\n             << "}";';
const replacement = '<< "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\"\\n             << "}";';

code = code.split(search).join(replacement);

fs.writeFileSync('src/App.tsx', code);
