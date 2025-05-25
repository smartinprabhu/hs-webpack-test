import { Box, Typography } from "@mui/material";

const CheckAchievement = (val) => {
  return (
    <strong>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#F8F8F8",
            width: "300px",
            height: "38px",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#1AA6B5",
              width: `${val.val.formattedValue}%`,
              height: "38px",
            }}
          ></Box>
        </Box>
        <Typography
          sx={{
            font: "normal normal normal 15px Suisse Intl",
            letterSpacing: "0.4px",
            color: "#000000DE",
          }}
        >
          {val.val.formattedValue}%
        </Typography>
      </Box>
    </strong>
  );
};

export const esgGridColumns = [
  {
    field: "metrix",
    headerName: "Metrix",
    editable: true,
    flex: 1,
  },
  {
    field: "kpiDescription",
    headerName: "KPI Description",
    editable: true,
    flex: 1,
  },
  {
    field: "achievementPercentage",
    headerName: "Achievement Percentage",
    editable: true,
    flex: 1,
    renderCell: (val) => <CheckAchievement val={val} />,
  },
];

export const esgRows = [
  {
    id: 1,
    metrix: "Energy use per facility",
    kpiDescription:
      "Reduce the energy usage per facility (Specify facility name) by a certain percentage",
    achievementPercentage: "43",
  },
  {
    id: 2,
    metrix: "Expected Energy saved to actual use.",
    kpiDescription:
      "(Energy Measurement/Improvements made in the same period) This ratio allows businesses to view their energy savings data from the perspective of set goals. The common benchmark for energy management is the ISO 50001 standard, against which most firms compare their energy usage. Businesses widely utilize this KPI to gauge whether certain changes made to their operations or infrastructure are contributing to meeting their environmental goals.",
    achievementPercentage: "63",
  },
  {
    id: 3,
    metrix: "Carbon footprint",
    kpiDescription: "Reduce the carbon emission by a certain percentage",
    achievementPercentage: "83",
  },
  {
    id: 4,
    metrix: "Waste management",
    kpiDescription:
      "Reduce the waste management by a certain percentge and this can be obtained from any of the following sources (Hauler Records, Purchasing Records, Sales Records, Employee Surveys, Facility walkthroughs, Waste sorting)",
    achievementPercentage: "77",
  },
  {
    id: 5,
    metrix: "Fresh water Availability",
    kpiDescription: "Fresh water consumption reduction percentage",
    achievementPercentage: "50",
  },
];
