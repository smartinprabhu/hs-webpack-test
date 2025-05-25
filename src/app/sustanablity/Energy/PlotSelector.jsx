import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl, Button, Box, Select, MenuItem, Typography,
} from '@mui/material';

const PlotTypeSelector = ({ plotType, handlePlotTypeChange, isDropdown }) => {
  const plotTypes = ['Day', 'Week', 'Month', 'Year'];

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }} padding="5px">
      {/* Left Side - Static "Energy" Label */}
      <Typography variant="h6" className="insights-head-plot">
        Energy Consumption Analysis
      </Typography>

      {/* Right Side - Plot Type Selector */}
      {isDropdown ? (
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, backgroundColor: 'black', borderRadius: 1 }}>
          <Select
            value={plotType}
            onChange={handlePlotTypeChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Plot Type' }}
            sx={{
              color: 'white',
              backgroundColor: 'black',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976D2' },
            }}
          >
            {plotTypes.map((type) => (
              <MenuItem
                key={type}
                value={type}
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  '&:hover': { backgroundColor: '#1976D2' },
                  '&.Mui-selected': { backgroundColor: '#1976D2', color: 'white' },
                }}
              >
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Box display="flex" gap={1} flexWrap="wrap">
          {plotTypes.map((type) => (
            <Button
              key={type}
              onClick={() => handlePlotTypeChange({ target: { value: type } })}
              variant={plotType === type ? 'contained' : 'outlined'}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',
                fontWeight: 'bold',
                backgroundColor: plotType === type ? '#0B694C' : 'black',
                color: plotType === type ? '#fff' : '#bbb',
                borderColor: plotType === type ? '#1976D2' : '#bbb',
                '&:hover': {
                  backgroundColor: plotType === type ? '#0B694C' : '#444',
                  borderColor: plotType === type ? '#0B694C' : '#888',
                },
              }}
            >
              {type}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

PlotTypeSelector.propTypes = {
  plotType: PropTypes.string.isRequired,
  handlePlotTypeChange: PropTypes.func.isRequired,
  isDropdown: PropTypes.bool.isRequired,
};

export default PlotTypeSelector;