import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";
import { server } from "./mocks/server";

expect.extend(matchers);

// Establish API mocking before all tests
beforeAll(() => {
	server.listen();
	vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
