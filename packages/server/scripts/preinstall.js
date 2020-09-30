const fs = require("fs");

console.log("Running preinstall script for server...");

const envPath = "./.env";
const envTemplatePath = "./template.env";

if (!fs.existsSync(envPath)) {
  let tempFile = fs.readFileSync(envTemplatePath, "utf8");
  const re = /(\$[A-Z_]*)/g;
  let matcher;

  do {
    matcher = re.exec(tempFile);
    if (matcher) {
      let envVarName = matcher[0].substr(1);
      let envVar = process.env[envVarName] || "";

      if (envVar === "") {
        console.log(`Variable ${envVarName} is not defined!`);
      }

      tempFile = tempFile.replace(matcher[0], envVar);
    }
  } while (matcher);

  fs.writeFileSync(envPath, tempFile);
}

console.log("Preinstall script done!");
