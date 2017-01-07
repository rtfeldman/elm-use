#!/usr/bin/env node

var path = require("path");
var requestedVersion = process.argv[2];

if (typeof requestedVersion !== "string" || !requestedVersion.match(/\d+/)) {
  var packageInfo = require(path.join(__dirname, "package.json"));

  console.log("elm-use v" + packageInfo.version);

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

  // 'arm', 'ia32', or 'x64'.
  var arch = process.arch;

  // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
  var operatingSystem = process.platform;

  var filename = operatingSystem + "-" + arch + ".tar.gz";
  var url = "https://dl.bintray.com/elmlang/elm-platform/"
    + targetVersion + "/" + filename;
  var errorMessage = "Unfortunately, there are no Elm Platform " + requestedVersion + " binaries available for your operating system and architecture.\n\nIf you would like to build Elm from source, there are instructions at https://github.com/elm-lang/elm-platform#build-from-source\n";

  console.log("Installing Elm " + requestedVersion + "...");

  binstall(url, {path: currentVersionDir, strip: 1}, {errorMessage: errorMessage}).then(function() {
    activate();
  }).catch(function(err) {
    fsExtra.removeSync(currentVersionDir);
    console.error("Error downloading binaries for Elm " + requestedVersion);
    console.error(err);
    process.exit(1);
  });
}
