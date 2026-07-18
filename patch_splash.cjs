const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newSplash = `void ShowSplashScreen() {
    WNDCLASSA wc = {0};
    wc.lpfnWndProc = DefWindowProcA;
    wc.hInstance = GetModuleHandleA(NULL);
    wc.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    wc.lpszClassName = "OnyxSplashClass";
    RegisterClassA(&wc);

    int screenW = GetSystemMetrics(SM_CXSCREEN);
    int screenH = GetSystemMetrics(SM_CYSCREEN);
    int splashW = 450;
    int splashH = 220;

    HWND hwndSplash = CreateWindowExA(
        WS_EX_TOPMOST | WS_EX_TOOLWINDOW,
        "OnyxSplashClass",
        "OnyxGuard Loading",
        WS_POPUP | WS_VISIBLE,
        (screenW - splashW) / 2, (screenH - splashH) / 2,
        splashW, splashH,
        NULL, NULL, wc.hInstance, NULL
    );

    if (hwndSplash) {
        HDC hdc = GetDC(hwndSplash);
        
        RECT rect;
        GetClientRect(hwndSplash, &rect);
        
        // Draw background
        HBRUSH bgBrush = CreateSolidBrush(RGB(5, 5, 8));
        FillRect(hdc, &rect, bgBrush);
        DeleteObject(bgBrush);
        
        // Draw Cyan border
        HPEN hPen = CreatePen(PS_SOLID, 2, RGB(0, 200, 255));
        HGDIOBJ oldPen = SelectObject(hdc, hPen);
        HBRUSH nullBrush = (HBRUSH)GetStockObject(NULL_BRUSH);
        HGDIOBJ oldBrush = SelectObject(hdc, nullBrush);
        Rectangle(hdc, rect.left + 2, rect.top + 2, rect.right - 2, rect.bottom - 2);
        SelectObject(hdc, oldPen);
        SelectObject(hdc, oldBrush);
        DeleteObject(hPen);

        SetBkMode(hdc, TRANSPARENT);
        
        // Draw Title
        SetTextColor(hdc, RGB(0, 200, 255));
        HFONT hFont = CreateFontA(32, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, ANSI_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, DEFAULT_QUALITY, DEFAULT_PITCH | FF_MODERN, "Consolas");
        SelectObject(hdc, hFont);
        
        const char* splashText = "ONYX GUARD";
        const char* splashSub = "ANTI-CHEAT SYSTEM";
        const char* loadText = "Initializing Matrix...";
        const char* moduleText = "Loading Security Modules: OK";
        const char* versionText = "v1.0 (Protecting Main.exe)";
        
        TextOutA(hdc, 30, 40, splashText, strlen(splashText));
        
        HFONT hFontSub = CreateFontA(16, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, ANSI_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, DEFAULT_QUALITY, DEFAULT_PITCH | FF_MODERN, "Consolas");
        SelectObject(hdc, hFontSub);
        SetTextColor(hdc, RGB(100, 150, 255));
        TextOutA(hdc, 30, 75, splashSub, strlen(splashSub));
        
        SetTextColor(hdc, RGB(180, 180, 180));
        TextOutA(hdc, 30, 120, loadText, strlen(loadText));
        TextOutA(hdc, 30, 140, moduleText, strlen(moduleText));
        
        SetTextColor(hdc, RGB(80, 80, 80));
        TextOutA(hdc, 30, 180, versionText, strlen(versionText));

        ReleaseDC(hwndSplash, hdc);
        UpdateWindow(hwndSplash);

        // Simulate Loading Time (blocks main thread so the game waits)
        Sleep(3500); 
        
        DestroyWindow(hwndSplash);
        UnregisterClassA("OnyxSplashClass", wc.hInstance);
    }
}`;

code = code.replace(
  /void ShowSplashScreen\(\) \{[\s\S]*?\n\}/,
  newSplash
);

// Move ShowSplashScreen out of IntegrityCheckThread and into DLL_PROCESS_ATTACH
code = code.replace(
  /    \$\{enableSplashScreen \? 'ShowSplashScreen\(\);' : ''\}\n/,
  ''
);

code = code.replace(
  /        DisableThreadLibraryCalls\(hModule\);\n/,
  '        DisableThreadLibraryCalls(hModule);\n        \n        ${enableSplashScreen ? "ShowSplashScreen();" : ""}\n'
);


fs.writeFileSync('src/App.tsx', code);
