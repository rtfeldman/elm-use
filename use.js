#!/usr/bin/env node

//@flow

var path = require("path");
var packageInfo = require("./package.json");
var requestedVersion = process.argv[2];

if (
  typeof requestedVersion !== "string" ||
  (requestedVersion !== "latest" && !requestedVersion.match(/\d+/))
) {
  console.log("elm-use " + packageInfo.version);

  process.exit(1);
}

if (requestedVersion === "--version") {
  console.log(packageInfo.version);

  process.exit(0);
}

function hasOnlyOneDot(str) {
  return /^[^.]+\.[^.]+$/.test(str);
}

// Translate e.g. 0.18 into 0.18.0
var targetVersion = hasOnlyOneDot(requestedVersion)
  ? requestedVersion + ".0"
  : requestedVersion;

var fs = require("fs");
var fsExtra = require("fs-extra");
var homedir = require("homedir");
var binariesDir = path.join(__dirname, "binaries");
var currentVersionDir = path.join(
  homedir(),
  ".elm-use",
  "versions",
  targetVersion
);

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
  var platformUrl =
    "https://dl.bintray.com/elmlang/elm-platform/" +
    targetVersion +
    "/" +
    filename;
  var platformError =
    "Unfortunately, there are no Elm Platform " +
    requestedVersion +
    " binaries available for your operating system and architecture.\n\nIf you would like to build Elm from source, there are instructions at https://github.com/elm-lang/elm-platform#build-from-source\n";
  var elmFormatUrl =
    "https://dl.bintray.com/elmlang/elm-format/" +
    targetVersion +
    "/latest/" +
    filename;
  var elmFormatError =
    "Warning: there is no elm-format " +
    requestedVersion +
    " binary available for your operating system and architecture.\n\nTo find a compatible version, try https://github.com/avh4/elm-format\n";

  console.log(
    "Installing Elm " +
      requestedVersion +
      " (and a compatible elm-format version)..."
  );

  Promise.all([
    binstall(
      platformUrl,
      { path: currentVersionDir, strip: 1 },
      { errorMessage: platformError }
    ),
    binstall(
      elmFormatUrl,
      { path: currentVersionDir },
      { errorMessage: elmFormatError }
    )
  ])
    .then(function() {
      activate();
    })
    .catch(function(err) {
      fsExtra.removeSync(currentVersionDir);
      console.error("Error downloading binaries for Elm " + requestedVersion);
      console.error(err);
      process.exit(1);
    });
}
