import { execSync } from "child_process";

const folder = process.argv[2] || "./tests/**/*.test.js";

execSync(`mocha ${folder} --require @babel/register --timeout 10000`, { stdio: "inherit" });
