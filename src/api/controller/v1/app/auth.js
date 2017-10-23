/* eslint-disable no-undef */
const BaseRest = require('./_rest')
// import speakeasy from 'speakeasy';
const jwt = require('jsonwebtoken')

module.exports = class extends BaseRest {
  async getAction () {
    const action = this.get('action')
    switch (action) {
      // 获取会话
      // return
      case 'token': {
        const code = this.get('code')
        if (!think.isEmpty(code)) {
          try {
            const token = await this.wxLogin(code);
            return this.success({token: token})
          } catch (e) {
            return this.fail(e)
          }
        } else {
          return this.fail()
        }
      }
      default: {
        break;
      }
    }
    // return this.success('Auth login ...')
    // const options = await this.model('options', {appId: this.appId}).get()
    // const wxConfig = options.wechat
    // if (!think.isEmpty(wxConfig)) {
    //   const wxService = think.service('wechat', 'common', wxConfig.appid, wxConfig.appsecret)
    //   const userInfo = await wxService.getUserInfo("ZkDLUtcmofiCWrw0y8vtzcuz/HQ4Fz+Wb8kBGGspi6gD7eNBjtob8qDbWxmoIoLbTdCZK0+WGFzHHHVIzXkRyK1ozG4K1ttdpngz+bDhj9W2Ez5SwAX+aETXW3fbQ6HHAXidc6x3/l0N0ZGhfsMX4+NsaY3lT2I6TvpZHd2DvQ342TT0GAjv3j4lKgU8rv09u5JG96tHc5BIMB7uWgxT+sY5VbyVy2/TFj4Pss8h7/PmzT5CR0Dgg8bhEG7TIIZCx6TH+B1gceI03pKucQO/hxyBQHDJgeyDtCUAJMruztI8XLpvi7yuLSOab39L3IkVsETcgjEBW9FU/TQRnmpA/2M0rzBUSNwTssb/GEq2zu06gezHvT3LMgD9zy8AE1IGPPzZpkywee0A0q44pLIIZ19Th8U5qsww18dbZ4jsxlr6iR2Rdib/W+b+hPyoaypkPCMaHU9Xk3BRZtpYWgCasNr8sbbmK2oHk3Q9tzvO2fs=", "4HFniLF40QbTOACfRxFeFg==", '0111jTO40mtKxI1jhyM40YLNO401jTOX')
    //   return this.success(userInfo)
    // }
  }

  async postAction () {
    const data = this.post()
    console.log(JSON.stringify(data))
    if (!Object.is(data.action, undefined)) {
      if (data.action === 'verify_token') {
        jwt.verify(data.token, 'S1BNbRp2b', (err, decoded) => {
          if (err) {
            console.log(err)
            return this.fail({"errno": 1000, data: err})
            /*
              err = {
                name: 'TokenExpiredError',
                message: 'jwt expired',
                expiredAt: 1408621000
              }
            */
          }
          return this.success({verify: 'success'})
        })
      }
    }
    // const xWechatCode = this.header('x-wechat-code')
    // if (!think.isEmpty(xWechatCode)) {
    //   const encrypted = this.header('x-wechat-encrypted')
    //   const iv = this.header('x-wechat-iv')
    //   await this.wxLogin(xWechatCode, encrypted, iv)
    // }
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

  async wxSession (code) {
    const options = await this.model('options', {appId: this.appId}).get()
    const wxConfig = options.wechat
    if (!think.isEmpty(wxConfig)) {
      const wxService = think.service('wechat', 'common', wxConfig.appid, wxConfig.appsecret)
      const session = await wxService.getKey(code)
      return session
      // return this.success(userInfo)
    }
  }

  async wxLogin (code) {

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
      try {
        const data = await wxService.getKey(code)
        const openId = data.data.openid
        // 验证用户或保存为新用户
        const token = jwt.sign({user_login: openId}, 'S1BNbRp2b', {expiresIn: '3d'})
        console.log(token)
        const userModel = this.model('users')
        // const token = jwt.sign(wxUserInfo, 'S1BNbRp2b')
        await userModel.saveWechatUser({openId: openId, appId: this.appId})
        return token
      } catch (e) {
        console.log(e)
        throw e
      }
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
