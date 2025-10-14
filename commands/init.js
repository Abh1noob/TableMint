const runCommand = require("../utils/runCommand");

const { generateGlobalComponents } = require('../utils/componentGenerator');

async function initCommand() {
  console.log("Starting TableMint initialization...\n");
  console.log("Running shadcn/ui initialization...");
  console.log("Please follow the prompts to configure shadcn/ui:\n");

  try {
    await runCommand("npx", ["shadcn@latest", "init"]);

    console.log("\nshadcn/ui initialized successfully!\n");
    console.log("Installing required shadcn/ui components...\n");

    const components = [
      "label",
      "avatar",
      "badge",
      "button",
      "checkbox",
      "command",
      "dialog",
      "dropdown-menu",
      "input",
      "pagination",
      "popover",
      "select",
      "separator",
      "table",
    ];

    for (const component of components) {
      console.log(`Installing ${component}...`);
      await runCommand("npx", ["shadcn@latest", "add", component, "-y"]);
    }

    console.log("\nInstalling global table components...\n");
    await generateGlobalComponents();

    console.log("\nAll components installed successfully!\n");
    console.log("You can now create tables using: tablemint create table <entityname>");
  } catch (error) {
    console.error("Error during initialization:", error.message);
    process.exit(1);
  }
}

module.exports = initCommand;