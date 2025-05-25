/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import { PropTypes } from 'prop-types';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

// render

export const ColumnFilter = ({ column }) => {
  const { filterVal, setFilter } = column;
  const [value, setValue] = useState(filterVal);

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 500);
  ColumnFilter.propTypes = {
    filterVal: PropTypes.string,
    setFilter: PropTypes.func,
  };
  return (
    <TextField
      value={filterVal}
      className="input-search p-2 min-width-100"
      placeholder="Search..."
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment>
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

// export default ColumnFilter;
