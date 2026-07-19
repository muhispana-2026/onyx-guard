const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        DestroyWindow(hwndSplash);
        UnregisterClassA("OnyxSplashClass", wc.hInstance);
    }
}
void ShowSplashScreen() {`;

const repl = `        DestroyWindow(hwndSplash);
        UnregisterClassA("OnyxSplashClass", wc.hInstance);
    }
    return 0;
}
void ShowSplashScreen() {`;

code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed splash return!");
