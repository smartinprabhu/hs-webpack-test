/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Modal,
  ModalBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { InputField, FormikAutocomplete } from '@shared/formFields';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getCategoryList, getTeamList, getUNSPSCCodes, getUNSPSCOtherCodes,
} from '../../equipmentService';
import {
  getSpacesList,
} from '../../../helpdesk/ticketService';
import {
  generateErrorMessage, getAllCompanies,
} from '../../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../../util/appModels').default;

const AssetDetailInfoUpdate = (props) => {
  const {
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [unspscOpen, setUnspscOpen] = useState(false);
  const [unspscKeyword, setUnspscKeyword] = useState('');
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { values: formValues } = useFormikContext();
  const {
    category_id, commodity_id, maintenance_team_id, location_id,
  } = formValues;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    equipmentsDetails, categoriesInfo,
    teamsInfo, unspscCodes, unspscOtherCodes,
  } = useSelector((state) => state.equipment);
  const { spacesInfo } = useSelector((state) => state.ticket);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(userInfo.data.company.id, appModels.TEAM, teamKeyword));
      }
    })();
  }, [userInfo, teamKeyword, teamOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && categoryOpen) {
        await dispatch(getCategoryList(userInfo.data.company.id, appModels.EQUIPMENTCATEGORY, categoryKeyword));
      }
    })();
  }, [userInfo, categoryKeyword, categoryOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && unspscOpen) {
      if (unspscKeyword && unspscKeyword.length > 2) {
        dispatch(getUNSPSCCodes(userInfo.data.company.id, appModels.UNSPSC, unspscKeyword));
      } else {
        dispatch(getUNSPSCCodes(userInfo.data.company.id, appModels.UNSPSC, unspscKeyword));
      }
    }
  }, [unspscOpen, unspscKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && commodity_id && commodity_id.id) {
      dispatch(getUNSPSCOtherCodes(userInfo.data.company.id, appModels.UNSPSC, commodity_id.id));
    }
  }, [userInfo, commodity_id]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].commodity_id)) {
      dispatch(getUNSPSCOtherCodes(userInfo.data.company.id, appModels.UNSPSC, equipmentsDetails.data[0].commodity_id[0]));
    }
  }, [userInfo, equipmentsDetails]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpacesList(userInfo.data.company.id, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [userInfo, spaceKeyword, spaceOpen]);

  useEffect(() => {
    if ((unspscOtherCodes && unspscOtherCodes.data) && ((commodity_id && commodity_id.id) || (commodity_id && commodity_id.length && commodity_id.length > 0))) {
      setFieldValue('family_id', unspscOtherCodes.data[0].family_id);
      setFieldValue('class_id', unspscOtherCodes.data[0].class_id);
      setFieldValue('segment_id', unspscOtherCodes.data[0].segment_id);
    } else {
      setFieldValue('family_id', '');
      setFieldValue('class_id', '');
      setFieldValue('segment_id', '');
      setUnspscKeyword('');
    }
  }, [unspscOtherCodes, commodity_id]);

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onUnspscKeywordChange = (event) => {
    setUnspscKeyword(event.target.value);
  };

  const showCategoryModal = () => {
    setModelValue(appModels.EQUIPMENTCATEGORY);
    setColumns(['id', 'path_name']);
    setFieldName('category_id');
    setModalName('Category List');
    setPlaceholder('Categories');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onCategoryClear = () => {
    setCategoryKeyword(null);
    setFieldValue('category_id', '');
    setCategoryOpen(false);
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintenance_team_id');
    setModalName('Team List');
    setPlaceholder('Maintenance Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onTeamClear = () => {
    setTeamKeyword(null);
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  const showCommodityModal = () => {
    setModelValue(appModels.UNSPSC);
    setColumns(['id', 'name']);
    setFieldName('commodity_id');
    setModalName('UNSPSC List');
    setPlaceholder('Commodities');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onCommodityClear = () => {
    setUnspscKeyword(null);
    setFieldValue('commodity_id', '');
    setFieldValue('family_id', '');
    setFieldValue('class_id', '');
    setFieldValue('segment_id', '');
    setFieldValue('commodity_id', '');
    setUnspscOpen(false);
  };

  let categoryOptions = [];

  if (categoriesInfo && categoriesInfo.loading) {
    categoryOptions = [{ path_name: 'Loading..' }];
  }
  if (category_id && category_id.length && category_id.length > 0) {
    const oldCategory = [{ id: category_id[0], path_name: category_id[1] }];
    const newArr = [...categoryOptions, ...oldCategory];
    categoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (categoriesInfo && categoriesInfo.data) {
    const arr = [...categoryOptions, ...categoriesInfo.data];
    categoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  let teamOptions = [];
  let spaceOptions = [];

  if (teamsInfo && teamsInfo.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }
  if (maintenance_team_id && maintenance_team_id.length && maintenance_team_id.length > 0) {
    const oldMaintenanceTeam = [{ id: maintenance_team_id[0], name: maintenance_team_id[1] }];
    const newArr = [...teamOptions, ...oldMaintenanceTeam];
    teamOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (teamsInfo && teamsInfo.data) {
    const arr = [...teamOptions, ...teamsInfo.data];
    teamOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  let unspscOptions = [];
  if (unspscCodes && unspscCodes.loading) {
    unspscOptions = [{ name: 'Loading..' }];
  }
  if (commodity_id && commodity_id.length && commodity_id.length > 0) {
    const oldCid = [{ id: commodity_id[0], name: commodity_id[1] }];
    const newArr = [...unspscOptions, ...oldCid];
    unspscOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (unspscCodes && unspscCodes.data) {
    const arr = [...unspscOptions, ...unspscCodes.data];
    unspscOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (spacesInfo && spacesInfo.loading) {
    spaceOptions = [{ path_name: 'Loading..' }];
  }
  if (equipmentsDetails && equipmentsDetails.data && location_id && location_id.length && location_id.length > 0) {
    const oldSpaceId = [{ id: location_id[0], path_name: location_id[1] }];
    const newArr = [...spaceOptions, ...oldSpaceId];
    spaceOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (spacesInfo && spacesInfo.data) {
    const arr = [...spaceOptions, ...spacesInfo.data];
    spaceOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const oldTeamId = maintenance_team_id && maintenance_team_id.length && maintenance_team_id.length > 0 ? maintenance_team_id[1] : '';
  const oldCategoryId = category_id && category_id.length && category_id.length > 0 ? category_id[1] : '';
  const oldCommodityId = commodity_id && commodity_id.length && commodity_id.length > 0 ? commodity_id[1] : '';
  const oldLocationId = location_id && location_id.length && location_id.length > 0 ? location_id[1] : '';

  return (
    <>
      {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
        <Row className="mb-3 assest-request-form">
          <Col xs={12} sm={12} lg={6} md={12}>
            <Col xs={12} sm={12} lg={12} md={12} className="pr-2">
              <InputField name="name" label="Name" isRequired type="text" formGroupClassName="m-1" maxLength="100" />
            </Col>
            <Col xs={12} sm={12} lg={12} md={12}>
              <FormikAutocomplete
                name="location_id"
                label="Location"
                formGroupClassName="m-1"
                isRequired
                oldValue={oldLocationId}
                loading={spacesInfo && spacesInfo.loading}
                open={spaceOpen}
                value={location_id && location_id.path_name ? location_id.path_name : oldLocationId}
                size="small"
                onOpen={() => {
                  setSpaceOpen(true);
                  setSpaceKeyword('');
                }}
                onClose={() => {
                  setSpaceOpen(false);
                  setSpaceKeyword('');
                }}
                getOptionSelected={(option, value) => option.path_name === value.path_name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                options={spaceOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onSpaceKeywordChange}
                    variant="outlined"
                    className="without-padding"
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {spacesInfo && spacesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(spacesInfo && spacesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spacesInfo)}</span></FormHelperText>)}
            </Col>
            <Col xs={12} md={12} lg={12} sm={12} className="pr-2">
              <InputField
                name="equipment_number"
                label="Description"
                formGroupClassName="m-1"
                type="textarea"
                rows="4"
              />
            </Col>
          </Col>
          <Col xs={12} sm={12} lg={6} md={12}>
            <Col xs={12} sm={12} lg={12} md={12}>
              <FormikAutocomplete
                name="category_id"
                label="Category"
                formGroupClassName="m-1"
                isRequired
                oldValue={oldCategoryId}
                loading={categoriesInfo && categoriesInfo.loading}
                open={categoryOpen}
                value={category_id && category_id.path_name ? category_id.path_name : oldCategoryId}
                size="small"
                onOpen={() => {
                  setCategoryOpen(true);
                  setCategoryKeyword('');
                }}
                onClose={() => {
                  setCategoryOpen(false);
                  setCategoryKeyword('');
                }}
                getOptionSelected={(option, value) => option.path_name === value.path_name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                options={categoryOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onCategoryKeywordChange}
                    variant="outlined"
                    className={category_id && category_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {categoriesInfo && categoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {category_id && category_id.id && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onCategoryClear}
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
              {(categoriesInfo && categoriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(categoriesInfo)}</span></FormHelperText>)}
            </Col>
            <Col xs={12} sm={12} lg={12} md={12}>
              <FormikAutocomplete
                name="maintenance_team_id"
                label="Maintenance Team"
                formGroupClassName="m-1"
                isRequired
                oldValue={oldTeamId}
                value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : oldTeamId}
                open={teamOpen}
                size="small"
                onOpen={() => {
                  setTeamOpen(true);
                  setTeamKeyword('');
                }}
                onClose={() => {
                  setTeamOpen(false);
                  setTeamKeyword('');
                }}
                loading={teamsInfo && teamsInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={teamOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onTeamKeywordChange}
                    variant="outlined"
                    className={maintenance_team_id && maintenance_team_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {maintenance_team_id && maintenance_team_id.id && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onTeamClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showTeamModal}
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
              {(teamsInfo && teamsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)}
            </Col>
            <Col xs={12} sm={12} lg={12} md={12}>
              <FormikAutocomplete
                name="commodity_id"
                label="UNSPSC Code"
                formGroupClassName="m-1"
                // isRequired
                oldValue={oldCommodityId}
                loading={unspscCodes && unspscCodes.loading}
                open={unspscOpen}
                value={commodity_id && commodity_id.name ? commodity_id.name : oldCommodityId}
                size="small"
                onOpen={() => {
                  setUnspscOpen(true);
                  setUnspscKeyword('');
                }}
                onClose={() => {
                  setUnspscOpen(false);
                  setUnspscKeyword('');
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={unspscOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onUnspscKeywordChange}
                    variant="outlined"
                    className={commodity_id && commodity_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {unspscCodes && unspscCodes.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {commodity_id && commodity_id.id && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onCommodityClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showCommodityModal}
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
              {(unspscCodes && unspscCodes.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(unspscCodes)}</span></FormHelperText>)}
            </Col>
            {((commodity_id && commodity_id.id) || (commodity_id && commodity_id.length && commodity_id.length > 0)) && (
              <>
                <Col xs={12} md={12} lg={12} sm={12}>
                  <InputField
                    name="class_id"
                    label="Class"
                    formGroupClassName="mb-2 ml-1 mt-1 mr-0"
                    type="text"
                    readOnly
                  />
                </Col>
                <Col xs={12} md={12} lg={12} sm={12}>
                  <InputField
                    name="family_id"
                    label="Family"
                    formGroupClassName="mb-2 ml-1 mr-0"
                    type="text"
                    readOnly
                  />
                </Col>
                <Col xs={12} md={12} lg={12} sm={12}>
                  <InputField
                    name="segment_id"
                    label="Segment"
                    formGroupClassName="mb-2 ml-1 mr-0"
                    type="text"
                    readOnly
                  />
                </Col>
              </>
            )}
          </Col>
          <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
            <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
            <ModalBody className="mt-0 pt-0">
              <AdvancedSearchModal
                modelName={modelValue}
                afterReset={() => { setExtraModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                placeholderName={placeholderName}
                setFieldValue={setFieldValue}
              />
            </ModalBody>
          </Modal>
        </Row>
      )}
    </>
  );
};

AssetDetailInfoUpdate.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AssetDetailInfoUpdate;
