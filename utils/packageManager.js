const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function detectPackageManager() {
  const cwd = process.cwd();

  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }

  if (fs.existsSync(path.join(cwd, "bun.lockb"))) {
    return "bun";
  }

  if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
    return "npm";
  }

  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(cwd, "package.json"), "utf8")
    );
    if (packageJson.packageManager) {
      if (packageJson.packageManager.startsWith("pnpm")) return "pnpm";
      if (packageJson.packageManager.startsWith("yarn")) return "yarn";
      if (packageJson.packageManager.startsWith("bun")) return "bun";
    }
  } catch (error) {}

  const availableManagers = [];

  try {
    execSync("pnpm --version", { stdio: "ignore" });
    availableManagers.push("pnpm");
  } catch {}

  try {
    execSync("yarn --version", { stdio: "ignore" });
    availableManagers.push("yarn");
  } catch {}

  try {
    execSync("bun --version", { stdio: "ignore" });
    availableManagers.push("bun");
  } catch {}

  if (availableManagers.includes("pnpm")) return "pnpm";
  if (availableManagers.includes("yarn")) return "yarn";
  if (availableManagers.includes("bun")) return "bun";

  return "npm";
}

function getInstallCommand(packageManager, packages) {
  const commands = {
    npm: `npm install ${packages.join(" ")}`,
    yarn: `yarn add ${packages.join(" ")}`,
    pnpm: `pnpm add ${packages.join(" ")}`,
    bun: `bun add ${packages.join(" ")}`,
  };

  return commands[packageManager];
}

async function installPackages(packages) {
  if (!packages || packages.length === 0) {
    return { success: true, message: "No packages to install" };
  }

  const packageManager = detectPackageManager();
  const command = getInstallCommand(packageManager, packages);

  console.log(`\nInstalling dependencies with ${packageManager}...`);
  console.log(`Running: ${command}\n`);

  try {
    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    return {
      success: true,
      message: `Successfully installed ${packages.join(
        ", "
      )} using ${packageManager}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to install packages using ${packageManager}`,
      fallbackInstructions: [
        `Please install manually using one of these commands:`,
        `  npm install ${packages.join(" ")}`,
        `  yarn add ${packages.join(" ")}`,
        `  pnpm add ${packages.join(" ")}`,
        `  bun add ${packages.join(" ")}`,
      ],
    };
  }
}

module.exports = {
  detectPackageManager,
  getInstallCommand,
  installPackages,
};
