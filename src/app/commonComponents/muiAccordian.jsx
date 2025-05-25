import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";

const MuiAccordion = (props) => {
  const [expanded, setExpanded] = useState(props.panel);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Accordion
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid #B7B7B7",
        margin: "0px !important",
        ".MuiAccordionDetails-root": {},
        ".MuiAccordionSummary-root": {},
      }}
      expanded={expanded === props.panel}
      onChange={handleChange(props.panel)}
    >
      <AccordionSummary
        expandIcon={<IoIosArrowDown color="#293644" size={20} />}
        aria-controls={`${props.panel}${"content"}`}
        id={`${props.panel}${"header"}`}
        sx={{
          height: "60px",
        }}
      >
        <Typography>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="select-by-date-box">{props.children}</div>
      </AccordionDetails>
    </Accordion >
  );
};

export default MuiAccordion;