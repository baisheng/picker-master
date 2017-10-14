module.exports = [
  // API V1 routes
  // [/\/v1\/org\/(\w+)/, '/api/v1/org/public?action=:1', 'rest'],
  // [/\/v1\/org(?:\/(\d+))?/, '/api/v1/org/public?orgId=:1', 'rest'],
  [/\/v1\/org\/(\d+)(?:\/(subdomain_validation|signin|signout))?/, '/api/v1/org/public?orgId=:1&action=:2', 'rest'],
  [/\/v1\/org\/(\w+)\/(\w+)(?:\/(\d+))?/, '/api/v1/org/:2?appId=:1&id=:3', 'rest'],
  [/\/v1\/app\/create?/, '/api/v1/app/public?action=create', 'rest'],
  // 分类方法 api
  [/\/v1\/app\/(\w+)\/taxonomy(?:\/(\w+))?/, '/api/v1/app/taxonomy?appId=:1&type=:2', 'rest'],
  [/\/v1\/app\/(\w+)\/(\w+)(?:\/(\d+))?/, '/api/v1/app/:2?appId=:1&id=:3', 'rest'],
  [/\/v1\/app\/(\w+)?/, '/api/v1/app/public?appId=:1', 'rest'],
  // verify_code,request_code other public action
  [/\/v1(?:\/(\w+))?/, '/api/v1/public?action=:1', 'rest'],
]
