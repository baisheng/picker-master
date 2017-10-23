const path = require('path');
const isDev = think.env === 'development';
const cors = require('kcors')
const jwt = require('koa-jwt')

module.exports = [
  {
    handle: cors,
    options: {}
  },
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {}
  },
  {
    handle: 'router',
    options: {
      // defaultModule: 'api',
      // defaultController: 'index',
      // defaultAction: 'index'
    }
  },
  {
    handle: (option, app) => {
      return (ctx, next) => {
        // Custom 401 handling if you don't want to expose koa-jwt errors to users
        return next().catch((err) => {
          // eslint-disable-next-line yoda
          if (401 === err.status) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
          } else {
            ctx.body = 'Protected resource, use Authorization header to get access\n';
            throw err;
          }
        });
      };
    }
  },
  {
    handle: jwt,
    options: {
      secret: 'S1BNbRp2b'
    },
    match: ctx => { // match 为一个函数，将 ctx 传递给这个函数，如果返回结果为 true，则启用该 middleware
      if (ctx.url.match(ctx.url.match(/^\/v1\/org\/\d+(?:\/subdomain_validation|signin|signout)?/) || ctx.url.match(/^\/v1\/app\/\w+\/options?/) || ctx.url.match(/^\/v1\/app\/\w+\/auth\/token?/))) {
        return false;
      } else if (ctx.url.match(ctx.url.match(/^\/v1*?/))) {
        console.log(ctx.url)
        return true
      }
    }
  },
  'logic',
  'controller'
];
