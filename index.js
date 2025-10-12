#!/usr/bin/env node

const { Command } = require('commander');
const initCommand = require('./commands/init');
const createTableCommand = require('./commands/create');
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

const createCommand = program
  .command('create')
  .description('Create table components and structure');

createCommand
  .command('table <entityname>')
  .description('Create a new data table for an entity')
  .action(createTableCommand);

program.parse(process.argv);