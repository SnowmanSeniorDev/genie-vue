const state = () => {
  return {
    darkMode: false,
    menu: [
      {
        icon: "HomeIcon",
        pageName: "side-menu-dashboard",
        title: "Dashboard",
        subMenu: [
          {
            icon: "",
            pageName: "side-menu-dashboard-overview-1",
            title: "Overview 1"
          },
          {
            icon: "",
            pageName: "side-menu-dashboard-overview-2",
            title: "Overview 2"
          }
        ]
      },
      {
        icon: "InboxIcon",
        pageName: "side-menu-inbox",
        title: "Inbox"
      },
      {
        icon: "HardDriveIcon",
        pageName: "side-menu-file-manager",
        title: "File Manager"
      },
      "devider",
      {
        icon: "LayoutIcon",
        pageName: "side-menu-layout",
        title: "Pages",
        subMenu: [
          {
            icon: "",
            pageName: "side-menu-wizards",
            title: "Wizards",
            subMenu: [
              {
                icon: "",
                pageName: "side-menu-wizard-layout-1",
                title: "Layout 1"
              },
              {
                icon: "",
                pageName: "side-menu-wizard-layout-2",
                title: "Layout 2"
              },
              {
                icon: "",
                pageName: "side-menu-wizard-layout-3",
                title: "Layout 3"
              }
            ]
          },
          {
            icon: "",
            pageName: "side-menu-blog",
            title: "Blog",
            subMenu: [
              {
                icon: "",
                pageName: "side-menu-blog-layout-1",
                title: "Layout 1"
              },
              {
                icon: "",
                pageName: "side-menu-blog-layout-2",
                title: "Layout 2"
              },
              {
                icon: "",
                pageName: "side-menu-blog-layout-3",
                title: "Layout 3"
              }
            ]
          }
        ]
      }
    ]
  };
};

export default state;
