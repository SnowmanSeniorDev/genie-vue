const menu = [{
    title: "Dashboard",
    pageName: "side-menu-dashboard",
    icon: "HomeIcon",
    subMenu: [{
      icon: "MonitorIcon",
      title: "Dashboard",
      pageName: "GENIE_DASHBOARD",
      permission: "GENIE_DASHBOARD"
    }]
  },{
    icon: "ClipboardIcon",
    pageName: "side-menu-inbox",
    title: "Invoices",
    subMenu: [{
        icon: "ClipboardIcon",
        title: "Invoices",
        pageName: "GENIE_INVOICE",
        permission: "GENIE_INVOICE"
      }
    ]
  },{
    icon: "KeyIcon",
    pageName: "GENIE_PERMISSION",
    title: "Permissions",
    subMenu: [{
        icon: "KeyIcon",
        title: "Permissions",
        pageName: "GENIE_PERMISSION",
        permission: "GENIE_PERMISSION"
      }
    ]
  },{
    icon: "PackageIcon",
    pageName: "GENIE_COMPANIES",
    title: "Companies",
    subMenu: [{
        icon: "PackageIcon",
        title: "Companies",
        pageName: "GENIE_COMPANIES",
        permission: "GENIE_COMPANIES"
      }
    ]
  },{
    icon: "KeyIcon",
    pageName: "COMPANY_ONBOARD",
    title: "Company Onboarding",
    subMenu: [{
        icon: "KeyIcon",
        title: "Company Onboarding",
        pageName: "COMPANY_ONBOARD",
        permission: "COMPANY_ONBOARD"
      }
    ]
  },{
    icon: "AirplayIcon",
    pageName: "GENIE_COMPANY_PROFILE",
    title: "Company",
    subMenu: [{
        icon: "AirplayIcon",
        title: "Profile",
        pageName: "GENIE_COMPANY_PROFILE",
        permission: "GENIE_COMPANY_PROFILE"
      }
    ]
  },{
    icon: "SettingsIcon",
    pageName: "GENIE_SYSTEM_CONFIG",
    title: "Config",
    subMenu: [{
        icon: "SettingsIcon",
        title: "System Config",
        pageName: "GENIE_SYSTEM_CONFIG",
        permission: "GENIE_SYSTEM_CONFIG"
      }
    ]
  },{
    icon: "UserIcon",
    pageName: "side-menu-layout",
    title: "Users",
    subMenu: [{
        icon: "UserIcon",
        pageName: "GENIE_USERS",
        title: "User Management",
        permission: "GENIE_USERS"
      },{
        icon: "UsersIcon",
        pageName: "GENIE_USERS_ROLES",
        title: "User Group",
        permission: "GENIE_USERS_ROLES"
      },{
        icon: "UserPlusIcon",
        pageName: "GENIE_USERS_ASSIGN_ROLE",
        title: "New Users",
        permission: "GENIE_USERS_ASSIGN_ROLE"
      }
    ]
  },{
    icon: "GridIcon",
    pageName: "GENIE_ECO_SYSTEM",
    title: "Eco System",
    subMenu: [{
        icon: "GlobeIcon",
        pageName: "GENIE_ECO_RELASHIONSHIP",
        title: "Relasionship",
        permission: "GENIE_ECO_SYSTEM"
      },{
        icon: "ApertureIcon",
        pageName: "GENIE_ECO_WORKFLOW",
        title: "Workflow",
        permission: "GENIE_ECO_SYSTEM"
      }
    ]
  }
];

export const custom_menu = (permissions) => {
  console.log("permissions = ", permissions)
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
