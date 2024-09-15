<<<<<<< HEAD
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleFileExtensions: ["js", "json", "ts"],
  modulePaths: ["."],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["src/server/**/*.(t|j)s"],
  coveragePathIgnorePatterns: ["src/server/console", "src/server/migration"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
};

export default config;
=======
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleFileExtensions: ["js", "json", "ts"],
  modulePaths: ["."],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["src/server/**/*.(t|j)s"],
  coveragePathIgnorePatterns: ["src/server/console", "src/server/migration"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
};

export default config;
>>>>>>> a79eb53a78d8df92a45067b66b6d3f4ae2ab1a5d
