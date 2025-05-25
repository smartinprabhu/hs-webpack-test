/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Label,
  Row,
  Spinner,
  Input,
} from 'reactstrap';
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

import SearchModalSingleStatic from '@shared/searchModals/singleSearchModelStatic';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  Box, Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import {
  getDefaultNoValue, generateErrorMessage,
  getAllowedCompanies, arraySortByString, generateArrayFromValue,
} from '../../../util/appUtils';
import { getSiteBasedCategory } from '../../../helpdesk/ticketService';
import { getAssetDetail, createBreakdown } from '../../equipmentService';
import theme from '../../../util/materialTheme';
import DialogHeader from '../../../commonComponents/dialogHeader';

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

  const [modalName, setModalName] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'display_name']);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [fieldName, setFieldName] = useState('');
  const [extraModal1, setExtraModal1] = useState(false);

  const toggle = () => {
    setModal(!modal);
    setCategoryValue('');
    setSubCategoryValue('');
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { siteCategoriesInfo } = useSelector((state) => state.ticket);
  const { createBreakdownInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getSiteBasedCategory(false, false, false, userInfo.data.company.id));
      }
    })();
  }, [userInfo]);

  /* useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && subCategoryOpen && (categoryValue && categoryValue.id)) {
        await dispatch(getSubCategoryList(companies, appModels.TICKETSUBCATEGORY, categoryValue.id, subCategoryKeyword));
      }
    })();
  }, [subCategoryOpen, categoryValue, subCategoryKeyword]); */

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

  if (siteCategoriesInfo && siteCategoriesInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }
  if (siteCategoriesInfo && siteCategoriesInfo.data) {
    siteCategoriesInfo.data = siteCategoriesInfo.data.filter((categ) => {
      if (categ && Object.keys(categ).find((key) => key === 'is_incident')) {
        return categ.is_incident === false;
      } return categ;
    });

    const arr = [...categoryOptions, ...siteCategoriesInfo.data];
    categoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    categoryOptions = arraySortByString(categoryOptions, 'name');
  }
  if (siteCategoriesInfo && siteCategoriesInfo.err) {
    categoryOptions = [];
  }
  if (siteCategoriesInfo && siteCategoriesInfo.loading) {
    SubCategoryOptions = [{ name: 'Loading..' }];
  }
  if (siteCategoriesInfo && siteCategoriesInfo.data && categoryValue && categoryValue.id) {
    const subData = generateArrayFromValue(siteCategoriesInfo.data, 'id', categoryValue.id);
    const loadedSubData = subData && subData.length ? subData[0].sub_category_id : [];
    if (loadedSubData) {
      const arr = [...SubCategoryOptions, ...loadedSubData];
      SubCategoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
      SubCategoryOptions = arraySortByString(SubCategoryOptions, 'name');
    }
  }
  if (siteCategoriesInfo && siteCategoriesInfo.err) {
    SubCategoryOptions = [];
  }

  const showCategoryModal = () => {
    setFieldName('ticket_categ_id');
    setExtraModal1(true);
    setColumns(['id', 'name', 'cat_display_name']);
    setHeaders(['Name']);
    setModalName('Categories');
    setOldValues(categoryValue && categoryValue.id ? categoryValue.id : '');
  };

  const showSubCategoryModal = () => {
    setFieldName('ticket_sub_categ_id');
    setExtraModal1(true);
    setColumns(['id', 'name', 'sub_cat_display_name']);
    setHeaders(['Name']);
    setModalName('Sub Categories');
    setOldValues(subCategoryValue && subCategoryValue.id ? subCategoryValue.id : '');
  };

  const onDataChange = (fieldRef, data) => {
    if (fieldRef === 'ticket_categ_id') {
      setCategoryValue(data);
    } else {
      setSubCategoryValue(data);
    }
  };

  return (
    <>
      <Dialog maxWidth="md" fullWidth open={breakModal}>
        <DialogHeader title="Breakdown Asset" onClose={toggle} response={createBreakdownInfo} fontAwesomeIcon={faCaretSquareDown} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F6F8FA',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10%',
                fontFamily: 'Suisse Intl',
              }}
            >
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
                        loading={siteCategoriesInfo && siteCategoriesInfo.loading}
                        getOptionSelected={(option, value) => (option.cat_display_name ? option.cat_display_name === value.cat_display_name : option.name === value.name)}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.cat_display_name ? option.cat_display_name : option.name)}
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
                                  {siteCategoriesInfo && siteCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
                                    <IconButton
                                      aria-label="toggle search visibility"
                                      onClick={showCategoryModal}
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
                      {(siteCategoriesInfo && siteCategoriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(siteCategoriesInfo)}</span></FormHelperText>)}
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
                        loading={siteCategoriesInfo && siteCategoriesInfo.loading}
                        getOptionSelected={(option, value) => (option.sub_cat_display_name ? option.sub_cat_display_name === value.sub_cat_display_name : option.name === value.name)}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.sub_cat_display_name ? option.sub_cat_display_name : option.name)}
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
                                  {siteCategoriesInfo && siteCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
                                    <IconButton
                                      aria-label="toggle search visibility"
                                      onClick={showSubCategoryModal}
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
                      {(siteCategoriesInfo && siteCategoriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(subCategoryInfo)}</span></FormHelperText>)}
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
                    <Input type="textarea" placeholder="Enter breakdown reason" onChange={reasonInputChange} className="light-placeholder" />
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
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {equipmentData.state === breakValue
            ? ''
            : (
              <Button
                type="button"
                variant="contained"
                className="submit-btn"
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
            variant="contained"
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraModal1}>
        <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalSingleStatic
              afterReset={() => { setExtraModal1(false); }}
              fieldName={fieldName}
              fields={columns}
              headers={headers}
              data={fieldName === 'ticket_categ_id' ? categoryOptions : SubCategoryOptions}
              setFieldValue={onDataChange}
              modalName={modalName}
              oldValues={oldValues}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
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
