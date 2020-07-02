"use strict";
const Package = require("uu_appg01_devkit/src/scripts/package.nodejs-app");
const ProjectConfig = require("uu_appg01_devkit-common/src/config/project-config.js");
const fs = require("fs");

async function main() {
  // HSD 1 call standard devkit task to pack the project, which creates zip
  let prjCfg = ProjectConfig.instance;
  prjCfg.setCommandLineConfig({});
  await new Package(prjCfg).process();
  let config = prjCfg.getAll();
  let buildName = `${config.name}-${config.version}.${prjCfg.getBuildTimestamp()}`;

  // TODO remove or use later
  let exists = fs.existsSync(`./target/${buildName}.zip`);
  console.log(exists);

  // HDS 2 create temp folder in target-gcloud

  // HDS 3 unzip the build to target-gcloud temp fld

  // HDS 4 delete uu5-environment.json file

  // HDS 5 read "gcloud-development.json" to get necessary deployment info

  // HDS 6 use SecretManager to get MongoDB connection string from Osid

  // HDS 7 create "production.json" file in target-cloud/temp fld/env with necessary info

  // HDS 8 TODO study doc
  // either call gcloud app deploy with link to app.yaml and to .gcloudignore and to temp folder,
  // or copy them to target folder too and call it there
}

main();
