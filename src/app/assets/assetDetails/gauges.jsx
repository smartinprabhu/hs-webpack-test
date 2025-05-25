/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
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
import { getGauges, resetUpdateEquipment } from '../equipmentService';
import { getDefaultNoValue, generateErrorMessage } from '../../util/appUtils';
import GaugeUpdate from './gaugesUpdate/gaugeUpdate';

const appModels = require('../../util/appModels').default;

const Gauges = React.memo((props) => {
  const { ids, type } = props;
  const dispatch = useDispatch();
  const [editData, setEditData] = useState([]);
  const [editGaugeModal, showEditGaugeModal] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [currentId, setCurrentId] = useState(false);

  const { assetGauges, updateEquipment } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (ids) {
      dispatch(getGauges(ids, appModels.GAUGE));
    }
  }, [ids]);

  const closeEditModalWindow = () => {
    dispatch(resetUpdateEquipment());
    showEditGaugeModal(false);
    setEditData([]);
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].gauge_id ? assetData[i].gauge_id[1] : '')}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].guage_primary_id)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].threshold_min)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].threshold_max)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].active_type)}</td>
          <td className="p-2">{assetData[i].create_mo ? 'Yes' : 'No'}</td>
          <td className="p-2">
            <Button
               variant="contained"
              size="sm"
              onClick={() => { setEditData(assetData[i]); showEditGaugeModal(true); }}
              onMouseLeave={() => { setButtonHover(false); setCurrentId(false); }}
              onMouseEnter={() => { setButtonHover(true); setCurrentId(assetData[i].guage_primary_id); }}
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
          {(assetGauges && assetGauges.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Gauge
                  </th>
                  <th className="p-2 min-width-100">
                    Guage ID
                  </th>
                  <th className="p-2 min-width-160">
                    Gauge Threshold Min
                  </th>
                  <th className="p-2 min-width-160">
                    Gauge Threshold Max
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
                {getRow(assetGauges && assetGauges.data ? assetGauges.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {assetGauges && assetGauges.loading && (
          <Loader />
          )}
          {(assetGauges && assetGauges.err) && (
          <ErrorContent errorTxt={generateErrorMessage(assetGauges)} />
          )}
          {type === 'equipment' && (
          <Modal size={(updateEquipment && updateEquipment.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={editGaugeModal}>
            <ModalHeaderComponent title="Edit Gauge" imagePath={false} closeModalWindow={closeEditModalWindow} response={updateEquipment} />
            <ModalBody className="pt-0 mt-0">
              <GaugeUpdate editData={editData} closeModal={closeEditModalWindow} />
            </ModalBody>
          </Modal>
          )}
        </Col>
      </Row>

    </>
  );
});

Gauges.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
};

export default Gauges;
