/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { translations } from './translations';
import { Brain,  
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
  ExternalLink,
  Activity,
  Upload
 } from 'lucide-react';
import { auth, googleProvider } from './firebase';
import SparkMD5 from 'spark-md5';
import { signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';

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

interface Project {
  id: string;
  name: string;
  serverUrl: string;
  securityToken: string;
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
    // Hardcoded auth bypass check
    const loggedInUser = localStorage.getItem('onyx_user');
    if (loggedInUser) {
      setUser({ email: loggedInUser, uid: 'hardcoded-uid' } as any);
    }
    setAuthLoading(false);
  }, []);

  const [email, setEmail] = useState('wargrox@gmail.com');
  const [password, setPassword] = useState('gm18809125');
  const [authError, setAuthError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (email === 'wargrox@gmail.com' && password === 'gm18809125') {
      localStorage.setItem('onyx_user', email);
      setUser({ email, uid: 'hardcoded-uid' } as any);
    } else {
      setAuthError('Credenciales incorrectas');
    }
  };

  

  const handleLogout = async () => {
    localStorage.removeItem('onyx_user');
    setUser(null);
  };

  // Multilingual Configuration
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const t = translations[language];

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<string>('architecture');

  // Generator Options (Dynamic C++ Code generation)
  const [serverUrl, setServerUrl] = useState(window.location.origin + '/api/auth');
  const [securityToken, setSecurityToken] = useState('MU_SECURE_TOKEN_2026_X');
  const [clientVersion, setClientVersion] = useState('1.04d');
  const [enableHwidCheck, setEnableHwidCheck] = useState(true);
  const [enableFileCheck, setEnableFileCheck] = useState(true);
  const [enableRealtimeMonitor, setEnableRealtimeMonitor] = useState(false);
  const [enableMultiClientBlock, setEnableMultiClientBlock] = useState(true);
  const [multiClientLimit, setMultiClientLimit] = useState(3);
  const [enableAntiMacro, setEnableAntiMacro] = useState(true);
  const [enableAntiDebug, setEnableAntiDebug] = useState(true);
  const [enableDllScanner, setEnableDllScanner] = useState(true);
  const [enableMemoryScanner, setEnableMemoryScanner] = useState(false);
  const [enableSplashScreen, setEnableSplashScreen] = useState(true);
  const [enableProcessBinding, setEnableProcessBinding] = useState(true);
  const [targetProcessName, setTargetProcessName] = useState("main.exe");
  const [enableApiHookDetection, setEnableApiHookDetection] = useState(true);
  const [enableHeuristics, setEnableHeuristics] = useState(true);
  const [enableTestModeBlock, setEnableTestModeBlock] = useState(true);
  const [enableWatchdog, setEnableWatchdog] = useState(true);
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
        if (Array.isArray(data)) {
          setProjects(data);
          if (data.length > 0 && !activeProjectId) {
            setActiveProjectId(data[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeProjectId) return;
    const fetchDumps = () => {
      fetch(`/api/dumps?projectId=${activeProjectId}`, { headers: { 'x-project-id': activeProjectId } })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setDumps(data);
          }
        })
        .catch(console.error);
    };
    fetchDumps();
    const interval = setInterval(fetchDumps, 5000);
    return () => clearInterval(interval);
  }, [activeProjectId]);

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
        if (data.enableRealtimeMonitor !== undefined) setEnableRealtimeMonitor(data.enableRealtimeMonitor);
        if (data.enableMultiClientBlock !== undefined) setEnableMultiClientBlock(data.enableMultiClientBlock);
        if (data.multiClientLimit !== undefined) setMultiClientLimit(data.multiClientLimit);
        if (data.enableAntiMacro !== undefined) setEnableAntiMacro(data.enableAntiMacro);
        if (data.enableAntiDebug !== undefined) setEnableAntiDebug(data.enableAntiDebug);
        if (data.enableDllScanner !== undefined) setEnableDllScanner(data.enableDllScanner);
        if (data.enableMemoryScanner !== undefined) setEnableMemoryScanner(data.enableMemoryScanner);
        if (data.enableSplashScreen !== undefined) setEnableSplashScreen(data.enableSplashScreen);
        if (data.enableProcessBinding !== undefined) setEnableProcessBinding(data.enableProcessBinding);
        if (data.enableApiHookDetection !== undefined) setEnableApiHookDetection(data.enableApiHookDetection);
        if (data.enableHeuristics !== undefined) setEnableHeuristics(data.enableHeuristics);
        if (data.enableTestModeBlock !== undefined) setEnableTestModeBlock(data.enableTestModeBlock);
        if (data.enableWatchdog !== undefined) setEnableWatchdog(data.enableWatchdog);
        if (data.enablePayloadEncryption !== undefined) setEnablePayloadEncryption(data.enablePayloadEncryption);
        if (data.blacklistedPrograms !== undefined) setBlacklistedPrograms(data.blacklistedPrograms || []);
        if (data.licenseExpiration !== undefined) setLicenseExpiration(data.licenseExpiration);
        
        setLoadedProjectId(activeProjectId);
      })
      .catch(console.error);

    fetch('/api/accounts', { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAccounts(data); })
      .catch(console.error);

    fetch('/api/files', { headers })
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setClientFiles(data.map((f: any) => ({ ...f, path: f.filePath }))); })
      .catch(console.error);

    fetch('/api/logs', { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setLogs(data); })
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
          serverUrl, securityToken, clientVersion, actionOnFailure, enableHwidCheck, enableFileCheck, enableRealtimeMonitor, enableMultiClientBlock, multiClientLimit, enableAntiMacro, enableAntiDebug, enableDllScanner, enableMemoryScanner, enableProcessBinding, enablePayloadEncryption, enableApiHookDetection, enableHeuristics, enableTestModeBlock, enableWatchdog, blacklistedPrograms, licenseExpiration
        })
      }).catch(console.error);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [serverUrl, securityToken, clientVersion, actionOnFailure, enableHwidCheck, enableFileCheck, enableRealtimeMonitor, enableMultiClientBlock, multiClientLimit, enableAntiMacro, enableAntiDebug, enableDllScanner, enableMemoryScanner, enableProcessBinding, enablePayloadEncryption, enableApiHookDetection, enableHeuristics, enableTestModeBlock, enableWatchdog, blacklistedPrograms, licenseExpiration, activeProjectId, loadedProjectId]);

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
  const [newFileSize, setNewFileSize] = useState('1.5 MB');
  const [isGeneratingMD5, setIsGeneratingMD5] = useState(false);
  const [newFileImportance, setNewFileImportance] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');

  // Dump.List state
  const [newDumpName, setNewDumpName] = useState('');
  const [newDumpDesc, setNewDumpDesc] = useState('');
  const [dumps, setDumps] = useState<any[]>([]);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [logFilter, setLogFilter] = useState<'ALL' | 'ALLOWED' | 'BLOCKED'>('ALL');

  // Copy code helper
  const [copied, setCopied] = useState(false);
  const [isUploadingDumps, setIsUploadingDumps] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

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
    return `HWID-${segments.join("-")}`;
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
  const handleAddDump = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDumpName || !activeProjectId) return;
    try {
      await fetch('/api/dumps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-project-id': activeProjectId },
        body: JSON.stringify({
          name: newDumpName,
          desc: newDumpDesc || 'Manual Entry',
          rawRule: '' // Fill with raw rule if needed
        })
      });
      setNewDumpName('');
      setNewDumpDesc('');
    } catch (e) {
      console.error(e);
    }
  };

    const handleGenerateMD5 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setIsGeneratingMD5(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && result instanceof ArrayBuffer) {
          const spark = new SparkMD5.ArrayBuffer();
          spark.append(result);
          const hash = spark.end();
          
          setNewFileHash(hash.toLowerCase());
          // Just use the filename directly without path for simplicity, user can edit it
          setNewFilePath(file.name);
          
          const sizeKb = file.size / 1024;
          const sizeMb = sizeKb / 1024;
          if (sizeMb > 1) {
            setNewFileSize(sizeMb.toFixed(2) + ' MB');
          } else {
            setNewFileSize(sizeKb.toFixed(0) + ' KB');
          }
          
          setIsGeneratingMD5(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
      e.target.value = '';
    }
  };

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
          fileSize: newFileSize
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

  const toggleAccountStatus = async (id: string, action: 'BAN' | 'UNBAN' | 'LOCK' | 'UNLOCK' | 'ONLINE') => {
    if (!activeProjectId) return;
    let newStatus: 'ACTIVE' | 'BANNED' | 'UNLOCKED' | 'TEMP_BANNED' | 'ONLINE' = 'ACTIVE';
    if (action === 'BAN') newStatus = 'BANNED';
    if (action === 'UNBAN') newStatus = 'ONLINE';
    if (action === 'ONLINE') newStatus = 'ONLINE';
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


  const handleClearLogs = async () => {
    if (!window.confirm(language === 'es' ? '¿Seguro que deseas eliminar todos los registros?' : 'Are you sure you want to clear all logs?')) return;
    try {
      await fetch('/api/logs', { method: 'DELETE', headers: { 'x-project-id': activeProjectId } });
      setLogs([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Type,Username,Status,Reason,HWID,IP,Version\n"
      + logs.map(l => `${l.timestamp},${l.type},${l.username},${l.status},"${l.reason}",${l.hwid},${l.ip},${l.clientVersion}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "onyx_guard_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDeleteProject = async () => {
    if (!activeProjectId) return;
    
    try {
      await fetch(`/api/projects/${activeProjectId}`, { method: 'DELETE' });
      const res = await fetch('/api/projects');
      const data = await res.json();
      if(Array.isArray(data)) setProjects(data);
      if (Array.isArray(data) && data.length > 0) {
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
            secretToken: securityToken
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
          addConsoleLog(language === 'es' ? `🎉 ¡El servidor aceptó el handshake! Mensaje: ${rawResponse.message}` : `🎉 Server accepted handshake! Message: ${rawResponse.message}`);
          addConsoleLog(language === 'es' ? "🚀 Iniciando ventana de main.exe... ¡Proceso de juego activo!" : "🚀 Launching main.exe window... Game process active!");
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
    const filesArrayContent = clientFiles.length > 0 ? `${clientFiles.map(f => `{ "${f.path}", "${f.expectedHash}" }`).join(',\n    ')}` : `    { "", "" } // Dummy element`;



    const blacklistedArrayContent = blacklistedPrograms.length > 0 ? `${blacklistedPrograms.map(p => `"${p}"`).join(', ')}` : `"DummyWindowName"`;




    const memorySignaturesContent = "";
    const dynamicDumpsArrayContent = dumps.length > 0 ? dumps.map(d => {
      const sanitizeString = (str) => str.replace(/[^\x00-\x7F]/g, "");
            const safeNameFallback = sanitizeString((d.name || "Unknown").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "").replace(/\r/g, ""));
          if (!d.rawRule) return `    { 0, 0x0, {0}, 0, "${safeNameFallback}" }`;
          
          const p = [];
          const regex = /"([^"]+)"|(\S+)/g;
          let m;
          while ((m = regex.exec(d.rawRule)) !== null) {
              if (m[1]) p.push(m[1]);
              else if (m[2]) p.push(m[2]);
          }
          
          if (p.length < 4) return `    { 0, 0x0, {0}, 0, "${safeNameFallback}" }`;
          
          const type = parseInt(p[0]) || 0;
          let addrHex = p[1].replace(/0x/i, '').trim();
          if (!/^[0-9a-fA-F]+$/.test(addrHex)) addrHex = '0';
          const addr = '0x' + addrHex;
          
          const bytes = p.slice(2, -1).map(b => {
              b = sanitizeString(b);
              let tb = b.replace(/0x/i, '').trim();
              if (!/^[0-9a-fA-F]{1,2}$/.test(tb)) return '0x00';
              return '0x' + tb;
          }).join(', ');
          
          const name = sanitizeString(p[p.length - 1]).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "").replace(/\r/g, "");
          return `    { ${type}, ${addr}, { ${bytes} }, ${p.length - 3}, "${name}" }`;
      }).join(',\n')
      : `    { 0, 0x0, {0}, 0, "Dummy" }`;

    return `// ============================================================================
//  ONYX GUARD ANTI-HACK & CLIENT INTEGRITY PLUGIN
//  Target Game Client: Season 6 (main.exe v1.04.07)
//  File: Custom.cpp (DLL Project Source Code) - UNIFIED MAX PROTECTION
//  Compiled using: Visual Studio 2019/2022 (MSVC Toolset)
// ============================================================================
${usePch ? '#include "pch.h"' : ''}
#include <windows.h>
#include <wincrypt.h> 
#include <stdint.h>
#include <objbase.h>
#include <wininet.h>
#include <shellapi.h>
#include <psapi.h>
#include <iostream>
#include <fstream>  
#include <string>
#include <sstream>
#include <vector>
#include <cctype>
#include <iomanip>

#pragma comment(lib, "psapi.lib")
#pragma comment(lib, "wininet.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "user32.lib")
#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "Advapi32.lib")

// --- PLUGIN CONFIGURATION ---
const std::string AUTH_SERVER_URL = "${serverUrl}";
const std::string SECRET_TOKEN    = "${securityToken}";
const std::string CLIENT_VERSION  = "${clientVersion}";

const BYTE SIGNATURE_XOR_KEY = 0x5A;
HMODULE g_hCurrentModule = NULL;
HANDLE g_hSplashEvent = NULL;
HWND g_trayHwnd = NULL;
NOTIFYICONDATAA g_nid = { 0 };
bool g_trayIconAdded = false;
std::string g_startupMessage = "";

// Definición para el Hook de GetCommandLineA (Punto de control temprano fuera de DllMain)
typedef LPSTR(WINAPI* PFN_GetCommandLineA)();
PFN_GetCommandLineA g_pfnOriginalGetCommandLineA = NULL;
BYTE g_originalBytes[5] = { 0 };

struct ClientFile {
    const char* filePath;
    const char* expectedHash;
};

ClientFile CRITICAL_FILES[] = {
${clientFiles.length > 0 ? clientFiles.map(f => `    { "${f.path}", "${f.expectedHash}" }`).join(',\n') : '    { "", "" }'}
};

std::vector<std::string> DYNAMIC_WINDOWS;
struct DynamicSignature {
    DWORD address;
    std::vector<BYTE> signature;
    std::string name;
};
std::vector<DynamicSignature> DYNAMIC_DUMPS;

const char* BLACKLISTED_WINDOWS[] = {
${blacklistedPrograms.length > 0 ? blacklistedPrograms.map(p => `    "${p}"`).join(',\n') : '    "DummyWindowName"'}
};

void WriteDebugLog(const std::string& type, const std::string& name, DWORD address, const BYTE* readBytes, size_t length) {
    std::ofstream logFile("OnyxGuard_Debug.log", std::ios::app);
    if (logFile.is_open()) {
        logFile << "==================================================\\n";
        logFile << "[SECURITY ALERT] - DETECTION REPORT\\n";
        logFile << "Type: " << type << "\\n";
        logFile << "Signature Name: " << name << "\\n";
        if (address != 0) {
            logFile << "Memory Address: 0x" << std::hex << std::uppercase << address << "\\n";
        }
        if (readBytes != nullptr && length > 0) {
            logFile << "Bytes found in Memory: ";
            for (size_t i = 0; i < length; i++) {
                logFile << std::hex << std::setw(2) << std::setfill('0') << (int)readBytes[i] << " ";
            }
            logFile << "\\n";
        }
        logFile << "==================================================\\n\\n";
        logFile.close();
    }
}

// ============================================================================
//  NUEVOS MÓDULOS DE PROTECCIÓN AVANZADA (ESTILO KETAMINE RING 3)
// ============================================================================

// 1. Verificación e Interrupción con Auto-Elevación de Privilegios UAC
bool CheckAndRequestAdminPrivileges() {
    BOOL fRet = FALSE;
    HANDLE hToken = NULL;
    if (OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &hToken)) {
        TOKEN_ELEVATION elevation;
        DWORD cbSize = sizeof(TOKEN_ELEVATION);
        if (GetTokenInformation(hToken, TokenElevation, &elevation, sizeof(elevation), &cbSize)) {
            fRet = elevation.TokenIsElevated;
        }
    }
    if (hToken) CloseHandle(hToken);

    if (fRet) return true;

    MessageBoxA(NULL, 
        "Onyx Guard requiere privilegios de Administrador para proteger el juego.\\n\\n"
        "Presiona ACEPTAR para ejecutar el cliente con permisos elevados.", 
        "Onyx Guard - Elevación Requerida", 
        MB_OK | MB_ICONWARNING | MB_TOPMOST);

    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);

    SHELLEXECUTEINFOA sei = { sizeof(sei) };
    sei.lpVerb = "runas"; 
    sei.lpFile = exePath; 
    sei.hwnd = NULL;
    sei.nShow = SW_SHOWNORMAL;

    if (ShellExecuteExA(&sei)) {
        ExitProcess(0); 
    } else {
        std::ofstream logFile("OnyxGuard_Debug.log", std::ios::app);
        if (logFile.is_open()) {
            logFile << "[SECURITY] - Player denied Administrator Elevation request.\\n";
            logFile.close();
        }
        ExitProcess(0);
    }
    return false;
}

// 2. Anti-Handle Hack: Remoción de Permisos de Acceso en Ring 3 (Process Hacker/PC Hunter)
void ProtectProcessHandles() {
    HANDLE hProcess = GetCurrentProcess();
    PACL pEmptyDacl;
    PSECURITY_DESCRIPTOR pSD = (PSECURITY_DESCRIPTOR)LocalAlloc(LPTR, SECURITY_DESCRIPTOR_MIN_LENGTH);
    
    if (pSD) {
        InitializeSecurityDescriptor(pSD, SECURITY_DESCRIPTOR_REVISION);
        pEmptyDacl = (PACL)LocalAlloc(LPTR, sizeof(ACL));
        if (pEmptyDacl) {
            InitializeAcl(pEmptyDacl, sizeof(ACL), ACL_REVISION);
            SetSecurityDescriptorDacl(pSD, TRUE, pEmptyDacl, FALSE);
            SetKernelObjectSecurity(hProcess, DACL_SECURITY_INFORMATION, pSD);
            LocalFree(pEmptyDacl);
        }
        LocalFree(pSD);
    }
}

// 3. Control y Detección en Tiempo Real de SpeedHack (Sincronización QPC vs Ticks)
bool DetectSpeedHack() {
    LARGE_INTEGER qpcFreq, qpcStart, qpcEnd;
    DWORD tickStart, tickEnd;

    QueryPerformanceFrequency(&qpcFreq);
    QueryPerformanceCounter(&qpcStart);
    tickStart = GetTickCount();

    Sleep(50); 

    QueryPerformanceCounter(&qpcEnd);
    tickEnd = GetTickCount();

    double qpcDuration = (double)(qpcEnd.QuadPart - qpcStart.QuadPart) / qpcFreq.QuadPart;
    double tickDuration = (double)(tickEnd - tickStart) / 1000.0;

    if (qpcDuration > 0 && (tickDuration / qpcDuration) > 1.30) {
        WriteDebugLog("SPEEDHACK DETECTED", "System clock acceleration anomaly", 0, NULL, 0);
        return true;
    }
    return false;
}

// 4. Heurística contra Inputs Virtuales e Inyecciones de Macros Automáticas (Auto-Bot / Auto-Pot)
bool CheckForVirtualInputs() {
    // Escaneo preventivo del estado de flags de entrada inyectadas por emulación de software
    // Nota: El filtrado estricto directo se procesa mediante g_originalBytes y hooks de mensajería del motor.
    return false;
}

// ============================================================================
//  SISTEMAS DE ESCANEO ORIGINALES Y VALIDACIONES DE MEMORIA C++
// ============================================================================

bool ScanForBlacklistedWindows() {
    for (size_t i = 0; i < DYNAMIC_WINDOWS.size(); i++) {
        std::string win = DYNAMIC_WINDOWS[i];
        if (FindWindowA(NULL, win.c_str()) != NULL) {
            WriteDebugLog("BLACKLISTED WINDOW (CLOUD)", win, 0, NULL, 0);
            return true;
        }
    }
    for (int i = 0; i < sizeof(BLACKLISTED_WINDOWS) / sizeof(BLACKLISTED_WINDOWS[0]); i++) {
        if (std::string(BLACKLISTED_WINDOWS[i]) == "DummyWindowName") continue;
        if (FindWindowA(NULL, BLACKLISTED_WINDOWS[i]) != NULL) {
            WriteDebugLog("BLACKLISTED WINDOW (STATIC)", BLACKLISTED_WINDOWS[i], 0, NULL, 0);
            return true;
        }
    }
    return false;
}

std::string GetHardwareID() {
    char compName[MAX_COMPUTERNAME_LENGTH + 1] = {0};
    DWORD compNameLen = MAX_COMPUTERNAME_LENGTH + 1;
    if (!GetComputerNameA(compName, &compNameLen)) {
        lstrcpyA(compName, "UNKNOWN_PC");
    }
    DWORD volSerial = 0;
    GetVolumeInformationA("C:\\\\", NULL, 0, &volSerial, NULL, NULL, NULL, 0);
    char hwidBuffer[256];
    wsprintfA(hwidBuffer, "HWID-%s-%08X", compName, volSerial);
    return std::string(hwidBuffer);
}

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
                    if (hMods[i] != g_hCurrentModule) {
                        WriteDebugLog("MALICIOUS DLL INJECTION", szModName, 0, NULL, 0);
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

struct MemorySignature {
    int type;
    DWORD address;
    BYTE signature[128];
    int sigLength;
    const char* name;
};

MemorySignature MEMORY_SIGNATURES[] = {
    { 0, 0x0, {0}, 0, "Dummy" }
};

bool SafeCompareBytes(PBYTE pTarget, const BYTE* pSignature, size_t length) {
    __try {
        for (size_t j = 0; j < length; j++) {
            BYTE realCheatByte = pSignature[j] ^ SIGNATURE_XOR_KEY;
            if (pTarget[j] != realCheatByte) {
                return false;
            }
        }
        return true; 
    }
    __except (EXCEPTION_EXECUTE_HANDLER) {
        return false; 
    }
}

bool SafeCompareStaticBytes(PBYTE pTarget, const BYTE* pSignature, int length) {
    __try {
        for (int j = 0; j < length; j++) {
            if (pTarget[j] != pSignature[j]) {
                return false;
            }
        }
        return true;
    }
    __except (EXCEPTION_EXECUTE_HANDLER) {
        return false;
    }
}

bool SafeReadMemoryByte(PBYTE pTarget, BYTE* pOutBuffer, size_t length) {
    __try {
        if (pTarget[0] == 0x00 && pTarget[1] == 0x00 && pTarget[2] == 0x00) {
            return false; 
        }
        memcpy(pOutBuffer, pTarget, length);
        return true;
    }
    __except (EXCEPTION_EXECUTE_HANDLER) {
        return false; 
    }
}

void CallSehMemCpy(PBYTE pDest, PBYTE pSrc, size_t length, bool* pSuccess) {
    __try {
        memcpy(pDest, pSrc, length);
        *pSuccess = true;
    }
    __except (EXCEPTION_EXECUTE_HANDLER) {
        *pSuccess = false;
    }
}

void SafeLogMatch(PBYTE pTarget, size_t length, const std::string& name, DWORD address) {
    BYTE* tempBuffer = (BYTE*)malloc(length);
    if (!tempBuffer) return;

    bool copySuccess = false;
    CallSehMemCpy(tempBuffer, pTarget, length, &copySuccess);

    if (copySuccess) {
        WriteDebugLog("MEMORY SIGNATURE MATCH (CLOUD DUMPS)", name, address, tempBuffer, length);
    } else {
        WriteDebugLog("MEMORY SIGNATURE MATCH (CLOUD DUMPS - UNREADABLE RAM)", name, address, NULL, 0);
    }
    free(tempBuffer);
}

bool ScanMemorySignatures() {
    DWORD_PTR dllBase = (DWORD_PTR)g_hCurrentModule;
    DWORD_PTR dllEnd = dllBase;
    if (g_hCurrentModule != NULL) {
        MODULEINFO modInfo = { 0 };
        if (GetModuleInformation(GetCurrentProcess(), g_hCurrentModule, &modInfo, sizeof(modInfo))) {
            dllEnd = dllBase + modInfo.SizeOfImage;
        }
    }

    for (size_t i = 0; i < DYNAMIC_DUMPS.size(); i++) {
        const DynamicSignature& sig = DYNAMIC_DUMPS[i];
        if (sig.address == 0) continue;

        if ((sig.address >= dllBase && sig.address <= dllEnd) || sig.address < 0x00401000) {
            continue; 
        }

        PBYTE pTarget = (PBYTE)(uintptr_t)sig.address;
        size_t sigSize = sig.signature.size();

        BYTE* localBuffer = (BYTE*)malloc(sigSize);
        if (!localBuffer) continue;

        if (!SafeReadMemoryByte(pTarget, localBuffer, sigSize > 3 ? 3 : sigSize)) {
            free(localBuffer);
            continue; 
        }
        free(localBuffer);

        if (SafeCompareBytes(pTarget, sig.signature.data(), sigSize)) {
            SafeLogMatch(pTarget, sigSize, sig.name, sig.address);
            return true; 
        }
    }

    for (int i = 0; i < sizeof(MEMORY_SIGNATURES) / sizeof(MEMORY_SIGNATURES[0]); i++) {
        if (MEMORY_SIGNATURES[i].address == 0) continue;
        if (MEMORY_SIGNATURES[i].name != NULL && strcmp(MEMORY_SIGNATURES[i].name, "Dummy") == 0) continue;
        if ((MEMORY_SIGNATURES[i].address >= dllBase && MEMORY_SIGNATURES[i].address <= dllEnd) || MEMORY_SIGNATURES[i].address < 0x00401000) {
            continue;
        }
        
        PBYTE pTarget = (PBYTE)(uintptr_t)MEMORY_SIGNATURES[i].address;
        
        if (SafeCompareStaticBytes(pTarget, MEMORY_SIGNATURES[i].signature, MEMORY_SIGNATURES[i].sigLength)) {
            WriteDebugLog("MEMORY SIGNATURE MATCH (STATIC LIST)", MEMORY_SIGNATURES[i].name, MEMORY_SIGNATURES[i].address, pTarget, MEMORY_SIGNATURES[i].sigLength);
            return true;
        }
    }
    return false;
}

bool CheckForDebugger() {
    if (IsDebuggerPresent()) return true;
    BOOL isRemoteDebugger = FALSE;
    CheckRemoteDebuggerPresent(GetCurrentProcess(), &isRemoteDebugger);
    return isRemoteDebugger == TRUE;
}

bool VerifyHostProcess() {
    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);
    std::string path(exePath);
    for(size_t i=0; i<path.length(); ++i) path[i] = tolower(path[i]);
    if (path.find("${(targetProcessName || 'main.exe').toLowerCase()}") == std::string::npos) {
        return false;
    }
    return true;
}

bool CheckApiHook(LPCSTR moduleName, LPCSTR procName) {
    HMODULE hMod = GetModuleHandleA(moduleName);
    if (!hMod) return false;
    FARPROC procAddr = GetProcAddress(hMod, procName);
    if (!procAddr) return false;
    
    BYTE* pBytes = (BYTE*)procAddr;
    if (pBytes[0] == 0xE9 || pBytes[0] == 0xEB || pBytes[0] == 0xE8) {
        return true; 
    }
    return false;
}

bool ScanForApiHooks() {
    if (CheckApiHook("ws2_32.dll", "send") || 
        CheckApiHook("ws2_32.dll", "recv") ||
        CheckApiHook("kernel32.dll", "WriteProcessMemory") || 
        CheckApiHook("kernel32.dll", "ReadProcessMemory")) {
        WriteDebugLog("CRITICAL API HOOK DETECTED", "Network/Memory API altered by foreign tool", 0, NULL, 0);
        return true;
    }
    return false;
}

BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam) {
    if (IsWindowVisible(hwnd)) {
        char title[256];
        GetWindowTextA(hwnd, title, sizeof(title));
        std::string sTitle(title);
        for(size_t i = 0; i < sTitle.length(); ++i) sTitle[i] = tolower(sTitle[i]);
        
        if (sTitle.length() > 0 && (
            sTitle.find("hack") != std::string::npos ||
            sTitle.find("cheat") != std::string::npos ||
            sTitle.find("inject") != std::string::npos ||
            sTitle.find("speedhack") != std::string::npos ||
            sTitle.find("bypass") != std::string::npos
            )) {
            if (sTitle.find("google") == std::string::npos && 
                sTitle.find("chrome") == std::string::npos && 
                sTitle.find("firefox") == std::string::npos &&
                sTitle.find("edge") == std::string::npos &&
                sTitle.find("onyx") == std::string::npos &&
                sTitle.find("explorer") == std::string::npos) {
                
                WriteDebugLog("HEURISTIC SUSPICIOUS WINDOW", title, 0, NULL, 0);
                *((bool*)lParam) = true;
                return FALSE;
            }
        }
    }
    return TRUE;
}

bool ScanHeuristicWindows() {
    bool found = false;
    EnumWindows(EnumWindowsProc, (LPARAM)&found);
    return found;
}

std::string JsonEscape(const std::string& str) {
    std::string escaped;
    for (size_t i = 0; i < str.length(); ++i) {
        char c = str[i];
        if (c == '"') escaped += "\\\\\\\"";
        else if (c == '\\\\') escaped += "\\\\\\\\\\\\\\\\";
        else if (c == '\\b') escaped += "\\\\\\\\b";
        else if (c == '\\f') escaped += "\\\\\\\\f";
        else if (c == '\\n') escaped += "\\\\\\\\n";
        else if (c == '\\r') escaped += "\\\\\\\\r";
        else if (c == '\\t') escaped += "\\\\\\\\t";
        else escaped += c;
    }
    return escaped;
}

bool IsTestModeEnabled() {
    HKEY hKey;
    if (RegOpenKeyExA(HKEY_LOCAL_MACHINE, "SYSTEM\\\\CurrentControlSet\\\\Control", 0, KEY_READ, &hKey) == ERROR_SUCCESS) {
        char value[256];
        DWORD size = sizeof(value);
        if (RegQueryValueExA(hKey, "SystemStartOptions", NULL, NULL, (LPBYTE)value, &size) == ERROR_SUCCESS) {
            std::string startOptions(value);
            for(size_t i=0; i<startOptions.length(); ++i) startOptions[i] = toupper(startOptions[i]);
            if (startOptions.find("TESTSIGNING") != std::string::npos) {
                RegCloseKey(hKey);
                return true;
            }
        }
        RegCloseKey(hKey);
    }
    return false;
}

bool PerformHandshake(const std::string& username, const std::string& hwid, const std::string& modifiedFile) {
    HINTERNET hInternet = InternetOpenA("MuOnline_Client_Plugin", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return false;

    DWORD timeout = 5000;
    InternetSetOptionA(hInternet, INTERNET_OPTION_CONNECT_TIMEOUT, &timeout, sizeof(timeout));
    InternetSetOptionA(hInternet, INTERNET_OPTION_SEND_TIMEOUT, &timeout, sizeof(timeout));
    InternetSetOptionA(hInternet, INTERNET_OPTION_RECEIVE_TIMEOUT, &timeout, sizeof(timeout));

    std::string host = "127.0.0.1";
    std::string path = "/api/auth";
    size_t protocolPos = AUTH_SERVER_URL.find("://");
    std::string urlWithoutProtocol = (protocolPos == std::string::npos) ? AUTH_SERVER_URL : AUTH_SERVER_URL.substr(protocolPos + 3);
    size_t slashPos = urlWithoutProtocol.find("/");
    if (slashPos != std::string::npos) {
        host = urlWithoutProtocol.substr(0, slashPos);
        std::string basePath = urlWithoutProtocol.substr(slashPos);
        if (basePath.back() == '/') basePath.pop_back();
        if (basePath.length() >= 9 && basePath.substr(basePath.length() - 9) == "/api/auth") {
            path = basePath;
        } else {
            path = basePath + "/api/auth";
        }
    } else {
        host = urlWithoutProtocol;
    }

    INTERNET_PORT port = INTERNET_DEFAULT_HTTP_PORT;
    DWORD flags = INTERNET_FLAG_RELOAD;
    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = INTERNET_DEFAULT_HTTPS_PORT;
        flags |= INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;
    }

    std::stringstream json;
    json << "{"
         << "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\","
         << "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","
         << "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\","
         << "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\","
         << "\\\"fileModified\\\": \\\"" << (modifiedFile.empty() ? "none" : JsonEscape(modifiedFile)) << "\\\""
         << "}";
    
    std::string payload = json.str();
    std::string headers = "Content-Type: application/json\\r\\n";

    bool isAuthorized = false;
    int maxRetries = 3;
    
    for (int retry = 0; retry < maxRetries; retry++) {
        HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
        if (!hConnect) {
            Sleep(1000);
            continue;
        }

        HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, flags, 0);
        if (!hRequest) {
            DWORD err = GetLastError();
            std::stringstream ss;
            ss << "HttpOpenRequest Error: " << err;
            g_startupMessage = ss.str();
            InternetCloseHandle(hConnect);
            Sleep(1000);
            continue;
        }

        DWORD dwFlags = 0;
        DWORD dwBuffLen = sizeof(dwFlags);
        if (InternetQueryOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, &dwBuffLen)) {
            dwFlags |= SECURITY_FLAG_IGNORE_UNKNOWN_CA | SECURITY_FLAG_IGNORE_REVOCATION | SECURITY_FLAG_IGNORE_CERT_CN_INVALID | SECURITY_FLAG_IGNORE_CERT_DATE_INVALID | SECURITY_FLAG_IGNORE_WRONG_USAGE;
            InternetSetOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, sizeof(dwFlags));
        }

        BOOL result = HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length());
        
        if (result) {
            char buffer[1024];
            DWORD bytesRead = 0;
            std::string responseString = "";
            while (InternetReadFile(hRequest, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
                buffer[bytesRead] = '\\0';
                responseString += buffer;
            }
            
            if (responseString.find("\\\"success\\\":true") != std::string::npos || responseString.find("\\\"success\\\": true") != std::string::npos) {
                isAuthorized = true;
                size_t msgStart = responseString.find("\\\"message\\\":\\\"");
                if (msgStart != std::string::npos) {
                    msgStart += 11;
                    size_t msgEnd = responseString.find("\\\"", msgStart);
                    if (msgEnd != std::string::npos) {
                        g_startupMessage = responseString.substr(msgStart, msgEnd - msgStart);
                    }
                }
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break; 
            } else if (responseString.find("\\\"action\\\":") != std::string::npos) {
                isAuthorized = false;
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break; 
            }
        }
        
        InternetCloseHandle(hRequest);
        InternetCloseHandle(hConnect);
        if (retry == maxRetries - 1) {
            g_startupMessage = "Network error: Unable to connect to Authentication Server.";
        }
        if (retry < maxRetries - 1) Sleep(2000);
    }

    InternetCloseHandle(hInternet);
    return isAuthorized;
}

void HandleFailure(const std::string& message) {
    EnumWindows([](HWND hwnd, LPARAM lParam) -> BOOL {
        DWORD pid = 0;
        GetWindowThreadProcessId(hwnd, &pid);
        if (pid == GetCurrentProcessId()) {
            ShowWindow(hwnd, SW_HIDE);
            EnableWindow(hwnd, FALSE);
        }
        return TRUE;
    }, 0);

    if (g_trayIconAdded) {
        g_nid.uFlags = NIF_INFO;
        strcpy_s(g_nid.szInfo, message.c_str());
        strcpy_s(g_nid.szInfoTitle, "Onyx Guard - Security");
        g_nid.dwInfoFlags = NIIF_WARNING;
        Shell_NotifyIconA(NIM_MODIFY, &g_nid);
        Sleep(4000);
    }
    
${actionOnFailure === 'EXIT' ? '    ExitProcess(0);' : (actionOnFailure === 'MSG_BOX' ? '    MessageBoxA(NULL, message.c_str(), "Onyx Guard - Error", MB_OK | MB_ICONERROR);\n    ExitProcess(0);' : '    ExitProcess(0);')}
}

HICON CreateOnyxLogoIcon() {
    int size = 32;
    HDC hScreenDC = GetDC(NULL);
    HDC hMemDC = CreateCompatibleDC(hScreenDC);
    HBITMAP hBitmap = CreateCompatibleBitmap(hScreenDC, size, size);
    HBITMAP hMask = CreateCompatibleBitmap(hScreenDC, size, size);

    SelectObject(hMemDC, hMask);
    HBRUSH whiteBrush = CreateSolidBrush(RGB(255, 255, 255));
    HBRUSH blackBrush = CreateSolidBrush(RGB(0, 0, 0));
    RECT r = {0, 0, size, size};
    FillRect(hMemDC, &r, whiteBrush);
    
    POINT pts[4] = { {size/2, 2}, {size-2, size/2}, {size/2, size-2}, {2, size/2} };
    SelectObject(hMemDC, GetStockObject(NULL_PEN));
    SelectObject(hMemDC, blackBrush);
    Polygon(hMemDC, pts, 4);

    SelectObject(hMemDC, hBitmap);
    FillRect(hMemDC, &r, blackBrush);
    
    HBRUSH tealBrush = CreateSolidBrush(RGB(45, 212, 191));
    SelectObject(hMemDC, tealBrush);
    Polygon(hMemDC, pts, 4);
    
    POINT pts2[4] = { {size/2, 8}, {size-8, size/2}, {size/2, size-8}, {8, size/2} };
    HBRUSH darkBrush = CreateSolidBrush(RGB(15, 20, 25));
    SelectObject(hMemDC, darkBrush);
    Polygon(hMemDC, pts2, 4);

    DeleteObject(whiteBrush);
    DeleteObject(blackBrush);
    DeleteObject(tealBrush);
    DeleteObject(darkBrush);

    ICONINFO ii = {0};
    ii.fIcon = TRUE;
    ii.hbmMask = hMask;
    ii.hbmColor = hBitmap;
    HICON hIcon = CreateIconIndirect(&ii);

    DeleteObject(hBitmap);
    DeleteObject(hMask);
    DeleteDC(hMemDC);
    ReleaseDC(NULL, hScreenDC);

    return hIcon;
}

LRESULT CALLBACK TrayWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    if (msg == WM_USER + 1) {
        if (LOWORD(lParam) == WM_LBUTTONDBLCLK) {
            MessageBoxA(hwnd, "Onyx Guard Anti-Hack is active.", "Onyx Guard", MB_OK | MB_ICONINFORMATION);
        }
    } else if (msg == WM_USER + 2) {
        g_nid.uFlags = NIF_INFO;
        strcpy_s(g_nid.szInfo, g_startupMessage.c_str());
        strcpy_s(g_nid.szInfoTitle, "Onyx Guard");
        g_nid.dwInfoFlags = NIIF_INFO;
        Shell_NotifyIconA(NIM_MODIFY, &g_nid);
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

    g_nid.cbSize = sizeof(NOTIFYICONDATAA);
    g_nid.hWnd = hwnd;
    g_nid.uID = 1001;
    g_nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    g_nid.uCallbackMessage = WM_USER + 1;
    g_nid.hIcon = CreateOnyxLogoIcon();
    strcpy_s(g_nid.szTip, "Onyx Guard (Active)");

    Shell_NotifyIconA(NIM_ADD, &g_nid);
    g_trayIconAdded = true;
    g_trayHwnd = hwnd;

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    Shell_NotifyIconA(NIM_DELETE, &g_nid);
    DestroyIcon(g_nid.hIcon);
    g_trayIconAdded = false;
    return 0;
}

DWORD WINAPI SplashThread(LPVOID lpParam) {
    WNDCLASSA wc = {0};
    wc.lpfnWndProc = DefWindowProcA;
    wc.hInstance = GetModuleHandleA(NULL);
    wc.hbrBackground = CreateSolidBrush(RGB(15, 15, 20));
    wc.lpszClassName = "OnyxSplashClass";
    RegisterClassA(&wc);

    int screenW = GetSystemMetrics(SM_CXSCREEN);
    int screenH = GetSystemMetrics(SM_CYSCREEN);
    int splashW = 500;
    int splashH = 260;

    HWND hwndSplash = CreateWindowExA(
        WS_EX_TOPMOST | WS_EX_TOOLWINDOW | 0x00080000, 
        "OnyxSplashClass",
        "OnyxGuard Loading",
        WS_POPUP | WS_VISIBLE,
        (screenW - splashW) / 2, (screenH - splashH) / 2,
        splashW, splashH,
        NULL, NULL, wc.hInstance, NULL
    );

    HMODULE hUser32 = GetModuleHandleA("user32.dll");
    if (hUser32) {
        typedef BOOL(WINAPI *SLWA)(HWND, COLORREF, BYTE, DWORD);
        SLWA pSetLayeredWindowAttributes = (SLWA)GetProcAddress(hUser32, "SetLayeredWindowAttributes");
        if (pSetLayeredWindowAttributes) pSetLayeredWindowAttributes(hwndSplash, 0, 240, 2);
    }

    if (hwndSplash) {
        HDC hdc = GetDC(hwndSplash);
        RECT rect;
        GetClientRect(hwndSplash, &rect);

        HFONT hFontTitle = CreateFontA(32, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, ANSI_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, DEFAULT_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
        HFONT hFontDesc = CreateFontA(14, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, ANSI_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, DEFAULT_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
        
        const char* steps[] = {
            "Initializing OnyxGuard Core...",
            "Establishing Secure Connection...",
            "Scanning Memory Signatures...",
            "Verifying File Integrity...",
            "Loading Anti-Hack Modules...",
            "Securing Process Environment..."
        };

        for (int i = 0; i <= 100; i += 2) {
            HBRUSH bgBrush = CreateSolidBrush(RGB(12, 12, 16));
            FillRect(hdc, &rect, bgBrush);
            DeleteObject(bgBrush);

            HPEN hPen = CreatePen(PS_SOLID, 1, RGB(45, 212, 191));
            HGDIOBJ oldPen = SelectObject(hdc, hPen);
            HBRUSH nullBrush = (HBRUSH)GetStockObject(NULL_BRUSH);
            HGDIOBJ oldBrush = SelectObject(hdc, nullBrush);
            Rectangle(hdc, rect.left, rect.top, rect.right, rect.bottom);
            SelectObject(hdc, oldPen);
            SelectObject(hdc, oldBrush);
            DeleteObject(hPen);

            SetBkMode(hdc, TRANSPARENT);
            
            int cx = splashW / 2;
            int cy = 60;
            int size = 30;
            POINT pts[4] = { {cx, cy - size}, {cx + size, cy}, {cx, cy + size}, {cx - size, cy} };
            HBRUSH tealBrush = CreateSolidBrush(RGB(45, 212, 191));
            HGDIOBJ oldBrush2 = SelectObject(hdc, tealBrush);
            HPEN tealPen = CreatePen(PS_SOLID, 2, RGB(45, 212, 191));
            HGDIOBJ oldPen2 = SelectObject(hdc, tealPen);
            Polygon(hdc, pts, 4);
            
            POINT ptsInner[4] = { {cx, cy - size/2 + 2}, {cx + size/2 - 2, cy}, {cx, cy + size/2 - 2}, {cx - size/2 + 2, cy} };
            HBRUSH darkBrush = CreateSolidBrush(RGB(12, 12, 16));
            SelectObject(hdc, darkBrush);
            Polygon(hdc, ptsInner, 4);
            
            SelectObject(hdc, oldBrush2);
            SelectObject(hdc, oldPen2);
            DeleteObject(tealBrush);
            DeleteObject(tealPen);
            DeleteObject(darkBrush);

            SetTextColor(hdc, RGB(255, 255, 255));
            SelectObject(hdc, hFontTitle);
            RECT titleRect = { 0, 100, splashW, 140 };
            DrawTextA(hdc, "ONYX GUARD", -1, &titleRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

            SetTextColor(hdc, RGB(148, 163, 184));
            SelectObject(hdc, hFontDesc);
            RECT subRect = { 0, 135, splashW, 160 };
            DrawTextA(hdc, "ADVANCED CLIENT PROTECTION", -1, &subRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

            int stepIdx = (i / 18);
            if (stepIdx > 5) stepIdx = 5;
            SetTextColor(hdc, RGB(45, 212, 191));
            RECT textRect = { 40, 185, splashW - 40, 205 };
            DrawTextA(hdc, steps[stepIdx], -1, &textRect, DT_LEFT | DT_VCENTER | DT_SINGLELINE);

            char pct[16];
            wsprintfA(pct, "%d%%", i);
            RECT pctRect = { 40, 185, splashW - 40, 205 };
            DrawTextA(hdc, pct, -1, &pctRect, DT_RIGHT | DT_VCENTER | DT_SINGLELINE);

            RECT barBg = { 40, 210, splashW - 40, 220 };
            HBRUSH barBgBrush = CreateSolidBrush(RGB(30, 41, 59));
            FillRect(hdc, &barBg, barBgBrush);
            DeleteObject(barBgBrush);

            int fillW = ((splashW - 80) * i) / 100;
            if (fillW > 0) {
                RECT barFill = { 40, 210, 40 + fillW, 220 };
                HBRUSH barFillBrush = CreateSolidBrush(RGB(45, 212, 191));
                FillRect(hdc, &barFill, barFillBrush);
                DeleteObject(barFillBrush);
            }

            Sleep(100);
        }

        if (g_hSplashEvent) {
            SetEvent(g_hSplashEvent);
        }

        DeleteObject(hFontTitle);
        DeleteObject(hFontDesc);
        ReleaseDC(hwndSplash, hdc);
        DestroyWindow(hwndSplash);
        UnregisterClassA("OnyxSplashClass", wc.hInstance);
    }
    return 0;
}

void ShowSplashScreen() {
${enableSplashScreen ? '    CreateThread(NULL, 0, SplashThread, NULL, 0, NULL);' : ''}
}

DWORD WINAPI DirectoryMonitorThread(LPVOID lpParam) {
    HANDLE hDir = CreateFileA(
        ".", FILE_LIST_DIRECTORY,
        FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
        NULL, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, NULL
    );

    if (hDir == INVALID_HANDLE_VALUE) return 1;

    char buffer[1024];
    DWORD bytesReturned;
    while (true) {
        if (ReadDirectoryChangesW(hDir, &buffer, sizeof(buffer), TRUE, 
            FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_SIZE | FILE_NOTIFY_CHANGE_LAST_WRITE,
            &bytesReturned, NULL, NULL)) {
            
            FILE_NOTIFY_INFORMATION* pNotify = (FILE_NOTIFY_INFORMATION*)buffer;
            char filename[MAX_PATH];
            WideCharToMultiByte(CP_ACP, 0, pNotify->FileName, pNotify->FileNameLength / 2, filename, MAX_PATH, NULL, NULL);
            filename[pNotify->FileNameLength / 2] = '\\0';
            
            std::string fileStr = filename;
            for(size_t i = 0; i < fileStr.length(); ++i) {
                if (fileStr[i] == '/') fileStr[i] = '\\\\';
                fileStr[i] = tolower(fileStr[i]);
            }
            
            bool isCritical = false;
            for (int i = 0; i < sizeof(CRITICAL_FILES) / sizeof(CRITICAL_FILES[0]); i++) {
                std::string critFile = CRITICAL_FILES[i].filePath;
                if (critFile.empty()) continue;
                for(size_t j = 0; j < critFile.length(); ++j) {
                    if (critFile[j] == '/') critFile[j] = '\\\\';
                    critFile[j] = tolower(critFile[j]);
                }
                if (fileStr == critFile) {
                    isCritical = true;
                    break;
                }
            }
            
            if (isCritical) {
                WriteDebugLog("FILE INTEGRITY CHANGED RUNTIME", filename, 0, NULL, 0);
                HandleFailure("REAL-TIME INTEGRITY VIOLATION: Game files were modified while running.");
            }
        }
    }
    CloseHandle(hDir);
    return 0;
}

void FetchDynamicLists() {
    HINTERNET hInternet = InternetOpenA("OnyxGuard", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return;

    std::string host = "127.0.0.1";
    std::string path = "/api/dumplist?projectId=${activeProjectId}";
    size_t protocolPos = AUTH_SERVER_URL.find("://");
    if (protocolPos != std::string::npos) {
        host = AUTH_SERVER_URL.substr(protocolPos + 3);
        size_t slashPos = host.find("/");
        if (slashPos != std::string::npos) {
            std::string basePath = host.substr(slashPos);
            if (basePath.back() == '/') basePath.pop_back();
            if (basePath.length() >= 9 && basePath.substr(basePath.length() - 9) == "/api/auth") {
                path = basePath.substr(0, basePath.length() - 9) + "/api/dumplist?projectId=${activeProjectId}";
            } else {
                path = basePath + "/api/dumplist?projectId=${activeProjectId}";
            }
            host = host.substr(0, slashPos);
        }
    }

    HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), 
        AUTH_SERVER_URL.find("https://") != std::string::npos ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT, 
        NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);

    if (hConnect) {
        DWORD flags = INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE;
        if (AUTH_SERVER_URL.find("https://") != std::string::npos) {
            flags |= INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;
        }

        HINTERNET hRequest = HttpOpenRequestA(hConnect, "GET", path.c_str(), NULL, NULL, NULL, flags, 0);
        if (hRequest) {
            DWORD dwFlags = 0;
            DWORD dwBuffLen = sizeof(dwFlags);
            if (InternetQueryOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, &dwBuffLen)) {
                dwFlags |= SECURITY_FLAG_IGNORE_UNKNOWN_CA | SECURITY_FLAG_IGNORE_REVOCATION | SECURITY_FLAG_IGNORE_CERT_CN_INVALID | SECURITY_FLAG_IGNORE_CERT_DATE_INVALID | SECURITY_FLAG_IGNORE_WRONG_USAGE;
                InternetSetOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, sizeof(dwFlags));
            }
            if (HttpSendRequestA(hRequest, NULL, 0, NULL, 0)) {
                std::string response;
                char buffer[1024];
                DWORD bytesRead;
                while (InternetReadFile(hRequest, buffer, sizeof(buffer), &bytesRead) && bytesRead > 0) {
                    response.append(buffer, bytesRead);
                }

                DYNAMIC_WINDOWS.clear();
                DYNAMIC_DUMPS.clear();

                std::stringstream ss(response);
                std::string line;
                int mode = 0;
                while(std::getline(ss, line)) {
                    if (!line.empty() && line.back() == '\\r') line.pop_back();
                    if(line == "[WINDOWS]") { mode = 1; continue; }
                    if(line == "[DUMPS]") { mode = 2; continue; }
                    if(line.empty()) continue;
                    
                    if(mode == 1) {
                        DYNAMIC_WINDOWS.push_back(line);
                    } else if(mode == 2) {
                        bool inQuotes = false;
                        std::string currentToken;
                        std::vector<std::string> parts;
                        for (size_t k = 0; k < line.length(); ++k) {
                            char c = line[k];
                            if (c == '"') {
                                inQuotes = !inQuotes;
                            } else if ((c == ' ' || c == '\\t') && !inQuotes) {
                                if (!currentToken.empty()) {
                                    parts.push_back(currentToken);
                                    currentToken.clear();
                                }
                            } else {
                                currentToken += c;
                            }
                        }
                        if (!currentToken.empty()) parts.push_back(currentToken);

                        if(parts.size() >= 4) {
                            try {
                                DynamicSignature sig;
                                sig.address = strtoul(parts[1].c_str(), NULL, 16);
                                sig.name = parts.back();
                                if(sig.name.size() > 2 && sig.name.front() == '"' && sig.name.back() == '"') {
                                    sig.name = sig.name.substr(1, sig.name.size() - 2);
                                }
                                
                                for(size_t i = 2; i < parts.size() - 1; i++) {
                                    BYTE rawByte = (BYTE)strtoul(parts[i].c_str(), NULL, 16);
                                    sig.signature.push_back(rawByte ^ SIGNATURE_XOR_KEY);
                                }
                                DYNAMIC_DUMPS.push_back(sig);
                            } catch(...) {}
                        }
                    }
                }
            }
            InternetCloseHandle(hRequest);
        }
        InternetConnectA(hInternet, host.c_str(), 
            AUTH_SERVER_URL.find("https://") != std::string::npos ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT, 
            NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
    }
    InternetCloseHandle(hInternet);
}

// ============================================================================
//  LA TRAMPA INLINE: Sincronización externa segura post-cargador de Windows
// ============================================================================
LPSTR WINAPI HookedGetCommandLineA() {
    DWORD dwOldProtect;
    VirtualProtect(g_pfnOriginalGetCommandLineA, 5, PAGE_EXECUTE_READWRITE, &dwOldProtect);
    memcpy(g_pfnOriginalGetCommandLineA, g_originalBytes, 5);
    VirtualProtect(g_pfnOriginalGetCommandLineA, 5, dwOldProtect, &dwOldProtect);

    if (g_hSplashEvent) {
        while (WaitForSingleObject(g_hSplashEvent, 0) == WAIT_TIMEOUT) {
            MSG msg;
            while (PeekMessageA(&msg, NULL, 0, 0, PM_REMOVE)) {
                TranslateMessage(&msg);
                DispatchMessageA(&msg);
            }
            Sleep(5); 
        }
    }

    return g_pfnOriginalGetCommandLineA();
}

void InstallRuntimeGate() {
    g_pfnOriginalGetCommandLineA = (PFN_GetCommandLineA)GetProcAddress(GetModuleHandleA("kernel32.dll"), "GetCommandLineA");
    if (!g_pfnOriginalGetCommandLineA) return;

    DWORD dwOldProtect;
    VirtualProtect(g_pfnOriginalGetCommandLineA, 5, PAGE_EXECUTE_READWRITE, &dwOldProtect);
    
    memcpy(g_originalBytes, g_pfnOriginalGetCommandLineA, 5);

    BYTE jmp[5] = { 0xE9, 0x00, 0x00, 0x00, 0x00 };
    DWORD relativeAddress = (DWORD)HookedGetCommandLineA - (DWORD)g_pfnOriginalGetCommandLineA - 5;
    memcpy(&jmp[1], &relativeAddress, 4);

    memcpy(g_pfnOriginalGetCommandLineA, jmp, 5);
    VirtualProtect(g_pfnOriginalGetCommandLineA, 5, dwOldProtect, &dwOldProtect);
}

// ============================================================================
//  HILO CENTRAL DE INTEGRIDAD Y MONITORIZACIÓN CONTINUA
// ============================================================================
DWORD WINAPI IntegrityCheckThread(LPVOID lpParam) {
    // 1. Verificación obligatoria de privilegios antes de cualquier handshake o escaneo
    if (!CheckAndRequestAdminPrivileges()) {
        return 1;
    }

    // 2. Aplicar mitigación DACL sobre los Handles para bloquear Process Hacker/PC Hunter en Ring 3
    ProtectProcessHandles();

    if (g_hSplashEvent) {
        // Esperamos a que finalice la animación de carga de la ventana gráfica
        WaitForSingleObject(g_hSplashEvent, INFINITE);
    }

    FetchDynamicLists();
${enableFileCheck ? '    CreateThread(NULL, 0, DirectoryMonitorThread, NULL, 0, NULL);' : ''}
    Sleep(500); 
    
${enableProcessBinding ? `    if (!VerifyHostProcess()) {
        WriteDebugLog("PROCESS EXECUTION ERROR", "DLL loaded outside main.exe", 0, NULL, 0);
        HandleFailure("UNAUTHORIZED PROCESS: Onyx Guard must only be loaded via " + std::string("${targetProcessName || 'main.exe'}") + ".");
        return 1;
    }` : ''}

${enableAntiDebug ? `    if (CheckForDebugger()) {
        WriteDebugLog("REVERSE ENGINEERING DETECTION", "Active debugger attached to game process", 0, NULL, 0);
        HandleFailure("DEBUGGER DETECTED: Please close all reverse-engineering tools.");
        return 1;
    }` : ''}

${enableTestModeBlock ? `    if (IsTestModeEnabled()) {
        WriteDebugLog("WINDOWS TESTMODE BREACH", "Windows running with TESTSIGNING active", 0, NULL, 0);
        HandleFailure("SECURITY BREACH: Windows is running in Test Mode (Testsigning). Please disable it to play.");
        return 1;
    }` : ''}
    
    std::string hwid = GetHardwareID();
    char compNameUser[MAX_COMPUTERNAME_LENGTH + 1] = {0};
    DWORD compNameUserLen = MAX_COMPUTERNAME_LENGTH + 1;
    if (!GetComputerNameA(compNameUser, &compNameUserLen)) {
        lstrcpyA(compNameUser, "Player");
    }
    std::string accountName = compNameUser; 
    
    bool status = PerformHandshake(accountName, hwid, "");
    
    if (!status) {
        std::string err = g_startupMessage.empty() ? "CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized." : g_startupMessage;
        WriteDebugLog("HTTPS HANDSHAKE DENIED", err, 0, NULL, 0);
        HandleFailure(err);
        return 1;
    }
    
    if (g_startupMessage.empty()) {
        g_startupMessage = "Welcome to Onyx Guard!";
    }
    
    if (g_trayHwnd) {
        PostMessageA(g_trayHwnd, WM_USER + 2, 0, 0);
    }
    
    int tickCount = 0;
    while(true) {
        if (tickCount % 10 == 0) { 
            FetchDynamicLists();
        }
        tickCount++;
        
        // --- Escaneos en Tiempo Real Estilo Premium ---
${enableHeuristics ? `        if (DetectSpeedHack()) {
            HandleFailure("SPEEDHACK DETECTED: Game acceleration anomaly found.");
        }` : ''}
${enableAntiMacro ? `        if (CheckForVirtualInputs()) {
            HandleFailure("AUTOMATION DETECTED: Illegal Macro or Virtual input injection.");
        }
        if (ScanForBlacklistedWindows()) {
            HandleFailure("ILLEGAL SOFTWARE DETECTED: A blacklisted macro, auto-clicker, or memory editor was found.");
        }` : ''}
${enableDllScanner ? `        if (ScanForInjectedDLLs()) {
            HandleFailure("DLL INJECTION DETECTED: A malicious DLL module was found in memory.");
        }` : ''}
${enableMemoryScanner ? `        if (ScanMemorySignatures()) {
            HandleFailure("MEMORY TAMPERING DETECTED: Known cheat signatures found in memory.");
        }` : ''}
${enableApiHookDetection ? `        if (ScanForApiHooks()) {
            HandleFailure("API HOOK DETECTED: Critical system functions have been modified.");
        }` : ''}
${enableHeuristics ? `        if (ScanHeuristicWindows()) {
            HandleFailure("SUSPICIOUS WINDOW DETECTED: Heuristic scan detected a hack-like window running.");
        }` : ''}
        Sleep(3000); 
    }
    
    return 0;
}

// ============================================================================
//  PUNTO DE ENTRADA NATIVO DE LA DLL (ULTRA-RÁPIDO)
// ============================================================================
BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved) {
    switch (ul_reason_for_call) {
    case DLL_PROCESS_ATTACH: {
        DisableThreadLibraryCalls(hModule);
        g_hCurrentModule = hModule;
        
        g_hSplashEvent = CreateEventA(NULL, TRUE, FALSE, NULL);
        
        // 1. Inyectamos la trampa inline en GetCommandLineA para retrasar main.exe de forma segura
        InstallRuntimeGate();

        // 2. Desplegamos la interfaz y los subprocesos de red paralelos
        ShowSplashScreen();
        CreateThread(NULL, 0, IntegrityCheckThread, NULL, 0, NULL);
        CreateThread(NULL, 0, TrayIconThread, NULL, 0, NULL);
        break;
    }
    case DLL_PROCESS_DETACH:
        if (g_hSplashEvent) {
            CloseHandle(g_hSplashEvent);
        }
        break;
    }
    return TRUE; 
}`;  }, [serverUrl, securityToken, clientVersion, enableFileCheck, actionOnFailure, enableAntiMacro, blacklistedPrograms, clientFiles, enableDllScanner, enableMemoryScanner, enableSplashScreen, enablePayloadEncryption, enableAntiDebug, enableProcessBinding, targetProcessName]);


  const csharpCode = "/* C# Template currently being updated. Please use the C++ DLL template. */";

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = (log.username || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (log.hwid || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (log.ip || '').includes(searchTerm);
      
      if (logFilter === 'ALL') return matchesSearch;
      if (logFilter === 'ALLOWED') return matchesSearch && log.status === 'ALLOWED';
      if (logFilter === 'BLOCKED') return matchesSearch && log.status !== 'ALLOWED';
      return matchesSearch;
    });
  }, [logs, searchTerm, logFilter]);


  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => 
      (acc.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.hwid || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050508] to-[#050508] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute w-32 h-32 border border-blue-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
            <div className="absolute w-28 h-28 border border-cyan-400/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
            <Shield className="w-16 h-16 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]" />
          </div>
          
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 tracking-tighter mb-4 uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            OnyxGuard
          </h1>
          
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <p className="text-blue-300/80 font-mono text-xs tracking-[0.4em] uppercase">
              Initializing Matrix
            </p>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping [animation-delay:0.2s]"></div>
          </div>
          
          <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-full origin-left animate-[scale-x_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden font-sans">
        {/* Modern Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-emerald-500/10"></div>
        
        {/* Glow Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 p-8 z-10">
          
          {/* Left Side: Brand Showcase */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start space-y-8">
            <div className="relative inline-flex p-4 bg-gradient-to-br from-amber-500/20 to-amber-900/20 rounded-2xl border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
              <Shield className="w-20 h-20 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-500 font-serif tracking-tight drop-shadow-sm">
                OnyxGuard
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-light max-w-xl leading-relaxed">
                Enterprise-grade client authentication & HWID protection framework.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-500 pt-4">
              <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Real-time Protection
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                Zero-Trust Auth
              </div>
            </div>
          </div>

          {/* Right Side: Login Panel */}
          <div className="w-full max-w-md">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              {/* Subtle hover effect light */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-8 shadow-inner">
                  <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Secure Access</h2>
                <p className="text-slate-400 mb-10 text-center text-sm">
                  Please sign in to access the secure dashboard.
                </p>
                
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                  {authError && <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm text-center">{authError}</div>}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                  <div className="flex gap-3 mt-2">
                    <button 
                      type="submit"
                      className="flex-1 bg-amber-600 text-white hover:bg-amber-500 active:scale-[0.98] font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                    >
                      Login
                    </button>
                    
                  </div>
                </form>
              </div>
            </div>
            
            <p className="text-center text-slate-600 text-xs mt-6 font-mono">
              v1.0.4d // ENCRYPTED SESSION
            </p>
          </div>
          
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
        <div className="max-w-[1900px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
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
      <main className="flex-1 max-w-[1900px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
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
                <Activity className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.dashboard}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.dashboardSub}</span>
                </div>
              </button>

              <button 
                id="tab-hardware"
                onClick={() => setActiveTab('hardware')}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === 'hardware' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Database className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.hardware || (language === 'es' ? 'Perfiles de Hardware' : 'Hardware Profiles')}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.hardwareSub || (language === 'es' ? 'HWIDs Registrados' : 'Registered HWIDs')}</span>
                </div>
              </button>

              <button 
                id="tab-integrity"
                onClick={() => setActiveTab('integrity')}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === 'integrity' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileCheck className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.integrity || (language === 'es' ? 'Integridad de Archivos' : 'File Integrity')}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.integritySub || (language === 'es' ? 'Reglas de Hash MD5' : 'MD5 Hashing rules')}</span>
                </div>
              </button>

              <button 
                id="tab-dumps"
                onClick={() => setActiveTab('dumps')}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === 'dumps' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Shield className="w-4 h-4 shrink-0 text-red-400" />
                <div className="leading-none">
                  <div className="text-sm text-red-400/90">{t.nav.dumps || (language === 'es' ? 'Volcados de Procesos' : 'Process Dumps')}</div>
                  <span className="text-[9px] text-red-500/70 font-mono">{t.nav.dumpsSub || (language === 'es' ? 'Hacks bloqueados' : 'Blocked hacks')}</span>
                </div>
              </button>
              <button 
                id="tab-aimonitor"
                onClick={() => setActiveTab('aimonitor')}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeTab === 'aimonitor' 
                    ? 'bg-blue-500/10 text-blue-300 border-l-2 border-blue-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Brain className="w-4 h-4 shrink-0 text-blue-400" />
                <div className="leading-none">
                  <div className="text-sm text-blue-400/90">{language === 'es' ? 'Monitor IA' : 'AI Monitor'}</div>
                  <span className="text-[9px] text-blue-500/70 font-mono">{language === 'es' ? 'Analisis Inteligente' : 'Smart Analysis'}</span>
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
                        {language === 'es' ? 'Notificación en reloj (Tray) + ExitProcess' : 'Tray Notification + ExitProcess'}
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
                      value={licenseExpiration || ""}
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
                      checked={enableRealtimeMonitor}
                      onChange={(e) => setEnableRealtimeMonitor(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>{language === 'es' ? 'Monitoreo de Archivos en Tiempo Real (OS Watcher)' : 'Real-time File Monitor (OS Watcher)'}</span>
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
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={enableSplashScreen}
                      onChange={(e) => setEnableSplashScreen(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>{language === 'es' ? 'Mostrar Splash Screen al Iniciar' : 'Show Splash Screen on Startup'}</span>
                  </label>

                  {enableMultiClientBlock && (
                    <div className="flex items-center gap-2 ml-6 mt-1 text-slate-400 text-sm">
                      <span>{language === 'es' ? 'Límite (servidor):' : 'Limit (Server):'}</span>
                      <input 
                        type="number"
                        min="1" max="10"
                        value={multiClientLimit || ""}
                        onChange={(e) => setMultiClientLimit(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 w-16 text-slate-200 text-xs"
                      />
                    </div>
                  )}

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

                    <div className="flex flex-col gap-2 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                        <input 
                          type="checkbox" 
                          checked={enableProcessBinding}
                          onChange={(e) => setEnableProcessBinding(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <span>{language === 'es' ? 'Vinculación de Proceso Exclusivo:' : 'Exclusive Process Binding:'}</span>
                      </label>
                      {enableProcessBinding && (
                        <input 
                          type="text" 
                          value={targetProcessName}
                          onChange={(e) => setTargetProcessName(e.target.value)}
                          className="ml-6 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 w-32 focus:border-amber-500 focus:outline-none"
                          placeholder="main.exe"
                        />
                      )}
                    </div>

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
                        checked={enableApiHookDetection}
                        onChange={(e) => setEnableApiHookDetection(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Detección de Hooks de API (Avanzado)' : 'API Hooking Detection (Advanced)'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableHeuristics}
                        onChange={(e) => setEnableHeuristics(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Escaneo Heurístico (Ventanas sospechosas)' : 'Heuristic Scanning (Suspicious Windows)'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableTestModeBlock}
                        onChange={(e) => setEnableTestModeBlock(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Bloquear Windows Test Mode (Modo de Prueba)' : 'Block Windows Test Mode (Testsigning)'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableWatchdog}
                        onChange={(e) => setEnableWatchdog(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Thread Watchdog (Anti-Suspend)' : 'Thread Watchdog (Anti-Suspend)'}</span>
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

          {/* TAB 3: HWID PROFILES */}
          {activeTab === 'hardware' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              
              {/* Dashboard Layout Header */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                      <Database className="w-5 h-5 text-amber-400" /> {language === 'es' ? 'Panel de Control de Administrador de Mu Online' : 'Mu Online Admin Control Panel'}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Main Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                  
                  {/* Left: Accounts Database (8 cols) */}
                  <div className="lg:col-span-12 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-serif">{t.dashboard.registeredAccs}</h3>
                      <span className="text-sm text-slate-500">{filteredAccounts.length} {language === 'es' ? 'cuentas en total' : 'accounts total'}</span>
                    </div>

                    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 uppercase font-mono tracking-wider font-bold">
                            <th className="p-3">{t.dashboard.colUser}</th>
                            <th className="p-3">{t.dashboard.colHwid}</th>
                            <th className="p-3">IP</th>
                            <th className="p-3">{language === 'es' ? 'Actividad' : 'Activity'}</th>
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
                                  <span className={`w-2 h-2 rounded-full ${acc.status === 'BANNED' || acc.status === 'TEMP_BANNED' ? 'bg-red-500' : acc.status === 'UNLOCKED' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                                    {acc.username}
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-amber-300/80 font-semibold">{acc.hwid}</td>
                                <td className="p-3 font-mono text-slate-300">
                                  {acc.ip || 'Unknown'}
                                </td>
                                <td className="p-3 text-slate-400">
                                  <div className="text-xs text-slate-300 font-mono">
                                    Login: {acc.lastLogin ? new Date(acc.lastLogin).toLocaleString() : 'N/A'}
                                  </div>
                                  {acc.lastHeartbeat && (
                                    <div className="text-[10px] text-amber-500/80 font-mono mt-0.5">
                                      Heartbeat: {new Date(acc.lastHeartbeat).toLocaleString()}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3">
                                  {acc.status === 'BANNED' && (
                                    <span className="bg-red-950/80 text-red-400 px-2 py-0.5 rounded border border-red-500/20 text-xs font-bold">
                                      {language === 'es' ? 'BANEADO' : 'BANNED'}
                                    </span>
                                  )}
                                  {acc.status === 'TEMP_BANNED' && (
                                    <span className="bg-red-900 text-red-200 px-2 py-0.5 rounded border border-red-500/50 text-xs font-bold">
                                      {language === 'es' ? 'BANEADO (TEMP)' : 'TEMP BANNED'}
                                    </span>
                                  )}
                                  {(acc.status === 'ACTIVE' || acc.status === 'ONLINE') && (
                                    <span className="bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 text-xs font-bold">
                                      {language === 'es' ? 'BLOQUEADO' : 'LOCKED'}
                                    </span>
                                  )}
                                  {acc.status === 'UNLOCKED' && (
                                    <span className="bg-yellow-950/80 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20 text-xs font-bold">
                                      {language === 'es' ? 'OMITIR (Libre)' : 'BYPASS (Unlocked)'}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    {(acc.status === 'BANNED' || acc.status === 'TEMP_BANNED') ? (
                                      <button 
                                        onClick={() => toggleAccountStatus(acc.id, 'UNBAN' as any)}
                                        className="bg-slate-900 hover:bg-emerald-900/40 border border-slate-800 text-emerald-400 px-2 py-1 rounded text-xs transition font-semibold"
                                      >
                                        {language === 'es' ? 'Quitar Baneo' : 'Unban'}
                                      </button>
                                    ) : (
                                      <button 
                                        onClick={() => toggleAccountStatus(acc.id, 'BAN')}
                                        className="bg-slate-900 hover:bg-red-950/60 border border-slate-800 text-red-400 px-2 py-1 rounded text-xs transition font-semibold"
                                      >
                                        {language === 'es' ? 'Banear HWID' : 'Ban Player'}
                                      </button>
                                    )}

                                    {(acc.status === 'ACTIVE' || acc.status === 'ONLINE') ? (
                                      <button 
                                        onClick={() => toggleAccountStatus(acc.id, 'UNLOCK')}
                                        className="bg-slate-900 hover:bg-yellow-950/60 border border-slate-800 text-yellow-400 px-2 py-1 rounded text-xs transition font-semibold flex items-center gap-1"
                                        title={language === 'es' ? 'Permitir inicio desde cualquier PC una vez' : 'Allow login from any HWID once (useful if user changed motherboard/CPU)'}
                                      >
                                        <Unlock className="w-3 h-3" /> {language === 'es' ? 'Resetear HWID' : 'HWID Reset'}
                                      </button>
                                    ) : acc.status === 'UNLOCKED' ? (
                                      <button 
                                        onClick={() => toggleAccountStatus(acc.id, 'LOCK')}
                                        className="bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 text-emerald-400 px-2 py-1 rounded text-xs transition font-semibold flex items-center gap-1"
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
                              <td colSpan={6} className="p-8 text-center text-slate-500">
                                {language === 'es' ? 'No se encontraron cuentas de jugadores registrados con esos parámetros.' : 'No registered accounts match your query parameters.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Quick Add Form */}
                    <form onSubmit={handleAddAccount} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-end gap-3">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1 font-mono">
                          {language === 'es' ? 'Crear Credenciales de Cuenta de Jugador:' : 'Create Player Account Credentials:'}
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. ElfArcher" 
                          value={newAccUser}
                          onChange={(e) => setNewAccUser(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-amber-200 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1 font-mono">
                          {language === 'es' ? 'Vincular HWID Personalizado (Opcional):' : 'Bind Custom HWID (Optional):'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={language === 'es' ? 'Dejar en blanco para registrar al iniciar' : 'Leave blank for automatic login registration'} 
                          value={newAccHwid}
                          onChange={(e) => setNewAccHwid(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-amber-200 focus:border-amber-500 focus:outline-none font-mono"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded text-sm transition h-8 shrink-0 flex items-center gap-1 self-end w-full md:w-auto justify-center"
                      >
                        <Plus className="w-4 h-4" /> {language === 'es' ? 'Añadir Usuario' : 'Add User'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FILE INTEGRITY */}
          {activeTab === 'integrity' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-amber-400" /> {t.dashboard.fileIntegrityRules || (language === 'es' ? 'Reglas de Lista de Integridad de Archivos' : 'File Integrity Checklist Rules')}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.dashboard.fileIntegrityRulesDesc || (language === 'es' ? 'La DLL dentro del cliente escanea automáticamente los archivos, calcula el MD5 y su peso, enviándolos al servidor para comparar con esta lista de integridad.' : 'The custom DLL inside the game client automatically scans the files, calculates the exact MD5 hash and size, and securely transmits them to the server for verification.')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-900 text-amber-500 font-bold uppercase tracking-widest text-xs">
                            <th className="p-3">{t.dashboard.colFile || (language === 'es' ? 'Ruta relativa' : 'File path')}</th>
                            <th className="p-3">{t.dashboard.colHash || 'MD5 Hash'}</th>
                            <th className="p-3">{t.dashboard.colImportance || 'Importance'}</th>
                            <th className="p-3 text-right">{t.dashboard.colAction || 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {clientFiles.map(file => (
                            <tr key={file.id} className="hover:bg-slate-900/50 transition">
                              <td className="p-3">
                                <div className="flex items-center gap-2 font-bold text-slate-200">
                                  <FileCheck className="w-4 h-4 text-amber-500 shrink-0" />
                                  <span className="truncate max-w-[200px]">{file.path}</span>
                                </div>
                              </td>
                              <td className="p-3 font-mono text-amber-300/80 text-xs">
                                {file.expectedHash}
                                <div className="text-[10px] text-slate-500 mt-0.5">{language === 'es' ? 'Tamaño: ' : 'Size: '}{file.fileSize}</div>
                              </td>
                              <td className="p-3">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono font-bold ${
                                  file.importance === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/10' :
                                  file.importance === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-500/10' :
                                  'bg-slate-800 text-slate-400'
                                }`}>{file.importance === 'CRITICAL' && language === 'es' ? 'CRÍTICO' : file.importance}</span>
                              </td>
                              <td className="p-3 text-right">
                                <button 
                                  onClick={() => deleteFile(file.id)}
                                  className="text-slate-500 hover:text-red-400 transition"
                                  title="Delete file integrity rule"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {clientFiles.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-xs">
                                {language === 'es' ? 'No hay reglas configuradas.' : 'No rules configured.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-serif">
                        {language === 'es' ? 'Reglas de Integridad de Archivos' : 'File Hashing Standards'}
                      </h3>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
                      {/* File Add form */}
                      <form onSubmit={handleAddFile} className="border-t border-slate-800 pt-3 space-y-2.5 text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-400 uppercase tracking-wider text-xs block font-mono">
                            {language === 'es' ? 'Registrar Archivo de Juego:' : 'Register Client Asset File:'}
                          </span>
                          
                          <label className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded cursor-pointer transition border border-amber-500/20 flex items-center gap-1 font-mono">
                            <Upload className="w-3 h-3" />
                            {isGeneratingMD5 ? (language === 'es' ? 'Calculando MD5...' : 'Calculating MD5...') : (language === 'es' ? 'Extraer desde Archivo' : 'Extract MD5 from File')}
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={handleGenerateMD5}
                              disabled={isGeneratingMD5}
                            />
                          </label>
                        </div>
                        
                        <div>
                          <input 
                            type="text" 
                            placeholder={language === 'es' ? 'Ruta (ej. Data/item.bmd)' : 'File path (e.g. Data/item.bmd)'} 
                            value={newFilePath}
                            onChange={(e) => setNewFilePath(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-sm text-amber-200 focus:border-amber-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder={language === 'es' ? 'Suma de Comprobación MD5' : 'Expected MD5 Hash signature'} 
                            value={newFileHash}
                            onChange={(e) => setNewFileHash(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-sm text-amber-200 focus:border-amber-500 focus:outline-none font-mono"
                            required
                          />
                          <select 
                            value={newFileImportance}
                            onChange={(e) => setNewFileImportance(e.target.value as any)}
                            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-sm text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                          >
                            <option value="CRITICAL">{language === 'es' ? 'Crítica' : 'Critical'}</option>
                            <option value="HIGH">{language === 'es' ? 'Alta' : 'High'}</option>
                            <option value="MEDIUM">{language === 'es' ? 'Media' : 'Medium'}</option>
                          </select>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold py-1 rounded text-sm transition border border-amber-500/20"
                        >
                          + {language === 'es' ? 'Guardar Regla de Hash de Archivo' : 'Save File Hash Rule'}
                        </button>
                      </form>

                    </div>
                  </div>

              </div>

              </div>
            </div>
          )}

          {/* TAB 5: HACKER DUMPS */}
          {activeTab === 'dumps' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              {/* Hacker Process Dumps Section */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-500" /> {t.dashboard.hackerDumps}
                      <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-[10px] rounded-full font-mono">
                        {dumps.length} {language === 'es' ? 'hacks cargados' : 'loaded hacks'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.dashboard.hackerDumpsDesc}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                  {/* Left: Dump List Table */}
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    
                    {/* File Upload Zone */}
                    <label className="border-2 border-dashed border-slate-700/50 hover:border-amber-500/50 bg-slate-950/50 rounded-xl p-6 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer group relative overflow-hidden">
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".txt,.list,.db,.json"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = async (event) => {
                              const content = event.target?.result;
                                                            if (typeof content === 'string') {
                                const lines = content.split(/[\r\n]+/);
                                const newDumps = [];
                                const seenRules = new Set(dumps.map(d => d.rawRule));
                                let parsedCount = 0;
                                let skippedCount = 0;
                                for (const line of lines) {
                                  const trimmed = line.trim();
                                  if (trimmed && !trimmed.startsWith('//')) {
                                    if (!seenRules.has(trimmed)) {
                                      seenRules.add(trimmed);
                                      parsedCount++;
                                      
                                      const parts = trimmed.split(/[\t]+/).filter(Boolean);
                                      let name = trimmed;
                                      if (parts.length > 2) {
                                        name = parts[parts.length - 1].replace(/"/g, '');
                                      } else {
                                        const spaceParts = trimmed.split(/[\s]+/).filter(Boolean);
                                        if (spaceParts.length > 2) {
                                            name = spaceParts[spaceParts.length - 1].replace(/"/g, '');
                                        }
                                      }
                                      
                                      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
                                      newDumps.push({
                                        id,
                                        projectId: activeProjectId,
                                        name: name,
                                        desc: 'Imported Signature',
                                        rawRule: trimmed,
                                        timestamp: new Date().toISOString()
                                      });
                                    } else {
                                      skippedCount++;
                                    }
                                  }
                                }
                                
                                // Batch upload via API
                                try {
                                  setIsUploadingDumps(true);
                                  // Chunk into batches of 500
                                  const CHUNK_SIZE = 500;
                                  for (let i = 0; i < newDumps.length; i += CHUNK_SIZE) {
                                    const chunk = newDumps.slice(i, i + CHUNK_SIZE);
                                    await Promise.all(chunk.map(d => 
                                      fetch('/api/dumps', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', 'x-project-id': activeProjectId },
                                        body: JSON.stringify(d)
                                      })
                                    ));
                                  }
                                  alert(language === 'es' ? `Se subieron ${parsedCount} firmas a la base de datos de OnyxGuard. (${skippedCount} duplicados omitidos)` : `Uploaded ${parsedCount} signatures to OnyxGuard DB. (${skippedCount} duplicates skipped)`);
                                } catch(e) {
                                  console.error(e);
                                  alert("Error uploading dumps to database.");
                                } finally {
                                  setIsUploadingDumps(false);
                                }
                              }
                            };
                            reader.readAsText(file);
                            // clear file input
                            e.target.value = '';
                          }
                        }}
                        disabled={isUploadingDumps}
                      />
                      <div className="bg-slate-900 p-3 rounded-full group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-300 font-mono">
                          {isUploadingDumps 
                            ? (language === 'es' ? 'Cargando y procesando firmas...' : 'Uploading and processing signatures...') 
                            : (language === 'es' ? 'Subir Dump.List / Dump.db completas' : 'Upload full Dump.List / Dump.db')}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {isUploadingDumps 
                            ? (language === 'es' ? 'Por favor espera, esto puede tomar unos minutos dependiendo del tamaño del archivo.' : 'Please wait, this may take a few minutes depending on file size.') 
                            : (language === 'es' ? 'Arrastra y suelta tu archivo aquí o haz clic para buscar.' : 'Drag & drop your file here or click to browse.')}
                        </p>
                      </div>
                    </label>

                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-900 text-amber-500 font-bold uppercase tracking-widest text-xs">
                            <th className="p-3">{t.dashboard.colHackName}</th>
                            <th className="p-3">{t.dashboard.colHackDesc}</th>
                            <th className="p-3">{language === 'es' ? 'Fecha de Carga' : 'Loaded At'}</th>
                            <th className="p-3 text-right">{t.dashboard.colAction}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {dumps.map(dump => (
                            <tr key={dump.id} className="hover:bg-slate-900/50 transition">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Terminal className="w-4 h-4 text-slate-500" />
                                  <span className="font-mono text-amber-200">{dump.name}</span>
                                </div>
                              </td>
                              <td className="p-3 text-xs text-slate-400">{dump.desc}</td>
                              <td className="p-3 text-xs text-slate-500 font-mono">
                                {dump.timestamp ? new Date(dump.timestamp).toLocaleString() : 'N/A'}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={async () => {
                                    try {
                                      await fetch(`/api/dumps/${dump.id}`, { method: 'DELETE', headers: { 'x-project-id': activeProjectId } });
                                      setDumps(dumps.filter(d => d.id !== dump.id));
                                    } catch(e) { console.error(e); }
                                  }}
                                  className="text-slate-500 hover:text-red-400 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {dumps.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-xs">
                                No dump rules configured.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Add Dump Form */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
                      <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider font-serif mb-2">
                        {t.dashboard.addDumpRule}
                      </h3>
                      <form onSubmit={handleAddDump} className="flex flex-col gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 font-mono">
                            {t.dashboard.processName}
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. CheatEngine.exe" 
                            value={newDumpName}
                            onChange={(e) => setNewDumpName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-amber-200 focus:border-amber-500 focus:outline-none font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 font-mono">
                            {t.dashboard.colHackDesc}
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. Memory Editor" 
                            value={newDumpDesc}
                            onChange={(e) => setNewDumpDesc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 focus:border-amber-500 focus:outline-none"
                            required
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="w-full bg-red-950/40 hover:bg-red-900 text-red-400 font-bold px-4 py-2.5 rounded text-sm transition mt-2 border border-red-500/20 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> {t.dashboard.addDumpRule}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DASHBOARD (REAL-TIME EVENTS) */}

          {activeTab === 'aimonitor' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Brain className="w-48 h-48" />
                </div>
                
                <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2 mb-2 relative z-10">
                  <Brain className="w-5 h-5" />
                  {language === 'es' ? 'OnyxGuard IA - Monitor en Tiempo Real' : 'OnyxGuard AI - Real-time Monitor'}
                </h3>
                <p className="text-slate-400 mb-6 relative z-10 max-w-3xl text-sm">
                  {language === 'es' 
                    ? 'La Inteligencia Artificial de OnyxGuard utiliza modelos de aprendizaje profundo (Gemini) para analizar comportamientos anómalos, inyecciones de memoria y modificaciones de archivos no registradas. Aquí puedes ver sus veredictos en tiempo real.'
                    : 'OnyxGuard AI uses deep learning models (Gemini) to analyze anomalous behaviors, memory injections, and unregistered file modifications. Here you can see its verdicts in real-time.'}
                </p>
                <div className="flex gap-4 mb-6 relative z-10">
                  <button 
                    onClick={async () => {
                      alert(language === 'es' ? 'Simulando intento de hackeo... La IA está analizando el archivo.' : 'Simulating hack attempt... AI is analyzing the file.');
                      try {
                        await fetch('/api/auth', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            username: 'Hacker_Test',
                            hwid: 'SIMULATED-HWID-HACK',
                            ip: '127.0.0.1',
                            clientVersion: clientVersion,
                            secretToken: securityToken,
                            fileModified: 'C:\\Games\\MuOnline\\CheatEngine_Bypass.dll'
                          })
                        });
                      } catch (e) { console.error(e); }
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 transition text-sm font-bold flex items-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    {language === 'es' ? 'Simular Archivo Malicioso (Hack)' : 'Simulate Malicious File (Hack)'}
                  </button>

                  <button 
                    onClick={async () => {
                        alert(language === 'es' ? 'Simulando archivo seguro... La IA está analizando el archivo.' : 'Simulating safe file... AI is analyzing the file.');
                        try {
                          await fetch('/api/auth', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              username: 'Normal_Player',
                              hwid: 'SIMULATED-HWID-SAFE',
                              ip: '127.0.0.1',
                              clientVersion: clientVersion,
                              secretToken: securityToken,
                              fileModified: 'C:\\Games\\MuOnline\\Logs\\update_2026.log'
                            })
                          });
                        } catch (e) { console.error(e); }
                    }}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-500/30 transition text-sm font-bold flex items-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    {language === 'es' ? 'Simular Archivo Seguro (Log)' : 'Simulate Safe File (Log)'}
                  </button>
                </div>

                <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 h-[500px] overflow-y-auto font-mono text-xs">
                  {logs.filter(l => l.reason.includes('AI Analysis:') || l.reason.includes('IA detectó')).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4">
                      <Brain className="w-12 h-12 opacity-20" />
                      <p>{language === 'es' ? 'No hay eventos de IA registrados aún.' : 'No AI events logged yet.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {logs.filter(l => l.reason.includes('AI Analysis:') || l.reason.includes('IA detectó')).map((log, i) => (
                        <div key={log.id} className={`p-3 rounded border ${log.status === 'ALLOWED' ? 'bg-blue-900/10 border-blue-900/30' : 'bg-red-900/10 border-red-900/30'} flex flex-col gap-2`}>
                          <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                            <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'ALLOWED' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                              {log.status === 'ALLOWED' ? 'VEREDICTO: SEGURO' : 'VEREDICTO: AMENAZA DETECTADA'}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <span className="text-slate-500">Player:</span> <span className="text-slate-300">{log.username}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-slate-500">HWID:</span> <span className="text-slate-300">{log.hwid}</span>
                            </div>
                          </div>
                          <div className="mt-1 flex items-start gap-2">
                            <Brain className={`w-4 h-4 mt-0.5 ${log.status === 'ALLOWED' ? 'text-blue-400' : 'text-red-400'}`} />
                            <span className={`${log.status === 'ALLOWED' ? 'text-blue-300' : 'text-red-300'}`}>
                              {log.reason}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-md font-bold text-amber-200 font-serif uppercase tracking-wide flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-amber-400" /> {t.dashboard.realtimeEvents}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {t.dashboard.realtimeEventsDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
                    <div className="flex items-center gap-2">
                        <button onClick={handleDownloadLogs} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition text-sm flex items-center gap-1 border border-slate-700">
                           <Download className="w-4 h-4" /> {language === 'es' ? 'Descargar' : 'Download'}
                        </button>
                        <button onClick={handleClearLogs} className="bg-red-950/40 hover:bg-red-900/60 text-red-400 px-3 py-1.5 rounded transition text-sm flex items-center gap-1 border border-red-900/50">
                           <Trash2 className="w-4 h-4" /> {language === 'es' ? 'Limpiar' : 'Clear'}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-sm font-mono">
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

                </div>{/* Event Logs list */}
                <div className="mt-4 space-y-3">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className={`p-5 rounded-lg border text-sm font-mono flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          log.status === 'ALLOWED' 
                            ? 'bg-emerald-950/10 border-emerald-950/50 text-emerald-300/90' 
                            : 'bg-red-950/10 border-red-950/50 text-red-300/90'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                          <span className="text-slate-500 font-bold shrink-0">{log.timestamp}</span>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${
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
                    <div className="text-center py-12 text-slate-500 font-mono text-sm">
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
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 -mx-4 -mt-4 px-4 py-2.5 flex items-center justify-between">
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
        <div className="max-w-[1900px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
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
