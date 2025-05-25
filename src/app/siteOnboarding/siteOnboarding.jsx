/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/system';
import {
  Drawer,
  Tooltip,
  Button,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  ModalBody,
} from 'reactstrap';

import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import SiteCheck from '@images/icons/siteBlue.svg';

import {
  resetUpdateTenant,
} from '../adminSetup/setupService';
import CommonGrid from '../commonComponents/commonGrid';
import DrawerHeader from '../commonComponents/drawerHeader';
import { SiteColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';
import {
  getDelete, resetDelete,
} from '../pantryManagement/pantryService';
import {
  setInitialValues,
} from '../purchase/purchaseService';
import {
  debounce,
  formatFilterData,
  getActiveTab,
  getAllowedCompanies,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getNextPreview,
  getTabs,
  queryGeneratorWithUtc,
  truncate,
  valueCheck,
} from '../util/appUtils';
import AuthService from '../util/authService';
import { ConfigurationModule } from '../util/field';
import AddSite from './addSite';
import actionCodes from './data/complianceActionCodes.json';
import customData from './data/customData.json';
import siteNav from './navbar/navlist.json';
import SiteDetail from './siteDetails/siteDetail';
import {
  getSiteCount,
  getSiteDetail,
  getSiteFilters,
  getSiteList,
  getSiteExport,
  resetAddSiteInfo,
  resetCopyStatus,
  resetUpdateSiteInfo,
} from './siteService';

const authService = AuthService();

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SiteOnboarding = () => {
  const limit = 10;
  const module = 'Configuration';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(1);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [reload, setReload] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [rows, setRows] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');
  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    siteCount, siteInfo, siteCountLoading, siteExportInfo,
    siteFilters, siteDetails, addSiteInfo, categoryGroupInfo, stateChangeInfo, updateSiteInfo, userSiteInfo,
  } = useSelector((state) => state.site);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    deleteInfo,
  } = useSelector((state) => state.pantry);
  const listHead = 'Sites :';

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Site']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Site']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Site']);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Configuration',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, siteNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Sites',
    );
  }
  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Configuration',
        moduleName: 'Configuration',
        menuName: 'Sites',
        link: '/sites',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

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
    if (
      userInfo
      && userInfo.data
      && siteCount
      && siteCount.length && startExport
    ) {
      const customFiltersQuery = siteFilters && siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters)
        : '';
      dispatch(
        getSiteExport(
          companies,
          appModels.COMPANY,
          siteCount.length,
          0,
          ConfigurationModule.configApiFields,
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
    if (((addSiteInfo && addSiteInfo.data) || (updateSiteInfo && updateSiteInfo.data) || (deleteInfo && deleteInfo.data) || (stateChangeInfo && stateChangeInfo.data))) {
      const customFiltersList = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : '';
      dispatch(getSiteCount(companies, appModels.COMPANY, customFiltersList, false, globalFilter));
      dispatch(getSiteList(companies, appModels.COMPANY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
    }
  }, [addSiteInfo, updateSiteInfo, deleteInfo, stateChangeInfo]);

  useEffect(() => {
    if (siteFilters && siteFilters.customFilters) {
      setCustomFilters(siteFilters.customFilters);
    }
  }, [siteFilters]);

  useEffect(() => {
    setCustomFilters([]);
    dispatch(getSiteFilters([]));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : '';
      dispatch(getSiteCount(companies, appModels.COMPANY, customFiltersList, globalFilter));
    }
  }, [userInfo, siteFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data && columnFields.includes(sortedValue.sortField)) {
      const customFiltersList = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : '';
      dispatch(getSiteList(companies, appModels.COMPANY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
    }
  }, [userInfo, offset, siteFilters.customFilters, sortedValue.sortBy, sortedValue.sortField, globalFilter]);

  useEffect(() => {
    if (viewId) {
      dispatch(getSiteDetail(viewId, appModels.COMPANY));
    }
  }, [viewId]);

  // useEffect(() => {
  //   if (updateSiteInfo && updateSiteInfo.data) {
  //     dispatch(getSiteDetail(viewId, appModels.COMPANY));
  //   }
  // }, [updateSiteInfo]);

  useEffect(() => {
    if (addSiteInfo && addSiteInfo.data && addSiteInfo.data.length && !viewId) {
      dispatch(getSiteDetail(addSiteInfo.data[0], appModels.COMPANY));
    }
  }, [addSiteInfo]);

  const totalDataCount = siteCount && siteCount.length && columnFields.length ? siteCount.length : 0;

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    dispatch(resetAddSiteInfo());
    showAddModal(false);
    dispatch(setInitialValues(false, false, false, false));
  };

  const addSiteWindow = () => {
    if (document.getElementById('siteForm')) {
      document.getElementById('siteForm').reset();
    }
    dispatch(resetAddSiteInfo());
    dispatch(resetUpdateTenant());
    dispatch(resetCopyStatus());
    showAddModal(true);
    showAddModal(true);
  };

  const closeEditModalWindow = () => {
    if (document.getElementById('siteForm')) {
      document.getElementById('siteForm').reset();
    }
    dispatch(resetAddSiteInfo());
    dispatch(resetCopyStatus());
    dispatch(resetUpdateSiteInfo());
    showEditModal(false);
  };

  const onAddReset = () => {
    if (document.getElementById('siteForm')) {
      document.getElementById('siteForm').reset();
    }
    dispatch(resetAddSiteInfo());
    dispatch(resetCopyStatus());
    showAddModal(false);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.COMPANY));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const siteData = siteDetails && (siteDetails.data && siteDetails.data.length > 0) ? siteDetails.data[0] : '';
  const siteName = siteData?.name || 'Sites';
  const drawertitleName = (
    <Tooltip title={siteName} placement="right">
      <span>{truncate(siteName, 50)}</span>
    </Tooltip>
  );

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getSiteFilters([]));
    }
  }, [reload]);

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
    dispatch(getSiteFilters(customFilters1));
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
      dispatch(getSiteFilters(filterValues));
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
      dispatch(getSiteFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const tableColumns = SiteColumns();

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

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(siteInfo && siteInfo.data && siteInfo.data.length && siteInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(siteInfo && siteInfo.data && siteInfo.data.length && siteInfo.data[siteInfo.data.length - 1].id);
    }
  }, [siteInfo]);

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

  const loadingData = (userInfo && userInfo.loading) || (siteInfo && siteInfo.loading) || (siteCountLoading);

  return (
    <Box className="insights-box">
      <CommonGrid
        className="tickets-table"
        tableData={
          siteInfo && siteInfo.data && siteInfo.data.length
            ? siteInfo.data
            : []
        }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        appModelsName={appModels.COMPANY}
        loading={loadingData}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        moduleName="Sites List"
        listCount={totalDataCount}
        handlePageChange={handlePageChange}
        page={currentpage}
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
        setViewModal={setViewModal}
        setViewId={setViewId}
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
            getNextPreview(viewId, 'Prev', siteInfo) === 0 ? handlePageChangeDetail(currentpage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', siteInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', siteInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', siteInfo));
          }}
        />
        <SiteDetail  setEditId={setEditId} editId={editId} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        ModalProps={{
          disableEnforceFocus: true,
        }}
        anchor="right"
        open={addModal}
      >

        <DrawerHeader
          headerName="Create Site"
          imagePath={SiteCheck}
          onClose={() => onViewReset()}
        />
        <AddSite
          closeModal={() => { showAddModal(false); }}
          afterReset={() => { onAddReset(); }}
        />
      </Drawer>
      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Site"
          imagePath={false}
          closeModalWindow={() => onRemoveDataCancel()}
          response={deleteInfo}
        />
        <ModalBody className="mt-0 pt-0">
          {deleteInfo && (!deleteInfo.data && !deleteInfo.loading && !deleteInfo.err) && (
            <p className="text-center">
              {`Are you sure, you want to remove ${removeName} ?`}
            </p>
          )}
          {deleteInfo && deleteInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {(deleteInfo && deleteInfo.err) && (
            <SuccessAndErrorFormat response={deleteInfo} />
          )}
          {(deleteInfo && deleteInfo.data) && (
            <SuccessAndErrorFormat
              response={deleteInfo}
              successMessage="Site removed successfully.."
            />
          )}
          <div className="pull-right mt-3">
            {deleteInfo && !deleteInfo.data && (
              <Button
                size="sm"
                disabled={deleteInfo && deleteInfo.loading}
                variant="contained"
                onClick={() => onRemoveData(removeId)}
              >
                Confirm
              </Button>
            )}
            {deleteInfo && deleteInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </Box>
  );
};

export default SiteOnboarding;
