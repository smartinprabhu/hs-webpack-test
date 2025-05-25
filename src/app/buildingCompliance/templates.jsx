/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/system';
import Drawer from '@mui/material/Drawer';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
  Modal,
  ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';


import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import ComplianceCheck from '@images/icons/complianceCheck.svg';
import CommonGrid from '../commonComponents/commonGrid';
import { AddThemeBackgroundColor } from '../themes/theme';
import DrawerHeader from '../commonComponents/drawerHeader';

import {
  resetUpdateTenant,
} from '../adminSetup/setupService';
import { ComplianceTemplateColumns } from '../commonComponents/gridColumns';
import {
  getDelete, resetDelete,
} from '../pantryManagement/pantryService';
import {
  debounce,
  formatFilterData,
  getAllCompanies, getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getListOfModuleOperations,
  queryGeneratorWithUtc,
  valueCheck, getHeaderTabs, getTabs, getActiveTab,
} from '../util/appUtils';
import { BuildingComplianceTempModule } from '../util/field';
import AddCompliance from './addTempBuildingComplaince';
import {
  getComplianceConfig,
  getComplianceDetail,
  getComplianceDocuments, getComplianceTempCount, getComplianceTempFilters,
  getComplianceTempList, getComplianceTempExport,
  resetAddComplianceInfo, resetComplianceTemplate,
} from './complianceService';
import { updateHeaderData } from '../core/header/actions';
import actionCodes from './data/complianceActionCodes.json';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import bcSideNav from './navbar/navlist.json';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Templates = () => {
  const limit = 10;
  const subMenu = 'Templates';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(1);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShowsTemp ? customData.listfieldsShowsTemp : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const [downloadId, setDownloadId] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [openCategory, setOpenCategory] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [keyword, setKeyword] = useState(false);
  const [openApplies, setOpenApplies] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    complianceTempCount, complianceTempInfo, complianceTempCountLoading,
    complianceTempFilters, complianceDetails, addComplianceInfo, complianceTempExportInfo, stateChangeInfo,
    complainceDocumentsInfo, templateConfig,
  } = useSelector((state) => state.compliance);

  const tempSettingData = templateConfig && templateConfig.data && templateConfig.data.length ? templateConfig.data[0] : false;
  const templateListAccess = tempSettingData ? tempSettingData.template_list_access : false;
  const productsListId = tempSettingData && templateListAccess && templateListAccess === 'Company Level' && tempSettingData.template_company_id.id ? tempSettingData.template_company_id.id : false;
  const companies = productsListId || getAllCompanies(userInfo);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const {
    deleteInfo,
  } = useSelector((state) => state.pantry);
  const listHead = 'Templates :';

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Compliance Template']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Compliance Template']);
  // const isViewable = allowedOperations.includes(actionCodes['View Compliance Obligation']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Compliance Template']);

  const searchColumns = BuildingComplianceTempModule.buildingSearchColumn;
  const advanceSearchColumns = BuildingComplianceTempModule.buildingAdvanceSearchColumn;

  const hiddenColumns = BuildingComplianceTempModule.buildingHiddenColumn;

  const onClickClear = () => {
    dispatch(getComplianceTempFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.tempColumns ? filtersFields.tempColumns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenCategory(false);
    setOpenStatus(false);
    setOpenApplies(false);
  };

  const columns = useMemo(() => filtersFields && filtersFields.tempColumns, []);
  const data = useMemo(() => (complianceTempInfo && complianceTempInfo.data && complianceTempInfo.data.length > 0 ? complianceTempInfo.data : [{}]), [complianceTempInfo.data]);
  const initialState = {
    hiddenColumns,
  };

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getComplianceConfig(userInfo.data.company.id, appModels.BCSCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        compliance_act: true,
        compliance_category_id: true,
        submitted_to: true,
        type: true,
        create_date: false,
        company_id: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && complianceTempCount
      && complianceTempCount.length
    ) {
      const offsetValue = 0;
      const customFiltersQuery = complianceTempFilters && complianceTempFilters.customFilters
        ? queryGeneratorWithUtc(complianceTempFilters.customFilters)
        : '';
      dispatch(getComplianceTempExport(companies, appModels.COMPLIANCETEMPLATE, complianceTempCount.length, offsetValue, BuildingComplianceTempModule.buildingApiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [startExport]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getComplianceTempFilters([]));
    }
  }, [reload]);

  useEffect(() => {
    if ((addComplianceInfo && addComplianceInfo.data)
      || (tenantUpdateInfo && tenantUpdateInfo.data) || (deleteInfo && deleteInfo.data) || (stateChangeInfo && stateChangeInfo.data)) {
      const customFiltersList = complianceTempFilters.customFilters ? queryGeneratorWithUtc(complianceTempFilters.customFilters, false, userInfo.data) : '';
      dispatch(getComplianceTempCount(companies, appModels.COMPLIANCETEMPLATE, customFiltersList));
      dispatch(getComplianceTempList(companies, appModels.COMPLIANCETEMPLATE, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addComplianceInfo, tenantUpdateInfo, deleteInfo, stateChangeInfo]);

  useEffect(() => {
    if (complianceTempFilters && complianceTempFilters.customFilters) {
      setCustomFilters(complianceTempFilters.customFilters);
    }
  }, [complianceTempFilters]);

  useEffect(() => {
    if (complianceTempCount && complianceTempCount.length && startExport && userInfo && userInfo.data && ((templateConfig && templateConfig.data) || (templateConfig && templateConfig.err) || (templateConfig && !templateConfig.loading))) {
      dispatch(getComplianceTempExport(companies, appModels.COMPLIANCETEMPLATE, complianceTempCount.length, 0, BuildingComplianceTempModule.buildingApiFields, customFiltersList, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [startExport]);

  useMemo(() => {
    if (userInfo && userInfo.data && ((templateConfig && templateConfig.data) || (templateConfig && templateConfig.err) || (templateConfig && !templateConfig.loading))) {
      const customFiltersList = complianceTempFilters.customFilters ? queryGeneratorWithUtc(complianceTempFilters.customFilters, false, userInfo.data) : '';
      dispatch(getComplianceTempCount(companies, appModels.COMPLIANCETEMPLATE, customFiltersList, false, globalFilter));
    }
  }, [templateConfig, complianceTempFilters.customFilters, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data && ((templateConfig && templateConfig.data) || (templateConfig && templateConfig.err) || (templateConfig && !templateConfig.loading))) {
      const customFiltersList = complianceTempFilters.customFilters ? queryGeneratorWithUtc(complianceTempFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getComplianceTempList(companies, appModels.COMPLIANCETEMPLATE, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
    }
  }, [userInfo, offset, templateConfig, sortedValue.sortBy, sortedValue.sortField, complianceTempFilters.customFilters, globalFilter]);

  /*  useEffect(() => {
    if (viewId) {
      dispatch(getComplianceDetail(viewId, appModels.COMPLIANCETEMPLATE));
    }
  }, [viewId]); */

  useEffect(() => {
    if (downloadId) {
      dispatch(getComplianceDocuments(downloadId, appModels.COMPLIANCETEMPLATE));
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
          const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}`;
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

  useEffect(() => {
    if (addComplianceInfo && addComplianceInfo.data && addComplianceInfo.data.length && !viewId) {
      dispatch(getComplianceDetail(addComplianceInfo.data[0], appModels.COMPLIANCETEMPLATE));
    }
  }, [addComplianceInfo]);

  const totalDataCount = complianceTempCount && complianceTempCount.length && columnFields.length ? complianceTempCount.length : 0;

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
    const oldCustomFilters = complianceTempFilters && complianceTempFilters.customFilters
      ? complianceTempFilters.customFilters
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
    dispatch(getComplianceTempFilters(customFilters1));
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
      const oldCustomFilters = complianceTempFilters && complianceTempFilters.customFilters
        ? complianceTempFilters.customFilters
        : [];
      const filterValues = [
        ...(oldCustomFilters.length > 0
          ? oldCustomFilters.filter(
            (item) => item.type !== 'date'
                && item.type !== 'customdate'
                && item.type !== 'datearray',
          )
          : ''),
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
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getComplianceTempFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = complianceTempFilters && complianceTempFilters.customFilters
        ? complianceTempFilters.customFilters
        : [];
      const filterValues = [
        ...oldCustomFilters,
        ...customFiltersList.filter((item) => item !== value),
      ];
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getComplianceTempFilters(filterValues));
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
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getComplianceTempFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    dispatch(resetAddComplianceInfo());
    showAddModal(false);
  };

  const addComplianceWindow = () => {
    if (document.getElementById('complianceTempForm')) {
      document.getElementById('complianceTempForm').reset();
    }
    dispatch(resetComplianceTemplate());
    dispatch(resetAddComplianceInfo());
    dispatch(resetUpdateTenant());
    showAddModal(true);
  };

  const closeEditModalWindow = () => {
    showEditModal(false);
  };

  const onAddReset = () => {
    dispatch(resetAddComplianceInfo());
    dispatch(resetComplianceTemplate());
    showAddModal(false);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.COMPLIANCETEMPLATE));
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

  const stateValuesList = (complianceTempFilters && complianceTempFilters.customFilters && complianceTempFilters.customFilters.length > 0)
    ? complianceTempFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (complianceTempFilters && complianceTempFilters.customFilters && complianceTempFilters.customFilters.length > 0) ? complianceTempFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (complianceTempInfo && complianceTempInfo.loading) || (complianceTempCountLoading);
  const complianceData = complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0] : '';

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
      'Compliance Obligation',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Building Compliance',
        moduleName: 'Building Compliance',
        menuName: 'Compliance Obligation',
        link: '/buildingcompliance-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const onClickEdit = (id) => {
    setEditId(id);
    dispatch(getComplianceDetail(id, appModels.COMPLIANCETEMPLATE));
    showEditModal(true);
  };

  const tableColumns = ComplianceTemplateColumns(isEditable, onClickEdit);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'compliance_act',
      'compliance_category_id',
      'submitted_to',
    ];
    let query = '"|","|","|",';

    const oldCustomFilters = complianceTempFilters && complianceTempFilters.customFilters
      ? complianceTempFilters.customFilters
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
        dispatch(getComplianceTempFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getComplianceTempFilters(customFilters));
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
    [complianceTempFilters],
  );

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        tableData={
          complianceTempInfo && complianceTempInfo.data && complianceTempInfo.data.length
            ? complianceTempInfo.data
            : []
        }
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Templates"
        exportFileName="Templates"
        listCount={totalDataCount}
        exportInfo={complianceTempExportInfo}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        filters={filterText}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        setRows={setRows}
        pdfStaticColumnWidth={{
          name: { cellWidth: 300 },
          compliance_act: { cellWidth: 500 },
          submitted_to: { cellWidth: 300 },
        }}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={complianceTempInfo && complianceTempInfo.loading}
        err={complianceTempInfo && complianceTempInfo.err}
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
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >

        <DrawerHeader
          headerName="Create Compliance Template"
          imagePath={ComplianceCheck}
          onClose={onViewReset}
        />
        <AddCompliance
          closeModal={() => { showAddModal(false); }}
          afterReset={() => { onAddReset(); }}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editModal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >

        <DrawerHeader
          headerName="Update Compliance Template"
          imagePath={ComplianceCheck}
          onClose={closeEditModalWindow}
        />
        {complianceDetails && complianceDetails.loading && (
          <div className="text-center mt-3">
            <Loader />
          </div>
        )}
        {complianceDetails && !complianceDetails.loading && (
          <AddCompliance editId={editId} isUpdate={editModal ? Math.random() : false} closeModal={closeEditModalWindow} />
        )}
      </Drawer>
      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Compliance"
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
            successMessage="Compliance removed successfully.."
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
            <Button size="sm"   variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </Box>
  );
};

export default Templates;
