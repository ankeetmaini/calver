const core = require("@actions/core");
const fs = require("fs");
const child_process = require("child_process");

const versionCodeRegex = new RegExp(/versionCode\s*=\s*(\d*)/);
const versionNameRegex = new RegExp(/versionName\s*=\s*"([0-9|.|a-z]*)"/);
const calverRegex = new RegExp(/\d{2}.\d{2}.\d{2}.((\d).*)(-[a-z].*)?/);
const packageVersion = new RegExp(/"version"\s*:\s*"([^\s]*)"/);

const pad = (n) => {
  n = n + "";
  if (n.length === 2) return n;
  if (n.length === 1) return "0" + n;
};

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
    } else {
      core.setFailed("Only `android` and `web` supported right now.");
    }
    child_process.execSync(`git config --global user.name "Github Actions"`);
    child_process.execSync(
      `git config --global user.email "actions@users.noreply.github.com"`
    );
    child_process.execSync(`git add ${filePath}`);
    child_process.execSync(`git commit -m 'Bump version'`);
    child_process.execSync(`git push`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

module.exports = run;
