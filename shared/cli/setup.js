/**
 * Script to set up symlinks and install dependencies for the monorepo or specific projects.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { __rootdir, colors, hasSymlinkPermissions, getProjectDir, setupProjectSymlinks } from './project-utils.js';

/**
 * Displays help information for the setup script
 */
function showHelp() {
  console.log(colors.bold('Usage:'));
  console.log('  setup [options] [projectName1] [projectName2] ...');
  console.log('');
  console.log(colors.bold('Options:'));
  console.log('  --help, -h          Show this help message');
  console.log('');
  console.log(colors.bold('Description:'));
  console.log('  Sets up symlinks and installs dependencies for the monorepo or specific projects.');
  console.log('');
  console.log('  Without arguments:  Sets up all projects in the monorepo and installs');
  console.log('                      dependencies for the entire monorepo (npm install at root)');
  console.log('');
  console.log('  With arguments:     Sets up specified projects and installs dependencies');
  console.log('                      for each project individually');
  console.log('');
  console.log(colors.bold('Examples:'));
  console.log('  setup                           # Setup all projects and install root dependencies');
  console.log('  setup app                       # Setup "app" project and install its dependencies');
  console.log('  setup project1 project2         # Setup multiple projects individually');
  console.log('');
}

/**
 * Installs dependencies for the monorepo or a specific project.
 * @param {string} [projectName=''] - The name of the project to install dependencies for. If empty, installs for the entire monorepo.
 * @throws {Error} If installation fails
 */
function installDependencies(projectName = '') {
  // Determine the directory for npm install
  const cwd = projectName ? getProjectDir(projectName) : __rootdir;

  console.log(`Installing dependencies${projectName ? ` for ${projectName}` : ' for the entire monorepo'}...`);
  execSync('npm install', { cwd, stdio: 'inherit' });
  console.log('Successfully installed dependencies');
}

/**
 * Main script logic to set up symlinks and install dependencies.
 * Sets up all projects in the monorepo if no arguments are provided, or specific projects if arguments are given.
 * @returns {Promise<void>}
 */
async function main() {
  // Get command-line arguments (skip first two: node and script path)
  const args = process.argv.slice(2);

  // Handle help flag
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  // Ensure the script has permissions to create symlinks on Windows
  if (!hasSymlinkPermissions()) {
    throw new Error('Administrative privileges required on Windows for symlinks.');
  }

  // Check if root directory exists and is a directory
  if (!fs.existsSync(__rootdir) || !fs.statSync(__rootdir).isDirectory()) {
    throw new Error(`Root directory not found: ${__rootdir}`);
  }

  // Check if package.json exists in root directory
  const rootPackagePath = path.join(__rootdir, 'package.json');
  if (!fs.existsSync(rootPackagePath)) {
    throw new Error(`Missing package.json in root directory: ${__rootdir}`);
  }
  if (args.length === 0) {
    // No arguments: set up all projects in the monorepo
    const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
    const workspaces = rootPackage.workspaces || [];

    // Iterate through workspaces and set up each project
    for (const workspace of workspaces) {
      setupProjectSymlinks(workspace);
    }

    // Install dependencies for the entire monorepo
    installDependencies();
  } else {
    // Arguments provided: set up specified projects
    const projectNames = new Set(args);

    for (const projectName of projectNames) {
      // Get project directory and verify it exists
      const projectDir = getProjectDir(projectName);
      if (!fs.existsSync(projectDir) || !fs.statSync(projectDir).isDirectory()) {
        throw new Error(`Project directory not found: ${projectDir}`);
      }

      // Set up symlinks for the project
      setupProjectSymlinks(projectName);

      // Install dependencies for the project
      installDependencies(projectName);
    }
  }
}

// Execute the main function and handle errors
main().catch(err => {
  console.error(colors.red(err.message));
  console.error(colors.gray(err.stack));
  process.exit(1);
});