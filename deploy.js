const fs = require('fs-extra');
const path = require('path');
const process = require('process');
const dayjs = require('dayjs');
const { repo } = require('./config');
const { exec } = require('./utils');

void async function () {
    let deployPath = path.join(__dirname, '.deploy_git');
    console.log('clean .deploy_git folder');
    await fs.emptyDir(deployPath);
    await fs.copy(path.join(__dirname, 'public'), deployPath);
    try{
        await exec(`git clone ${repo} repo`);
        await fs.copy(path.join(__dirname, 'repo/.git/'), path.join(deployPath, '.git'));
        process.chdir(deployPath);
        await exec('git add .');
        await exec(`git commit -m "updated: ${dayjs().format('YYYY-MM-DD dddd HH:mm:ss')}"`);
        await exec('git push -u origin master');
        await fs.remove(path.join(__dirname, 'repo'));
        console.log('发布成功!');
    }catch(e){console.log(e)}
}()