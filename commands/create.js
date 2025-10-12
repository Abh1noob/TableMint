const path = require('path');
const {
  toPascalCase,
  toCamelCase,
  toTitleCase,
  toKebabCase,
  processTemplate,
  writeFile,
  directoryExists,
  fileExists,
} = require('../utils/fileHelpers');

async function createTableCommand(entityName, options) {
  console.log(`Creating table structure for "${entityName}"...\n`);

  if (!entityName || entityName.trim() === '') {
    console.error('Error: Entity name is required!');
    console.log('Usage: tableforge create table <entityname>');
    process.exit(1);
  }

  let appDir = path.join(process.cwd(), 'app');
  let appDirRelative = 'app';
  
  if (!directoryExists(appDir)) {
    appDir = path.join(process.cwd(), 'src', 'app');
    appDirRelative = 'src/app';
    
    if (!directoryExists(appDir)) {
      console.error('Error: "app" or "src/app" directory not found!');
      console.log('Make sure you are in a Next.js project root directory.');
      console.log('The "app" or "src/app" directory should exist for the App Router.');
      process.exit(1);
    }
  }

  const entityNamePascal = toPascalCase(entityName);
  const entityNameCamel = toCamelCase(entityName);
  const entityNameTitle = toTitleCase(entityName);
  const entityNameKebab = toKebabCase(entityName);

  const targetDir = path.join(appDir, entityNameKebab);

  if (directoryExists(targetDir)) {
    console.error(`Error: Directory "${appDirRelative}/${entityNameKebab}" already exists!`);
    console.log('Please choose a different entity name or remove the existing directory.');
    process.exit(1);
  }

  const templatesDir = path.join(__dirname, '../templates/table');
  const templates = [
    { template: 'columns.tsx.template', output: 'columns.tsx' },
    { template: 'data-table.tsx.template', output: 'data-table.tsx' },
    { template: 'page.tsx.template', output: 'page.tsx' },
  ];

  const replacements = {
    ENTITY_NAME_PASCAL: entityNamePascal,
    ENTITY_NAME_CAMEL: entityNameCamel,
    ENTITY_NAME_TITLE: entityNameTitle,
    ENTITY_NAME_KEBAB: entityNameKebab,
  };

  try {
    console.log(`Creating directory: ${appDirRelative}/${entityNameKebab}\n`);

    for (const { template, output } of templates) {
      const templatePath = path.join(templatesDir, template);
      const outputPath = path.join(targetDir, output);

      if (!fileExists(templatePath)) {
        console.error(`Error: Template file "${template}" not found!`);
        process.exit(1);
      }

      console.log(`Creating ${output}...`);
      const content = processTemplate(templatePath, replacements);
      writeFile(outputPath, content);
    }

    console.log('\n✨ Table structure created successfully!\n');
    console.log(' Generated files:');
    console.log(`   ${appDirRelative}/${entityNameKebab}/`);
    console.log(`   ├── columns.tsx`);
    console.log(`   ├── data-table.tsx`);
    console.log(`   └── page.tsx\n`);

    console.log('Dependency notice: This table requires @tanstack/react-table');
    console.log('Please install it in your project using one of the following commands:');
    console.log('\n  npm install @tanstack/react-table');
    console.log('  pnpm add @tanstack/react-table');
    console.log('  yarn add @tanstack/react-table\n');

    console.log('Next steps:');
    console.log('   1. Update the type definition in columns.tsx with your data fields');
    console.log('   2. Add column definitions for your fields');
    console.log('   3. Implement the getData() function in page.tsx to fetch your data');
    console.log('   4. Customize the table as needed\n');
    console.log(`Access your table at: /${entityNameKebab}\n`);
  } catch (error) {
    console.error('Error creating table structure:', error.message);
    process.exit(1);
  }
}

module.exports = createTableCommand;