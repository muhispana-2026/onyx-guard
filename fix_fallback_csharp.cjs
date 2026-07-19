const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                    }
                    else if (responseString.Contains("\\"action\\":"))
                    {
                        var match = System.Text.RegularExpressions.Regex.Match(responseString, "\\\"message\\\":\\\"([^\\\"]+)\\\"");
                        if (match.Success)
                        {
                            g_startupMessage = match.Groups[1].Value;
                        }
                        return false;
                    }
                }
            }
            catch { }`;

const repl = `                    }
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
code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed C# fallback!");
