/* eslint-disable no-return-await,no-undef */
module.exports = class extends think.Model {
  get relation () {
    return {
      metas: {
        type: think.Model.HAS_MANY,
        model: 'orgmeta',
        fKey: 'org_id'
      },
      apps: {
        type: think.Model.HAS_MANY,
        model: 'apps',
        fKey: 'org_id'
      }
    };
  }

  async get () {
    const orgs = await this.list();
    return orgs
  }

  async list () {
    const map = {}
    const list = await this.where(map).field(['id', 'domain', 'subdomain']).select()

    _formatMeta(list)
    const obj = {}
    for (const v of list) {
      let domain = v.domain
      if (think.isEmpty(domain) && !think.isEmpty(v.subdomain)) {
        domain = v.subdomain
      }
      obj[domain] = v.id
      _formatMeta(v.apps)
      await think.cache(domain.toString(), v)
    }
    return obj
  }
}
