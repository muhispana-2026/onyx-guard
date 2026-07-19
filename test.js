const target = `    json << "{"
         << "\\\\\\"username\\\\\\": \\\\\\"" << JsonEscape(username) << "\\\\\\","
`;
const replacement = `    json << "{"
         << "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\","
`;

console.log(target.includes('\\\\\\'));
console.log(replacement.includes('\\"'));
