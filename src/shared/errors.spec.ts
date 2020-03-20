import { createNewError } from "./errors";

describe("createNewError", () => {
  it("should return an object instance of Error", () => {
    expect(createNewError("dummy") instanceof Error).toBe(true);
  });

  it("should set a error message to constructor's string", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { name } = require("../../package.json");
    const errorMessage = "dummy";

    expect(createNewError(errorMessage).message).toBe(`[${name}] ${errorMessage}`);
  });
});
