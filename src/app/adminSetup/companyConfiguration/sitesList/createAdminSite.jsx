/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { darken } from '@mui/material/styles';
import CommonGrid from '../../../commonComponents/commonGrid';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import { SiteColumns } from '../../../commonComponents/gridColumns';
import {
  debounce,
  getAllowedCompanies,
  getListOfModuleOperations,
  queryGeneratorWithUtc,
} from '../../../util/appUtils';
import AuthService from '../../../util/authService';
import {
  getAllowedCompaniesInfo, getCountries,
  getSiteDetail,
  getSiteFilters,
  getSitesCount,
  getSitesList,
  getStates,
  resetCreateSite, resetUpdateSite,
  updateSite,
} from '../../setupService';
import AddSite from '../../siteConfiguration/addSite/addSite';
import locationFormModel from '../../siteConfiguration/addSite/formModel/siteFormModel';

const authService = AuthService();

const { formField } = locationFormModel;

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AdminSites = () => {
  const limit = 12;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [reload, setReload] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [addSiteModal, showAddSiteModal] = useState(false);
  const [viewId, setViewId] = useState(0);

  const [customVariable, setCustomVariable] = useState(false);
  const [rows, setRows] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [scrollTop, setScrollTop] = useState(0);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [editModeRow, setEditModeRow] = useState(false);
  const [openId, setOpen] = useState('');
  const [openStateId, setOpenState] = useState('');
  const [editModeType, setEditModeType] = useState('');

  const [countryIdValue, setCountryIdValue] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryKeyword, setCountryKeyword] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [stateKeyword, setStateKeyword] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    sitesListInfo, sitesCount, sitesCountLoading,
    siteFilters, siteDetails, updateSiteInfo, createSiteInfo, companyDetail, companyCategoriesInfo, countriesInfo, statesInfo,
  } = useSelector((state) => state.setup);
  const companies = getAllowedCompanies(userInfo);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && countryOpen) {
        await dispatch(getCountries(companies, appModels.COUNTRY, countryKeyword));
      }
    })();
  }, [userInfo, countryKeyword, countryOpen]);

  useEffect(() => {
    (async () => {
      if (stateOpen && ((countryIdValue && countryIdValue.id) || (siteDetails && siteDetails.data && siteDetails.data[0].country_id))) {
        const cid = countryIdValue && countryIdValue.id ? countryIdValue.id : siteDetails.data[0].country_id[0];
        await dispatch(getStates(appModels.STATES, cid, stateKeyword));
      }
    })();
  }, [stateOpen, countryIdValue, stateKeyword, siteDetails]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        code: true,
        city: true,
        state_id: true,
        country_id: true,
        street: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      dispatch(getSiteFilters([]));
      setCustomFilters([]);
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (editModeRow) {
      setEditModeType('row');
    } else {
      setEditModeType('');
    }
  }, [editModeRow]);

  const updateSiteData = useCallback((updatedRow, originalRow) => {
    if (JSON.stringify(updatedRow) !== JSON.stringify(originalRow)) {
      const data = updatedRow;
      const companyCategoryId = companyCategoriesInfo && companyCategoriesInfo.data
        && companyCategoriesInfo.data.length && companyCategoriesInfo.data.length > 0
        ? companyCategoriesInfo.data[0].id : false;
      const postDataValues = {
        name: data.name,
        // code: values.code,
        street: data.street,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        country_id: data.country_id ? data.country_id.id : '',
        state_id: data.state_id ? data.state_id.id : '',
        company_tz: data.company_tz ? data.company_tz.value : '',
        res_company_categ_id: companyCategoryId,
      };
      const postData = { ...postDataValues };
      dispatch(updateSite(data.id, appModels.COMPANY, postData));
    }
    return updatedRow;
  });

  useEffect(() => {
    if (
      userInfo.data
      && companyDetail
      && companyDetail.data
      && companyDetail.data.length
    ) {
      const customFiltersList = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : '';
      const pid = companyDetail.data[0].id;
      dispatch(
        getSitesCount(
          companies,
          appModels.COMPANY,
          pid,
          false,
          customFiltersList,
          globalFilter,
        ),
      );
    }
  }, [userInfo, companyDetail, siteFilters, globalFilter]);

  useEffect(() => {
    if (
      userInfo.data
      && companyDetail
      && companyDetail.data
      && companyDetail.data.length
    ) {
      const customFiltersList = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : '';
      const pid = companyDetail.data[0].id;
      dispatch(
        getSitesList(
          companies,
          appModels.COMPANY,
          limit,
          offset,
          pid,
          false,
          customFiltersList,
          sortBy,
          sortField,
          globalFilter,
        ),
      );
    }
  }, [
    userInfo,
    companyDetail,
    offset,
    sortBy,
    sortField,
    siteFilters,
    scrollTop,
    globalFilter,
  ]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((createSiteInfo && createSiteInfo.data) || (updateSiteInfo && updateSiteInfo.data)) && (companyDetail && companyDetail.data && companyDetail.data.length)) {
      const statusValues = [];
      const customFiltersVal = [];
      const pid = companyDetail.data[0].id;
      dispatch(getSitesCount(companies, appModels.COMPANY, pid, statusValues, customFiltersVal));
    }
  }, [userInfo, companyDetail, createSiteInfo, updateSiteInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((createSiteInfo && createSiteInfo.data) || (updateSiteInfo && updateSiteInfo.data)) && (companyDetail && companyDetail.data && companyDetail.data.length)) {
      const statusValues = [];
      const customFiltersVal = [];
      const pid = companyDetail.data[0].id;
      dispatch(getSitesList(companies, appModels.COMPANY, limit, offset, pid, statusValues, customFiltersVal, sortBy, sortField));
      dispatch(getAllowedCompaniesInfo(authService.getAccessToken()));
    }
  }, [userInfo, companyDetail, createSiteInfo, updateSiteInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (updateSiteInfo && updateSiteInfo.data)) {
      const id = siteDetails && siteDetails.data ? siteDetails.data[0].id : '';
      dispatch(getSiteDetail(id, appModels.COMPANY));
    }
  }, [userInfo, updateSiteInfo]);

  const totalDataCount = sitesCount && sitesCount.length ? sitesCount.length : 0;

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = siteFilters && siteFilters.customFilters ? siteFilters.customFilters : [];
      const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getSiteFilters(states, customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = siteFilters && siteFilters.customFilters ? siteFilters.customFilters : [];
      const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
      const customFilter = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getSiteFilters(states, customFilter));
    }
    setOffset(0); setPage(1);
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = siteFilters && siteFilters.customFilters ? siteFilters.customFilters : [];
      const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getSiteFilters(states, customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = siteFilters && siteFilters.customFilters ? siteFilters.customFilters : [];
      const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
      const customFilter = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getSiteFilters(states, customFilter));
    }
    setOffset(0); setPage(1);
  };

  const onReset = () => {
    dispatch(resetCreateSite());
    dispatch(resetUpdateSite());
  };

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const valueCheck = (dataArray) => {
    let returnValue = true;
    dataArray.map((item) => {
      if (!item.value) {
        returnValue = false;
      }
    });
    return returnValue;
  };

  const onFilterChange = (data) => {
    const fields = [
      'name',
      'code',
    ];
    let query = '"|",';

    const oldCustomFilters = siteFilters && siteFilters.customFilters
      ? siteFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      fields.filter((field) => {
        query += `["${field}","ilike","${data.quickFilterValues[0]}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }
    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'field'),
        );
        const customFiltersMerge = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getSiteFilters({ customFilters: customFiltersMerge }));
      }
    } else {
      const CustomFilters = [...dateFilters];
      dispatch(getSiteFilters({ customFilters: CustomFilters }));
    }
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [siteFilters],
  );

  let countryOptions = [];
  let stateOptions = [];

  if (countriesInfo && countriesInfo.loading) {
    countryOptions = [{ name: 'Loading..' }];
  }
  if (siteDetails && siteDetails.data && siteDetails.data[0].country_id) {
    const oldCatId = [{ id: siteDetails.data[0].country_id[0], name: siteDetails.data[0].country_id[1] }];
    const newArr = [...countryOptions, ...oldCatId];
    countryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (countriesInfo && countriesInfo.data) {
    const arr = [...countryOptions, ...countriesInfo.data];
    countryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (statesInfo && statesInfo.loading) {
    stateOptions = [{ name: 'Loading..' }];
  }
  if (siteDetails && siteDetails.data && siteDetails.data[0].state_id) {
    const oldCatId = [{ id: siteDetails.data[0].state_id[0], name: siteDetails.data[0].state_id[1] }];
    const newArr = [...stateOptions, ...oldCatId];
    stateOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (statesInfo && statesInfo.data) {
    const arr = [...stateOptions, ...statesInfo.data];
    stateOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const loading = (userInfo && userInfo.loading) || (sitesListInfo && sitesListInfo.loading) || (sitesCountLoading);

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          '& .MuiDataGrid-row.row--removed': {
            backgroundColor: (theme) => {
              if (theme.palette.mode === 'light') {
                return 'rgba(255, 170, 170, 0.3)';
              }
              return darken('rgba(255, 170, 170, 1)', 0.7);
            },
          },
          '& .MuiDataGrid-row.row--edited': {
            backgroundColor: (theme) => {
              if (theme.palette.mode === 'light') {
                return 'rgba(255, 254, 176, 0.3)';
              }
              return darken('rgba(255, 254, 176, 1)', 0.6);
            },
          },
        }}
        tableData={
          sitesListInfo && sitesListInfo.data && sitesListInfo.data.length
            ? sitesListInfo.data
            : []
        }
        columns={
          SiteColumns(
            editModeRow,
            countriesInfo,
            statesInfo,
            formField,
            setCountryOpen,
            countryOpen,
            countryKeyword,
            setCountryKeyword,
            setCountryIdValue,
            countryIdValue,
            countryOptions,
            setOpen,
            openId,
            setStateOpen,
            stateOpen,
            stateKeyword,
            setStateKeyword,
            stateOptions,
            setOpenState,
            openStateId,
          )
        }
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Sites List"
        listCount={totalDataCount}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        createOption={{
          enable: true,
          text: 'Add',
          func: () => showAddSiteModal(true),
        }}
        setRows={setRows}
        rows={rows}
        setEditModeRow={setEditModeRow}
        editModeRow={editModeRow}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={sitesListInfo && sitesListInfo.loading}
        err={sitesListInfo && sitesListInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewId={setViewId}
        setViewModal={setViewModal}
        editMode={editModeType}
        isToggleButton
        updateSiteData={updateSiteData}
        placeholderText="Search Name, Code ..."
        reload={{
          show: true,
          setReload,
          loading,
        }}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addSiteModal}
      >
        <DrawerHeader
          headerName="Create Incident"
          onClose={() => { dispatch(resetCreateSite()); showAddSiteModal(false); }}
        />
        <AddSite
          afterReset={() => { showAddSiteModal(false); onReset(); }}
        />
      </Drawer>
    </Box>
  );
};

export default AdminSites;
