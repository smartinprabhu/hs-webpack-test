/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Spinner,
  Input,
} from 'reactstrap';
import Button from '@mui/material/Button';
import DOMPurify from 'dompurify';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { ThemeProvider } from '@material-ui/core/styles';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import {
  faCaretSquareDown, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import assetDefault from '@images/icons/assetDefault.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getDefaultNoValue, generateErrorMessage,
  getAllCompanies,
} from '../../../util/appUtils';
import { getCategoryList, getSubCategoryList } from '../../../helpdesk/ticketService';
import { getAssetDetail, createBreakdown } from '../../equipmentService';
import theme from '../../../util/materialTheme';

const appModels = require('../../../util/appModels').default;

const BreakDown = (props) => {
  const {
    equipmentsDetails, breakModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const breakValue = 'br';
  const [modal, setModal] = useState(breakModal);
  const [stateType, setStateType] = useState('');
  const [breakdownReason, setBreakdownReason] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [subCategoryKeyword, setSubCategoryKeyword] = useState('');
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState('');
  const [subCategoryValue, setSubCategoryValue] = useState('');
  const toggle = () => {
    setModal(!modal);
    setCategoryValue('');
    setSubCategoryValue('');
    atFinish();
  };
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { categoryInfo, subCategoryInfo } = useSelector((state) => state.ticket);
  const { createBreakdownInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && categoryOpen) {
        await dispatch(getCategoryList(companies, appModels.TICKETCATEGORY, categoryKeyword));
      }
    })();
  }, [categoryOpen, categoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && subCategoryOpen && (categoryValue && categoryValue.id)) {
        await dispatch(getSubCategoryList(companies, appModels.TICKETSUBCATEGORY, categoryValue.id, subCategoryKeyword));
      }
    })();
  }, [subCategoryOpen, categoryValue, subCategoryKeyword]);

  useEffect(() => {
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (createBreakdownInfo && createBreakdownInfo.data)) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  }, [userInfo, createBreakdownInfo]);

  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : '';

  const handleStateChange = (id, type) => {
    const category = categoryValue && categoryValue.id ? categoryValue.id : '';
    const subCategory = subCategoryValue && subCategoryValue.id ? subCategoryValue.id : '';
    const payload = {
      equipment_id: id, reason: DOMPurify.sanitize(breakdownReason), category_id: category, sub_category_id: subCategory,
    };
    dispatch(createBreakdown(payload));
    setBreakdownReason(false);
    setStateType(type);
  };

  const reasonInputChange = (e) => {
    setBreakdownReason(e.target.value);
  };

  const onKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onSubKeywordChange = (event) => {
    setSubCategoryKeyword(event.target.value);
  };

  let categoryOptions = [];
  let SubCategoryOptions = [];

  if (categoryInfo && categoryInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }
  if (categoryInfo && categoryInfo.data) {
    categoryOptions = categoryInfo.data;
  }

  if (subCategoryInfo && subCategoryInfo.loading) {
    SubCategoryOptions = [{ name: 'Loading..' }];
  }
  if (subCategoryInfo && subCategoryInfo.data) {
    SubCategoryOptions = subCategoryInfo.data;
  }

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={breakModal}>
      <h5 className="font-weight-800 mb-0">
        <ModalHeaderComponent title="Breakdown Asset" fontAwesomeIcon={faCaretSquareDown} closeModalWindow={toggle} size="lg" response={createBreakdownInfo} />
      </h5>
      <ModalBody className="pt-2">
        <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
            <CardBody data-testid="success-case" className="bg-lightblue p-3">
              <Row>
                <Col md="2" xs="2" sm="2" lg="2">
                  <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                </Col>
                <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                  <Row>
                    <h6 className="mb-1">{equipmentData.name}</h6>
                  </Row>
                  <Row>
                    <p className="mb-0 font-weight-500 font-tiny">
                      #
                      {equipmentData.location_id
                        ? equipmentData.location_id[1]
                        : <span>Not Assigned</span>}
                    </p>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Category :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].category_id[1] ? equipmentsDetails.data[0].category_id[1] : '')}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          )}
        </Card>
        {equipmentsDetails && equipmentsDetails.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
        )}
        {createBreakdownInfo && !createBreakdownInfo.data && (
          <>
            <Row className="ml-2 mr-2">
              <ThemeProvider theme={theme}>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <Label for="category_id">
                    Category
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Autocomplete
                    name="category_id"
                    label="Category"
                    open={categoryOpen}
                    size="small"
                    onOpen={() => {
                      setSubCategoryValue('');
                      setCategoryOpen(true);
                    }}
                    onClose={() => {
                      setSubCategoryValue('');
                      setCategoryOpen(false);
                      setCategoryKeyword('');
                    }}
                    onChange={(event, newValue) => {
                      setCategoryValue(newValue);
                    }}
                    value={categoryValue || ''}
                    loading={categoryInfo && categoryInfo.loading}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={categoryOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onKeywordChange}
                        variant="outlined"
                        className={categoryValue ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {categoryInfo && categoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {categoryValue && (
                                  <IconButton onClick={() => {
                                    setCategoryValue('');
                                    setCategoryKeyword('');
                                    setSubCategoryValue('');
                                  }}
                                  >
                                    <BackspaceIcon fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton>
                                  <SearchIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {(categoryInfo && categoryInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(categoryInfo)}</span></FormHelperText>)}
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <Label for="sub_category_id">
                    Sub Category
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Autocomplete
                    name="sub_category_id"
                    label="Sub Category"
                    open={subCategoryOpen}
                    size="small"
                    disabled={!categoryValue}
                    value={categoryValue ? subCategoryValue : ''}
                    onOpen={() => {
                      setSubCategoryOpen(true);
                    }}
                    onClose={() => {
                      setSubCategoryOpen(false);
                      setSubCategoryKeyword('');
                    }}
                    onChange={(event, newValue) => {
                      setSubCategoryValue(newValue);
                    }}
                    loading={subCategoryInfo && subCategoryInfo.loading}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={SubCategoryOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onSubKeywordChange}
                        variant="outlined"
                        className="without-padding custom-icons"
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {subCategoryInfo && subCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {subCategoryValue && (
                                  <IconButton onClick={() => {
                                    setSubCategoryKeyword('');
                                    setSubCategoryValue('');
                                  }}
                                  >
                                    <BackspaceIcon fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton>
                                  <SearchIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {(subCategoryInfo && subCategoryInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(subCategoryInfo)}</span></FormHelperText>)}
                </Col>
              </ThemeProvider>
            </Row>
            <br />
            <Row className="ml-2 mr-2">
              <Col xs={12} sm={12} md={12} lg={12}>
                <Label for="breakdown reason">
                  Breakdown reason
                  <span className="ml-1 text-danger">*</span>
                </Label>
                <Input type="textarea" placeholder="Enter breakdown reason" onChange={reasonInputChange} className="" />
              </Col>
            </Row>
            <Row className="ml-1 mt-2 mr-2">
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="text-left font-11 text-info ml-2">
                  <FontAwesomeIcon size="sm" icon={faInfoCircle} />
                  {' '}
                  Helpdesk ticket with Priority-Breakdown would be created.
                </div>
              </Col>
            </Row>
          </>
        )}
        <Row className="justify-content-center">
          {createBreakdownInfo && createBreakdownInfo.data && (equipmentsDetails && !equipmentsDetails.loading) && (
            <SuccessAndErrorFormat response={createBreakdownInfo} successMessage="This asset has been breakdown successfully.." />
          )}
          {createBreakdownInfo && createBreakdownInfo.err && (
            <SuccessAndErrorFormat response={createBreakdownInfo} />
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {equipmentData.state === breakValue
          ? ''
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              className="mr-1"
              disabled={!breakdownReason || !categoryValue || !subCategoryValue}
              onClick={() => handleStateChange(equipmentData.id, 'breakdown')}
            >
              {(createBreakdownInfo && createBreakdownInfo.loading && stateType === 'breakdown') ? (
                <Spinner size="sm" color="light" className="mr-2" />
              ) : ''}
              {' '}
              Confirm
            </Button>
          )}
        {(equipmentsDetails && !equipmentsDetails.loading) && ((equipmentData.state === breakValue) || (createBreakdownInfo && createBreakdownInfo.data)) && (
          <Button
            type="button"
            size="sm"
             variant="contained"
            className="mr-1"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

BreakDown.propTypes = {
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  breakModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default BreakDown;
