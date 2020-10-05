import URL from "../../app/helpers/url";

export default {
  header: {
    self: {},
    items: [
      {
        title: "Users",
        root: true,
        alignment: "left",
        toggle: "click",
        page: 'users',
      },
      { section: 'Data' },
      {
        title: "Category",
        root: true,
        alignment: "left",
        toggle: "click",
        page: 'categories',
      },
      {
        title: "Video",
        root: true,
        alignment: "left",
        toggle: "click",
        page: "video",
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
          },
          {
            title: "Per User",
            root: true,
            alignment: "left",
            toggle: "click",
            page: "stats_user",
          },
          {
            title: "Per Payment",
            root: true,
            alignment: "left",
            toggle: "click",
            page: "payment",
          }
        ]
      },
    ]
  },
  aside: {
    self: {},
    items: [
      { section: 'Account' },
      {
        title: "Membership Plan",
        root: true,
        icon: "fa fa-user-plus",
        alignment: "left",
        toggle: "click",
        page: URL.PLAN(),
      },
      {
        title: "Profile Type",
        root: true,
        icon: "fa fa-user",
        alignment: "left",
        toggle: "click",
        page: URL.PROFILE_TYPE(),
      },
      {
        title: "User & Profile",
        root: true,
        icon: "fa fa-users",
        alignment: "left",
        toggle: "click",
        page: URL.USERS(),
      },
      { section: 'VIDEO CONFIGURATION' },
      {
        title: "Language",
        root: true,
        icon: "fa fa-language",
        alignment: "left",
        toggle: "click",
        page: URL.LANG(),
      },
      {
        title: "Serie Type",
        root: true,
        icon: "fa fa-list",
        alignment: "left",
        toggle: "click",
        page: URL.SERIE_TYPE(),
      },
      {
        title: "Video Category",
        root: true,
        icon: "fa fa-tag",
        alignment: "left",
        toggle: "click",
        page: URL.CATEGORY(),
      },
      { section: 'DATA' },
      {
        title: "Upload Video",
        root: true,
        icon: "fa fa-video",
        alignment: "left",
        toggle: "click",
        page: URL.LIST_VIDEO(),
      },
      { section: 'Report' },
      {
        title: "Per Video",
        root: true,
        icon: "fas fa-file",
        alignment: "left",
        toggle: "click",
        page: URL.STATS_VIDEO(),
      },
      {
        title: "Per User",
        root: true,
        icon: "fa fa-file",
        alignment: "left",
        toggle: "click",
        page: URL.STATS_USER(),
      },
      {
        title: "Per Payment",
        root: true,
        icon: "fa fa-money-bill",
        alignment: "left",
        toggle: "click",
        page: URL.STATS_PAYMENT(),
      }
    ]
  }
};
