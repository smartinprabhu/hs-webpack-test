/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  TextField, CircularProgress, Typography,  
  Dialog,
  DialogContent, DialogContentText,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row,
} from 'reactstrap';
import {
  getIncReportA, getIncReportB,
} from '../../../siteService';
import {
  getAllCompanies, extractOptionsObject, generateErrorMessage,
} from '../../../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import { AddThemeColor } from '../../../../themes/theme';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const IncidentSettingBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      IncidentReportPartA,
      IncidentReportPartB,
    },
  } = props;
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    incident_report_part_a_id, incident_report_part_b_id,
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

  const [incRepBOpen, setIncRepBOpen] = useState(false);
  const [incRepBKeyword, setIncRepBKeyword] = useState('');

  const [incRepAOpen, setIncRepAOpen] = useState(false);
  const [incRepAKeyword, setIncRepAKeyword] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const {
    siteDetails, incRepBInfoList, incRepAInfoList,
  } = useSelector((state) => state.site);

  const companies = getAllCompanies(userInfo);
  const companiesSiteSpecific = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllCompanies(userInfo);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getIncReportB(companies, appModels.TASK, incRepBKeyword));
      }
    })();
  }, [incRepBOpen, incRepBKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getIncReportA(companies, appModels.TASK, incRepAKeyword));
      }
    })();
  }, [incRepAOpen, incRepAKeyword]);

  const onIncRepBKeyWordChange = (event) => {
    setIncRepBKeyword(event.target.value);
  };

  const onIncRepAKeyWordChange = (event) => {
    setIncRepAKeyword(event.target.value);
  };

  const onKeywordBClear = () => {
    setIncRepBKeyword(null);
    setFieldValue('incident_report_part_b_id', '');
    setIncRepBOpen(false);
  };

  const onKeywordAClear = () => {
    setIncRepAKeyword(null);
    setFieldValue('incident_report_part_a_id', '');
    setIncRepAOpen(false);
  };

  const showRequestorBModal = () => {
    setModelValue(appModels.TASK);
    setFieldName('incident_report_part_b_id');
    setModalName('Report B List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const showRequestorAModal = () => {
    setModelValue(appModels.TASK);
    setFieldName('incident_report_part_a_id');
    setModalName('Report A List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const incRepBOptions = extractOptionsObject(incRepBInfoList, incident_report_part_b_id);
  const incRepAOptions = extractOptionsObject(incRepAInfoList, incident_report_part_a_id);

  return (
    <Row className="mb-1 requestorForm-input">
      <Col xs={12} sm={12} lg={12} md={12}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          Incident Management Settings
        </Typography>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6}>
        <MuiAutoComplete
          name={IncidentReportPartA.name}
          label={IncidentReportPartA.label}
          formGroupClassName="m-1"
          oldValue={getOldData(incident_report_part_a_id)}
          value={incident_report_part_a_id && Object.keys(incident_report_part_a_id).length > 0 && incident_report_part_a_id.name ? incident_report_part_a_id.name : getOldData(incident_report_part_a_id)}
          apiError={(incRepAInfoList && incRepAInfoList.err && incRepAOpen) ? generateErrorMessage(incRepAInfoList) : false}
          open={incRepAOpen}
          size="small"
          onOpen={() => {
            setIncRepAOpen(true);
            setIncRepAKeyword('');
          }}
          onClose={() => {
            setIncRepAOpen(false);
            setIncRepAKeyword('');
          }}
          loading={incRepAInfoList && incRepAInfoList.loading && incRepAOpen}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={incRepAOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => { onIncRepAKeyWordChange(e.target.value); }}
              variant="standard"
              value={incRepAKeyword}
              label={IncidentReportPartA.label}
              className={((incident_report_part_a_id && incident_report_part_a_id.id) || (incRepAKeyword && incRepAKeyword.length > 0) || (incident_report_part_a_id && incident_report_part_a_id.length))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {incRepAInfoList && incRepAInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((incident_report_part_a_id && incident_report_part_a_id.id) || (incRepAKeyword && incRepAKeyword.length > 0) || (incident_report_part_a_id && incident_report_part_a_id.length)) && (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={onKeywordAClear}
                      >
                         <IoCloseOutline size={22} fontSize="small" />
                      </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showRequestorAModal}
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
      <Col xs={12} sm={6} lg={6} md={6}>
        <MuiAutoComplete
          name={IncidentReportPartB.name}
          label={IncidentReportPartB.label}
          formGroupClassName="m-1"
          oldValue={getOldData(incident_report_part_b_id)}
          value={incident_report_part_b_id && Object.keys(incident_report_part_b_id).length > 0 && incident_report_part_b_id.name ? incident_report_part_b_id.name : getOldData(incident_report_part_b_id)}
          apiError={(incRepBInfoList && incRepBInfoList.err && incRepBOpen) ? generateErrorMessage(incRepBInfoList) : false}
          open={incRepBOpen}
          size="small"
          onOpen={() => {
            setIncRepBOpen(true);
            setIncRepBKeyword('');
          }}
          onClose={() => {
            setIncRepBOpen(false);
            setIncRepBKeyword('');
          }}
          loading={incRepBInfoList && incRepBInfoList.loading && incRepBOpen}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={incRepBOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => { onIncRepBKeyWordChange(e.target.value); }}
              variant="standard"
              value={incRepBKeyword}
              label={IncidentReportPartB.label}
              className={((incident_report_part_b_id && incident_report_part_b_id.id) || (incRepBKeyword && incRepBKeyword.length > 0) || (incident_report_part_b_id && incident_report_part_b_id.length))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {incRepBInfoList && incRepBInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((incident_report_part_b_id && incident_report_part_b_id.id) || (incRepBKeyword && incRepBKeyword.length > 0) || (incident_report_part_b_id && incident_report_part_b_id.length)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onKeywordBClear}
                        >
                           <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showRequestorBModal}
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
      {/* <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalMultiple
            modelName={modelValue}
            afterReset={() => { setExtraMultipleModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            setCheckedRows={setCheckRows}
            olCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
            // oldRecipientsData={incReportALocationId && incReportALocationId.length ? incReportALocationId : []}
          />
        </ModalBody>
        <ModalFooter>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                 variant="contained"
                onClick={() => { if (fieldName === 'incident_report_part_a_id') { setLocationIds(checkedRows); } }}
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </ModalFooter>
      </Modal> */}
    </Row>
  );
});

IncidentSettingBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default IncidentSettingBasicForm;
