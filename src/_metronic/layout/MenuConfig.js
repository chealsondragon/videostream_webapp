export default {
  header: {
    self: {},
    items: [
      {
        title: "Profile",
        root: true,
        alignment: "left",
        toggle: "click",
        page: 'profile',
      },
      {
        title: "Channels",
        root: true,
        alignment: "left",
        toggle: "click",
        page: 'channels',
      },
      {
        title: "Links",
        root: true,
        alignment: "left",
        toggle: "click",
        page: 'links'
      },
      {
        title: "Report",
        root: true,
        alignment: "left",
        toggle: "click",
        page: "report",
      }
    ]
  },
  aside: {
    self: {},
    items: [
      { section: 'User' },
      {
        title: "Profile",
        root: true,
        icon: "fa fa-user",
        alignment: "left",
        toggle: "click",
        page: 'profile',
        translate: 'MENU.PROFILE'
      },
      {
        title: "Channels",
        root: true,
        icon: "fa fa-video",
        alignment: "left",
        toggle: "click",
        page: 'channels',
        translate: 'MENU.CHANNELS'
      },
      { section: 'Activities' },
      {
        title: "Links",
        root: true,
        icon: "fa fa-link",
        alignment: "left",
        toggle: "click",
        page: 'links',
        translate: 'MENU.LINKS'
      },
      { section: 'Report' },
      {
        title: "Report",
        root: true,
        icon: "flaticon2-paper",
        alignment: "left",
        toggle: "click",
        page: "report",
        translate: 'MENU.REPORT'
      }
    ]
  }
};
