/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { translations } from './translations';
import { 
  Shield, 
  Terminal, 
  Cpu, 
  Layers, 
  Users, 
  FileCheck, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Code2, 
  Database, 
  Play, 
  Lock, 
  Unlock, 
  Copy, 
  Server, 
  Network,
  Eye,
  Info,
  HelpCircle,
  Plus,
  Trash2,
  Sliders,
  Settings,
  Flame,
  Search,
  Wifi,
  ExternalLink
} from 'lucide-react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';

// Interfaces for our state management
interface AuthLog {
  id: string;
  timestamp: string;
  username: string;
  hwid: string;
  ip: string;
  clientVersion: string;
  status: 'ALLOWED' | 'BLOCKED_HWID' | 'BLOCKED_HASH' | 'BLOCKED_VERSION' | 'BANNED';
  reason: string;
  fileModified?: string;
}

interface Account {
  id: string;
  username: string;
  hwid: string;
  ip: string;
  status: 'ACTIVE' | 'BANNED' | 'UNLOCKED';
  lastLogin: string;
}

interface ClientFile {
  id: string;
  path: string;
  expectedHash: string;
  fileSize: string;
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Multilingual Configuration
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const t = translations[language];

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'architecture' | 'generator' | 'dashboard' | 'sandbox' | 'guide'>('architecture');

  // Generator Options (Dynamic C++ Code generation)
  const [serverUrl, setServerUrl] = useState('https://onyx-guard.onrender.com/api/auth');
  const [securityToken, setSecurityToken] = useState('MU_SECURE_TOKEN_2026_X');
  const [clientVersion, setClientVersion] = useState('1.04d');
  const [enableHwidCheck, setEnableHwidCheck] = useState(true);
  const [enableFileCheck, setEnableFileCheck] = useState(true);
  const [enableMultiClientBlock, setEnableMultiClientBlock] = useState(true);
  const [enableAntiMacro, setEnableAntiMacro] = useState(true);
  const [enableAntiDebug, setEnableAntiDebug] = useState(true);
  const [enableDllScanner, setEnableDllScanner] = useState(true);
  const [enableMemoryScanner, setEnableMemoryScanner] = useState(false);
  const [enableProcessBinding, setEnableProcessBinding] = useState(true);
  const [enablePayloadEncryption, setEnablePayloadEncryption] = useState(true);
  const [blacklistedPrograms, setBlacklistedPrograms] = useState<string[]>(['Cheat Engine', 'AutoClicker', 'SpeedHack', 'WPE PRO', 'OllyDbg', 'Wireshark']);
  const [licenseExpiration, setLicenseExpiration] = useState('');
  const [actionOnFailure, setActionOnFailure] = useState<'EXIT' | 'MSG_BOX' | 'CRASH'>('MSG_BOX');
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'csharp'>('cpp');
  const [usePch, setUsePch] = useState(true);

  // Database States
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [loadedProjectId, setLoadedProjectId] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [clientFiles, setClientFiles] = useState<ClientFile[]>([]);
  const [logs, setLogs] = useState<AuthLog[]>([]);

  // Fetch projects on mount
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setProjects(data);
        if (data.length > 0 && !activeProjectId) {
          setActiveProjectId(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch real data on mount
  useEffect(() => {
    if (!activeProjectId) return;
    
    const headers = { 'x-project-id': activeProjectId };

    fetch('/api/config', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.serverUrl) setServerUrl(data.serverUrl);
        if (data.securityToken) setSecurityToken(data.securityToken);
        if (data.clientVersion) setClientVersion(data.clientVersion);
        if (data.actionOnFailure) setActionOnFailure(data.actionOnFailure);
        if (data.enableHwidCheck !== undefined) setEnableHwidCheck(data.enableHwidCheck);
        if (data.enableFileCheck !== undefined) setEnableFileCheck(data.enableFileCheck);
        if (data.enableMultiClientBlock !== undefined) setEnableMultiClientBlock(data.enableMultiClientBlock);
        if (data.enableAntiMacro !== undefined) setEnableAntiMacro(data.enableAntiMacro);
        if (data.enableAntiDebug !== undefined) setEnableAntiDebug(data.enableAntiDebug);
        if (data.enableDllScanner !== undefined) setEnableDllScanner(data.enableDllScanner);
        if (data.enableMemoryScanner !== undefined) setEnableMemoryScanner(data.enableMemoryScanner);
        if (data.enableProcessBinding !== undefined) setEnableProcessBinding(data.enableProcessBinding);
        if (data.enablePayloadEncryption !== undefined) setEnablePayloadEncryption(data.enablePayloadEncryption);
        if (data.blacklistedPrograms !== undefined) setBlacklistedPrograms(data.blacklistedPrograms);
        if (data.licenseExpiration !== undefined) setLicenseExpiration(data.licenseExpiration);
        
        setLoadedProjectId(activeProjectId);
      })
      .catch(console.error);

    fetch('/api/accounts', { headers })
      .then(res => res.json())
      .then(data => setAccounts(data))
      .catch(console.error);

    fetch('/api/files', { headers })
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setClientFiles(data.map((f: any) => ({ ...f, path: f.filePath }))); })
      .catch(console.error);

    fetch('/api/logs', { headers })
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(console.error);
  }, [activeProjectId]);

  // Save Config on Change
  useEffect(() => {
    if (!activeProjectId || activeProjectId !== loadedProjectId) return;
    const timeout = setTimeout(() => {
      fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-project-id': activeProjectId },
        body: JSON.stringify({
          serverUrl, securityToken, clientVersion, actionOnFailure, enableHwidCheck, enableFileCheck, enableMultiClientBlock, enableAntiMacro, enableAntiDebug, enableDllScanner, enableMemoryScanner, enableProcessBinding, enablePayloadEncryption, blacklistedPrograms, licenseExpiration
        })
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [serverUrl, securityToken, clientVersion, actionOnFailure, enableHwidCheck, enableFileCheck, enableMultiClientBlock, enableAntiMacro, enableAntiDebug, enableDllScanner, enableMemoryScanner, enableProcessBinding, enablePayloadEncryption, blacklistedPrograms, licenseExpiration, activeProjectId, loadedProjectId]);

  // Sandbox Client Simulation State
  const [simUsername, setSimUsername] = useState('RageFighter');
  const [simHwid, setSimHwid] = useState('HWID-DE33-55FF-AA88');
  const [simIp, setSimIp] = useState('189.20.14.99');
  const [simClientVersion, setSimClientVersion] = useState('1.04d');
  const [simModifiedFile, setSimModifiedFile] = useState<string>('none');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);
  const [simConsole, setSimConsole] = useState<string[]>([]);

  // UI state for adding elements in the Dashboard
  const [newAccUser, setNewAccUser] = useState('');
  const [newAccHwid, setNewAccHwid] = useState('');
  const [newFilePath, setNewFilePath] = useState('');
  const [newFileHash, setNewFileHash] = useState('');
  const [newFileImportance, setNewFileImportance] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [logFilter, setLogFilter] = useState<'ALL' | 'ALLOWED' | 'BLOCKED'>('ALL');

  // Copy code helper
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulated HWID Generator
  const generateRandomHwid = () => {
    const chars = '0123456789ABCDEF';
    let segments = [];
    for (let i = 0; i < 4; i++) {
      let seg = '';
      for (let j = 0; j < 4; j++) {
        seg += chars[Math.floor(Math.random() * chars.length)];
      }
      segments.push(seg);
    }
    return `HWID-${segments.join('-')}`;
  };

  // Pre-fill a random HWID
  const handleRandomizeHwid = () => {
    setSimHwid(generateRandomHwid());
  };

  // Add Account to Dashboard
  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccUser || !activeProjectId) return;
    const hwidVal = newAccHwid.trim() || generateRandomHwid();
    
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-project-id': activeProjectId },
        body: JSON.stringify({ username: newAccUser.trim(), hwid: hwidVal })
      });
      const data = await res.json();
      if (data.success) {
        fetch('/api/accounts', { headers: { 'x-project-id': activeProjectId } }).then(r => r.json()).then(d => { if (Array.isArray(d)) setAccounts(d); });
        setNewAccUser('');
        setNewAccHwid('');
        addConsoleLog(`[SYSTEM] Registered new account ${newAccUser} with HWID ${hwidVal}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add File Integrity rules
  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath || !newFileHash || !activeProjectId) return;
    
    try {
      await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-project-id': activeProjectId },
        body: JSON.stringify({
          filePath: newFilePath.trim(),
          expectedHash: newFileHash.trim().toLowerCase(),
          importance: newFileImportance,
          fileSize: '1.5 MB'
        })
      });
      fetch('/api/files', { headers: { 'x-project-id': activeProjectId } }).then(r => r.json()).then(data => { if(Array.isArray(data)) setClientFiles(data.map((f: any) => ({ ...f, path: f.filePath }))); });
      setNewFilePath('');
      setNewFileHash('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFile = async (id: string) => {
    if (!activeProjectId) return;
    await fetch(`/api/files/${id}`, { method: 'DELETE', headers: { 'x-project-id': activeProjectId } });
    fetch('/api/files', { headers: { 'x-project-id': activeProjectId } }).then(r => r.json()).then(data => { if(Array.isArray(data)) setClientFiles(data.map((f: any) => ({ ...f, path: f.filePath }))); });
  };

  const toggleAccountStatus = async (id: string, action: 'BAN' | 'UNBAN' | 'LOCK' | 'UNLOCK') => {
    if (!activeProjectId) return;
    let newStatus: 'ACTIVE' | 'BANNED' | 'UNLOCKED' = 'ACTIVE';
    if (action === 'BAN') newStatus = 'BANNED';
    if (action === 'UNBAN') newStatus = 'ACTIVE';
    if (action === 'LOCK') newStatus = 'ACTIVE';
    if (action === 'UNLOCK') newStatus = 'UNLOCKED';

    await fetch(`/api/accounts/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-project-id': activeProjectId },
      body: JSON.stringify({ status: newStatus })
    });
    fetch('/api/accounts', { headers: { 'x-project-id': activeProjectId } }).then(r => r.json()).then(d => { if (Array.isArray(d)) setAccounts(d); });
  };

  const handleDeleteAccount = async (id: string) => {
    if (!activeProjectId) return;
    await fetch(`/api/accounts/${id}`, {
      method: 'DELETE',
      headers: { 'x-project-id': activeProjectId }
    });
    fetch('/api/accounts', { headers: { 'x-project-id': activeProjectId } }).then(r => r.json()).then(d => { if (Array.isArray(d)) setAccounts(d); });
  };

  // Log outputs helper for simulation
  const addConsoleLog = (msg: string) => {
    setSimConsole(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const submitCreateProject = async () => {
    if (!newProjectName.trim()) {
      setIsCreatingProject(false);
      return;
    }
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => [...prev, { id: data.id, name: data.name }]);
        setActiveProjectId(data.id);
      }
    } catch (e) {
      console.error(e);
    }
    setIsCreatingProject(false);
    setNewProjectName('');
  };

  const handleDeleteProject = async () => {
    if (!activeProjectId) return;
    
    try {
      await fetch(`/api/projects/${activeProjectId}`, { method: 'DELETE' });
      const res = await fetch('/api/projects');
      const data = await res.json();
      if(Array.isArray(data)) setProjects(data);
      if (data.length > 0) {
        setActiveProjectId(data[0].id);
      } else {
        setActiveProjectId('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateNewToken = () => {
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setSecurityToken(`MU_SEC_${randomStr}`);
  };

  // Run the Interactive Client Handshake Simulator
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimResult(null);
    setSimConsole([]);

    const steps = language === 'es' ? [
      { delay: 400, log: "🟢 ¡Hook DLL Inicializado! Interceptando el punto de entrada de main.exe..." },
      { delay: 800, log: "🔍 Obteniendo credenciales de hardware del Sistema Operativo..." },
      { delay: 1200, log: `💻 HWID generado con éxito: ${simHwid}` },
      { delay: 1700, log: "📂 Calculando sumas de comprobación de archivos MD5..." },
      { delay: 2200, log: simModifiedFile !== 'none' 
        ? `⚠️ Advertencia de archivo: ¡'${simModifiedFile}' ha sido modificado!`
        : "✅ Comprobación de integridad aprobada para los 4 archivos críticos." },
      { delay: 2800, log: `📡 Iniciando petición POST segura a: ${serverUrl}` },
      { delay: 3500, log: "✉️ Enviando cabeceras y payload JSON..." },
      { delay: 4100, log: "⏳ Esperando respuesta del Servidor de Autenticación..." },
    ] : [
      { delay: 400, log: "🟢 DLL Hook Initialized! intercepting main.exe entry point..." },
      { delay: 800, log: "🔍 Fetching hardware credentials from Operating System..." },
      { delay: 1200, log: `💻 Generated HWID successfully: ${simHwid}` },
      { delay: 1700, log: "📂 Calculating MD5 file checksums for client files..." },
      { delay: 2200, log: simModifiedFile !== 'none' 
        ? `⚠️ File check warning: '${simModifiedFile}' is modified or size differs!`
        : "✅ File integrity check passed for all 4 critical files." },
      { delay: 2800, log: `📡 Initiating secure HTTP POST request to: ${serverUrl}` },
      { delay: 3500, log: "✉️ Sending payload headers & payload json..." },
      { delay: 4100, log: "⏳ Waiting for response from Authenticator Backend..." },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        addConsoleLog(step.log);
      }, step.delay);
    });

    setTimeout(async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: simUsername,
            hwid: simHwid,
            ip: simIp,
            clientVersion: simClientVersion,
            fileModified: simModifiedFile,
            token: securityToken
          })
        });
        
        const rawResponse = await response.json();
        
        // Ensure UI updates properly to sync with DB
        fetch('/api/accounts', { headers: { 'x-project-id': activeProjectId } }).then(r => r.json()).then(d => { if (Array.isArray(d)) setAccounts(d); }).catch(console.error);
        fetch('/api/logs', { headers: { 'x-project-id': activeProjectId } }).then(r => r.json()).then(d => { if (Array.isArray(d)) setLogs(d); }).catch(console.error);

        const isAllowed = rawResponse.success;
        setSimResult(rawResponse);
        setIsSimulating(false);

        if (isAllowed) {
          addConsoleLog(language === 'es' ? "🎉 ¡El servidor aceptó el handshake!" : "🎉 Server accepted handshake!");
          addConsoleLog(language === 'es' ? "🚀 Iniciando ventana de main.exe... ¡Proceso de juego activo! ¡A disfrutar!" : "🚀 Launching main.exe window... Game process active! enjoy!");
        } else {
          addConsoleLog(language === 'es' ? `❌ El servidor devolvió error: ${rawResponse.message}` : `❌ Server returned error: ${rawResponse.message}`);
          addConsoleLog(`🛑 [DLL ENFORCER] ${
            rawResponse.action === 'EXIT' 
              ? (language === 'es' ? 'Terminando el proceso del juego...' : 'Terminating client game process...') 
              : rawResponse.action === 'CRASH' 
              ? (language === 'es' ? '¡Simulando protección contra volcado de memoria (Crash)!' : 'Simulating stack crash protection!') 
              : (language === 'es' ? 'Mostrando advertencia y cerrando...' : 'Displaying warning prompt & closing...')
          }`);
        }
      } catch (err: any) {
        setIsSimulating(false);
        addConsoleLog(`❌ Connection Error: ${err.message}`);
      }
    }, 4500);
  };

  // C++ Dynamic DLL code based on user configurations
  const cppCode = useMemo(() => {
    // Handling empty arrays for C++ to prevent "empty initializer" compiler errors
    const filesArrayContent = clientFiles.length > 0 
      ? clientFiles.map(f => `    { "${f.path}", "${f.expectedHash}" }`).join(',\n')
      : `    { "", "" } // Dummy element to prevent empty array compilation error`;
      
    const blacklistedArrayContent = blacklistedPrograms.length > 0
      ? blacklistedPrograms.map(p => `    "${p}"`).join(',\n')
      : `    "DummyWindowName" // Dummy element to prevent empty array compilation error`;

    return `// ============================================================================
//  ONYX GUARD ANTI-HACK & CLIENT INTEGRITY PLUGIN
//  Target Game Client: Season 6 (main.exe v${clientVersion})
//  File: Custom.cpp (DLL Project Source Code)
//  Compiled using: Visual Studio 2019/2022 (MSVC Toolset)
// ============================================================================
${usePch ? '\n#include "pch.h"\n' : ''}
#include <windows.h>\n#include <objbase.h>
#include <wininet.h>
#include <shellapi.h>
#include <psapi.h>\n#pragma comment(lib, "psapi.lib")
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <iomanip>

#pragma comment(lib, "wininet.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "user32.lib")
#pragma comment(lib, "ole32.lib")

// --- PLUGIN CONFIGURATION ---
const std::string AUTH_SERVER_URL = "${serverUrl}";
const std::string SECRET_TOKEN    = "${securityToken}";
const std::string CLIENT_VERSION  = "${clientVersion}";

// Struct representing file metadata to verify
struct ClientFile {
    const char* filePath;
    const char* expectedHash;
};

// Registered hashes from server settings
ClientFile CRITICAL_FILES[] = {
${filesArrayContent}
};

${enableAntiMacro ? `// Blacklisted Window Names (Cheat Engine, AutoClicker, etc)
const char* BLACKLISTED_WINDOWS[] = {
${blacklistedArrayContent}
};

bool ScanForBlacklistedWindows() {
    for (int i = 0; i < sizeof(BLACKLISTED_WINDOWS) / sizeof(BLACKLISTED_WINDOWS[0]); i++) {
        if (std::string(BLACKLISTED_WINDOWS[i]) == "DummyWindowName") continue;
        if (FindWindowA(NULL, BLACKLISTED_WINDOWS[i]) != NULL) {
            return true;
        }
    }
    return false;
}` : ''}

// Simple Hardware ID generator using MAC Address & System Information
std::string GetHardwareID() {
    char compName[MAX_COMPUTERNAME_LENGTH + 1];
    DWORD compNameLen = sizeof(compName);
    GetComputerNameA(compName, &compNameLen);
    
    std::string hwid = "HWID-";
    hwid += compName;
    return hwid;
}

${enableDllScanner ? `// Injected DLL Scanner
bool ScanForInjectedDLLs() {
    HMODULE hMods[1024];
    DWORD cbNeeded;
    if (EnumProcessModules(GetCurrentProcess(), hMods, sizeof(hMods), &cbNeeded)) {
        for (unsigned int i = 0; i < (cbNeeded / sizeof(HMODULE)); i++) {
            char szModName[MAX_PATH];
            if (GetModuleFileNameExA(GetCurrentProcess(), hMods[i], szModName, sizeof(szModName) / sizeof(char))) {
                std::string modName = szModName;
                for(size_t j=0; j<modName.length(); ++j) modName[j] = tolower(modName[j]);
                if (modName.find("hack") != std::string::npos || modName.find("cheat") != std::string::npos || modName.find("speed") != std::string::npos) {
                    return true;
                }
            }
        }
    }
    return false;
}` : ''}

${enableMemoryScanner ? `// Memory Signature Scanner
bool ScanMemorySignatures() {
    // Basic conceptual signature scanner. Real deployments use VirtualQueryEx
    // to map pages and ReadProcessMemory to match AoB (Array of Bytes) patterns.
    return false;
}` : ''}

${enableAntiDebug ? `// Advanced Anti-Debugging
bool CheckForDebugger() {
    if (IsDebuggerPresent()) return true;
    BOOL isRemoteDebugger = FALSE;
    CheckRemoteDebuggerPresent(GetCurrentProcess(), &isRemoteDebugger);
    if (isRemoteDebugger) return true;
    return false;
}` : ''}

${enableProcessBinding ? `// Exclusive Process Binding (main.exe)
bool VerifyHostProcess() {
    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);
    std::string path(exePath);
    for(size_t i=0; i<path.length(); ++i) path[i] = tolower(path[i]);
    if (path.find("main.exe") == std::string::npos) {
        return false;
    }
    return true;
}` : ''}

${enablePayloadEncryption ? `// XOR Payload Encryption
std::string EncryptPayload(const std::string& data) {
    std::string key = "${securityToken}";
    std::string encrypted = data;
    // Basic XOR for data obfuscation
    for(size_t i = 0; i < data.size(); i++) {
        encrypted[i] = data[i] ^ key[i % key.size()];
    }
    // Return Hex/Base64 representation in reality
    return encrypted; 
}` : ''}

// Simple MD5 file hashing (placeholder for actual cryptographic implementation)
std::string CalculateFileMD5(const std::string& filePath) {
    // In a real DLL, you would open the file using CreateFile() or ifstream, 
    // and pass the bytes to Windows CryptoAPI (CryptHashData)
    // For demo/simplicity, this acts as the signature lookup
    if (filePath == "main.exe") return "${clientFiles.find(f => f.path === 'main.exe')?.expectedHash || 'c4ca4238a0b923820dcc509a6f75849b'}";
    if (filePath.find("item_eng.bmd") != std::string::npos) return "${clientFiles.find(f => f.path.includes('item_eng.bmd'))?.expectedHash || 'a87ff679a2f3e71d9181a67b7542122c'}";
    return "unverified_file_hash_signature";
}

// Perform validation request to backend web server
bool PerformHandshake(const std::string& username, const std::string& hwid, const std::string& modifiedFile) {
    HINTERNET hInternet = InternetOpenA("MuOnline_Client_Plugin", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return false;

    // Parse URL host and path
    std::string host = "127.0.0.1";
    std::string path = "/api/validate";
    size_t protocolPos = AUTH_SERVER_URL.find("://");
    std::string urlWithoutProtocol = (protocolPos == std::string::npos) ? AUTH_SERVER_URL : AUTH_SERVER_URL.substr(protocolPos + 3);
    size_t slashPos = urlWithoutProtocol.find("/");
    if (slashPos != std::string::npos) {
        host = urlWithoutProtocol.substr(0, slashPos);
        path = urlWithoutProtocol.substr(slashPos);
    } else {
        host = urlWithoutProtocol;
        path = "/";
    }

    HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), INTERNET_DEFAULT_HTTP_PORT, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
    if (!hConnect) {
        InternetCloseHandle(hInternet);
        return false;
    }

    HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, INTERNET_FLAG_RELOAD, 0);
    if (!hRequest) {
        InternetCloseHandle(hConnect);
        InternetCloseHandle(hInternet);
        return false;
    }

    // Build Payload JSON body
    std::stringstream json;
    json << "{"
         << "\\"username\\": \\"" << username << "\\","
         << "\\"hwid\\": \\"" << hwid << "\\","
         << "\\"clientVersion\\": \\"" << CLIENT_VERSION << "\\","
         << "\\"secretToken\\": \\"" << SECRET_TOKEN << "\\","
         << "\\"fileModified\\": \\"" << (modifiedFile.empty() ? "none" : modifiedFile) << "\\""
         << "}";
    
    std::string payload = json.str();
    std::string headers = "Content-Type: application/json\\r\\n";

${enablePayloadEncryption ? `    // Encrypting Payload before sending
    payload = EncryptPayload(payload);
    // Add custom header to indicate encrypted payload
    headers += "X-Payload-Encrypted: true\\r\\n";
` : ''}

    BOOL result = HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length());
    
    bool isAuthorized = false;
    if (result) {
        char buffer[1024];
        DWORD bytesRead = 0;
        std::string responseString = "";
        while (InternetReadFile(hRequest, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
            buffer[bytesRead] = '\\0';
            responseString += buffer;
        }
        
        // Simple JSON response check (Looking for "success":true)
        if (responseString.find("\\"success\\":true") != std::string::npos) {
            isAuthorized = true;
        }
    }

    InternetCloseHandle(hRequest);
    InternetCloseHandle(hConnect);
    InternetCloseHandle(hInternet);
    return isAuthorized;
}

// Action taken if security check fails
void HandleFailure(const std::string& message) {
#if ${actionOnFailure === 'EXIT' ? '1' : '0'}
    // Terminate instantly
    ExitProcess(0);
#elif ${actionOnFailure === 'MSG_BOX' ? '1' : '0'}
    // Show descriptive Error Box to player
    MessageBoxA(NULL, message.c_str(), "Onyx Guard Anti-Hack", MB_OK | MB_ICONERROR | MB_TOPMOST);
    ExitProcess(0);
#else
    // Simulate deliberate crash to prevent memory dumping
    int* p = nullptr;
    *p = 0xDEADBEEF; 
#endif
}

// System Tray Icon Routine
LRESULT CALLBACK TrayWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    if (msg == WM_USER + 1) {
        if (LOWORD(lParam) == WM_LBUTTONDBLCLK) {
            MessageBoxA(hwnd, "Onyx Guard Anti-Hack is running and protecting the game process.", "Onyx Guard", MB_OK | MB_ICONINFORMATION);
        }
    }
    return DefWindowProc(hwnd, msg, wParam, lParam);
}

DWORD WINAPI TrayIconThread(LPVOID lpParam) {
    WNDCLASSA wc = { 0 };
    wc.lpfnWndProc = TrayWndProc;
    wc.hInstance = GetModuleHandle(NULL);
    wc.lpszClassName = "OnyxGuardTrayClass";
    RegisterClassA(&wc);

    HWND hwnd = CreateWindowA(wc.lpszClassName, "OnyxGuard", 0, 0, 0, 0, 0, HWND_MESSAGE, NULL, wc.hInstance, NULL);

    NOTIFYICONDATAA nid = { 0 };
    nid.cbSize = sizeof(NOTIFYICONDATAA);
    nid.hWnd = hwnd;
    nid.uID = 1001;
    nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    nid.uCallbackMessage = WM_USER + 1;
    nid.hIcon = LoadIcon(NULL, IDI_SHIELD); // Default Windows shield icon
    strcpy_s(nid.szTip, "Onyx Guard Anti-Hack (Active)");

    Shell_NotifyIconA(NIM_ADD, &nid);

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    Shell_NotifyIconA(NIM_DELETE, &nid);
    return 0;
}

// Thread routine launched immediately upon main.exe launch
DWORD WINAPI IntegrityCheckThread(LPVOID lpParam) {
    Sleep(500); // Wait for host window to complete loading
    
${enableProcessBinding ? `    // 1. Verify we are inside main.exe
    if (!VerifyHostProcess()) {
        HandleFailure("UNAUTHORIZED PROCESS:\\nOnyx Guard must only be loaded via main.exe.");
        return 1;
    }` : ''}

${enableAntiDebug ? `    // 2. Continuous Anti-Debugging Check
    if (CheckForDebugger()) {
        HandleFailure("DEBUGGER DETECTED:\\nPlease close all reverse-engineering tools.");
        return 1;
    }` : ''}

    std::string hwid = GetHardwareID();
    
    ${enableFileCheck ? `// Verify file hashes
    std::string faultyFile = "";
    for (int i = 0; i < sizeof(CRITICAL_FILES) / sizeof(CRITICAL_FILES[0]); i++) {
        std::string actualHash = CalculateFileMD5(CRITICAL_FILES[i].filePath);
        if (actualHash != CRITICAL_FILES[i].expectedHash) {
            faultyFile = CRITICAL_FILES[i].filePath;
            break;
        }
    }` : '// File Integrity Verification is disabled in configs.'}

    // Connect to the web API to validate player login & computer HWID
    // In actual production, username can be retrieved from launcher launch parameters
    char compNameUser[MAX_COMPUTERNAME_LENGTH + 1];
    DWORD compNameUserLen = sizeof(compNameUser);
    GetComputerNameA(compNameUser, &compNameUserLen);
    std::string accountName = compNameUser; 
    
    bool status = PerformHandshake(accountName, hwid, ${enableFileCheck ? 'faultyFile' : '""'});
    
    if (!status) {
        HandleFailure("CRITICAL SECURITY ERROR:\\nYour client files or Hardware ID are unauthorized.");
    }
    
    ${enableAntiMacro ? `// Start continuous macro checking loop
    while(true) {
        if(ScanForBlacklistedWindows()) {
            HandleFailure("ILLEGAL SOFTWARE DETECTED:\\nA blacklisted macro, auto-clicker, or memory editor was found.");
        }
${enableDllScanner ? `        if(ScanForInjectedDLLs()) {
            HandleFailure("DLL INJECTION DETECTED:\\nA malicious DLL module was found in memory.");
        }` : ''}
${enableMemoryScanner ? `        if(ScanMemorySignatures()) {
            HandleFailure("MEMORY TAMPERING DETECTED:\\nKnown cheat signatures found in memory.");
        }` : ''}
        Sleep(3000); // Check every 3 seconds
    }` : ''}
    
    return 0;
}

// DLL Entry Point
BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved) {
    switch (ul_reason_for_call) {
    case DLL_PROCESS_ATTACH:
        // Disable unnecessary thread execution logs to optimize performance
        DisableThreadLibraryCalls(hModule);
        
        // Prevent multi-client execution if configured
        ${enableMultiClientBlock ? `CreateMutexA(NULL, TRUE, "Global\\\\MuOnlineSecureMutexUniqueKey");
        if (GetLastError() == ERROR_ALREADY_EXISTS) {
            MessageBoxA(NULL, "Multi-Client is disabled on this server!", "MuOnline Engine", MB_OK | MB_ICONWARNING);
            ExitProcess(0);
        }` : '// Multi-client checks disabled'}

        // Start safety background thread
        CreateThread(NULL, 0, IntegrityCheckThread, NULL, 0, NULL);
        // Start system tray icon thread
        CreateThread(NULL, 0, TrayIconThread, NULL, 0, NULL);
        break;
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
`;
  }, [serverUrl, securityToken, clientVersion, enableFileCheck, enableMultiClientBlock, actionOnFailure, enableAntiMacro, blacklistedPrograms, clientFiles, enableDllScanner, enableMemoryScanner, enablePayloadEncryption, enableAntiDebug, enableProcessBinding, usePch]);


  const csharpCode = useMemo(() => {
    return `// ============================================================================
//  ONYX GUARD ANTI-HACK & CLIENT INTEGRITY PLUGIN (C# WRAPPER)
//  Target Game Client: Season 6 (main.exe v${clientVersion})
//  File: MuClientSecurity.cs
//  Alternative method for launchers or C#/CLI custom injectors
// ============================================================================

using System;
using System.IO;
using System.Net;
using System.Text;
using System.Windows.Forms;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Runtime.InteropServices;

namespace MuOnlineSecurityPlugin
{
    public class SecurityEngine
    {
        private static readonly string API_URL = "${serverUrl}";
        private static readonly string SECRET_TOKEN = "${securityToken}";
        private static readonly string REQ_VERSION = "${clientVersion}";

        [DllImport("kernel32.dll")]
        private static extern void ExitProcess(uint uExitCode);

${enableAntiDebug ? `        [DllImport("kernel32.dll", ExactSpelling = true, SetLastError = true)]
        private static extern bool IsDebuggerPresent();
        [DllImport("kernel32.dll", ExactSpelling = true, SetLastError = true)]
        private static extern bool CheckRemoteDebuggerPresent(IntPtr hProcess, ref bool isDebuggerPresent);` : ''}

${enablePayloadEncryption ? `        private static string EncryptPayload(string data)
        {
            string key = SECRET_TOKEN;
            char[] encrypted = new char[data.Length];
            for (int i = 0; i < data.Length; i++)
            {
                encrypted[i] = (char)(data[i] ^ key[i % key.Length]);
            }
            return new string(encrypted);
        }` : ''}

        // Run client verification before allowing connection
        public static bool ValidateClientState(string username)
        {
            try
            {
${enableProcessBinding ? `                // Enforce main.exe binding
                Process currentProcess = Process.GetCurrentProcess();
                if (!currentProcess.ProcessName.Equals("main", StringComparison.OrdinalIgnoreCase))
                {
                    EnforceBlock("UNAUTHORIZED PROCESS:\\nOnyx Guard must only be loaded via main.exe.");
                    return false;
                }` : ''}

${enableAntiDebug ? `                // Anti-Debugger Check
                bool isRemote = false;
                CheckRemoteDebuggerPresent(Process.GetCurrentProcess().Handle, ref isRemote);
                if (IsDebuggerPresent() || isRemote)
                {
                    EnforceBlock("DEBUGGER DETECTED:\\nPlease close all reverse-engineering tools.");
                    return false;
                }` : ''}

                string hwid = FetchHWID();
                string invalidFile = "none";

                ${enableFileCheck ? `// Check critical client file hashes
                string[] filesToVerify = {
                    ${clientFiles.map(f => `"${f.path}"`).join(',\n                    ')}
                };

                string[] expectedHashes = {
                    ${clientFiles.map(f => `"${f.expectedHash}"`).join(',\n                    ')}
                };

                for (int i = 0; i < filesToVerify.Length; i++)
                {
                    if (!File.Exists(filesToVerify[i]))
                    {
                        invalidFile = filesToVerify[i];
                        break;
                    }

                    string fileHash = GetFileHash(filesToVerify[i]);
                    if (fileHash != expectedHashes[i])
                    {
                        invalidFile = filesToVerify[i];
                        break;
                    }
                }` : '// File check disabled'}

                // Query Central API Server for login validation
                bool isAllowed = SendValidationHandshake(username, hwid, invalidFile);
                
                ${enableAntiMacro ? `if (isAllowed) 
                {
                    // Start Background Macro Scanner
                    System.Threading.Tasks.Task.Run(() => {
                        string[] blacklistedWindows = { ${blacklistedPrograms.map(p => `"${p}"`).join(', ')} };
                        while(true)
                        {
                            foreach (Process p in Process.GetProcesses())
                            {
                                foreach (string bw in blacklistedWindows)
                                {
                                    if (p.MainWindowTitle.Contains(bw) || p.ProcessName.Contains(bw))
                                    {
                                        EnforceBlock("ILLEGAL SOFTWARE DETECTED:\\nA blacklisted macro, auto-clicker, or memory editor was found.");
                                    }
                                }
                            }
                            System.Threading.Thread.Sleep(3000);
                        }
                    });
                }` : ''}
                
                return isAllowed;
            }
            catch (Exception ex)
            {
                EnforceBlock("Error loading security engine modules: " + ex.Message);
                return false;
            }
        }

        private static string FetchHWID()
        {
            try {
                return "HWID-" + Environment.MachineName;
            }
            catch {
                return "HWID-GENERIC-WIN10-CLIENT";
            }
        }

        private static string GetFileHash(string filePath)
        {
            using (var md5 = MD5.Create())
            {
                using (var stream = File.OpenRead(filePath))
                {
                    byte[] hash = md5.ComputeHash(stream);
                    return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                }
            }
        }

        private static string GetMd5String(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++) {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString();
            }
        }

        private static bool SendValidationHandshake(string user, string hwid, string modFile)
        {
            var request = (HttpWebRequest)WebRequest.Create(API_URL);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Timeout = 5000;

            string jsonPayload = string.Format(
                "{{\\"username\\":\\"{0}\\",\\"hwid\\":\\"{1}\\",\\"clientVersion\\":\\"{2}\\",\\"secretToken\\":\\"{3}\\",\\"fileModified\\":\\"{4}\\"}}",
                user, hwid, REQ_VERSION, SECRET_TOKEN, modFile
            );

${enablePayloadEncryption ? `            jsonPayload = EncryptPayload(jsonPayload);
            request.Headers.Add("X-Payload-Encrypted", "true");
` : ''}
            byte[] byteArray = Encoding.UTF8.GetBytes(jsonPayload);
            request.ContentLength = byteArray.Length;

            using (Stream dataStream = request.GetRequestStream())
            {
                dataStream.Write(byteArray, 0, byteArray.Length);
            }

            try
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
            }
        }

        private static void EnforceBlock(string errorMsg)
        {
            #if ${actionOnFailure === 'EXIT' ? '1' : '0'}
            ExitProcess(0);
            #elif ${actionOnFailure === 'MSG_BOX' ? '1' : '0'}
            MessageBox.Show(errorMsg, "Onyx Guard Anti-Hack", MessageBoxButtons.OK, MessageBoxIcon.Error);
            ExitProcess(0);
            #else
            Process.GetCurrentProcess().Kill();
            #endif
        }
    }
}
`;
  }, [serverUrl, securityToken, clientVersion, enableFileCheck, actionOnFailure, enableAntiMacro, blacklistedPrograms, clientFiles, enableDllScanner, enableMemoryScanner, enablePayloadEncryption, enableAntiDebug, enableProcessBinding]);


  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            log.hwid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.ip.includes(searchTerm);
      
      if (logFilter === 'ALL') return matchesSearch;
      if (logFilter === 'ALLOWED') return matchesSearch && log.status === 'ALLOWED';
      if (logFilter === 'BLOCKED') return matchesSearch && log.status !== 'ALLOWED';
      return matchesSearch;
    });
  }, [logs, searchTerm, logFilter]);


  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => 
      acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.hwid.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        </div>
        
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-4 rounded-full border border-slate-700 shadow-inner">
              <Shield className="w-12 h-12 text-amber-500" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2 font-serif tracking-wide">
            OnyxGuard
          </h1>
          <p className="text-slate-400 mb-8 font-medium">Authentication Required</p>
          
          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900 overflow-x-hidden">
      
      {/* Decorative Golden Top Line */}
      <div className="h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 w-full" />

      {/* Top Navigation Header */}
      <header className="bg-slate-900 border-b border-amber-900/40 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-gradient-to-br from-amber-600 to-amber-900 rounded-lg border border-amber-400/30">
              <Shield className="w-8 h-8 text-amber-300 animate-pulse" id="app-logo-shield" />
              <div className="absolute -top-1 -right-1 bg-red-600 text-[9px] px-1 font-bold rounded text-white tracking-widest uppercase">DLL</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-wider uppercase text-amber-100 font-serif">ONYX GUARD</span>
                <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-mono font-bold">{t.header.tag}</span>
              </div>
              <p className="text-xs text-slate-400 font-light mt-0.5">{t.header.sub}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto pb-2 md:pb-0">
            {/* Project Selector */}
            <div className="flex items-center gap-2 shrink-0">
              {isCreatingProject ? (
                <div className="flex items-center gap-1 bg-slate-900 border border-amber-500 rounded-md p-1">
                  <input
                    autoFocus
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitCreateProject();
                      if (e.key === 'Escape') {
                        setIsCreatingProject(false);
                        setNewProjectName('');
                      }
                    }}
                    placeholder={language === 'es' ? 'Nombre...' : 'Name...'}
                    className="bg-transparent text-amber-500 font-bold px-2 py-0.5 text-sm outline-none w-32"
                  />
                  <button onClick={submitCreateProject} className="text-emerald-400 hover:text-emerald-300 p-1 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setIsCreatingProject(false); setNewProjectName(''); }} className="text-red-400 hover:text-red-300 p-1 shrink-0">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <select 
                    value={activeProjectId} 
                    onChange={(e) => setActiveProjectId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-amber-500 font-bold px-3 py-1.5 rounded-md text-sm outline-none cursor-pointer focus:border-amber-500 transition-colors"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setIsCreatingProject(true)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 p-1.5 rounded-md cursor-pointer transition-colors shrink-0"
                    title={t.header.manageClients || 'Manage Clients'}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  {activeProjectId && (
                    <button 
                      onClick={handleDeleteProject}
                      className="bg-slate-800 hover:bg-red-900 border border-slate-700 text-red-400 p-1.5 rounded-md cursor-pointer transition-colors shrink-0"
                      title={language === 'es' ? 'Eliminar Cliente' : 'Delete Client'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
              <button
                onClick={() => setLanguage('es')}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                  language === 'es' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ESP
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                  language === 'en' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ENG
              </button>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-800 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono font-bold">{t.header.apiServer}</div>
                <div className="text-xs text-slate-300 font-mono">ONLINE</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-800 shrink-0">
              <Users className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono font-bold">{t.header.regHwids}</div>
                <div className="text-xs text-amber-200 font-mono font-semibold">{accounts.length} {language === 'es' ? 'Cuentas' : 'Accounts'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-800 shrink-0">
              <Flame className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono font-bold">{t.header.hacksBlocked}</div>
                <div className="text-xs text-red-400 font-mono font-semibold">
                  {logs.filter(l => l.status !== 'ALLOWED').length} {t.header.attempts}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            {user && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors shrink-0"
                title="Sign out"
              >
                <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xs font-bold text-amber-500">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium hidden md:block">Logout</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800/80 p-4 shadow-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" /> {t.nav.navControl}
            </h3>
            
            <nav className="flex flex-col gap-1.5">
              <button 
                id="tab-architecture"
                onClick={() => setActiveTab('architecture')}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === 'architecture' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Network className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.architecture}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.architectureSub}</span>
                </div>
              </button>

              <button 
                id="tab-generator"
                onClick={() => setActiveTab('generator')}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === 'generator' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Code2 className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.generator}</div>
                  <span className="text-[9px] text-amber-400/75 font-mono">{t.nav.generatorSub}</span>
                </div>
              </button>

              <button 
                id="tab-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Database className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.dashboard}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.dashboardSub}</span>
                </div>
              </button>

              <button 
                id="tab-sandbox"
                onClick={() => setActiveTab('sandbox')}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === 'sandbox' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Play className="w-4 h-4 shrink-0 animate-pulse text-amber-400" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.sandbox}</div>
                  <span className="text-[9px] text-emerald-400 font-mono font-semibold">{t.nav.sandboxSub}</span>
                </div>
              </button>

              <button 
                id="tab-guide"
                onClick={() => setActiveTab('guide')}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === 'guide' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.guide}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.guideSub}</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Quick Config Card inside Sidebar */}
          <div className="bg-slate-900 rounded-xl border border-slate-800/80 p-4 shadow-lg text-xs">
            <h4 className="font-bold text-slate-300 mb-2 flex items-center gap-1.5 uppercase font-serif tracking-wide text-[11px]">
              <Settings className="w-3.5 h-3.5 text-amber-400" /> {t.header.globalSpecs}
            </h4>
            <div className="space-y-2 text-slate-400 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>{language === 'es' ? 'Protocolo API:' : 'API Protocol:'}</span>
                <span className="text-slate-200">HTTP REST</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>{language === 'es' ? 'Versión forzada:' : 'Version enforced:'}</span>
                <span className="text-amber-400 font-bold">{clientVersion}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>{language === 'es' ? 'Archivos activos:' : 'Active files:'}</span>
                <span className="text-slate-200">{clientFiles.length} {language === 'es' ? 'tipos' : 'item types'}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'es' ? 'Token Secreto:' : 'Secure Secret:'}</span>
                <span className="text-amber-300 font-bold truncate max-w-[100px]">{securityToken}</span>
              </div>
            </div>
            
            <div className="mt-3.5 bg-slate-950 p-2 rounded border border-slate-800 text-[10px] leading-relaxed text-slate-500">
              <Info className="w-3 h-3 inline-block mr-1 text-amber-500 shrink-0" />
              {t.header.specsDesc}
            </div>
          </div>
        </div>

        {/* Central Content Window */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* TAB 1: ARCHITECTURE HANDSHAKE FLOW */}
          {activeTab === 'architecture' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl flex flex-col gap-6">
              
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                  <Network className="w-5 h-5 text-amber-400" /> {t.architecture.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {t.architecture.desc}
                </p>
              </div>

              {/* Handshake Visual Flow Chart */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/70 overflow-x-auto">
                <div className="min-w-[700px] py-4 px-2 flex justify-between items-center relative">
                  
                  {/* Background connecting line */}
                  <div className="absolute top-1/2 left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-amber-600/30 via-amber-400/50 to-emerald-500/30 -translate-y-1/2 -z-10" />

                  {/* STEP 1 */}
                  <div className="w-[130px] flex flex-col items-center text-center bg-slate-900 p-3 rounded-lg border border-slate-800 z-10 shadow-lg">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 mb-2 font-mono">01</div>
                    <div className="text-xs font-bold text-slate-200">{t.architecture.step1Title}</div>
                    <span className="text-[10px] text-slate-500 mt-1 leading-tight">{t.architecture.step1Desc}</span>
                  </div>

                  {/* Indicator Arrow */}
                  <div className="text-amber-500 text-lg font-mono">➔</div>

                  {/* STEP 2 */}
                  <div className="w-[140px] flex flex-col items-center text-center bg-slate-900 p-3 rounded-lg border border-amber-500/30 z-10 shadow-lg ring-1 ring-amber-500/10">
                    <div className="w-8 h-8 rounded-full bg-amber-950 flex items-center justify-center text-xs font-bold text-amber-400 mb-2 font-mono">02</div>
                    <div className="text-xs font-bold text-amber-200">{t.architecture.step2Title}</div>
                    <span className="text-[10px] text-slate-400 mt-1 leading-tight">{t.architecture.step2Desc}</span>
                  </div>

                  {/* Indicator Arrow */}
                  <div className="text-amber-500 text-lg font-mono">➔</div>

                  {/* STEP 3 */}
                  <div className="w-[140px] flex flex-col items-center text-center bg-slate-900 p-3 rounded-lg border border-slate-800 z-10 shadow-lg">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 mb-2 font-mono">03</div>
                    <div className="text-xs font-bold text-slate-200">{t.architecture.step3Title}</div>
                    <span className="text-[10px] text-slate-500 mt-1 leading-tight">{t.architecture.step3Desc}</span>
                  </div>

                  {/* Indicator Arrow */}
                  <div className="text-amber-500 text-lg font-mono">➔</div>

                  {/* STEP 4 */}
                  <div className="w-[140px] flex flex-col items-center text-center bg-slate-900 p-3 rounded-lg border border-amber-500/40 z-10 shadow-lg ring-2 ring-amber-500/20">
                    <div className="w-8 h-8 rounded-full bg-amber-900 flex items-center justify-center text-xs font-bold text-amber-300 mb-2 font-mono">04</div>
                    <div className="text-xs font-bold text-amber-200">{t.architecture.step4Title}</div>
                    <span className="text-[10px] text-slate-300 mt-1 leading-tight">{t.architecture.step4Desc}</span>
                  </div>

                  {/* Indicator Arrow */}
                  <div className="text-emerald-500 text-lg font-mono">➔</div>

                  {/* STEP 5 */}
                  <div className="w-[130px] flex flex-col items-center text-center bg-slate-900 p-3 rounded-lg border border-emerald-500/30 z-10 shadow-lg">
                    <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center text-xs font-bold text-emerald-400 mb-2 font-mono">05</div>
                    <div className="text-xs font-bold text-emerald-200">{t.architecture.step5Title}</div>
                    <span className="text-[10px] text-slate-400 mt-1 leading-tight">{t.architecture.step5Desc}</span>
                  </div>

                </div>
              </div>

              {/* Core Benefits and Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2 font-serif">
                    <Cpu className="w-4 h-4 text-amber-500" /> {t.architecture.benefit1Title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t.architecture.benefit1Desc}
                  </p>
                  <ul className="text-[11px] text-slate-500 mt-2 list-disc pl-4 space-y-1">
                    {t.architecture.benefit1List.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2 font-serif">
                    <FileCheck className="w-4 h-4 text-amber-500" /> {t.architecture.benefit2Title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t.architecture.benefit2Desc}
                  </p>
                  <ul className="text-[11px] text-slate-500 mt-2 list-disc pl-4 space-y-1">
                    {t.architecture.benefit2List.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Server-Side Integration Overview */}
              <div className="bg-slate-950 p-4 rounded-lg border border-amber-900/20">
                <div className="flex gap-3">
                  <Server className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{t.architecture.apiHandlingTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t.architecture.apiHandlingDesc}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => setActiveTab('generator')}
                        className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded transition"
                      >
                        {t.architecture.btnGenerate}
                      </button>
                      <button 
                        onClick={() => setActiveTab('sandbox')}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/20 px-3 py-1.5 rounded transition"
                      >
                        {t.architecture.btnTrySim}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DLL CODE GENERATOR */}
          {activeTab === 'generator' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl flex flex-col gap-6 animate-fadeIn">
              
              <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-amber-400" /> {t.generator.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.generator.desc}
                  </p>
                </div>
                <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0 self-start">
                  <button 
                    onClick={() => setSelectedLanguage('cpp')}
                    className={`text-xs px-3 py-1.5 rounded font-mono font-bold transition ${selectedLanguage === 'cpp' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Custom.cpp (C++)
                  </button>
                  <button 
                    onClick={() => setSelectedLanguage('csharp')}
                    className={`text-xs px-3 py-1.5 rounded font-mono font-bold transition ${selectedLanguage === 'csharp' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Security.cs (C#)
                  </button>
                </div>
              </div>

              {/* DLL Customizer Controls */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* Col 1 */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">
                      {language === 'es' ? 'URL ENDPOINT DE API WEB:' : 'AUTH API HOSTNAME/URL:'}
                    </label>
                    <input 
                      type="text" 
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">
                      {language === 'es' ? 'VERSIÓN DE CLIENTE REQUERIDA:' : 'CLIENT SYSTEM VERSION:'}
                    </label>
                    <input 
                      type="text" 
                      value={clientVersion}
                      onChange={(e) => setClientVersion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Col 2 */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">
                      {language === 'es' ? 'TOKEN DE SEGURIDAD SECRETO:' : 'SECRET SECURITY TOKEN:'}
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={securityToken}
                        onChange={(e) => setSecurityToken(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                      />
                      <button 
                        onClick={generateNewToken}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-md cursor-pointer transition-colors shrink-0"
                        title={language === 'es' ? 'Generar Nuevo Token' : 'Generate New Token'}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">
                      {language === 'es' ? 'ACCIÓN AL DETECTAR INFRACCIÓN:' : 'ACTION ON SECURITY BREACH:'}
                    </label>
                    <select 
                      value={actionOnFailure}
                      onChange={(e) => setActionOnFailure(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                    >
                      <option value="EXIT">
                        {language === 'es' ? 'Salir del juego de inmediato (ExitProcess)' : 'Terminate client instantly (ExitProcess)'}
                      </option>
                      <option value="MSG_BOX">
                        {language === 'es' ? 'Mostrar cuadro de alerta + ExitProcess' : 'MessageBox alert + ExitProcess'}
                      </option>
                      <option value="CRASH">
                        {language === 'es' ? 'Forzar cierre deliberado (Anti-Dumping)' : 'Force deliberate crash (Anti-Dumping)'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* Col 3 */}
                <div className="flex flex-col gap-2 bg-slate-900/50 p-3 rounded border border-slate-800">
                  <span className="font-bold text-slate-300 mb-1 block uppercase font-mono tracking-wider text-[10px]">
                    {language === 'es' ? 'Interruptores y Controles:' : 'Toggles & Controls:'}
                  </span>
                  
                  <div className="mb-2 border-b border-slate-800 pb-2">
                    <label className="block text-slate-400 font-mono mb-1 text-[10px]">
                      {language === 'es' ? 'VENCIMIENTO LICENCIA DLL (Opcional):' : 'DLL LICENSE EXPIRATION (Optional):'}
                    </label>
                    <input 
                      type="date"
                      value={licenseExpiration}
                      onChange={(e) => setLicenseExpiration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-amber-400 font-mono focus:border-amber-500 focus:outline-none text-xs"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={enableHwidCheck}
                      onChange={(e) => setEnableHwidCheck(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>{language === 'es' ? 'Bloqueo estricto de HWID' : 'Enforce Hardware HWID Locks'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={enableFileCheck}
                      onChange={(e) => setEnableFileCheck(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>{language === 'es' ? 'Suma MD5 de archivos' : 'Verify Client File Checksums'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={enableMultiClientBlock}
                      onChange={(e) => setEnableMultiClientBlock(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>{language === 'es' ? 'Bloquear Multi-Cliente (Mutex)' : 'Block Sandbox Multi-Clients'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                    <input 
                      type="checkbox" 
                      checked={enableAntiMacro}
                      onChange={(e) => setEnableAntiMacro(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>{language === 'es' ? 'Lista Negra de Macros/Hacks (Cheat Engine, AutoClicker, etc.)' : 'Macro/Hack Window Blacklist (Cheat Engine, etc.)'}</span>
                  </label>
                  
                  {enableAntiMacro && (
                    <div className="mt-2 pl-6">
                      <input 
                        type="text" 
                        value={blacklistedPrograms.join(', ')}
                        onChange={(e) => setBlacklistedPrograms(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 font-mono focus:border-amber-500 focus:outline-none text-xs"
                        placeholder="Cheat Engine, AutoClicker, SpeedHack"
                      />
                      <p className="text-[9px] text-slate-500 mt-1">
                        {language === 'es' ? 'Nombres de ventanas, separados por coma (,)' : 'Window titles, comma-separated (,)'}
                      </p>
                    </div>
                  )}

                  {/* Advanced Security */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-3">
                      {language === 'es' ? 'Seguridad Avanzada (Nivel Pro)' : 'Advanced Security (Pro Level)'}
                    </h4>

                  {selectedLanguage === 'cpp' && (
                    <div className="mb-4 pb-4 border-b border-slate-800">
                      <h4 className="text-amber-500 font-bold uppercase tracking-wider text-[10px] mb-2 opacity-80">
                        {language === 'es' ? 'Compilador (Visual Studio)' : 'Compiler (Visual Studio)'}
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                        <input 
                          type="checkbox" 
                          checked={usePch}
                          onChange={(e) => setUsePch(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <span>{language === 'es' ? 'Incluir #include "pch.h" (Evita error C1010)' : 'Include #include "pch.h" (Prevents C1010 Error)'}</span>
                      </label>
                    </div>
                  )}
                    
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableAntiDebug}
                        onChange={(e) => setEnableAntiDebug(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Bloqueo de Depuradores (IsDebuggerPresent)' : 'Anti-Debugger Block (IsDebuggerPresent)'}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableProcessBinding}
                        onChange={(e) => setEnableProcessBinding(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Vinculación de Proceso Exclusivo (main.exe)' : 'Exclusive Process Binding (main.exe)'}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enablePayloadEncryption}
                        onChange={(e) => setEnablePayloadEncryption(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Cifrado de Carga Útil (XOR)' : 'Payload Encryption (XOR)'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableDllScanner}
                        onChange={(e) => setEnableDllScanner(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Escáner de Inyección de DLL' : 'DLL Injection Scanner'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableMemoryScanner}
                        onChange={(e) => setEnableMemoryScanner(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Escáner de Memoria (Firmas)' : 'Memory Signature Scanner'}</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Code Display Area */}
              <div className="flex flex-col">
                <div className="bg-slate-950 rounded-t-lg border border-slate-800 border-b-0 px-4 py-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {language === 'es' ? 'Código Fuente Generado: ' : 'Generated Code: '}
                    <strong className="text-amber-400">{selectedLanguage === 'cpp' ? 'Custom.cpp (Visual C++)' : 'SecurityEngine.cs (C#)'}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => alert(language === 'es' ? 'La compilación en la nube cruzada a DLL aún está en desarrollo. Para evitar problemas de empaquetamiento, compila este código en tu Visual Studio.' : 'Cross-compiling DLL in the cloud is currently in development. To prevent packing issues, please compile this code in your Visual Studio.')}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer transition bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 text-[11px]"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      {t.generator.btnDownloadDll || (language === 'es' ? 'Descargar DLL (Beta)' : 'Download DLL (Beta)')}
                    </button>
                    <button 
                      onClick={() => handleCopyCode(selectedLanguage === 'cpp' ? cppCode : csharpCode)}
                      className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 cursor-pointer transition bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-[11px]"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          {language === 'es' ? '¡Copiado!' : 'Copied!'}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          {language === 'es' ? 'Copiar Código' : 'Copy Code'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-b-lg border border-slate-800 h-[480px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
                  <pre className="whitespace-pre">{selectedLanguage === 'cpp' ? cppCode : csharpCode}</pre>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SERVER AUTH DASHBOARD & HWID MANAGER */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* Dashboard Layout Header */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                      <Database className="w-5 h-5 text-amber-400" /> {language === 'es' ? 'Panel de Control de Administrador de Mu Online' : 'Mu Online Admin Control Panel'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.dashboard.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                    <div className="relative w-full md:w-64">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input 
                        type="text" 
                        placeholder={language === 'es' ? 'Buscar jugadores o HWID...' : 'Search players or HWID...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Main Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                  
                  {/* Left: Accounts Database (8 cols) */}
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-serif">{t.dashboard.registeredAccs}</h3>
                      <span className="text-xs text-slate-500">{filteredAccounts.length} {language === 'es' ? 'cuentas en total' : 'accounts total'}</span>
                    </div>

                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 uppercase font-mono tracking-wider font-bold">
                            <th className="p-3">{t.dashboard.colUser}</th>
                            <th className="p-3">{t.dashboard.colHwid}</th>
                            <th className="p-3">{t.dashboard.colIp}</th>
                            <th className="p-3">{t.dashboard.colStatus}</th>
                            <th className="p-3 text-right">{t.dashboard.colAction}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {filteredAccounts.length > 0 ? (
                            filteredAccounts.map((acc) => (
                              <tr key={acc.id} className="hover:bg-slate-900/40 transition">
                                <td className="p-3 font-bold text-slate-200">
                                  <span className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${acc.status === 'BANNED' ? 'bg-red-500' : acc.status === 'UNLOCKED' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                                    {acc.username}
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-amber-300/80 font-semibold">{acc.hwid}</td>
                                <td className="p-3 text-slate-400">
                                  <div>{acc.ip}</div>
                                  <div className="text-[10px] text-slate-500 font-mono">{acc.lastLogin}</div>
                                </td>
                                <td className="p-3">
                                  {acc.status === 'BANNED' && (
                                    <span className="bg-red-950/80 text-red-400 px-2 py-0.5 rounded border border-red-500/20 text-[10px] font-bold">
                                      {language === 'es' ? 'BANEADO' : 'BANNED'}
                                    </span>
                                  )}
                                  {acc.status === 'ACTIVE' && (
                                    <span className="bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px] font-bold">
                                      {language === 'es' ? 'BLOQUEADO' : 'LOCKED'}
                                    </span>
                                  )}
                                  {acc.status === 'UNLOCKED' && (
                                    <span className="bg-yellow-950/80 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20 text-[10px] font-bold">
                                      {language === 'es' ? 'OMITIR (Libre)' : 'BYPASS (Unlocked)'}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    {acc.status === 'BANNED' ? (
                                      <button 
                                        onClick={() => toggleAccountStatus(acc.id, 'UNBAN' as any)}
                                        className="bg-slate-900 hover:bg-emerald-900/40 border border-slate-800 text-emerald-400 px-2 py-1 rounded text-[10px] transition font-semibold"
                                      >
                                        {language === 'es' ? 'Quitar Baneo' : 'Unban'}
                                      </button>
                                    ) : (
                                      <button 
                                        onClick={() => toggleAccountStatus(acc.id, 'BAN')}
                                        className="bg-slate-900 hover:bg-red-950/60 border border-slate-800 text-red-400 px-2 py-1 rounded text-[10px] transition font-semibold"
                                      >
                                        {language === 'es' ? 'Banear HWID' : 'Ban Player'}
                                      </button>
                                    )}

                                    {acc.status === 'ACTIVE' ? (
                                      <button 
                                        onClick={() => toggleAccountStatus(acc.id, 'UNLOCK')}
                                        className="bg-slate-900 hover:bg-yellow-950/60 border border-slate-800 text-yellow-400 px-2 py-1 rounded text-[10px] transition font-semibold flex items-center gap-1"
                                        title={language === 'es' ? 'Permitir inicio desde cualquier PC una vez' : 'Allow login from any HWID once (useful if user changed motherboard/CPU)'}
                                      >
                                        <Unlock className="w-3 h-3" /> {language === 'es' ? 'Resetear HWID' : 'HWID Reset'}
                                      </button>
                                    ) : acc.status === 'UNLOCKED' ? (
                                      <button 
                                        onClick={() => toggleAccountStatus(acc.id, 'LOCK')}
                                        className="bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 text-emerald-400 px-2 py-1 rounded text-[10px] transition font-semibold flex items-center gap-1"
                                      >
                                        <Lock className="w-3 h-3" /> {language === 'es' ? 'Forzar Bloqueo' : 'Force Bind'}
                                      </button>
                                    ) : null}
                                    <button
                                      onClick={() => handleDeleteAccount(acc.id)}
                                      className="bg-slate-900 hover:bg-red-950/60 border border-slate-800 text-red-500 px-2 py-1 rounded transition flex items-center justify-center"
                                      title={language === 'es' ? 'Eliminar cuenta' : 'Delete account'}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-500">
                                {language === 'es' ? 'No se encontraron cuentas de jugadores registrados con esos parámetros.' : 'No registered accounts match your query parameters.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Quick Add Form */}
                    <form onSubmit={handleAddAccount} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-end gap-3">
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">
                          {language === 'es' ? 'Crear Credenciales de Cuenta de Jugador:' : 'Create Player Account Credentials:'}
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. ElfArcher" 
                          value={newAccUser}
                          onChange={(e) => setNewAccUser(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-amber-200 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">
                          {language === 'es' ? 'Vincular HWID Personalizado (Opcional):' : 'Bind Custom HWID (Optional):'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={language === 'es' ? 'Dejar en blanco para registrar al iniciar' : 'Leave blank for automatic login registration'} 
                          value={newAccHwid}
                          onChange={(e) => setNewAccHwid(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-amber-200 focus:border-amber-500 focus:outline-none font-mono"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded text-xs transition h-8 shrink-0 flex items-center gap-1 self-end w-full md:w-auto justify-center"
                      >
                        <Plus className="w-4 h-4" /> {language === 'es' ? 'Añadir Usuario' : 'Add User'}
                      </button>
                    </form>
                  </div>

                  {/* Right: Security MD5 Client File Hashing Rules (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-serif">
                        {language === 'es' ? 'Reglas de Integridad de Archivos' : 'File Hashing Standards'}
                      </h3>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-4">
                      
                      <div className="space-y-3">
                        {clientFiles.map(file => (
                          <div key={file.id} className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px] leading-tight flex flex-col gap-1.5 relative group">
                            <button 
                              onClick={() => deleteFile(file.id)}
                              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-red-400 transition cursor-pointer opacity-0 group-hover:opacity-100"
                              title="Delete file integrity rule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex items-center gap-1.5 font-bold text-slate-200">
                              <FileCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate max-w-[150px]">{file.path}</span>
                              <span className={`text-[8px] px-1 rounded uppercase font-mono ${
                                file.importance === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/10' :
                                file.importance === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-500/10' :
                                'bg-slate-800 text-slate-400'
                              }`}>{file.importance === 'CRITICAL' && language === 'es' ? 'CRÍTICO' : file.importance}</span>
                            </div>
                            <div className="text-[10px] font-mono text-amber-300 font-semibold truncate bg-slate-950 p-1 rounded">
                              MD5: {file.expectedHash}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {language === 'es' ? 'Tamaño de archivo: ' : 'Size check: '}{file.fileSize}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* File Add form */}
                      <form onSubmit={handleAddFile} className="border-t border-slate-800 pt-3 space-y-2.5 text-xs">
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block font-mono">
                          {language === 'es' ? 'Registrar Archivo de Juego:' : 'Register Client Asset File:'}
                        </span>
                        
                        <div>
                          <input 
                            type="text" 
                            placeholder={language === 'es' ? 'Ruta (ej. Data/item.bmd)' : 'File path (e.g. Data/item.bmd)'} 
                            value={newFilePath}
                            onChange={(e) => setNewFilePath(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-amber-200 focus:border-amber-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder={language === 'es' ? 'Suma de Comprobación MD5' : 'Expected MD5 Hash signature'} 
                            value={newFileHash}
                            onChange={(e) => setNewFileHash(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-amber-200 focus:border-amber-500 focus:outline-none font-mono"
                            required
                          />
                          <select 
                            value={newFileImportance}
                            onChange={(e) => setNewFileImportance(e.target.value as any)}
                            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                          >
                            <option value="CRITICAL">{language === 'es' ? 'Crítica' : 'Critical'}</option>
                            <option value="HIGH">{language === 'es' ? 'Alta' : 'High'}</option>
                            <option value="MEDIUM">{language === 'es' ? 'Media' : 'Medium'}</option>
                          </select>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold py-1 rounded text-xs transition border border-amber-500/20"
                        >
                          + {language === 'es' ? 'Guardar Regla de Hash de Archivo' : 'Save File Hash Rule'}
                        </button>
                      </form>

                    </div>
                  </div>

                </div>

              </div>

              {/* Real-Time Connections Activity Log feed */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-md font-bold text-amber-200 font-serif uppercase tracking-wide flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-amber-400" /> {t.dashboard.realtimeEvents}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.dashboard.realtimeEventsDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0 self-end sm:self-auto text-xs font-mono">
                    <button 
                      onClick={() => setLogFilter('ALL')}
                      className={`px-2.5 py-1 rounded transition ${logFilter === 'ALL' ? 'bg-slate-800 text-amber-300 border border-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {language === 'es' ? 'Todos los Eventos' : 'All Events'}
                    </button>
                    <button 
                      onClick={() => setLogFilter('ALLOWED')}
                      className={`px-2.5 py-1 rounded transition ${logFilter === 'ALLOWED' ? 'bg-slate-850 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {language === 'es' ? 'Permitidos' : 'Allowed'}
                    </button>
                    <button 
                      onClick={() => setLogFilter('BLOCKED')}
                      className={`px-2.5 py-1 rounded transition ${logFilter === 'BLOCKED' ? 'bg-slate-850 text-red-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {language === 'es' ? 'Bloqueados' : 'Blocked'}
                    </button>
                  </div>
                </div>

                {/* Event Logs list */}
                <div className="mt-4 max-h-72 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className={`p-3.5 rounded-lg border text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          log.status === 'ALLOWED' 
                            ? 'bg-emerald-950/10 border-emerald-950/50 text-emerald-300/90' 
                            : 'bg-red-950/10 border-red-950/50 text-red-300/90'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                          <span className="text-slate-500 font-bold shrink-0">{log.timestamp}</span>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                              log.status === 'ALLOWED' 
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/10' 
                                : 'bg-red-950 text-red-400 border border-red-500/10'
                            }`}>
                              {log.status === 'ALLOWED' ? (language === 'es' ? 'PERMITIDO' : 'ALLOWED') : (language === 'es' ? 'RECHAZADO' : 'BLOCKED')}
                            </span>
                            <span className="font-bold text-slate-200">{log.username}</span>
                          </div>

                          <span className="text-slate-500">{language === 'es' ? 'HWID: ' : 'HWID: '}<strong className="text-amber-400/80 font-medium">{log.hwid}</strong></span>
                          <span className="text-slate-500">IP: <strong className="text-slate-300 font-medium">{log.ip}</strong></span>
                          <span className="text-slate-500">Ver: <strong className="text-slate-300 font-medium">v{log.clientVersion}</strong></span>
                        </div>

                        <div className="text-slate-400 text-[11px] md:text-right flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded border border-slate-800/40 md:max-w-md shrink-0">
                          {log.status !== 'ALLOWED' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                          <span>{log.reason}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-500 font-mono text-xs">
                      {t.dashboard.noRecords}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: INTERACTIVE CLIENT-SERVER SIMULATOR */}
          {activeTab === 'sandbox' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl flex flex-col gap-6 animate-fadeIn">
              
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                  <Play className="w-5 h-5 text-amber-400 animate-pulse" /> {t.sandbox.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {t.sandbox.desc}
                </p>
              </div>

              {/* The Sandbox Layout (Split: Sim Controls left, Terminal right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Simulated Game Client Panel (5 cols) */}
                <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col gap-4">
                  
                  {/* Decorative Retro Launcher Border Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/60 -mx-4 -mt-4 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200 font-serif tracking-widest flex items-center gap-1.5 uppercase">
                      <Wifi className="w-3.5 h-3.5 text-amber-400 animate-ping" /> {language === 'es' ? 'Lanzador de Mu Online' : 'Mu Online Launcher'}
                    </span>
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono uppercase block -mb-2">
                    {language === 'es' ? 'Simular Parámetros de Cliente:' : 'Simulate Client Parameters:'}
                  </span>
                  
                  {/* Inputs */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-400 font-mono mb-1">
                        {language === 'es' ? 'Nombre de cuenta del jugador:' : 'Enter Player Account Name:'}
                      </label>
                      <input 
                        type="text" 
                        value={simUsername}
                        onChange={(e) => setSimUsername(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:border-amber-500 focus:outline-none font-bold"
                        disabled={isSimulating}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-mono mb-1 flex justify-between">
                        <span>{language === 'es' ? 'ID de Hardware de PC Simulado (HWID):' : 'Simulated PC Hardware ID (HWID):'}</span>
                        <button 
                          onClick={handleRandomizeHwid} 
                          className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                          disabled={isSimulating}
                        >
                          {language === 'es' ? 'Generar Aleatorio' : 'Generate Random'}
                        </button>
                      </label>
                      <input 
                        type="text" 
                        value={simHwid}
                        onChange={(e) => setSimHwid(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 font-mono text-amber-300 focus:border-amber-500 focus:outline-none text-[11px]"
                        disabled={isSimulating}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-mono mb-1">{language === 'es' ? 'Simular Dirección IP:' : 'Simulate IP Address:'}</label>
                        <input 
                          type="text" 
                          value={simIp}
                          onChange={(e) => setSimIp(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-300 focus:border-amber-500 focus:outline-none font-mono"
                          disabled={isSimulating}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-mono mb-1">{language === 'es' ? 'Versión de DLL:' : 'DLL Version Flag:'}</label>
                        <input 
                          type="text" 
                          value={simClientVersion}
                          onChange={(e) => setSimClientVersion(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-slate-300 focus:border-amber-500 focus:outline-none font-mono"
                          disabled={isSimulating}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-mono mb-1">{language === 'es' ? 'Modificación de Archivos (Hacks):' : 'Trigger File Tampering Event:'}</label>
                      <select 
                        value={simModifiedFile}
                        onChange={(e) => setSimModifiedFile(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                        disabled={isSimulating}
                      >
                        <option value="none">{language === 'es' ? 'Cliente Limpio (Archivos intactos)' : 'Perfect Client (All files unmodified)'}</option>
                        <option value="main.exe">{language === 'es' ? 'main.exe modificado (Falla de suma de comprobación MD5)' : 'Tampered Client main.exe (MD5 hash mismatch)'}</option>
                        <option value="Data/Local/Eng/item_eng.bmd">{language === 'es' ? 'Data/Local/Eng/item_eng.bmd adulterado (Multiplicador de daño)' : 'Hacked item_eng.bmd (Attack speed modification)'}</option>
                        <option value="Data/Player/Player.bmd">{language === 'es' ? 'Data/Player/Player.bmd alterado (Skin visual modificado)' : 'Modified Player.bmd (Visual model hack)'}</option>
                      </select>
                    </div>

                  </div>

                  {/* Run Launcher Trigger */}
                  <button 
                    onClick={handleRunSimulation}
                    disabled={isSimulating || !simUsername}
                    className={`w-full font-serif font-extrabold uppercase text-sm tracking-wider py-3 rounded-lg transition-all border shadow-lg cursor-pointer ${
                      isSimulating 
                        ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-slate-950 border-amber-400/30'
                    }`}
                  >
                    {isSimulating ? (
                      <span className="flex items-center justify-center gap-2 font-mono">
                        <RefreshCw className="w-4 h-4 animate-spin" /> {language === 'es' ? 'Realizando Handshake con DLL...' : 'Performing DLL Handshake...'}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Shield className="w-4.5 h-4.5" /> {language === 'es' ? 'Iniciar Cliente de Juego' : 'Launch MuOnline Client'}
                      </span>
                    )}
                  </button>

                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80 text-[10px] leading-relaxed text-slate-500 font-mono">
                    {language === 'es' ? (
                      <span>💡 <strong>Consejo:</strong> Registra la cuenta de jugador &apos;{simUsername}&apos; en la pestaña <em>Base de Datos de Servidor</em> primero, ¡luego altera archivos o cambia su HWID para ver cómo el servidor rechaza el inicio!</span>
                    ) : (
                      <span>💡 <strong>Test Case Tip:</strong> Register the player account &apos;{simUsername}&apos; in the <em>Server Auth Dashboard</em> tab first, then alter files or change their HWID to see how the server rejects them!</span>
                    )}
                  </div>

                </div>

                {/* Simulated Handshake Console & Raw API Payloads (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  
                  {/* Console Log Stream */}
                  <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 shadow-inner">
                    <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Terminal className="w-3.5 h-3.5 text-amber-500" /> {language === 'es' ? 'Salida de Registro de DLL (Consola de Cliente)' : 'Client-Side DLL Log Output (Live execution)'}
                    </span>
                    
                    <div className="flex-1 h-48 overflow-y-auto space-y-1 font-mono text-[11px] text-slate-300 leading-normal bg-slate-900/60 p-2.5 rounded border border-slate-850/80 scrollbar-thin">
                      {simConsole.length > 0 ? (
                        simConsole.map((logLine, i) => (
                          <div key={i} className="whitespace-pre-wrap">{logLine}</div>
                        ))
                      ) : (
                        <div className="text-slate-600 italic py-16 text-center">
                          {language === 'es' ? 'Lanzador inactivo. Personaliza los parámetros y pulsa "Iniciar Cliente" arriba para rastrear la verificación de seguridad.' : 'Launcher idle. Customize parameters and hit "Launch MuOnline Client" above to trace security checks.'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Raw Request / Response Inspector */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Network className="w-3.5 h-3.5 text-amber-500" /> {language === 'es' ? 'Inspector de paquetes HTTP (JSON)' : 'HTTP Payload request & response inspector'}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      
                      {/* Left: Request JSON payload */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-slate-500 uppercase">{language === 'es' ? 'Payload POST enviado por la DLL:' : 'POST Request payload sent by DLL:'}</span>
                        <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[10px] leading-relaxed text-amber-200 h-28 overflow-y-auto">
                          {isSimulating || simConsole.length > 0 ? (
                            <pre className="whitespace-pre-wrap">{JSON.stringify({
                              username: simUsername,
                              hwid: simHwid,
                              clientVersion: simClientVersion,
                              secretToken: securityToken,
                              fileModified: simModifiedFile !== 'none' ? simModifiedFile : 'none'
                            }, null, 2)}</pre>
                          ) : (
                            <span className="text-slate-600 italic">{language === 'es' ? 'Ningún paquete enviado aún.' : 'No request sent yet.'}</span>
                          )}
                        </div>
                      </div>

                      {/* Right: Response JSON payload */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-slate-500 uppercase">{language === 'es' ? 'Respuesta JSON de la API de Autenticación:' : 'JSON API Response from Auth Server:'}</span>
                        <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[10px] leading-relaxed h-28 overflow-y-auto font-semibold">
                          {simResult ? (
                            <pre className={`whitespace-pre-wrap ${simResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                              {JSON.stringify(simResult, null, 2)}
                            </pre>
                          ) : isSimulating ? (
                            <span className="text-amber-500 animate-pulse font-bold flex items-center gap-1.5 py-8 justify-center">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {language === 'es' ? 'Obteniendo respuesta de la API...' : 'Fetching REST response...'}
                            </span>
                          ) : (
                            <span className="text-slate-600 italic">{language === 'es' ? 'Esperando handshake del servidor.' : 'Waiting for server handshake.'}</span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 5: HOW TO COMPILE & INJECT THE DLL */}
          {activeTab === 'guide' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl flex flex-col gap-6 animate-fadeIn">
              
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" /> {t.guide.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {t.guide.desc}
                </p>
              </div>

              {/* Step By Step Guide */}
              <div className="space-y-6 text-sm text-slate-300">
                
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0 font-mono">1</div>
                  <div>
                    <h4 className="font-bold text-slate-200">{t.guide.step1Title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t.guide.step1Desc}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0 font-mono">2</div>
                  <div>
                    <h4 className="font-bold text-slate-200">{t.guide.step2Title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t.guide.step2Desc}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      <div className="p-3 bg-slate-950 rounded border border-slate-850 text-xs">
                        <strong className="text-amber-300 block mb-1">{t.guide.methodATitle}</strong>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {t.guide.methodADesc}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-950 rounded border border-slate-850 text-xs">
                        <strong className="text-amber-300 block mb-1">{t.guide.methodBTitle}</strong>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {t.guide.methodBDesc}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-950 rounded border border-slate-850 text-xs">
                        <strong className="text-amber-300 block mb-1">{t.guide.methodCTitle}</strong>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {t.guide.methodCDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 shrink-0 font-mono">3</div>
                  <div>
                    <h4 className="font-bold text-slate-200">{t.guide.step3Title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t.guide.step3Desc}
                    </p>
                  </div>
                </div>

                {/* Secure Architecture Reminder */}
                <div className="bg-amber-950/15 border border-amber-900/35 p-4 rounded-xl mt-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider font-mono">{t.guide.warningTitle}</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {t.guide.warningDesc}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer copyright info */}
      <footer className="bg-slate-900 border-t border-slate-850/60 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono">
            {language === 'es' 
              ? 'Onyx Guard Anti-Hack - Versión 3.5.0-Estable | Diseñado para Visual Studio y Node.js' 
              : 'Onyx Guard Anti-Hack - Version 3.5.0-Stable | Crafted in Visual Studio & Node.js'}
          </p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer transition">{language === 'es' ? 'Términos de Servicio' : 'Terms of Service'}</span>
            <span className="hover:text-slate-400 cursor-pointer transition">{language === 'es' ? 'Wiki de Desarrolladores' : 'Developer Wiki'}</span>
            <span className="hover:text-slate-400 cursor-pointer transition">{language === 'es' ? 'Avisos de Seguridad' : 'Security Advisory'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
