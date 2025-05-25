/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */

import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TrackerCheck from '@images/icons/auditBlue.svg';
import { AddThemeBackgroundColor } from '../themes/theme';
import CommonGrid from '../commonComponents/commonGrid';
import { HxAuditActionsColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';

import {
  setInitialValues,
} from '../purchase/purchaseService';

import DrawerHeader from '../commonComponents/drawerHeader';
import {
  getActiveTab,
  getAllCompanies, getArrayFromValuesByItem, getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations, getPagesCountV2,
  getTabs,
  queryGeneratorV1,
  queryGeneratorWithUtc, truncate, debounce, getNewDataGridFilterArray, getNextPreview,
} from '../util/appUtils';
import { HxAuditActionModule } from '../util/field';
import {
  filterStringGenerator,
} from './utils/utils';
import {
  getHxAuditActionsCount,
  getHxAuditActionsExport,
  getActionFilters, getHxAuditActionsList,
  getHxAuditActionDetail,
} from './auditService';
import bcSideNav from './navbar/navlist.json';
import AuditActionDetails from './auditDetails/auditActionDetails';

const appModels = require('../util/appModels').default;

const AuditActions = (props) => {
  const { match } = props;
  const { params } = match;
  const uuid = params && params.uuid ? params.uuid : false;
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);

  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [reload, setReload] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [buttonFilterType, setButtonFilterType] = useState('All');

  const { apiFields } = HxAuditActionModule;

  const moduleName = 'Audit Management';
  const menuName = 'Audit Actions';

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    hxAuditActionsCount, hxAuditActionsList, hxAuditActionsCountLoading,
    hxAuditActionsFilters, hxAuditActionsExport, hxAuditActionDetail,
  } = useSelector((state) => state.hxAudits);

  const userId = userInfo && userInfo.data && userInfo.data.id;

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const actionData = hxAuditActionDetail && (hxAuditActionDetail.data && hxAuditActionDetail.data.length > 0 && !hxAuditActionDetail.loading) ? hxAuditActionDetail.data[0] : false;

  const isStatusEditable = actionData && (actionData.state === 'Open' || actionData.state === 'In Progress');

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'SLA-KPI Audit', 'code');

  const isCreatable = true;// allowedOperations.includes(actionCodes['Add Breakdown Tracker']);

  const isEditable = isStatusEditable;

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        state: true,
        type: true,
        audit_id: true,
        severity: true,
        sla_status: true,
        category_id: true,
        deadline: true,
        responsible_id: true,
        company_id: false,
        resolution: false,
        description: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (hxAuditActionsFilters && hxAuditActionsFilters.customFilters) {
      setCustomFilters(hxAuditActionsFilters.customFilters);
    }
  }, [hxAuditActionsFilters]);

  useEffect(() => {
    if (
      customFilters
      && customFilters.length
      && valueArray
      && valueArray.length === 0
    ) {
      setValueArray(customFilters);
    }
  }, [customFilters]);

  useEffect(() => {
    if (reload) {
      dispatch(getActionFilters([]));
      setCustomFilters([]);
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      const customFiltersList = '';
    }
  }, [reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (hxAuditActionsCount && hxAuditActionsCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = hxAuditActionsFilters && hxAuditActionsFilters.customFilters ? queryGeneratorWithUtc(hxAuditActionsFilters.customFilters, 'deadline', userInfo.data) : '';
      dispatch(getHxAuditActionsExport(companies, appModels.HXAUDITACTION, hxAuditActionsCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, globalFilter, buttonFilterType, userId));
    }
  }, [startExport]);

  useEffect(() => {
    if (viewId) {
      dispatch(getHxAuditActionDetail(viewId, appModels.HXAUDITACTION));
    }
  }, [viewId]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = hxAuditActionsFilters.customFilters ? queryGeneratorWithUtc(hxAuditActionsFilters.customFilters, 'deadline', userInfo.data) : '';
      dispatch(getHxAuditActionsCount(companies, appModels.HXAUDITACTION, false, customFiltersList, globalFilter, false, buttonFilterType, userId));
    }
  }, [userInfo, hxAuditActionsFilters.customFilters, buttonFilterType]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = hxAuditActionsFilters.customFilters ? queryGeneratorWithUtc(hxAuditActionsFilters.customFilters, 'deadline', userInfo.data) : '';
      setCheckRows([]);
      dispatch(getHxAuditActionsList(companies, appModels.HXAUDITACTION, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, false, buttonFilterType, userId));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, hxAuditActionsFilters.customFilters, buttonFilterType]);

  useEffect(() => {
    if (uuid) {
      dispatch(setInitialValues(false, false, false, false));
      setViewId(uuid);
      setViewModal(true);
    }
  }, [uuid]);

  const totalDataCount = hxAuditActionsCount && hxAuditActionsCount.length ? hxAuditActionsCount.length : 0;

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = hxAuditActionsFilters && hxAuditActionsFilters.customFilters ? hxAuditActionsFilters.customFilters : [];
      setCustomFiltersList(filters);
      const filterValues = {
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
      };
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getActionFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item.type !== 'date' && item.type !== 'customdate'));
      const filterValues = {
        customFilters: customFiltersList.filter((item) => item.type !== 'date' && item.type !== 'customdate'),
      };
      setValueArray(
        valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
      );
      dispatch(getActionFilters(filterValues));
    }
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
      setCustomFiltersList(filters);
      const oldCustomFilters = hxAuditActionsFilters && hxAuditActionsFilters.customFilters
        ? hxAuditActionsFilters.customFilters
        : [];
      const filterValues = {
        states:
        hxAuditActionsFilters && hxAuditActionsFilters.states ? hxAuditActionsFilters.states : [],
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
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
      dispatch(getActionFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = hxAuditActionsFilters && hxAuditActionsFilters.customFilters
        ? hxAuditActionsFilters.customFilters
        : [];
      const filterValues = {
        states:
        hxAuditActionsFilters && hxAuditActionsFilters.states ? hxAuditActionsFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getActionFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const loading = (userInfo && userInfo.loading) || (hxAuditActionsList && hxAuditActionsList.loading) || (hxAuditActionsCountLoading);

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
    dispatch(getActionFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    moduleName,
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, bcSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      menuName,
    );
  }

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(hxAuditActionsList && hxAuditActionsList.data && hxAuditActionsList.data.length && hxAuditActionsList.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(hxAuditActionsList && hxAuditActionsList.data && hxAuditActionsList.data.length && hxAuditActionsList.data[hxAuditActionsList.data.length - 1].id);
    }
  }, [hxAuditActionsList]);

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
      'audit_id',
      'name',
      'type',
      'state',
      'category_id',
      'severity',
      'responsible_id',
    ];
    let query = '"|","|","|","|","|","|",';

    const oldCustomFilters = hxAuditActionsFilters && hxAuditActionsFilters.customFilters
      ? hxAuditActionsFilters.customFilters
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
        let uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'field'),
        );
        uniqueCustomFilter = getNewDataGridFilterArray(HxAuditActionsColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getActionFilters({ customFilters }));
        setOffset(0);
        setPage(0);
      } else {
        const fData = data.items.filter((item) => item.value);
        if (fData && fData.length) {
          let uniqueCustomFilter = _.reverse(
            _.uniqBy(_.reverse([...fData]), 'field'),
          );
          uniqueCustomFilter = getNewDataGridFilterArray(HxAuditActionsColumns(), uniqueCustomFilter);
          const customFilters = [...dateFilters, ...uniqueCustomFilter];
          dispatch(getActionFilters({ customFilters }));
          setOffset(0);
          setPage(0);
        } else {
          const CustomFilters = [...dateFilters];
          dispatch(getActionFilters({ customFilters: CustomFilters }));
          setOffset(0);
          setPage(0);
        }
      }
    } else {
      const CustomFilters = [...dateFilters];
      dispatch(getActionFilters({ customFilters: CustomFilters }));
      setOffset(0);
      setPage(0);
    }
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

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

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [hxAuditActionsFilters],
  );

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: moduleName,
        moduleName,
        menuName,
        link: '/audits/actions',
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
        /* sx={{
         height: '90%',
       }} */
        tableData={
          hxAuditActionsList && hxAuditActionsList.data && hxAuditActionsList.data.length
            ? hxAuditActionsList.data
            : []
        }
        columns={HxAuditActionsColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Audit Actions List"
        exportFileName="Audit Actions"
        listCount={totalDataCount}
        exportInfo={{ err: hxAuditActionsExport.err, loading: hxAuditActionsExport.loading, data: hxAuditActionsExport.data ? hxAuditActionsExport.data : false }}
        page={currentpage}
        isButtonFilter
        setButtonFilterType={setButtonFilterType}
        buttonFilterType={buttonFilterType}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: false,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        filters={filterStringGenerator(hxAuditActionsFilters)}
        onFilterChanges={debouncedOnFilterChange}
        loading={hxAuditActionsList && hxAuditActionsList.loading}
        err={hxAuditActionsList && hxAuditActionsList.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        placeholderText="Search Name, Type ..."
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
          sx: { width: '90%' },
        }}
        anchor="right"
        open={viewModal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName={hxAuditActionDetail && (hxAuditActionDetail.data && hxAuditActionDetail.data.length > 0 && !hxAuditActionDetail.loading)
            ? hxAuditActionDetail.data[0].name : 'Audit Action'}
          imagePath={TrackerCheck}
          isEditable={isEditable}
          onClose={() => onViewReset()}
          onEdit={() => {
            setEditId(hxAuditActionDetail && (hxAuditActionDetail.data && hxAuditActionDetail.data.length > 0) ? hxAuditActionDetail.data[0].id : false);
            showEditModal(!editModal);
          }}
          onPrev={() => {
            const prevId = getNextPreview(viewId, 'Prev', hxAuditActionsList);
            if (prevId === 0) {
              handlePageChangeDetail(currentpage - 1, 'Prev');
            } else {
              setViewId(prevId);
            }
          }}
          onNext={() => {
            const nextId = getNextPreview(viewId, 'Next', hxAuditActionsList);
            if (nextId === 0) {
              handlePageChangeDetail(currentpage + 1, 'Next');
            } else {
              setViewId(nextId);
            }
          }}
        />
        <AuditActionDetails offset={offset} />

      </Drawer>
    </Box>
  );
};

AuditActions.defaultProps = {
  match: false,
};

AuditActions.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default AuditActions;
