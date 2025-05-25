import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';

const PlotTypeSelector = ({ plotType, handlePlotTypeChange, options, isDropdown }) => {
  // Capitalize the first letter of each option for display purposes
  const displayOptions = options.map((opt) => ({
    value: opt, // Keep the original lowercase value for API compatibility
    label: opt.charAt(0).toUpperCase() + opt.slice(1).replace('-', ' '), // e.g., "work-week" -> "Work Week"
  }));

  const handleChange = (value) => {
    handlePlotTypeChange(value); // Pass the value directly
  };

  return isDropdown ? (
    <Box sx={{ minWidth: 120, backgroundColor: 'black', borderRadius: 1 }}>
      <Button
        variant="outlined"
        onClick={() => {}}
        sx={{
          display: 'none', // Hide the button to use only for styling reference
        }}
      />
      <select
        value={plotType}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          color: 'white',
          backgroundColor: 'black',
          border: '1px solid gray',
          borderRadius: '4px',
          appearance: 'none',
          '&:hover': {
            borderColor: 'white',
          },
          '&:focus': {
            borderColor: '#1976D2',
            outline: 'none',
          },
        }}
      >
        {displayOptions.map(({ value, label }) => (
          <option key={value} value={value} style={{ backgroundColor: 'black', color: 'white' }}>
            {label}
          </option>
        ))}
      </select>
    </Box>
  ) : (
    <Box display="flex" gap={1} flexWrap="wrap">
      {displayOptions.map(({ value, label }) => (
        <Button
          key={value}
          onClick={() => handleChange(value)}
          variant={plotType === value ? 'contained' : 'outlined'}
          sx={{
            textTransform: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            backgroundColor: plotType === value ? '#0B694C' : 'black',
            color: plotType === value ? '#fff' : '#bbb',
            borderColor: plotType === value ? '#1976D2' : '#bbb',
            '&:hover': {
              backgroundColor: plotType === value ? '#0B694C' : '#444',
              borderColor: plotType === value ? '#0B694C' : '#888',
            },
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
};

PlotTypeSelector.propTypes = {
  plotType: PropTypes.string.isRequired,
  handlePlotTypeChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  isDropdown: PropTypes.bool.isRequired,
};

export default PlotTypeSelector;