/* eslint-disable prettier/prettier */
const fs = require("fs").promises;
const { resolve } = require('path');


const Versions = {
	uuAppg01Server: "^5.0.0",
	uuAppg01Devkit: "^3.0.0",
	uuAppg01ServerTest: "^5.0.0",
	"uu_appg01_binarystore-cmd": "^3.0.0"
}
const FilePaths = {
	profilesJson: "app/config/profiles.json",
	packageLockJson: "package-lock.json",
	nodeModules: "node_modules",
	packageJson: "package.json",
	developmentJson: "env/development.json",
	testJson: "env/test.json",
	mappingsJson: "app/config/mappings.json",
}
const NewAuhtNames = {
	AsidOwner: "AsidLicenseOwner",
	AwidOwner: "AwidLicenseOwner"
}

const ReplaceInAbl = {
	"WorkspaceError": "UuAppWorkspaceError",
	"SysAppClientTokenModel": "AppClientTokenService",
	"SysAppWorkspaceModel": "UuAppWorkspace",
	"SysAppWorkspaceErrors": "UuAppWorkspaceError"
}

const ReplaceInTest = {
	".initApp()": {
		value: ".initUuSubAppInstance()",
		regex: /\.initApp\(\)/g
	},
	".initAppWorkspace()": {
		value: ".createUuAppWorkspace()",
		regex: /\.initAppWorkspace\(\)/g
	},
	'.login("AwidOwner")': {
		regex: /\.login\("AwidOwner"\)/g,
		value: '.login("AwidLicenseOwner")'
	}
}



async function* _getFiles(dir) {
	const dirents = await fs.readdir(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const res = resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			yield* _getFiles(res);
		} else {
			yield res;
		}
	}
}

async function readFile(path) {
	let fileData;
	try {
		fileData = await fs.readFile(path, 'utf8');
	} catch (e) {
		console.error(`File ${path} cant open, ${e}`);
	}
	return fileData;
}


async function writeFile(path, data, asJson = false, profiles = false) {

	if (asJson) {
		data = JSON.stringify(data, null, 2);
	}

	if (profiles) {
		data = JSON.stringify(data, null, null);
	}

	try {
		await fs.writeFile(path, data, "utf-8");
	} catch (error) {
		console.error(`Got an error trying to write to a file: ${error.message}`);
	}
}

async function removeFile(path) {
	fs.unlink(path, (err) => {
		if (err) {
			console.error(err)
			return
		}
		console.log(`${path} is deleted!`);
	})
}

async function removeDirectory(dir) {
	fs.rmdir(dir, { recursive: true }, (err) => {
		if (err) {
			console.error(err)
			return
		}
		console.log(`${dir} is deleted!`);
	});
}


function _changeProfileListContent(profileList) {
	return profileList && Array.isArray(profileList) && profileList.map(item => {
		item = item in NewAuhtNames ? NewAuhtNames[item] : item;
		return item
	})
}

function _changeUseCaseMap(useCaseMap, useCaseType) {
	let newUseCaseMap = {
		"profileList": _changeProfileListContent(useCaseMap)
	}
	switch (useCaseType) {
		case "asid":
			newUseCaseMap["sysStateList"] = ["active", "restricted"];
			break;
		case "privilegedUseCaseMap":
			newUseCaseMap["sysStateList"] = ["restricted"];
			break;
		default:
			newUseCaseMap["sysStateList"] = ["active"];
			break;
	}
	return newUseCaseMap;
}

function _updateUseCaseMap(useCaseMap, useCaseType) {
	console.log(useCaseMap);
	for (oneUseCase in useCaseMap) {
		useCaseMap[oneUseCase] = _changeUseCaseMap(useCaseMap[oneUseCase], useCaseType)
	}
	return useCaseMap;
}



async function migrateProfileJson() {
	const file = FilePaths.profilesJson;
	let fileData = JSON.parse(await readFile(file));
	// change asid
	delete fileData["{asid}"].permissionMap
	fileData["{asid}"].profileList = _changeProfileListContent(fileData["{asid}"].profileList);
	fileData["{asid}"].useCaseMap = _updateUseCaseMap(fileData["{asid}"].useCaseMap, "asid");
	// change rest
	fileData["*"].profileList = _changeProfileListContent(fileData["*"].profileList);
	fileData["*"].useCaseMap = _updateUseCaseMap(fileData["*"].useCaseMap);

	if ("privilegedUseCaseMap" in fileData["*"]) {
		let updatedUseCase = _updateUseCaseMap(fileData["*"].privilegedUseCaseMap, "privilegedUseCaseMap")
		delete fileData["*"].privilegedUseCaseMap;

		fileData["*"].useCaseMap = {
			...fileData["*"].useCaseMap,
			...updatedUseCase
		}
	}

	await writeFile(file, fileData, false, true);
}

async function updateDependencies() {
	const file = FilePaths.packageJson;
	// remove node modules
	// removeDirectory(FilePaths.nodeModules);
	// removeFile(FilePaths.packageLockJson);
	let packageJson = JSON.parse(await readFile(file));

	packageJson.dependencies.uu_appg01_server = Versions.uuAppg01Server
	packageJson.dependencies["uu_appg01_binarystore-cmd"] = Versions["uu_appg01_binarystore-cmd"];
	delete packageJson.dependencies.uu_appg01_binarystore;
	packageJson.devDependencies.uu_appg01_devkit = Versions.uuAppg01Devkit
	packageJson.devDependencies["uu_appg01_server-test"] = Versions.uuAppg01ServerTest
	await writeFile(file, packageJson, true);
}

async function updateDeploymentConfig() {
	let developmentJson = JSON.parse(await readFile(FilePaths.developmentJson));
	await writeFile(FilePaths.developmentJson, updateJson(developmentJson), true);

	let testJson = JSON.parse(await readFile(FilePaths.testJson));
  testJson.sysUuAppWorkspace = testJson.sysUuAppWorkspace || {};
	testJson.sysUuAppWorkspace.awidLicense = "xs";
	testJson.sysUuAppWorkspace.awidLicenseOwnerList = [
		testJson.sysAppWorkspace.awidOwner
	];
	testJson.sysUuAppWorkspace.awid = testJson.sysAppWorkspace.awid;
	delete testJson.sysAppWorkspace;


	for (let key in testJson.userMap) {
		for (auth in NewAuhtNames) {
			if (key === auth) {
				testJson.userMap[NewAuhtNames[auth]] = testJson.userMap[key];
				testJson.userMap[NewAuhtNames[auth]].profileList = [NewAuhtNames[auth]];
				delete testJson.userMap[key]
			}
		}

	}
	await writeFile(FilePaths.testJson, updateJson(testJson), true);

	function updateJson(json) {
		if (json.privilegedUserMap && json.privilegedUserMap.asidOwner) {
			json.asid_license_owner_list = [json.privilegedUserMap.asidOwner];
		}
		delete json.privilegedUserMap
		return json;
	}
}

async function updateInit() {

	let init = null;
	const { profilesJson, mappingsJson } = FilePaths;
	let profilesData = JSON.parse(await readFile(profilesJson));
	for (useCase in profilesData["*"].useCaseMap) {
		if ("init" === useCase.split("/")[1]) {
			init = useCase;
			profilesData["*"].useCaseMap["sys/uuAppWorkspace/init"] = profilesData["*"].useCaseMap[useCase];
			profilesData["*"].useCaseMap["sys/uuAppWorkspace/init"].sysStateList = ["created"];
			delete profilesData["*"].useCaseMap[useCase];
		}
	}
	await writeFile(profilesJson, profilesData, false, true);

	let mappings = JSON.parse(await readFile(mappingsJson));
	for (useCase in mappings["{vendor}-{uuApp}-{uuSubApp}"]["useCaseMap"]) {
		if ("init" === useCase.split("/")[1]) {
			mappings["{vendor}-{uuApp}-{uuSubApp}"]["useCaseMap"]["sys/uuAppWorkspace/init"] = mappings["{vendor}-{uuApp}-{uuSubApp}"]["useCaseMap"][useCase];
			delete mappings["{vendor}-{uuApp}-{uuSubApp}"]["useCaseMap"][useCase];
		}
	}
	await writeFile(mappingsJson, mappings, true);
	return init;
}


async function replaceInAbl() {

	for await (const f of _getFiles('app/abl')) {
		let file = await readFile(f);
		for (const key in ReplaceInAbl) {
			if (file.includes(key)) {
				let regex = new RegExp(key, 'g')
				file = file.replace(regex, ReplaceInAbl[key]);
			}
		}
		await writeFile(f, file);
	}
}

async function updateTests(init = null) {
	if (init) {
		ReplaceInTest[init] = "sys/uuAppWorkspace/init";
	}

	for await (const f of _getFiles('test')) {
		let file = await readFile(f);
		for (const key in ReplaceInTest) {
			if (file.includes(key)) {
				file = file.replace(ReplaceInTest[key].regex, ReplaceInTest[key].value);
			}
		}
		await writeFile(f, file);

	}
}

async function migrate() {
	await migrateProfileJson();
	// await updateDependencies();
	// await updateDeploymentConfig();
	// let init = await updateInit();
	// await replaceInAbl();
	// await updateTests(init);
}



migrate()
