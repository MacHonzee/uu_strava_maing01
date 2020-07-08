"use strict";
const Package = require("uu_appg01_devkit/src/scripts/package.nodejs-app");
const ProjectConfig = require("uu_appg01_devkit-common/src/config/project-config.js");
const fs = require("fs");
const Path = require("path");
const unzipper = require("unzipper");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const client = new SecretManagerServiceClient();

const GCLOUD_FLD = "./target-gcloud";
const OSID_SECRET_PATH = "projects/1085775118786/secrets/osid_%s/versions/latest";

async function unzipFileToPath(sourceZip, targetPath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(sourceZip)
      .pipe(unzipper.Extract({ path: targetPath }))
      .on("close", resolve)
      .on("error", reject);
  });
}

async function getOsidSecret(osid) {
  const [version] = await client.accessSecretVersion({
    name: OSID_SECRET_PATH.replace("%s", osid)
  });

  return version.payload.data.toString();
}

function copyFile(sourceFile, targetFile) {
  let fileContent = fs.readFileSync(sourceFile);
  fs.writeFileSync(targetFile, fileContent);
}

async function main() {
  // HSD 1 call standard devkit task to pack the project, which creates zip
  let prjCfg = ProjectConfig.instance;
  prjCfg.setCommandLineConfig({});
  await new Package(prjCfg).process();
  let config = prjCfg.getAll();
  let buildName = `${config.name}-${config.version}.${prjCfg.getBuildTimestamp()}`;
  let targetGcloudFld = Path.join(".", GCLOUD_FLD, buildName);

  // HDS 2 unzip the build to target-gcloud temp fld
  await unzipFileToPath(`./target/${buildName}.zip`, Path.join(".", GCLOUD_FLD));

  // HDS 3 delete uu5-environment.json file
  fs.unlinkSync(Path.join(targetGcloudFld, "public", "uu5-environment.json"));

  // HDS 4 read "gcloud-development.json" to get necessary deployment info
  let gcloudJson = JSON.parse(fs.readFileSync("./env/gcloud-development.json"));

  // HDS 5 use SecretManager to get MongoDB connection string from Osid
  let mongoConnectionString = await getOsidSecret(gcloudJson.osid);

  // HDS 6 create "production.json" file in target-cloud/temp fld/env with necessary info
  let productionDevInfo = {
    port: 8080,
    uuSubAppDataStoreMap: {
      primary: mongoConnectionString
    },
    privilegedUserMap: {
      asidOwner: gcloudJson.asidOwner
    },
    asid: gcloudJson.asid,
    ...gcloudJson.uuConfigMap
  };
  let productionDevFile = Path.join(targetGcloudFld, "env", "production.json");
  fs.writeFileSync(productionDevFile, JSON.stringify(productionDevInfo, null, 2));

  // HDS 7 copy .gcloudignore and app.yaml to temp fld
  copyFile("./app.yaml", Path.join(targetGcloudFld, "app.yaml"));
  copyFile("./.gcloudignore", Path.join(targetGcloudFld, ".gcloudignore"));

  // HDS 8 call "gcloud app deploy --quiet --stop-previous-version"
  console.log("TODO call gcloud app deploy --quiet --stop-previous-version");
}

main();
