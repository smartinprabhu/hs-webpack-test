/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { CircularProgress, TextField } from '@material-ui/core';
import {
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row,
} from 'reactstrap';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import UploadDocuments from '../../../../commonComponents/uploadDocuments';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import { extractOptionsObjectWithName, generateErrorMessage, getAllCompanies } from '../../../../util/appUtils';
import { bytesToSize } from '../../../../util/staticFunctions';
import { getAccessGroup, getTCList } from '../../../siteService';
import customData from '../data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      name,
      categNo,
      parentId,
      aliasNameCateg,
      commodityId,
      typeValue,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    parent_id, image_medium, commodity_id,
  } = formValues;
  const [typeOpen, setTypeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [commodityOpen, setCommodityOpen] = useState(false);
  const [commodityKeyword, setCommodityKeyword] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'display_name', 'path_name']);
  const [extraModal, setExtraModal] = useState(false);

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(image_medium);
  const [fileType, setFileType] = useState('data:image/png;base64,');
  const {
    addProductCategoryInfo,
    } = useSelector((state) => state.pantry);

  const { userInfo } = useSelector((state) => state.user);
  const {
    tcInfo, accessGroupInfo,
  } = useSelector((state) => state.site);

  const companies = getAllCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      dispatch(getTCList(companies, appModels.EQUIPMENTCATEGORY, categoryKeyword));
    }
  }, [userInfo, categoryOpen, categoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && commodityOpen) {
        await dispatch(getAccessGroup(companies, appModels.UNSPSC, commodityKeyword, 20));
      }
    })();
  }, [userInfo, commodityKeyword, commodityOpen]);

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
        setFileType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFieldValue('image_medium', fileData);
      }
    }
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const showSearchModal = () => {
    setModelValue(appModels.EQUIPMENTCATEGORY);
    setFieldName('parent_id');
    setModalName('Parent');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onCategoryKeywordClear = () => {
    setCategoryKeyword(null);
    setFieldValue('parent_id', '');
    setCategoryOpen(false);
  };

  const showSearchModalCommodity = () => {
    setModelValue(appModels.UNSPSC);
    setFieldName('commodity_id');
    setModalName('UNPSC Code');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    // setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onCommodityKeywordChange = (event) => {
    setCommodityKeyword(event.target.value);
  };

  const onCommodityKeywordClear = () => {
    setCommodityKeyword(null);
    setFieldValue('commodity_id', '');
    setCommodityOpen(false);
  };

  const categoryOptions = extractOptionsObjectWithName(tcInfo, parent_id, 'path_name');
  const commodityOptions = extractOptionsObjectWithName(accessGroupInfo, commodity_id, 'display_name');

  return (
    <>
      <Row className="mb-1">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiTextField
             sx={{
              marginBottom: '20px',
            }}
              name={name.name}
              label={name.label}
              autoComplete="off"
              isRequired
              type="text"
              formGroupClassName="m-1"
              inputProps={{
                maxLength: 30,
              }}
            />
          </Col>
          {/* <Col xs={12} sm={12} lg={12} md={12}>
            <InputField
              name={categNo.name}
              label={categNo.label}
              autoComplete="off"
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
            />
  </Col> */}
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
             sx={{
              marginBottom: '20px',
            }}
              name={parentId.name}
              label={parentId.label}
              labelClassName="mb-2"
              formGroupClassName="mb-1 m-1"
              open={categoryOpen}
              oldValue={getOldData(parent_id)}
              value={parent_id && parent_id.path_name ? parent_id.path_name : getOldData(parent_id)}
              size="small"
              onOpen={() => {
                setCategoryOpen(true);
                setCategoryKeyword('');
              }}
              onClose={() => {
                setCategoryOpen(false);
                setCategoryKeyword('');
              }}
              loading={tcInfo && tcInfo.loading && categoryOpen}
              getOptionSelected={(option, value) => option.path_name === value.path_name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
              apiError={(tcInfo && tcInfo.err) ? generateErrorMessage(tcInfo) : false}
              options={categoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCategoryKeywordChange}
                  variant="standard"
                  label={parentId.label}
                  value={categoryKeyword}
                  className={((getOldData(parent_id)) || (parent_id && parent_id.id) || (categoryKeyword && categoryKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {tcInfo && tcInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(parent_id)) || (parent_id && parent_id.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onCategoryKeywordClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showSearchModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiTextField
             sx={{
              marginBottom: '20px',
            }}
              name={aliasNameCateg.name}
              label={aliasNameCateg.label}
              autoComplete="off"
              type="text"
              formGroupClassName="m-1"
              inputProps={{
                maxLength: 30,
              }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <UploadDocuments
              saveData={addProductCategoryInfo}
              limit="1"
              setFieldValue={setFieldValue}
              model={appModels.EQUIPMENTCATEGORY}
              setFieldValue={setFieldValue}
              uploadFileType="images"
            />
            {/* <FormGroup className="m-1">
              <Label for="logo">Icon</Label>
              {!fileDataImage && !image_medium && (
                <ReactFileReader
                  multiple
                  elementId="fileUpload"
                  handleFiles={handleFiles}
                  fileTypes=".png,.jpg,.jpeg"
                  base64
                >
                  <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                    <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                    <p className="font-weight-500">Select a file</p>
                  </div>
                </ReactFileReader>
              )}
              {(!fileDataImage && (editId && image_medium)) && (
                <div className="position-relative mt-2">
                  <img
                    src={`data:image/png;base64,${image_medium}`}
                    height="150"
                    width="150"
                    className="ml-3"
                    alt="uploaded"
                  />
                  <div className="position-absolute topright-img-close">
                    <img
                      aria-hidden="true"
                      src={closeCircleIcon}
                      className="cursor-pointer"
                      onClick={() => {
                        setimgValidation(false);
                        setimgSize(false);
                        setFileDataImage(false);
                        setFileType(false);
                        setFieldValue('image_medium', false);
                      }}
                      alt="remove"
                    />
                  </div>
                </div>
              )}
              {fileDataImage && (
                <div className="position-relative mt-2">
                  <img
                    src={`${fileType}${fileDataImage}`}
                    height="150"
                    width="150"
                    className="ml-3"
                    alt="uploaded"
                  />
                  <div className="position-absolute topright-img-close">
                    <img
                      aria-hidden="true"
                      src={closeCircleIcon}
                      className="cursor-pointer"
                      onClick={() => {
                        setimgValidation(false);
                        setimgSize(false);
                        setFileDataImage(false);
                        setFileType(false);
                        setFieldValue('image_medium', false);
                        setFieldValue('image_small', false);
                      }}
                      alt="remove"
                    />
                  </div>
                </div>
              )}
            </FormGroup>
            {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
            {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)} */}
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
             sx={{
              marginBottom: '20px',
            }}
              name={typeValue.name}
              label={typeValue.label}
              formGroupClassName="m-1"
              open={typeOpen}
              size="small"
              onOpen={() => {
                setTypeOpen(true);
              }}
              onClose={() => {
                setTypeOpen(false);
              }}
              disableClearable
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.visitorTypes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={typeValue.label}
                  className="without-padding"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
             sx={{
              marginBottom: '20px',
            }}
              name={commodityId.name}
              label={commodityId.label}
              labelClassName="mb-2"
              formGroupClassName="mb-1 m-1"
              open={commodityOpen}
              oldValue={getOldData(commodity_id)}
              value={commodity_id && commodity_id.display_name ? commodity_id.display_name : getOldData(commodity_id)}
              size="small"
              onOpen={() => {
                setCommodityOpen(true);
                setCommodityKeyword('');
              }}
              onClose={() => {
                setCommodityOpen(false);
                setCommodityKeyword('');
              }}
              loading={accessGroupInfo && accessGroupInfo.loading && commodityOpen}
              getOptionSelected={(option, value) => option.display_name === value.display_name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
              apiError={(accessGroupInfo && accessGroupInfo.err) ? generateErrorMessage(accessGroupInfo) : false}
              options={commodityOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCommodityKeywordChange}
                  variant="standard"
                  label={commodityId.label}
                  value={commodityKeyword}
                  className={((getOldData(commodity_id)) || (commodity_id && commodity_id.id) || (commodityKeyword && commodityKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {accessGroupInfo && accessGroupInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(commodity_id)) || (commodity_id && commodity_id.id) || (commodityKeyword && commodityKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onCommodityKeywordClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showSearchModalCommodity}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
          {/* <Col xs={12} sm={12} lg={12} md={12}>
            <p className="mb-1 mt-0 ml-1">Label</p>
            <LabelForm editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                </Col> */}
        </Col>
      </Row>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            setFieldValue={setFieldValue}
          />
      </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
});

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
