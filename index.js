#!/usr/bin/env node

const { Command } = require('commander');
const initCommand = require('./commands/init');
const program = new Command();

program
  .name('tableforge')
  .description('Transform your API responses into production ready tables in no time')
  .version('1.0.0', '-v, --version', 'Output the current version')
  .helpOption('-h, --help', 'Display help for command');


program
  .command('init')
  .description('Initialize shadcn/ui and add required components')
  .action(initCommand);

program.parse(process.argv);