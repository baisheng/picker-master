/* eslint-disable no-return-await,no-undef */
const Base = require('./base');

module.exports = class extends Base {
  get relation () {
    return {
      metas: {
        type: think.Model.HAS_MANY,
        model: 'termmeta',
        // rModel: 'usermeta',
        fKey: 'term_id',
        field: "term_id,meta_key,meta_value"
      }
    };
  }

  /**
   * 根据类别的分类方法获取分类
   * @param taxonomy
   * @returns {Promise.<Array>}
   */
  async getTerms (taxonomy) {
    const allTerms = await this.allTerms()
    const allTaxonomies = await this.allTaxonomies()

    // 按分类方法查询分类信息
    const categorys = await think._.filter(allTaxonomies, {'taxonomy': taxonomy})

    let _terms = []
    categorys.forEach((item) => {
      _terms.push(
        Object.assign({},
          item, think._.find(allTerms, {id: item.term_id})))
    })
    return _terms
  }

  /**
   * 按分类法查询指定数量内容,主要用于 top 查询
   * @param term_ids
   * @param taxonomies
   * @param limit
   * @returns {Promise.<Array>}
   */
  async getObjectsInTermsByLimit (term_ids, taxonomies = 'category', limit = 6) {
    const _term_relationships = this.model("term_relationships", {appId: this.appId})
    let objects
    objects = await _term_relationships.join({
      table: "term_taxonomy",
      join: "inner",
      as: "tt",
      on: ["term_taxonomy_id", "term_id"]

    }).field("object_id").where("tt.taxonomy IN ('" + taxonomies + "') AND tt.term_id IN (" + term_ids + ")").limit(limit).select();
    let ids = [];
    for (let obj of objects) {
      ids.push(obj.object_id);
    }
    return ids;
  }

  /**
   * 根据分类方法分页查询内容
   * @param term_ids
   * @param taxonomies
   * @param page
   * @returns {Promise.<*>}
   */
  async getObjectsInTermsByPage (term_ids, taxonomies = 'category', page) {
    const _term_relationships = this.model("term_relationships", {appId: this.appId})
    let objects

    if (think.isEmpty(page)) {
      objects = await _term_relationships.join({
        table: "term_taxonomy",
        join: "inner",
        as: "tt",
        on: ["term_taxonomy_id", "term_id"]

      }).field("object_id").where("tt.taxonomy IN ('" + taxonomies + "') AND tt.term_id IN (" + term_ids + ")").select();
      let ids = [];
      for (let obj of objects) {
        ids.push(obj.object_id);
      }
      return ids;
    }

    objects = await _term_relationships.join({
      table: "term_taxonomy",
      join: "inner",
      as: "tt",
      on: ["term_taxonomy_id", "term_id"]

    }).field("object_id").where("tt.taxonomy IN ('" + taxonomies + "') AND tt.term_id IN (" + term_ids + ")").order('object_id DESC').page(page, 10).countSelect();
    const ids = [];
    for (let obj of objects.data) {
      ids.push(obj.object_id);
    }
    Reflect.deleteProperty(objects, 'data')
    // delete objects.data;
    objects.ids = ids;

    return objects;
  }

  /**
   * 根据内容获取分类, 这里查询出来的分类未查询它所归属的分类法，仅类别的信息
   * @returns {Promise.<void>}
   */
  async getTermsByObject (object_id) {

    // 从缓存中提取到所有 term
    let all_terms = await this.allTerms();

    let _term_relationships = this.model("term_relationships", {appId: this.appId});

    // 查询内容关联的分类法 id == term_id
    let taxonomies = await _term_relationships.field('term_taxonomy_id as term_id').where({"object_id": object_id}).select();

    /**
     * 按 term_id 查询 term
     * @type {Array}
     * @private
     */
    let _terms = [];
    taxonomies.forEach((item) => {
      _terms.push(think._.filter(all_terms, {id: item.term_id}));
    });

    return await think._.flattenDeep(_terms);
  }

  /**
   * 获取全部分类
   * @param flag
   * @returns {Promise.<*>}
   */
  async allTerms (flag) {
    const cacheKey = this.tablePrefix + 'all_terms';
    if (flag) {
      await think.cache(cacheKey, null)
    }
    let ret = await think.cache(cacheKey)

    if (think.isEmpty(ret)) {
      let _data = await this.model('terms', {appId: this.appId}).select();
      _formatMeta(_data)
      await think.cache(cacheKey, _data)
      ret = await think.cache(cacheKey)
    }
    return ret
  }

  /**
   * 获取全部分类方法
   * @param flag
   * @returns {Promise.<*>}
   */
  async allTaxonomies (flag) {
    const cacheKey = this.tablePrefix + 'all_term_taxonomy';
    if (flag) {
      await think.cache(cacheKey, null)
    }
    let ret = await think.cache(cacheKey)

    if (think.isEmpty(ret)) {
      let _data = await this.model('term_taxonomy', {appId: this.appId}).select();
      await think.cache(cacheKey, _data)
      ret = await think.cache(cacheKey)
    }
    return ret
  }

  /**
   * 根据内容获取分类，这里查询出来的分类未查询 它所归属的分类法，仅类别信息
   * @param objectId
   * @returns {Promise.<void>}
   */
  async getTermByObject (objectId) {
  }

  /**
   * 添加对象关联，支持多分类
   *
   * @param object_id
   * @param term_taxonomy_id
   * @returns {Promise.<void>}
   */
  async _relationships (object_id, term_taxonomy_id) {
    let _term_relationships = this.model('term_relationships', {appId: this.appId});

    await _term_relationships.thenUpdate({
      'object_id': object_id,
      'term_taxonomy_id': term_taxonomy_id
    }, {object_id: object_id, term_taxonomy_id: term_taxonomy_id})
  }

  /**
   * 添加对象关联，单分类
   *
   * @param object_id
   * @param term_taxonomy_id
   * @returns {Promise.<void>}
   */
  async relationships (object_id, term_taxonomy_id) {
    let _term_relationships = this.model('term_relationships', {appId: this.appId});

    await _term_relationships.thenUpdate({
      'object_id': object_id,
      'term_taxonomy_id': term_taxonomy_id
    }, {object_id: object_id})
  }

  async getTermBySlug (slug) {
    const terms = await this.allTerms()
    const term = await think._.find(terms, ['slug', slug]);
    return term
  }

  /**
   * 删除 Term
   *
   * @param term
   * @param taxonomy
   * @returns {Promise.<boolean>}
   */
  async deleteTerm (term, taxonomy) {
    // let id = this.get('id');
    // 1 删除 分类前，先做更新内容操作，将与分类关联的内容更新
    // await preDeleteTerm();
    // 2 删除分类的 meta 数据
    let _termmeta = this.model('termmeta', {appId: this.appId});
    let _terms = this.model('terms', {appId: this.appId});
    let _taxonomy = this.model('term_taxonomy', {appId: this.appId});
    let _term_relationships = this.model('term_relationships', {appId: this.appId});

    _termmeta.delete({
      where: {term_id: term}
    });

    _term_relationships.delete({
      where: {object_id: term}
    });

    _terms.delete({
      where: {id: term}
    });

    _taxonomy.delete({
      where: {term_id: term}
    });

    return true;
    // 3 删除 分类的类别方法数据
    // 4 解除与类别关联的内容关系
  }
}
