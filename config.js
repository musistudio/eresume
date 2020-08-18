module.exports = {
    file: '张三_初级web前端工程师',   // 正式版简历pdf命名，建议名字加应聘职位名称
    template: 'mine',              // 使用模板
    key: 'hr',                     // 加密秘钥
    repo: 'https://gitee.com/musistudio/musistudio.git',   // git pages托管仓库
  	// 以下是用户简历信息
    user: {
        name: {              // 姓名
            value: '张三',
            protect: true    // 是否加密
        },
        blog: 'https://musii.life', // 博客
        email: {                    // 邮箱
            value: 'm@musii.life',
            protect: true
        },
        github: 'https://github.com/musistudio', // github
        phone: {                   // 手机号
            value: '131xxxxxxxx',
            protect: true
        },
        address: '浙江省杭州市',    // 现居地
        native_place: '浙江',     // 籍贯
        job: '初级web前端工程师',   // 职位名称
        introduce: '2020届应届生，日常使用JavaScript、Python进行开发。一年工作经验。',    //  自我介绍
        education: [             // 教育经历
            {
                time: '2016年9月-2020年7月',
                info: '本科'
            }
        ],
        skills: [    // 技能列表
            {
                name: '编程技能',
                datas: [
                    '熟悉JavaScript基础特性',
                    '熟悉ES5、ES6、ES7等新语法',
                    '了解微信小程序的开发',
                    '了解微信H5的开发',
                    '了解Vue前端框架'
                ]
            },
            {
                name: '版本控制',
                datas: [
                    '了解GIT版本控制工具'
                ]
            },
            {
                name: '布局排版',
                datas: [
                    '熟练使用MarkDown进行布局排版'
                ]
            },
            {
                name: '开发平台',
                datas: [
                    '熟悉Linux/macOS等开发平台，熟练使用Vscode、WebStorm、PyCharm等开发工具'
                ]
            }
        ],
        projects: [    // 项目经历
            {
                name: '项目名称',
                description: '项目描述',
                start: '2020年6月',  // 项目开始时间
                end: '2020年8月',    // 项目完成时间
                lists: [
                    '负责xxx',
                    '负责xxx'
                ],
                tags: [
                    'Vue', 'Mysql', '全栈'
                ]
            }
        ],
        hobbies: [    //  个人爱好
            {
                type: '其他',
                content: '阅读，旅行，电影'
            }
        ],
        updateAt: ''
    }
}