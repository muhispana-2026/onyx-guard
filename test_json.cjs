const str = `
    json << "{"
         << "\\\"username\\\": \\\"" << "user" << "\\\",\\\""
         << "hwid\\\": \\\"" << "hwid" << "\\\",\\\""
         << "clientVersion\\\": \\\"" << "clientVersion" << "\\\",\\\""
         << "secretToken\\\": \\\"" << "secretToken" << "\\\""
         << ",\\\"fileModified\\\": \\\"" << "fileModified" << "\\\""
         << "}";
`;
console.log(str);
