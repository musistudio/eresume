const fs = require('fs-extra');
const path = require('path');
const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const config = require('./config');

const { isFile, readFile, Protect } = require('./utils');


async function injectConfig(cfg) {
    let js = `const user = ${JSON.stringify(cfg)};`
    try{
        await fs.outputFile(path.join(__dirname, './public/js/config.js'), js);
        console.log('用户配置注入成功!');
    }catch(e) {
        console.log('用户配置注入失败!');
    }
}


async function getTemplate(name) {
    name = name + '.html';
    let tempPath = path.join(__dirname, './template', name);
    if (await isFile(tempPath)) {
        const html = await readFile(tempPath);
        return html;
    }
}


void async function () {
    // 1. 清空public目录
    console.log('clear public folder');
    let publicPath = path.join(__dirname, './public');
    await fs.emptyDir(publicPath);

    // 2. 处理用户config
    let { file, key, user, template } = config;
    let protect = new Protect(key);
    for (let u in user) {
        if (typeof user[u] == 'object' && !(user[u] instanceof Array) && user[u].protect) {
            user[u] = `protect.decode('${protect.encode(user[u]['value'])}')`;
        }
    }
    let today = dayjs().format('YYYY-MM-DD');
    user.updateAt = today;
    user.file = protect.encode(file);

    // 3. copy模板资源文件
    let templatePath = path.join(__dirname, 'template', template);
    fs.copy(templatePath, publicPath);

    // 3. 注入用户配置
    await injectConfig(user);

    // 4. 打印pdf
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('正在生成加密版pdf...');
    await page.goto(`file://${__dirname}/public/index.html`);
    await page.pdf({path: `${path.join(__dirname, 'public', 'resume.pdf')}`, format: 'A4', margin: {top: '20px', bottom: '20px'}});
    console.log('正在生成未加密版pdf...');
    await page.goto(`file://${__dirname}/public/index.html?key=${key}`);
    await page.pdf({path: `${path.join(__dirname, 'public', file + '.pdf')}`, format: 'A4', margin: {top: '20px', bottom: '20px'}});
    await page.close();
    await browser.close();
}()

