import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { DataGridPro } from "@mui/x-data-grid-pro";

var camalize = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

const columns = [
  {
    field: "equipmentName",
    headerName: "Equipment name",
    flex: 1,
    // width: 160,
    // editable: true,
    // headerClassName: "super-app-theme--header",
  },
  {
    field: "space",
    headerName: "Space",
    flex: 2,

    // width: 200,
    // editable: true,
    // headerClassName: "super-app-theme--header",
  },
  {
    field: "amcStartDate",
    headerName: "AMC Start date",
    flex: 1,

    // width: 140,
    // editable: true,
    // headerClassName: "super-app-theme--header",
  },
  {
    field: "amcEndDate",
    headerName: "AMC End date",
    flex: 1,

    // width: 140,
    // editable: true,
    // headerClassName: "super-app-theme--header",
  },
  {
    field: "warrantyStart",
    headerName: "Full name",
    flex: 1,

    // editable: true,
    // width: 140,
    // headerClassName: "super-app-theme--header",
  },
  {
    field: "warrantyEnd",
    headerName: "Warranty End",
    flex: 1,

    // editable: true,
    // width: 140,
    // headerClassName: "super-app-theme--header",
  },
  {
    field: "startDate",
    headerName: "Start date",
    flex: 1,

    // editable: true,
    // width: 140,
    // headerClassName: "super-app-theme--header",
  },
];

const rows = [
  {
    id: 1,
    equipmentName: "120KVC UPS",
    space: "MCLD/DC/F6/UPS Room",
    amcStartDate: "2022-02-01",
    amcEndDate: "2022-02-01",
    warrantyStart: "2022-02-01",
    warrantyEnd: "2022-02-01",
    startDate: "2022-02-01",
  },
  {
    id: 2,
    equipmentName: "120KVC UPS",
    space: "MCLD/DC/F6/UPS Room",
    amcStartDate: "2022-02-01",
    amcEndDate: "2022-02-01",
    warrantyStart: "2022-02-01",
    warrantyEnd: "2022-02-01",
    startDate: "2022-02-01",
  },
  {
    id: 3,
    equipmentName: "120KVC UPS",
    space: "MCLD/DC/F6/UPS Room",
    amcStartDate: "2022-02-01",
    amcEndDate: "2022-02-01",
    warrantyStart: "2022-02-01",
    warrantyEnd: "2022-02-01",
    startDate: "2022-02-01",
  },
  {
    id: 4,
    equipmentName: "120KVC UPS",
    space: "MCLD/DC/F6/UPS Room",
    amcStartDate: "2022-02-01",
    amcEndDate: "2022-02-01",
    warrantyStart: "2022-02-01",
    warrantyEnd: "2022-02-01",
    startDate: "2022-02-01",
  },
  {
    id: 5,
    equipmentName: "120KVC UPS",
    space: "MCLD/DC/F6/UPS Room",
    amcStartDate: "2022-02-01",
    amcEndDate: "2022-02-01",
    warrantyStart: "2022-02-01",
    warrantyEnd: "2022-02-01",
    startDate: "2022-02-01",
  },
  {
    id: 6,
    equipmentName: "120KVC UPS",
    space: "MCLD/DC/F6/UPS Room",
    amcStartDate: "2022-02-01",
    amcEndDate: "2022-02-01",
    warrantyStart: "2022-02-01",
    warrantyEnd: "2022-02-01",
    startDate: "2022-02-01",
  },
];

const data = {
  label: ["Product Category", "Name", "Quantity On Hand"],
  data_rows: [
    {
      id: 1701,
      data: ["Stationery", "WHITE BOARD DUSTER ", 10],
    },
    {
      id: 1877,
      data: ["Stationery", "WHITE BAORD MARKER", 5],
    },
    {
      id: 2455,
      data: ["Pantry", "Green Tea", 10],
    },
    {
      id: 2495,
      data: ["HK Cleaning", "HRT Roll", 2],
    },
    {
      id: 2499,
      data: ["HK Cleaning", "Mop Riffile", 3],
    },
    {
      id: 2503,
      data: ["HK Cleaning", "carpet Brush", 9],
    },
    {
      id: 2504,
      data: ["HK Cleaning", "Lapam Patti", 4],
    },
    {
      id: 2505,
      data: ["HK Cleaning", "Room Freshmer", 6],
    },
    {
      id: 2507,
      data: ["HK Cleaning", "Jumbos Duster", 5],
    },
    {
      id: 2509,
      data: ["HK Cleaning", "Plastic Dustpan", 9],
    },
    {
      id: 2510,
      data: ["HK Cleaning", "Dry Mop Road", 5],
    },
    {
      id: 2511,
      data: ["HK Cleaning", "Hand Sanitizer", 6],
    },
    {
      id: 2512,
      data: ["HK Cleaning", "Table Wiper", 1],
    },
    {
      id: 2513,
      data: ["HK Cleaning", "Floor Wiper", 8],
    },
    {
      id: 2514,
      data: ["HK Cleaning", "Spray Gun", 5],
    },
  ],
  model: "product.template",
  list_view_type: "other",
  groupby: false,
  date_index: [],
  label_fields: ["categ_id", "name", "qty_available"],
};

const headerData = data.label.map((each) => camalize(each));
const newColumns = headerData.map((eachHeader, i) => {
  return {
    field: headerData[i],
    headerName: data.label[i],
    flex: 1,
  };
});

const newRows = data.data_rows.map((each, index) => {
  let obj = {};
  obj["id"] = each.id;
  each.data.forEach((item, i) => {
    obj[headerData[i]] = item;
  });
  return obj;
});

const EnergyListView = () => {
  return (
    <Box
      sx={{
        width: "75%",
        padding: "15px",
        height: 400,
      }}
    >
      <Box
        sx={{
          padding: "15px",
          border: "1px solid rgba(224, 224, 224, 1)",
          borderBottom: "none",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            font: "normal normal 600 20px/24px Suisse Intl",
            letterSpacing: "0.4px",
            color: "#000000DE",
          }}
        >
          UPS Warranty / AMC Details
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="energy-list-export">Export</InputLabel>
          <Select
            labelId="energy-list-export"
            id="energy-list-export"
            label="Export"
            className="export-filter-btn"
          >
            <MenuItem value="Excel">Excel</MenuItem>
            <MenuItem value="PDF">PDF</MenuItem>
            <MenuItem value="Image">Image</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DataGridPro
        sx={{
          ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
            {
              "margin-top": "1em",
              "margin-bottom": "1em",
            },
        }}
        rows={newRows}
        columns={newColumns}
        disableRowSelectionOnClick
        pagination
      />
    </Box>
  );
};

export default EnergyListView;
