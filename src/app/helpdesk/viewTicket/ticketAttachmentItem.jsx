import React from "react";
import { Box, IconButton, Typography } from "@mui/material";

import {
  BsFiletypeJpg,
  BsFiletypePng,
  BsFiletypeSvg,
  BsFiletypePdf,
  BsFiletypeXlsx,
  BsFiletypeXls,
  BsFiletypePpt,
  BsFiletypeDocx,
  BsCloudArrowDown,
} from "react-icons/bs";

import MuiTooltip from "@shared/muiTooltip";

const getDocumentIcon = (type) => {
  switch (type) {
    case "Docx":
      return <BsFiletypeDocx size={25} color="#0938e3" />;
      break;
    case "Pdf":
      return <BsFiletypePdf size={25} color="#EF1515" />;
    case "Xlsx":
      return <BsFiletypeXlsx size={25} color="#ba9d1a" />;
    case "Jpg":
      return <BsFiletypeJpg size={25} color="#f27d25" />;
    case "Png":
      return <BsFiletypePng size={25} color="#15966F" />;
    case "Svg":
      return <BsFiletypeSvg size={25} color="#b516b0" />;
    case "Ppt":
      return <BsFiletypePpt size={25} color="#1dd1a4" />;
      case "xls":
        return <BsFiletypeXls size={25} color="#1dd1a4" />;
    default:
      break;
  }
};

const TicketAttachmentItem = (props) => {
  const { fileName, uploader, fileType, size, dateTime } = props.data;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Box
        sx={{
          width: "50%",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {getDocumentIcon(fileType)}
        <Box>
          <Typography
            sx={{
              font: "normal normal normal 20px/26px Suisse Int'l",
              letterSpacing: "0.7px",
              color: "#000000",
            }}
          >
            {fileName}
          </Typography>
          <Typography
            sx={{
              font: "normal normal 300 20px/26px Suisse Int'l",
              letterSpacing: "0.7px",
              color: "#707070",
            }}
          >
            Uploaded by {uploader}
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          width: "10%",
          font: "normal normal normal 20px/26px Suisse Int'l",
          letterSpacing: "0.7px",
          color: "#000000",
        }}
      >
        {fileType}
      </Typography>
      <Typography
        sx={{
          width: "10%",
          font: "normal normal normal 20px/26px Suisse Int'l",
          letterSpacing: "0.7px",
          color: "#000000",
        }}
      >
        {size}
      </Typography>
      <Box
        sx={{
          width: "30%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            font: "normal normal normal 20px/26px Suisse Int'l",
            letterSpacing: "0.7px",
            color: "#000000",
          }}
        >
          {dateTime}{" "}
        </Typography>
        <MuiTooltip title={<Typography>Download</Typography>}>
          <IconButton>
            <BsCloudArrowDown size={25} />
          </IconButton>
        </MuiTooltip>
      </Box>
    </Box>
  );
};

export default TicketAttachmentItem;
