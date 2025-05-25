import React from "react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";

import { DetailViewTabsBackground } from '../themes/theme';

const DetailViewRightPanel = (props) => {
  const {
    panelOneHeader,
    panelOneLabel,
    panelOneValue1,
    panelOneValue2,
    panelTwoHeader,
    panelTwoData,
    panelThreeHeader,
    panelThreeData,
  } = props;
  return (
    <>
      <Box
        sx={DetailViewTabsBackground({
          width: "100%",
          height: "50px",
        })}
      ></Box>
      <Box
        sx={{
          width: "100%",
          height: "30%",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            margin: "5% 0 5% 0",
          }}
        >
          <Typography
            sx={{
              font: "normal normal normal 14px Suisse Intl",
              letterSpacing: "0.63px",
              color: "#000000",
              marginBottom: "10px",
              lineBreak: 'anywhere'
            }}
          >
            {panelOneHeader}
          </Typography>
          <Typography
            sx={{
              font: "normal normal normal 16px Suisse Intl",
              letterSpacing: "1.05px",
              color: "#000000",
              fontWeight: 600,
              marginBottom: "10px",
              lineBreak: 'anywhere'
            }}
          >
            {panelOneLabel}
          </Typography>
          <Typography
            sx={{
              font: "normal normal normal 14px Suisse Intl",
              letterSpacing: "0.63px",
              color: "#6A6A6A",
              marginBottom: "10px",
              lineBreak: 'anywhere'
            }}
          >
            {panelOneValue1}
          </Typography>
          <Typography
            sx={{
              font: "normal normal normal 14px Suisse Intl",
              letterSpacing: "0.63px",
              color: "#6A6A6A",
              marginBottom: "10px",
              lineBreak: 'anywhere'
            }}
          >
            {panelOneValue2}
          </Typography>
        </Box>
        <Box
          sx={{
            margin: "5% 0 5% 0",
          }}
        >
          <Typography
            sx={{
              font: "normal normal normal 14px Suisse Intl",
              letterSpacing: "0.63px",
              color: "#000000",
              marginBottom: "10px",
            }}
          >
            {panelTwoHeader}
          </Typography>
          {panelTwoData &&
            panelTwoData.length &&
            panelTwoData.map((data) =>
              data.value ? (
                <Typography
                  sx={{
                    font: "normal normal normal 14px Suisse Intl",
                    letterSpacing: "0.63px",
                    color: "#6A6A6A",
                    marginBottom: "10px",
                    lineBreak: 'anywhere'
                  }}
                >
                  {data.value}
                </Typography>
              ) : (
                ""
              )
            )}
        </Box>
        {panelOneHeader === 'undefined' && panelTwoHeader === 'undefined' && panelThreeHeader && (<Divider />)}
        <Box>
          <Typography
            sx={{
              font: "normal normal normal 16px Suisse Intl",
              letterSpacing: "1.05px",
              color: "#000000",
              fontWeight: 600,
              margin: "5% 0 5% 0",
              lineBreak: 'anywhere'
            }}
          >
            {panelThreeHeader}
          </Typography>
          {panelThreeData &&
            panelThreeData.length &&
            panelThreeData.map((data) => (
              data.header ? (<>
                <Typography
                  sx={{
                    font: "normal normal normal 14px Suisse Intl",
                    letterSpacing: "0.63px",
                    color: "#000000",
                    marginBottom: "10px",
                    lineBreak: 'anywhere'
                  }}
                >
                  {data.header}
                </Typography>
                <Typography
                  sx={{
                    font: "normal normal normal 14px Suisse Intl",
                    letterSpacing: "0.63px",
                    color: "#6A6A6A",
                    marginBottom: "10px",
                    lineBreak: 'anywhere'
                  }}
                >
                  {data.value}
                </Typography>
              </>) : ''
            ))}
        </Box>
      </Box>
    </>
  );
};
export default DetailViewRightPanel;
