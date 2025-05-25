/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  useGridApiRef,
} from '@mui/x-data-grid-pro';

import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  TextField,
  Dialog, DialogContent, DialogContentText,
  Box, Typography, ListItemText,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { IoCloseOutline } from 'react-icons/io5';
import DialogHeader from '../dialogHeader';
import AdvancedSearchModal from './advancedSearchModal';

import {
  generateErrorMessage,
  getAllCompanies,
  extractTextObject,
} from '../../util/appUtils';

const selectionBox = ({
  paramsEdit, callData, dropdownOptions, dropdownsInfo, moduleName, category, optionDisplayName, columns, advanceSearchHeader, isRenderOption, advanceSearchFieldName, callDataFields,
}) => {
  const dispatch = useDispatch();

  const apiRef = useGridApiRef();
  const limit = 10;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  const [openId, setOpen] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownkeyword, setDropdownKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);

  const fieldName = optionDisplayName || 'name';
  const isDropdown = true;

  useEffect(() => {
    if (userInfo && userInfo.data && dropdownOpen) {
      if ((category === 'Room' || (category === 'Space'))) {
        dispatch(callData(companies, moduleName, dropdownkeyword, category, 'DESC', 'create_date', limit, false, false, false, isDropdown));
      } else if (callDataFields) {
        dispatch(callData(companies, moduleName, dropdownkeyword, callDataFields, limit));
      } else {
        dispatch(callData(companies, moduleName, dropdownkeyword));
      }
    }
  }, [userInfo, dropdownkeyword, dropdownOpen]);

  const showAdvanceModal = () => {
    setExtraModal(true);
  };

  const onClear = () => {
    setDropdownKeyword(null);
    paramsEdit.api.setEditCellValue({
      id: paramsEdit.id,
      field: paramsEdit.field,
      value: '',
    });
    setDropdownOpen(false);
  };

  const onDropdownKeywordChange = (event) => {
    setDropdownKeyword(event.target.value);
  };

  const getRowValue = () => {
    let fieldValue = paramsEdit && paramsEdit.value && paramsEdit.value.id && paramsEdit.value[fieldName] ? paramsEdit.value[fieldName] : paramsEdit && paramsEdit.value && paramsEdit.value.id && paramsEdit.value.name ? paramsEdit.value.name : paramsEdit.value;
    if ((category === 'Room' || category === 'Space') && paramsEdit && paramsEdit.row && paramsEdit.row.id && extractTextObject(paramsEdit.row.parent_id?.asset_category_id) === 'Floor') {
      fieldValue = `${paramsEdit.row.parent_id.parent_id?.space_name}/${paramsEdit.row.parent_id.space_name}`;
    }
    return fieldValue;
  };

  const getSpaceRenderOption = (props, option) => (
    <ListItemText
      {...props}
      primary={(
        <Box>
          <Typography
            sx={{
              font: 'Suisse Intl',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            <span>
              {' '}
              {option.asset_category_id && extractTextObject(option.asset_category_id) === 'Floor' ? (
                `${option.parent_id?.space_name}/${option.space_name}`
              ) : option.space_name}
            </span>
          </Typography>
        </Box>
        )}
    />
  );

  return (
    <>
      <Autocomplete
        sx={{
          width: '100%',
        }}
        open={openId === paramsEdit.row.id}
        isRequired
        size="small"
        onOpen={() => {
          setDropdownOpen(true);
          setOpen(paramsEdit.row.id);
          setDropdownKeyword('');
        }}
        onClose={() => {
          setOpen('');
          setDropdownOpen(false);
          setDropdownKeyword('');
        }}
        value={getRowValue()}
        loading={dropdownsInfo && dropdownsInfo.loading && openId === paramsEdit.row.id}
        isOptionEqualToValue={(option, value) => (value && value.length > 0 ? option[fieldName] === value[fieldName] : '')}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option[fieldName])}
        onChange={(event, newValue) => {
          event.stopPropagation();
          paramsEdit.api.setEditCellValue({
            id: paramsEdit.id,
            field: paramsEdit.field,
            value: newValue,
          });
          if (category === 'Room' || category === 'Space') {
            paramsEdit.api.setEditCellValue({
              id: paramsEdit.id,
              field: 'floor_id',
              value: newValue && newValue.id ? newValue.id : '',
            });
          }
        }}
        apiError={(dropdownsInfo && dropdownsInfo.err) ? generateErrorMessage(dropdownsInfo) : false}
        renderOption={isRenderOption ? getSpaceRenderOption : false}
        options={dropdownOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={onDropdownKeywordChange}
            variant="standard"
            className={((dropdownkeyword && dropdownkeyword.length > 0))
              ? 'without-padding custom-icons w-100' : 'without-padding custom-icons2 w-100'}
            placeholder="Search & Select"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {dropdownsInfo && dropdownsInfo.loading && openId === paramsEdit.row.id ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    {((dropdownkeyword && dropdownkeyword.length > 0) || paramsEdit.value) && (
                    <IconButton>
                      <IoCloseOutline size={22} fontSize="small" onClick={onClear} />
                    </IconButton>
                    )}
                    { columns && advanceSearchHeader && (
                    <IconButton
                      aria-label="toggle search visibility"
                      onClick={showAdvanceModal}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                    )}
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
      />
      <Dialog
        maxWidth="lg"
        open={extraModal}
        onKeyDown={(e) => {
          if (e.code === 'Tab' || e.code === 'Enter') {
            e.stopPropagation();
          }
        }}
      >
        <DialogHeader title={advanceSearchHeader} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={moduleName}
              afterReset={() => { getRowValue(); setExtraModal(false); }}
              fields={columns}
              company={companies}
              paramsEdit={paramsEdit}
              fieldName={advanceSearchFieldName}
              optionDisplayName={optionDisplayName}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

selectionBox.defaultProps = {
  paramsEdit: false,
  optionDisplayName: false,
  columns: false,
  advanceSearchHeader: false,
  dropdownOptions: [],
};

selectionBox.propTypes = {
  paramsEdit: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  dropdownOptions: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]),
  columns: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]),
  moduleName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  optionDisplayName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  advanceSearchHeader: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  callDataExtraParams: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default selectionBox;
