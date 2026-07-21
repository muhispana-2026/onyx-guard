import { pgTable, text, boolean, integer } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const config = pgTable('config', {
  projectId: text('project_id').primaryKey(),
  serverUrl: text('server_url'),
  clientVersion: text('client_version'),
  securityToken: text('security_token'),
  actionOnFailure: text('action_on_failure'),
  enableHwidCheck: boolean('enable_hwid_check'),
  enableFileCheck: boolean('enable_file_check'),
  enableRealtimeMonitor: boolean('enable_realtime_monitor'),
  enableMultiClientBlock: boolean('enable_multi_client_block'),
  multiClientLimit: integer('multi_client_limit'),
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
  blacklistedPrograms: text('blacklisted_programs').array(),
  licenseExpiration: text('license_expiration'),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  username: text('username'),
  hwid: text('hwid'),
  status: text('status'),
  ip: text('ip'),
  lastLogin: text('last_login'),
  unbanTime: text('unban_time'),
  lastHeartbeat: text('last_heartbeat'),
});

export const fileRules = pgTable('file_rules', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  filePath: text('file_path'),
  expectedHash: text('expected_hash'),
  importance: text('importance'),
  fileSize: text('file_size'),
});

export const logs = pgTable('logs', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  type: text('type'),
  message: text('message'),
  timestamp: text('timestamp'),
  username: text('username'),
  hwid: text('hwid'),
  ip: text('ip'),
  clientVersion: text('client_version'),
  reason: text('reason'),
});

export const dumps = pgTable('dumps', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  name: text('name'),
  desc: text('desc'),
  timestamp: text('timestamp'),
  rawRule: text('raw_rule'),
});
