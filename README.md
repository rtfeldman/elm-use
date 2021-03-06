# elm-use [![Version](https://img.shields.io/npm/v/elm-use.svg)](https://www.npmjs.com/package/elm-use) [![Travis build Status](https://travis-ci.org/rtfeldman/elm-use.svg?branch=master)](http://travis-ci.org/rtfeldman/elm-use) [![AppVeyor build status](https://ci.appveyor.com/api/projects/status/0j7x0mpggmtu6mms/branch/master?svg=true)](https://ci.appveyor.com/project/rtfeldman/elm-use/branch/master)

Switch between Elm versions.

If you switch to a version you do not have, it will be installed.

In addition to the Elm Platform binaries, [`elm-format`](https://github.com/avh4/elm-format)
will also be versioned automatically in this way.

![demo](https://cloud.githubusercontent.com/assets/1094080/21740236/4d59430a-d468-11e6-85c6-9f2e1c9ec638.gif)

Binaries are cached in `~/.elm-use`, which you can delete if you're not using
them anymore. You can also delete this folder in the event of a new `elm-format`
release, so `elm-use` will grab the latest one the next time you switch.

### NOTE

Make sure to uninstall any previous versions of Elm before using this!
Otherwise they may take precedence on your PATH.
