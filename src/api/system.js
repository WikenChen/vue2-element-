import {request} from './api.js'
const SYSTEMURL = 'lark-system/v1'
//获取数据字典列表
export function getDictList(pageNum, pageSize, data = {}) {
  return request({
    url: `${SYSTEMURL}/dictionarys/pageNum=${pageNum}/pageSize=${pageSize}`,
    method: 'get',
    params: data,
  })
}
// 通过id获取数据字典明细
export function getDictionaryDetailById(id) {
  return request({
    url: `${SYSTEMURL}/dictionarys/${id}`,
    method: 'get',
  })
}
// 创建数据字典
export function createDictionay(data) {
  return request({
    url: `${SYSTEMURL}/dictionarys`,
    method: 'post',
    data
  })
}

// 创建数据字典子明细
export function createDictionayDetail(data) {
  return request({
    url: `${SYSTEMURL}/dictionaryDetails`,
    method: 'post',
    data
  })
}

// 更新数据字典
export function updateDictionay(data) {
  return request({
    url: `${SYSTEMURL}/dictionarys`,
    method: 'put',
    data
  })
}

// 更新数据字典明细
export function updateDictionayDetail(data) {
  return request({
    url: `${SYSTEMURL}/dictionaryDetails`,
    method: 'put',
    data
  })
}

// 删除数据字典
export function deleteDictionay(id) {
  return request({
    url: `${SYSTEMURL}/dictionarys/${id}`,
    method: 'delete',
  })
}

// 删除数据字典明细
export function deleteDictionayDetail(id) {
  return request({
    url: `${SYSTEMURL}/dictionaryDetails/${id}`,
    method: 'delete',
  })
}
/**
 * 
 *角色管理 
 */
// 角色列表
export function getRolesList(pageNum, pageSize, data) {
  return request({
    url: `${SYSTEMURL}/roles/pageNum=${pageNum}/pageSize=${pageSize}`,
    method: 'get',
    params: data
  })
}
// 新增角色
export function postRoles(parameter) {
  return request({
    url: `${SYSTEMURL}/roles`,
    method: 'post',
    data: parameter
  })
}

// 修改角色
export function putRoles(parameter) {
  return request({
    url: `${SYSTEMURL}/roles`,
    method: 'put',
    data: parameter
  })
}

//角色详情
export function getRolesDetail(id) {
  return request({
    url: `${SYSTEMURL}/roles/${id}`,
    method: 'get',
  })
}
//删除角色
export function delRoles(id) {
  return request({
    url: `${SYSTEMURL}/roles/${id}`,
    method: 'delete',
  })
}
// 角色数据权限更新
export function putUpdateRoleDataPermission(data) {
  return request({
    url: `${SYSTEMURL}/roles/updateRoleDataPermission${data}`,
    method: 'put',
  })
}

/**
 * 用户管理
 */
//获取用户列表
export function getUserList(pageNum, pageSize, data) {
  return request({
    url: `${SYSTEMURL}/users/pageNum=${pageNum}/pageSize=${pageSize}`,
    method: 'get',
    params: data
  })
}

// 新增用户管理
export function postUsers(parameter) {
  return request({
    url: `${SYSTEMURL}/users`,
    method: 'post',
    data: parameter
  })
}

// 修改用户管理
export function putUsers(parameter) {
  return request({
    url: `${SYSTEMURL}/users`,
    method: 'put',
    data: parameter
  })
}

//详情用户
export function getUsersDetail(id) {
  return request({
    url: `${SYSTEMURL}/users/${id}`,
    method: 'get',
  })
}

//删除用户
export function delUsers(id) {
  return request({
    url: `${SYSTEMURL}/users/${id}`,
    method: 'delete',
  })
}
// 修改密码
export function putPassword(data) {
  return request({
    url: `${SYSTEMURL}/users/${data.id}/password/currentPassword=${data.currentPassword}/password=${data.password}`,
    method: 'put',
    data: parameter
  })
}
// 重置密码
export function resetPassword(data) {
  return request({
    url: `${SYSTEMURL}/users/${data.id}/resetPassword/password=${data.password}`,
    method: 'put',
    data: parameter
  })
}


/**
 * 
 * 菜单管理 
 */
// 菜单管理列表
export function getPermissionTree() {
  return request({
    url: `${SYSTEMURL}/permissions/tree`,
    method: 'get'
  })
}

// 新增菜单管理
export function postPermission(parameter) {
  return request({
    url: `${SYSTEMURL}/permissions`,
    method: 'post',
    data: parameter
  })
}

// 修改菜单管理
export function putPermission(parameter) {
  return request({
    url: `${SYSTEMURL}/permissions`,
    method: 'put',
    data: parameter
  })
}

//详情菜单
export function getPermissionDetail(id) {
  return request({
    url: `${SYSTEMURL}/permissions/${id}`,
    method: 'get',
  })
}
//删除菜单
export function delPermission(id) {
  return request({
    url: `${SYSTEMURL}/permissions/${id}`,
    method: 'delete',
  })
}

/**
 * 组织架构
 */
// 组织管理列表树
export function getOrgTree() {
  return request({
    url: `${SYSTEMURL}/organizations/tree`,
    method: 'get'
  })
}
//列表
export function getOrganizations(data) {
    return request({
        url: `${SYSTEMURL}/organizations`,
        method: 'get',
        params: data
    })
}
//创建
export function postOrganizations(data) {
    return request({
        url: `${SYSTEMURL}/organizations`,
        method: 'post',
        data: data
    })
}
//更新
export function putOrganizations(data) {
    return request({
        url: `${SYSTEMURL}/organizations`,
        method: 'put',
        data: data
    })
}
//删除
export function delOrganizations(id) {
  return request({
    url: `${SYSTEMURL}/organizations/${id}`,
    method: 'delete'
  })
}
//详情
export function getOrganizationDetail(id) {
    return request({
        url: `${SYSTEMURL}/organizations/${id}`,
        method: 'get'
    })
}


/**
 * 
 *租户管理 
 */
// 租户列表
 export function getTenants(pageNum, pageSize, data) {
    return request({
        url: `${SYSTEMURL}/tenants/pageNum=${pageNum}/pageSize=${pageSize}`,
        method:'get',
        params: data    
    })
}

// 组织列表
export function getOrganizationsList(pageNum, pageSize, data) {
    return request({
        url: `${SYSTEMURL}/organizations/pageNum=${pageNum}/pageSize=${pageSize}`,
        method: 'get',
        params: data
    })
}
/**
 * 
 * 数据权限 
 */

// 数据权限列表
export function getDataPermissions(pageNum = 1, pageSize = 10, data) {
  return request({
    url: `${SYSTEMURL}/dataPermissions/pageNum=${pageNum}/pageSize=${pageSize}`,
    method: 'get',
    params: data
  })
}

/**
 * 
 * 通用配置
 */
// 通用配置列表
export function getGeneralConfigs(pageNum, pageSize, data) {
    return request({
        url: `${SYSTEMURL}/generalConfigs/pageNum=${pageNum}/pageSize=${pageSize}`,
        method: 'get',
        params: data
    })
}
// 删除
export function delGeneralConfigs(id) {
    return request({
        url: `${SYSTEMURL}/generalConfigs/${id}`,
        method: 'delete',
    })
}
// 更新
export function putGeneralConfigs(data) {
    return request({
        url: `${SYSTEMURL}/generalConfigs`,
        method: 'put',
        data: data
    })
}
// 新增
export function postGeneralConfigs(data) {
    return request({
        url: `${SYSTEMURL}/generalConfigs`,
        method: 'post',
        data: data
    })
}