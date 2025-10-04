/**
 * 网站配置文件
 */
const greenText = (text) => `\x1b[32m${text}\x1b[0m`

export const config = {
  appName: 'Gin-Vue-Admin',
  appLogo: 'logo.png',
  showViteLogo: true,
  KeepAliveTabs: true,
  logs: []
}

export const viteLogo = (env) => {
  if (config.showViteLogo) {
  }
}

export default config
