import Main from '@/components/main'
import Blank from '@/components/main/blank.vue'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true,
      notCache: true
    },
    component: () => import('@/view/login/login.vue')
  },

  {
    path: '/',
    name: '_home',
    component: Main,
    meta: {
      title: '首页',
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/home')
      }
    ]
  },

  {
    path: '/SystemSetting',
    name: 'SystemSetting',
    meta: {
      icon: 'md-menu',
      title: '系统设置',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'User/List',
        name: 'UserList',
        component: () => import('@/view/system-setting/user/user-list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '用户列表',
          access: ['AUTH_SUPER_ADMIN', 'AUTH_USER_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'User/Edit/:id',
        name: 'UserEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '用户编辑',
          access: ['AUTH_SUPER_ADMIN', 'AUTH_USER_EDIT_PAGE'],
          notCache: true
        },
        component: () => import('@/view/system-setting/user/user-edit.vue')
      },
      {
        path: 'Role/List',
        name: 'RoleList',
        component: () => import('@/view/system-setting/role/role-list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '角色列表',
          access: ['AUTH_SUPER_ADMIN', 'AUTH_ROLE_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Role/Edit/:id',
        name: 'RoleEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '角色编辑',
          access: ['AUTH_SUPER_ADMIN', 'AUTH_ROLE_EDIT_PAGE'],
          notCache: true
        },
        component: () => import('@/view/system-setting/role/role-edit.vue')
      },
      {
        path: 'Authority/List',
        name: 'AuthorityList',
        component: () => import('@/view/system-setting/authority/authority-list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '权限列表',
          access: ['AUTH_SUPER_ADMIN', 'AUTH_AUTHORITY_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Authority/Edit/:id',
        name: 'AuthorityEdit',
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '权限编辑',
          access: ['AUTH_SUPER_ADMIN', 'AUTH_AUTHORITY_EDIT_PAGE'],
          notCache: true
        },
        component: () => import('@/view/system-setting/authority/authority-edit.vue')
      }
    ]
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      title: '401',
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      title: '500',
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      title: '404',
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
