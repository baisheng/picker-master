/* eslint-disable no-return-await */
const BaseRest = require('./_rest.js');
module.exports = class extends BaseRest {
  async getAction () {
    const appsModel = this.model('apps')
    const app = await appsModel.get(this.appId)
    return this.success(app)
  }

  async bindWxApp () {
  }

  async postAction () {
    const action = this.get('action')
    const data = this.post()

    switch (action) {
      case 'create': {
        const orgId = data.org_id
        if (think.isEmpty(orgId)) {
          return this.fail('机构 ID 不能为空!')
        }
        const type = data.type
        return await this.installApp(orgId, type)
      }
      default: {
        break
      }
    }
  }
  async installApp (orgId, type) {
    const appId = think.id.generate()
    // 应用数据表创建
    const db = think.service('installApp', 'common', {appId: appId})
    const res = await db.create()
    // 应用数据初始始化
    // 更新应用表信息
    if (think.isEmpty(res)) {
      const appsModel = this.model('apps')
      await appsModel.add({
        id: appId,
        org_id: orgId,
        create_time: new Date().getTime(),
        update_time: new Date().getTime(),
        public: 1,
        type: type
      })

      await this.model('appmeta').add({
        app_id: appId,
        meta_key: 'basic',
        meta_value: JSON.stringify({
          plan: 'basic'
        })
      })
      return this.success({appId: appId})
    } else {
      think.logger.error(res)
      return this.fail(res)
    }
  }
};
