/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  Row,
  Tooltip,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import companyBuilding from '@images/building.jpg';
import plusCircleWhiteIcon from '@images/icons/plusCircleWhite.svg';
import locationIcon from '@images/icons/locationBlack.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import AddLocation from './addLocation';
import {
  resetCreateSpace,
} from '../equipmentService';
import { getDefaultNoValue, generateErrorMessage, getListOfOperations } from '../../util/appUtils';
import actionCodes from '../data/assetActionCodes.json';

const CompanyDataInfo = () => {
  const dispatch = useDispatch();
  const [tooltipOpen1, setTooltipOpen1] = useState(false);
  const [addLocationModal, showAddLocationModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { companyDetail } = useSelector((state) => state.setup);
  const { createSpaceInfo } = useSelector((state) => state.equipment);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const onReset = () => {
    dispatch(resetCreateSpace());
  };

  const toggle1 = () => setTooltipOpen1(!tooltipOpen1);

  const isUserError = (userInfo && userInfo.err) || (companyDetail && companyDetail.err);
  const isUserLoading = (userInfo && userInfo.loading) || (companyDetail && companyDetail.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (companyDetail && companyDetail.err) ? generateErrorMessage(companyDetail) : userErrorMsg;

  return (
    <>
      <Card className="border-0 comapany-data-info h-100">
        {((companyDetail && companyDetail.loading) || isUserLoading) && (
        <div className="mb-2 mt-4">
          <Loader />
        </div>
        )}
        {companyDetail && (companyDetail.data && companyDetail.data.length > 0) && (
          <CardBody>
            <Row>
              <Col md="5" xs="12" sm="5" lg="5">
                <h4 className="mb-1 font-weight-800 font-medium" title={companyDetail.data[0].name}>{companyDetail.data[0].name}</h4>
                <p className="mb-1 font-weight-400 mt-1 font-tiny">
                  {companyDetail.data[0].code}
                </p>
                <img src={companyDetail.data[0].logo ? `data:image/png;base64,${companyDetail.data[0].logo}` : companyBuilding} alt="logo" width="150" height="150" />
              </Col>
              <Col md="7" xs="12" sm="7" lg="7">
                <CardBody className="p-1">
                  <span className="font-weight-800 font-side-heading mb-1 mt-3">ACTIONS</span>
                  <Row>
                    {allowedOperations.includes(actionCodes['Add Location']) && (
                    <>
                      <Col md="5" xs="12" sm="5" lg="5" className="pr-1" id="Tooltip1">
                        <Button
                          type="button"
                          className="pt-1 pb-1 pr-2 pl-2 btn-navyblue text-left textwrapdots w-100"
                          onClick={() => { showAddLocationModal(true); }}
                        >
                          <img alt="add" className="mr-2 pb-2px" src={plusCircleWhiteIcon} height="16" width="16" />
                          Add New Location
                        </Button>
                      </Col>
                      <Tooltip placement="top" isOpen={tooltipOpen1} target="Tooltip1" toggle={toggle1}>
                        Add New Location
                      </Tooltip>
                    </>
                    )}
                  </Row>
                </CardBody>
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 pl-1 font-tiny mb-1 mt-2">COMPANY INFO</span>
            </Row>
            <Row className="pb-2">
              <Col className="company-details" md="12" sm="12" xs="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <span className="font-weight-400 font-tiny mr-1">
                      Company Name
                    </span>
                    <br />
                    <span className="font-weight-800 font-tiny">
                      {getDefaultNoValue(companyDetail.data[0].name)}
                    </span>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col className="company-details" md="12" sm="12" xs="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <span className="font-weight-400 font-tiny mr-1">
                      Address
                    </span>
                    <br />
                    <span className="font-weight-800 font-tiny">
                      {getDefaultNoValue(companyDetail.data[0].street)}
                    </span>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col className="company-details" md="12" sm="12" xs="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <span className="font-weight-400 font-tiny mr-1">
                      Category
                    </span>
                    <br />
                    <span className="font-weight-800 font-tiny">
                      {getDefaultNoValue(companyDetail.data[0].res_company_categ_id[1])}
                    </span>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col className="company-details" md="12" sm="12" xs="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <span className="font-weight-400 font-tiny mr-1">
                      Currency
                    </span>
                    <br />
                    <span className="font-weight-800 font-tiny">
                      {getDefaultNoValue(companyDetail.data[0].currency_id[1])}
                    </span>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col className="company-details" md="12" sm="12" xs="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <span className="font-weight-400 font-tiny mr-1">
                      Time Zone
                    </span>
                    <br />
                    <span className="font-weight-800 font-tiny">
                      {getDefaultNoValue(companyDetail.data[0].company_tz)}
                    </span>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col className="company-details" md="12" sm="12" xs="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <span className="font-weight-400 font-tiny mr-1">
                      Website
                    </span>
                    <br />
                    <span className="font-weight-800 font-tiny">
                      {getDefaultNoValue(companyDetail.data[0].website)}
                    </span>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        )}
        {((companyDetail && companyDetail.err) || isUserError) && (
        <CardBody>
          <ErrorContent errorTxt={errorMsg} />
        </CardBody>
        )}
        <Modal size={(createSpaceInfo && createSpaceInfo.data) ? 'sm' : 'xl'} className="border-radius-50px asset-add-location modal-dialog-centered" isOpen={addLocationModal}>
          <ModalHeaderComponent title="Add Location" imagePath={locationIcon} closeModalWindow={() => { showAddLocationModal(false); onReset(); }} response={createSpaceInfo} />
          <ModalBody className="mt-0 pt-0">
            <AddLocation
              spaceCategory={false}
              afterReset={() => { showAddLocationModal(false); onReset(); }}
              spaceId={false}
              pathName={companyDetail && companyDetail.data ? companyDetail.data[0].code : false}
            />
          </ModalBody>
        </Modal>
      </Card>
    </>
  );
};
export default CompanyDataInfo;
