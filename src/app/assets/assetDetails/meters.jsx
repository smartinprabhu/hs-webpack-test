/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Modal,
  ModalBody,
  Table,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import editWhiteIcon from '@images/icons/editWhite.svg';
import editIcon from '@images/icons/edit.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getMeters, resetUpdateEquipment } from '../equipmentService';
import { getDefaultNoValue, generateErrorMessage } from '../../util/appUtils';
import { getMeasureLabel } from '../utils/utils';
import MetersUpdate from './metersUpdate/meterUpdate';

const appModels = require('../../util/appModels').default;

const Meters = React.memo((props) => {
  const { ids, type } = props;
  const [editData, setEditData] = useState([]);
  const [editMeterModal, showEditMeterModal] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [currentId, setCurrentId] = useState(false);
  const dispatch = useDispatch();

  const { assetMeters, updateEquipment } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (ids) {
      dispatch(getMeters(ids, appModels.METER));
    }
  }, [ids]);

  const closeEditModalWindow = () => {
    dispatch(resetUpdateEquipment());
    showEditMeterModal(false);
    setEditData([]);
  };

  const onHoverHeld = (id) => {
    setButtonHover(true);
    setCurrentId(id);
  };

  const onHoverRelease = () => {
    setButtonHover(false);
    setCurrentId(false);
  };

  const onEditClick = (data) => {
    setEditData(data);
    showEditMeterModal(true);
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].meter_id ? assetData[i].meter_id[1] : '')}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].meter_id_primary_id)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].theoretical_time)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].theorical_utilization)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].actual_utilization)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].measure_type === 'up' ? 'Progressive' : 'Delta')}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].resource_calendar_id ? assetData[i].resource_calendar_id[1] : '')}</td>
          <td className="p-2">{getDefaultNoValue(getMeasureLabel(assetData[i].meter_uom))}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].active_type)}</td>
          <td className="p-2">{assetData[i].create_mo ? 'Yes' : 'No'}</td>
          <td className="p-2">
            <Button
               variant="contained"
              size="sm"
              onClick={() => onEditClick(assetData[i])}
              onMouseLeave={() => onHoverRelease()}
              onMouseEnter={() => onHoverHeld(assetData[i].meter_id_primary_id)}
              className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
            >
              <img src={isButtonHover && currentId === assetData[i].guage_primary_id ? editWhiteIcon : editIcon} className="mr-2 pb-2px" height="12" width="12" alt="edit" />
              <span className="mr-2">Edit</span>
            </Button>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
          {(assetMeters && assetMeters.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Meter
                  </th>
                  <th className="p-2 min-width-100">
                    Meter ID
                  </th>
                  <th className="p-2 min-width-200">
                    Threshold Time (Hours)
                  </th>
                  <th className="p-2 min-width-160">
                    Threshold Utilization
                  </th>
                  <th className="p-2 min-width-160">
                    Actual Utilization
                  </th>
                  <th className="p-2 min-width-160">
                    Measure Type
                  </th>
                  <th className="p-2 min-width-200">
                    Equipment Working Time
                  </th>
                  <th className="p-2">
                    UOM
                  </th>
                  <th className="p-2">
                    Type
                  </th>
                  <th className="p-2 min-width-100">
                    Create MO?
                  </th>
                  <th className="p-2 min-width-100">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(assetMeters && assetMeters.data ? assetMeters.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {assetMeters && assetMeters.loading && (
          <Loader />
          )}
          {(assetMeters && assetMeters.err) && (
          <ErrorContent errorTxt={generateErrorMessage(assetMeters)} />
          )}
          {type === 'equipment' && (
          <Modal size={(updateEquipment && updateEquipment.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={editMeterModal}>
            <ModalHeaderComponent title="Edit Meter" imagePath={false} closeModalWindow={closeEditModalWindow} response={updateEquipment} />
            <ModalBody className="pt-0 mt-0">
              <MetersUpdate editData={editData} closeModal={closeEditModalWindow} />
            </ModalBody>
          </Modal>
          )}
        </Col>
      </Row>

    </>
  );
});

Meters.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
};

export default Meters;
