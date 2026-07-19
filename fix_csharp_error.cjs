const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                        if (responseText.Contains("\\"action\\":\\"EXIT\\"") || responseText.Contains("\\"action\\": \\"EXIT\\"") || responseText.Contains("\\"success\\":false"))
                            return false; // Explicit rejection from server`;

const replacement = `                        if (responseText.Contains("\\"action\\":\\"EXIT\\"") || responseText.Contains("\\"action\\": \\"EXIT\\"") || responseText.Contains("\\"success\\":false"))
                        {
                            int msgStart = responseText.IndexOf("\\"message\\":\\"");
                            if (msgStart != -1) {
                                msgStart += 11;
                                int msgEnd = responseText.IndexOf("\\"", msgStart);
                                if (msgEnd != -1) {
                                    g_startupMessage = responseText.Substring(msgStart, msgEnd - msgStart);
                                }
                            }
                            return false; // Explicit rejection from server
                        }`;
code = code.replace(target, replacement);

const target2 = `        private static void HandleFailure(string message)`;
const replacement2 = `        private static string g_startupMessage = "";
        private static void HandleFailure(string message)`;
code = code.replace(target2, replacement2);

const target3 = `            if (!status)
            {
                HandleFailure("CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized.");
                return;
            }`;
const replacement3 = `            if (!status)
            {
                string err = string.IsNullOrEmpty(g_startupMessage) ? "CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized." : g_startupMessage;
                HandleFailure(err);
                return;
            }`;
code = code.replace(target3, replacement3);

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
