import 'dotenv/config';
import { db } from './src/db/index.ts';

async function updateDb() {
  try {
    // Add speedhackSensitivity column
    const result = await db.execute("ALTER TABLE config ADD COLUMN IF NOT EXISTS speedhack_sensitivity TEXT DEFAULT '1.80';");
    console.log("Column speedhack_sensitivity added.");
  } catch (e) {
    console.error("Error adding column:", e);
  }
  process.exit(0);
}
updateDb();
