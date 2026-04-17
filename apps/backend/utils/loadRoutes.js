import fs from "fs";
import path from "path";

export function loadRoutes(app, basePath, folderPath) {

const files = fs.readdirSync(folderPath);

for (const file of files) {

if (!file.endsWith(".js")) continue;

const route = require(path.join(folderPath, file)).default;

const routeName = file.replace(".js","");

const url = `${basePath}/${routeName}`;

app.use(url, route);

console.log("📡 Loaded route:", url);

}

}
