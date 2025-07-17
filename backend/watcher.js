const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");

let pending = [];

function watchAndScan(onFiles) {
  const watchPath = path.resolve(__dirname, "../watched"); // katalog do obserwacji

  if (!fs.existsSync(watchPath)) {
    fs.mkdirSync(watchPath);
  }

  const watcher = chokidar.watch(watchPath, {
    ignored: /^\./,
    persistent: true,
    depth: 1,
  });

  watcher.on("add", (filePath) => {
    const fileName = path.basename(filePath);
    pending.push({ title: fileName });
    onFiles(pending);
    pending = [];
  });
}

module.exports = { watchAndScan };
