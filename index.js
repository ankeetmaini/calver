const core = require("@actions/core");
const fs = require("fs");
const exec = require("@actions/exec");

const versionCodeRegex = new RegExp(/versionCode\s*=\s*(\d*)/);
const versionNameRegex = new RegExp(/versionName\s*=\s*"([0-9|.|a-z]*)"/);
const calverRegex = new RegExp(/\d{2}.\d{2}.\d{2}.((\d).*)(-[a-z].*)?/);
const packageVersion = new RegExp(/"version"\s*:\s*"([^\s]*)"/);

const pad = (n) => {
  n = n + "";
  if (n.length === 2) return n;
  if (n.length === 1) return "0" + n;
};

async function execCommand(command, options = {}) {
  const projectPath = core.getInput('project-path')
  options.cwd = projectPath
  return exec.exec(command, [], options)
}


const isCalver = (version) => {
  const date = new Date();
  const newVersion = `${date.getFullYear() % 100}.${pad(
    date.getMonth() + 1
  )}.${pad(date.getDate())}`;

  let fullVersion;

  const result = calverRegex.exec(version);
  if (!result) return newVersion + ".0";

  const prev = result[0];

  if (prev.slice(0, 8) === newVersion) {
    fullVersion = `${newVersion}.${Number(result[1]) + 1}`;
  } else {
    fullVersion = `${newVersion}.0`;
  }
  return fullVersion;
};

// most @actions toolkit packages have async methods
async function run() {
  try {
     const filePath = core.getInput("path");
    const platform = core.getInput("platform");

    if (!filePath && !platform) return;

    const fileContents = fs.readFileSync(filePath).toString();

    if (platform === "android") {
      // eslint-disable-next-line no-unused-vars
      const [_, versionCode] = versionCodeRegex.exec(fileContents);
      const newVersion = Number(versionCode) + 1;
      // eslint-disable-next-line no-unused-vars
      const [__, versionName] = versionNameRegex.exec(fileContents);

      const fullVersion = isCalver(versionName);

      const versionUpdated = fileContents.replace(
        versionCodeRegex,
        (main, old) => main.replace(old, newVersion)
      );

      const versionNameUpdated = versionUpdated.replace(
        versionNameRegex,
        (main, old) => main.replace(old, fullVersion)
      );
      fs.writeFileSync(filePath, versionNameUpdated);
    } else if (platform === "web") {
      const packageJson = JSON.parse(fileContents);
      const fullVersion = isCalver(packageJson.version);

      const newContent = fileContents.replace(packageVersion, (main, old) =>
        main.replace(old, fullVersion)
      );

      fs.writeFileSync(filePath, newContent);
    } else if (platform === "ios") {
      const buildVersion = `xcrun agvtool what-version`
      console.log(buildVersion)
        await execCommand(buildVersion).catch(error => {
            core.setFailed(error.message)
        })
      const marketingVersion = `agvtool what-marketing-version -terse1`
      console.log(marketingVersion)
        await execCommand(marketingVersion).catch(error => {
            core.setFailed(error.message)
        })
      const fullVersion = isCalver(marketingVersion);
      console.log(fullVersion)
      var parsedVersion = fullVersion;
      const [major,minor,patch]  = parsedVersion.split('.');
      console.log(major);
      console.log(minor);
      console.log(patch);
      var combinedVersion = major + '.' + minor + '.' + patch;
      console.log(combinedVersion);
      const updatedVersion = `agvtool next-version -all`
      await execCommand(updatedVersion).catch(error => {
        core.setFailed(error.message)
    })
      console.log(updatedVersion)
      const newMarketingVersion = `xcrun agvtool new-marketing-version ${combinedVersion}`
      console.log(newMarketingVersion); 
      await execCommand(newMarketingVersion).catch(error => {
        core.setFailed(error.message)
      })
    }
    else {
      core.setFailed("Only `android` and `web` supported right now.");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

module.exports = run;
