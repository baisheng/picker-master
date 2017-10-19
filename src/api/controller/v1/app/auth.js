/* eslint-disable no-undef */
const BaseRest = require('./_rest')
// import speakeasy from 'speakeasy';
const jwt = require('jsonwebtoken')

module.exports = class extends BaseRest {
  async getAction () {
    return this.success('Auth login ...')
    // const options = await this.model('options', {appId: this.appId}).get()
    // const wxConfig = options.wechat
    // if (!think.isEmpty(wxConfig)) {
    //   const wxService = think.service('wechat', 'common', wxConfig.appid, wxConfig.appsecret)
    //   const userInfo = await wxService.getUserInfo("ZkDLUtcmofiCWrw0y8vtzcuz/HQ4Fz+Wb8kBGGspi6gD7eNBjtob8qDbWxmoIoLbTdCZK0+WGFzHHHVIzXkRyK1ozG4K1ttdpngz+bDhj9W2Ez5SwAX+aETXW3fbQ6HHAXidc6x3/l0N0ZGhfsMX4+NsaY3lT2I6TvpZHd2DvQ342TT0GAjv3j4lKgU8rv09u5JG96tHc5BIMB7uWgxT+sY5VbyVy2/TFj4Pss8h7/PmzT5CR0Dgg8bhEG7TIIZCx6TH+B1gceI03pKucQO/hxyBQHDJgeyDtCUAJMruztI8XLpvi7yuLSOab39L3IkVsETcgjEBW9FU/TQRnmpA/2M0rzBUSNwTssb/GEq2zu06gezHvT3LMgD9zy8AE1IGPPzZpkywee0A0q44pLIIZ19Th8U5qsww18dbZ4jsxlr6iR2Rdib/W+b+hPyoaypkPCMaHU9Xk3BRZtpYWgCasNr8sbbmK2oHk3Q9tzvO2fs=", "4HFniLF40QbTOACfRxFeFg==", '0111jTO40mtKxI1jhyM40YLNO401jTOX')
    //   return this.success(userInfo)
    // }
  }

  async postAction () {
    const xWechatCode = this.header('x-wechat-code')
    if (!think.isEmpty(xWechatCode)) {
      const encrypted = this.header('x-wechat-encrypted')
      const iv = this.header('x-wechat-iv')
      await this.wxLogin(xWechatCode, encrypted, iv)
    }
    // return this.json(this.ctx.headers)
    // console.log(JSON.stringify(this.ctx.headers))
    // const wxcode = this.header
    // let orgId = this.get('orgId')
    // let data = this.post()
    // const userLogin = data.user_login;
    // const userModel = this.model('users');
    // const userInfo = await userModel.where({user_login: userLogin}).find();
    // 验证用户是否存在
    // if (think.isEmpty(userInfo)) {
    //   return this.fail('ACCOUNT_ERROR');
    // }
    // 验证机构中是否存在此用户并处理用户角色权限
    // _formatOneMeta(userInfo)
    // if (!Object.is(userInfo.meta[`org_${orgId}_capabilities`], undefined)) {
    //   userInfo.role = JSON.parse(userInfo.meta[`org_${orgId}_capabilities`]).role
    // } else {
    //   return this.fail('ACCOUNT_FORBIDDEN');
    // }

    // 帐号是否被禁用，且投稿者不允许登录
    // if ((userInfo.user_status | 0) !== 1 || userInfo.deleted === 1) {
    //   return this.fail('ACCOUNT_FORBIDDEN');
    // }

    // 校验密码
    // const password = data.user_pass;
    // if (!userModel.checkPassword(userInfo, password)) {
    //   return this.fail('ACCOUNT_ERROR');
    // }
    // 获取签名盐
    // const token = jwt.sign(userInfo, 'shared-secret', {expiresIn: '3d'})
    // user: userInfo.user_login,
    // return this.success({user: userInfo.user_login, token: token});
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
   * x-wechat-code : 微信登录的 code
   * x-wechat-encrypted : 微信登录后已加密的用户信息
   * x-wechat-iv: 解密向量
   *
   * @returns {Promise.<void>}
   */
  async wxLogin (code, encrypted, iv) {
    const data = this.post()
    const options = await this.model('options', {appId: this.appId}).get()
    const wxConfig = options.wechat
    if (!think.isEmpty(wxConfig)) {
      const wxService = think.service('wechat', 'common', wxConfig.appid, wxConfig.appsecret)
      /*
        "openId": "oQgDx0IVqAg0b3GibFYBdtg3BKMA",
        "nickName": "请好好说话🌱",
        "gender": 1,
        "language": "en",
        "city": "Chaoyang",
        "province": "Beijing",
        "country": "China",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep0GdQEHK3tYdvq3DTMVhsdiaviaLg6b7CdDBLOYSWDGYOEtS7FFmvhd6CGCuQVfe4Rb0uQUlaq7XoA/0",
        "watermark": {
            "timestamp": 1508409692,
            "appid": "wxca1f2b8b273d909e"
        }
      */
      const wxUserInfo = await wxService.getUserInfo(encrypted, iv, code)
      // return this.success(userInfo)
    }
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