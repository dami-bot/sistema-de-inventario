const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let nestProcess;
let nextProcess;

function startNestBackend() {
  const backendPath = path.join(__dirname, "backend", "dist", "main.js");

  nestProcess = spawn(process.execPath, [backendPath], {
    stdio: "inherit"
  });

  nestProcess.on("close", (code) => {
    console.log(`NestJS cerrado con código ${code}`);
  });

  nestProcess.on("error", (err) => {
    console.error("Error al iniciar NestJS:", err);
  });
}

function startNextFrontend() {
  // Ejecutar "npm start" en carpeta frontend para levantar Next.js
  nextProcess = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["start"], {
    cwd: path.join(__dirname, "frontend"),
    stdio: "inherit"
  });

  nextProcess.on("close", (code) => {
    console.log(`Next.js cerrado con código ${code}`);
  });

  nextProcess.on("error", (err) => {
    console.error("Error al iniciar Next.js:", err);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false
    }
  });

  // Cargar Next.js en modo servidor
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  startNestBackend();
  startNextFrontend();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
  if (nestProcess) nestProcess.kill();
  if (nextProcess) nextProcess.kill();
});
