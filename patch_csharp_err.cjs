const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetCS = `            try
            {
                using (var response = (HttpWebResponse)request.GetResponse())
                {
                    using (var reader = new StreamReader(response.GetResponseStream()))
                    {
                        string responseText = reader.ReadToEnd();
                        return responseText.Contains("\\"success\\":true");
                    }
                }
            }
            catch
            {
                return false;
            }`;

const replacementCS = `            try
            {
                using (var response = (HttpWebResponse)request.GetResponse())
                {
                    using (var reader = new StreamReader(response.GetResponseStream()))
                    {
                        string responseText = reader.ReadToEnd();
                        if (responseText.Contains("\\"success\\":true") || responseText.Contains("\\"success\\": true")) {
                            return true;
                        } else {
                            EnforceBlock("Server rejected auth.\\nResponse: " + responseText);
                            return false;
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                string respText = "";
                if (ex.Response != null) {
                    using (var reader = new StreamReader(ex.Response.GetResponseStream())) {
                        respText = reader.ReadToEnd();
                    }
                }
                EnforceBlock("HTTP Request Failed: " + ex.Message + "\\nResponse: " + respText);
                return false;
            }
            catch (Exception ex)
            {
                EnforceBlock("HTTP Request Exception: " + ex.Message);
                return false;
            }`;

code = code.replace(targetCS, replacementCS);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched C# MsgBox!");
