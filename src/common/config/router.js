module.exports = [
  // API V1 routes
  // [/\/v1\/org\/(\w+)/, '/api/v1/org/public?action=:1', 'rest'],
  // [/\/v1\/org(?:\/(\d+))?/, '/api/v1/org/public?orgId=:1', 'rest'],
  [/\/v1\/org\/(\d+)(?:\/(subdomain_validation|signin|signout))?/, '/api/v1/org/public?orgId=:1&action=:2', 'rest'],
  [/\/v1\/app\/create?/, '/api/v1/app/public?action=create', 'rest'],
  [/\/v1\/app\/(\w+)?/, '/api/v1/app/public?appId=:1', 'rest'],
  [/\/v1\/(\w+)\/(\d+)\/(\w+)(?:\/(\d+))?/, '/api/v1/:1/:3?orgId=:2&id=:4', 'rest'],
  // verify_code,request_code other public action
  [/\/v1(?:\/(\w+))?/, '/api/v1/public?action=:1', 'rest'],
]
