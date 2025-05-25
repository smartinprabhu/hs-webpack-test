/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import editIcon from '@images/icons/edit.svg';
import inventoryBlue from '@images/icons/inventoryBlue.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import {
  Typography, Drawer, Checkbox,
} from '@mui/material';
import Loader from '@shared/loading';
import { Tooltip } from 'antd';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row, Table
} from 'reactstrap';
import DrawerHeader from '../../../../commonComponents/drawerHeader';
import { AddThemeColor } from '../../../../themes/theme';
import { extractValueObjects } from '../../../../util/appUtils';
import {
  setRecipientsLocationId,
} from '../../../siteService';
import AddEmail from '../addEmail';
import customData from '../data/customData.json';

const InventoryForm = (props) => {
  const {
    editId,
    subCategoryValues,
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    line_ids
  } = formValues;
  const [partsData, setPartsData] = useState(subCategoryValues);
  const [partsAdd, setPartsAdd] = useState(false);
  const [addModal, showAddModal] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [editData, setEditData] = useState([]);
  const [editEmailId, setEditEmailId] = useState(false);
  const [editPageIndex, setEditPageIndex] = useState(false);
  const { inventorySettingsInfo } = useSelector((state) => state.site);
  const {
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  useEffect(() => {
    setPartsData([]);
  }, []);

  useEffect(() => {
    setPartsData(subCategoryValues);
    setPartsAdd(Math.random());
  }, [subCategoryValues]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
    }
  }, [partsAdd]);

  const recipientData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data[0] ? inventorySettingsInfo.data[0].recipients_ids : [];

  useEffect(() => {
    if (editId && (inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length
      && inventorySettingsInfo.data[0].line_ids && inventorySettingsInfo.data[0].line_ids.length)
      && (updateProductCategoryInfo && !updateProductCategoryInfo.err)) {
      const newArrData = inventorySettingsInfo.data[0].line_ids.map((cl) => ({
        ...cl,
        id: cl.id,
        request_state: extractValueObjects(cl.request_state),
        code: extractValueObjects(cl.code),
        is_requestee: cl.is_requestee,
        is_recipients: cl.is_recipients,
        is_send_email: cl.is_send_email,
        // recipients_ids: cl.recipients_ids && cl.recipients_ids.length && cl.recipients_ids.length > 0
        //   ? [[6, 0, getColumnArrayById(cl.recipients_ids, 'id')]] : [[6, 0, []]],
      }));
      setFieldValue('line_ids', newArrData);
      setPartsData(newArrData);
      setPartsAdd(Math.random());
    }
  }, [editId, inventorySettingsInfo]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('line_ids', partsData);
    }
  }, [partsData]);

  const loadEmptyTd = () => {
    dispatch(setRecipientsLocationId([]));
    setEditData([]);
    showAddModal(true);
  };

  const removeData = (e, index) => {
    const newData = partsData;
    const { id } = newData[index];
    if (id) {
      newData[index].isRemove = true;
      setFieldValue('line_ids', newData);
      setPartsData(newData);
      setPartsAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setPartsData(newData);
      setFieldValue('line_ids', newData);
      setPartsAdd(Math.random());
    }
  };

  function getRequestLabel(value) {
    let res = '';
    if (customData && customData.stateText[value]) {
      res = customData.stateText[value].label;
    }

    return res;
  }

  function getTypeTextLabel(value) {
    let res = '';
    if (customData && customData.typeText[value]) {
      res = customData.typeText[value].label;
    }

    return res;
  }

  const closeAddWorkOrder = () => {
    if (document.getElementById('inventoryStateEmailForm')) {
      document.getElementById('inventoryStateEmailForm').reset();
    }
    setEditData([]);
    setEditPageIndex(false);
    setEditEmailId(false);
    showAddModal(false);
  };

  const closeEditWorkOrder = () => {
    if (document.getElementById('inventoryStateEmailForm')) {
      document.getElementById('inventoryStateEmailForm').reset();
    }
    setFieldValue('line_ids', partsData);
    setEditData([]);
    setEditPageIndex(false);
    setEditEmailId(false);
    showEditModal(false);
  };

  return (
    <>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-3 mt-3 pl-2 ml-1">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          Communication Settings
        </Typography>
      </Col>
      <Typography
        sx={AddThemeColor({
          font: 'normal normal medium 18px/22px Suisse Intl',
          letterSpacing: '0.7px',
          fontWeight: 500,
          marginBottom: '10px',
          marginTop: '10px',
          marginLeft: '13px',
          fontSize: '13px',
          paddingBottom: '4px',
        })}
      >
        Email Notification by Inventory Record State
      </Typography>
      <Row className="">
        <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
          {inventorySettingsInfo && inventorySettingsInfo.loading && (
            <div className="p-3" data-testid="loading-case">
              <Loader />
            </div>
          )}
          <Table responsive id="spare-part">
            <thead className="bg-lightblue">
              <tr>
                <th className="p-2 min-width-160 border-0">
                  Request Status
                </th>
                <th className="p-2 min-width-160 border-0">
                  Type of Operation
                </th>
                <th className="p-2 min-width-160 border-0">
                  To Requestor
                </th>
                <th className="p-2 min-width-160 border-0">
                  Recipient Group
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="text-left">
                  <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                    <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                    <span className="mr-5">Add a Line</span>
                  </div>
                </td>
              </tr>
              {(line_ids && line_ids.length > 0 && line_ids.map((pl, index) => (
                <>
                  {!pl.isRemove && (
                    <tr key={index}>
                      <td className="p-2">
                        {getRequestLabel(pl.request_state)}
                      </td>
                      <td className="p-2">
                        {getTypeTextLabel(pl.code)}
                      </td>
                      <td className="p-2">
                        <Checkbox
                          name="is_requestee"
                          id="is_requestee"
                          value={pl.is_requestee}
                          checked={pl.is_requestee}
                        />
                      </td>
                      <td className="p-2">
                        <Checkbox
                          name="is_recipients"
                          id="is_recipients"
                          value={pl.is_recipients}
                          checked={pl.is_recipients}
                        />
                      </td>
                      <td className="p-2">
                        <Tooltip title="Edit">
                          <img
                            aria-hidden="true"
                            src={editIcon}
                            className="cursor-pointer mr-3"
                            height="12"
                            width="12"
                            alt="edit"
                            onClick={() => {
                              dispatch(setRecipientsLocationId(recipientData));
                              setEditData(pl);
                              setEditPageIndex(index + 1);
                              setEditEmailId(pl.id ? pl.id : false);
                              showEditModal(true);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                        </Tooltip>
                      </td>
                    </tr>
                  )}
                </>
              )))}
            </tbody>
          </Table>
        </Col>
      </Row>
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
          headerName="Create Inventory State Email"
          imagePath={inventoryBlue}
          onClose={closeAddWorkOrder}
        />
        <AddEmail closeModal={closeAddWorkOrder} selectedData={partsData} setFieldVal={setPartsData} />
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
          headerName="Update Inventory State Email"
          imagePath={inventoryBlue}
          onClose={closeEditWorkOrder}
        />
        <AddEmail closeModal={closeEditWorkOrder} selectedData={partsData} editPageIndex={editPageIndex} editData={editData} editId={editEmailId} setFieldVal={setPartsData} />
      </Drawer>
    </>
  );
};

InventoryForm.propTypes = {
  subCategoryValues: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default InventoryForm;
