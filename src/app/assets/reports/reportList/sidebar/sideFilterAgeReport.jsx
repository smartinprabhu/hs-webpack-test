/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect, useMemo } from 'react';
import {
  FormFeedback,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import {
  Autocomplete,
  Box,
  Drawer,
  FormGroup,
  IconButton,
  TextField,
} from "@mui/material";

import {
  getPartners, getWarrentyAgeReport, resetWarrentyAgeReport, warrantyReportFilters
} from '../../../equipmentService';
import {
  getAllCompanies, getArrayFromValuesById, isAssociativeArray, generateErrorMessage, getFilterData
} from '../../../../util/appUtils';
import SearchModalMultiple from './searchModalMultiple';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const SideFilterAgeReport = ({ filterOpen, setFilterOpen, resetFilters, setResetFilters }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [vendorId, setVendorId] = useState([]);
  const [vendorCollapse, setVendorCollapse] = useState(true);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'display_name', 'email', 'mobile', 'name']);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { warrantyAgeFilterInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    setVendorId([]);
    setVendorKeyword('');
    setResetFilters(false)
    dispatch(resetWarrentyAgeReport())
    //  dispatch(warrantyReportFilters([]));
  }, [])

  useMemo(() => {
    const fieldsNew = ['name', 'location_id', 'maintenance_team_id', 'warranty_end_date', 'vendor_id'];
    let searchValueMultiple = `[["company_id","in",[${companies}]],["is_itasset","=",false],["warranty_end_date","!=",false]`;
    if (getFilterData(warrantyAgeFilterInfo.customFilters, 'By Vendor') && getFilterData(warrantyAgeFilterInfo.customFilters, 'By Vendor').length) {
      const vendor = isAssociativeArray(getFilterData(warrantyAgeFilterInfo.customFilters, 'By Vendor'));
      searchValueMultiple = `${searchValueMultiple},["vendor_id","in",[${vendor}]]`;
    }
    searchValueMultiple = `${searchValueMultiple}]`;
    dispatch(getWarrentyAgeReport(companies, appModels.EQUIPMENT, 800, 0, fieldsNew, searchValueMultiple, true));
  }, [warrantyAgeFilterInfo]);

  useEffect(() => {
    if (partnersInfo && partnersInfo.data && partnersInfo.data.length && vendorOpen) {
      setVendorOptions(getArrayFromValuesById(partnersInfo.data, isAssociativeArray(vendorId || []), 'id'));
    } else if (partnersInfo && partnersInfo.loading) {
      setVendorOptions([{ display_name: 'Loading...' }]);
    } else {
      setVendorOptions([]);
    }
  }, [partnersInfo, vendorOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', vendorKeyword));
      }
    })();
  }, [userInfo, vendorKeyword, vendorOpen]);

  const handleResetClick = (e) => {
    e.preventDefault();
    setVendorId([]);
  };

  useEffect(() => {
    if (resetFilters) {
      setVendorId([]);
      setVendorKeyword('');
      setResetFilters(false)
      dispatch(resetWarrentyAgeReport())
      dispatch(warrantyReportFilters([]))
    }
  }, [resetFilters])

  const onVendorChange = (data) => {
    setVendorId(data);
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    let filters = []
    if (data && data.length) {
      data.map((option) => {
        const obj = {
          key: 'vendor_id', display_name: option.display_name, value: option.name, label: 'By Vendor', type: 'text', id: option.id, name: option.name, title: 'By Vendor'
        };
        filters.push(obj)
      })
    }
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'vendor_id');
    const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
    setCustomFilters(customFiltersList)
  };

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const onVendorKeywordClear = () => {
    setVendorKeyword('');
    setVendorId([]);
    setVendorOpen(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'vendor_id');
    setCustomFilters(customFiltersOthers ? customFiltersOthers : [])
  };

  const showVendorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendor List');
    setOtherFieldName('supplier');
    setOtherFieldValue(true);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'display_name', 'email', 'mobile', 'name']);
    setExtraModal(true);
  };

  const onVendorChangeModal = (data) => {
    setVendorId(data);
    dispatch(resetWarrentyAgeReport());
  };

  const filtersComponentsArray = [
    {
      title: 'BY VENDOR',
      component:
        <FormGroup>
          <Autocomplete
            multiple
            filterSelectedOptions
            limitTags={3}
            id="tags-filledvendor"
            name={vendorId.name}
            label={vendorId.label}
            formGroupClassName="m-1"
            open={vendorOpen}
            size="small"
            onOpen={() => {
              setVendorOpen(true);
              setVendorKeyword('');
            }}
            onClose={() => {
              setVendorOpen(false);
              setVendorKeyword('');
            }}
            classes={{
              option: classes.option,
            }}
            value={vendorId ? vendorId : getFilterData(customFilters, 'By Vendor')}
            loading={partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.display_name === value.display_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
            onChange={(e, options, action, value) => onVendorChange(options, action, value)}
            options={vendorOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onVendorKeywordChange}
                variant="outlined"
                value={vendorKeyword}
                className={(getFilterData(customFilters, 'By Vendor') && getFilterData(customFilters, 'By Vendor').length > 0)
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading && vendorOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {vendorId && vendorId.length > 0 && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onVendorKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showVendorModal}
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
          {(partnersInfo && partnersInfo.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(partnersInfo)}</FormFeedback>
          )}
        </FormGroup>
    }
  ]

  const onApplyFilters = () => {
    dispatch(resetWarrentyAgeReport());
    setFilterOpen(false)
    dispatch(warrantyReportFilters(customFilters))
  }

  const onCloseFilters = () => {
    setCustomFilters(warrantyAgeFilterInfo.customFilters)
    setFilterOpen(false)
  }
  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: "30%" } }} >
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
        />
      </Drawer>
      <Dialog size="lg" open={extraModal} fullWidth>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
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
              <SearchModalMultiple
                modelName={modelValue}
                afterReset={() => { setExtraModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldName={otherFieldName}
                otherFieldValue={otherFieldValue}
                onCategoryChange={(data) => onVendorChange(data)}
                oldCategoryValues={getFilterData(customFilters, 'By Vendor')}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideFilterAgeReport;
