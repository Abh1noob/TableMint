const runCommand = require("../utils/runCommand");
const path = require("path");
const { fileExists } = require("../utils/fileHelpers");
const {
  generateGlobalComponents,
  checkGlobalComponents,
  getGlobalComponentsStatus,
} = require("../utils/componentGenerator");

function checkShadcnComponent(componentName) {
  const possiblePaths = [
    path.join(process.cwd(), "components", "ui", `${componentName}.tsx`),
    path.join(process.cwd(), "src", "components", "ui", `${componentName}.tsx`),
  ];

  return possiblePaths.some((filePath) => fileExists(filePath));
}

async function initCommand() {
  console.log("Starting TableMint initialization...\n");

  const shadcnConfigExists = fileExists(
    path.join(process.cwd(), "components.json")
  );

  if (!shadcnConfigExists) {
    console.log("Running shadcn/ui initialization...");
    console.log("Please follow the prompts to configure shadcn/ui:\n");

    try {
      await runCommand("npx", ["shadcn@latest", "init"]);
      console.log("\nshadcn/ui initialized successfully!\n");
    } catch (error) {
      console.error("Error during shadcn/ui initialization:", error.message);
      process.exit(1);
    }
  } else {
    console.log("shadcn/ui already initialized, skipping...\n");
  }

  console.log("Checking required shadcn/ui components...\n");

  const components = [
    "badge",
    "button",
    "checkbox",
    "command",
    "dropdown-menu",
    "input",
    "pagination",
    "popover",
    "select",
    "separator",
    "table",
  ];

  const missingComponents = [];
  const existingComponents = [];

  for (const component of components) {
    if (checkShadcnComponent(component)) {
      existingComponents.push(component);
    } else {
      missingComponents.push(component);
    }
  }

  if (existingComponents.length > 0) {
    console.log("Found existing components:", existingComponents.join(", "));
  }

  if (missingComponents.length > 0) {
    console.log(
      `\nInstalling ${missingComponents.length} missing components...\n`
    );

    try {
      for (const component of missingComponents) {
        console.log(`Installing ${component}...`);
        await runCommand("npx", ["shadcn@latest", "add", component, "-y"]);
      }
    } catch (error) {
      console.error("Error installing shadcn components:", error.message);
      process.exit(1);
    }
  } else {
    console.log("All required shadcn/ui components are already installed!\n");
  }

  // Check global table components status
  console.log("Checking global table components...\n");
  const globalStatus = getGlobalComponentsStatus();

  if (globalStatus.existingFiles.length > 0) {
    console.log(
      `Found existing global components: ${globalStatus.existingFiles.join(
        ", "
      )}`
    );
  }

  if (globalStatus.allExist) {
    console.log(
      "All global table components already exist, skipping installation...\n"
    );
  } else {
    console.log(
      `Installing ${globalStatus.missingFiles.length} missing global table components...\n`
    );
    try {
      await generateGlobalComponents();
    } catch (error) {
      console.error("Error installing global table components:", error.message);
      process.exit(1);
    }
  }

  console.log("TableMint initialization completed successfully!\n");
  console.log(
    "You can now create tables using: tablemint create table <entityname>"
  );
}

module.exports = initCommand;
