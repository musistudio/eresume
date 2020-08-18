function getNodeHtml(node) {
    let outer = document.createElement('div');
    outer.appendChild(node);
    return outer.innerHTML;
}


function printer() {
    document.querySelector('.tools').style.display = 'none';
    document.querySelector('.container').className = 'container-printer';
    window.print();
    document.querySelector('.tools').style.display = '';
    document.querySelector('.container-printer').className = 'container';
}

function parseQuery() {
    let obj = {}
    let query = location.search.substr(1).split('&').map(q => q.split('='));
    query.forEach(q => {
        obj[q[0]] = q[1];
    })
    return obj;
}


class Handler {
    constructor(el, config, key) {
        this.el = el;
        this.config = config;
        this.keywords = ['熟悉', '了解', '熟练'];
        this.key = key;
        this.render();
    }

    ifHandler(source) {
        let eles = Array.prototype.slice.call(document.querySelectorAll('*[u-if]'));
        eles.forEach(ele => {
            if (!ele.getAttribute('u-if') || !eval(ele.getAttribute('u-if'))) {
                let outer = document.createElement('div');
                outer.appendChild(ele);
                source = source.replace(outer.innerHTML, '');
            } else {
                let native = getNodeHtml(ele);
                ele.removeAttribute('u-if');
                let outer = getNodeHtml(ele);
                source = source.replace(native, outer);
            }
        })
        return source;
    }

    forHandler(source) {
        let eles = Array.prototype.slice.call(document.querySelectorAll('*[u-for]'));
        let nodes = [];
        let parent = null;
        for (let i = 0; i < eles.length; i++) {
            if (!parent) {
                parent = {
                    el: eles[i],
                    children: [],
                    command: eles[i].getAttribute('u-for'),
                    origin: getNodeHtml(eles[i])
                }
            }
            if (parent.el.contains(eles[i + 1]) && !parent.children.some(child => child.el && child.el.contains(eles[i + 1]))) {
                parent.children.push({ el: eles[i + 1], children: [], command: eles[i + 1].getAttribute('u-for'), origin: getNodeHtml(eles[i + 1]) });
            } else if (parent.children.some(child => child.el && child.el.contains(eles[i + 1]))) {
                let p = parent.children.filter(child => child.el.contains(eles[i + 1]))
                if (p.length) p = p[0];
                p.children.push({ el: eles[i + 1], children: [], command: eles[i + 1].getAttribute('u-for'), origin: getNodeHtml(eles[i + 1]) })
            } else {
                nodes.push(parent);
                if (i < eles.length - 1) {
                    parent = {
                        el: eles[i + 1],
                        children: [],
                        command: eles[i + 1].getAttribute('u-for'),
                        origin: getNodeHtml(eles[i + 1])
                    }
                }
            }
            eles[i].removeAttribute('u-for');
        }
        let visitNode = (node, parent) => {
            let { el, children, command } = node;
            if (command && command.split(' in ').length === 2) {
                let parseValue = command.split(' in ');
                let datas = parent ? eval(parseValue[1].replace(parseValue[1].split('.')[0], 'parent')) : eval(parseValue[1]);
                let parmas = parseValue[0].split(',');
                parmas = parmas.map(parma => parma.trim().replace(')', '').replace('(', ''));
                let template = datas.map((_data, _index) => {
                    window[parmas[0]] = _data;
                    if (parmas.length > 1) window[parmas[1]] = _index;;
                    let source = node.origin;
                    node.children.forEach(child => {
                        source = source.replace(child.origin, visitNode(child, _data));
                    });
                    source = this.templateHandler(source);
                    delete (window[parmas[0]])
                    if (parmas.length > 1) delete (window[parmas[1]])
                    return source;
                })
                return template.join('');
            }
        }
        nodes.forEach(node => {
            node.source = visitNode(node);
            source = source.replace(node.origin, node.source);
        })
        return source;
    }

    templateHandler(source) {
        let templates = source.match(/\{\{[a-zA-Z0-9:]*[a-zA-Z0-9]+[.]*[a-zA-Z0-9]+[_]*[a-zA-Z0-9]+\}\}/g);
        templates && templates.forEach(template => {
            let type;
            let key = template.substring(2, template.length - 2);
            if(key.startsWith('url:')) {
                key = key.replace('url:', '');
                type = 'url';
            }
            let value = eval(key);
            if (typeof value === 'object') {
                switch (value.type) {
                    case 'link':
                        let content = `<a href="${value.url}" target="_black">${value.content}</a>`;
                        source = source.replace(template, content);
                        break;
                }
            } else {
                if (value.startsWith('http') && type !== 'url') {
                    value = value.split('//')[1];
                } else if (value.startsWith('protect.decode')) {
                    if (this.key && eval(value)) {
                        value = eval(value);
                    } else {
                        value = '***';
                    }
                }
                source = source.replace(template, value)
            }
        })
        return source;
    }

    keywordsHandler(source) {
        let keywords = ['熟悉', '了解', '熟练'];
        keywords.forEach(keyword => {
            source = source.replace(new RegExp(`${keyword}`, 'g'), `<span class="keywords">${keyword}</span> `);
        })
        return source;
    }

    render() {
        let source = this.el.innerHTML;
        source = this.ifHandler(source);
        this.el.innerHTML = source;
        source = this.forHandler(source);
        source = this.templateHandler(source);
        source = this.keywordsHandler(source);
        this.el.innerHTML = source;
    }
}


class Protect {
    constructor(pwd) {
        this.options = {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.ZeroPadding
        }
        this.key = pwd;
    }
    decode(str) {
        let decryptedStr;
        try {
            let decryptedData = CryptoJS.AES.decrypt(str, this.key, this.options);
            decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.log('密码错误');
            decryptedStr = '***';
        }
        return decryptedStr;
    }
    encode(str) {
        var encryptedData = CryptoJS.AES.encrypt(str, this.key, this.options);
        var encryptedBase64Str = encryptedData.toString();
        return encryptedBase64Str;
    }
}

let query = parseQuery();
let { key } = query;
let protect = new Protect(key);
if (key && protect.decode(user.file)) {
    document.querySelector('.download').querySelector('a').href = protect.decode(user.file);
}
new Handler(document.querySelector('#app'), user, key);
if (navigator.webdriver) {
    document.querySelector('.tools').style.display = 'none';
    document.querySelector('.container').className = 'container-printer';
}