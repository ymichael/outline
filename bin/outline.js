#!/usr/bin/env node

/**
 * Module Dependencies.
 */
var program = require('commander');
var pkg = require('../package.json');
var version = pkg.version;

program
  .version(version)
