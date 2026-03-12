import fs from "fs";
import path from "path";

function checkBOM(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      checkBOM(fullPath);
    } else if (file.endsWith(".js")) {
      const buf = fs.readFileSync(fullPath);
      if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
        console.log(`❌ BOM found in ${fullPath}`);
      }
    }
  }
}

checkBOM("./");
console.log("✅ Scan complete!");
