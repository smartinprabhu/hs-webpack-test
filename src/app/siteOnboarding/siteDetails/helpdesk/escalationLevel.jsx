/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import pantryBlueIcon from '@images/icons/pantry/pantryBlue.svg';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog, DialogContent, DialogContentText,
  Drawer,
} from '@mui/material';
import { Box } from '@mui/system';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommonGrid from '../../../commonComponents/commonGrid';
import DialogHeader from '../../../commonComponents/dialogHeader';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  debounce,
  formatFilterData,
  generateArrayFromValue,
  getAllowedCompanies, getColumnArrayById,
  getDefaultNoValue,
  getListOfOperations,
  getPagesCountV2,
  isArrayValueExists,
  queryGeneratorWithUtc,
  valueCheck,
  getDateAndTimeForDifferentTimeZones,
} from '../../../util/appUtils';
import {
  getEscalationLevelCount,
  getEscalationLevelFilters,
  getEscalationLevelList, getEsDetails,
  setEquipmentId,
  setRecipientsLocationId,
  setSpaceCategoryId,
  setSpaceId, getEscalationLevelListExport,
} from '../../siteService';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
// import { getEscalationTypeName } from '../../utils/utils';
import {
  EscalationLevelList,
} from '../../../commonComponents/gridColumns';
import actionInvCodes from '../../../inventory/data/actionCodes.json';
import {
  getDelete,
  resetCreateEscalationLevel,
  resetDelete,
  resetUpdateEscalationLevel,
} from '../../../pantryManagement/pantryService';
import { setInitialValues } from '../../../purchase/purchaseService';
import AddEscalationLevel from './addEscalationLevel';
import actionCodes from './data/actionCodes.json';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const EscalationLevel = (props) => {
  const { menuType = false } = props || {};
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [viewModal, setViewModal] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listFieldsESLShows ? customData.listFieldsESLShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [addModal, showAddModal] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [teamCollapse, setTeamCollapse] = useState(true);
  const [addressGroups, setAddressGroups] = useState([]);
  const [modalAlert, setModalAlert] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [openTeam, setOpenTeam] = useState(false);

  const [editData, setEditData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(false);

  const [filtersIcon, setFilterIcon] = useState(false);
  const [scrollDataList, setScrollData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [rows, setRows] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');
  const [reload, setReload] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const companies = getAllowedCompanies(userInfo);
  const {
    addEscalationLevelInfo, updateEscalationLevelInfo, parentCategoryInfo, deleteInfo,
  } = useSelector((state) => state.pantry);
  const {
    escalationLevelCount, escalationLevelListInfo, escalationLevelCountLoading,
    escalationLevelFilters, esInfo, eslExportListInfo,
  } = useSelector((state) => state.site);
  const {
    filterInitailValues,
  } = useSelector((state) => state.purchase);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const apiFields = customData && customData.listFieldsESL;

  const searchColumns = ['name'];

  
  const isInventory = !!(menuType && menuType === 'Inventory');

  const isCreatable = allowedOperations.includes(isInventory ? actionInvCodes['Add Product Category'] : actionCodes['Add Escalation']);
  const isEditable = allowedOperations.includes(isInventory ? actionInvCodes['Edit Product Category'] : actionCodes['Edit Escalation']);
  const isDeleteable = allowedOperations.includes(isInventory ? actionInvCodes['Delete Product Category'] : actionCodes['Delete Escalation']);

  useEffect(() => {
    if (
      visibleColumns
        && Object.keys(visibleColumns)
        && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        type_category: true,
        level: true,
        company: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getEscalationLevelFilters([]));
    }
  }, [reload]);

  useEffect(() => {
    if (userInfo && userInfo.data && (escalationLevelCount && escalationLevelCount.length) && startExport) {
      const offsetValue = 0;
      // setPdfBody([]);
      const customFiltersList = escalationLevelFilters.customFilters
        ? queryGeneratorWithUtc(escalationLevelFilters.customFilters)
        : '';
        // const rows = surveyRows.rows ? surveyRows.rows : [];
      dispatch(
        getEscalationLevelListExport(
          companies,
          appModels.ESCALATIONLEVEL,
          escalationLevelCount.length,
          offsetValue,
          apiFields,
          customFiltersList,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = escalationLevelFilters.customFilters ? queryGeneratorWithUtc(escalationLevelFilters.customFilters) : '';
      dispatch(getEscalationLevelCount(companies, appModels.ESCALATIONLEVEL, customFiltersList, globalFilter));
    }
  }, [userInfo, escalationLevelFilters.customFilters, sortedValue.sortBy, sortedValue.sortField, globalFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = escalationLevelFilters.customFilters ? queryGeneratorWithUtc(escalationLevelFilters.customFilters) : '';
      dispatch(getEscalationLevelList(companies, appModels.ESCALATIONLEVEL, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, escalationLevelFilters.customFilters, globalFilter]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((addEscalationLevelInfo && addEscalationLevelInfo.data) || (updateEscalationLevelInfo && updateEscalationLevelInfo.data) || (deleteInfo && deleteInfo.data))) {
      const customFiltersList = escalationLevelFilters.customFilters ? queryGeneratorWithUtc(escalationLevelFilters.customFilters) : '';
      dispatch(getEscalationLevelCount(companies, appModels.ESCALATIONLEVEL, customFiltersList));
      dispatch(getEscalationLevelList(companies, appModels.ESCALATIONLEVEL, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addEscalationLevelInfo, updateEscalationLevelInfo, deleteInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      const customFiltersList = escalationLevelFilters.customFilters ? queryGeneratorWithUtc(escalationLevelFilters.customFilters) : '';
      dispatch(getEscalationLevelList(companies, appModels.ESCALATIONLEVEL, limit, offsetValue, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, offsetValue, sortedValue.sortBy, sortedValue.sortField, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      const customFiltersList = escalationLevelFilters.customFilters ? queryGeneratorWithUtc(escalationLevelFilters.customFilters) : '';
      dispatch(getEscalationLevelList(companies, appModels.ESCALATIONLEVEL, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [viewId]);

  // useEffect(() => {
  //   const payload = {
  //     rows: checkedRows,
  //   };
  //   dispatch(getCheckedRowsConfigPantry(payload));
  // }, [checkedRows]);

  useEffect(() => {
    if (escalationLevelFilters && escalationLevelFilters.customFilters) {
      setCustomFilters(escalationLevelFilters.customFilters);
      const vid = isArrayValueExists(escalationLevelFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false, false));
        }
      }
    }
  }, [escalationLevelFilters]);

  // useEffect(() => {
  //   if (addEscalationLevelInfo && addEscalationLevelInfo.data && addEscalationLevelInfo.data.length) {
  //     dispatch(getEsDetails(addEscalationLevelInfo.data[0], appModels.ESCALATIONLEVEL));
  //   }
  // }, [addEscalationLevelInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getEsDetails(viewId, appModels.ESCALATIONLEVEL));
    }
  }, [viewId]);

  useEffect(() => {
    if (viewId && updateEscalationLevelInfo && updateEscalationLevelInfo.data) {
      dispatch(getEsDetails(viewId, appModels.ESCALATIONLEVEL));
    }
  }, [updateEscalationLevelInfo]);

  useEffect(() => {
    if (escalationLevelListInfo && escalationLevelListInfo.data && viewId) {
      const arr = [...scrollDataList, ...escalationLevelListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [escalationLevelListInfo, viewId]);

  useEffect(() => {
    if (parentCategoryInfo && parentCategoryInfo.data) {
      setAddressGroups(parentCategoryInfo.data);
    }
  }, [parentCategoryInfo]);

  const totalDataCount = escalationLevelCount && escalationLevelCount.length ? escalationLevelCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const addAdjustmentWindow = () => {
    showAddModal(true);
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const onChangeFilter = (column, text) => {
    column.value = column.value === undefined ? '' : column.value;
    let array = valueArray;
    const filterArray = [];
    if (column.value) {
      array.push(column);
      array = uniqBy(array, 'Header');
      array.map((key) => {
        const filters = {
          key: key.key ? key.key : key.id,
          title: key.title ? key.title : key.Header,
          value: encodeURIComponent(key.value),
          label: key.label ? key.label : key.Header,
          type: key.type ? key.type : text,
          arrayLabel: key.label,
        };
        if (key.start && key.end) {
          filters.start = key.start;
          filters.end = key.end;
        }
        filterArray.push(filters);
      });
      setOffset(0);
      setPage(1);
      const customFiltersList = [];
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getEscalationLevelFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    dispatch(getEscalationLevelFilters([]));
    setOffset(0);
    setPage(1);
  };

  const onAddReset = () => {
    if (document.getElementById('escalationLevelForm')) {
      document.getElementById('escalationLevelForm').reset();
    }
    dispatch(setRecipientsLocationId([]));
    dispatch(setSpaceId([]));
    dispatch(setEquipmentId([]));
    dispatch(setSpaceCategoryId([]));
    dispatch(resetCreateEscalationLevel());
    showAddModal(false);
  };

  const onClickRemoveData = (id, name, productCount) => {
    if (productCount && productCount > 0) {
      setModalAlert(true);
    } else {
      setRemoveId(id);
      setRemoveName(name);
      showDeleteModal(true);
    }
  };

  const openEditModalWindow = (id) => {
    setSelectedUser(id);
    setViewId(id);
    showEditModal(true);
  };

  const onClickClear = () => {
    dispatch(getEscalationLevelFilters([]));
    setValueArray([]);
    filtersFields.escalationLevelColumns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
  };

  useEffect(() => {
    if (selectedUser && escalationLevelListInfo && escalationLevelListInfo.data) {
      const teamData = generateArrayFromValue(escalationLevelListInfo.data, 'id', selectedUser.id);
      setEditData(teamData);
    }
  }, [selectedUser]);

  const closeModal = () => {
    if (document.getElementById('escalationLevelForm')) {
      document.getElementById('escalationLevelForm').reset();
    }
    showAddModal(false);
    showEditModal(false);
    dispatch(resetCreateEscalationLevel());
    dispatch(resetUpdateEscalationLevel());
  };

  const onUpdateReset = () => {
    if (document.getElementById('escalationLevelForm')) {
      document.getElementById('escalationLevelForm').reset();
    }
    dispatch(resetCreateEscalationLevel());
    dispatch(resetUpdateEscalationLevel());
    showEditModal(false);
    setSelectedUser(false);
    setEditData([]);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.ESCALATIONLEVEL));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const handleTeamCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'parent_id', title: 'Parent Category', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getEscalationLevelFilters(customFiltersList));
      removeData('data-parent_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getEscalationLevelFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  function levelLable(staten) {
    if (customData && customData.levelLableText[staten]) {
      const s = customData.levelLableText[staten].label;
      return s;
    }
    return '';
  }

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

    const oldCustomFilters = escalationLevelFilters && escalationLevelFilters.customFilters
      ? escalationLevelFilters.customFilters
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
    dispatch(getEscalationLevelFilters(customFilters1));
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
      const oldCustomFilters = escalationLevelFilters && escalationLevelFilters.customFilters
        ? escalationLevelFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   escalationLevelFilters && escalationLevelFilters.states ? escalationLevelFilters.states : [],
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
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getEscalationLevelFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = escalationLevelFilters && escalationLevelFilters.customFilters
        ? escalationLevelFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   escalationLevelFilters && escalationLevelFilters.states ? escalationLevelFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getEscalationLevelFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(0);
  };

  const tableColumns = EscalationLevelList(openEditModalWindow, onClickRemoveData, isEditable, isDeleteable);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'type_category',
      'level',
    ];
    let query = '"|","|",';

    const oldCustomFilters = escalationLevelFilters && escalationLevelFilters.customFilters
      ? escalationLevelFilters.customFilters
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
        dispatch(getEscalationLevelFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getEscalationLevelFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [escalationLevelFilters],
  );

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const toggleAlert = () => {
    setModalAlert(false);
  };

  const stateValuesList = (escalationLevelFilters && escalationLevelFilters.customFilters && escalationLevelFilters.customFilters.length > 0)
    ? escalationLevelFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const addressValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (escalationLevelFilters && escalationLevelFilters.customFilters && escalationLevelFilters.customFilters.length > 0) ? escalationLevelFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (escalationLevelListInfo && escalationLevelListInfo.loading) || (escalationLevelCountLoading);
  const detailName = esInfo && esInfo.data && esInfo.data.length ? getDefaultNoValue(esInfo.data[0].name) : '';


  return (
    <Box className="insights-box">
      <CommonGrid
        className="tickets-table"
        tableData={
      escalationLevelListInfo && escalationLevelListInfo.data && escalationLevelListInfo.data.length
        ? escalationLevelListInfo.data
        : []
    }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        appModelsName={appModels.COMPANY}
        loading={loading}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        moduleName="Escalation Level List"
        listCount={totalDataCount}
        handlePageChange={handlePageChange}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        setStartExport={setStartExport}
        onFilterChanges={debouncedOnFilterChange}
        filters={filterText}
        exportInfo={eslExportListInfo}
        exportFileName="Escalation Level"
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
        ModalProps={{
          disableEnforceFocus: true,
        }}
        anchor="right"
        open={addModal}
      >

        <DrawerHeader
          headerName="Create Escalation Level"
          imagePath={isInventory ? InventoryBlue : pantryBlueIcon}
          onClose={() => onAddReset()}
          className="w-auto height-28 ml-2 mr-2"
        />
        <AddEscalationLevel closeModal={closeModal} selectedUser={false} closeAddModal={() => { showAddModal(false); }} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        ModalProps={{
          disableEnforceFocus: true,
        }}
        anchor="right"
        open={editModal}
      >

        <DrawerHeader
          headerName="Update Escalation Level"
          imagePath={isInventory ? InventoryBlue : pantryBlueIcon}
          onClose={() => onUpdateReset()}
          className="w-auto height-28 ml-2 mr-2"
        />

        <AddEscalationLevel closeModal={() => onUpdateReset()} selectedUser={selectedUser} editData={editData} />
      </Drawer>
      <Dialog
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        fullWidth = {deleteInfo && deleteInfo.data ? false :true}
        open={deleteModal}
      >
        <DialogHeader
          title="Delete Escalation Level"
          imagePath={false}
          onClose={() => onRemoveDataCancel()}
          response={deleteInfo}
        />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
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
                successMessage="Escalation removed successfully.."
              />
            )}
            <div className="float-right mt-3">
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
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        size="sm"
        fullWidth
        open={modalAlert}
      >
        <DialogHeader
          title="Alert"
          imagePath={false}
          onClose={() => toggleAlert()}
          response={deleteInfo}
        />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can not delete this. Because the product category has number of products.
            <div className="float-right mt-3">
              <Button variant="contained" onClick={() => { setModalAlert(false); }}>Ok</Button>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EscalationLevel;
