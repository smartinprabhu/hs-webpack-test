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
import addIcon from '@images/icons/plusCircleBlue.svg';
import workOrdersBlue from '@images/icons/workPermitBlue.svg';
import editIcon from '@images/icons/edit.svg';
import { makeStyles } from '@material-ui/core';
import Loader from '@shared/loading';
import {
  Drawer,
  Typography,
  Checkbox,
} from '@mui/material';
import {
  Tooltip,
} from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row, Table,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import DrawerHeader from '../../../../commonComponents/drawerHeader';
import {
  getColumnArrayById,
} from '../../../../util/appUtils';
import {
  setRecipientsLocationId,
} from '../../../siteService';
import { AddThemeColor } from '../../../../themes/theme';
import AddEmail from '../addEmail';
import customData from '../data/customData.json';

const useStyles = makeStyles({
  root: {
    color: AddThemeColor({}).color,
    checked: {
      color: AddThemeColor({}).color,
    },
  },
});

const ProductForm = (props) => {
  const {
    editId,
    subCategoryValues,
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    helpdesk_lines
  } = formValues;
  const classes = useStyles();
  const [partsData, setPartsData] = useState(subCategoryValues);
  const [partsAdd, setPartsAdd] = useState(false);
  const [addModal, showAddModal] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [editData, setEditData] = useState([]);
  const [editEmailId, setEditEmailId] = useState(false);
  const { helpdeskSettingsInfo } = useSelector((state) => state.site);
  const [editPageIndex, setEditPageIndex] = useState(false);
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

  useEffect(() => {
    if (editId && (helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length
      && helpdeskSettingsInfo.data[0].helpdesk_lines && helpdeskSettingsInfo.data[0].helpdesk_lines.length)
      && (updateProductCategoryInfo && !updateProductCategoryInfo.err)) {
      const newArrData = helpdeskSettingsInfo.data[0].helpdesk_lines.map((cl) => ({
        ...cl,
        id: cl.id,
        is_requestee: cl.is_requestee,
        helpdesk_state: cl.helpdesk_state,
        is_maintenance_team: cl.is_maintenance_team,
        is_recipients: cl.is_recipients,
        is_send_sms: cl.is_send_sms,
        is_push_notify: cl.is_push_notify,
      }));
      setFieldValue('helpdesk_lines', newArrData);
      setPartsData(newArrData);
      setPartsAdd(Math.random());
    }
  }, [editId, helpdeskSettingsInfo]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('helpdesk_lines', partsData);
    }
  }, [partsData]);

  const loadEmptyTd = () => {
    setEditData([]);
    showAddModal(true);
    dispatch(setRecipientsLocationId([]));
  };

  const removeData = (e, index) => {
    const newData = partsData;
    const { id } = newData[index];
    if (id) {
      newData[index].isRemove = true;
      setFieldValue('helpdesk_lines', newData);
      setPartsData(newData);
      setPartsAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setPartsData(newData);
      setFieldValue('helpdesk_lines', newData);
      setPartsAdd(Math.random());
    }
  };

  function getConditionLabel(value) {
    let res = '';
    if (customData && customData.stateText[value]) {
      res = customData.stateText[value].label;
    }

    return res;
  }

  const closeAddWorkOrder = () => {
    if (document.getElementById('helpdeskStateEmailForm')) {
      document.getElementById('helpdeskStateEmailForm').reset();
    }
    setEditData([]);
    setEditPageIndex(false);
    setEditEmailId(false);
    // setFieldValue('helpdesk_lines', partsSelected);
    showAddModal(false);
  };

  const closeEditWorkOrder = () => {
    setEditData([]);
    setEditPageIndex(false);
    setEditEmailId(false);
    setFieldValue('helpdesk_lines', partsData);
    if (document.getElementById('helpdeskStateEmailForm')) {
      document.getElementById('helpdeskStateEmailForm').reset();
    }
    showEditModal(false);
  };

  const getTypes = (types) => {
    const array = customData.stateTypes;
    const newArray = [];
    for (let i = 0; i < array.length; i += 1) {
      if (!types.includes(array[i].value)) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  };

  const pData = helpdesk_lines && helpdesk_lines.length > 0 ? helpdesk_lines : [];
  const notRemovedData = pData.filter((item) => item && !item.isRemove);

  const types = pData && pData.length > 0 ? getColumnArrayById(notRemovedData, 'helpdesk_state') : '';
  const typeOptions = types !== '' ? getTypes(types) : customData.stateTypes;

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
          Communication  Settings
        </Typography>
      </Col>
      <Typography
        sx={AddThemeColor({
          font: 'normal normal medium 20px/24px Suisse Intl',
          letterSpacing: '0.7px',
          fontWeight: 500,
          marginBottom: '10px',
          marginLeft: '15px',
          marginTop: '10px',
          paddingBottom: '4px',
        })}
      >
        Email Notification by Helpdesk Ticket State
      </Typography>
      <Row className="">
        <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
          {helpdeskSettingsInfo && helpdeskSettingsInfo.loading && (
            <div className="p-3" data-testid="loading-case">
              <Loader />
            </div>
          )}
          <Table responsive id="spare-part">
            <thead className="bg-lightblue">
              <tr>
                <th className="p-2 min-width-160 border-0">
                  Helpdesk Status
                </th>
                <th className="p-2 min-width-160 border-0">
                  Send to Requester
                </th>
                <th className="p-2 min-width-160 border-0">
                  Send to Maintenance Team
                </th>
                <th className="p-2 min-width-160 border-0">
                  Additional Recipients
                </th>
                <th className="p-2 min-width-160 border-0">
                  Allow Push Notification
                </th>
                <th className="p-2 min-width-160 border-0">
                  Allow SMS
                </th>
                <th className="p-2 min-width-160 border-0">
                  <span className="invisible">Del</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {typeOptions && typeOptions.length > 0
                ? (
                  <tr>
                    <td colSpan="7" className="text-left">
                      <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                        <span className="mr-5">Add a Line</span>
                      </div>
                    </td>
                  </tr>
                ) : ''}
              {(helpdesk_lines && helpdesk_lines.length > 0 && helpdesk_lines.map((pl, index) => (
                <>
                  {!pl.isRemove && (
                    <tr key={index}>
                      <td className="p-2">
                        {getConditionLabel(pl.helpdesk_state)}
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
                          name="is_maintenance_team"
                          id="is_maintenance_team"
                          value={pl.is_maintenance_team}
                          checked={pl.is_maintenance_team}
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
                        <Checkbox
                          name="is_push_notify"
                          id="is_push_notify"
                          value={pl.is_push_notify}
                          checked={pl.is_push_notify}
                        />
                      </td>
                      <td className="p-2">
                        <Checkbox
                          name="is_send_sms"
                          id="is_send_sms"
                          value={pl.is_send_sms}
                          checked={pl.is_send_sms}
                        />
                      </td>
                      <td className="p-2">
                        <Tooltip title="Edit">
                          <span>
                            <img
                              aria-hidden="true"
                              src={editIcon}
                              className="cursor-pointer mr-3"
                              height="12"
                              width="12"
                              alt="edit"
                              onClick={() => { setEditData(pl); setEditPageIndex(index + 1); setEditEmailId(pl.id ? pl.id : false); showEditModal(true); }}
                            />
                          </span>
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
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Helpdesk State Email"
          imagePath={workOrdersBlue}
          onClose={closeAddWorkOrder}
        />
        <AddEmail closeModal={closeAddWorkOrder} selectedData={partsData} setFieldVal={setPartsData} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editModal}
      >
        <DrawerHeader
          headerName="Update Helpdesk State Email"
          imagePath={workOrdersBlue}
          onClose={closeEditWorkOrder}
        />
        <AddEmail closeModal={closeEditWorkOrder} selectedData={partsData} editPageIndex={editPageIndex} editData={editData} editId={editEmailId} setFieldVal={setPartsData} />
      </Drawer>
    </>
  );
};

ProductForm.propTypes = {
  subCategoryValues: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default ProductForm;
