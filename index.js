#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .name('tableforge')
  .description('Transform your API responses into production ready tables in no time')
  .version('1.0.0', '-v, --version', 'Output the current version')
  .helpOption('-h, --help', 'Display help for command');


program.parse(process.argv);