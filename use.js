var path = require("path");
var requestedVersion = process.argv[2];

if (typeof requestedVersion === "undefined") {
  console.log("use-elm")

  process.exit(1);
}

if (requestedVersion === "--version") {
  var packageInfo = require(path.join(__dirname, "package.json"));

  console.log(packageInfo.version);

  process.exit(1);
}

function hasOnlyOneDot(str) {
  return /^[^.]+\.[^.]+$/.test(str);
}

// Translate e.g. 0.18 into 0.18.0
targetVersion = hasOnlyOneDot(requestedVersion) ? requestedVersion + ".0" : requestedVersion;

var fs = require("fs");
var fsExtra = require("fs-extra");
var homedir = require("homedir");
var binariesDir = path.join(__dirname, "binaries");
var currentVersionDir = path.join(homedir(), ".use_elm", targetVersion);

function activate() {
  fsExtra.copySync(currentVersionDir, binariesDir);

  console.log("Now using Elm " + requestedVersion);
}

if (fs.existsSync(currentVersionDir)) {
  activate();
} else {
  var binstall = require("binstall");

  fsExtra.mkdirp(currentVersionDir);

  // 'arm', 'ia32', or 'x64'.
  var arch = process.arch;

  // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
  var operatingSystem = process.platform;

  var filename = operatingSystem + "-" + arch + ".tar.gz";
  var url = "https://dl.bintray.com/elmlang/elm-platform/"
    + targetVersion + "/" + filename;

  console.log("Installing Elm " + requestedVersion + "...");

  binstall(url, {path: currentVersionDir, strip: 1}).then(function() {
    activate();
  }).catch(function(err) {
    console.error("Error downloading binaries for Elm " + targetVersion);
    console.error(err);
    process.exit(1);
  });
}
