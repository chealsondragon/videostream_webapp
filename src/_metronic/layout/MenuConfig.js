export default {
  header: {
    self: {},
    items: [
      // {
      //   title: "ParetnSample-1",
      //   root: true,
      //   alignment: "left",
      //   toggle: "click",
      //   // page: 'channels',
      //   submenu: [
      //     {
      //       title: "Child1",
      //       icon: "flaticon2-expand",
      //       page: "builder"
      //     },
      //     {
      //       title: "Child2",
      //       bullet: "dot",
      //       icon: "flaticon2-warning",
      //       submenu: [
      //         {
      //           title: "Child2-1",
      //           page: "error/error-v1"
      //         },
      //         {
      //           title: "Child2-2",
      //           page: "error/error-v2"
      //         },
      //         {
      //           title: "Error 3",
      //           page: "error/error-v3"
      //         },
      //         {
      //           title: "Error 4",
      //           page: "error/error-v4"
      //         },
      //         {
      //           title: "Error 5",
      //           page: "error/error-v5"
      //         },
      //         {
      //           title: "Error 6",
      //           page: "error/error-v6"
      //         }
      //       ]
      //     }
      //   ]
      // },
      {
        title: "Users",
        root: true,
        alignment: "left",
        toggle: "click",
        page: 'users',
        translate: 'MENU.USERS'
      },
      { section: 'Data' },
      {
        title: "Category",
        root: true,
        alignment: "left",
        toggle: "click",
        page: 'categories',
        translate: 'MENU.CATEGORY'
      },
      {
        title: "Video",
        root: true,
        alignment: "left",
        toggle: "click",
        page: "videos",
        translate: 'MENU.VIDEO'
      },
      {
        title: "Report",
        alignment: "center",
        root: true,
        toggle: "click",
        submenu: [
          {
            title: "Per Video",
            root: true,
            alignment: "left",
            toggle: "click",
            page: "stats_video",
            translate: 'MENU.STATS_VIDEO'
          },
          {
            title: "Per User",
            root: true,
            alignment: "left",
            toggle: "click",
            page: "stats_user",
            translate: 'MENU.STATS_USER'
          },
          {
            title: "Per Payment",
            root: true,
            alignment: "left",
            toggle: "click",
            page: "payment",
            translate: 'MENU.PAYMENT'
          }
        ]
      },
    ]
  },
  aside: {
    self: {},
    items: [
      {
        title: "Users",
        root: true,
        icon: "fa fa-users",
        alignment: "left",
        toggle: "click",
        page: 'users',
        translate: 'MENU.USERS'
      },
      { section: 'Data' },
      {
        title: "Category",
        root: true,
        icon: "fa fa-list",
        alignment: "left",
        toggle: "click",
        page: 'categories',
        translate: 'MENU.CATEGORY'
      },
      {
        title: "Video",
        root: true,
        icon: "fa fa-video",
        alignment: "left",
        toggle: "click",
        page: "videos",
        translate: 'MENU.VIDEO'
      },
      { section: 'Report' },
      {
        title: "Per Video",
        root: true,
        icon: "fas fa-file",
        alignment: "left",
        toggle: "click",
        page: "stats_video",
        translate: 'MENU.STATS_VIDEO'
      },
      {
        title: "Per User",
        root: true,
        icon: "fa fa-file",
        alignment: "left",
        toggle: "click",
        page: "stats_user",
        translate: 'MENU.STATS_USER'
      },
      {
        title: "Per Payment",
        root: true,
        icon: "fa fa-money-bill",
        alignment: "left",
        toggle: "click",
        page: "payment",
        translate: 'MENU.PAYMENT'
      }
    ]
  }
};
