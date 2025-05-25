/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
  Label,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import {
  FormHelperText, FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReactFileReader from 'react-file-reader';
import PropTypes from 'prop-types';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import { bytesToSize } from '../../../util/staticFunctions';

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const LogosUpdateForm = (props) => {
  const {
    setFieldValue,
  } = props;
  const classes = useStyles();
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);

  const [imgValidation1, setimgValidation1] = useState(false);
  const [imgSize1, setimgSize1] = useState(false);
  const [fileDataImage1, setFileDataImage1] = useState(false);
  const [fileDataType1, setFileDataType1] = useState(false);

  const [imgValidation2, setimgValidation2] = useState(false);
  const [imgSize2, setimgSize2] = useState(false);
  const [fileDataImage2, setFileDataImage2] = useState(false);
  const [fileDataType2, setFileDataType2] = useState(false);

  const {
    companyDetail,
  } = useSelector((state) => state.setup);

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileDataType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFieldValue('theme_logo', fileData);
      }
    }
  };

  const handleFiles1 = (files) => {
    setimgValidation1(false);
    setimgSize1(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation1(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize1(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileDataType1(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage1(fileData);
        setFieldValue('vendor_logo', fileData);
      }
    }
  };

  const handleFiles2 = (files) => {
    setimgValidation2(false);
    setimgSize2(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation2(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize2(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileDataType2(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage2(fileData);
        setFieldValue('theme_icon', fileData);
      }
    }
  };

  return (

    <>
      <Row className="p-1">
        <Col xs={12} sm={6} md={6} lg={6}>
          <FormControl className={classes.margin}>
            <Label for="theme_logo">Theme Logo</Label>
            {!fileDataImage && (
            <ReactFileReader
              elementId="fileUpload"
              handleFiles={handleFiles}
              fileTypes="image/*"
              base64
            >
              <div className="float-right cursor-pointer">
                <img src={uploadIcon} className="mr-1" alt="issuecategory" height="20" />
                <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
              </div>
            </ReactFileReader>
            )}
            {(!fileDataImage && (companyDetail && companyDetail.data && companyDetail.data[0].theme_logo)) && (
            <div className="position-relative">
              <img
                src={`data:image/png;base64,${companyDetail.data[0].theme_logo}`}
                height="150"
                width="150"
                className="ml-3"
                alt="uploaded"
              />
            </div>
            )}
            {(fileDataImage) && (
            <div className="position-relative">
              <img
                src={`${fileDataType}${fileDataImage}`}
                height="150"
                width="150"
                className="ml-3"
                alt="uploaded"
              />
              {fileDataImage && (
              <div className="position-absolute topright-img-close">
                <img
                  aria-hidden="true"
                  src={closeCircleIcon}
                  className="cursor-pointer"
                  onClick={() => {
                    setimgValidation(false);
                    setimgSize(false);
                    setFileDataImage(false);
                    setFileDataType(false);
                    setFieldValue('theme_logo', false);
                  }}
                  alt="remove"
                />
              </div>
              )}
            </div>
            )}
          </FormControl>
          {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
          {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <FormControl className={classes.margin}>
            <Label for="vendor_logo">Vendor Logo</Label>
            {!fileDataImage1 && (
            <ReactFileReader
              elementId="fileUpload1"
              handleFiles={handleFiles1}
              fileTypes="image/*"
              base64
            >
              <div className="float-right cursor-pointer">
                <img src={uploadIcon} className="mr-1" alt="issuecategory" height="20" />
                <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
              </div>
            </ReactFileReader>
            )}
            {(!fileDataImage1 && (companyDetail && companyDetail.data && companyDetail.data[0].vendor_logo)) && (
            <div className="position-relative">
              <img
                src={`data:image/png;base64,${companyDetail.data[0].vendor_logo}`}
                height="150"
                width="150"
                className="ml-3"
                alt="uploaded"
              />
            </div>
            )}
            {(fileDataImage1) && (
            <div className="position-relative">
              <img
                src={`${fileDataType1}${fileDataImage1}`}
                height="150"
                width="150"
                className="ml-3"
                alt="uploaded"
              />
              {fileDataImage1 && (
              <div className="position-absolute topright-img-close">
                <img
                  aria-hidden="true"
                  src={closeCircleIcon}
                  className="cursor-pointer"
                  onClick={() => {
                    setimgValidation1(false);
                    setimgSize1(false);
                    setFileDataImage1(false);
                    setFileDataType1(false);
                    setFieldValue('vendor_logo', false);
                  }}
                  alt="remove"
                />
              </div>
              )}
            </div>
            )}
          </FormControl>
          {imgValidation1 && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
          {imgSize1 && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <FormControl className={classes.margin}>
            <Label for="theme_icon">Theme Icon</Label>
            {!fileDataImage && (
            <ReactFileReader
              elementId="fileUpload2"
              handleFiles={handleFiles2}
              fileTypes="image/*"
              base64
            >
              <div className="float-right cursor-pointer">
                <img src={uploadIcon} className="mr-1" alt="issuecategory" height="20" />
                <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
              </div>
            </ReactFileReader>
            )}
            {(!fileDataImage2 && (companyDetail && companyDetail.data && companyDetail.data[0].theme_icon)) && (
            <div className="position-relative">
              <img
                src={`data:image/png;base64,${companyDetail.data[0].theme_icon}`}
                height="150"
                width="150"
                className="ml-3"
                alt="uploaded"
              />
            </div>
            )}
            {(fileDataImage2) && (
            <div className="position-relative">
              <img
                src={`${fileDataType2}${fileDataImage2}`}
                height="150"
                width="150"
                className="ml-3"
                alt="uploaded"
              />
              {fileDataImage2 && (
              <div className="position-absolute topright-img-close">
                <img
                  aria-hidden="true"
                  src={closeCircleIcon}
                  className="cursor-pointer"
                  onClick={() => {
                    setimgValidation2(false);
                    setimgSize2(false);
                    setFileDataImage2(false);
                    setFileDataType2(false);
                    setFieldValue('theme_icon', false);
                  }}
                  alt="remove"
                />
              </div>
              )}
            </div>
            )}
          </FormControl>
          {imgValidation2 && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
          {imgSize2 && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
        </Col>
      </Row>
    </>
  );
};

LogosUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default LogosUpdateForm;
