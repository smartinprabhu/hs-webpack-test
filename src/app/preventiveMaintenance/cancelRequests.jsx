/* eslint-disable prefer-destructuring */
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
import { HxInspPPMColumns } from '../commonComponents/gridColumns';
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
  getListOfOperations, getPagesCountV2,
  getTabs,
  extractNameObject,
  queryGeneratorWithUtc, truncate, debounce, getNewDataGridFilterArray, getNextPreview,
} from '../util/appUtils';
import { HxPPMCancelModule } from '../util/field';
import {
  filterStringGenerator,
} from '../auditManagement/utils/utils';
import {
  getHxPPMCancelRequestsCount,
  getHxPPMCancelRequestsExport,
  resetCancelReq,
  getPPMCancelRequestFilters, getHxPPMCancelRequestsList,
  getHxPPMCancelDetails,
} from './ppmService';
import bcSideNav from './navbar/navlist.json';
import { getPPMSettingsDetails } from '../siteOnboarding/siteService';
import CancelRequestDetails from './viewer/cancelRequestDetails';
import PPMCancelRequestBulk from './ppmCancelRequestBulk';
import actionCodes from './data/preventiveActionCodes.json';

const appModels = require('../util/appModels').default;

const CancelRequests = ({ uuid }) => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);

  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [reload, setReload] = useState(false);
  const [reset, setReset] = useState(false); 
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

  const [isHoliday, setIsHoliday] = useState('no');

  const [buttonFilterType, setButtonFilterType] = useState('All');

  const { apiFields } = HxPPMCancelModule;

  const moduleName = '52 Week PPM';
  const menuName = 'Cancel Requests';

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    hxPPMCancelCount, hxPPMCancelList, hxPPMCancelCountLoading,
    hxPPMCancelFilters, hxPPMCancelExport,
    hxCreatePpmCancelRequest,
    hxPpmCancelDetails,
  } = useSelector((state) => state.ppm);

  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const userId = userInfo && userInfo.data && userInfo.data.id;

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  // const actionData = hxAuditActionDetail && (hxAuditActionDetail.data && hxAuditActionDetail.data.length > 0 && !hxAuditActionDetail.loading) ? hxAuditActionDetail.data[0] : false;

  // const isStatusEditable = actionData && (actionData.state === 'Pending');

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

    const canCreate = allowedOperations.includes(actionCodes['Cancel PPM']);

  // const isEditable = isStatusEditable;

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        requested_on: true,
        requested_by_id: true,
        state: true,
        expires_on: true,
        cancel_approval_authority: true,
        approved_on: true,
        approved_by: true,
        remarks: false,
        company_id: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (hxPPMCancelFilters && hxPPMCancelFilters.customFilters) {
      setCustomFilters(hxPPMCancelFilters.customFilters);
    }
  }, [hxPPMCancelFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id) {
      dispatch(getPPMSettingsDetails(userInfo.data.company.id, appModels.PPMWEEKCONFIG));
    }
  }, []);

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
      dispatch(getPPMCancelRequestFilters([]));
      setCustomFilters([]);
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      setButtonFilterType('All');
      setReset(Math.random());
      const customFiltersList = '';
    }
  }, [reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (hxPPMCancelCount && hxPPMCancelCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = hxPPMCancelFilters && hxPPMCancelFilters.customFilters ? queryGeneratorWithUtc(hxPPMCancelFilters.customFilters, 'requested_on', userInfo.data) : '';
      dispatch(getHxPPMCancelRequestsExport(companies, appModels.HXPPMCANCEL, hxPPMCancelCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, globalFilter, buttonFilterType, userId));
    }
  }, [startExport]);

  useMemo(() => {
    if (hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data) {
      const customFiltersList = hxPPMCancelFilters.customFilters ? queryGeneratorWithUtc(hxPPMCancelFilters.customFilters, 'requested_on', userInfo.data) : '';
      dispatch(getHxPPMCancelRequestsCount(companies, appModels.HXPPMCANCEL, false, customFiltersList, globalFilter, false, buttonFilterType, userId));
      setCheckRows([]);
      dispatch(getHxPPMCancelRequestsList(companies, appModels.HXPPMCANCEL, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, false, buttonFilterType, userId));
    }
  }, [hxCreatePpmCancelRequest]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = hxPPMCancelFilters.customFilters ? queryGeneratorWithUtc(hxPPMCancelFilters.customFilters, 'requested_on', userInfo.data) : '';
      dispatch(getHxPPMCancelRequestsCount(companies, appModels.HXPPMCANCEL, false, customFiltersList, globalFilter, false, buttonFilterType, userId));
    }
  }, [userInfo, hxPPMCancelFilters.customFilters, buttonFilterType, reset]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = hxPPMCancelFilters.customFilters ? queryGeneratorWithUtc(hxPPMCancelFilters.customFilters, 'requested_on', userInfo.data) : '';
      setCheckRows([]);
      dispatch(getHxPPMCancelRequestsList(companies, appModels.HXPPMCANCEL, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, false, buttonFilterType, userId));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, hxPPMCancelFilters.customFilters, buttonFilterType, reset]);

  useEffect(() => {
    if (uuid) {
      dispatch(setInitialValues(false, false, false, false));
      setViewId(uuid);
      setViewModal(true);
    }
  }, [uuid]);

  useEffect(() => {
    if (viewId) {
      dispatch(getHxPPMCancelDetails(viewId, appModels.HXPPMCANCEL, 'ppm.scheduler_week', 'view'));
    }
  }, [viewId]);

  const totalDataCount = hxPPMCancelCount && hxPPMCancelCount.length ? hxPPMCancelCount.length : 0;
  const gpConfig = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = hxPPMCancelFilters && hxPPMCancelFilters.customFilters ? hxPPMCancelFilters.customFilters : [];
      setCustomFiltersList(filters);
      const filterValues = {
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
      };
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getPPMCancelRequestFilters(filterValues));
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
      dispatch(getPPMCancelRequestFilters(filterValues));
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
      const oldCustomFilters = hxPPMCancelFilters && hxPPMCancelFilters.customFilters
        ? hxPPMCancelFilters.customFilters
        : [];
      const filterValues = {
        states:
        hxPPMCancelFilters && hxPPMCancelFilters.states ? hxPPMCancelFilters.states : [],
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
      dispatch(getPPMCancelRequestFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = hxPPMCancelFilters && hxPPMCancelFilters.customFilters
        ? hxPPMCancelFilters.customFilters
        : [];
      const filterValues = {
        states:
        hxPPMCancelFilters && hxPPMCancelFilters.states ? hxPPMCancelFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getPPMCancelRequestFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const loading = (userInfo && userInfo.loading) || (hxPPMCancelList && hxPPMCancelList.loading) || (hxPPMCancelCountLoading);

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
    dispatch(getPPMCancelRequestFilters(customFiltersList));
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
      setViewId(hxPPMCancelList && hxPPMCancelList.data && hxPPMCancelList.data.length && hxPPMCancelList.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(hxPPMCancelList && hxPPMCancelList.data && hxPPMCancelList.data.length && hxPPMCancelList.data[hxPPMCancelList.data.length - 1].id);
    }
  }, [hxPPMCancelList]);

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
      'requested_by_id',
      'state',
      'approved_by_id',
      'cancel_approval_authority',
      'company_id',
      'remarks',
    ];
    let query = '"|","|","|","|","|",';

    const oldCustomFilters = hxPPMCancelFilters && hxPPMCancelFilters.customFilters
      ? hxPPMCancelFilters.customFilters
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
        uniqueCustomFilter = getNewDataGridFilterArray(HxInspPPMColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getPPMCancelRequestFilters({ customFilters }));
        setOffset(0);
        setPage(0);
      } else {
        const fData = data.items.filter((item) => item.value);
        if (fData && fData.length) {
          let uniqueCustomFilter = _.reverse(
            _.uniqBy(_.reverse([...fData]), 'field'),
          );
          uniqueCustomFilter = getNewDataGridFilterArray(HxInspPPMColumns(), uniqueCustomFilter);
          const customFilters = [...dateFilters, ...uniqueCustomFilter];
          dispatch(getPPMCancelRequestFilters({ customFilters }));
          setOffset(0);
          setPage(0);
        } else {
          const CustomFilters = [...dateFilters];
          dispatch(getPPMCancelRequestFilters({ customFilters: CustomFilters }));
          setOffset(0);
          setPage(0);
        }
      }
    } else {
      const CustomFilters = [...dateFilters];
      dispatch(getPPMCancelRequestFilters({ customFilters: CustomFilters }));
      setOffset(0);
      setPage(0);
    }
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const onAddReset = () => {
    dispatch(resetCancelReq());
    showAddModal(false);
  };

  const onAddCancel = () => {
    setIsHoliday('no');
    showAddModal(true);
  };

  const onAddCancelHoliday = () => {
    setIsHoliday('yes');
    showAddModal(true);
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
    [hxPPMCancelFilters],
  );

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: moduleName,
        moduleName,
        menuName,
        link: '/preventive-overview/cancel-requests',
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
            hxPPMCancelList && hxPPMCancelList.data && hxPPMCancelList.data.length
              ? hxPPMCancelList.data
              : []
        }
        columns={HxInspPPMColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Cancel Requests List"
        exportFileName="Cancel_Requests"
        listCount={totalDataCount}
        exportInfo={{ err: hxPPMCancelExport.err, loading: hxPPMCancelExport.loading, data: hxPPMCancelExport.data ? hxPPMCancelExport.data : false }}
        page={currentpage}
       // isButtonFilter
      //  setButtonFilterType={setButtonFilterType}
       // buttonFilterType={buttonFilterType}
       // buttonNames={[{ label: 'All', value: 'All' }, { label: 'Holiday', value: 'Holiday' }]}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: gpConfig && gpConfig.is_can_cancel && canCreate,
          text: 'Create',
          func: () => onAddCancel(),
          dropdown: false,
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        filters={filterStringGenerator(hxPPMCancelFilters)}
        onFilterChanges={debouncedOnFilterChange}
        loading={hxPPMCancelList && hxPPMCancelList.loading}
        err={hxPPMCancelList && hxPPMCancelList.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        placeholderText="Search Requestor, Approver ..."
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
          headerName={hxPpmCancelDetails && (hxPpmCancelDetails.data && hxPpmCancelDetails.data.length > 0 && !hxPpmCancelDetails.loading)
            ? hxPpmCancelDetails.data[0].reason : 'Cancel Request'}
          imagePath={TrackerCheck}
               // isEditable={isEditable}
          onClose={() => onViewReset()}
          onEdit={() => {
            setEditId(hxPpmCancelDetails && (hxPpmCancelDetails.data && hxPpmCancelDetails.data.length > 0) ? hxPpmCancelDetails.data[0].id : false);
            showEditModal(!editModal);
          }}
          onPrev={() => {
            const prevId = getNextPreview(viewId, 'Prev', hxPPMCancelList);
            if (prevId === 0) {
              handlePageChangeDetail(currentpage - 1, 'Prev');
            } else {
              setViewId(prevId);
            }
          }}
          onNext={() => {
            const nextId = getNextPreview(viewId, 'Next', hxPPMCancelList);
            if (nextId === 0) {
              handlePageChangeDetail(currentpage + 1, 'Next');
            } else {
              setViewId(nextId);
            }
          }}
        />
        <CancelRequestDetails offset={offset} />

      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '90%' },
        }}
        anchor="right"
        open={addModal}
        ModalProps={{
          disableEnforceFocus: false,
        }}
      >
        <DrawerHeader
          headerName="Create Cancellation Request"
          imagePath={TrackerCheck}
               // isEditable={isEditable}
          onClose={() => showAddModal(false)}
        />
        <PPMCancelRequestBulk
          afterReset={onAddReset}
          closeModal={() => showAddModal(false)}
          setViewId={setViewId}
          isHoliday={false}
          setViewModal={setViewModal}
        />

      </Drawer>

    </Box>
  );
};

export default CancelRequests;
