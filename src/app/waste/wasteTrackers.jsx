/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import { Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';

import ComplianceCheck from '@images/icons/complianceCheck.svg';
import { Box } from '@mui/system';
import { AddThemeBackgroundColor } from '../themes/theme';
import DrawerHeader from '../commonComponents/drawerHeader';

import CommonGrid from '../commonComponents/commonGrid';
import { WasteColumns } from '../commonComponents/gridColumns';
import {
  getActiveTab,
  getAllowedCompanies,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getTabs,
  getDynamicTabs,
  queryGeneratorWithUtc,
  debounce,
  formatFilterData,
  valueCheck,
} from '../util/appUtils';
import {
  getComplianceCount,
  getComplianceDetail,
  getComplianceExport,
  getComplianceFilters,
  getComplianceList,
  resetAddComplianceInfo,
  resetComplianceTemplate,
  getComplianceLogs,
} from './complianceService';
import customData from './data/customData.json';
// import ComplianceDetail from './complianceDetails/complianceDetail';
import ComplianceDetailView from './complianceDetailView/complianceDetails';
import actionCodes from './data/complianceActionCodes.json';
import CreateCompliance from './forms/createCompliance';

import { updateHeaderData } from '../core/header/actions';
import { WasteModule } from '../util/field';
import wasteSideNav from './navbar/navlist.json';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const BuildingCompliance = () => {
  const limit = 10;
  const subMenu = 'Compliance';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(
    customData && customData.listfieldsShows ? customData.listfieldsShows : [],
  );
  const [customFilters, setCustomFilters] = useState([]);

  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);

  const [editId, setEditId] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    complianceCount,
    complianceInfo,
    complianceCountLoading,
    complianceFilters,
    complianceDetails,
    addComplianceInfo,
    categoryGroupInfo,
    stateChangeInfo,
    complianceExportInfo,
  } = useSelector((state) => state.waste);
  const { sortedValue } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { deleteInfo } = useSelector((state) => state.pantry);
  const listHead = 'Compliance Obligation :';

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Waste Tracker',
    'code',
  );

  const isCreatable = allowedOperations.includes(
    actionCodes['Add Compliance Obligation'],
  );
  const isEditable = allowedOperations.includes(
    actionCodes['Edit Compliance Obligation'],
  );
  // const isViewable = allowedOperations.includes(actionCodes['View Compliance Obligation']);
  const { pinEnableData } = useSelector((state) => state.auth);

  const isDeleteable = allowedOperations.includes(
    actionCodes['Delete Compliance Obligation'],
  );

  useEffect(() => {
    if (
      (addComplianceInfo && addComplianceInfo.data)
      || (tenantUpdateInfo && tenantUpdateInfo.data)
      || (deleteInfo && deleteInfo.data)
      || (stateChangeInfo && stateChangeInfo.data)
    ) {
      const customFiltersList = complianceFilters.customFilters
        ? queryGeneratorWithUtc(
          complianceFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getComplianceCount(
          companies,
          appModels.WASTETRACKER,
          customFiltersList,
          globalFilter,
        ),
      );
      dispatch(
        getComplianceList(
          companies,
          appModels.WASTETRACKER,
          limit,
          offset,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [
    addComplianceInfo,
    tenantUpdateInfo,
    deleteInfo,
    stateChangeInfo,
  ]);

  useEffect(() => {
    if (complianceFilters && complianceFilters.customFilters) {
      setCustomFilters(complianceFilters.customFilters);
    }
  }, [complianceFilters]);

  useEffect(() => {
    const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
    if (userCompanyId) {
      dispatch(getComplianceLogs(userCompanyId, appModels.WASTETRACKERCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (reload) {
      dispatch(getComplianceFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      setGlobalvalue('');
      const customFiltersList = '';
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = complianceFilters.customFilters
        ? queryGeneratorWithUtc(
          complianceFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getComplianceCount(
          companies,
          appModels.WASTETRACKER,
          customFiltersList,
          globalFilter,
        ),
      );
      dispatch(
        getComplianceList(
          companies,
          appModels.WASTETRACKER,
          limit,
          offset,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, complianceFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (viewId) {
      dispatch(getComplianceDetail(viewId, appModels.WASTETRACKER));
    }
  }, [viewId]);

  // useEffect(() => {
  //   if (
  //     addComplianceInfo
  //     && addComplianceInfo.data
  //     && addComplianceInfo.data.length
  //     && !viewId
  //   ) {
  //     dispatch(
  //       getComplianceDetail(
  //         addComplianceInfo.data[0],
  //         appModels.WASTETRACKER,
  //       ),
  //     );
  //   }
  // }, [addComplianceInfo]);

  /* useEffect(() => {
     if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
       setValueArray(customFilters);
     }
   }, [customFilters]); */

  const totalDataCount = complianceCount && complianceCount.length && columnFields.length
    ? complianceCount.length
    : 0;

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
    const oldCustomFilters = complianceFilters && complianceFilters.customFilters
      ? complianceFilters.customFilters
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
    dispatch(getComplianceFilters(customFilters1));
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
      const oldCustomFilters = complianceFilters && complianceFilters.customFilters
        ? complianceFilters.customFilters
        : [];
      const filterValues = {
        states:
          complianceFilters && complianceFilters.states
            ? complianceFilters.states
            : [],
        customFilters: [
          ...(oldCustomFilters.length > 0
            ? oldCustomFilters.filter(
              (item) => item.type !== 'date'
                && item.type !== 'customdate'
                && item.type !== 'datearray',
            )
            : ''),
          ...filters,
        ],
        // customFilters: [
        //   ...oldCustomFilters.filter(
        //     (item) => item.type !== 'date'
        //       && item.type !== 'customdate'
        //       && item.type !== 'datearray',
        //   ),
        //   ...filters,
        // ],
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
      dispatch(getComplianceFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = complianceFilters && complianceFilters.customFilters
        ? complianceFilters.customFilters
        : [];
      const filterValues = {
        states:
          complianceFilters && complianceFilters.states
            ? complianceFilters.states
            : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getComplianceFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter(
      (item) => item.value !== cfValue,
    );
    dispatch(getComplianceFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    dispatch(resetAddComplianceInfo());
    showAddModal(false);
  };

  const onAddReset = () => {
    dispatch(resetAddComplianceInfo());
    dispatch(resetComplianceTemplate());
    showAddModal(false);
  };
  const loading = (userInfo && userInfo.loading)
    || (complianceInfo && complianceInfo.loading)
    || complianceCountLoading;
  const complianceData = complianceDetails
    && complianceDetails.data
    && complianceDetails.data.length > 0
    ? complianceDetails.data[0]
    : '';

  const drawertitleName = (
    <Tooltip title={complianceData.name} placement="right">
      {complianceData.name}
    </Tooltip>
  );

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && complianceCount
      && complianceCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = complianceFilters && complianceFilters.customFilters
        ? queryGeneratorWithUtc(complianceFilters.customFilters)
        : '';
      dispatch(
        getComplianceExport(
          companies,
          appModels.WASTETRACKER,
          complianceCount.length,
          offsetValue,
          WasteModule.buildingApiFields,
          customFiltersQuery,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        logged_on: true,
        operation: true,
        type: true,
        tenant: true,
        vendor: true,
        weight: true,
        carried_by: false,
        security_by: false,
        accompanied_by: false,
        create_date: false,
        company_id: false,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'type',
      'tenant',
      'vendor',
      'operation',
      'weight',
      'carried_by',
      'security_by',
      'accompanied_by',
      'company_id',
    ];
    let query = '"|","|","|","|","|","|","|","|",';

    const oldCustomFilters = complianceFilters && complianceFilters.customFilters
      ? complianceFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters && oldCustomFilters.length ? oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    ) : [];

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
      fields.filter((field) => {
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }
    let payload = [];
    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        data.items.map((dataItem) => {
          const label = WasteColumns().find((column) => column.field === dataItem.field);
          dataItem.value = dataItem?.value ? dataItem.value : '';
          dataItem.header = label?.headerName;
        });
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'header'),
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getComplianceFilters(customFilters));
      }
    } else {
      payload = [...dateFilters];
      dispatch(getComplianceFilters(payload));
    }

    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [complianceFilters],
  );

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, 'Waste Tracker');

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, wasteSideNav.data);
    const tabsDef = getTabs(headerTabs[0].menu, wasteSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(wasteSideNav && wasteSideNav.data && wasteSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/waste/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Trackers',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Waste Tracker',
        moduleName: 'Waste Tracker',
        menuName: '',
        link: '/waste-trackers',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        tableData={
          complianceInfo && complianceInfo.data && complianceInfo.data.length
            ? complianceInfo.data
            : []
        }
        columns={WasteColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Waste Tracker"
        exportFileName="Waste Tracker"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={complianceExportInfo}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        filters={filterText}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(
            actionCodes['Add Compliance Obligation'],
          ),
          text: 'Add',
          func: () => showAddModal(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={complianceInfo && complianceInfo.loading}
        err={complianceInfo && complianceInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              (cf.type === 'id' && cf.label && cf.label !== '')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'text' || cf.type === 'id') && (
                        <span>
                          {decodeURIComponent(cf.name)}
                        </span>
                      )}
                      <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                    </Badge>
                  </p>
                ) : ''
            )) : ''}
          </>
        )}
      />
      <Drawer
        PaperProps={{
          sx: { width: '50%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Waste Tracker"
          imagePath={ComplianceCheck}
          onClose={() => onViewReset()}
        />
        <CreateCompliance
          closeModal={() => {
            showAddModal(false);
          }}
          afterReset={() => {
            onAddReset();
          }}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={
            complianceDetails
              && complianceDetails.data
              && complianceDetails.data.length > 0
              && !complianceDetails.loading
              ? drawertitleName
              : 'Waste Tracker'
          }
          imagePath={ComplianceCheck}
          onClose={onViewReset}
        />
        <ComplianceDetailView editId={editId} setEditId={setEditId} />
      </Drawer>
    </Box>
  );
};

export default BuildingCompliance;
