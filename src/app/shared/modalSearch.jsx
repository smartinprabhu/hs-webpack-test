/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Input, FormControl,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

const ModalSearch = (props) => {
  const {
    searchValue, onClear, onSearch, onSearchChange,
  } = props;

  return (
    <FormControl variant="standard">
      <Input
        id="standard-adornment-password"
        type="text"
        name="search"
        placeholder="Search"
        value={searchValue}
        onChange={onSearchChange}
        onKeyDown={onSearchChange}
        endAdornment={(
          <InputAdornment position="end">
            {searchValue && (
              <>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onClear()}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="toggle search visibility"
                  onClick={() => onSearch()}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </InputAdornment>
            )}
      />
    </FormControl>
  );
};

ModalSearch.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default ModalSearch;
