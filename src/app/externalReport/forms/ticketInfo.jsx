/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import {
  TextField,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import ReactFileReader from 'react-file-reader';
import * as PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import axios from 'axios';
import { ThemeProvider } from '@material-ui/core/styles';
import { Cascader, Divider } from 'antd';
import uniq from 'lodash/uniq';
import { Box, Typography, Button } from '@mui/material';

import fileMiniIcon from '@images/icons/fileMini.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage, arraySortByString, mergeArray, isMemorySizeLarge, getFileExtension, preprocessData,
} from '../../util/appUtils';
import {
  getUploadImage,
} from '../../helpdesk/ticketService';
import { getSpaceChildLocationsPublic } from '../../helpdesk/utils/utils';
import { last } from '../../util/staticFunctions';
import theme from '../../util/materialTheme';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import { AddThemeColor } from '../../themes/theme';

const appConfig = require('../../config/appConfig').default;
const appModels = require('../../util/appModels').default;

const TicketInfo = (props) => {
  const { uuid, sid, cid } = props;
  const {
    reload,
    setFieldValue,
    detailData,
    spaceInfo,
    accid,
    formField: {
      space,
      subject,
      categoryId,
      subCategorId,
      descriptionValue,
      workLocation,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    space_path,
    is_otp_verified,
    attachment,
    category_id,
    sub_category_id,
    asset_id,
    attachment_type,
  } = formValues;
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [refresh, setRefresh] = useState(reload);

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [finish, setFinish] = useState(false);
  const [documentReady, setDocumentReady] = useState('');
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const [errorShow, setErrorShow] = useState(false);
  const errorToggle = () => setErrorShow(!errorShow);
  const [imageName, setImageName] = useState(false);
  const [viewImage, setViewImage] = useState('');
  const [modal, setModal] = useState(false);

  const [categoryInfo, setCategoryInfo] = useState({ loading: false, data: null, err: null });
  const [subCategoryInfo, setSubCategoryInfo] = useState([]);
  const [spaceCategoryId, setSpaceCategoryId] = useState(false);

  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_work_location', detailData.work_location);
    }
  }, [detailData]);

  useEffect(() => {
    if (spaceCategoryId) {
      const spaceCategId = spaceCategoryId.category_id && spaceCategoryId.category_id.id ? spaceCategoryId.category_id.id : spaceCategoryId.category_id;
      setCategoryInfo({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/Helpdesk/getProblemCategory?uuid=${uuid}&space_category_id=${spaceCategId}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setCategoryInfo({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setCategoryInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
    } else {
      setCategoryInfo({ loading: false, data: null, err: null });
      setSubCategoryInfo([]);
    }
  }, [spaceCategoryId]);

  useEffect(() => {
    if (category_id) {
      const subCategory = category_id.sub_category_id && category_id.sub_category_id.length && category_id.sub_category_id.length > 0 ? category_id.sub_category_id : [];
      setSubCategoryInfo(subCategory);
    }
  }, [category_id]);

  useEffect(() => {
    if (category_id && category_id.id && refresh === '1') {
      setFieldValue('sub_category_id', '');
    }
  }, [category_id, refresh]);

  useEffect(() => {
    if (finish) {
      if (isMemorySizeLarge(filesList)) {
        dispatch(getUploadImage(filesList));
      } else {
        setimgSize(true);
        setErrorShow(true);
      }
    }
  }, [finish, documentReady]);

  const filesLimit = detailData && detailData.helpdesk_attachment_limit ? detailData.helpdesk_attachment_limit : 5;

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    const filesLength = files && files.fileList && files.fileList.length ? files.fileList.length : 0;
    const filesListLength = filesList && filesList.length ? filesList.length : 0;
    const totalLength = filesListLength + filesLength;
    if (files !== undefined && totalLength <= filesLimit) {
      setFilesList([...filesList, ...mergeArray([files.base64], files.fileList, detailData.company_id && detailData.company_id.id ? detailData.company_id.id : '', appModels.HELPDESK)]);
      // setModalAlert(true);
      setFinish(true); setDocumentReady(Math.random());
    }
  };

  const onRemovePhoto = (id) => {
    setFilesList(filesList.filter((item, index) => index !== id));
    dispatch(getUploadImage(filesList.filter((item, index) => index !== id)));
  };

  /* const handleFiles1 = (files) => {
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
        setFieldValue('attachment_type', remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage1(fileData);
        const fname = `${getLocalTimeSeconds(new Date())}-${Math.random()}`.replace(/\s+/g, '');
        const values = {
          datas: fileData,
          database64: files.base64,
          datas_fname: files.fileList[0].name,
          name: fname,
          company_id: detailData && detailData.company_id && detailData.company_id.id ? detailData.company_id.id : '',
          res_model: appModels.HELPDESK,
          size: files.fileList[0].size,
        };
        setFieldValue('attachment', values);
      }
    }
  };

  const clearDocument = () => {
    setimgValidation1(false);
    setimgSize1(false);
    setFileDataType1(false);
    setFileDataImage1(false);
    setFieldValue('attachment_type', false);
    setFieldValue('attachment', '');
    localStorage.setItem('attachment_doc_type', '');
  }; */

  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    if (categoryInfo && categoryInfo.loading) {
      setCategoryOptions([{ name: 'Loading..' }]);
    } else if (categoryInfo && categoryInfo.data) {
      let options = [];
      if (cid && cid.length && Array.isArray(cid)) {
        categoryInfo.data.map((categ) => {
          if ((cid.indexOf(categ.id.toString()) !== -1)) {
            options.push(categ);
          }
        });
      } else if (cid && cid.length && typeof cid === 'string') {
        options = categoryInfo.data.filter((categ) => categ.id.toString() === cid);
      } else if (!cid) {
        options = categoryInfo.data;
        categoryInfo.data = categoryInfo.data.filter((categ) => {
          if (categ && Object.keys(categ).find((key) => key === 'is_incident')) {
            return categ.is_incident === false;
          } return categ;
        });
        options = [...new Map(categoryInfo.data.map((item) => [item.id, item])).values()];
        options = arraySortByString(options, 'name');
      }
      setCategoryOptions(options);
    } else if (categoryInfo && categoryInfo.err) {
      setCategoryOptions([]);
    }
  }, [categoryInfo]);

  const subCategoryOptions = subCategoryInfo;

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    if (categoryOptions && categoryOptions.length === 1 && categoryOptions[0].name !== 'Loading..') {
      setFieldValue('category_id', categoryOptions[0]);
    }
  }, [categoryOptions]);

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {spaceInfo && spaceInfo.loading && (
        <>
          <Divider style={{ margin: 0 }} />
          <div className="mb-2 mt-3 p-5" data-testid="loading-case">
            <Loader />
          </div>
        </>
      )}
      {(spaceInfo && spaceInfo.err) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={generateErrorMessage(spaceInfo)} />
        </>
      )}
    </div>
  );
  const getPathName = (value) => {
    let path = false;
    for (let i = 0; i < value.length; i += 1) {
      path = path ? `${path} / ${value[i].name}` : `${value[i].name}`;
    }
    setFieldValue('space_path', path);
  };

  const getParentPath = (id, assetIds) => {
    const parent = spaceInfo.data.find((data) => data.id === id);
    if (parent && parent.id) {
      assetIds.push(id);
      if (parent && parent.parent_id && parent.parent_id.id) {
        getParentPath(parent.parent_id.id, assetIds);
      }
    }
  };
  const fetchSpace = (id) => {
    const assetIds = [];
    for (let i = 0; i < spaceInfo.data.length; i += 1) {
      if (id === spaceInfo.data[i].id) {
        assetIds.push(spaceInfo.data[i].id);
        if (spaceInfo.data[i].id && spaceInfo.data[i].parent_id && spaceInfo.data[i].parent_id.id) {
          getParentPath(spaceInfo.data[i].id, assetIds);
        }
      }
    }
    return uniq(assetIds).reverse();
  };

  useEffect(() => {
    if (spaceInfo.data && spaceInfo.data.length && sid) {
      const data = fetchSpace(parseInt(sid));
      setFieldValue('asset_id', data);
      const array = [];
      if (data && data.length) {
        data.map((arrayele) => {
          array.push(spaceInfo.data.find((ele) => ele.id === arrayele));
        });
      }
      getPathName(array);
      const space = spaceInfo.data.find((ele) => ele.id === last(data));
      if (space && space.id) {
        setSpaceCategoryId(space);
      }
    }
  }, [spaceInfo, sid]);

  const onChange = (value, selectedOptions) => {
    getPathName(selectedOptions);
    setFieldValue('sub_category_id', '');
    setFieldValue('category_id', '');
    setSpaceCategoryId(last(selectedOptions));
    if (value && value.length && selectedOptions && selectedOptions.length) {
      const did = value[value.length - 1];
      const lastData = selectedOptions.filter((item) => item.id === did);
      if (lastData && lastData.length && lastData[0].children && !lastData[0].children.length) {
        setFieldValue('asset_id', value);
      }
    } else {
      setFieldValue('asset_id', value);
    }
  };

  const filter = (inputValue, path) => path.some((option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

  const spaceList = spaceInfo && spaceInfo.data && spaceInfo.data.length > 0 ? getSpaceChildLocationsPublic(spaceInfo.data) : [];

  const isVerifyInfo = detailData && detailData.requires_verification_by_otp;
  const disableTicketInfo = isVerifyInfo && !is_otp_verified;

  useEffect(() => {
    if (uploadPhoto && uploadPhoto.length === 0 && filesList && filesList.length > 0) {
      setFilesList([]);
    }
  }, [uploadPhoto]);

  return (
    !disableTicketInfo && (
      <ThemeProvider theme={theme}>
        <Col md={12} sm={12} lg={12} xs={12}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              fontWeight: 500,
              margin: '10px 0px 10px 0px',
            })}
          >
            TICKET INFO
          </Typography>
          <span style={{
            color: 'rgb(0, 0, 0, 0.6)',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
          }}
          >
            {space.label}
            <span className="ml-2px text-danger">*</span>
          </span>
          <br />
          <Cascader
            options={preprocessData(spaceList && spaceList.length > 0 ? spaceList : [])}
            dropdownClassName="custom-cascader-popup"
            value={spaceList && spaceList.length > 0 ? asset_id : []}
            fieldNames={{ label: 'name', value: 'id', children: 'children' }}
            onChange={onChange}
            placeholder="Select Space"
            disabled={disableTicketInfo}
            dropdownRender={dropdownRender}
            notFoundContent="No options"
            className="thin-scrollbar mt-2 w-100"
            showSearch={{ filter }}
            changeOnSelect
          />
          <div className="ml-1 mt-1 text-success">
            {space_path}
          </div>
        </Col>
        {detailData && detailData.work_location && detailData.work_location !== 'None' && (
          <Col md={12} sm={12} lg={12} xs={12}>
            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name={workLocation.name}
              label={workLocation.label}
              setFieldValue={setFieldValue}
              type="text"
              isRequired={detailData && detailData.work_location && detailData.work_location === 'Required'}
              customClassName="bg-lightblue"
              labelClassName="m-0"
              formGroupClassName="m-1"
              maxLength="150"
            />
          </Col>
        )}
        <Col md={12} sm={12} lg={12} xs={12}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={subject.name}
            label={subject.label}
            setFieldValue={setFieldValue}
            isRequired="Required"
            type="text"
            disabled={disableTicketInfo}
            dropdownRender={dropdownRender}
            notFoundContent="No options"
            className="thin-scrollbar bg-lightblue m-0 w-100"
            showSearch={{ filter }}
            changeOnSelect
          />
        </Col>
        <Col md={12} sm={12} lg={12} xs={12}>
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
              fontSize: '1rem',
            }}
            name={categoryId.name}
            label={categoryId.label}
            isRequired
            labelClassName="m-0"
            formGroupClassName="m-1"
            open={categoryOpen}
            onOpen={() => {
              setCategoryOpen(true);
              setFieldValue('sub_category_id', '');
            }}
            onClose={() => {
              setCategoryOpen(false);
              setFieldValue('sub_category_id', '');
            }}
            disabled={disableTicketInfo}
            apiError={(categoryInfo && categoryInfo.err) ? generateErrorMessage(categoryInfo) : false}
            loading={categoryInfo && categoryInfo.loading}
            getOptionSelected={(option, value) => (option.cat_display_name ? option.cat_display_name === value.cat_display_name : option.name === value.name)}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.cat_display_name ? option.cat_display_name : option.name)}
            oldValue={getOldData(category_id)}
            value={category_id && category_id.cat_display_name ? category_id.cat_display_name : category_id.name ? category_id.name : getOldData(category_id)}
            options={categoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  fontSize: '1rem',
                }}
                InputLabelProps={{ shrink: true }}
                // label={`${categoryId.label}*`}
                label={(
                  <>
                    {`${categoryId.label}`}
                    <span className="text-danger ml-2px">*</span>
                  </>
                    )}
                variant="standard"
              />
            )}
          />
        </Col>
        {category_id &&  !disableTicketInfo && (
        <Col md={12} sm={12} lg={12} xs={12}>
          <Box>
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name={subCategorId.name}
              isRequired
              disabled={!category_id || disableTicketInfo}
              oldValue={getOldData(sub_category_id)}
              value={sub_category_id && sub_category_id.sub_cat_display_name ? sub_category_id.sub_cat_display_name : sub_category_id.name ? sub_category_id.name : getOldData(sub_category_id)}
              getOptionSelected={(option, value) => (option.sub_cat_display_name ? option.sub_cat_display_name === value.sub_cat_display_name : option.name === value.name)}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.sub_cat_display_name ? option.sub_cat_display_name : option.name)}
              options={subCategoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputLabelProps={{ shrink: true }}
                 // label={`${subCategorId.label}*`}
                  label={(
                    <>
                      {`${subCategorId.label}`}
                      <span className="text-danger ml-2px">*</span>
                    </>
                    )}
                  variant="standard"
                  sx
                />
              )}
            />
          </Box>
        </Col>
        )}
        <Col md="12" sm="12" lg="12" xs="12">
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={descriptionValue.name}
            label={descriptionValue.label}
            setFieldValue={setFieldValue}
            isRequired="Required"
            type="textarea"
            rows="4"
            disabled={disableTicketInfo}
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="250"
          />
        </Col>
        {detailData.requires_attachment && detailData.requires_attachment !== 'None' && (
          <>
            <Col md="12" sm="12" lg="12" xs="12">
              <Box>
                <Typography
                  sx={{
                    letterSpacing: '0.63px',
                    color: '#3a4354',
                    marginBottom: '3px',
                    marginTop: '15px',
                  }}
                >
                  Attachments
                  {detailData && detailData.requires_attachment && detailData.requires_attachment === 'Required' && (
                  <span className="ml-2px text-danger">*</span>
                  )}
                </Typography>
                <Box
                  sx={{
                    padding: '20px',
                    border: '1px dashed #868686',
                    width: '100%',
                    display: 'block',
                    alignItems: 'center',
                    borderRadius: '4px',
                  }}
                >
                  {filesList.length < filesLimit && (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ReactFileReader
                          handleFiles={handleFiles}
                          elementId="fileUploads"
                          fileTypes={['.csv', '.png', '.jpg', '.jpeg', '.svg', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pdf']}
                          base64
                        >
                          <Button
                            variant="contained"
                            component="label"
                          >
                            Upload

                          </Button>
                        </ReactFileReader>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            font: 'normal normal normal 14px Suisse Intl',
                            letterSpacing: '0.63px',
                            color: '#000000',
                            marginBottom: '10px',
                            marginTop: '10px',
                            marginLeft: '5px',
                            justifyContent: 'center',
                            display: 'flex',
                          }}
                        >
                          (Upload files less than 20 MB)
                        </Typography>
                        <Typography
                          sx={{
                            font: 'normal normal normal 12px Suisse Intl',
                            letterSpacing: '0.63px',
                            color: 'grey',
                            marginBottom: '10px',
                            marginLeft: '5px',
                            justifyContent: 'center',
                            display: 'flex',
                            fontSize: '11px',
                          }}
                        >
                          (Number of attachments maximum upload :
                          {' '}
                          {filesLimit}
                          )
                        </Typography>
                      </Box>
                    </>
                  )}
                  {uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 ? (
                    <>
                      {uploadPhoto.map((fl, index) => (
                        <Col sm="6" md="6" lg="6" xs="6" className="position-relative mb-3" key={fl.name}>
                          {(getFileExtension(fl.datas_fname) === 'png'
                            || getFileExtension(fl.datas_fname) === 'svg'
                            || getFileExtension(fl.datas_fname) === 'jpeg'
                            || getFileExtension(fl.datas_fname) === 'jpg') && (
                              <>
                                <img
                                  src={fl.database64}
                                  alt={fl.name}
                                  aria-hidden="true"
                                  height="100"
                                  width="100"
                                  onClick={() => { setImageName(fl.name); setViewImage(fl.database64); toggle(); }}
                                  className="cursor-pointer"
                                />
                                <div className="position-absolute topright-img-close1">
                                  <img
                                    aria-hidden="true"
                                    src={closeCircleIcon}
                                    className="cursor-pointer"
                                    onClick={() => {
                                      onRemovePhoto(index);
                                    }}
                                    alt="remove"
                                  />
                                </div>
                              </>
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
                                <p className="m-0 text-break">{fl.datas_fname}</p>
                                <div className="position-absolute topright-img-close1">
                                  <img
                                    aria-hidden="true"
                                    src={closeCircleIcon}
                                    className="cursor-pointer"
                                    onClick={() => {
                                      onRemovePhoto(index);
                                    }}
                                    alt="remove"
                                  />
                                </div>
                              </>
                          )}
                        </Col>
                      ))}
                    </>
                  )
                    : (<span />)}
                </Box>
              </Box>
            </Col>
          </>
        )}
        <Modal isOpen={modal} size="lg">
          <ModalHeader toggle={toggle}>{imageName}</ModalHeader>
          <ModalBody>
            <img src={viewImage} alt="view document" width="100%" />
          </ModalBody>
        </Modal>
      </ThemeProvider>
    )
  );
};

TicketInfo.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  spaceInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  uuid: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  reload: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default TicketInfo;
