const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The line currently in App.tsx might be:
// size_t msgStart = responseString.find("\"message\":\"");
// We want to replace it with:
// size_t msgStart = responseString.find("\\\"message\\\":\\\"");

code = code.replace(
    'size_t msgStart = responseString.find("\\"message\\":\\"");',
    'size_t msgStart = responseString.find("\\\\\\"message\\\\\\":\\\\\\"");'
);

code = code.replace(
    'size_t msgEnd = responseString.find("\\"", msgStart);',
    'size_t msgEnd = responseString.find("\\\\\\"", msgStart);'
);

// We need to double check if it was already replaced.
// If it was already replaced, the above won't match, and that's fine or bad?
// Let's print out what is currently in the file.
