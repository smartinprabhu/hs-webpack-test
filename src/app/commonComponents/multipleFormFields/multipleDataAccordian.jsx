/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-indexForm-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion, AccordionDetails, AccordionSummary, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { AddThemeColor } from '../../themes/theme';

const AccordianForm = (props) => {
  const {
    indexForm, summary, detail, className, summarySx, defaultExpanded, isTextButton
  } = props;
  const [expanded, setExpanded] = React.useState(defaultExpanded || false);

  const handleChange = (panel) => {
    setExpanded(panel === expanded ? false : panel);
  };

  return (
    <>
      <Accordion
        className={className || 'm-3'}
        sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}
        expanded={expanded === `panel${indexForm}`}
      >
        <AccordionSummary
          sx={summarySx || { margin: '0px' }}
          className="border"
          expandIcon={isTextButton ? (
            <Typography
              sx={AddThemeColor({
                pointerEvents: 'auto',
                transform: 'none !important',
                fontSize: '12px !important',
                fontWeight: '600',
                marginTop: '35px',
                marginLeft: '30px',
              })}
              onClick={() => { handleChange(`panel${indexForm}`); }}
            >
              {expanded ? 'Show Less' : 'Show More'}
            </Typography>
          ) : (
            <ExpandMoreIcon
              sx={{
                pointerEvents: 'auto',
              }}
              onClick={() => { handleChange(`panel${indexForm}`); }}
            />
          )}

          aria-controls={`${indexForm}panel1-content`}
          id={`${indexForm}panel1-header`}
        >
          {summary}
        </AccordionSummary>
        <AccordionDetails className="ml-2 mr-2">
          {detail && detail.length && detail.map((hd) => (
            <>
              {hd.component}
            </>
          ))}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

AccordianForm.defaultProps = {
  className: '',
  defaultExpanded: false,
  isTextButton: false,
};

AccordianForm.propTypes = {
  indexForm: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  summary: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  className: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  defaultExpanded: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  isTextButton: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
};

export default AccordianForm;
