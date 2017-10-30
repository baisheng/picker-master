module.exports = [
  // API V1 routes
  // [/\/v1\/org\/(\w+)/, '/api/v1/org/public?action=:1', 'rest'],
  // [/\/v1\/org(?:\/(\d+))?/, '/api/v1/org/public?orgId=:1', 'rest'],
  // 机构管理 api
  // 2 appid + 2 api + 3 postid + 4 action + status
  // [/\/v1\/app\/(\w+)\/posts\/(\d+)\/(\w+)\/replies\/(\w+)?/, '/api/v1/app/posts/:3/mine?appId=:1&id=:2&action=:4', 'get, post'],
  [/\/v1\/app\/(\w+)\/comments\/(\d+)?/, '/api/v1/app/comments?appId=:1&id=:2', 'get'],
  [/\/v1\/app\/(\w+)\/posts\/(\d+)\/replies?/, '/api/v1/app/posts/replies?appId=:1&id=:2', 'get'],
  [/\/v1\/app\/(\w+)\/posts\/(\d+)\/(\w+)\/mine\/(\w+)?/, '/api/v1/app/posts/:3/mine?appId=:1&id=:2&action=:4', 'get, post'],
  [/\/v1\/app\/(\w+)\/posts\/(\d+)\/(\w+)\/new?/, '/api/v1/app/posts/:3/new?appId=:1&id=:2', 'post'],
  [/\/v1\/app\/(\w+)\/me\/likes?/, '/api/v1/app/me/likes?appId=:1', 'get'],
  [/\/v1\/app\/(\w+)\/posts\/(\d+)\/likes?/, '/api/v1/app/posts/likes?appId=:1&id=:2', 'get'],
  [/\/v1\/app\/(\w+)\/posts\/(\d+)\/(\w+)\/(\w+)?/, '/api/v1/app/posts/:4?appId=:1&id=:3&action=:5', 'rest'],
  [/\/v1\/org\/(\d+)(?:\/(subdomain_validation|signin|signout))?/, '/api/v1/org/public?orgId=:1&action=:2', 'rest'],
  [/\/v1\/org\/(\w+)\/(\w+)(?:\/(\d+))?/, '/api/v1/org/:2?appId=:1&id=:3', 'rest'],
  [/\/v1\/app\/create?/, '/api/v1/app/public?action=create', 'rest'],
  [/\/v1\/app\/(\w+)\/auth\/(\w+)\/?/, '/api/v1/app/auth?appId=:1&action=:2', 'rest'],
  [/\/v1\/app\/(\w+)\/(wxlogin|signin|signout)\/?/, '/api/v1/app/public?appId=:1&action=:2', 'rest'],
  // 分类方法 api
  [/\/v1\/app\/(\w+)\/taxonomy(?:\/(\w+))?/, '/api/v1/app/taxonomy?appId=:1&type=:2', 'rest'],
  // [/\/v1\/app\/(\w+)\/posts(?:\/(\w+))?/, '/api/v1/app/posts?appId=:1&format=:2', 'rest'],
  [/\/v1\/app\/(\w+)\/(\w+)(?:\/(\d+))?/, '/api/v1/app/:2?appId=:1&id=:3', 'rest'],
  // [/\/v1\/app\/(\w+)?/, '/api/v1/app/public?appId=:1', 'rest'],
  // verify_code,request_code other public action
  [/\/v1\/file?/, '/api/v1/file', 'rest'],
  [/\/v1(?:\/(\w+))?/, '/api/v1/public?action=:1', 'rest'],
]
