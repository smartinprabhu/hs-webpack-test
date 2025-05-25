import React from "react";

import { useSelector, useDispatch } from "react-redux";

import ReactFlow, {
  addEdge,
  Controls,
  MarkerType,
  useEdgesState,
  useNodesState,
} from "react-flow-renderer";

import { getActiveTab, getHeaderTabs, getSequencedMenuItems, getTabs } from "../util/appUtils";

import CustomNode from "../enery/customNode";
import restRoomsNav from './navbar/navlist.json'
import { updateHeaderData } from "../core/header/actions";

const nodeTypes = {
  custom: CustomNode,
};

const floorOneNodes = [
  {
    id: "1",
    type: "custom",
    data: {
      text: "Company",
      imageUrl:
        "https://res.cloudinary.com/dp6envw5o/image/upload/v1678345927/Group_29506_cdgdk8.svg",
      handlers: [
        {
          handle: {
            className: "node",
            type: "source",
            handleId: "a",
            position: "bottom",
          },
        },
      ],
      link: "/energy",
    },
    position: {
      x: -1395.6826382740562,
      y: -1138.651118804467,
    },
    style: {
      width: 100,
      height: 80,
      border: "1px solid #707070",
      borderRadius: 10,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    width: 100,
    height: 80,
  },
  {
    id: "2",
    type: "custom",
    data: {
      text: "Site",
      imageUrl:
        "https://res.cloudinary.com/dp6envw5o/image/upload/v1678346212/Group_29894_hclp2n.svg",
      handlers: [
        {
          handle: {
            className: "node",
            type: "target",
            handleId: "b",
            position: "top",
          },
        },
        {
          handle: {
            className: "node",
            type: "source",
            handleId: "c",
            position: "bottom",
          },
        },
      ],
    },
    position: {
      x: -1395.0139384390516,
      y: -1029.7089945577964,
    },
    style: {
      width: 100,
      height: 80,
      border: "1px solid #707070",
      borderRadius: 8,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    width: 100,
    height: 80,
  },
  {
    id: "3",
    type: "custom",
    data: {
      text: "Tower",
      imageUrl:
        "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354377/Group_29897_bugauw.svg",
      handlers: [
        {
          handle: {
            className: "node",
            type: "target",
            handleId: "d",
            position: "top",
          },
        },
        {
          handle: {
            className: "node",
            type: "source",
            handleId: "e",
            position: "bottom",
          },
        },
      ],
    },
    position: {
      x: -1395.8436965160586,
      y: -920.3606199586854,
    },
    style: {
      width: 100,
      height: 80,
      border: "1px solid #707070",
      borderRadius: 8,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    width: 100,
    height: 80,
  },
  {
    id: "r4",
    type: "custom",
    data: {
      link: "/restrooms-sld-overview?r4",
      text: "Floor 1",
      imageUrl:
        "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      handlers: [
        {
          handle: {
            className: "node",
            type: "target",
            handleId: "d",
            position: "top",
          },
        },

        {
          handle: {
            className: "node",
            type: "source",
            handleId: "e",
            position: "bottom",
            style: {
              left: 35,
            },
          },
        },
        {
          handle: {
            className: "node",
            type: "source",
            handleId: "f",
            position: "bottom",
            style: {
              left: 65,
            },
          },
        },
      ],
    },
    position: {
      x: -1693.3436965160586,
      y: -788.3606199586854,
    },
    style: {
      width: 100,
      height: 80,
      border: "1px solid #707070",
      borderRadius: 8,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    width: 100,
    height: 80,
  },
  {
    id: "r5",
    type: "custom",
    data: {
      link: "/restrooms-sld-overview?r5",
      text: "Floor 2",
      imageUrl:
        "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      handlers: [
        {
          handle: {
            className: "node",
            type: "target",
            handleId: "h",
            position: "top",
          },
        },

        {
          handle: {
            className: "node",
            type: "source",
            handleId: "j",
            position: "bottom",
            style: {
              left: 35,
            },
          },
        },
        {
          handle: {
            className: "node",
            type: "source",
            handleId: "k",
            position: "bottom",
            style: {
              left: 65,
            },
          },
        },
      ],
    },
    position: {
      x: -1495.8436965160586,
      y: -788.3356199586851,
    },
    style: {
      width: 100,
      height: 80,
      border: "1px solid #707070",
      borderRadius: 8,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    width: 100,
    height: 80,
  },
  {
    id: "r6",
    type: "custom",
    data: {
      link: "/restrooms-sld-overview?r6",
      text: "Floor 3",
      imageUrl:
        "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      handlers: [
        {
          handle: {
            className: "node",
            type: "target",
            handleId: "h",
            position: "top",
          },
        },

        {
          handle: {
            className: "node",
            type: "source",
            handleId: "j",
            position: "bottom",
            style: {
              left: 35,
            },
          },
        },
        {
          handle: {
            className: "node",
            type: "source",
            handleId: "k",
            position: "bottom",
            style: {
              left: 65,
            },
          },
        },
      ],
    },
    position: {
      x: -1295.8436965160586,
      y: -788.3356199586851,
    },
    style: {
      width: 100,
      height: 80,
      border: "1px solid #707070",
      borderRadius: 8,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    width: 100,
    height: 80,
  },
  {
    id: "r7",
    type: "custom",
    data: {
      link: "/restrooms-sld-overview?r7",
      text: "Floor 4",
      imageUrl:
        "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      handlers: [
        {
          handle: {
            className: "node",
            type: "target",
            handleId: "h",
            position: "top",
          },
        },

        {
          handle: {
            className: "node",
            type: "source",
            handleId: "j",
            position: "bottom",
            style: {
              left: 35,
            },
          },
        },
        {
          handle: {
            className: "node",
            type: "source",
            handleId: "k",
            position: "bottom",
            style: {
              left: 65,
            },
          },
        },
      ],
    },
    position: {
      x: -1095.8436965160586,
      y: -788.3356199586851,
    },
    style: {
      width: 100,
      height: 80,
      border: "1px solid #707070",
      borderRadius: 8,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    width: 100,
    height: 80,
  },
  {
    id: "r8",
    type: "custom",
    data: {
      text: "Room 1",
      imageUrl:
        "https://res.cloudinary.com/dp6envw5o/image/upload/v1681132970/Group_59583_onrwzr.svg",
      handlers: [
        {
          handle: {
            className: "node",
            type: "target",
            handleId: "b",
            position: "top",
          },
        },
      ],
    },
    position: {
      x: -1745.8436965160586,
      y: -638.3356199586851,
    },
    style: {
      width: 100,
      height: 80,
      border: "1px solid #707070",
      borderRadius: 8,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    width: 70,
    height: 100,
  },
  {
    id: "r9",
    type: "custom",
    data: {
      text: "Room 2",
      imageUrl:
        "https://res.cloudinary.com/dp6envw5o/image/upload/v1681133004/Group_59584_ks8gs9.svg",
      handlers: [
        {
          handle: {
            className: "node",
            type: "target",
            handleId: "b",
            position: "top",
          },
        },
      ],
    },
    position: {
      x: -1625.8436965160586,
      y: -638.3356199586851,
    },
    style: {
      width: 100,
      height: 80,
      border: "1px solid #707070",
      borderRadius: 8,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    width: 70,
    height: 100,
  },
];

const floorOneEdges = [
  {
    id: "company->site",
    source: "1",
    target: "2",
    sourceHandle: "a",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "straight",
  },
  {
    id: "site->tower",
    source: "2",
    target: "3",
    sourceHandle: "c",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "straight",
  },
  {
    id: "tower->floor-1",
    source: "3",
    target: "r4",
    sourceHandle: "c",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#00A4DC",
    },
  },
  {
    id: "tower->floor-2",
    source: "3",
    target: "r5",
    sourceHandle: "c",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#00A4DC",
    },
  },
  {
    id: "tower->floor-3",
    source: "3",
    target: "r6",
    sourceHandle: "c",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#00A4DC",
    },
  },
  {
    id: "tower->floor-4",
    source: "3",
    target: "r7",
    sourceHandle: "c",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#00A4DC",
    },
  },
  {
    id: "floor-1->room-1",
    source: "r4",
    target: "r8",
    sourceHandle: "e",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#00A4DC",
    },
  },
  {
    id: "floor-1->room-2",
    source: "r4",
    target: "r9",
    sourceHandle: "f",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#00A4DC",
    },
  },
];

const RestroomsSldOverview = () => {
  const [menu, setMenu] = React.useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState();

  const { pinEnableData } = useSelector((state) => state.auth);

  const { userRoles } = useSelector((state) => state.user);

  const path = window.location.href.split("?")[1];

  React.useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      "Restrooms",
      "name"
    );
    let sld = "";
    if (getmenus && getmenus.length) {
      sld = getmenus.find((menu) => menu.name.toLowerCase() === "sld");
    }
    setMenu(sld ? sld : "");
  }, [userRoles]);

  const onConnect = React.useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Restrooms"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, restRoomsNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "SLD"
    );
  }
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Restrooms",
        moduleName: "Restrooms",
        menuName: "SLD",
        link: "/restrooms-sld-overview",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  React.useEffect(() => {
    let finalNodes = [];
    let finalEdges = [];
    if (!path || path.toString() === "r4") {
      finalNodes = floorOneNodes;
      finalEdges = floorOneEdges;
    } else if (path && path.toString() === "r5") {
      finalNodes = floorTwoNodes;
      finalEdges = floorTwoEdges;
    } else if (path && path.toString() === "r6") {
      finalNodes = floorThreeNodes;
      finalEdges = floorThreeEdges;
    } else if (path && path.toString() === "r7") {
      finalNodes = floorFourNodes;
      finalEdges = floorFourEdges;
    }
    setNodes(finalNodes);
    setEdges(finalEdges);
  }, [path]);

  const floorTwoNodes = [
    {
      id: "1",
      type: "custom",
      data: {
        text: "Company",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678345927/Group_29506_cdgdk8.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "a",
              position: "bottom",
            },
          },
        ],
        link: "/energy",
      },
      position: {
        x: -1395.6826382740562,
        y: -1138.651118804467,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 10,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "2",
      type: "custom",
      data: {
        text: "Site",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678346212/Group_29894_hclp2n.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "b",
              position: "top",
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "c",
              position: "bottom",
            },
          },
        ],
      },
      position: {
        x: -1395.0139384390516,
        y: -1029.7089945577964,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "3",
      type: "custom",
      data: {
        text: "Tower",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354377/Group_29897_bugauw.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "d",
              position: "top",
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "e",
              position: "bottom",
            },
          },
        ],
      },
      position: {
        x: -1395.8436965160586,
        y: -920.3606199586854,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r4",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r4",
        text: "Floor 1",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "d",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "e",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "f",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1693.3436965160586,
        y: -788.3606199586854,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r5",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r5",
        text: "Floor 2",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "h",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "j",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "k",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1495.8436965160586,
        y: -788.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r6",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r6",
        text: "Floor 3",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "h",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "j",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "k",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1295.8436965160586,
        y: -788.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r7",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r7",
        text: "Floor 4",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "h",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "j",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "k",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1095.8436965160586,
        y: -788.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },

    {
      id: "r10",
      type: "custom",
      data: {
        text: "Men WASHROOM 1",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1681132970/Group_59583_onrwzr.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "b",
              position: "top",
            },
          },
        ],
      },
      position: {
        x: -1505.8436965160586,
        y: -638.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 70,
      height: 100,
    },
    {
      id: "r11",
      type: "custom",
      data: {
        text: "Women WASHROOM 1",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1681133004/Group_59584_ks8gs9.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "b",
              position: "top",
            },
          },
        ],
      },
      position: {
        x: -1385.8436965160586,
        y: -638.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 70,
      height: 100,
    },
  ];

  const floorTwoEdges = [
    {
      id: "company->site",
      source: "1",
      target: "2",
      sourceHandle: "a",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "straight",
    },
    {
      id: "site->tower",
      source: "2",
      target: "3",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "straight",
    },
    {
      id: "tower->floor-1",
      source: "3",
      target: "r4",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "tower->floor-2",
      source: "3",
      target: "r5",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "tower->floor-3",
      source: "3",
      target: "r6",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "tower->floor-4",
      source: "3",
      target: "r7",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "floor-2->room-1",
      source: "r5",
      target: "r10",
      sourceHandle: "j",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "floor-2->room-2",
      source: "r5",
      target: "r11",
      sourceHandle: "k",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
  ];

  const floorThreeNodes = [
    {
      id: "1",
      type: "custom",
      data: {
        text: "Company",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678345927/Group_29506_cdgdk8.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "a",
              position: "bottom",
            },
          },
        ],
        link: "/energy",
      },
      position: {
        x: -1395.6826382740562,
        y: -1138.651118804467,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 10,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "2",
      type: "custom",
      data: {
        text: "Site",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678346212/Group_29894_hclp2n.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "b",
              position: "top",
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "c",
              position: "bottom",
            },
          },
        ],
      },
      position: {
        x: -1395.0139384390516,
        y: -1029.7089945577964,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "3",
      type: "custom",
      data: {
        text: "Tower",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354377/Group_29897_bugauw.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "d",
              position: "top",
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "e",
              position: "bottom",
            },
          },
        ],
      },
      position: {
        x: -1395.8436965160586,
        y: -920.3606199586854,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r4",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r4",
        text: "Floor 1",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "d",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "e",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "f",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1693.3436965160586,
        y: -788.3606199586854,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r5",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r5",
        text: "Floor 2",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "h",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "j",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "k",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1495.8436965160586,
        y: -788.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r6",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r6",
        text: "Floor 3",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "h",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "j",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "k",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1295.8436965160586,
        y: -788.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r7",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r7",
        text: "Floor 4",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "h",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "j",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "k",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1095.8436965160586,
        y: -788.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r12",
      type: "custom",
      data: {
        text: "Men WASHROOM 1",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1681132970/Group_59583_onrwzr.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "b",
              position: "top",
            },
          },
        ],
      },
      position: {
        x: -1265.8436965160586,
        y: -638.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 70,
      height: 100,
    },
    {
      id: "r13",
      type: "custom",
      data: {
        text: "Women WASHROOM 1",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1681133004/Group_59584_ks8gs9.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "b",
              position: "top",
            },
          },
        ],
      },
      position: {
        x: -1145.8436965160586,
        y: -638.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 70,
      height: 100,
    },
  ];

  const floorThreeEdges = [
    {
      id: "company->site",
      source: "1",
      target: "2",
      sourceHandle: "a",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "straight",
    },
    {
      id: "site->tower",
      source: "2",
      target: "3",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "straight",
    },
    {
      id: "tower->floor-1",
      source: "3",
      target: "r4",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "tower->floor-2",
      source: "3",
      target: "r5",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "tower->floor-3",
      source: "3",
      target: "r6",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "tower->floor-4",
      source: "3",
      target: "r7",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "floor-3->room-1",
      source: "r6",
      target: "r12",
      sourceHandle: "j",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "floor-3->room-2",
      source: "r6",
      target: "r13",
      sourceHandle: "k",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
  ];

  const floorFourNodes = [
    {
      id: "1",
      type: "custom",
      data: {
        text: "Company",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678345927/Group_29506_cdgdk8.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "a",
              position: "bottom",
            },
          },
        ],
        link: "/energy",
      },
      position: {
        x: -1395.6826382740562,
        y: -1138.651118804467,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 10,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "2",
      type: "custom",
      data: {
        text: "Site",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678346212/Group_29894_hclp2n.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "b",
              position: "top",
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "c",
              position: "bottom",
            },
          },
        ],
      },
      position: {
        x: -1395.0139384390516,
        y: -1029.7089945577964,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "3",
      type: "custom",
      data: {
        text: "Tower",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354377/Group_29897_bugauw.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "d",
              position: "top",
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "e",
              position: "bottom",
            },
          },
        ],
      },
      position: {
        x: -1395.8436965160586,
        y: -920.3606199586854,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r4",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r4",
        text: "Floor 1",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "d",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "e",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "f",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1693.3436965160586,
        y: -788.3606199586854,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r5",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r5",
        text: "Floor 2",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "h",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "j",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "k",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1495.8436965160586,
        y: -788.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r6",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r6",
        text: "Floor 3",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "h",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "j",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "k",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1295.8436965160586,
        y: -788.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r7",
      type: "custom",
      data: {
        link: "/restrooms-sld-overview?r7",
        text: "Floor 4",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "h",
              position: "top",
            },
          },

          {
            handle: {
              className: "node",
              type: "source",
              handleId: "j",
              position: "bottom",
              style: {
                left: 35,
              },
            },
          },
          {
            handle: {
              className: "node",
              type: "source",
              handleId: "k",
              position: "bottom",
              style: {
                left: 65,
              },
            },
          },
        ],
      },
      position: {
        x: -1095.8436965160586,
        y: -788.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 100,
      height: 80,
    },
    {
      id: "r14",
      type: "custom",
      data: {
        text: "Men WASHROOM 1",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1681132970/Group_59583_onrwzr.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "b",
              position: "top",
            },
          },
        ],
      },
      position: {
        x: -1025.8436965160586,
        y: -638.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 70,
      height: 100,
    },
    {
      id: "r15",
      type: "custom",
      data: {
        text: "Women WASHROOM 1",
        imageUrl:
          "https://res.cloudinary.com/dp6envw5o/image/upload/v1681133004/Group_59584_ks8gs9.svg",
        handlers: [
          {
            handle: {
              className: "node",
              type: "target",
              handleId: "b",
              position: "top",
            },
          },
        ],
      },
      position: {
        x: -905.8436965160586,
        y: -638.3356199586851,
      },
      style: {
        width: 100,
        height: 80,
        border: "1px solid #707070",
        borderRadius: 8,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      width: 70,
      height: 100,
    },
  ];

  const floorFourEdges = [
    {
      id: "company->site",
      source: "1",
      target: "2",
      sourceHandle: "a",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "straight",
    },
    {
      id: "site->tower",
      source: "2",
      target: "3",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "straight",
    },
    {
      id: "tower->floor-1",
      source: "3",
      target: "r4",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "tower->floor-2",
      source: "3",
      target: "r5",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "tower->floor-3",
      source: "3",
      target: "r6",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "tower->floor-4",
      source: "3",
      target: "r7",
      sourceHandle: "c",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "floor-4->room-1",
      source: "r7",
      target: "r14",
      sourceHandle: "j",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
    {
      id: "floor-4->room-2",
      source: "r7",
      target: "r15",
      sourceHandle: "k",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#000000",
      },
      type: "smoothstep",
      style: {
        stroke: "#00A4DC",
      },
    },
  ];

  return (
    <>
      <div>
        <div
          style={{
            height: "90vh",
            width: "100vw",
          }}
        >
          {true && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="bg-teal-50"
            >
              <Controls />
            </ReactFlow>
          )}
        </div>
      </div>
    </>
  );
};

export default RestroomsSldOverview;
