/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import { Cascader, Divider } from 'antd';
import {
  getGridStringOperators,
  GridPagination,
} from '@mui/x-data-grid-pro';
import Drawer from '@mui/material/Drawer';

import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import assetIcon from '@images/icons/assetDefault.svg';

import CommonGrid from '../../commonComponents/commonGridStaticData';
import DrawerHeader from '../../commonComponents/drawerHeader';
import {
  getDefaultNoValue, extractNameObject, generateErrorMessage, getAllowedCompanies,
  preprocessData,
} from '../../util/appUtils';
import {
  getCascader, getSpaceAllSearchList,
} from '../../helpdesk/ticketService';
import {
  getBuildings, getAllSpaces,
} from '../../assets/equipmentService';
import { addParents, addChildrens } from '../../helpdesk/utils/utils';

const appModels = require('../../util/appModels').default;

const SpaceSelection = React.memo(({
  setSpaces, spaces, categoryId, finishText, filterModal, onCancel,
}) => {
  const [addModal, showAddModal] = useState(filterModal);
  const [partsData, setPartsData] = useState(spaces);
  const [triggerChange, setTriggerChange] = useState('');
  const [orgData, setOriginal] = useState(JSON.stringify(spaces));

  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [childLoad, setChildLoad] = useState(false);

  const [viewModal, setViewModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState(spaces);
  const [selectedSpaces, setSelectedSpaces] = useState([]);

  const [parentId, setParentId] = useState('');
  const [spaceId, setSpaceId] = useState(false);
  const [assetId, setAssetId] = useState(false);
  const [spaceCategoryId, setSpaceCategoryId] = useState('');
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);

  const { inspectionParentsInfo } = useSelector((state) => state.inspection);

  const dispatch = useDispatch();

  const {
    spaceCascader,
  } = useSelector((state) => state.ticket);
  const {
    buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    dispatch(getBuildings(companies, appModels.SPACE, false, false, false, categoryId || false));
  }, []);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setChildValues(addParents(buildingsInfo.data));
    }
  }, [buildingsInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      setChildLoad(true);
      const childData = addChildrens(childValues, buildingSpaces.data[0].child, parentId);
      setChildValues(childData);
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if (childValues) {
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces, childLoad]);

  useEffect(() => {
    if (
      visibleColumns
        && Object.keys(visibleColumns)
        && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        space_name: true,
        path_name: true,
        type: true,
      });
    }
  }, [visibleColumns]);

  /* useEffect(() => {
    setFieldValue('bulk_events', partsData);
  }, [triggerChange]); */

  useEffect(() => {
    setOriginal(JSON.stringify(spaces));
  }, [spaces]);

  useEffect(() => {
    setSelectedRows(selectedRows);
  }, [selectedRows]);

  const removeData = (e, index) => {
    const newItems = [...partsData];
    newItems.splice(index, 1);
    setPartsData(newItems);
    setTriggerChange(Math.random());
  };

  const onReset = () => {
    setPartsData([]);
    setSelectedRows([]);
    setAssetId(false);
    setSpaceId(false);
    setSelectedSpaces([]);
    setSpaces([]);
    setTriggerChange(Math.random());
  };

  const onSave = () => {
    setSpaces(selectedRows);
  };

  const onSingleReset = () => {
    setAssetId(false);
    setSpaceId(false);
  };

  const onSingleAdd = () => {
    const newData = [selectedSpaces[selectedSpaces.length - 1]];
    const allData = [...newData, ...partsData];
    const newData1 = [...new Map(allData.map((item) => [item.id, item])).values()];

    const allData1 = [...newData, ...selectedRows];
    const newData2 = [...new Map(allData1.map((item) => [item.id, item])).values()];

    setSelectedRows(newData2);
    setPartsData(newData1);
    // setAssetId(false);
    // setSpaceId(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const getValue = (value) => {
    let fieldValue = value || '-';
    if (Array.isArray(fieldValue)) {
      fieldValue = value[1];
    } else if (fieldValue && typeof fieldValue === 'object' && !Object.keys(fieldValue).length) {
      fieldValue = '-';
    } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.name) {
      fieldValue = value.name;
    } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.path_name) {
      fieldValue = value.path_name;
    } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.space_name) {
      fieldValue = value.space_name;
    }
    return fieldValue;
  };

  const columns = () => (
    [
      {
        field: 'space_name',
        headerName: 'Name',
        flex: 1,
        minWidth: 160,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'type',
        headerName: 'Category',
        flex: 1,
        minWidth: 160,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'path_name',
        headerName: 'Full Path',
        flex: 1,
        minWidth: 160,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
    ]);

  const onFilterChange = (data) => {
    if (data.items && data.items.length) {
      setPage(0);
    }
  };

  const rowHeight = 100; // Approximate height of a single row in pixels
  const maxHeight = window.innerHeight - 270; // Max height based on viewport
  const rowCount = partsData.length ? partsData.length + 1 : 1;
  // Calculate the height
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);

  const count = selectedRows?.length || 0;

  const CustomFooter = () => (
    <div
      className="font-family-tab"
      style={{
        display: 'flex',
        justifyContent: 'space-between', // puts items on left and right
        alignItems: 'center', // vertically center
        padding: '10px 16px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
      }}
    >

      <div
        style={{
          fontWeight: 'bold',
          visibility: count > 0 ? 'visible' : 'hidden',
        }}
      >
        {count}
        {' '}
        {count === 1 ? 'Space' : 'Spaces'}
        {' '}
        Selected
      </div>

      <GridPagination />
    </div>
  );

  const onChange = (value, selectedOptions) => {
    setParentId('');
    if (selectedOptions && selectedOptions.length) {
      if (!selectedOptions[0].parent_id) {
        setParentId(selectedOptions[0].id);
        setSpaceId(selectedOptions[0].id);
        setSpaceCategoryId(selectedOptions[0].typeId);
        if (spaceId !== selectedOptions[0].id) {
          dispatch(getAllSpaces(selectedOptions[0].id, companies));
        }
      } else {
        setSpaceCategoryId(selectedOptions[0].typeId);
      }

      setSelectedSpaces(selectedOptions);
      // setSelectedRows(newData1);
    }
    setAssetId(value);
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {loading && (
      <>
        <Divider style={{ margin: 0 }} />
        <div className="text-center p-2" data-testid="loading-case">
          <Spinner animation="border" size="sm" className="text-dark ml-3" variant="secondary" />
        </div>
      </>
      )}
      {((buildingsInfo && buildingsInfo.err) || isUserError) && (
      <>
        <Divider style={{ margin: 0 }} />
        <ErrorContent errorTxt={errorMsg} />
      </>
      )}
      {((buildingSpaces && buildingSpaces.err) || isUserError) && (
      <>
        <Divider style={{ margin: 0 }} />
        <ErrorContent errorTxt={errorMsg1} />
      </>
      )}
    </div>
  );

  const onCancelModal = () => {
    showAddModal(false);
    onCancel();
  };

  return (
    <Drawer
      PaperProps={{
        sx: { width: '80%' },
      }}
      anchor="right"
      open={addModal}
      ModalProps={{
        disableEnforceFocus: false,
      }}
    >
      <DrawerHeader
        headerName="Select Spaces"
        imagePath={assetIcon}
        onClose={() => onCancelModal()}
      />
      <div className="mb-4 p-3">
        <Row className="content-center">
          <Col xs={8} sm={8} md={6} lg={6}>
            <FormLabel id="demo-row-radio-buttons-group-label" className="font-family-tab font-tiny">
              Spaces
              {' '}
              <span className="ml-1 text-danger font-weight-800"> * </span>
            </FormLabel>
            <Cascader
              options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}
              dropdownClassName="custom-cascader-popup"
              value={spaceCascader && spaceCascader.length > 0
                ? assetId : []}
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              onChange={onChange}
              placeholder="Select Space"
              dropdownRender={dropdownRender}
              notFoundContent="No options"
              className="thin-scrollbar bg-white mb-3 pb-1 w-100"
                    // loadData={loadData}
              changeOnSelect
            />
          </Col>
          <Col xs={8} sm={8} md={6} lg={6}>
            <Button
              type="button"
              variant="contained"
              className="reset-btn-new1 mr-2"
              size="small"
              disabled={!assetId || !(selectedSpaces && selectedSpaces.length > 0)}
              onClick={() => onSingleReset()}
            >
              Reset

            </Button>
            <Button
              type="button"
              variant="contained"
              size="small"
              className="submit-btn-auto"
              disabled={!assetId || !(selectedSpaces && selectedSpaces.length > 0)}
              onClick={() => onSingleAdd()}
            >
              Add

            </Button>

          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="">
            {partsData && partsData.length > 0 && (
            <>
              <p className="font-famly-tab">Selected Spaces</p>
              <CommonGrid
                className="reports-table-tab"
                componentClassName="commonGrid"
                tableData={partsData}
                // sx={partsData.length > 0 ? { height: `${tableHeight}px` } : { height: '250px', overflow: 'hidden' }}
                page={page}
                columns={columns()}
                rowCount={partsData.length}
                limit={20}
                checkboxSelection
                pagination
                disableRowSelectionOnClick
                exportFileName="Schedules"
                listCount={partsData.length}
                visibleColumns={visibleColumns}
                onFilterChanges={onFilterChange}
                setVisibleColumns={setVisibleColumns}
                setViewModal={setViewModal}
                setViewId={setViewModal}
                isSelection
                setRows={setRows}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                loading={false}
                err={false}
                noHeader
                tabTable
                showFooter
                CustomFooter={CustomFooter}
                handlePageChange={handlePageChange}
              />
            </>
            )}
          </Col>
        </Row>
        {partsData && partsData.length > 0 && (
        <div className="float-right mb-3">
          <Button
            type="button"
            variant="contained"
            className="reset-btn-new1 mr-2"
            onClick={() => onReset()}
          >
            Reset Spaces

          </Button>
          <Button
            type="button"
            variant="contained"
            className="submit-btn-auto"
            onClick={() => onSave()}
          >
            {finishText || 'Get Schedules'}

          </Button>
        </div>
        )}
      </div>
    </Drawer>
  );
});

export default SpaceSelection;
