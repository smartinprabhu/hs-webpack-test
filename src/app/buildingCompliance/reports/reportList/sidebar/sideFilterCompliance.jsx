/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Col, Input, Label, Row, FormFeedback, FormGroup, Modal,
  ModalBody,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { DatePicker } from 'antd';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getTypeId,
} from '../../../../preventiveMaintenance/ppmService';
import { getComplianceAct, getComplianceReport, resetComplianceReport } from '../../../complianceService';
import {
  getAllowedCompanies, getArrayFromValuesById, isAssociativeArray, generateErrorMessage, getDatesOfQueryWithUtc, getColumnArrayById, getDateAndTimeForDifferentTimeZones,
} from '../../../../util/appUtils';
import complianceActions from '../../../data/customData.json';
import SearchModalSingle from './searchModalSingle';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const SideFilterCompliance = () => {
  const dispatch = useDispatch();
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [expiryDateCollapse, setExpiryDateCollapse] = useState(true);
  const [statusValue, setStatusValue] = useState('');
  const [expiryValue, setExpiryValue] = useState('');

  const [complianceCollapse, setComplianceCollapse] = useState(true);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceKeyword, setComplianceKeyword] = useState('');
  const [complianceOptions, setComplianceOptions] = useState([]);
  const [complianceValue, setComplianceValue] = useState([]);

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedDate, setSelectedDate] = useState([null, null]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const {
    complianceActInfo,
  } = useSelector((state) => state.compliance);

  useEffect(() => {
    dispatch(getTypeId({
      statusValue: false, complianceValue: [], expiryValue: false,
    }));
    dispatch(resetComplianceReport());
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && complianceOpen) {
        await dispatch(getComplianceAct(companies, appModels.COMPLIANCEACT, complianceKeyword));
      }
    })();
  }, [userInfo, complianceKeyword, complianceOpen]);

  useEffect(() => {
    if (complianceActInfo && complianceActInfo.data && complianceActInfo.data.length && complianceOpen) {
      setComplianceOptions(getArrayFromValuesById(complianceActInfo.data, isAssociativeArray(complianceValue || []), 'id'));
    } else if (complianceActInfo && complianceActInfo.loading) {
      setComplianceOptions([{ name: 'Loading...' }]);
    } else {
      setComplianceOptions([]);
    }
  }, [complianceActInfo, complianceOpen]);

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && (statusValue || expiryValue || (complianceValue && complianceValue.length > 0))) {
      if (expiryValue === 'Custom' && selectedDate) {
        if (selectedDate && selectedDate.length > 0 && selectedDate[0] !== null) {
          const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, selectedDate[0], selectedDate[1])
          const start = dateRangeObj[0];
          const end = dateRangeObj[1];
          const dateArray = [start, end];
          const complianceValues = getColumnArrayById(complianceValue, 'id');
          dispatch(getComplianceReport(companies, appModels.BULIDINGCOMPLIANCE, statusValue, complianceValues, dateArray));
        }
      } else {
        const dateArray = getDatesOfQueryWithUtc(expiryValue);
        const complianceValues = getColumnArrayById(complianceValue, 'id');
        dispatch(getComplianceReport(companies, appModels.BULIDINGCOMPLIANCE, statusValue, complianceValues, dateArray));
      }
    }
  }, [userInfo, statusValue, complianceValue, expiryValue, selectedDate]);

  const showComplianceModal = () => {
    setModelValue(appModels.COMPLIANCEACT);
    setFieldName('compliance_act');
    setModalName('Compliance');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name']);
  };

  const onComplianceChange = (data) => {
    dispatch(resetComplianceReport());
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setComplianceValue(data);
    dispatch(getTypeId({
      statusValue, complianceValue: data, expiryValue,
    }));
  };

  const onComplianceClear = () => {
    setComplianceKeyword('');
    setComplianceValue([]);
    dispatch(getTypeId({
      statusValue, complianceValue: [], expiryValue,
    }));
    setComplianceOpen(false);
  };

  const onComplianceChangeModal = (data) => {
    dispatch(resetComplianceReport());
    setComplianceValue(data);
    dispatch(getTypeId({
      statusValue, complianceValue: data, expiryValue,
    }));
  };

  const handleStatusCheckboxChange = (event) => {
    dispatch(resetComplianceReport());
    setStatusValue(event.target.value);
    dispatch(getTypeId({
      statusValue: event.target.value, complianceValue: expiryValue,
    }));
  };

  const handleExpiryCheckboxChange = (event) => {
    setSelectedDate([null, null]);
    dispatch(resetComplianceReport());
    // const dateArray = getDatesOfQuery(event.target.value);
    setExpiryValue(event.target.value);
    dispatch(getTypeId({
      statusValue, complianceValue, expiryValue: event.target.value,
    }));
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setStatusValue('');
    setExpiryValue('');
    setComplianceValue([]);
    dispatch(resetComplianceReport());
    dispatch(getTypeId({
      statusValue: '', complianceValue: [], expiryValue: '',
    }));
  };

  const onDateRangeChange = (dates) => {
    setSelectedDate(dates);
  };

  return (
    <>
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY STATUS</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setStatusCollapse(!statusCollapse); }} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={statusCollapse}>
        <div>
          {complianceActions.stateTypes.map((tp, index) => (
            <span className="mb-1 d-block font-weight-500" key={tp.value}>
              <div className="checkbox">
                <Input
                  type="checkbox"
                  id={`checkboxvalidaction${index}`}
                  value={tp.value}
                  name={tp.label}
                  checked={statusValue === tp.value}
                  onChange={handleStatusCheckboxChange}
                />
                <Label htmlFor={`checkboxvalidaction${index}`}>
                  <span className="ml-2">{tp.label}</span>
                </Label>
                {' '}
              </div>
            </span>
          ))}
        </div>
      </Collapse>
      <hr className="mt-2" />
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY COMPLIANCE ACT</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setComplianceCollapse(!complianceCollapse); }} size="sm" icon={complianceCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={complianceCollapse}>
        <div>
          <FormGroup>
            <Autocomplete
              multiple
              filterSelectedOptions
              limitTags={3}
              id="tags-filledcompliance"
              name="compliance"
              open={complianceOpen}
              size="small"
              onOpen={() => {
                setComplianceOpen(true);
                setComplianceKeyword('');
              }}
              onClose={() => {
                setComplianceOpen(false);
                setComplianceKeyword('');
              }}
              value={complianceValue}
              disableClearable={!(complianceValue.length)}
              onChange={(e, options) => onComplianceChange(options)}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={complianceOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  value={complianceKeyword}
                  className={((complianceValue && complianceValue.length > 0) || (complianceKeyword && complianceKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  onChange={(e) => setComplianceKeyword(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {complianceActInfo && complianceActInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((complianceValue && complianceValue.length > 0) || (complianceKeyword && complianceKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onComplianceClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showComplianceModal}
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
            {(complianceActInfo && complianceActInfo.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(complianceActInfo)}</FormFeedback>
            )}
          </FormGroup>
        </div>
      </Collapse>
      <hr className="mt-2" />
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY EXPIRY DATE</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setExpiryDateCollapse(!expiryDateCollapse); }} size="sm" icon={expiryDateCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={expiryDateCollapse}>
        <div>
          {complianceActions.expiryDateFilters.map((tp, index) => (
            <>
              <span className="mb-1 d-block font-weight-500" key={tp.value}>
                <div className="checkbox">
                  <Input
                    type="checkbox"
                    id={`checkboxexpiryaction${index}`}
                    value={tp.value}
                    name={tp.label}
                    checked={expiryValue === tp.value}
                    onChange={handleExpiryCheckboxChange}
                  />
                  <Label htmlFor={`checkboxexpiryaction${index}`}>
                    <span className="ml-2">{tp.label}</span>
                  </Label>
                  {' '}
                </div>
              </span>
              {tp.label === 'Custom' && expiryValue === 'Custom' ? (
                <>
                  <RangePicker
                    onChange={onDateRangeChange}
                    value={selectedDate}
                    format="DD-MM-y"
                    size="small"
                    allowClear={false}
                    className="mt-1 mx-wd-220"
                  />
                </>
              ) : ''}
            </>
          ))}
        </div>
      </Collapse>
      <hr className="mt-2" />
      {(statusValue || (complianceValue && complianceValue.length > 0) || (expiryValue)) && (
      <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
      )}
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalSingle
            modelName={modelValue}
            modalName={modalName}
            afterReset={() => { setExtraMultipleModal(false); }}
            onComplianceChange={onComplianceChangeModal}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldValue={otherFieldValue}
            oldComplianceValues={complianceValue}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default SideFilterCompliance;
