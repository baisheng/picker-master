const BaseRest = require('./_rest')
module.exports = class extends BaseRest {

  //
  // GET ACTIONS
  //
  async getAction () {
    const slug = this.get('slug')
    if (!think.isEmpty(slug)) {
      const term = await this.getTermBySlug(slug)
      return this.success(term)
    }
    const type = this.get('type')
    console.log('lalaa---')
    console.log('lalaa---' + type)
    // 根据分类的分类方法获取分类
    if (!think.isEmpty(type)) {
      const terms = await this.getTermsByTaxonomy(type)
      return this.success(terms)
    }
    const taxonomies = await this.getAllTaxonomies()
    return this.success(taxonomies)
  }

  async getTermBySlug (slug) {
    const term = await this.model('taxonomy', {appId: this.appId}).getTermBySlug(slug)
    return term
  }

  /**
   * 获取全部分类法
   * @returns {Promise.<*>}
   */
  async getAllTaxonomies () {
    const taxonomies = await this.model('taxonomy', {appId: this.appId}).allTaxonomies()
    return taxonomies
  }

  /**
   * 根据分类方法查询分类列表
   * @param taxonomy
   * @returns {Promise.<*>}
   */

  async getTermsByTaxonomy (taxonomy) {
    const taxonomyModel = this.model('taxonomy', {appId: this.appId})
    const terms = await taxonomyModel.getTerms(taxonomy)
    for (const item of terms) {
      item.url = ''
      const metaModel = this.model('postmeta', {appId: this.appId})
      // 如果有封面 默认是 thumbnail 缩略图，分类封面特色图片 featured_image
      if (!Object.is(item.meta._thumbnail_id, undefined)) {
        item.featured_image = await metaModel.getAttachment('file', item.meta._thumbnail_id)
      }
    }

    return terms
  }

  async getObjectsInTermsByLimit (terms) {
    const taxonomyModel = this.model('taxonomy', {appId: this.appId})
    const objects = await taxonomyModel.getObjectsInTermsByLimit(2)
    return objects
  }

  async updateAction () {}
  //
  // DELETE ACTIONS
  //
  async deleteCategory () {
    const termId = this.get('id')
    this.dao = this.model('taxonomy', {appId: this.appId})
    // this.dao.deleteTerm(termId, 'category')
  }
  async perDeleteTerm () {
    // Update children to point to new parent
    // if is_taxonomy_hierarchical(taxonomy)
  }

  async exists () {
    const term = this.get('term')
    let taxonomy = this.get('taxonomy')
    if (think.isEmpty(taxonomy)) {
      taxonomy = 'category'
    }
  }
}
