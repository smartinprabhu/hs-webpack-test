/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
  Modal,
  ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';

import editIcon from '@images/icons/edit.svg';
import editWhiteIcon from '@images/icons/editWhite.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { resetUpdateCompany, getCompanyDetail } from '../setupService';
import CompanyDetailUpdate from '../companyConfiguration/companyUpdate/companyDetailUpdate';
import {
  getDefaultNoValue,
  generateErrorMessage,
  getListOfModuleOperations,
} from '../../util/appUtils';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const AdvancedInfo = () => {
  const dispatch = useDispatch();
  const [updateModal, showUpdateModal] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);
  const { companyDetail, updateCompanyInfo } = useSelector((state) => state.setup);

  const { userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const onCloseUpdate = () => {
    if (updateCompanyInfo && updateCompanyInfo.data) {
      const id = companyDetail && companyDetail.data&&companyDetail.data.length ? companyDetail.data[0].id : '';
      dispatch(getCompanyDetail(id, appModels.COMPANY));
    }
    dispatch(resetUpdateCompany());
    showUpdateModal(false);
  };

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0 h-100">
          {companyDetail && (companyDetail.data && companyDetail.data.length > 0) && (
            <CardBody className="h-100">
              <div className="pr-2">
                <h6>
                  Advanced
                  <span className="float-right">
                    {allowedOperations.includes(actionCodes['Edit Site']) && (
                    <>
                      <Button
                         variant="contained"
                        onClick={() => showUpdateModal(true)}
                        onMouseLeave={() => setButtonHover1(false)}
                        onMouseEnter={() => setButtonHover1(true)}
                        size="sm"
                        className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                      >
                        <img src={isButtonHover1 ? editWhiteIcon : editIcon} className="mr-2 pb-2px" height="12" width="12" alt="edit" />
                        <span className="mr-2">Edit</span>
                      </Button>
                    </>
                    )}
                  </span>
                </h6>
                <Row className="mb-4 ml-1 mr-1 mt-3">
                  <Col sm="12" md="12" xs="12" lg="6">
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Short Code</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny text-capital">{getDefaultNoValue(companyDetail.data[0].code)}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Email</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(companyDetail.data[0].email)}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Company Registry</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(companyDetail.data[0].company_registry)}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Nomenclature</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(companyDetail.data[0].nomenclature_id ? companyDetail.data[0].nomenclature_id[1] : '')}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Latitude</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(companyDetail.data[0].latitude)}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Vendor Logo</span>
                    </Row>
                    <Row className="m-0">
                      {companyDetail.data[0].vendor_logo ? (
                        <img src={`data:image/png;base64,${companyDetail.data[0].vendor_logo}`} alt="logo" width="100" height="auto" />
                      ) : (
                        <span className="m-0 p-0 font-weight-800 font-tiny text-capital">Not Assigned</span>
                      )}
                    </Row>
                    <hr className="mt-2" />
                  </Col>
                  <Col sm="12" md="12" xs="12" lg="6">
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Phone</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(companyDetail.data[0].phone)}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Tax ID</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny text-capital">{getDefaultNoValue(companyDetail.data[0].vat)}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Default Incoterm</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny text-capital">{getDefaultNoValue(companyDetail.data[0].incoterm_id ? companyDetail.data[0].incoterm_id[1] : '')}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Is Parent</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny text-capital">{companyDetail.data[0].is_parent ? 'Yes' : 'No'}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Longitude</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny text-capital">{getDefaultNoValue(companyDetail.data[0].longitude)}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Theme Icon</span>
                    </Row>
                    <Row className="m-0">
                      {companyDetail.data[0].theme_icon ? (
                        <img src={`data:image/png;base64,${companyDetail.data[0].theme_icon}`} alt="logo" width="100" height="auto" />
                      ) : (
                        <span className="m-0 p-0 font-weight-800 font-tiny text-capital">Not Assigned</span>
                      )}
                    </Row>
                    <hr className="mt-2" />
                  </Col>
                </Row>
                <Card className="no-border-radius">
                  <CardBody className="p-0 bg-porcelain">
                    <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">Social Media</p>
                  </CardBody>
                </Card>
                <Row className="mb-4 ml-1 mr-1 mt-3">
                  <Col sm="12" md="12" xs="12" lg="6">
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Twitter Account</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">
                        {getDefaultNoValue(companyDetail.data[0].social_twitter)}
                      </span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Github Account</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">
                        {getDefaultNoValue(companyDetail.data[0].social_github)}
                      </span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Youtube Account</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">
                        {getDefaultNoValue(companyDetail.data[0].social_youtube)}
                      </span>
                    </Row>
                    <hr className="mt-2" />
                  </Col>
                  <Col sm="12" md="12" xs="12" lg="6">
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Facebook Account</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(companyDetail.data[0].social_facebook)}</span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Linkedin Account</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">
                        {getDefaultNoValue(companyDetail.data[0].social_linkedin)}
                      </span>
                    </Row>
                    <hr className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Instagram Account</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-800 font-tiny">
                        {getDefaultNoValue(companyDetail.data[0].social_instagram)}
                      </span>
                    </Row>
                    <hr className="mt-2" />
                  </Col>
                </Row>
              </div>
              <Modal size={(updateCompanyInfo && updateCompanyInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={updateModal}>
                <ModalHeaderComponent title="Edit Company Info" imagePath={false} closeModalWindow={onCloseUpdate} response={updateCompanyInfo} />
                <ModalBody className="mt-0 pt-0">
                  <CompanyDetailUpdate />
                  <div className="float-right mr-4">
                    {(updateCompanyInfo && updateCompanyInfo.data) && (
                      <Button
                        type="button"
                        size="sm"
                         variant="contained"
                        onClick={() => onCloseUpdate()}
                      >
                        Ok
                      </Button>
                    )}
                  </div>
                </ModalBody>
              </Modal>
            </CardBody>
          )}
          {companyDetail && companyDetail.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
          {(companyDetail && companyDetail.err) && (
            <CardBody>
              <ErrorContent errorTxt={generateErrorMessage(companyDetail)} />
            </CardBody>
          )}
        </Card>
      </Col>
    </Row>
  );
};
export default AdvancedInfo;
