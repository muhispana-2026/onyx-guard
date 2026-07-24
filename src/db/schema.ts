import { mysqlTable, text, varchar, boolean, int, json } from 'drizzle-orm/mysql-core';

export const projects = mysqlTable('projects', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name').notNull(),
});

export const config = mysqlTable('config', {
  projectId: varchar('project_id', { length: 255 }).primaryKey(),
  serverUrl: text('server_url'),
  clientVersion: text('client_version'),
  securityToken: text('security_token'),
  actionOnFailure: text('action_on_failure'),
  enableHwidCheck: boolean('enable_hwid_check'),
  enableFileCheck: boolean('enable_file_check'),
  enableRealtimeMonitor: boolean('enable_realtime_monitor'),
  enableMultiClientBlock: boolean('enable_multi_client_block'),
  multiClientLimit: int('multi_client_limit'),
  enableAntiMacro: boolean('enable_anti_macro'),
  enableAntiDebug: boolean('enable_anti_debug'),
  enableDllScanner: boolean('enable_dll_scanner'),
  enableMemoryScanner: boolean('enable_memory_scanner'),
  enableSplashScreen: boolean('enable_splash_screen'),
  enableProcessBinding: boolean('enable_process_binding'),
  enableApiHookDetection: boolean('enable_api_hook_detection'),
  enableHeuristics: boolean('enable_heuristics'),
  enableTestModeBlock: boolean('enable_test_mode_block'),
  enableWatchdog: boolean('enable_watchdog'),
  enablePayloadEncryption: boolean('enable_payload_encryption'),
  blacklistedPrograms: json('blacklisted_programs'),
  licenseExpiration: text('license_expiration'),
  speedhackSensitivity: text('speedhack_sensitivity'),
});

export const accounts = mysqlTable('accounts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  projectId: varchar('project_id', { length: 255 }).notNull(),
  username: text('username'),
  hwid: text('hwid'),
  status: text('status'),
  ip: text('ip'),
  lastLogin: text('last_login'),
  unbanTime: text('unban_time'),
  lastHeartbeat: text('last_heartbeat'),
});

export const fileRules = mysqlTable('file_rules', {
  id: varchar('id', { length: 255 }).primaryKey(),
  projectId: varchar('project_id', { length: 255 }).notNull(),
  filePath: text('file_path'),
  expectedHash: text('expected_hash'),
  importance: text('importance'),
  fileSize: text('file_size'),
});

export const logs = mysqlTable('logs', {
  id: varchar('id', { length: 255 }).primaryKey(),
  projectId: varchar('project_id', { length: 255 }).notNull(),
  type: text('type'),
  message: text('message'),
  timestamp: text('timestamp'),
  username: text('username'),
  hwid: text('hwid'),
  ip: text('ip'),
  clientVersion: text('client_version'),
  reason: text('reason'),
});

export const dumps = mysqlTable('dumps', {
  id: varchar('id', { length: 255 }).primaryKey(),
  projectId: varchar('project_id', { length: 255 }).notNull(),
  name: text('name'),
  desc: text('desc'),
  timestamp: text('timestamp'),
  rawRule: text('raw_rule'),
});
