const path = require('path');
const isDev = think.env === 'development';
const cors = require('kcors')
const jwt = require('koa-jwt')
const swaggerParser = require('think-swagger-parser')
const swaggerRouter = require('think-swagger-router')
const swaggerController = require('think-swagger-controller')

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
      contentType(ctx) {
        // All request url starts of /api or request header contains `X-Requested-With: XMLHttpRequest` will output json error
        const APIRequest = /^\/v*/.test(ctx.request.path);
        console.log(ctx.request.path)
        const AJAXRequest = ctx.is('X-Requested-With', 'XMLHttpRequest');
        return APIRequest || AJAXRequest ? 'json' : 'html';
      },
      // basic set as string, then put 404.html, 500.html into error folder
      // templates: path.join(__dirname, 'error'),
      // customed set as object
      templates: {
        404: path.join(__dirname, 'error/404.html'),
        500: path.join(__dirname, 'error/500.html'),
        502: path.join(__dirname, 'error/502.html')
      },
      sourceMap: false,
      debug: isDev,
      error(err, ctx) {
        return console.error(err)
      }
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
          // if (err.status === 404) {
          //   ctx.status = 404
          //   ctx.body = '404'
          //   throw err;
          // }
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
      if (ctx.url.match(ctx.url.match(/^\/v1\/org\/\d+(?:\/subdomain_validation|signin|signout)?/) || ctx.url.match(/^\/v1\/apps\/\w+\/options?/) || ctx.url.match(/^\/v1\/apps\/\w+\/auth\/token?/))) {
        return false;
      } else if (ctx.url.match(ctx.url.match(/^\/v1*?/))) {
        console.log(ctx.url)
        return true
      }
    }
  },
  'logic',
  'controller'
  // {
  //   handle: swaggerParser,
  //   options: {
  //     debug: isDev,
  //     api_doc: './api/swagger.yaml',
  //     controller_dir: './app/controller'
  //   }
  // },
  // {
  //   handle: swaggerRouter,
  //   options: {
  //     debug: isDev
  //   }
  // },
  // {
  //   handle: swaggerController,
  //   options: {
  //     debug: isDev
  //   }
  // }
]
