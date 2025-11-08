import fs from "fs";
import path from "path";

function cleanFile(filePath) {
  try {
    // Read file as text (this removes weird binary sequences)
    const text = fs.readFileSync(filePath, "utf8");
    // Remove any invisible junk at the start (safety)
    const cleanText = text.replace(/^[^\w{}[\]()'"`]/, "");
    fs.writeFileSync(filePath, cleanText, { encoding: "utf8" });
    console.log("✅ Cleaned:", filePath);
  } catch (err) {
    console.error("⚠️ Error cleaning", filePath, err.message);
  }
}

function walkDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (item.endsWith(".js")) {
      cleanFile(fullPath);
    }
  }
}

// Run for current directory
walkDir("./");
console.log("\n✨ All .js files rewritten as clean UTF-8!\n");
