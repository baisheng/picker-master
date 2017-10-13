/* eslint-disable no-return-await,no-undef */
module.exports = class extends think.Model {
  get relation () {
    return {
      metas: {
        type: think.Model.HAS_MANY,
        model: 'appmeta',
        fKey: 'app_id'
      }
    };
  }

  async findByOrgId (orgId) {
    const list = await this.where({org_id: orgId}).field(['id', 'org_id', 'domain', 'subdomain']).select()
    _formatMeta(list)
    return list
  }

  async get(appId) {
    const app = await this.where({id: appId}).find()
    _formatOneMeta(app)
    return app
  }

}
