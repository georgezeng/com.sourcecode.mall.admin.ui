import Main from '@/components/main'

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
    path: '/Login',
    name: 'Login',
    meta: {
      title: '登录',
      hideInMenu: true,
      notCache: true
    },
    component: () => import('@/view/login/login.vue')
  },

  {
    path: '/Register',
    name: 'Register',
    meta: {
      title: '注册',
      hideInMenu: true,
      notCache: true
    },
    component: () => import('@/view/register/register.vue')
  },

  {
    path: '/ForgetPassword',
    name: 'ForgetPassword',
    meta: {
      title: '忘记密码',
      hideInMenu: true,
      notCache: true
    },
    component: () => import('@/view/forget-password/forget-password-card.vue')
  },

  {
    path: '/',
    // name: '_home',
    component: Main,
    meta: {
      title: '首页',
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '',
        name: 'Home',
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
    path: '/Merchant',
    name: 'MerchantManage',
    meta: {
      icon: 'md-menu',
      title: '商家中心',
      notCache: true,
      access: [
        'AUTH_MERCHANT_USER_PROFILE_PAGE',
        'AUTH_MERCHANT_VERIFICATION_INDEX_PAGE',
        'AUTH_MERCHANT_SHOP_APPLICATION_INDEX_PAGE',
        'AUTH_MERCHANT_SUB_ACCOUNT_LIST_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'User/Profile',
        name: 'MerchantUserProfile',
        component: () => import('@/view/merchant/user/profile.vue'),
        meta: {
          icon: 'md-funnel',
          title: '账号信息',
          access: ['AUTH_MERCHANT_USER_PROFILE_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Shop/Application/Index',
        name: 'MerchantShopApplicationIndex',
        component: () => import('@/view/merchant/shop/application/index.vue'),
        meta: {
          icon: 'md-funnel',
          title: '店铺申请',
          access: ['AUTH_MERCHANT_SHOP_APPLICATION_INDEX_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Shop/Application/Apply',
        name: 'MerchantShopApplicationApply',
        component: () => import('@/view/merchant/shop/application/apply.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '店铺申请',
          access: ['AUTH_MERCHANT_SHOP_APPLICATION_APPLY_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Shop/Application/CommitSuccess',
        name: 'MerchantShopApplicationCommitSuccess',
        component: () => import('@/view/merchant/shop/application/commit-success.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '店铺申请-提交成功',
          access: ['AUTH_MERCHANT_SHOP_APPLICATION_COMMIT_SUCCESS_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Shop/Application/Passed',
        name: 'MerchantShopApplicationPassed',
        component: () => import('@/view/merchant/shop/application/passed.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '店铺申请-审核通过',
          access: ['AUTH_MERCHANT_SHOP_APPLICATION_PASSED_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Shop/Application/UnPassed',
        name: 'MerchantShopApplicationUnPassed',
        component: () => import('@/view/merchant/shop/application/unpassed.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '店铺申请-审核不通过',
          access: ['AUTH_MERCHANT_SHOP_APPLICATION_UNPASSED_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Shop/Application/NoPermit',
        name: 'MerchantShopApplicationNoPermit',
        component: () => import('@/view/merchant/shop/application/nopermit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '店铺申请',
          access: ['AUTH_MERCHANT_SHOP_APPLICATION_NOPERMIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Shop/Application/Detail',
        name: 'MerchantShopApplicationDetail',
        component: () => import('@/view/merchant/shop/application/detail.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '店铺申请-提交详情',
          access: ['AUTH_MERCHANT_SHOP_APPLICATION_DETAIL_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Shop/Application/Edit',
        name: 'MerchantShopApplicationEdit',
        component: () => import('@/view/merchant/shop/application/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '店铺申请-编辑',
          access: ['AUTH_MERCHANT_SHOP_APPLICATION_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Verification/Index',
        name: 'MerchantVerificationIndex',
        component: () => import('@/view/merchant/verification/index.vue'),
        meta: {
          icon: 'md-funnel',
          title: '实名认证',
          access: ['AUTH_MERCHANT_VERIFICATION_INDEX_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Verification/Verify',
        name: 'MerchantVerificationVerify',
        component: () => import('@/view/merchant/verification/verify.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '实名认证',
          access: ['AUTH_MERCHANT_VERIFICATION_VERIFY_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Verification/CommitSuccess',
        name: 'MerchantVerificationCommitSuccess',
        component: () => import('@/view/merchant/verification/commit-success.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '实名认证-提交成功',
          access: ['AUTH_MERCHANT_VERIFICATION_COMMIT_SUCCESS_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Verification/UnPassed',
        name: 'MerchantVerificationUnPassed',
        component: () => import('@/view/merchant/verification/unpassed.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '实名认证-审核失败',
          access: ['AUTH_MERCHANT_VERIFICATION_UNPASSED_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Verification/Edit',
        name: 'MerchantVerificationEdit',
        component: () => import('@/view/merchant/verification/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '实名认证-编辑',
          access: ['AUTH_MERCHANT_VERIFICATION_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'SubAccount/List',
        name: 'MerchantSubAccountList',
        component: () => import('@/view/merchant/sub-account/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '子账号管理',
          access: ['AUTH_MERCHANT_SUB_ACCOUNT_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'SubAccount/Edit/:id',
        name: 'MerchantSubAccountEdit',
        component: () => import('@/view/merchant/sub-account/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '账号编辑',
          access: ['AUTH_MERCHANT_SUB_ACCOUNT_EDIT_PAGE'],
          notCache: true
        }
      }
    ]
  },

  {
    path: '/Client',
    name: 'ClientManage',
    meta: {
      icon: 'md-menu',
      title: '会员管理',
      notCache: true,
      access: [
        'AUTH_CLIENT_IDENTITY_LIST_PAGE',
        'AUTH_CLIENT_USER_LIST_PAGE',
        'AUTH_CLIENT_POINTS_LIST_PAGE',
        'AUTH_CLIENT_LEVEL_SETTING_LIST_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'User/List',
        name: 'ClientUserList',
        component: () => import('@/view/client/user/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '会员列表',
          access: ['AUTH_CLIENT_USER_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'User/SubList/:ids',
        name: 'ClientUserSubList',
        component: () => import('@/view/client/user/sub-list.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '下级会员列表',
          access: ['AUTH_CLIENT_USER_SUBLIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'User/Points/List',
        name: 'ClientPointsList',
        component: () => import('@/view/client/points/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '积分列表',
          access: ['AUTH_CLIENT_POINTS_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Points/Journals/:ids',
        name: 'ClientPointsJournalList',
        component: () => import('@/view/client/points/journal-list.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '积分明细列表',
          access: ['AUTH_CLIENT_POINTS_JOURNAL_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'User/Edit/:from/:ids',
        name: 'ClientUserEdit',
        component: () => import('@/view/client/user/edit.vue'),
        meta: {
          icon: 'md-funnel',
          title: '会员信息',
          hideInMenu: true,
          access: ['AUTH_CLIENT_USER_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Level/Setting/List',
        name: 'ClientLevelSettingList',
        component: () => import('@/view/client/level/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '会员等级',
          access: ['AUTH_CLIENT_LEVEL_SETTING_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Level/Setting/Edit/:id',
        name: 'ClientLevelSettingEdit',
        component: () => import('@/view/client/level/edit.vue'),
        meta: {
          icon: 'md-funnel',
          title: '编辑会员等级',
          hideInMenu: true,
          access: ['AUTH_CLIENT_LEVEL_SETTING_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Identity/List',
        name: 'ClientIdentityList',
        component: () => import('@/view/client/identity/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '会员认证',
          access: ['AUTH_CLIENT_IDENTITY_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Identity/Edit/:id',
        name: 'ClientIdentityEdit',
        component: () => import('@/view/client/identity/edit.vue'),
        meta: {
          icon: 'md-funnel',
          title: '会员认证审核',
          hideInMenu: true,
          access: ['AUTH_CLIENT_IDENTITY_EDIT_PAGE'],
          notCache: true
        }
      }

    ]
  },

  {
    path: '/Goods',
    name: 'GoodsManage',
    meta: {
      icon: 'md-menu',
      title: '商品管理',
      notCache: true,
      access: [
        'AUTH_GOODS_CATEGORY_LIST_PAGE',
        'AUTH_GOODS_SPECIFICATION_GROUP_INDEX_PAGE',
        'AUTH_GOODS_SPECIFICATION_DEFINITION_INDEX_PAGE',
        'AUTH_GOODS_ITEM_INDEX_PAGE',
        'AUTH_GOODS_BRAND_LIST_PAGE',
        'AUTH_GOODS_ITEM_LIST_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'NoPermit/:from/:type',
        name: 'GoodsNoPermit',
        component: () => import('@/view/goods/components/nopermit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '商品管理',
          access: ['AUTH_GOODS_NOPERMIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Item/Index',
        name: 'GoodsItemIndex',
        component: () => import('@/view/goods/item/index.vue'),
        meta: {
          icon: 'md-funnel',
          title: '发布商品',
          access: ['AUTH_GOODS_ITEM_INDEX_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Item/List/',
        name: 'GoodsItemList',
        component: () => import('@/view/goods/item/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '商品列表',
          access: ['AUTH_GOODS_ITEM_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Item/Edit/:id',
        name: 'GoodsItemEdit',
        component: () => import('@/view/goods/item/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '商品编辑',
          access: ['AUTH_GOODS_ITEM_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Brand/List/',
        name: 'GoodsBrandList',
        component: () => import('@/view/goods/brand/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '商品品牌',
          access: ['AUTH_GOODS_BRAND_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Brand/Edit/:id',
        name: 'GoodsBrandEdit',
        component: () => import('@/view/goods/brand/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '商品品牌编辑',
          access: ['AUTH_GOODS_BRAND_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Category/List/',
        name: 'GoodsCategoryList',
        component: () => import('@/view/goods/category/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '商品分类',
          access: ['AUTH_GOODS_CATEGORY_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Recommend/List/:id',
        name: 'GoodsRecommendList',
        component: () => import('@/view/goods/recommend/list.vue'),
        meta: {
          title: '商品推荐',
          access: ['AUTH_GOODS_RECOMMEND_CATEGORY_LIST_PAGE'],
          notCache: true,
          hideInMenu: true
        }
      },
      {
        path: 'Recommend/edit/:id',
        name: 'GoodsRecommendEdit',
        component: () => import('@/view/goods/recommend/edit.vue'),
        meta: {
          title: '推荐编辑',
          access: ['AUTH_GOODS_RECOMMEND_CATEGORY_EDIT_PAGE'],
          notCache: true,
          hideInMenu: true
        }
      },
      {
        path: 'Recommend/add',
        name: 'GoodsRecommendAdd',
        component: () => import('@/view/goods/recommend/edit.vue'),
        meta: {
          title: '新增推荐',
          access: ['AUTH_GOODS_RECOMMEND_CATEGORY_EDIT_PAGE'],
          notCache: true,
          hideInMenu: true
        }
      },
      {
        path: 'Category/Edit/:id',
        name: 'GoodsCategoryEdit',
        component: () => import('@/view/goods/category/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '商品分类编辑',
          access: ['AUTH_GOODS_CATEGORY_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Specification/Group/Index',
        name: 'GoodsSpecificationGroupIndex',
        component: () => import('@/view/goods/specification-group/index.vue'),
        meta: {
          icon: 'md-funnel',
          title: '商品类型',
          access: ['AUTH_GOODS_SPECIFICATION_GROUP_INDEX_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Specification/Group/List/:ids',
        name: 'GoodsSpecificationGroupList',
        component: () => import('@/view/goods/specification-group/list.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '商品类型',
          access: ['AUTH_GOODS_SPECIFICATION_GROUP_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Specification/Group/Edit/:ids',
        name: 'GoodsSpecificationGroupEdit',
        component: () => import('@/view/goods/specification-group/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '商品类型编辑',
          access: ['AUTH_GOODS_SPECIFICATION_GROUP_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Specification/Definition/Index',
        name: 'GoodsSpecificationDefinitionIndex',
        component: () => import('@/view/goods/specification-definition/index.vue'),
        meta: {
          icon: 'md-funnel',
          title: '商品规格',
          access: ['AUTH_GOODS_SPECIFICATION_DEFINITION_INDEX_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Specification/Definition/List/:ids',
        name: 'GoodsSpecificationDefinitionList',
        component: () => import('@/view/goods/specification-definition/list.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '商品规格',
          access: ['AUTH_GOODS_SPECIFICATION_DEFINITION_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Specification/Definition/Edit/:ids',
        name: 'GoodsSpecificationDefinitionEdit',
        component: () => import('@/view/goods/specification-definition/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '商品规格编辑',
          access: ['AUTH_GOODS_SPECIFICATION_DEFINITION_EDIT_PAGE'],
          notCache: true
        }
      }
    ]
  },

  {
    path: '/Order',
    name: 'OrderManage',
    meta: {
      icon: 'md-menu',
      title: '订单管理',
      notCache: true,
      access: [
        'AUTH_ORDER_LIST_PAGE',
        'AUTH_ORDER_REFUND_LIST_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'List',
        name: 'OrderList',
        component: () => import('@/view/order/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '订单列表',
          access: ['AUTH_ORDER_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Refund/List',
        name: 'OrderRefundList',
        component: () => import('@/view/order/refund-list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '退款列表',
          access: ['AUTH_ORDER_REFUND_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Express/:id',
        name: 'OrderExpress',
        component: () => import('@/view/order/express.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '物流信息编辑',
          access: ['AUTH_ORDER_EXPRESS_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Edit/:from/:id',
        name: 'OrderEdit',
        component: () => import('@/view/order/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '订单详情',
          access: ['AUTH_ORDER_EDIT_PAGE'],
          notCache: true
        }
      }
    ]
  },

  {
    path: '/AfterSale',
    name: 'AfterSaleManage',
    meta: {
      icon: 'md-menu',
      title: '售后管理',
      notCache: true,
      access: [
        'AUTH_AFTERSALE_REFUND_ONLY_LIST_PAGE',
        'AUTH_AFTERSALE_SALES_RETURN_LIST_PAGE',
        'AUTH_AFTERSALE_CHANGE_LIST_PAGE',
        'AUTH_GOODS_ITEM_EVALUATION_LIST_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'RefundOnly/List',
        name: 'AfterSaleRefundOnlyList',
        component: () => import('@/view/aftersale/refund/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '仅退款列表',
          access: ['AUTH_AFTERSALE_REFUND_ONLY_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'SalesReturn/List',
        name: 'AfterSaleSalesReturnList',
        component: () => import('@/view/aftersale/return/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: ' 退货退款列表',
          access: ['AUTH_AFTERSALE_SALES_RETURN_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Change/List',
        name: 'AfterSaleChangeList',
        component: () => import('@/view/aftersale/change/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '换货列表',
          access: ['AUTH_AFTERSALE_CHANGE_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'RefundOnly/Detail/:id',
        name: 'AfterSaleRefundOnlyDetail',
        component: () => import('@/view/aftersale/refund/detail.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '仅退款详情',
          access: ['AUTH_AFTERSALE_REFUND_ONLY_DETAIL_PAGE'],
          notCache: true
        }
      },
      {
        path: 'SalesReturn/Detail/:id',
        name: 'AfterSaleSalesReturnDetail',
        component: () => import('@/view/aftersale/return/detail.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '退货退款详情',
          access: ['AUTH_AFTERSALE_SALES_RETURN_DETAIL_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Change/Detail/:id',
        name: 'AfterSaleChangeDetail',
        component: () => import('@/view/aftersale/change/detail.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '换货详情',
          access: ['AUTH_AFTERSALE_CHANGE_DETAIL_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Evaluation/List',
        name: 'EvaluationList',
        component: () => import('@/view/aftersale/evaluation/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '评价列表',
          access: ['AUTH_GOODS_ITEM_EVALUATION_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Evaluation/Edit/:id',
        name: 'EvaluationEdit',
        component: () => import('@/view/aftersale/evaluation/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '评价编辑',
          access: ['AUTH_GOODS_ITEM_EVALUATION_EDIT_PAGE'],
          notCache: true
        }
      }
    ]
  },

  {
    path: '/Coupon',
    name: 'CouponManage',
    meta: {
      icon: 'md-menu',
      title: '优惠券管理',
      notCache: true,
      access: [
        'AUTH_CASH_COUPON_SETTING_LIST_PAGE',
        'AUTH_CASH_COUPON_ORDER_LIMITED_SETTING_LIST_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'Cash/Setting/List',
        name: 'CashCouponSettingList',
        component: () => import('@/view/coupon/cash/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '现金券列表',
          access: ['AUTH_CASH_COUPON_SETTING_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Cash/OrderLimited/Setting/List',
        name: 'CashCouponOrderLimitedSettingList',
        component: () => import('@/view/coupon/cash/order-limited-list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '限额配置',
          access: ['AUTH_CASH_COUPON_ORDER_LIMITED_SETTING_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Cash/Setting/Edit/:id',
        name: 'CashCouponSettingEdit',
        component: () => import('@/view/coupon/cash/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: ' 现金券编辑',
          access: ['AUTH_CASH_COUPON_SETTING_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Cash/OrderLimited/Setting/Edit/:id',
        name: 'CashCouponOrderLimitedSettingEdit',
        component: () => import('@/view/coupon/cash/order-limited-edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: ' 限额编辑',
          access: ['AUTH_CASH_COUPON_ORDER_LIMITED_SETTING_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Client/List/:type/:id',
        name: 'CouponClientList',
        component: () => import('@/view/coupon/common/client-list.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '用户领券列表',
          access: ['AUTH_COUPON_CLIENT_LIST_PAGE'],
          notCache: true
        }
      }
    ]
  },

  {
    path: '/Promotion',
    name: 'PromotionManage',
    meta: {
      icon: 'md-menu',
      title: '促销管理',
      notCache: true,
      access: [
        'AUTH_CLIENT_ACTIVITY_EVENT_LIST_PAGE',
        'AUTH_CLIENT_POINTS_SETTING_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'Client/ActivityEvent/List',
        name: 'ClientActivityEventList',
        component: () => import('@/view/promotion/client-activity/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '活动日配置',
          access: ['AUTH_CLIENT_ACTIVITY_EVENT_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Client/ActivityEvent/Edit/:id',
        name: 'ClientActivityEventEdit',
        component: () => import('@/view/promotion/client-activity/edit.vue'),
        meta: {
          icon: 'md-funnel',
          title: '编辑活动日',
          hideInMenu: true,
          access: ['AUTH_CLIENT_ACTIVITY_EVENT_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Client/Points/Setting',
        name: 'ClientPointsSetting',
        component: () => import('@/view/promotion/client-points.vue'),
        meta: {
          icon: 'md-funnel',
          title: '积分奖励',
          access: ['AUTH_CLIENT_POINTS_SETTING_PAGE'],
          notCache: true
        }
      }
    ]
  },

  {
    path: '/Article',
    name: 'ArticleManage',
    meta: {
      icon: 'md-menu',
      title: '文章管理',
      notCache: true,
      access: [
        'AUTH_ARTICLE_CATEGORY_LIST_PAGE',
        'AUTH_ARTICLE_LIST_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'Category/List',
        name: 'ArticleCategoryList',
        component: () => import('@/view/article/category/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '文章分类',
          access: ['AUTH_ARTICLE_CATEGORY_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Category/Edit/:id',
        name: 'ArticleCategoryEdit',
        component: () => import('@/view/article/category/edit.vue'),
        meta: {
          icon: 'md-funnel',
          title: '编辑文章分类',
          hideInMenu: true,
          access: ['AUTH_ARTICLE_CATEGORY_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'List',
        name: 'ArticleList',
        component: () => import('@/view/article/list/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '文章列表',
          access: ['AUTH_ARTICLE_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Edit/:id',
        name: 'ArticleEdit',
        component: () => import('@/view/article/list/edit.vue'),
        meta: {
          icon: 'md-funnel',
          title: '编辑文章',
          hideInMenu: true,
          access: ['AUTH_ARTICLE_EDIT_PAGE'],
          notCache: true
        }
      }
    ]
  },

  {
    path: '/Setting',
    name: 'SettingManage',
    meta: {
      icon: 'md-menu',
      title: '配置管理',
      notCache: true,
      access: [
        'AUTH_ADVERTISEMENT_SETTING_LIST_PAGE',
        'AUTH_SITE_SETTING_PAGE',
        'AUTH_COUPON_SETTING_PAGE',
        'AUTH_WECHAT_SETTING_PAGE',
        'AUTH_INVOICE_SETTING_LIST_PAGE',
        // 'AUTH_AFTERSALE_RETURN_ADDRESS_PAGE',
        'AUTH_ALIPAY_SETTING_PAGE',
        'AUTH_AFTERSALE_REASON_SETTING_LIST_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'Advertisement/List',
        name: 'AdvertisementSettingList',
        component: () => import('@/view/advertisement/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '广告位配置',
          access: ['AUTH_ADVERTISEMENT_SETTING_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Advertisement/Edit/:id',
        name: 'AdvertisementSettingEdit',
        component: () => import('@/view/advertisement/edit.vue'),
        meta: {
          icon: 'md-funnel',
          title: '编辑广告位',
          hideInMenu: true,
          access: ['AUTH_ADVERTISEMENT_SETTING_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Site',
        name: 'SiteSetting',
        component: () => import('@/view/setting/site.vue'),
        meta: {
          icon: 'md-funnel',
          title: '站点配置',
          access: ['AUTH_SITE_SETTING_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Wechat',
        name: 'WechatSetting',
        component: () => import('@/view/setting/wechat.vue'),
        meta: {
          icon: 'md-funnel',
          title: '微信配置',
          access: ['AUTH_WECHAT_SETTING_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Alipay',
        name: 'AlipaySetting',
        component: () => import('@/view/setting/alipay.vue'),
        meta: {
          icon: 'md-funnel',
          title: '支付宝配置',
          access: ['AUTH_ALIPAY_SETTING_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Invoice/List',
        name: 'InvoiceSettingList',
        component: () => import('@/view/setting/invoice/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '发票配置',
          access: ['AUTH_INVOICE_SETTING_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'Invoice/Edit/:id',
        name: 'InvoiceSettingEdit',
        component: () => import('@/view/setting/invoice/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '编辑发票配置',
          access: ['AUTH_INVOICE_SETTING_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'AfterSale/Reason/List',
        name: 'AfterSaleReasonSettingList',
        component: () => import('@/view/setting/aftersale/reason/list.vue'),
        meta: {
          icon: 'md-funnel',
          title: '售后原因配置',
          access: ['AUTH_AFTERSALE_REASON_SETTING_LIST_PAGE'],
          notCache: true
        }
      },
      {
        path: 'AfterSale/Reason/Edit/:id',
        name: 'AfterSaleReasonSettingEdit',
        component: () => import('@/view/setting/aftersale/reason/edit.vue'),
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '编辑售后原因',
          access: ['AUTH_AFTERSALE_REASON_SETTING_EDIT_PAGE'],
          notCache: true
        }
      },
      {
        path: 'AfterSale/ReturnAddress',
        name: 'AfterSaleReturnAddress',
        component: () => import('@/view/setting/aftersale/return-address.vue'),
        meta: {
          icon: 'md-funnel',
          title: '回寄地址配置',
          access: ['AUTH_AFTERSALE_RETURN_ADDRESS_PAGE'],
          notCache: true
        }
      }
    ]
  },

  {
    path: '/SystemSetting',
    name: 'SystemSetting',
    meta: {
      icon: 'md-menu',
      title: '系统设置',
      notCache: true,
      access: [
        'AUTH_SUPER_ADMIN',
        'AUTH_USER_LIST_PAGE',
        'AUTH_AUTHORITY_LIST_PAGE',
        'AUTH_ROLE_LIST_PAGE'
      ]
    },
    component: Main,
    children: [
      {
        path: 'User/List',
        name: 'UserList',
        component: () => import('@/view/system/user/list.vue'),
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
        component: () => import('@/view/system/user/edit.vue')
      },
      {
        path: 'Role/List',
        name: 'RoleList',
        component: () => import('@/view/system/role/list.vue'),
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
        component: () => import('@/view/system/role/edit.vue')
      },
      {
        path: 'Authority/List',
        name: 'AuthorityList',
        component: () => import('@/view/system/authority/list.vue'),
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
        component: () => import('@/view/system/authority/edit.vue')
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
