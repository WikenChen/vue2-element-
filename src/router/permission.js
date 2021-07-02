// 动态路由处理文件
import Layout from '@/views/layout/index';
// 处理router 公共参数
function handleRouter(element) {
  let { name, keepAlive, icon, routeName, routeUrl, visibleFlag, component, isWord } = element
  
  element.component = 
    (element.parentId === '0' ||element.parentId === null) ? Layout : () => import(`@/views${component.replace(/\s+/g,"")}.vue`);
  element.path = routeUrl
  element.name = routeName
  element.hidden = !visibleFlag
  element.meta = {
    title: name,
    keepAlive: keepAlive,
    icon: icon ? icon : '',
    isWord: isWord
  }
  if(!element.meta.icon) delete element.meta.icon
  return element
}

//递归方法 生成权限菜单 tree 数据
export function generatorRouter(data) {
  data.forEach(element => {
    let parentId = element.parentId
    if (element.parentId === null || element.parentId == '0') {
      element.parentId = '0'
      handleRouter(element)
    } else {
      delete element.redirect // 删除非一级菜单的redirect
      data.forEach(item => {
        if (item.id == parentId) {
          //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
          if (!item.children) {
            item.children = []
          }
          handleRouter(element)
          item.children.push(element)
        }
      })
    }
  })
  data = data.filter(el => el.parentId === '0' || el.parentId === null) //这一步是过滤，按树展开，将多余的数组剔除
  data.push({
    path: '*',
    hidden: true, //不在slider显示
    component: () =>
      import('@/views/404.vue'),
    meta: { keepalive: true },
    name: 'notfound'
  })
  return data
}