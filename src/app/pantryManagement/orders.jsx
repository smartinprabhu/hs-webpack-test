/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PantryBlue from '@images/icons/pantry/pantryBlue.svg';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';
import CommonGrid from '../commonComponents/commonGrid';
import DrawerHeader from '../commonComponents/drawerHeader';
import { OrderColumns } from '../commonComponents/gridColumns';
import { AddThemeBackgroundColor } from '../themes/theme';

import { updateHeaderData } from '../core/header/actions';
import { setInitialValues } from '../purchase/purchaseService';
import {
  debounce,
  formatFilterData,
  getActiveTab,
  getAllowedCompanies,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getTabs,
  isArrayValueExists,
  queryGeneratorWithUtc,
  getNextPreview,
} from '../util/appUtils';
import { PantryModule } from '../util/field';
import AddOrder from './addOrder';
import ordersNav from './navbar/navlist.json';
import PantryDetails from './pantryDetails/pantryDetails';
import {
  getPantryCount,
  getPantryDetail,
  getPantryFilters,
  getPantryGroups,
  getPantryList,
  getPantryListExport,
  getProductsGroups,
  getSpaceGroups,
  resetCreateOrder,
  resetUpdateOrder,
} from './pantryService';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Orders = () => {
  const limit = 10;
  const tableColumns = OrderColumns();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [customFilters, setCustomFilters] = useState([]);
  const [viewId, setViewId] = useState(false);

  const [scrollDataList, setScrollData] = useState([]);
  const [partsData, setPartsData] = useState([]);
  const [valueArray, setValueArray] = useState([]);

  const [viewModal, setViewModal] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    pantryCount,
    pantryListInfo,
    pantryCountLoading,
    pantryFilters,
    pantryDetails,
    addOrderInfo,
    updateOrderInfo,
    pantryExport,
    pantryOrderActionInfo,
  } = useSelector((state) => state.pantry);
  const { sortedValue } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (pantryExport && pantryExport.data && pantryExport.data.length > 0) {
      pantryExport.data.map((data) => {
        data.employee_id = data.employee_name ? data.employee_name : data.employee_id;
      });
    }
  }, [pantryExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        employee_id: true,
        pantry_id: true,
        space_id: true,
        state: true,
        ordered_on: false,
        confirmed_on: false,
        cancelled_on: false,
        delivered_on: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (userInfo && userInfo.data && pantryCount && pantryCount.length) {
      const offsetValues = 0;
      // setPdfBody([]);
      const customFiltersQuery = pantryFilters && pantryFilters.customFilters
        ? queryGeneratorWithUtc(pantryFilters.customFilters)
        : '';
      dispatch(
        getPantryListExport(
          companies,
          appModels.PANTRYORDER,
          pantryCount.length,
          offsetValues,
          PantryModule.ordersAPiFields,
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
    if (pantryFilters && (!pantryFilters.customFilters || !pantryFilters.customFilters.length)) {
      const filters = [{
        key: 'state', title: 'Status', header: 'Status', value: 'Ordered', label: 'Ordered', type: 'inarray',
      }];
      dispatch(getPantryFilters(filters));
    }
  }, []);

  useEffect(() => {
    if (pantryOrderActionInfo && pantryOrderActionInfo.data) {
      const customFiltersList = pantryFilters.customFilters ? queryGeneratorWithUtc(pantryFilters.customFilters) : '';
      dispatch(getPantryCount(companies, appModels.PANTRYORDER, customFiltersList));
      dispatch(getPantryList(
        companies,
        appModels.PANTRYORDER,
        limit,
        offset,
        customFiltersList,
        sortedValue.sortBy,
        sortedValue.sortField,
      ));
    }
  }, [pantryOrderActionInfo]);

  useEffect(() => {
    if (reload) {
      dispatch(getPantryFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersListVal = pantryFilters.customFilters
        ? queryGeneratorWithUtc(
          pantryFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getPantryCount(
          companies,
          appModels.PANTRYORDER,
          customFiltersListVal,
          globalFilter,
        ),
      );
    }
  }, [userInfo, customFilters, addOrderInfo, updateOrderInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersListValue = pantryFilters.customFilters
        ? queryGeneratorWithUtc(
          pantryFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getPantryList(
          companies,
          appModels.PANTRYORDER,
          limit,
          offset,
          customFiltersListValue,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [
    userInfo,
    offset,
    sortedValue,
    customFilters,
    addOrderInfo,
    updateOrderInfo,
  ]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      const offsetValue = 0;
      const customFiltersListData = pantryFilters.customFilters
        ? queryGeneratorWithUtc(
          pantryFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getPantryList(
          companies,
          appModels.PANTRYORDER,
          limit,
          offsetValue,
          customFiltersListData,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [userInfo, sortedValue, customFilters]);

  useEffect(() => {
    if (pantryFilters && pantryFilters.customFilters) {
      setCustomFilters(pantryFilters.customFilters);
      const vid = isArrayValueExists(pantryFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false, false));
        }
      }
    }
  }, [pantryFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      const customFiltersListDatas = pantryFilters.customFilters
        ? queryGeneratorWithUtc(
          pantryFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getPantryList(
          companies,
          appModels.PANTRYORDER,
          limit,
          offset,
          customFiltersListDatas,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [viewId]);

  useEffect(() => {
    if (!viewId) {
      setScrollData([]);
    }
  }, [viewId]);

  useEffect(() => {
    if (viewId) {
      dispatch(getPantryDetail(viewId, appModels.PANTRYORDER));
    }
  }, [viewId]);

  useEffect(() => {
    if (
      addOrderInfo
      && addOrderInfo.data
      && addOrderInfo.data.length
      && !viewId
    ) {
      dispatch(getPantryDetail(addOrderInfo.data[0], appModels.PANTRYORDER));
    }
  }, [addOrderInfo]);

  useEffect(() => {
    if (pantryListInfo && pantryListInfo.data && viewId) {
      const arr = [...scrollDataList, ...pantryListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [pantryListInfo, viewId]);

  const totalDataCount = pantryCount && pantryCount.length ? pantryCount.length : 0;

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
    const oldCustomFilters = pantryFilters && pantryFilters.customFilters
      ? pantryFilters.customFilters
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
    dispatch(getPantryFilters(customFilters1));
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
          header: 'Date Filter',
          start,
          end,
        },
      ];
    }
    if (start && end) {
      const oldCustomFilters = pantryFilters && pantryFilters.customFilters
        ? pantryFilters.customFilters
        : [];
      const customFilters1 = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      setFilterText(formatFilterData(customFilters1, globalvalue));
      dispatch(getPantryFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersLists = customFilters.filter(
      (item) => item.value !== value,
    );
    dispatch(getPantryFilters(customFiltersLists));
    setOffset(0);
    setPage(0);
  };

  const onLoadPantry = (eid) => {
    if (eid && pantryDetails && pantryDetails.data) {
      const filters = [
        {
          key: 'id',
          value: eid,
          label: pantryDetails.data[0].name,
          type: 'id',
        },
      ];
      const customFiltersLoad = [...customFilters, ...filters];
      dispatch(getPantryFilters(customFiltersLoad));
      setAddModal(false);
      setScrollData([]);
      dispatch(resetCreateOrder());
      dispatch(resetUpdateOrder());
    }
  };

  const onViewReset = () => {
    if (document.getElementById('pantryOrderForm')) {
      document.getElementById('pantryOrderForm').reset();
    }
    setViewId(false);
    setViewModal(false);
  };

  const onAddReset = () => {
    setAddModal(false);
    dispatch(resetCreateOrder());
    dispatch(resetUpdateOrder());
  };

  const loading = (userInfo && userInfo.loading)
    || (pantryListInfo && pantryListInfo.loading)
    || pantryCountLoading;

  const handlePageChange = (page) => {
    const offsetVal = page * limit;
    setOffset(offsetVal);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(pantryListInfo && pantryListInfo.data && pantryListInfo.data.length && pantryListInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(pantryListInfo && pantryListInfo.data && pantryListInfo.data.length && pantryListInfo.data[pantryListInfo.data.length - 1].id);
    }
  }, [pantryListInfo]);

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
    const fields = ['name', 'employee_id', 'employee_name', 'pantry_id', 'space_id', 'state'];
    let query = '"|","|","|","|","|",';

    const oldCustomFilters = pantryFilters && pantryFilters.customFilters
      ? pantryFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter((item) => item.type === 'date' || item.type === 'customdate');

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
        dispatch(getPantryFilters(customFilters));
      }
    } else {
      dispatch(getPantryFilters([...dateFilters]));
    }
    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];
    const customFiltersData = [...dateFilters, ...filtersData];
    setFilterText(formatFilterData(customFiltersData, data?.quickFilterValues?.[0]));
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((datas) => {
      onFilterChange(datas);
    }, 500),
    [pantryFilters],
  );

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Pantry Management',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, ordersNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Orders',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Pantry Management',
        moduleName: 'Pantry Management',
        menuName: 'Orders',
        link: '/pantry-overview',
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
          pantryListInfo && pantryListInfo.data && pantryListInfo.data.length
            ? pantryListInfo.data
            : []
        }
        columns={OrderColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Orders"
        exportFileName="Pantry Orders"
        listCount={totalDataCount}
        exportInfo={pantryExport}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        filters={filterText}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: true,
          text: 'Add',
          func: () => setAddModal(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={pantryListInfo && pantryListInfo.loading}
        err={pantryListInfo && pantryListInfo.err}
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
            {pantryFilters.customFilters && pantryFilters.customFilters.length > 0 ? pantryFilters.customFilters.map((cf) => (
              (cf.type === 'inarray' && cf.label && cf.label !== '')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'inarray') && (
                        <>
                          {cf.title}
                          <span>
                            {'  '}
                            :
                            {' '}
                            {cf.label}
                          </span>
                        </>
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
          headerName="Add Order"
          imagePath={PantryBlue}
          onClose={() => { onViewReset(); setPartsData([]); setAddModal(false); }}
        />
        <AddOrder
          editId={false}
          setAddModal={() => onAddReset()}
          closeAddModal={() => setAddModal(false)}
          onLoadPantry={() => onLoadPantry()}
          partsData={partsData}
          setPartsData={setPartsData}
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
          headerName={pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) ? (pantryDetails.data[0].name) : ''}
          imagePath={PantryBlue}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', pantryListInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', pantryListInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', pantryListInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', pantryListInfo));
          }}
          onClose={() => {
            onViewReset();
          }}
          onClose={onViewReset}
        />
        <PantryDetails />
      </Drawer>
    </Box>
  );
};

export default Orders;
