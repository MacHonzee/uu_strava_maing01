"use strict";
const Package = require("uu_appg01_devkit/src/scripts/package.nodejs-app");
const ProjectConfig = require("uu_appg01_devkit-common/src/config/project-config.js");
const { execSync } = require("child_process");
const fs = require("fs");

const APP_JSON_PATH = "../uuapp.json";

function getCurrentBranch() {
  return execSync("git branch --show-current", { cwd: ".." }).toString().trim();
}

async function main() {
  // check if you are on sprint branch - else raise error
  if (getCurrentBranch() !== "sprint") {
    throw "You have to be on a sprint branch to create new version."
  }

  // read app.json
  let appJson = JSON.parse(fs.readFileSync(APP_JSON_PATH));

  // read input version
  let newVersion = process.argv.slice(2)[0];

  // if no input version, bump hotfix version
  if (!newVersion) {
    let currentVersionSplits = appJson.version.split(".");
    // if this does not work correctly, we will use versionomy
    currentVersionSplits[2] = (parseInt(currentVersionSplits[2]) + 1).toString();
    newVersion = currentVersionSplits.join(".");
  }
  appJson.version = newVersion;
  console.log("Preparing version " + newVersion);

  // save uuapp.json with new version
  fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJson, null, 2));

  // pack project to have version everywhere
  let prjCfg = ProjectConfig.instance;
  prjCfg.setCommandLineConfig({});
  await new Package(prjCfg).process();

  // git add, git commit, git push, git checkout master, git merge sprint, git tag version/newVersion
  execSync(`
    git add . &&
    git commit -m Version build ${newVersion} &&
    git checkout master &&
    git rebase sprint &&
    git tag -a version/${newVersion} -m Version build ${newVersion} &&
    git push origin --tags`,
    { cwd: "..", stdio: "inherit" });

  console.log(`Version ${newVersion} succesfully prepared.`)
}

main().catch(e => {
  console.error(e)
});
