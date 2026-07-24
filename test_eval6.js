const str = `size_t msgEnd = msgStart; while ((msgEnd = responseString.find("\\\"", msgEnd)) != std::string::npos) { if (msgEnd > 0 && responseString[msgEnd - 1] != '\\\\') break; msgEnd++; }`;
console.log(str);
