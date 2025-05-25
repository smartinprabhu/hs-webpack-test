/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

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
import { infoValue } from '../../adminSetup/utils/utils';
import DialogHeader from '../dialogHeader';
import AdvancedSearchModal from './advancedSearchModalSelection';

import {
  generateErrorMessage,
  getAllCompanies,
  extractTextObject,
} from '../../util/appUtils';

const selectionBox = ({
  paramsSet, paramsValue, sx, callData, setDropdownKeyword1, dropdownOptions, advanceSearchCondition, dropdownsInfo, moduleName, category, optionDisplayName, columns, advanceSearchHeader, isRenderOption, advanceSearchFieldName, callDataFields, labelName, isCustomData, isRequired, infoText, indexValue, placeholderText, isMultipleCustom,
}) => {
  const dispatch = useDispatch();
  const limit = 10;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownkeyword, setDropdownKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);

  const fieldName = optionDisplayName || 'name';

  useEffect(() => {
    if (userInfo && userInfo.data && typeof dropdownOpen === 'number' && !isCustomData && !setDropdownKeyword1) {
      if (callDataFields) {
        dispatch(callData(companies, moduleName, dropdownkeyword, Object.values(callDataFields)[0] || false, Object.values(callDataFields)[1] || false, Object.values(callDataFields)[2] || false));
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
    if (setDropdownKeyword1) {
      setDropdownKeyword1(null);
    }
    paramsSet('');
    setDropdownOpen(false);
  };

  const onDropdownKeywordChange = (event) => {
    setDropdownKeyword(event.target.value);
    if (setDropdownKeyword1) {
      setDropdownKeyword1(event.target.value);
    }
  };

  const getRowValue = () => {
    let fieldValue = '';
    if (paramsValue && paramsValue.label) {
      fieldValue = paramsValue && paramsValue.label;
    } else if (paramsValue && paramsValue.name) {
      fieldValue = paramsValue && paramsValue.name;
    }
    return fieldValue;
  };

  const getRowValueCustom = () => {
    const fieldValue = paramsValue || (paramsValue && paramsValue.value) || '';
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
      {isCustomData
        ? (
          <Autocomplete
            sx={sx || {
              width: '100%',
            }}
            open={dropdownOpen}
            isRequired
            size="small"
            onOpen={() => {
              setDropdownOpen(true);
            }}
            onClose={() => {
              setDropdownOpen(false);
            }}
            onChange={(event, newValue) => {
              event.stopPropagation();
              paramsSet(newValue);
            }}
            value={getRowValueCustom()}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={(option) => option?.label || ''}
            options={Array.isArray(dropdownOptions) ? dropdownOptions : []}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                className="without-padding"
                placeholder={placeholderText || 'Select'}
                label={(
                  <>
                    {labelName}
                    {isRequired && (<span className="text-danger ml-1">*</span>)}
                    {infoText && infoValue(infoText)}
                  </>
                )}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        ) : isMultipleCustom
          ? (
            <Autocomplete
              sx={sx || {
                width: '100%',
              }}
              multiple
              open={dropdownOpen}
              isRequired
              size="small"
              filterSelectedOptions
              onOpen={() => {
                setDropdownOpen(true);
              }}
              onClose={() => {
                setDropdownOpen(false);
              }}
              onChange={(event, newValue) => {
                event.stopPropagation();
                paramsSet(newValue);
              }}
              value={getRowValueCustom() === '' ? [] : getRowValueCustom()}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={dropdownOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  className="without-padding"
                  placeholder={placeholderText || 'Select'}
                  label={(
                    <>
                      {labelName}
                      {isRequired && (<span className="text-danger ml-1">*</span>)}
                      {infoText && infoValue(infoText)}
                    </>
                )}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )
          : (
            <Autocomplete
              sx={sx || {
                width: '100%',
              }}
              open={dropdownOpen === indexValue}
              isRequired
              size="small"
              onOpen={() => {
                setDropdownOpen(indexValue);
                setDropdownKeyword('');
                if (setDropdownKeyword1) {
                  setDropdownKeyword1('');
                }
              }}
              onClose={() => {
                setDropdownOpen(false);
                setDropdownKeyword('');
                if (setDropdownKeyword1) {
                  setDropdownKeyword1('');
                }
              }}
              value={getRowValue()}
              loading={dropdownsInfo && dropdownsInfo.loading}
              isOptionEqualToValue={(option, value) => (value && value.length > 0 ? option[fieldName] === value[fieldName] : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option[fieldName])}
              onChange={(event, newValue) => {
                event.stopPropagation();
                paramsSet(newValue);
              }}
              apiError={(dropdownsInfo && dropdownsInfo.err) ? generateErrorMessage(dropdownsInfo) : false}
              renderOption={isRenderOption ? getSpaceRenderOption : false}
              options={dropdownOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onDropdownKeywordChange}
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  label={labelName ? (
                    <>
                      {labelName}
                      {isRequired && (<span className="text-danger ml-1">*</span>)}
                      {infoText && infoValue(infoText)}
                    </>
                  ) : ''}
                  className={((dropdownkeyword && dropdownkeyword.length > 0))
                    ? 'without-padding custom-icons w-100' : 'without-padding custom-icons2 w-100'}
                  placeholder={placeholderText || 'Search & Select'}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {dropdownsInfo && dropdownsInfo.loading && dropdownOpen === indexValue ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((dropdownkeyword && dropdownkeyword.length > 0) || paramsValue) && (
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
          )}
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
              paramsSet={paramsSet}
              fieldName={advanceSearchFieldName}
              advanceSearchCondition={advanceSearchCondition}
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
  placeholderText: false,
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
  isCustomData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  optionDisplayName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  advanceSearchHeader: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  placeholderText: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default selectionBox;
