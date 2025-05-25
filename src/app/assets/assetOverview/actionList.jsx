/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardTitle,
  CardBody,
  Col,
  Modal,
  ModalBody,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import actionsBlueIcon from '@images/icons/actionsBlue.svg';
import eyeBlueIcon from '@images/icons/eyeBlue.svg';
import plusCircleBlueIcon from '@images/icons/plusCircleBlue.svg';
import checkCircleBlueIcon from '@images/icons/checkCircleBlue.svg';
import closeCircleBlueIcon from '@images/icons/closeCircleBlue.svg';
import assetIcon from '@images/icons/assetDefault.svg';
import importBlueIcon from '@images/icons/importBlue.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import './assetOverview.scss';
import actionList from './data/actions.json';
import actionCodes from '../data/assetActionCodes.json';
import { getEquipmentFilters, resetAddAssetInfo } from '../equipmentService';
import { getListOfOperations } from '../../util/appUtils';
import AddEquipment from '../addAsset';

const faIcons = {
  faEye: eyeBlueIcon,
  faPlusCircle: plusCircleBlueIcon,
  faCheckCircle: checkCircleBlueIcon,
  faTimesCircle: closeCircleBlueIcon,
  faUpload: importBlueIcon,
};

const ActionList = ({ setPopoverModal }) => {
  const dispatch = useDispatch();
  const [addAssetModal, showAddAssetModal] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { addAssetInfo } = useSelector((state) => state.equipment);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getEquipmentFilters([]));
    }
  }, [userInfo]);

  const onReset = () => {
    dispatch(resetAddAssetInfo());
  };

  return (
    <Card className="p-2 mt-2 rounded-0 border-0">
      <CardTitle className="mb-0">
        <h6>
          <img src={actionsBlueIcon} alt="Actions" height="20" width="20" className="mr-2" />
          ACTIONS
        </h6>
      </CardTitle>
      <CardBody className="p-0 ml-3">
        <Row className="ml-2 mr-2">
          {actionList && actionList.map((actions, index) => (
            <React.Fragment key={actions.id}>
              {(allowedOperations.includes(actionCodes[actions.name]) || actions.name === 'View All Assets') && (
                <Col sm="6" md="6" lg="6" xs="12" key={actions.id} className="pr-0 mb-2">
                  {actions.name === 'Add an Asset'
                    ? (
                      <Button
                        id={`action${index}`}
                        onClick={() => { setPopoverModal(false); showAddAssetModal(true); }}
                        disabled={actions.inactive}
                        className="hoverColor btn btn-default bg-white text-grey border-silverfoil-2px p-1 text-left w-100"
                      >
                        <img src={faIcons[actions.icon]} className="mr-2" alt={actions.name} height="15" width="15" />
                        <span className="font-weight-400 font-11">{actions.name}</span>
                      </Button>
                    )
                    : (
                      <Link to={actions.url} id={`action${index}`} disabled={actions.inactive} className="hoverColor btn btn-default border-silverfoil-2px p-1 text-left w-100">
                        <img src={faIcons[actions.icon]} className="mr-2" alt={actions.name} height="15" width="15" />
                        <span className="font-weight-400 font-11">{actions.name}</span>
                      </Link>
                    )}
                </Col>
              )}
            </React.Fragment>
          ))}
        </Row>
        <Modal size={(addAssetInfo && addAssetInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={addAssetModal}>
          <ModalHeaderComponent title="Add Asset" imagePath={assetIcon} closeModalWindow={() => { showAddAssetModal(false); onReset(); }} response={addAssetInfo} />
          <ModalBody className="mt-0 pt-0">
            <AddEquipment
              afterReset={() => { showAddAssetModal(false); onReset(); }}
            />
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

ActionList.propTypes = {
  setPopoverModal: PropTypes.func.isRequired,
};

export default ActionList;
