const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetHWIDCS = `        private static string FetchHWID()
        {
            // Gather Motherboard and CPU IDs
            try {
                string drive = Path.GetPathRoot(Environment.SystemDirectory);
                DriveInfo dInfo = new DriveInfo(drive);
                string volumeSerial = dInfo.VolumeLabel + "_UUID_C10048F";
                return "HWID-" + GetMd5String(volumeSerial).Substring(0, 20).ToUpper();
            }
            catch {
                return "HWID-GENERIC-WIN10-CLIENT";
            }
        }`;

const replacementHWIDCS = `        private static string FetchHWID()
        {
            try {
                return "HWID-" + Environment.MachineName;
            }
            catch {
                return "HWID-GENERIC-WIN10-CLIENT";
            }
        }`;

code = code.replace(targetHWIDCS, replacementHWIDCS);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched C# HWID");
