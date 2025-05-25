/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Drawer from '@mui/material/Drawer';
import { Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';

import TrackerCheck from '@images/sideNavImages/incident_black.svg';
import { Box } from '@mui/system';
import { AddThemeBackgroundColor } from '../themes/theme';
import DrawerHeader from '../commonComponents/drawerHeader';

import CommonGrid from '../commonComponents/commonGrid';
import { HazardsColumns } from '../commonComponents/gridColumns';
import {
  getActiveTab,
  getAllCompanies, isAllCompany,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getTabs,
  getDynamicTabs,
  queryGeneratorV1,
  queryGeneratorWithUtc,
  debounce,
  getNewDataGridFilterArrayNew,
} from '../util/appUtils';
import {
  getIncidentsCount, getIncidentDetail, getIncidentsFilters, getIncidentsList, resetAddIncidentInfo,
  resetUpdateIncidentInfo, getIncidentsExport, getHxIncidentConfig,
} from './ctService';
import customData from './data/customData.json';
import AddIncident from './addIncident';
import IncidentDetail from './incidentDetails/incidentDetails';
import { filterStringGenerator } from './utils/utils';
import {
  typeCtegoryLabelFunction,
} from '../siteOnboarding/utils/utils';


import { updateHeaderData } from '../core/header/actions';
import { HazardModule } from '../util/field';
import wasteSideNav from './navbar/navlist.json';
import { hxincidentStatusJson } from '../commonComponents/utils/util';

const appModels = require('../util/appModels').default;

const Incidents = () => {
  const limit = 10;
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
  const [editModal, showEditModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  const isAllCompanies = isAllCompany(userInfo, userRoles);
  const {
    incidentHxCount, incidentHxInfo, incidentHxCountLoading,
    incidentHxFilters, incidentDetailsInfo, addIncidentInfo, updateIncidentInfo,
    incidentHxExportInfo,
  } = useSelector((state) => state.hazards);
  const { sortedValue } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Hazards',
    'code',
  );

  const isCreatable = true;

  const isEditable = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length
    && (incidentDetailsInfo.data[0].state === 'Reported' || incidentDetailsInfo.data[0].state === 'Work in Progress' || incidentDetailsInfo.data[0].state === 'Acknowledged');

  useEffect(() => {
    if (incidentHxExportInfo && incidentHxExportInfo.data && incidentHxExportInfo.data.length > 0) {
      incidentHxExportInfo.data.map((data) => {
        data.type_category = typeCtegoryLabelFunction(data.type_category);
      });
    };
  }, [incidentHxExportInfo]);

  useEffect(() => {
    if (
      (addIncidentInfo && addIncidentInfo.data) || (updateIncidentInfo && updateIncidentInfo.data)
    ) {
      const customFiltersList1 = incidentHxFilters.customFilters ? queryGeneratorWithUtc(incidentHxFilters.customFilters, false, userInfo.data) : '';
      if (addIncidentInfo && addIncidentInfo.data) {
        dispatch(getIncidentsCount(companies, appModels.EHSHAZARD, customFiltersList1, globalFilter));
      }
      dispatch(getIncidentsList(companies, appModels.EHSHAZARD, limit, offset, customFiltersList1, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [
    addIncidentInfo,
    updateIncidentInfo,
  ]);

  useEffect(() => {
    if (incidentHxFilters && incidentHxFilters.customFilters) {
      setCustomFilters(incidentHxFilters.customFilters);
    }
  }, [incidentHxFilters]);

  useEffect(() => {
    if (reload) {
      dispatch(getIncidentsFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      const customFiltersList = '';
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList1 = incidentHxFilters.customFilters
        ? queryGeneratorWithUtc(
          incidentHxFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getIncidentsList(
          companies,
          appModels.EHSHAZARD,
          limit,
          offset,
          customFiltersList1,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, incidentHxFilters.customFilters, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList1 = incidentHxFilters.customFilters
        ? queryGeneratorWithUtc(
          incidentHxFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getIncidentsCount(
          companies,
          appModels.EHSHAZARD,
          customFiltersList1,
          globalFilter,
        ),
      );
    }
  }, [incidentHxFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (
      addIncidentInfo
      && addIncidentInfo.data
      && addIncidentInfo.data.length
      && !viewId
    ) {
      dispatch(
        getIncidentDetail(
          addIncidentInfo.data[0],
          appModels.EHSHAZARD,
        ),
      );
    }
  }, [addIncidentInfo]);

  useEffect(() => {
    if (
      updateIncidentInfo
      && updateIncidentInfo.data
    ) {
      dispatch(
        getIncidentDetail(
          viewId,
          appModels.EHSHAZARD,
        ),
      );
    }
  }, [updateIncidentInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getIncidentDetail(viewId, appModels.EHSHAZARD));
      if (!isAllCompanies) {
        dispatch(getHxIncidentConfig(companies, appModels.HAZARDCONFIG));
      }
      dispatch(resetUpdateIncidentInfo());
      dispatch(resetAddIncidentInfo());
    }
  }, [viewId]);

  /* useEffect(() => {
     if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
       setValueArray(customFilters);
     }
   }, [customFilters]); */

  const totalDataCount = incidentHxCount && incidentHxCount.length && columnFields.length
    ? incidentHxCount.length
    : 0;

  const handleRadioboxChange = (event) => {
    const { value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
        Header: value,
        id: value,
      },
    ];
    const oldCustomFilters = incidentHxFilters && incidentHxFilters.customFilters
      ? incidentHxFilters.customFilters
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
    dispatch(getIncidentsFilters(customFilters1));
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
          Header: value,
          id: value,
        },
      ];
    }
    if (start && end) {
      setCustomFilters(filters);
      const oldCustomFilters = incidentHxFilters && incidentHxFilters.customFilters
        ? incidentHxFilters.customFilters
        : [];
      const filterValues = {
        states:
          incidentHxFilters && incidentHxFilters.states
            ? incidentHxFilters.states
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
      dispatch(getIncidentsFilters(filterValues.customFilters));
    } else {
      setCustomFilters(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = incidentHxFilters && incidentHxFilters.customFilters
        ? incidentHxFilters.customFilters
        : [];
      const filterValues = {
        states:
          incidentHxFilters && incidentHxFilters.states
            ? incidentHxFilters.states
            : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getIncidentsFilters(filterValues.customFilters));
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
    dispatch(getIncidentsFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const onViewReset = () => {
    if (document.getElementById('hxHazardform')) {
      document.getElementById('hxHazardform').reset();
    }
    setViewId(false);
    setViewModal(false);
    dispatch(resetAddIncidentInfo());
    dispatch(resetUpdateIncidentInfo());
    showAddModal(false);
  };

  const onAddReset = () => {
    if (document.getElementById('hxHazardform')) {
      document.getElementById('hxHazardform').reset();
    }
    dispatch(resetAddIncidentInfo());
    dispatch(resetUpdateIncidentInfo());
    showAddModal(false);
  };
  const loading = (userInfo && userInfo.loading)
    || (incidentHxInfo && incidentHxInfo.loading)
    || incidentHxCountLoading;
  const complianceData = incidentDetailsInfo
    && incidentDetailsInfo.data
    && incidentDetailsInfo.data.length > 0
    ? incidentDetailsInfo.data[0]
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
      && incidentHxCount
      && incidentHxCount.length
      && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = incidentHxFilters && incidentHxFilters.customFilters
        ? queryGeneratorV1(incidentHxFilters.customFilters)
        : '';
      dispatch(
        getIncidentsExport(
          companies,
          appModels.EHSHAZARD,
          incidentHxCount.length,
          offsetValue,
          HazardModule.buildingApiFields,
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
        reference: true,
        name: true,
        state: true,
        type_category: true,
        asset_id: true,
        equipment_id: true,
        category_id: true,
        priority_id: true,
        description: true,
        incident_type_id: true,
        incident_on: true,
        target_closure_date: true,
        maintenance_team_id: true,
        company_id: true,
        corrective_action: false,
        assigned_id: true,
        reported_by_id: false,
        reported_on: true,
        acknowledged_by_id: false,
        acknowledged_on: false,
        resolved_by_id: false,
        resolved_on: false,
        validated_by_id: false,
        validated_on: false,
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
    const fields = [
      'reference',
      'name',
      'state',
      'type_category',
      'category_id',
      'priority_id',
      'incident_type_id',
      'maintenance_team_id',
    ];
    let query = '"|","|","|","|","|","|","|",';

    const oldCustomFilters = incidentHxFilters && incidentHxFilters.customFilters
      ? incidentHxFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters && oldCustomFilters.length ? oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    ) : [];

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setOffset(0);
      setPage(0);
      fields.filter((field) => {
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
      setOffset(0);
      setPage(0);
    }
    let payload = [];
    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        setOffset(0);
        setPage(0);
        let uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'field'),
        );
        uniqueCustomFilter = getNewDataGridFilterArrayNew(HazardsColumns(), uniqueCustomFilter);
        payload = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getIncidentsFilters(payload));
      }
    } else {
      payload = [...dateFilters];
      dispatch(getIncidentsFilters(payload));
      setOffset(0);
      setPage(0);
    }
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [incidentHxFilters],
  );

  function getNextPreview(ids, type) {
    const array = incidentHxInfo && incidentHxInfo.data && incidentHxInfo.data.length > 0 ? incidentHxInfo.data : [];
    let listId = 0;
    if (array && array.length > 0) {
      const index = array.findIndex((element) => element.id === ids);

      if (index > -1) {
        if (type === 'Next') {
          listId = array[index + 1].id;
        } else {
          listId = array[index - 1].id;
        }
      }
    }
    return listId;
  }

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, 'Hazards');

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, wasteSideNav.data);
    const tabsDef = getTabs(headerTabs[0].menu, wasteSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(wasteSideNav && wasteSideNav.data && wasteSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/hazard/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Hazards',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Hazards',
        moduleName: 'Hazards',
        menuName: '',
        link: '/ehs-hazards',
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
          incidentHxInfo && incidentHxInfo.data && incidentHxInfo.data.length
            ? incidentHxInfo.data
            : []
        }
        columns={HazardsColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Hazards"
        exportFileName="Hazards"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={incidentHxExportInfo}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => { showAddModal(true); dispatch(resetAddIncidentInfo()); dispatch(getHxIncidentConfig(companies, appModels.HAZARDCONFIG)); },
        }}
        setRows={setRows}
        rows={rows}
        pdfStaticColumnWidth={{
          description: { cellWidth: 150 },
        }}
        configData={hxincidentStatusJson}
        visibleColumns={visibleColumns}
        filters={filterStringGenerator(incidentHxFilters)}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={incidentHxInfo && incidentHxInfo.loading}
        err={incidentHxInfo && incidentHxInfo.err}
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
              ((cf.type === 'id' || cf.type === 'text') && cf.label && cf.label !== '')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                    {(cf.type === 'text') && (
                      <span>
                        {decodeURIComponent(cf.name)}
                      </span>
                      )}
                      {(cf.type === 'id') && (
                      <span>
                        {cf.label}
                        {'  '}
                        :
                        {' '}
                        {decodeURIComponent(cf.value)}
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
          headerName="Create Hazard"
          imagePath={TrackerCheck}
          onClose={() => onViewReset()}
        />
        <AddIncident
          editId={false}
          closeModal={() => {
            showAddModal(false);
          }}
          afterReset={() => {
            onAddReset();
          }}
          isShow={addModal}
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
          headerName={incidentDetailsInfo && (incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0 && !incidentDetailsInfo.loading)
            ? drawertitleName : 'Hazard'}
          imagePath={TrackerCheck}
          isEditable={isEditable}
          onClose={() => onViewReset()}
          onEdit={() => {
            setEditId(incidentDetailsInfo && (incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0) ? incidentDetailsInfo.data[0].id : false);
            showEditModal(!editModal);
            dispatch(resetUpdateIncidentInfo());
          }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
        />
        <IncidentDetail offset={offset} editId={editId} setEditId={setEditId} onViewReset={onViewReset} />
      </Drawer>
    </Box>
  );
};

export default Incidents;
