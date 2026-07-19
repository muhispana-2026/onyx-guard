const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetCsReq = `                using (var response = (HttpWebResponse)request.GetResponse())
                using (var stream = response.GetResponseStream())
                using (var reader = new StreamReader(stream))
                {
                    string responseString = reader.ReadToEnd();

                    if (responseString.Contains("\\"success\\":true") || responseString.Contains("\\"success\\": true"))
                    {
                        var match = System.Text.RegularExpressions.Regex.Match(responseString, "\\\"message\\\":\\\"([^\\\"]+)\\\"");
                        if (match.Success)
                        {
                            g_startupMessage = match.Groups[1].Value;
                        }
                        return true;
                    }
                    else if (responseString.Contains("\\"action\\":"))
                    {
                        var match = System.Text.RegularExpressions.Regex.Match(responseString, "\\\"message\\\":\\\"([^\\\"]+)\\\"");
                        if (match.Success)
                        {
                            g_startupMessage = match.Groups[1].Value;
                        }
                        return false;
                    }
                    else 
                    {
                        g_startupMessage = "Server returned invalid response. Check URL (Dev URL blocks access).";
                    }
                }
            }
            catch { }`;

const replCsReq = `                using (var response = (HttpWebResponse)request.GetResponse())
                using (var stream = response.GetResponseStream())
                using (var reader = new StreamReader(stream))
                {
                    string responseString = reader.ReadToEnd();

                    if (responseString.Contains("\\"success\\":true") || responseString.Contains("\\"success\\": true"))
                    {
                        var match = System.Text.RegularExpressions.Regex.Match(responseString, "\\\"message\\\":\\\"([^\\\"]+)\\\"");
                        if (match.Success)
                        {
                            g_startupMessage = match.Groups[1].Value;
                        }
                        return true;
                    }
                    else if (responseString.Contains("\\"action\\":"))
                    {
                        var match = System.Text.RegularExpressions.Regex.Match(responseString, "\\\"message\\\":\\\"([^\\\"]+)\\\"");
                        if (match.Success)
                        {
                            g_startupMessage = match.Groups[1].Value;
                        }
                        return false;
                    }
                    else 
                    {
                        g_startupMessage = "Server returned invalid response. Check URL (Dev URL blocks access).";
                    }
                }
            }
            catch (Exception ex) 
            {
                g_startupMessage = "Connection Error: " + ex.Message;
            }`;

code = code.replace(targetCsReq, replCsReq);

// Also add ServerCertificateValidationCallback to C# to ignore SSL issues
const targetCsSsl = `        public static bool PerformHandshake(string username, string hwid, string modifiedFile)
        {
            try
            {`;

const replCsSsl = `        public static bool PerformHandshake(string username, string hwid, string modifiedFile)
        {
            try
            {
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; // TLS 1.2`;

code = code.replace(targetCsSsl, replCsSsl);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed C# SSL and error catching!");
