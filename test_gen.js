const code = `
size_t msgStart = responseString.find("\\\"message\\\":\\\"");
if (msgStart != std::string::npos) {
    msgStart += 11;
    size_t msgEnd = responseString.find("\\\"", msgStart);
    if (msgEnd != std::string::npos) {
        g_startupMessage = responseString.substr(msgStart, msgEnd - msgStart);
    }
}
`;
console.log(code);
