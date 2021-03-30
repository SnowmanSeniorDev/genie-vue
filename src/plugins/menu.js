const menu = [{
    title: "Dashboard",
    pageName: "side-menu-dashboard",
    icon: "HomeIcon",
    subMenu: [{
      icon: "HomeIcon",
      title: "Dashboard",
      pageName: "side-menu-dashboard",
      permission: "GENIE_DASHBOARD"
    }]
  },{
    icon: "InboxIcon",
    pageName: "side-menu-inbox",
    title: "Invoices",
    subMenu: [{
        icon: "InboxIcon",
        pageName: "side-menu-inbox",
        title: "Upload",
        permission: "GENIE_INVOICE_UPLOAD"
      },{
        icon: "InboxIcon",
        pageName: "side-menu-inbox",
        title: "Pending Action",
        permission: "GENIE_INVOICE_PENDING_ACTION"
      },{
        icon: "InboxIcon",
        pageName: "side-menu-inbox",
        title: "Batch Detail",
        permission: "GENIE_INVOICE_BATCH_DETAIL"
      },{
        icon: "InboxIcon",
        pageName: "side-menu-inbox",
        title: "Admin Fee Report",
        permission: "GENIE_INVOICE_ADMIN_FEE_REPORT"
      },{
        icon: "InboxIcon",
        pageName: "side-menu-inbox",
        title: "Bidding Status",
        permission: "GENIE_INVOICE_BIDDING_STATUS"
      }
    ]
  },{
    icon: "HardDriveIcon",
    pageName: "side-menu-file-manager",
    title: "Onboarding",
    subMenu: [{
      icon: "HardDriveIcon",
      pageName: "side-menu-file-manager",
      title: "Seller",
      permission: "GENIE_ONBOARDING"
    }]
  },{
    icon: "LayoutIcon",
    pageName: "side-menu-file-manager",
    title: "KYC",
    subMenu: [{
        icon: "LayoutIcon",
        pageName: "side-menu-file-manager",
        title: "Know Your Buyers",
        permission: "GENIE_KYC_BUYERS"
      },{
        icon: "LayoutIcon",
        pageName: "side-menu-file-manager",
        title: "Know Your Sellers",
        permission: "GENIE_KYC_SELLERS"
      }
    ]
  },{
    icon: "LayoutIcon",
    pageName: "side-menu-layout",
    title: "Company",
    subMenu: [{
      icon: "LayoutIcon",
      pageName: "side-menu-layout",
      title: "Company",
      permission: "GENIE_COMPANY"
    }]
  },{
    icon: "LayoutIcon",
    pageName: "side-menu-layout",
    title: "Security",
    subMenu: [{
        icon: "LayoutIcon",
        pageName: "users",
        title: "User Management",
        permission: "GENIE_SECURITY_USER_MANAGEMENT"
      },{
        icon: "LayoutIcon",
        pageName: "roles",
        title: "User Group",
        permission: "GENIE_SECURITY_ROLES"
      }
    ]
  },{
    icon: "LayoutIcon",
    pageName: "side-menu-layout",
    title: "Settings",
    subMenu: [{
        icon: "LayoutIcon",
        pageName: "side-menu-layout",
        title: "Email Gateway",
        permission: "GENIE_SETTINGS_EMAIL_GATEWAY"
      },{
        icon: "LayoutIcon",
        pageName: "side-menu-layout",
        title: "Process Term",
        permission: "GENIE_SETTINGS_PROCESS_TERM"
      },{
        icon: "LayoutIcon",
        pageName: "side-menu-layout",
        title: "Payment Count",
        permission: "GENIE_SETTINGS_PAYMENTCOUNT"
      },{
        icon: "LayoutIcon",
        pageName: "side-menu-layout",
        title: "Email Template",
        permission: "GENIE_SETTINGS_EMAILTEMPLATE"
      },{
        icon: "LayoutIcon",
        pageName: "side-menu-layout",
        title: "Currency Master",
        permission: "GENIE_SETTINGS_CURRENCYMASTER"
      }
    ]
  }
];

export const custom_menu = (permissions) => {
  var ret = [] ;
  menu.forEach(iMenu => {
    var nextSubMenu = [] ;
    iMenu['subMenu'].forEach(submenu => {
      permissions.forEach(permission => {
        if ( permission.type === "Menu" && permission.permissionName == submenu['permission'] ){
          nextSubMenu.push(submenu) ;
          return ;
        }
      });
    });
    if( nextSubMenu.length ) {
      iMenu['subMenu'] = nextSubMenu ;
      ret.push(iMenu) ;
    }
  });
  return ret ;
}
