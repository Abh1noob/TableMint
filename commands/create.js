const { generateComponent } = require("../utils/componentGenerator");
const { toKebabCase } = require("../utils/fileHelpers");

async function createTableCommand(entityName) {
  try {
    const result = await generateComponent("table", entityName);

    console.log("\nTable structure created successfully!\n");
    console.log(" Generated files:");
    console.log(`   ${result.targetDir}/`);

    result.files.forEach((file, index) => {
      const isLast = index === result.files.length - 1;
      const prefix = isLast ? "   └──" : "   ├──";
      console.log(`${prefix} ${file}`);
    });


    if (result.dependencies.length > 0) {
      if (result.installResult) {
        if (result.installResult.success) {
          console.log(`\n${result.installResult.message}\n`);
        } else {
          console.log(`\n${result.installResult.message}`);
          if (result.installResult.fallbackInstructions) {
            result.installResult.fallbackInstructions.forEach(instruction => {
              console.log(instruction);
            });
          }
          console.log();
        }
      }
    }

    if (result.instructions.length > 0) {
      console.log("Next steps:");
      result.instructions.forEach((instruction, index) => {
        console.log(`   ${index + 1}. ${instruction}`);
      });
      console.log();
    }

    console.log(`Access your table at: /${toKebabCase(entityName)}\n`);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.message.includes("Entity name is required")) {
      console.log("Usage: tablemint create table <entityname>");
    } else if (error.message.includes("internet connection")) {
      console.log(
        "Make sure you have an internet connection and the template exists on GitHub."
      );
    }
    process.exit(1);
  }
}

module.exports = createTableCommand;
