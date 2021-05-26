const { TestHelper } = require("uu_appg01_workspace-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the init uuCmd...", () => {
  test("HDS", async () => {
    await TestHelper.login("AwidLicenseOwner");

    let dtoIn = {
      authoritiesUri: "urn:uu:GGALL",
    };
    let result = await TestHelper.executePostCommand("init", dtoIn);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});
