const Base = require('./base');

/**
 * model
 */
module.exports = class extends Base {
  // constructor(...args) {
  //   super(...args);
  //   this.relation = {
  //     metas: {
  //       type: think.model.HAS_MANY,
  //       model: 'postmeta',
  //       fKey: 'post_id',
  //       field: "post_id,meta_key,meta_value",
  //     }
  //     // comment: think.Model.HAS_MANY,
  //     // cate: think.Model.MANY_TO_MANY
  //   };
  // }

  get relation() {
    return {
      // children: {
      //   type:think.Model.HAS_MANY,
      //   model: 'posts',
      //   fKey: 'parent'
      // },
      metas: {
        type: think.Model.HAS_MANY,
        model: 'postmeta',
        fKey: 'post_id',
        field: "post_id,meta_key,meta_value"
        // rModel: 'usermeta',
        // fKey: 'users_id'
      }
    };
  }

  /**
   * 添加 meta 信息
   *
   * @param post_id
   * @param meta_key
   * @param meta_value
   * @param unique
   * @returns {Promise.<*>}
   */
  async addMeta(post_id, meta_key, meta_value, unique = false) {
    let _metaModel = this.model('postmeta', {appId: this.appId})
    let _id = await _metaModel.add({
      post_id: post_id,
      meta_key: meta_key,
      meta_value: JSON.stringify(meta_value)
    })
    return _id
  }

  // async update (data) {
    // return await super.update(data, this.options)
    // if (!Object.is(data['featured_image'], undefined)) {
    //   console.log(JSON.stringify(data))
    //
    // }
  // }
  // async save(data) {
    // let res = await this.add{{
    // }}
  // }
}
