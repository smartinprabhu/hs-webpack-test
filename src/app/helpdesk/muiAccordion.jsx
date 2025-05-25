import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";

const MuiAccordion = (props) => {
  return (
    <Accordion
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid #B7B7B7",
        margin: "0px !important",
        ".MuiAccordionDetails-root": {},
        ".MuiAccordionSummary-root": {},
      }}
    >
      <AccordionSummary
        expandIcon={<IoIosArrowDown color="#293644" size={20} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          height: "60px",
        }}
      >
        <Typography>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="select-by-date-box">{props.children}</div>
      </AccordionDetails>
    </Accordion>
  );
};

export default MuiAccordion;
