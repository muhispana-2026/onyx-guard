with open('server.ts', 'r') as f:
    content = f.read()

old_text = """          const newAccountId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
          await db.insert(accounts).values({
            id: newAccountId,
            projectId,
            username,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            ip: ip as string,
            lastLogin: timestamp
          });
          return res.json({
            success: true,
            action: "CONTINUE",
            message: "Welcome! Registered PC successfully.",
            sessionToken: Math.random().toString(36).substring(2, 15)
          });
        }
      }
      res.json({
        success: true,
        action: "CONTINUE",
        message: "Authentication successful.",
        sessionToken: Math.random().toString(36).substring(2, 15)"""

new_text = """          const newAccountId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
          await db.insert(accounts).values({
            id: newAccountId,
            projectId,
            username,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            ip: ip as string,
            lastLogin: timestamp
          });
          return res.json({
            success: true,
            action: "CONTINUE",
            message: `Bienvenido ${username}, tu equipo con IP ${ip} y HWID ${hwid} ha sido registrado en Onyx Guard. Disfruta del juego.`,
            sessionToken: Math.random().toString(36).substring(2, 15)
          });
        }
      }
      res.json({
        success: true,
        action: "CONTINUE",
        message: username ? `Bienvenido nuevamente ${username}, disfruta del juego.` : "Authentication successful.",
        sessionToken: Math.random().toString(36).substring(2, 15)"""

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('server.ts', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find text to patch")
