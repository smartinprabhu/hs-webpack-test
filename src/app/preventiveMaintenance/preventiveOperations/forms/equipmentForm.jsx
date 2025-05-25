/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

import closeCirclegreyIcon from '@images/icons/closeCircleGrey.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import theme from '../../../util/materialTheme';
import Equipments from '../../equipments/equipments';
import {
  getEquipmentsExport,
} from '../../../assets/equipmentService';
import {
  getSelectedEquipmentRows,
} from '../../ppmService';
import {
  getColumnArrayById, queryGenerator, getLocalDate,
  getAllowedCompanies, queryGeneratorWithUtc,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const EquipmentForm = (props) => {
  const {
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const { is_all_records } = formValues;
  const [equipmentModal, showEquipmentModal] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [enter, setEnter] = useState('');
  const [remove, setRemove] = useState('');
  const columns = ['name', 'equipment_seq', 'category_id', 'location_id', 'state', 'warranty_end_date', 'equipment_number', 'company_id'];

  const toggle = () => {
    showEquipmentModal(!equipmentModal);
  };
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    equipmentRows, equipmentFilters, equipmentsExportInfo,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (equipmentsExportInfo && equipmentsExportInfo.data) {
      const arr = [...equipmentList, ...equipmentsExportInfo.data];
      setEquipmentList([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [equipmentsExportInfo]);

  const removeSelectedEquipment = (removeEquipment) => {
    const equipments = equipmentList;
    const index = equipments.findIndex((equipment) => equipment.id === removeEquipment.id);
    equipments.splice(index, 1);
    setEquipmentList(equipments);
    setRemove(Math.random());
  };

  useEffect(() => {
    if (remove) {
      setEquipmentList(equipmentList);
      setFieldValue('equipment_ids', getColumnArrayById(equipmentList, 'id'));
      dispatch(getSelectedEquipmentRows(equipmentList));
    }
  }, [remove]);

  useEffect(() => {
    if (equipmentList) {
      setEquipmentList(equipmentList);
      setFieldValue('equipment_ids', getColumnArrayById(equipmentList, 'id'));
      dispatch(getSelectedEquipmentRows(equipmentList));
    }
  }, [equipmentList]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (equipmentRows && equipmentRows.rows && equipmentRows.rows.length > 0)) {
      const offsetValue = 0;
      const statusValues = equipmentFilters.statuses ? getColumnArrayById(equipmentFilters.statuses, 'id') : [];
      const categories = equipmentFilters.categories ? getColumnArrayById(equipmentFilters.categories, 'id') : [];
      const customFilters = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false,userInfo.data) : '';
      const rows = equipmentRows.rows ? equipmentRows.rows : [];
      dispatch(getEquipmentsExport(companies, appModels.EQUIPMENT, equipmentRows.rows.length, offsetValue, columns, statusValues, categories, customFilters, rows));
    }
  }, [enter]);

  return (
    <>
      <ThemeProvider theme={theme}>
        {is_all_records === 'multiple'
          ? (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Table responsive>
                  <thead className="bg-lightblue">
                    <tr>
                      <th className="p-2 min-width-160 border-0">
                        Equipment Name
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        Equipment Number
                      </th>
                      <th className="p-2 w-20 border-0">
                        Category
                      </th>
                      <th className="p-2 w-25 border-0">
                        Space
                      </th>
                      <th className="p-2 min-width-100 border-0">
                        Status
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        Warranty End
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        Description
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        Company
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        <span className="invisible">Del</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="9" className="text-right">
                        <div className="cursor-pointer" onClick={() => showEquipmentModal(true)}>
                          <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                          <span className="text-lightblue mr-5">Add a Line</span>
                        </div>
                      </td>
                    </tr>
                    {equipmentList && equipmentList.length > 0 && equipmentList.map((equipment) => (
                      <tr key={equipment.id}>
                        <td
                          aria-hidden="true"
                          className="w-20"
                        >
                          <span className="font-weight-400">{equipment.name}</span>
                        </td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{equipment.equipment_seq ? equipment.equipment_seq : ''}</span></td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{equipment.category_id ? equipment.category_id[1] : ''}</span></td>
                        <td className="w-25"><span className="font-weight-400 d-inline-block">{equipment.location_id ? equipment.location_id[1] : ''}</span></td>
                        <td className="w-15">{equipment.state}</td>
                        <td className="w-15">{getLocalDate(equipment.warranty_end_date)}</td>
                        <td className="w-15">{equipment.equipment_number}</td>
                        <td><span className="font-weight-400 d-inline-block">{equipment.company_id ? equipment.company_id[1] : ''}</span></td>
                        <td>
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={() => removeSelectedEquipment(equipment)} />
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              <Modal size="xl" className="border-radius-50px" isOpen={equipmentModal}>
                <ModalHeader className="modal-equipment-header">
                  <Row>
                    <Col sm="12" md="12" lg="12" xs="12">
                      <img
                        aria-hidden="true"
                        className="ml-2 mt-0 tab_nav_link cursor-pointer float-right"
                        onClick={toggle}
                        alt="close"
                        width="17"
                        height="17"
                        src={closeCirclegreyIcon}
                      />
                      <h4 className="border-bottom pb-3 mb-0">Add Equipment</h4>
                    </Col>
                  </Row>
                </ModalHeader>
                <ModalBody className="pt-0">
                  <Equipments />
                </ModalBody>
                <ModalFooter>
                  <Button variant="contained" onClick={() => { showEquipmentModal(false); }} size="sm" className="bg-mediumgrey text-lato-black border-0 mr-2">
                    CANCEL
                  </Button>
                  {equipmentRows && equipmentRows.rows && equipmentRows.rows.length > 0
                    ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => { setEnter(Math.random()); showEquipmentModal(false); }}
                         variant="contained"
                      >
                        {' '}
                        Add
                      </Button>
                    ) : ''}
                </ModalFooter>
              </Modal>
            </Row>
          )
          : ''}
      </ThemeProvider>
    </>
  );
};

EquipmentForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default EquipmentForm;
