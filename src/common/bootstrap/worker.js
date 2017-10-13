/* eslint-disable no-undef */
require('./global');

// invoked in worker
think.beforeStartServer(async () => {
  // 获取全部组织账户信息并缓存
  const orgs = await think.model('orgs').list()
  await think.cache('orgs', orgs)
  const options = await think.model('options').get(true)
  // console.log(JSON.stringify(options.sms))
  think.config('options', options)
})

think.app.on("appReady", function () {
  // console.log('app ready')
})
