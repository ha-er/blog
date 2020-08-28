module.exports = {
    title: '哈儿博客',
    description: '哈儿的学习博客',
    dest: '.dist',
    port: '0320',
    head: [
        ['link', {rel: 'icon', href: '/img/logo.jpg'}],
        ['link', {rel: 'stylesheet', href: '/css/base.css'}],
    ],
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav: require("./nav"),
        sidebar: require("./sidebar"),
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        searchMaxSuggestoins: 10,
        serviceWorker: {
            updatePopup: {
                message: "有新的内容",
                buttonText: '更新'
            }
        },
        editLinks: true,
        editLinkText: '在GitHub上编辑此页！'
    },
    plugins: [
        /* 右下角回到顶部*/
        ['@vuepress/plugin-back-to-top', false],
        [
            'vuepress-plugin-gotop-plus', {
            // 是否在移动设备上显示(default: true)
            mobileShow: false,
            // 回到页首元素显示触发的高度阈值(default: 50)
            threshold: 50
        }
        ],
    ],
};