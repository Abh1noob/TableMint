const path = require("path");
const https = require("https");
const config = require("../config/components.json");
const {
  toPascalCase,
  toCamelCase,
  toTitleCase,
  toKebabCase,
  writeFile,
  directoryExists,
} = require("./fileHelpers");
const { installPackages } = require("./packageManager");

function fetchTemplate(templatePath, isLocal = false) {
  if (isLocal) {
    const fs = require("fs");
    return Promise.resolve(fs.readFileSync(templatePath, "utf8"));
  }

  return new Promise((resolve, reject) => {
    https
      .get(templatePath, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch template: ${res.statusCode}`));
          return;
        }

        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function processTemplate(content, replacements) {
  return content.replace(/{{(\w+)}}/g, (match, key) => {
    return replacements[key] || match;
  });
}

function findTargetDirectory(targetDirType) {
  if (targetDirType === "app") {
    let appDir = path.join(process.cwd(), "app");
    let appDirRelative = "app";

    if (!directoryExists(appDir)) {
      appDir = path.join(process.cwd(), "src", "app");
      appDirRelative = "src/app";

      if (!directoryExists(appDir)) {
        throw new Error(
          "Next.js app directory not found. Make sure you are in a Next.js project with App Router."
        );
      }
    }

    return { baseDir: appDir, baseDirRelative: appDirRelative };
  } else if (targetDirType === "components") {
    let componentsDir = path.join(process.cwd(), "components");
    let componentsDirRelative = "components";

    if (!directoryExists(componentsDir)) {
      componentsDir = path.join(process.cwd(), "src", "components");
      componentsDirRelative = "src/components";

      if (!directoryExists(componentsDir)) {
        throw new Error(
          'Components directory not found. Please create a "components" or "src/components" directory.'
        );
      }
    }

    return { baseDir: componentsDir, baseDirRelative: componentsDirRelative };
  } else {
    const customDir = path.join(process.cwd(), targetDirType);
    if (!directoryExists(customDir)) {
      throw new Error(`Target directory "${targetDirType}" not found.`);
    }
    return { baseDir: customDir, baseDirRelative: targetDirType };
  }
}

function generateReplacements(entityName) {
  return {
    ENTITY_NAME_PASCAL: toPascalCase(entityName),
    ENTITY_NAME_CAMEL: toCamelCase(entityName),
    ENTITY_NAME_TITLE: toTitleCase(entityName),
    ENTITY_NAME_KEBAB: toKebabCase(entityName),
  };
}

function getGlobalComponentsStatus() {
  try {
    const { baseDir } = findTargetDirectory("components");
    const targetDir = path.join(baseDir, "table");

    const requiredFiles = [
      "data-table.tsx",
      "data-table-toolbar.tsx",
      "data-table-column-header.tsx",
      "data-table-faceted-filter.tsx",
      "data-table-pagination.tsx",
      "data-table-view-options.tsx",
    ];

    const existingFiles = [];
    const missingFiles = [];

    if (!directoryExists(targetDir)) {
      return { existingFiles, missingFiles: requiredFiles, allExist: false };
    }

    const fs = require("fs");
    for (const fileName of requiredFiles) {
      const filePath = path.join(targetDir, fileName);
      if (fs.existsSync(filePath)) {
        existingFiles.push(fileName);
      } else {
        missingFiles.push(fileName);
      }
    }

    return {
      existingFiles,
      missingFiles,
      allExist: missingFiles.length === 0,
    };
  } catch (error) {
    return {
      existingFiles: [],
      missingFiles: [
        "data-table.tsx",
        "data-table-toolbar.tsx",
        "data-table-column-header.tsx",
        "data-table-faceted-filter.tsx",
        "data-table-pagination.tsx",
        "data-table-view-options.tsx",
      ],
      allExist: false,
    };
  }
}

function checkGlobalComponents() {
  return getGlobalComponentsStatus().allExist;
}

async function generateGlobalComponents() {
  const globalFiles = [
    "data-table.tsx",
    "data-table-toolbar.tsx",
    "data-table-column-header.tsx",
    "data-table-faceted-filter.tsx",
    "data-table-pagination.tsx",
    "data-table-view-options.tsx",
  ];

  const { baseDir } = findTargetDirectory("components");
  const targetDir = path.join(baseDir, "table");
  const fs = require("fs");
  const existingFiles = [];
  const missingFiles = [];

  for (const fileName of globalFiles) {
    const filePath = path.join(targetDir, fileName);
    if (fs.existsSync(filePath)) {
      existingFiles.push(fileName);
    } else {
      missingFiles.push(fileName);
    }
  }

  if (existingFiles.length > 0) {
    console.log(
      `Found existing global components: ${existingFiles.join(", ")}`
    );
  }

  if (missingFiles.length === 0) {
    console.log("All global table components already exist!");
    return;
  }

  console.log(
    `Installing ${missingFiles.length} missing global table components...`
  );

  for (const fileName of missingFiles) {
    console.log(`Installing ${fileName}...`);

    try {
      let templateContent;

      if (config.baseUrl === "local") {
        const templatePath = path.join(
          __dirname,
          "../templates/table/global",
          fileName
        );
        templateContent = await fetchTemplate(templatePath, true);
      } else {
        const templateUrl = `${config.baseUrl}/table/global/${fileName}`;
        templateContent = await fetchTemplate(templateUrl, false);
      }

      writeFile(path.join(targetDir, fileName), templateContent);
    } catch (error) {
      throw new Error(
        `Failed to install global component "${fileName}": ${error.message}`
      );
    }
  }

  console.log("Global table components installed successfully!");
}
async function generateComponent(componentType, entityName) {
  if (!entityName || entityName.trim() === "") {
    throw new Error("Entity name is required!");
  }

  const componentConfig = config.components[componentType];
  if (!componentConfig) {
    throw new Error(`Component type "${componentType}" not found!`);
  }

  // Check if global components exist
  if (!checkGlobalComponents()) {
    throw new Error(
      'Global table components not found. Please run "tablemint init" first to install global components.'
    );
  }

  const { baseDir, baseDirRelative } = findTargetDirectory(
    componentConfig.targetDir
  );
  const entityNameKebab = toKebabCase(entityName);
  const targetDir = path.join(baseDir, entityNameKebab);

  if (directoryExists(targetDir)) {
    throw new Error(
      `Directory "${baseDirRelative}/${entityNameKebab}" already exists!`
    );
  }

  const replacements = generateReplacements(entityName);
  const results = {
    targetDir: `${baseDirRelative}/${entityNameKebab}`,
    files: [],
    dependencies: componentConfig.dependencies || [],
    instructions: componentConfig.instructions || [],
  };

  console.log(
    `Creating ${componentConfig.description.toLowerCase()} for "${entityName}"...\n`
  );
  console.log(`Creating directory: ${baseDirRelative}/${entityNameKebab}\n`);

  const entityFiles = ["columns.tsx", "page.tsx", "table-config.ts"];

  for (const fileName of entityFiles) {
    console.log(`Fetching ${fileName}...`);

    try {
      let templateContent;

      if (config.baseUrl === "local") {
        const templatePath = path.join(
          __dirname,
          "../templates/table/entity",
          fileName
        );
        templateContent = await fetchTemplate(templatePath, true);
      } else {
        const templateUrl = `${config.baseUrl}/table/entity/${fileName}`;
        templateContent = await fetchTemplate(templateUrl, false);
      }

      console.log(`Creating ${fileName}...`);

      const processedContent = processTemplate(templateContent, replacements);
      writeFile(path.join(targetDir, fileName), processedContent);

      results.files.push(fileName);
    } catch (error) {
      throw new Error(
        `Failed to fetch template "${fileName}": ${error.message}`
      );
    }
  }

  if (results.dependencies.length > 0) {
    const installResult = await installPackages(results.dependencies);
    results.installResult = installResult;
  }

  return results;
}

module.exports = {
  generateComponent,
  generateGlobalComponents,
  checkGlobalComponents,
  getGlobalComponentsStatus,
  getAvailableComponents: () => Object.keys(config.components),
  getComponentConfig: (type) => config.components[type],
};
