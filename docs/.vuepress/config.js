module.exports = {
  title: '哈儿博客',
  description: '哈儿的学习博客',
  dest: '.dist',
  port: '8080',
  head: [
    ['link', {rel: 'icon', href: '/img/logo.jpg'}],
    ['link', {rel: 'stylesheet', href: '/css/base.css'}],
  ],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    // nav: [{
    //   text: '懵逼指南', link: '/guide/'
    // }],
    nav: require("./nav"),
    sidebar: require("./sidebar"),
    // sidebar: {
    //   '/guide': [
    //     {
    //       title: '新手指南',
    //       collapsable: true,
    //       children: [
    //         '/guide/notes/one'
    //       ]
    //     },
    //     {
    //       title: '芝麻学院',
    //       collapsable: true,
    //       children: [
    //         '/guide/notes/two'
    //       ]
    //     }
    //   ]
    // },
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
  }
}