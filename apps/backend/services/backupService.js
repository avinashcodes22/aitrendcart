import fs from "fs";
import path from "path";
import { spawn } from "child_process";

/* ====================================
   BACKUP DIRECTORY
==================================== */

const BACKUP_DIR = "./backups";

/* FULL PATH TO mongodump */

const MONGODUMP =
"C:\\Program Files\\mongodb-database-tools-windows-x86_64-100.14.1\\bin\\mongodump.exe";

/* ====================================
   ENSURE BACKUP FOLDER EXISTS
==================================== */

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

/* ====================================
   RUN BACKUP
==================================== */

export function runBackup() {

  const date = new Date()
    .toISOString()
    .slice(0,10);

  const file =
`${BACKUP_DIR}/backup-${date}.gz`;

  console.log("Starting backup...");
  console.log("Using mongodump:", MONGODUMP);

  const dump = spawn(MONGODUMP,[
    `--uri=${process.env.MONGO_URI}`,
    `--archive=${file}`,
    "--gzip"
  ]);

  dump.stdout.on("data",(data)=>{
    console.log(`mongodump: ${data}`);
  });

  dump.stderr.on("data",(data)=>{
    console.error(`mongodump error: ${data}`);
  });

  dump.on("close",(code)=>{

    if(code === 0){

      console.log("📦 Database backup created:", file);

      cleanupOldBackups();

    } else {

      console.error("❌ Backup process exited with code", code);

    }

  });

}

/* ====================================
   CLEAN OLD BACKUPS
==================================== */

function cleanupOldBackups(){

  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith(".gz"))
    .sort()
    .reverse();

  const old = files.slice(7);

  for(const f of old){

    fs.unlinkSync(
      path.join(BACKUP_DIR,f)
    );

    console.log("🗑 Deleted old backup:", f);

  }

}