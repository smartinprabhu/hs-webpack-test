/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import { CircularProgress } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormFeedback
  ,
} from 'reactstrap';
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import {
  Autocomplete,
  Box,
  Drawer,
  FormGroup,
  IconButton,
  TextField,
} from "@mui/material";

import { getSpaceAllSearchList } from '../../../../helpdesk/ticketService';
import {
  generateErrorMessage,
  getAllCompanies,
  getArrayFromValuesById, getColumnArrayById, isArrayColumnExists,
} from '../../../../util/appUtils';
import {
  getAssetAvailability, resetAssetAvailability, availabilityReportFilters
} from '../../../equipmentService';
import SearchModalSingle from './searchModalSingle';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const SideFilterChecklist = ({ filterOpen, setFilterOpen, resetFilters, setResetFilters }) => {
  const dispatch = useDispatch();
  const [spaceCollapse, setSpaceCollapse] = useState(true);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [spaceValue, setSpaceValue] = useState('');

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [customFilters, setCustomFilters] = useState('');
  const {
    availabilityReportFiltersInfo
  } = useSelector((state) => state.equipment);

  const { spaceInfoList } = useSelector((state) => state.ticket);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    setSpaceKeyword('');
    setSpaceValue([]);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'space_id');
    setCustomFilters(customFiltersOthers ? customFiltersOthers : [])
    dispatch(resetAssetAvailability());
    setResetFilters(false)
    dispatch(availabilityReportFilters([]))
  }, [])

  useEffect(() => {
    if (spaceInfoList && spaceInfoList.data && spaceInfoList.data.length && spaceOpen) {
      setSpaceOptions(getArrayFromValuesById(spaceInfoList.data, isAssociativeArray(spaceValue || []), 'id'));
    } else if (spaceInfoList && spaceInfoList.loading) {
      setSpaceOptions([{ path_name: 'Loading...' }]);
    } else {
      setSpaceOptions([]);
    }
  }, [spaceInfoList, spaceOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && spaceOpen) {
      const keywordTrim = spaceKeyword ? encodeURIComponent(spaceKeyword.trim()) : '';
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, keywordTrim));
    }
  }, [userInfo, spaceKeyword, spaceOpen]);

  const getFindData = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.title === field)
    return result ? result : ''
  }

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && availabilityReportFiltersInfo && availabilityReportFiltersInfo.customFilters && availabilityReportFiltersInfo.customFilters.length) {
      const spaceId = getFindData('By Location') && getFindData('By Location').id;
      if (spaceId && spaceId !== '') {
        dispatch(getAssetAvailability(spaceId));
      }
    }
  }, [availabilityReportFiltersInfo]);

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    if (data.name || data.space_name) {
      const filters = [{
        key: 'space_id', value: data.name || data.space_name, label: 'By Location', type: 'text', id: data.id, name: data.name || data.space_name, title: 'By Location', path_name: data.path_name
      }];
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'space_id');
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    }
  };

  const onSpaceClear = () => {
    setSpaceKeyword('');
    setSpaceValue([]);
    dispatch(resetAssetAvailability());
    setSpaceOpen(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'space_id');
    setCustomFilters(customFiltersOthers ? customFiltersOthers : [])
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Locations');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'path_name', 'space_name']);
  };

  useEffect(() => {
    if (resetFilters) {
      setSpaceKeyword('');
      setSpaceValue([]);
      setFilterOpen(false);
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'space_id');
      setCustomFilters(customFiltersOthers ? customFiltersOthers : [])
      dispatch(resetAssetAvailability());
      setResetFilters(false)
      dispatch(availabilityReportFilters([]))
    }
  }, [resetFilters])

  const onApplyFilters = () => {
    setFilterOpen(false)
    dispatch(resetAssetAvailability());
    dispatch(availabilityReportFilters(customFilters))
  }

  const onCloseFilters = () => {
    setFilterOpen(false)
    setCustomFilters(availabilityReportFiltersInfo.customFilters)
  }

  const filtersComponentsArray = [
    {
      title: 'BY LOCATION',
      component:
        <FormGroup>
          <Autocomplete
            // multiple
            filterSelectedOptions
            limitTags={3}
            id="tags-filledspace"
            name="space"
            open={spaceOpen}
            size="small"
            onOpen={() => {
              setSpaceOpen(true);
              setSpaceKeyword('');
            }}
            onClose={() => {
              setSpaceOpen(false);
              setSpaceKeyword('');
            }}
            value={getFindData('By Location')}
            //disableClearable={!(spaceValue.length)}
            onChange={(e, options) => onSpaceChange(options)}
            getOptionSelected={(option, value) => option.name === value.path_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            options={spaceOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                value={spaceKeyword}
                className={(getFindData('By Location') && getFindData('By Location').id)
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setSpaceKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {getFindData('By Location') && getFindData('By Location').id && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onSpaceClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showSpaceModal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
          {(spaceInfoList && spaceInfoList.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(spaceInfoList)}</FormFeedback>
          )}
        </FormGroup>
    }
  ]
  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: "30%" } }} >
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
        />
      </Drawer>
      <Dialog size="lg" open={extraMultipleModal} fullWidth>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#F6F8FA",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                fontFamily: "Suisse Intl",
              }}
            >
              <SearchModalSingle
                modelName={modelValue}
                modalName={modalName}
                afterReset={() => { setExtraMultipleModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldValue={otherFieldValue}
                setSpaceValue={(options) => onSpaceChange(options)}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideFilterChecklist;
