/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import {
  Row, Col, Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Typography } from "@mui/material";

import UserIcon from '@images/icons/externalReport/user.svg';
import PhoneIcon from '@images/icons/externalReport/phone.svg';
import EmailIcon from '@images/icons/externalReport/email.svg';
import fileMiniIcon from '@images/icons/fileMini.svg';
import {
  getDefaultNoValue, getFileExtension,
} from '../../util/appUtils';
import {
  getSpaceValue, getSpaceChildLocationsPublic,
} from '../../helpdesk/utils/utils';
import { AddThemeColor } from '../../themes/theme'

const PreviewForm = (props) => {
  const { spaceInfo, isRequestorInfo, detailData } = props;
  const { values: formValues } = useFormikContext();
  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  const [imageName, setImageName] = useState(false);
  const [viewImage, setViewImage] = useState('');
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const getlabels = (value) => {
    const data = value;
    const spaceList = spaceInfo && spaceInfo.data && spaceInfo.data.length && spaceInfo.data.length > 0 ? getSpaceChildLocationsPublic(spaceInfo.data) : [];
    return getSpaceValue(data, spaceList);
  };

  const returnValue = (heading, value, Icon) => {
    return (
      <div className='mb-1 pb-1'>
        {heading ? (<Typography
          sx={{
            font: "normal normal normal 16px Suisse Intl",
            letterSpacing: "0.63px",
            color: "#3a4354",
            marginBottom: "5px",
            lineBreak: 'anywhere',
            fontWeight: '600'
          }}
        >

          {heading}
        </Typography>) : ''}
        {value ? (<Typography
          sx={{
            font: "normal normal normal 16px Suisse Intl",
            letterSpacing: "0.63px",
            color: "#6A6A6A",
            marginBottom: "15px",
            lineBreak: 'anywhere'
          }}
        >
          {value}
        </Typography>) : ''}
      </div>
    )
  }
  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border bg-lightblue">
      {isRequestorInfo && (
        <Col xs={12} sm={6} md={6} lg={6} className="p-0">
           <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              fontWeight: 500,
              margin: "10px 0px 10px 0px",
            })}
          >
            REQUESTOR INFO
          </Typography>
          <br />
          {detailData.has_reviwer_name && detailData.has_reviwer_name !== 'None' && (
            <Row>
              <Col xs={12} sm={10} md={10} lg={10}>
                <Row className="m-0 pb-3">
                  <img src={UserIcon} alt="user" height="18" className="w-auto ml-2 mr-2" />
                  <span className="font-weight-500 text-break d-block w-75" style={{ font: 'Suisse Intl', color: '#3a4354' }}>{getDefaultNoValue(formValues.person_name)}</span>
                </Row>
              </Col>
            </Row>

          )}
          {detailData.has_reviwer_mobile && detailData.has_reviwer_mobile !== 'None' && (
            <Row>
              <Col xs={12} sm={10} md={10} lg={10}>
                <Row className="m-0 pb-3">
                  <img src={PhoneIcon} alt="phone" height="18" className="w-auto ml-2 mr-2" />
                  <span className="font-weight-500 text-break d-block w-75" style={{ font: 'Suisse Intl', color: '#3a4354' }}>{getDefaultNoValue(formValues.mobile)}</span>
                </Row>
              </Col>
            </Row>
          )}
          {detailData.has_reviwer_email && detailData.has_reviwer_email !== 'None' && (
            <Row>
              <Col xs={12} sm={10} md={10} lg={10}>
                <Row className="m-0 pb-3">
                  <img src={EmailIcon} alt="email" height="16" className="w-auto ml-2 mr-2" />
                  <span className="font-weight-500 text-break d-block w-75" style={{ font: 'Suisse Intl', color: '#3a4354' }}>{getDefaultNoValue(formValues.email)}</span>
                </Row>
              </Col>
            </Row>
          )}
        </Col>
      )}
      <Col xs={12} sm={isRequestorInfo ? 6 : 12} md={isRequestorInfo ? 6 : 12} lg={isRequestorInfo ? 6 : 12} className="p-0">
      <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              fontWeight: 500,
              margin: "10px 0px 10px 0px",
            })}
          >
            TICKET INFO
          </Typography>
        <br />
        {returnValue('Space', getDefaultNoValue(formValues.asset_id && formValues.asset_id.length > 0 ? getlabels(formValues.asset_id) : ''))}
        {returnValue('Work Station Number', getDefaultNoValue(formValues.work_location))}
        {returnValue('Subject', getDefaultNoValue(formValues.subject))}
        {returnValue('Category', getDefaultNoValue(formValues.category_id && formValues.category_id.name && formValues.category_id.name))}
        {returnValue('Sub Category', getDefaultNoValue(formValues.sub_category_id && formValues.sub_category_id.name))}
        {returnValue('Description', getDefaultNoValue(formValues.description))}
        {returnValue('Attachments')}
        <Row>
          <Col lg="12" md="12" xs="12" sm="12" className="mb-5">
            {uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 ? (
              <>
                {uploadPhoto.map((fl, index) => (
                  <Col sm="6" md="6" lg="6" xs="6" className="position-relative mb-3" key={fl.name}>
                    {(getFileExtension(fl.datas_fname) === 'png'
                      || getFileExtension(fl.datas_fname) === 'svg'
                      || getFileExtension(fl.datas_fname) === 'jpeg'
                      || getFileExtension(fl.datas_fname) === 'jpg') && (
                        <img
                          src={fl.database64}
                          alt={fl.name}
                          aria-hidden="true"
                          height="100"
                          width="100"
                          onClick={() => { setImageName(fl.name); setViewImage(fl.database64); toggle(); }}
                          className="cursor-pointer"
                        />
                      )}
                    {(getFileExtension(fl.datas_fname) !== 'png'
                      && getFileExtension(fl.datas_fname) !== 'svg' && getFileExtension(fl.datas_fname) !== 'jpeg' && getFileExtension(fl.datas_fname) !== 'jpg') && (
                        <>
                          <img
                            src={fileMiniIcon}
                            alt={fl.name}
                            aria-hidden="true"
                            height="80"
                            width="100"
                            className="cursor-pointer"
                          />
                          <p className="m-0">{fl.datas_fname}</p>
                        </>
                      )}
                  </Col>
                ))}
              </>
            )
              : (<span className="m-1 bw-2 font-weight-500 text-break d-block w-100">-</span>)}
          </Col>
          <Modal isOpen={modal} size="lg">
            <ModalHeader toggle={toggle}>{imageName}</ModalHeader>
            <ModalBody>
              <img src={viewImage} alt="view document" width="100%" />
            </ModalBody>
          </Modal>
        </Row>
      </Col>
    </Row>
  );
};

PreviewForm.propTypes = {
  spaceInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  isRequestorInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default PreviewForm;
