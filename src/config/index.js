const config = {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '源代码商家后台',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 14,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,

  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'Home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}

switch (process.env.NODE_ENV) {
  case 'development':
    config.baseUrl = 'http://localhost:9001'
    config.publicBucketDomain = 'https://mall-public-uat.oss-cn-zhangjiakou.aliyuncs.com/'
    break

  case 'uat':
    config.baseUrl = 'https://uat-merchant-server.dobaishop.com'
    config.publicBucketDomain = 'https://mall-public-uat.oss-cn-zhangjiakou.aliyuncs.com/'
    break

  default:
    config.baseUrl = 'https://merchant-server.dbjiaju.cn'
    config.publicBucketDomain = 'https://mall-public-prod.oss-cn-zhangjiakou.aliyuncs.com/'
}

export default config
