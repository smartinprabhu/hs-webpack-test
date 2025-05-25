/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import SiteCheck from '@images/icons/siteBlue.svg';
import CommonGrid from '../../../commonComponents/commonGridEditable';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import { SiteColumns } from '../../../commonComponents/gridColumnsEditable';
import { updateHeaderData } from '../../../core/header/actions';
import {
  debounce,
  formatFilterData,
  generateErrorMessage,
  getAllowedCompanies,
  getDateAndTimeForDifferentTimeZones,
  getListOfModuleOperations,
  queryGeneratorWithUtc,
  valueCheck,
  truncate,
  getActiveTab,
  getHeaderTabs,
  getTabs,
} from '../../../util/appUtils';
import SiteDetail from '../../../siteOnboarding/siteDetails/siteDetail';
import actionCodes from '../../data/actionCodes.json';
import {
  getCountries,
  getSiteExport,
  getSiteFilters,
  getSitesCount,
  getSitesList,
  getStates,
  resetCreateSite,
  resetUpdateSite,
} from '../../setupService';
import {
  getSiteDetail,
  resetAddSiteInfo,
} from '../../../siteOnboarding/siteService';
import AddSite from '../../../siteOnboarding/addSite';
import locationFormModel from '../../siteConfiguration/addSite/formModel/siteFormModel';
import AdminSideNavCompany from '../../navbar/navlistCompany.json';
import AdminSideNavSite from '../../navbar/navlistSite.json';

const { formField } = locationFormModel;

const appModels = require('../../../util/appModels').default;

const AdminSites = () => {
  const [limit, setLimit] = useState(10);
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const { sortedValue } = useSelector((state) => state.equipment);
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [countryIdValue, setCountryIdValue] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryKeyword, setCountryKeyword] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [stateKeyword, setStateKeyword] = useState('');
  const [openId, setOpen] = useState('');
  const [openStateId, setOpenState] = useState('');

  const [addSiteModal, showAddSiteModal] = useState(false);
  const [editModeRow, setEditModeRow] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [rowselected, setRowselected] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');
  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    sitesListInfo, sitesCount, sitesCountLoading, siteExportInfo,
    siteFilters, siteDetails, companyDetail, countriesInfo, statesInfo,
  } = useSelector((state) => state.setup);
  const {
    updateBulkInfo, createBulkInfo,
  } = useSelector((state) => state.ticket);
  const {
    addSiteInfo,
  } = useSelector((state) => state.site);
  const companies = getAllowedCompanies(userInfo);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const totalDataCount = sitesCount && sitesCount.length ? sitesCount.length : 0;

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, userInfo && userInfo.data && userInfo.data.is_parent ? AdminSideNavCompany.data : AdminSideNavSite.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Sites',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Sites',
        link: '/setup-site',
        headerTabs: tabs.filter((e) => e),
        activeTab,
        dispatchFunc: () => getSiteFilters([]),
      }),
    );
  }, [activeTab]);

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(sitesListInfo && sitesListInfo.data && sitesListInfo.data.length && sitesListInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(sitesListInfo && sitesListInfo.data && sitesListInfo.data.length && sitesListInfo.data[sitesListInfo.data.length - 1].id);
    }
  }, [sitesListInfo]);

  const handlePageChangeDetail = (page, type) => {
    setDetailArrowNext('');
    setDetailArrowPrev('');
    const nPages = Math.ceil(totalDataCount / limit);
    if (type === 'Next' && page !== nPages) {
      const offsetValue = page * limit;
      setOffset(offsetValue);
      setPage(page);
      setDetailArrowNext(Math.random());
    }
    if (type === 'Prev' && page !== 1) {
      const offsetValue = ((page - 2) * limit);
      setOffset(offsetValue);
      setPage(page - 2);
      setDetailArrowPrev(Math.random());
    }
  };

  const handlePageChange = (data) => {
    const { page, pageSize } = data;
    if (pageSize !== limit) {
      setLimit(pageSize);
    }
    const offsetValue = page * pageSize;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (sitesListInfo && sitesListInfo.data) {
      setRows(sitesListInfo.data);
    } else {
      setRows([]);
    }
  }, [sitesListInfo]);

  const onReset = () => {
    if (document.getElementById('siteForm')) {
      document.getElementById('siteForm').reset();
    }
    dispatch(resetAddSiteInfo());
    dispatch(resetCreateSite());
    dispatch(resetUpdateSite());
  };

  const onAddClose = () => {
    if (addSiteInfo && addSiteInfo.data) {
      if (document.getElementById('siteForm')) {
        document.getElementById('siteForm').reset();
      }
      dispatch(resetAddSiteInfo());
      dispatch(resetCreateSite());
      dispatch(resetUpdateSite());
    }
  };

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
        country_id: true,
        state_id: true,
        street: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      dispatch(getSiteFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if ((updateBulkInfo && updateBulkInfo.data)) {
      const customFiltersList = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : '';
      const pid = userInfo.data.company.id;
      dispatch(
        getSitesList(
          companies,
          appModels.COMPANY,
          limit,
          0,
          pid,
          false,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [updateBulkInfo]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && sitesCount
      && sitesCount.length && startExport
    ) {
      const offsetValue = 0;
      const pid = userInfo.data.company.id;
      const customFiltersQuery = siteFilters && siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters)
        : '';
      dispatch(
        getSiteExport(
          companies,
          appModels.COMPANY,
          sitesCount.length,
          0,
          pid,
          false,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          rowselected,
          globalFilter,
        ),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if (
      userInfo.data
    ) {
      const customFiltersList = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : '';
      const pid = userInfo.data.company.id;
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
  }, [userInfo, siteFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (
      userInfo.data
    ) {
      const customFiltersList = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : '';
      const pid = userInfo.data.company.id;
      dispatch(
        getSitesList(
          companies,
          appModels.COMPANY,
          limit,
          0,
          pid,
          false,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [
    userInfo, siteFilters.customFilters, limit, offset, sortedValue.sortBy, sortedValue.sortField, globalFilter,
  ]);

  useEffect(() => {
    if (addSiteInfo && addSiteInfo.data) {
      const customFiltersList = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : '';
      const pid = userInfo.data.company.id;
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
      dispatch(
        getSitesList(
          companies,
          appModels.COMPANY,
          limit,
          0,
          pid,
          false,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [addSiteInfo]);

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

  const loadingData = (userInfo && userInfo.loading) || (sitesListInfo && sitesListInfo.loading) || (sitesCountLoading) || (companyDetail && companyDetail.loading);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    if (viewId) {
      dispatch(getSiteDetail(viewId, appModels.COMPANY));
    }
  }, [viewId]);

  const siteData = siteDetails && (siteDetails.data && siteDetails.data.length > 0) ? siteDetails.data[0] : '';
  const siteName = siteData?.name || 'Sites';
  const drawertitleName = (
    <Tooltip title={siteName} placement="right">
      <span>{truncate(siteName, 50)}</span>
    </Tooltip>
  );

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const countrySelection = (paramsEdit) => (
    <Autocomplete
      sx={{
        width: '100%',
      }}
      name={formField.countryId.name}
      label={formField.countryId.label}
      open={openId === paramsEdit.row.id}
      isRequired
      size="small"
      onOpen={() => {
        setCountryOpen(true);
        setOpen(paramsEdit.row.id);
        setCountryKeyword('');
      }}
      onClose={() => {
        setOpen('');
        setCountryOpen(false);
        setCountryKeyword('');
      }}
      oldValue={getOldData(paramsEdit.value)}
      value={paramsEdit.value}
      loading={countriesInfo && countriesInfo.loading && openId === paramsEdit.row.id}
      getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={countryOptions}
      onChange={(event, newValue) => {
        setCountryIdValue(newValue);
        event.stopPropagation();
        paramsEdit.api.setEditCellValue({
          id: paramsEdit.id,
          field: paramsEdit.field,
          value: newValue,
        });
      }}
      apiError={(countriesInfo && countriesInfo.err) ? generateErrorMessage(countriesInfo) : false}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(event) => {
            setCountryKeyword(event.target.value);
          }}
          variant="standard"
          className={((getOldData(params.country_id)) || (params.country_id && params.country_id.id) || (countryKeyword && countryKeyword.length > 0))
            ? 'without-padding custom-icons w-100' : 'without-padding custom-icons2 w-100'}
          placeholder="Search & Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {countriesInfo && countriesInfo.loading && openId === paramsEdit.row.id ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((getOldData(params.country_id)) || (params.country_id && params.country_id.id) || (countryKeyword && countryKeyword.length > 0)) && (
                    <IconButton>
                      <IoCloseOutline size={22} fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
  );

  const stateSelection = (paramsEdit) => (
    <Autocomplete
      sx={{
        width: '100%',
      }}
      name={formField.stateId.name}
      label={formField.stateId.label}
      open={openStateId === paramsEdit.row.id}
      isRequired
      size="small"
      onOpen={() => {
        setStateOpen(true);
        setOpenState(paramsEdit.row.id);
        setStateKeyword('');
      }}
      onClose={() => {
        setOpenState('');
        setStateOpen(false);
        setStateKeyword('');
      }}
      oldValue={getOldData(paramsEdit.value)}
      value={paramsEdit.value}
      loading={statesInfo && statesInfo.loading && openStateId === paramsEdit.row.id}
      getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={stateOptions}
      onChange={(event, newValue) => {
        event.stopPropagation();
        paramsEdit.api.setEditCellValue({
          id: paramsEdit.id,
          field: paramsEdit.field,
          value: newValue,
        });
      }}
      apiError={(statesInfo && statesInfo.err) ? generateErrorMessage(statesInfo) : false}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(event) => {
            setStateKeyword(event.target.value);
          }}
          variant="standard"
          className={((getOldData(params.state_id)) || (params.state_id && params.state_id.id) || (stateKeyword && stateKeyword.length > 0))
            ? 'without-padding custom-icons w-100' : 'without-padding custom-icons2 w-100'}
          placeholder="Search & Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {statesInfo && statesInfo.loading && openStateId === paramsEdit.row.id ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((getOldData(params.state_id)) || (params.state_id && params.state_id.id) || (stateKeyword && stateKeyword.length > 0)) && (
                    <IconButton>
                      <IoCloseOutline size={22} fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
  );

  const tableColumns = SiteColumns(
    editModeRow,
    countrySelection,
    stateSelection,
  );

  const handleRadioboxChange = (event) => {
    const { value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
        header: 'Date Filter',
        id: value,
      },
    ];
    const oldCustomFilters = siteFilters && siteFilters.customFilters
      ? siteFilters.customFilters
      : [];
    const customFilters1 = [
      ...(oldCustomFilters.length > 0
        ? oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        )
        : ''),
      ...filters,
    ];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    setFilterText(formatFilterData(customFilters1, globalvalue));
    dispatch(getSiteFilters([], customFilters1));
    setOffset(0);
    setPage(0);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];
    const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
      userInfo,
      startDate,
      endDate,
    );

    if (startDate && endDate) {
      start = getDateRangeObj[0];
      end = getDateRangeObj[1];
    }
    if (startDate && endDate) {
      filters = [
        {
          key: value,
          value,
          label: value,
          type: 'customdate',
          start,
          end,
          header: 'Date Filter',
          id: value,
        },
      ];
    }
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = siteFilters && siteFilters.customFilters
        ? siteFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   siteFilters && siteFilters.states ? siteFilters.states : [],
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getSiteFilters([], filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = siteFilters && siteFilters.customFilters
        ? siteFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   siteFilters && siteFilters.states ? siteFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getSiteFilters([], filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'code',
      'city',
      'country_id',
      'state_id',
      'street',
    ];
    let query = '"|",';

    const oldCustomFilters = siteFilters && siteFilters.customFilters
      ? siteFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
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
        data.items.map((dataItem) => {
          const label = tableColumns.find((column) => column.field === dataItem.field);
          dataItem.value = dataItem?.value ? dataItem.value : '';
          dataItem.header = label?.headerName;
        });
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'header'),
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getSiteFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getSiteFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [siteFilters],
  );

  return (
    <Box className="insights-box">
      <CommonGrid
        className="tickets-table"
        tableData={
          sitesListInfo && sitesListInfo.data && sitesListInfo.data.length
            ? sitesListInfo.data
            : []
        }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        appModelsName={appModels.COMPANY}
        loadingData={loadingData}
        setEditModeRow={setEditModeRow}
        editModeRow={editModeRow}
        dependencyColumsReload={[sitesListInfo, countrySelection, stateSelection]}
        createOption={{
          enable: allowedOperations.includes(actionCodes['Create New Site']),
          text: 'Add',
          func: () => showAddSiteModal(true),
        }}
        moduleName="Sites List"
        trimFields={['name']}
        deleteFieldsWhenUpdate={['code']}
        listCount={totalDataCount}
        handlePageChange={handlePageChange}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        reload={{
          show: true,
          setReload,
          loadingData,
        }}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        setStartExport={setStartExport}
        onFilterChanges={debouncedOnFilterChange}
        filters={filterText}
        exportInfo={siteExportInfo}
        exportFileName="Sites"
        // setViewId={setViewId}
        // setViewModal={setViewModal}
        setRowselected={setRowselected}
        rowselected={rowselected}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addSiteModal}
      >
        <DrawerHeader
          headerName="Add Site"
          imagePath={false}
          onClose={() => { showAddSiteModal(false); onReset(); }}
        />

        <AddSite
          closeModal={() => onAddClose()}
          afterReset={() => { showAddSiteModal(false); onReset(); }}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName={siteDetails && (siteDetails.data && siteDetails.data.length > 0 && !siteDetails.loading)
            ? drawertitleName : 'Site'}
          imagePath={SiteCheck}
          onClose={onViewReset}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', sitesListInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', sitesListInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', sitesListInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', sitesListInfo));
          }}
        />
        <SiteDetail />
      </Drawer>
    </Box>
  );
};

export default AdminSites;
