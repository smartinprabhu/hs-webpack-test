import pendingOrderImg from "../../../../images/default/icons/externalReport/Rectangle 17282.svg";
import overDueOrderImg from "../../../../images/default/icons/externalReport/Group 59507.svg";
import resolvedOrderImg from "../../../../images/default/icons/externalReport/Group 59508.svg";

export const restroomsOrdersLayouts = [
  {
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    i: "resolved",
    minH: 3,
    moved: false,
    static: true,
  },
  {
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    i: "pending",
    minH: 3,
    moved: false,
    static: true,
  },
  {
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    i: "overdue",
    minH: 3,
    moved: false,
    static: true,
  },
 
  {
    w: 7,
    h: 18,
    x: 2.5,
    y: 0,
    i: "live-data-graph",
    minW: 2,
    minH: 9,
    moved: false,
    static: true,
  },
  // {
  //   w: 5,
  //   h: 12,
  //   x: 0,
  //   y: 41,
  //   i: "energy-head-count",
  //   minW: 2,
  //   minH: 9,
  //   moved: false,
  //   static: true,
  // },
  // {
  //   w: 5,
  //   h: 12,
  //   x: 5,
  //   y: 41,
  //   i: "energy-per-capita",
  //   minW: 2,
  //   minH: 9,
  //   moved: false,
  //   static: true,
  // },
  {
    w: 3,
    h: 11,
    x: 0,
    y: 0,
    i: "vertical-graph",
    minW: 1,
    minH: 3,
    moved: false,
    static: true,
  },
  // {
  //   w: 10,
  //   h: 12,
  //   x: 0,
  //   y: 29,
  //   i: "incommer-loss-consumption",
  //   minW: 2,
  //   minH: 9,
  //   moved: false,
  //   static: true,
  // },
  // {
  //   w: 3,
  //   h: 12,
  //   x: 0,
  //   y: 6,
  //   i: "consumption-details",
  //   minW: 1,
  //   minH: 3,
  //   moved: false,
  //   static: true,
  // },
  // {
  //   w: 7,
  //   h: 12,
  //   x: 3,
  //   y: 6,
  //   i: "consumption-performance",
  //   minW: 2,
  //   minH: 9,
  //   moved: false,
  //   static: true,
  // },
];



export const analyticsDataLayouts = [
  {
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    i: "work-orders",
    minH: 3,
    moved: false,
    static: true,
  },
  {
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    i: "within-sla",
    minH: 3,
    moved: false,
    static: true,
  },
  {
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    i: "after-sla",
    minH: 3,
    moved: false,
    static: true,
  },
  {
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    i: "pending",
    minH: 3,
    moved: false,
    static: true,
  },
  {
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    i: "process",
    minH: 3,
    moved: false,
    static: true,
  },
  {
    w: 2,
    h: 6,
    x: 0,
    y: 0,
    i: "overdue",
    minH: 3,
    moved: false,
    static: true,
  },
  {
    w: 7,
    h: 18,
    x: 2.5,
    y: 0,
    i: "analytics",
    minW: 2,
    minH: 9,
    moved: false,
    static: true,
  },
  // {
  //   w: 10,
  //   h: 12,
  //   x: 0,
  //   y: 29,
  //   i: "incommer-loss-consumption",
  //   minW: 2,
  //   minH: 9,
  //   moved: false,
  //   static: true,
  // },
  // {
  //   w: 3,
  //   h: 12,
  //   x: 0,
  //   y: 6,
  //   i: "consumption-details",
  //   minW: 1,
  //   minH: 3,
  //   moved: false,
  //   static: true,
  // },
  // {
  //   w: 7,
  //   h: 12,
  //   x: 3,
  //   y: 6,
  //   i: "consumption-performance",
  //   minW: 2,
  //   minH: 9,
  //   moved: false,
  //   static: true,
  // },
];

export const ordersData = [
  {
    cardText1: "Total Resolved orders",
    orderCount: "2,780",
    orderIcon: resolvedOrderImg,
    key: "resolved",
  },
  {
    cardText1: "pending orders",
    orderCount: "190",
    orderIcon: pendingOrderImg,
    key: "pending",
  },
  {
    cardText1: "over due orders",
    orderCount: "290",
    orderIcon: overDueOrderImg,
    key: "overdue",
  },
];

export const analyticsData = [
  {
  
    icon: overDueOrderImg,
    text: "Total Work Orders",
    count: "2780",
    key: "work-orders",

  },
  {
  
    icon: overDueOrderImg,
    text: "Completed within SLA",
    count: "2780",
    key: "within-sla",

  },
  {
  
    icon: resolvedOrderImg,
    text: "Completed after SLA",
    count: "2780",
    key: "after-sla",

  },
  {
   
    icon: pendingOrderImg,
    text: "Pending",
    count: "2780",
    key: "pending",

  },
  {
   
    icon: overDueOrderImg,
    text: "On process",
    count: "2780",
    key: "process",

  },
  {
    
    icon: resolvedOrderImg,
    text: "Over due",
    count: "2780",
    key: "overdue",

  },
];
