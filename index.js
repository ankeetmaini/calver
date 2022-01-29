const core = require('@actions/core');
const fs = require('fs');

try {
    const filePath = core.getInput('path');
    const platform = core.getInput('platform');
    console.log({filePath, platform});
    console.log('file contents below')
    console.log(fs.readFileSync(filePath))
    
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }