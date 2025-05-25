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
import { ComplianceColumns } from '../commonComponents/gridColumns';
import {
  getActiveTab,
  getAllCompanies,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getTabs,
  queryGeneratorV1,
  queryGeneratorWithUtc, debounce, formatFilterData, getNextPreview,
} from '../util/appUtils';
import {
  getComplianceCount,
  getComplianceDetail,
  getComplianceExport,
  getComplianceFilters,
  getComplianceList,
  resetAddComplianceInfo,
  resetComplianceTemplate,
  getComplianceDocuments,
} from './complianceService';
import customData from './data/customData.json';
// import ComplianceDetail from './complianceDetails/complianceDetail';
import ComplianceDetailView from './complianceDetailView/complianceDetails';
import { getComplianceLocationNames } from './utils/utils';
import actionCodes from './data/complianceActionCodes.json';
import CreateCompliance from './forms/createCompliance';

import { updateHeaderData } from '../core/header/actions';
import { BuildingComplianceModule } from '../util/field';
import bcSideNav from './navbar/navlist.json';

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
  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
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
    complainceDocumentsInfo,
  } = useSelector((state) => state.compliance);
  const { sortedValue } = useSelector((state) => state.equipment);

  const [downloadId, setDownloadId] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { deleteInfo } = useSelector((state) => state.pantry);
  const listHead = 'Compliance Obligation :';

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Building Compliance',
    'code',
  );

  const isDownloadAllowed = allowedOperations.includes(actionCodes['Download Evidence Document']);


  const onClickDownload = (id) => {
    setDownloadId(id);
    setViewModal(false);
  };

  const tableColumns = ComplianceColumns(isDownloadAllowed, onClickDownload);

  useEffect(() => {
    if (downloadId) {
      dispatch(getComplianceDocuments(downloadId, appModels.BULIDINGCOMPLIANCE));
    }
  }, [downloadId]);

  useEffect(() => {
    if (downloadId && complainceDocumentsInfo && complainceDocumentsInfo.data && complainceDocumentsInfo.data.length) {
      const dataDoc = complainceDocumentsInfo.data[0].compliance_evidences_ids;
      if (dataDoc && dataDoc.length) {
        const sData = dataDoc.sort((a, b) => new Date(a.evidences_date) - new Date(b.evidences_date));
        const fdata = sData.filter((item) => item.download_link);
        if (fdata && fdata.length) {
          const downloadLink = fdata[fdata.length - 1].download_link;
          // window.open(downloadLink, '_blank', 'download');

          const elem = window.document.createElement('a');
          const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'https://portal-dev.helixsense.com' : window.location.origin}`;
          const { pathname } = new URL(downloadLink);
          elem.href = `${WEBAPPAPIURL}${pathname}?download=true`;
          elem.download = 'file';
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
        } else {
          alert('No Evidences Found.');
        }
      } else {
        alert('No Evidences Found.');
      }
      setDownloadId(false);
    } else if (complainceDocumentsInfo && complainceDocumentsInfo.err) {
      alert('No Evidences Found.');
    }
  }, [complainceDocumentsInfo]);

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
    if (complianceExportInfo && complianceExportInfo.data && complianceExportInfo.data.length > 0) {
      complianceExportInfo.data.map((data) => {
        data.location_ids = getComplianceLocationNames(data.applies_to, data.asset_ids, data.company_ids, data.location_ids);
      });
    }
  }, [complianceExportInfo]);

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
          appModels.BULIDINGCOMPLIANCE,
          customFiltersList,
          globalFilter,
        ),
      );
      dispatch(
        getComplianceList(
          companies,
          appModels.BULIDINGCOMPLIANCE,
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
    sortedValue,
  ]);

  useEffect(() => {
    if (complianceFilters && complianceFilters.customFilters) {
      setCustomFilters(complianceFilters.customFilters);
    }
  }, [complianceFilters]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getComplianceFilters([]));
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
          appModels.BULIDINGCOMPLIANCE,
          customFiltersList,
          globalFilter,
        ),
      );
      dispatch(
        getComplianceList(
          companies,
          appModels.BULIDINGCOMPLIANCE,
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
      dispatch(getComplianceDetail(viewId, appModels.BULIDINGCOMPLIANCE));
    }
  }, [viewId]);

  useEffect(() => {
    if (
      addComplianceInfo
      && addComplianceInfo.data
      && addComplianceInfo.data.length
      && !viewId
    ) {
      dispatch(
        getComplianceDetail(
          addComplianceInfo.data[0],
          appModels.BULIDINGCOMPLIANCE,
        ),
      );
    }
  }, [addComplianceInfo]);

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
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getComplianceFilters(filterValues.customFilters));
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
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getComplianceFilters(filterValues.customFilters));
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
    if (document.getElementById('complianceForm')) {
      document.getElementById('complianceForm').reset();
    }
    setViewId(false);
    setViewModal(false);
    dispatch(resetAddComplianceInfo());
    dispatch(resetComplianceTemplate());
    showAddModal(false);
  };

  const onAddReset = () => {
    if (document.getElementById('complianceForm')) {
      document.getElementById('complianceForm').reset();
    }
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
          appModels.BULIDINGCOMPLIANCE,
          complianceCount.length,
          offsetValue,
          BuildingComplianceModule.buildingApiFields,
          customFiltersQuery,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
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
        name: true,
        compliance_id: true,
        location_ids: true,
        compliance_act: true,
        compliance_category_id: false,
        submitted_to: true,
        applies_to: false,
        location_ids: true,
        company_ids: true,
        asset_ids: true,
        responsible_id: true,
        is_has_expiry: true,
        next_expiry_date: true,
        expiry_schedule: true,
        expiry_schedule_type: true,
        repeat_until: true,
        renewal_lead_time: false,
        license_number: true,
        type: true,
        state: true,
        sla_status: false,
        create_date: false,
        company_id: false,
        last_renewed_by: true,
        last_renewed_on: true,
      });
    }
  }, [visibleColumns]);

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
    setGlobalvalue('');
    const fields = [
      'name',
      'compliance_id',
      'compliance_act',
      'compliance_category_id',
      'submitted_to',
      'applies_to',
      'company_ids',
      'location_ids',
      'asset_ids',
      'responsible_id',
      'is_has_expiry',
      'expiry_schedule',
      'expiry_schedule_type',
      'repeat_until',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = complianceFilters && complianceFilters.customFilters
      ? complianceFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters && oldCustomFilters.length ? oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    ) : [];

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
        dispatch(getComplianceFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getComplianceFilters(customFilters));
    }
    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];
    const customFiltersData = [...dateFilters, ...filtersData];

    setFilterText(formatFilterData(customFiltersData, data?.quickFilterValues?.[0]));
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

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(complianceInfo && complianceInfo.data && complianceInfo.data.length && complianceInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(complianceInfo && complianceInfo.data && complianceInfo.data.length && complianceInfo.data[complianceInfo.data.length - 1].id);
    }
  }, [complianceInfo]);

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

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Building Compliance',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, bcSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Compliance',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Building Compliance',
        moduleName: 'Building Compliance',
        menuName: 'Compliance',
        link: '/buildingcompliance-overview',
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
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Compliance Obligation"
        exportFileName="Compliance Obligation"
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
        pdfStaticColumnWidth={{
          location_ids: { cellWidth: 180 },
        }}
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
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Building Compliance"
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
              : 'Compliance Obligation'
          }
          imagePath={ComplianceCheck}
          onClose={onViewReset}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', complianceInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', complianceInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', complianceInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', complianceInfo));
          }}
        />
        <ComplianceDetailView />
      </Drawer>
    </Box>
  );
};

export default BuildingCompliance;
