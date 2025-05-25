const mcloudInitialNodes = [
  {
    "id": "1",
    "type": "custom",
    "data": {
      "text": "Company",
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678345927/Group_29506_cdgdk8.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "a",
            "position": "bottom"
          }
        }
      ],
      "link": "/energy"
    },
    "position": {
      "x": -1395.6826382740562,
      "y": -1138.651118804467
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 10,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "2",
    "type": "custom",
    "data": {
      "text": "Site",
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678346212/Group_29894_hclp2n.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "c",
            "position": "bottom"
          }
        }
      ]
    },
    "position": {
      "x": -1395.0139384390516,
      "y": -1029.7089945577964
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "3",
    "type": "custom",
    "data": {
      "text": "Tower",
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354377/Group_29897_bugauw.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "d",
            "position": "top"
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "e",
            "position": "bottom",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "f",
            "position": "bottom",
            "style": {
              "left": 65
            }
          }
        }
      ]
    },
    "position": {
      "x": -1395.8436965160586,
      "y": -920.3606199586854
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m4",
    "type": "custom",
    "data": {
      "link": "/energy-sld-overview?m4",
      "text": "Floor 6",
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "d",
            "position": "top",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "g",
            "position": "top",
            "style": {
              "left": 65
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "e",
            "position": "bottom",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "f",
            "position": "bottom",
            "style": {
              "left": 65
            }
          }
        }
      ]
    },
    "position": {
      "x": -1593.3436965160586,
      "y": -788.3606199586854
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m5",
    "type": "custom",
    "data": {
      "link": "/energy-sld-overview?m5",
      "text": "Floor 7",
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "h",
            "position": "top",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "i",
            "position": "top",
            "style": {
              "left": 65
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "j",
            "position": "bottom",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "k",
            "position": "bottom",
            "style": {
              "left": 65
            }
          }
        }
      ]
    },
    "position": {
      "x": -1195.8436965160586,
      "y": -788.3356199586851
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m6",
    "type": "custom",
    "data": {
      "text": "Lighting + RAW + AC Panel",
      "description": true,
      "mainEnergyMeter": {
        "text": "EM 247",
        "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
      },
      "energyMeters": [
        {
          "text": "EM 12",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 13",

          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 14",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 15",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 10",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 11",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Spare",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Spare",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Spare",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Spare",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Inverter",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        }
      ],
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "p",
            "position": "top",
            "style": {
              "left": "45%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "q",
            "position": "top",
            "style": {
              "left": "55%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "r",
            "position": "bottom",
            "style": {
              "left": "7.5%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "s",
            "position": "bottom",
            "style": {
              "left": "15%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "t",
            "position": "bottom",
            "style": {
              "left": "21.5%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "u",
            "position": "bottom",
            "style": {
              "left": "29%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "v",
            "position": "bottom",
            "style": {
              "left": "36%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "w",
            "position": "bottom",
            "style": {
              "left": "44%"
            }
          }
        }
      ]
    },
    "position": {
      "x": -2593.3436965160586,
      "y": -658.3606199586854
    },
    "style": {
      "width": 650,
      "height": 220,
      "border": "1px dashed #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column",
      "gap": "40px",
      "padding": 10
    }
  },
  {
    "id": "m7",
    "type": "custom",
    "data": {
      "text": "UPS input panel",
      "description": true,
      "mainEnergyMeter": {
        "text": "EM 17",
        "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
      },
      "energyMeters": [
        {
          "text": "EM 18",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 19",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 20",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Spare",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Spare",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        }
      ],
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "p",
            "position": "top",
            "style": {
              "left": "45%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "q",
            "position": "top",
            "style": {
              "left": "55%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "r",
            "position": "bottom",
            "style": {
              "left": "33%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "s",
            "position": "bottom",
            "style": {
              "left": "40"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "t",
            "position": "bottom",
            "style": {
              "left": "48%"
            }
          }
        }
      ]
    },
    "position": {
      "x": -1893.3436965160586,
      "y": -658.3606199586854
    },
    "style": {
      "width": 650,
      "height": 220,
      "border": "1px dashed #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column",
      "gap": "40px",
      "padding": 10
    }
  },
  {
    "id": "m8",
    "type": "custom",
    "data": {
      "text": "UPS output panel",
      "description": true,
      "mainEnergyMeter": {
        "text": "EM 21",
        "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
      },
      "energyMeters": [
        {
          "text": "EM 22",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 23",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 24",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 25",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM 26",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Spare",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Spare",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM Spare",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        }
      ],
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "p",
            "position": "top",
            "style": {
              "left": "15%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "t",
            "position": "bottom",
            "style": {
              "left": "21.5%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "u",
            "position": "bottom",
            "style": {
              "left": "28%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "v",
            "position": "bottom",
            "style": {
              "left": "36%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "w",
            "position": "bottom",
            "style": {
              "left": "44%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "x",
            "position": "bottom",
            "style": {
              "left": "52%"
            }
          }
        }
      ]
    },
    "position": {
      "x": -1893.3436965160586,
      "y": -308.3606199586854
    },
    "style": {
      "width": 650,
      "height": 220,
      "border": "1px dashed #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column",
      "gap": "40px",
      "padding": 10
    }
  },
  {
    "id": "7258",
    "type": "custom",
    "data": {
      "text": "ACDB 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -2600.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "7259",
    "type": "custom",
    "data": {
      "text": "ACDB 2",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -2530.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m11",
    "type": "custom",
    "data": {
      "text": "LDB 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -2460.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m12",
    "type": "custom",
    "data": {
      "text": "LDB 2",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -2390.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "7256",
    "type": "custom",
    "data": {
      "text": "RPDB 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -2320.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m14",
    "type": "custom",
    "data": {
      "text": "RPDB 2",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -2250.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m15",
    "type": "custom",
    "data": {
      "text": "Server DB 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -1653.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m152",
    "type": "custom",
    "data": {
      "text": "Server DB 2",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -1583.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m16",
    "type": "custom",
    "data": {
      "text": "UPSDB 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -1793.3436965160586,
      "y": -58.3606199586854
    },
    "style": {
      "width": 80,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m17",
    "type": "custom",
    "data": {
      "text": "UPSDB 2",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -1703.3436965160586,
      "y": -58.3606199586854
    },
    "style": {
      "width": 80,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m18",
    "type": "custom",
    "data": {
      "text": "UPSDB 3",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -1610.3436965160586,
      "y": -58.3606199586854
    },
    "style": {
      "width": 80,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m19",
    "type": "custom",
    "data": {
      "text": "UPSDB 4",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -1520.3436965160586,
      "y": -58.3606199586854
    },
    "style": {
      "width": 80,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m20",
    "type": "custom",
    "data": {
      "text": "UPSDB(Forsafetyandsecurity)",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -1430.3436965160586,
      "y": -58.3606199586854
    },
    "style": {
      "width": 200,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  }
]
const mcloudInitialEdges = [
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
    id: "tower->floor1-node-1",
    source: "3",
    target: "m4",
    sourceHandle: "e",
    targetHandle: "d",
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
    id: "tower->floor1-node-2",
    source: "3",
    target: "m4",
    sourceHandle: "f",
    targetHandle: "g",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#33BA12",
    },
  },
  {
    id: "tower->floor2-node-1",
    source: "3",
    target: "m5",
    sourceHandle: "e",
    targetHandle: "h",
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
    id: "tower->floor2-node-2",
    source: "3",
    target: "m5",
    sourceHandle: "f",
    targetHandle: "i",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#33BA12",
    },
  },
  {
    id: "floor6->em247-1",
    source: "m4",
    target: "m6",
    sourceHandle: "e",
    targetHandle: "p",
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
    id: "floor6->em247-2",
    source: "m4",
    target: "m6",
    sourceHandle: "f",
    targetHandle: "q",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#33BA12",
    },
  },
  {
    id: "floor6->em247-1",
    source: "m4",
    target: "m7",
    sourceHandle: "e",
    targetHandle: "p",
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
    id: "floor6->em247-2",
    source: "m4",
    target: "m7",
    sourceHandle: "f",
    targetHandle: "q",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#33BA12",
    },
  },
  {
    id: "em->end-1",
    source: "m6",
    target: "m9",
    sourceHandle: "r",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->end-2",
    source: "m6",
    target: "m10",
    sourceHandle: "s",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->end-3",
    source: "m6",
    target: "m11",
    sourceHandle: "t",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->end-4",
    source: "m6",
    target: "m12",
    sourceHandle: "u",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->end-5",
    source: "m6",
    target: "m13",
    sourceHandle: "v",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->end-6",
    source: "m6",
    target: "m14",
    sourceHandle: "w",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "panel->end-1",
    source: "m7",
    target: "m15",
    sourceHandle: "s",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "panel->end-2",
    source: "m7",
    target: "m152",
    sourceHandle: "t",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "panel->end-one",
    source: "m7",
    target: "m8",
    sourceHandle: "r",
    targetHandle: "p",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->db-1",
    source: "m8",
    target: "m16",
    sourceHandle: "t",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->db-2",
    source: "m8",
    target: "m17",
    sourceHandle: "u",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->db-3",
    source: "m8",
    target: "m18",
    sourceHandle: "v",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->db-4",
    source: "m8",
    target: "m19",
    sourceHandle: "w",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "em->db-5",
    source: "m8",
    target: "m20",
    sourceHandle: "x",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
];
const mcloudFloorSevenNodes = [
  {
    "id": "1",
    "type": "custom",
    "data": {
      "text": "Company",
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678345927/Group_29506_cdgdk8.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "a",
            "position": "bottom"
          }
        }
      ],
      "link": "/energy"
    },
    "position": {
      "x": -1395.6826382740562,
      "y": -1138.651118804467
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 10,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "2",
    "type": "custom",
    "data": {
      "text": "Site",
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678346212/Group_29894_hclp2n.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "c",
            "position": "bottom"
          }
        }
      ]
    },
    "position": {
      "x": -1395.0139384390516,
      "y": -1029.7089945577964
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "3",
    "type": "custom",
    "data": {
      "text": "Tower",
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354377/Group_29897_bugauw.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "d",
            "position": "top"
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "e",
            "position": "bottom",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "f",
            "position": "bottom",
            "style": {
              "left": 65
            }
          }
        }
      ]
    },
    "position": {
      "x": -1395.8436965160586,
      "y": -920.3606199586854
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m4",
    "type": "custom",
    "data": {
      "link": "/energy-sld-overview?m4",
      "text": "Floor 6",
      "imageUrl":  "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "d",
            "position": "top",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "g",
            "position": "top",
            "style": {
              "left": 65
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "e",
            "position": "bottom",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "f",
            "position": "bottom",
            "style": {
              "left": 65
            }
          }
        }
      ]
    },
    "position": {
      "x": -1593.3436965160586,
      "y": -788.3606199586854
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "m5",
    "type": "custom",
    "data": {
      "link": "/energy-sld-overview?m5",
      "text": "Floor 7",
      "imageUrl": "https://res.cloudinary.com/dp6envw5o/image/upload/v1678354917/Group_29898_rengxs.svg",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "h",
            "position": "top",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "i",
            "position": "top",
            "style": {
              "left": 65
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "j",
            "position": "bottom",
            "style": {
              "left": 35
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "k",
            "position": "bottom",
            "style": {
              "left": 65
            }
          }
        }
      ]
    },
    "position": {
      "x": -1195.8436965160586,
      "y": -788.3356199586851
    },
    "style": {
      "width": 100,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m6",
    "type": "custom",
    "data": {
      "text": "SMSB 1",
      "description": true,
      "mainEnergyMeter": {
        "text": "EM LG 6435",
        "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
      },
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "p",
            "position": "top",
            "style": {
              "left": "45%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "q",
            "position": "top",
            "style": {
              "left": "55%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "r",
            "position": "bottom",
            "style": {
              "left": "15%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "s",
            "position": "bottom",
            "style": {
              "left": "25%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "t",
            "position": "bottom",
            "style": {
              "left": "35%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "u",
            "position": "bottom",
            "style": {
              "left": "45%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "v",
            "position": "bottom",
            "style": {
              "left": "55%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "w",
            "position": "bottom",
            "style": {
              "left": "65%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "x",
            "position": "bottom",
            "style": {
              "left": "75%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "y",
            "position": "bottom",
            "style": {
              "left": "85%"
            }
          }
        }
      ]
    },
    "position": {
      "x": -1093.3436965160586,
      "y": -658.3606199586854
    },
    "style": {
      "width": 650,
      "height": 220,
      "border": "1px dashed #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column",
      "gap": "40px",
      "padding": 10
    }
  },
  {
    "id": "f7m9",
    "type": "custom",
    "data": {
      "text": "LDB 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -1030.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m10",
    "type": "custom",
    "data": {
      "text": "LDB 2",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -960.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m11",
    "type": "custom",
    "data": {
      "text": "RPDB 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -890.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m12",
    "type": "custom",
    "data": {
      "text": "CAFE DB",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -820.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m13",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -750.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m14",
    "type": "custom",
    "data": {
      "text": "INV",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "a",
            "position": "bottom"
          }
        }
      ]
    },
    "position": {
      "x": -680.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m15",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "c",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -610.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m16",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "d",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -540.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m16-2",
    "type": "custom",
    "data": {
      "text": "ELDB",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "d",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -680.3436965160586,
      "y": -300.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m17",
    "type": "custom",
    "data": {
      "text": "SMSB 2",
      "description": true,
      "mainEnergyMeter": {
        "text": "EM LG 6435",
        "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
      },
      "energyMeters": [
        {
          "text": "EM LG 6400",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM LG 6400",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        },
        {
          "text": "EM",
          "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
        }
      ],
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "p",
            "position": "top",
            "style": {
              "left": "45%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "q",
            "position": "top",
            "style": {
              "left": "55%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "r",
            "position": "bottom",
            "style": {
              "left": "15%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "s",
            "position": "bottom",
            "style": {
              "left": "25%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "t",
            "position": "bottom",
            "style": {
              "left": "42%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "u",
            "position": "bottom",
            "style": {
              "left": "52%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "v",
            "position": "bottom",
            "style": {
              "left": "62%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "w",
            "position": "bottom",
            "style": {
              "left": "75%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "y",
            "position": "bottom",
            "style": {
              "left": "85%"
            }
          }
        }
      ]
    },
    "position": {
      "x": -303.3436965160586,
      "y": -658.3606199586854
    },
    "style": {
      "width": 650,
      "height": 220,
      "border": "1px dashed #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column",
      "gap": "40px",
      "padding": 10
    }
  },
  {
    "id": "f7m18",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 250.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m19",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -250.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m20",
    "type": "custom",
    "data": {
      "text": "VRF ODU 7F-5",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -80.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m21",
    "type": "custom",
    "data": {
      "text": "VRF ODU 7F-6",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -10.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m22",
    "type": "custom",
    "data": {
      "text": "ACBD 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 60.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m23",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 160.3436965160586,
      "y": -408.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m24",
    "type": "custom",
    "data": {
      "text": "Workstation panel(RAW power)",
      "description": true,
      "mainEnergyMeter": {
        "text": "EM LG 6400",
        "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
      },
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "p",
            "position": "top"
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "r",
            "position": "bottom",
            "style": {
              "left": "10%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "s",
            "position": "bottom",
            "style": {
              "left": "25%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "t",
            "position": "bottom",
            "style": {
              "left": "40%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "u",
            "position": "bottom",
            "style": {
              "left": "55%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "v",
            "position": "bottom",
            "style": {
              "left": "70%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "w",
            "position": "bottom",
            "style": {
              "left": "85%"
            }
          }
        }
      ]
    },
    "position": {
      "x": -300.3436965160586,
      "y": -258.3606199586854
    },
    "style": {
      "width": 350,
      "height": 220,
      "border": "1px dashed #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column",
      "gap": "40px",
      "padding": 10
    }
  },
  {
    "id": "f7m25",
    "type": "custom",
    "data": {
      "text": "WSDB 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -300.3436965160586,
      "y": -8.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m26",
    "type": "custom",
    "data": {
      "text": "WSDB 2",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -230.3436965160586,
      "y": -8.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m27",
    "type": "custom",
    "data": {
      "text": "WSDB 3",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -160.3436965160586,
      "y": -8.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m28",
    "type": "custom",
    "data": {
      "text": "WSDB 4",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -90.3436965160586,
      "y": -8.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m29",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": -20.3436965160586,
      "y": -8.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m30",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 50.3436965160586,
      "y": -8.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m31",
    "type": "custom",
    "data": {
      "text": "Supply from 20 kVA UPS panel source A - 6th Floor",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "c",
            "position": "bottom"
          }
        }
      ]
    },
    "position": {
      "x": 403.3436965160586,
      "y": -658.3606199586854
    },
    "style": {
      "width": 200,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m32",
    "type": "custom",
    "data": {
      "text": "Server DB A",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 453.3436965160586,
      "y": -458.3606199586854
    },
    "style": {
      "width": 80,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m33",
    "type": "custom",
    "data": {
      "text": "Supply from 20 kVA UPS panel source B - 6th Floor",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "c",
            "position": "bottom"
          }
        }
      ]
    },
    "position": {
      "x": 653.3436965160586,
      "y": -658.3606199586854
    },
    "style": {
      "width": 200,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m34",
    "type": "custom",
    "data": {
      "text": "Server DB B",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 703.3436965160586,
      "y": -458.3606199586854
    },
    "style": {
      "width": 80,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m35",
    "type": "custom",
    "data": {
      "text": "Supply from 120 kVA UPS panel - 6th Floor",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "c",
            "position": "bottom"
          }
        }
      ]
    },
    "position": {
      "x": 953.3436965160586,
      "y": -658.3606199586854
    },
    "style": {
      "width": 200,
      "height": 80,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m36",
    "type": "custom",
    "data": {
      "text": "UPS OUTPUT Panel",
      "description": true,
      "mainEnergyMeter": {
        "text": "EM LG 6400",
        "imageUrl": "https://res.cloudinary.com/dqexqku43/image/upload/v1677184686/Group_29544_tctvfu.jpg"
      },
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "p",
            "position": "top"
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "s",
            "position": "bottom",
            "style": {
              "left": "25%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "t",
            "position": "bottom",
            "style": {
              "left": "40%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "u",
            "position": "bottom",
            "style": {
              "left": "55%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "v",
            "position": "bottom",
            "style": {
              "left": "70%"
            }
          }
        },
        {
          "handle": {
            "className": "node",
            "type": "source",
            "handleId": "w",
            "position": "bottom",
            "style": {
              "left": "85%"
            }
          }
        }
      ]
    },
    "position": {
      "x": 853.3436965160586,
      "y": -458.3606199586854
    },
    "style": {
      "width": 350,
      "height": 220,
      "border": "1px dashed #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column",
      "gap": "40px",
      "padding": 10
    }
  },
  {
    "id": "f7m37",
    "type": "custom",
    "data": {
      "text": "UDB 1",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 853.3436965160586,
      "y": -158.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m38",
    "type": "custom",
    "data": {
      "text": "UDB 2",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 923.3436965160586,
      "y": -158.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m39",
    "type": "custom",
    "data": {
      "text": "LSS DB",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 993.3436965160586,
      "y": -158.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m40",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 1063.3436965160586,
      "y": -158.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  },
  {
    "id": "f7m41",
    "type": "custom",
    "data": {
      "text": "SPARE",
      "handlers": [
        {
          "handle": {
            "className": "node",
            "type": "target",
            "handleId": "b",
            "position": "top"
          }
        }
      ]
    },
    "position": {
      "x": 1133.3436965160586,
      "y": -158.3606199586854
    },
    "style": {
      "width": 60,
      "height": 40,
      "border": "1px solid #707070",
      "borderRadius": 8,
      "backgroundColor": "transparent",
      "display": "flex",
      "justifyContent": "center",
      "alignItems": "center",
      "flexDirection": "column"
    }
  }
]
const mcloudFloorSevenEdges = [
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
    id: "tower->floor1-node-1",
    source: "3",
    target: "m4",
    sourceHandle: "e",
    targetHandle: "d",
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
    id: "tower->floor1-node-2",
    source: "3",
    target: "m4",
    sourceHandle: "f",
    targetHandle: "g",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#33BA12",
    },
  },
  {
    id: "tower->floor2-node-1",
    source: "3",
    target: "m5",
    sourceHandle: "e",
    targetHandle: "h",
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
    id: "tower->floor2-node-2",
    source: "3",
    target: "m5",
    sourceHandle: "f",
    targetHandle: "i",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#33BA12",
    },
  },
  {
    id: "floor7->em6435-1",
    source: "m5",
    target: "f7m6",
    sourceHandle: "j",
    targetHandle: "p",
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
    id: "floor7->em6435-2",
    source: "m5",
    target: "f7m6",
    sourceHandle: "k",
    targetHandle: "q",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#33BA12",
    },
  },
  {
    id: "f7em->end-1",
    source: "f7m6",
    target: "f7m9",
    sourceHandle: "r",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-2",
    source: "f7m6",
    target: "f7m10",
    sourceHandle: "s",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-3",
    source: "f7m6",
    target: "f7m11",
    sourceHandle: "t",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-4",
    source: "f7m6",
    target: "f7m12",
    sourceHandle: "u",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-5",
    source: "f7m6",
    target: "f7m13",
    sourceHandle: "v",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-6",
    source: "f7m6",
    target: "f7m14",
    sourceHandle: "w",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-7",
    source: "f7m6",
    target: "f7m15",
    sourceHandle: "x",
    targetHandle: "c",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-8",
    source: "f7m6",
    target: "f7m16",
    sourceHandle: "y",
    targetHandle: "d",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-8-16-2",
    source: "f7m14",
    target: "f7m16-2",
    sourceHandle: "v",
    targetHandle: "d",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "floor7->em6435-smsb-1",
    source: "m5",
    target: "f7m17",
    sourceHandle: "j",
    targetHandle: "p",
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
    id: "floor7->em6435-smsb-2",
    source: "m5",
    target: "f7m17",
    sourceHandle: "k",
    targetHandle: "q",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#33BA12",
    },
  },
  {
    id: "f7em->smsb-1",
    source: "f7m17",
    target: "f7m19",
    sourceHandle: "r",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->smsb-2",
    source: "f7m17",
    target: "f7m20",
    sourceHandle: "t",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->smsb-3",
    source: "f7m17",
    target: "f7m21",
    sourceHandle: "u",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->smsb-4",
    source: "f7m17",
    target: "f7m22",
    sourceHandle: "v",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->smsb-5",
    source: "f7m17",
    target: "f7m23",
    sourceHandle: "w",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->smsb-6",
    source: "f7m17",
    target: "f7m18",
    sourceHandle: "x",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->smsb-7",
    source: "f7m17",
    target: "f7m24",
    sourceHandle: "s",
    targetHandle: "p",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->wsdb-1",
    source: "f7m24",
    target: "f7m25",
    sourceHandle: "r",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->wsdb-2",
    source: "f7m24",
    target: "f7m26",
    sourceHandle: "s",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->wsdb-3",
    source: "f7m24",
    target: "f7m27",
    sourceHandle: "t",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->wsdb-4",
    source: "f7m24",
    target: "f7m28",
    sourceHandle: "u",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->wsdb-5",
    source: "f7m24",
    target: "f7m29",
    sourceHandle: "v",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->wsdb-6",
    source: "f7m24",
    target: "f7m30",
    sourceHandle: "w",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f6-f7-1",
    source: "f7m31",
    target: "f7m32",

    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f6-f7-2",
    source: "f7m33",
    target: "f7m34",

    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f6-f7-end",
    source: "f7m35",
    target: "f7m36",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-2",
    source: "f7m36",
    target: "f7m37",
    sourceHandle: "s",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-3",
    source: "f7m36",
    target: "f7m38",
    sourceHandle: "t",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-4",
    source: "f7m36",
    target: "f7m39",
    sourceHandle: "u",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-5",
    source: "f7m36",
    target: "f7m40",
    sourceHandle: "v",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
  {
    id: "f7em->end-6",
    source: "f7m36",
    target: "f7m41",
    sourceHandle: "w",
    targetHandle: "b",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "smoothstep",
    style: {
      stroke: "#000000",
    },
  },
];