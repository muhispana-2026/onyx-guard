const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importStr = `import path from "path";`;
const importRep = `import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });`;

code = code.replace(importStr, importRep);

const checkStr = `      if (config.enableFileCheck && fileModified && fileModified !== 'none') {
        await logEntry("BLOCKED", \`Modified file detected: \${fileModified}\`);
        return res.json({ success: false, action: config.actionOnFailure, message: \`Modified file: \${fileModified}\` });
      }`;

const checkRep = `      if (config.enableFileCheck && fileModified && fileModified !== 'none') {
        let isSafe = false;
        try {
            if (process.env.GEMINI_API_KEY) {
                const prompt = \`Analiza este archivo de juego modificado en un entorno de Mu Online: '\${fileModified}'. ¿Es un hack/cheat conocido (como Cheat Engine, Haste, SpeedHack, AutoClicker, WPE Pro) o es un archivo inofensivo (como un log de error, un archivo de texto, o configuracion visual)? Responde SOLO con 'HACK' o 'SEGURO'.\`;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                const aiResult = response.text.trim().toUpperCase();
                if (aiResult.includes('SEGURO')) {
                    isSafe = true;
                    await logEntry("ALLOWED", \`AI Analysis: \${fileModified} was deemed SAFE by Onyx Guard AI.\`);
                } else {
                    await logEntry("BLOCKED", \`AI Analysis: \${fileModified} detected as HACK/CHEAT by Onyx Guard AI.\`);
                }
            }
        } catch (e) {
            console.error("AI Analysis error:", e);
        }

        if (!isSafe) {
            await logEntry("BLOCKED", \`Modified file detected: \${fileModified}\`);
            return res.json({ success: false, action: config.actionOnFailure, message: \`Onyx Guard AI detectó modificación maliciosa: \${fileModified}\` });
        }
      }`;

code = code.replace(checkStr, checkRep);
fs.writeFileSync('server.ts', code);
