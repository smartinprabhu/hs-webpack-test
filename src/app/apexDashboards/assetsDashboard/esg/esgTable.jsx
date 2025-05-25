import React from "react";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { esgGridColumns, esgRows } from "./esgGridColumns";
import { DataGridPro, gridClasses } from "@mui/x-data-grid-pro";

const ESGTable = () => {
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
            font: "normal normal 600 16px Suisse Intl",
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
        getRowHeight={() => "auto"}
        getRowClassName={() => "esg-row-style"}
        sx={{
          [`& .${gridClasses.cell}`]: {
            py: 1,
          },
        }}
        rows={esgRows}
        columns={esgGridColumns}
      />
    </Box>
  );
};

export default ESGTable;
