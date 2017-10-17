/* eslint-disable no-undef */
const BaseRest = require('./_rest')
// import speakeasy from 'speakeasy';
const jwt = require('jsonwebtoken')

module.exports = class extends BaseRest {
  async getAction () {
    return this.success('Hello lets login')
  }
/*  async postAction () {
    // if (this.ctx.isPost) {
    const userLogin = this.post('user_login');
    const userModel = this.model('users', {orgId: this.orgId});
    const userInfo = await userModel.where({user_login: userLogin}).find();
    if (think.isEmpty(userInfo)) {
      return this.fail('ACCOUNT_ERROR');
    }

    // 帐号是否被禁用，且投稿者不允许登录
    if ((userInfo.user_status | 0) !== 1 || userInfo.deleted === 1) {
      return this.fail('ACCOUNT_FORBIDDEN');
    }

    // 校验密码
    const password = this.post('user_pass');
    if (!userModel.checkPassword(userInfo, password)) {
      return this.fail('ACCOUNT_ERROR');
    }
    // 获取签名盐
    const token = jwt.sign(userInfo, 'shared-secret', {expiresIn: '3d'})
    // user: userInfo.user_login,
    return this.success({user: userInfo.user_login, token: token});
    // }
  }*/
  async postAction () {
    console.log(this.post())
    let orgId = this.get('orgId')
    let data = this.post()
    const userLogin = data.user_login;
    const userModel = this.model('users');
    const userInfo = await userModel.where({user_login: userLogin}).find();
    // 验证用户是否存在
    if (think.isEmpty(userInfo)) {
      return this.fail('ACCOUNT_ERROR');
    }
    // 验证机构中是否存在此用户并处理用户角色权限
    _formatOneMeta(userInfo)
    if (!Object.is(userInfo.meta[`org_${orgId}_capabilities`], undefined)) {
      userInfo.role = JSON.parse(userInfo.meta[`org_${orgId}_capabilities`]).role
    } else {
      return this.fail('ACCOUNT_FORBIDDEN');
    }

    // 帐号是否被禁用，且投稿者不允许登录
    if ((userInfo.user_status | 0) !== 1 || userInfo.deleted === 1) {
      return this.fail('ACCOUNT_FORBIDDEN');
    }

    // 校验密码
    const password = data.user_pass;
    if (!userModel.checkPassword(userInfo, password)) {
      return this.fail('ACCOUNT_ERROR');
    }
    // 获取签名盐
    const token = jwt.sign(userInfo, 'shared-secret', {expiresIn: '3d'})
    // user: userInfo.user_login,
    return this.success({user: userInfo.user_login, token: token});
    // }
  }
  /**
   * login
   * @return {} []
   */
  async _loginAction () {
    // 二步验证
    // let model = this.model('options');
    // let options = await model.getOptions();
    // if(options.two_factor_auth){
    //     let two_factor_auth = this.post('two_factor_auth');
    //     let verified = speakeasy.totp.verify({
    //         secret: options.two_factor_auth,
    //         encoding: 'base32',
    //         token: two_factor_auth,
    //         window: 2
    //     });
    //     if(!verified){
    //         return this.fail('TWO_FACTOR_AUTH_ERROR');
    //     }
    // }

    // 校验帐号和密码
    let username = this.post('username');
    let userModel = this.model('users');
    let userInfo = await userModel.where({name: username}).find();
    if (think.isEmpty(userInfo)) {
      return this.fail('ACCOUNT_ERROR');
    }

    // 帐号是否被禁用，且投稿者不允许登录
    if ((userInfo.status | 0) !== 1 || userInfo.type === 3) {
      return this.fail('ACCOUNT_FORBIDDEN');
    }

    // ea校验密码
    let password = this.post('password');
    if (!userModel.checkPassword(userInfo, password)) {
      return this.fail('ACCOUNT_ERROR');
    }

    await this.session('userInfo', userInfo);

    return this.success();
  }

  /**
   * logout
   * @return {}
   */
  async logoutAction () {
    await this.session('userInfo', '');
    return this.redirect('/');
  }

  /**
   * update user password
   */
  async passwordAction () {
    let userInfo = await this.session('userInfo') || {};
    if (think.isEmpty(userInfo)) {
      return this.fail('USER_NOT_LOGIN');
    }

    let rows = await this.model('user').saveUser({
      password: this.post('password'),
      id: userInfo.id
    }, this.ip());

    return this.success(rows);
  }
}