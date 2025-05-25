/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CheckboxFieldGroup, FormikAutocomplete
  ,
} from '@shared/formFields';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import moment from 'moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Cascader, Divider } from 'antd';
import { useFormikContext } from 'formik';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Label, Row, Modal, ModalBody, Spinner,
} from 'reactstrap';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ErrorContent from '@shared/errorContent';
import {
  getRaisedList, getEquipmentList, setServiceImpactedId,
} from '../breakdownService';
import {
  getProductCompany, getSpaceList,
} from '../../siteOnboarding/siteService';
import {
  getAllCompanies, extractOptionsObject, generateErrorMessage, extractOptionsObjectWithName,
} from '../../util/appUtils';
import {
  getBuildings, getAllSpaces,
} from '../../assets/equipmentService';
import {
  getCascader,
} from '../../helpdesk/ticketService';
import { addParents, addChildrens } from '../../helpdesk/utils/utils';
import customData from '../data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
}));

const RequestorBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    reloadData,
    addModal,
    formField: {
      raisedBy,
      raisedOn,
      companyId,
      spaceId,
      types,
      equipmentId,
      amcStatus,
    },
  } = props;
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    raised_by_id, company_id, raised_on, type, space_id, equipment_id, amc_status,
  } = formValues;
  const dispatch = useDispatch();

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyKeyword, setCompanyKeyword] = useState('');

  const [raisedOpen, setRaisedOpen] = useState(false);
  const [raisedKeyword, setRaisedKeyword] = useState('');

  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const [typeOpen, setTypeOpen] = useState(false);
  const [amcOpen, setAmcOpen] = useState(false);

  const [parentId, setParentId] = useState('');
  const [spaceIds, setSpaceIds] = useState(false);
  const [spaceCategoryId, setSpaceCategoryId] = useState('');

  const [initialLoad, setInitialLoad] = useState(false);

  const [cascaderValues, setCascaderValues] = useState([]);
  const [childLoad, setChildLoad] = useState(false);
  const [refresh, setRefresh] = useState(reloadData);
  const [childValues, setChildValues] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    raisedInfoList, equInfoList,
  } = useSelector((state) => state.breakdowntracker);
  const {
    buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);
  const {
    productCompanyInfo, spaceInfo,
  } = useSelector((state) => state.site);
  const {
    spaceCascader,
  } = useSelector((state) => state.ticket);

  const companies = getAllCompanies(userInfo);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : [];
  }

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    setInitialLoad(false);
  }, [addModal]);

  useEffect(() => {
    if (userInfo && userInfo.data && !editId && !raised_by_id && !initialLoad) {
      // eslint-disable-next-line no-nested-ternary
      const companyIdValue = userInfo.data.company ? userInfo.data.company : '';
      const userId = { id: userInfo.data.id, name: userInfo.data.name };
      setFieldValue('company_id', companyIdValue);
      setFieldValue('raised_by_id', userId);
      setInitialLoad(false);
    }
  }, [editId, raised_by_id, initialLoad]);

  const resetEquipment = () => {
    if (editId) {
      setFieldValue('equipment_id', '');
    }
  };

  const resetSpaceCheck = () => {
    setFieldValue('space_id', '');
  };

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data && buildingsInfo.data.length)) {
      setChildValues(addParents(buildingsInfo.data));
    } else {
      setChildValues([]);
    }
  }, [buildingsInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      setChildLoad(true);
      const childData = addChildrens(childValues, buildingSpaces.data[0].child, parentId);
      setChildValues(childData);
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if (childValues) {
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues && (refresh === '1' || childLoad)) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces, childLoad]);

  useMemo(() => {
    if (((company_id && company_id.id) || (company_id && company_id.length > 0)) && type === 'Space') {
      dispatch(getBuildings(company_id.id, appModels.SPACE));
      // dispatch(getEquipmentList(company_id.id, appModels.EQUIPMENT));
    }
  }, [company_id, type]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && companyOpen) {
        await dispatch(getProductCompany(companies, appModels.COMPANY, companyKeyword));
      }
    })();
  }, [companyOpen, companyKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && raisedOpen) {
        await dispatch(getRaisedList(companies, appModels.USER, raisedKeyword));
      }
    })();
  }, [raisedOpen, raisedKeyword]);

  useEffect(() => {
    if (equipment_id && equipment_id.amc_end_date && equipment_id.amc_end_date !== '') {
      const d = moment.utc(equipment_id.amc_end_date).local().format();
      const dateAmcEndDate = new Date(d);
      const today = new Date();
      let amcStatusValue = '';
      if (today < dateAmcEndDate) {
        amcStatusValue = 'Valid';
      } else if (today > dateAmcEndDate) {
        amcStatusValue = 'Expired';
      }
      setFieldValue('amc_status', amcStatusValue);
    } else {
      let amcStatusValue = '';
      if ((equipment_id && (!equipment_id.amc_end_date || equipment_id.amc_end_date !== '')) || (equipment_id && (!equipment_id.amc_start_date || equipment_id.amc_start_date !== ''))) {
        amcStatusValue = 'Not Available';
      }
      setFieldValue('amc_status', amcStatusValue);
    }
  }, [equipment_id]);

  useEffect(() => {
    if (editId) {
      setFieldValue('amc_status', amc_status);
    }
  }, [])

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        const companyIds = company_id && company_id.id ? company_id.id : companies;
        await dispatch(getSpaceList(companyIds, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [spaceOpen, spaceKeyword]);

  /* useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getBuildings(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [spaceOpen, spaceKeyword]); */

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        const companyIds = company_id && company_id.id ? company_id.id : companies;
        await dispatch(getEquipmentList(companyIds, appModels.EQUIPMENT, equipmentKeyword));
      }
    })();
  }, [equipmentOpen, equipmentKeyword]);

  useEffect(() => {
    if (!editId && !raised_on) {
      setFieldValue('raised_on', new Date());
    }
  }, [editId, raised_on]);

  const onCompanyKeyWordChange = (event) => {
    setCompanyKeyword(event.target.value);
  };

  const onRaisedKeyWordChange = (event) => {
    setRaisedKeyword(event.target.value);
  };

  const onSpaceKeyWordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onEquipmentKeyWordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const onKeywordCompanyClear = () => {
    setCompanyKeyword(null);
    setFieldValue('company_id', '');
    setFieldValue('space_id', '');
    setFieldValue('equipment_id', '');
    setFieldValue('service_category_id', '');
    setFieldValue('services_impacted_ids', '');
    dispatch(setServiceImpactedId([]));
    setCompanyOpen(false);
  };

  const onKeywordClear = () => {
    setRaisedKeyword(null);
    if (!editId) {
      setInitialLoad(true);
    }
    setFieldValue('raised_by_id', '');
    setRaisedOpen(false);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setFieldValue('space_id', '');
    setSpaceOpen(false);
  };

  const onEquipmentClear = () => {
    setEquipmentKeyword(null);
    setFieldValue('equipment_id', '');
    setEquipmentOpen(false);
  };

  const showCompanyModal = () => {
    setModelValue(appModels.COMPANY);
    setFieldName('company_id');
    setModalName('Company List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const showRaisedRequestorModal = () => {
    setModelValue(appModels.USER);
    setFieldName('raised_by_id');
    setModalName('Raised List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Space List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(company_id && company_id.id ? company_id.id : companies);
    setColumns(['id', 'path_name']);
    setExtraModal(true);
  };

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipment List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(company_id && company_id.id ? company_id.id : companies);
    setColumns(['id', 'name', 'amc_start_date', 'amc_end_date', 'location_id']);
    setExtraModal(true);
  };

  const companyOptions = extractOptionsObject(productCompanyInfo, company_id);
  const raisedOptions = extractOptionsObject(raisedInfoList, raised_by_id);
  const spaceOptions = extractOptionsObjectWithName(spaceInfo, space_id, 'path_name');
  const equipmentOptions = extractOptionsObjectWithName(equInfoList, equipment_id, 'name');

  function getTypeLabel(data) {
    if (customData && customData.typeTextForm[data]) {
      const s = customData.typeTextForm[data].label;
      return s;
    }
    return '';
  }

  function getAmcLabel(data) {
    if (customData && customData.amcTextForm[data]) {
      const s = customData.amcTextForm[data].label;
      return s;
    }
    return '';
  }

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

  const loadData = () => { };

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {loading && (
        <>
          <Divider style={{ margin: 0 }} />
          <div className="text-center p-2" data-testid="loading-case">
            <Spinner animation="border" size="sm" className="text-dark ml-3" variant="secondary" />
          </div>
        </>
      )}
      {((buildingsInfo && buildingsInfo.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg} />
        </>
      )}
      {((buildingSpaces && buildingSpaces.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg1} />
        </>
      )}
    </div>
  );

  const onChange = (value, selectedOptions) => {
    setParentId('');
    if (selectedOptions && selectedOptions.length) {
      if (!selectedOptions[0].parent_id) {
        setParentId(selectedOptions[0].id);
        setSpaceIds(selectedOptions[0].id);
        if (spaceIds !== selectedOptions[0].id) {
          dispatch(getAllSpaces(selectedOptions[0].id, companies));
        }
      }
    }
    setFieldValue('space_id', value);
  };

  return (
    <Row className="mb-1 requestorForm-input">
      <Col xs={12} sm={12} lg={12} md={12}>
        <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
          Requestor Information
        </span>
      </Col>
      <Col xs={12} sm={12} lg={12} md={12}>
        <FormikAutocomplete
          name={raisedBy.name}
          label={raisedBy.label}
          open={raisedOpen}
          formGroupClassName="m-1"
          size="small"
          onOpen={() => {
            setRaisedOpen(true);
            setRaisedKeyword('');
          }}
          onClose={() => {
            setRaisedOpen(false);
            setRaisedKeyword('');
          }}
          oldValue={getOldData(raised_by_id)}
          value={raised_by_id && raised_by_id.name ? raised_by_id.name : getOldData(raised_by_id)}
          loading={raisedInfoList && raisedInfoList.loading}
          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={raisedOptions}
          apiError={(raisedInfoList && raisedInfoList.err) ? generateErrorMessage(raisedInfoList) : false}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => { onRaisedKeyWordChange(e.target.value); }}
              variant="outlined"
              className={((getOldData(raised_by_id)) || (raised_by_id && raised_by_id.id) || (raisedKeyword && raisedKeyword.length > 0))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {raisedInfoList && raisedInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((raised_by_id && raised_by_id.id) || (raisedKeyword && raisedKeyword.length > 0) || (raised_by_id && raised_by_id.length)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onKeywordClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton onClick={showRaisedRequestorModal}>
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
      { /* <Col xs={12} sm={12} md={12} lg={12}>
        {!editId ? (
          <DateTimeFieldDefault
            name={raisedOn.name}
            label={raisedOn.label}
            isRequired={raisedOn.required}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={raisedOn.label}
            customClassName="bg-input-blue-small"
            labelClassName="mb-1"
            formGroupClassName="mb-1"
            disablePastDate
            disableFuture
            defaultValue={raised_on ? moment(new Date(getDateTimeSeconds(raised_on)), 'DD/MM/YYYY HH:mm:ss') : moment(new Date(), 'DD/MM/YYYY HH:mm:ss')}
            currentValue={raised_on ? moment(new Date(getDateTimeSeconds(raised_on)), 'DD/MM/YYYY HH:mm:ss') : moment(new Date(), 'DD/MM/YYYY HH:mm:ss')}
          />
        ) : (
          <DateTimeField
            name={raisedOn.name}
            label={raisedOn.label}
            isRequired={raisedOn.required}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={raisedOn.label}
            customClassName="bg-input-blue-small"
            labelClassName="mb-1"
            formGroupClassName="mb-1"
            disablePastDate
            disableFuture
            defaultValue={raised_on ? new Date(getDateTimeSeconds(raised_on)) : ''}
          />
        )}
        </Col> */}
      <Col xs={12} sm={12} lg={12} md={12}>
        <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
          Asset Information
        </span>
      </Col>
      <Col xs={12} sm={12} lg={12} md={12}>
        <FormikAutocomplete
          name={companyId.name}
          label={companyId.label}
          oldValue={getOldData(company_id)}
          value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
          apiError={(productCompanyInfo && productCompanyInfo.err) ? generateErrorMessage(productCompanyInfo) : false}
          open={companyOpen}
          size="small"
          onOpen={() => {
            setCompanyOpen(true);
            setCompanyKeyword('');
          }}
          onClose={() => {
            setCompanyOpen(false);
            setCompanyKeyword('');
          }}
          loading={companyOpen && productCompanyInfo && productCompanyInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={companyOptions}
          onChange={(e, data, reason) => { setFieldValue('company_id', data); setFieldValue('space_id', ''); setFieldValue('equipment_id', ''); setFieldValue('service_category_id', ''); setFieldValue('services_impacted_ids', ''); }}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => { onCompanyKeyWordChange(e.target.value); }}
              variant="outlined"
              className={((getOldData(company_id)) || (company_id && company_id.id) || (companyKeyword && companyKeyword.length > 0))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {productCompanyInfo && productCompanyInfo.loading && companyOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((company_id && company_id.id) || (companyKeyword && companyKeyword.length > 0) || (company_id && company_id.length)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onKeywordCompanyClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showCompanyModal}
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
        {/* <FormikAutocomplete
          name={types.name}
          label={types.label}
          className="bg-white"
          open={typeOpen}
          disableClearable
          oldValue={getTypeLabel(type)}
          value={type && type.label ? type.label : getTypeLabel(type)}
          size="small"
          onOpen={() => {
            setTypeOpen(true);
          }}
          onClose={() => {
            setTypeOpen(false);
          }}
          getOptionSelected={(option, value) => option.label === value.label}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
          options={customData.reqType}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
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
        /> */}
        <Col md="12" sm="12" lg="12" xs="12" className="pl-1">
          <Label for={types.name} className="m-0">
            Type
            <span className="ml-1 text-danger">*</span>
          </Label>
          <div className="ml-1">
            <CheckboxFieldGroup
              name={types.name}
              checkedvalue="Space"
              id="Space"
              onClick={() => resetSpaceCheck()}
              label={types.label}
            />
            <CheckboxFieldGroup
              name={types.name}
              checkedvalue="Equipment"
              id="Equipment"
              onClick={() => resetEquipment()}
              label={types.label1}
            />
          </div>
        </Col>
      </Col>
      {type === 'Space' && editId ? (
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={spaceId.name}
            label={spaceId.label}
            open={spaceOpen}
            labelClassName="mb-1"
            formGroupClassName="mb-1 w-100"
            isRequired
            size="small"
            onOpen={() => {
              setSpaceOpen(true);
              setSpaceKeyword('');
            }}
            onClose={() => {
              setSpaceOpen(false);
              setSpaceKeyword('');
            }}
            oldValue={getOldData(space_id)}
            value={space_id && space_id.path_name ? space_id.path_name : getOldData(space_id)}
            loading={spaceInfo && spaceInfo.loading}
            getOptionSelected={(option, value) => (value ? option.path_name === value.path_name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            options={spaceOptions}
            apiError={(spaceInfo && spaceInfo.err) ? generateErrorMessage(spaceInfo) : false}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => { onSpaceKeyWordChange(e.target.value); }}
                variant="outlined"
                className={((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0))
                  ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spaceInfo && spaceInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onSpaceClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton onClick={showSpaceModal}>
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
      )
        : ''}
      {type === 'Space' && !editId
        && (
          <Col xs={12} sm={12} md={12} lg={12}>
            <span className="font-weight-600 pb-1 d-inline-block">
              {spaceId.label}
              <span className="ml-1 text-danger">*</span>
            </span>
            <br />

            <Cascader
              options={spaceCascader && spaceCascader.length > 0 ? spaceCascader : []}
              value={spaceCascader && spaceCascader.length > 0 ? space_id : []}
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              onChange={onChange}
              placeholder="Select Space"
              dropdownRender={dropdownRender}
              notFoundContent="No options"
              className="thin-scrollbar bg-white mb-1 w-100"
              loadData={loadData}
              changeOnSelect
            />
          </Col>
        )}
      {type === 'Equipment' ? (
        <>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={equipmentId.name}
              label={equipmentId.label}
              isRequired
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              oldValue={getOldData(equipment_id)}
              value={equipment_id && equipment_id.name ? equipment_id.name : ''}
              apiError={(equInfoList && equInfoList.err) ? generateErrorMessage(equInfoList) : false}
              open={equipmentOpen}
              size="small"
              onOpen={() => {
                setEquipmentOpen(true);
                setEquipmentKeyword('');
              }}
              onClose={() => {
                setEquipmentOpen(false);
                setEquipmentKeyword('');
              }}
              classes={{
                option: classes.option,
              }}
              loading={equipmentOpen && equInfoList && equInfoList.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              renderOption={(option) => (
                <>
                  <h6 className="mb-1">{option.name}</h6>
                  <p className="font-tiny ml-2 mb-0 mt-0">{option.location_id ? option.location_id.path_name : ''}</p>
                </>
              )}
              options={equipmentOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onEquipmentKeyWordChange}
                  variant="outlined"
                  value={equipmentKeyword}
                  className={((equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0))
                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {equInfoList && equInfoList.loading && equipmentOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onEquipmentClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showEquipmentModal}
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
            <FormikAutocomplete
              name={amcStatus.name}
              label={amcStatus.label}
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={amcOpen}
              disableClearable
              isRequired
              oldValue={getAmcLabel(amc_status)}
              value={amc_status && amc_status.label ? amc_status.label : getAmcLabel(amc_status)}
              size="small"
              onOpen={() => {
                setAmcOpen(true);
              }}
              onClose={() => {
                setAmcOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.amcStatus}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="input-small-custom without-padding"
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
        </>
      )
        : ''}

      <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
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
        </ModalBody>
      </Modal>
    </Row>
  );
});

RequestorBasicForm.defaultProps = {
  addModal: false,
};

RequestorBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  addModal: PropTypes.bool,
};

export default RequestorBasicForm;
