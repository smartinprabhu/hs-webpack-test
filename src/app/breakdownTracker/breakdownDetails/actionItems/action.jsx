/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker } from 'antd';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col, Input,
  Label, Modal,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import DOMPurify from 'dompurify';
// import survey from '@images/icons/surveyAction.svg';
import { faCheckCircle, faStoreAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import trackerIcon from '@images/icons/breakTrackerBlue.svg';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  updatePartsOrderNoLoad,
} from '../../../workorders/workorderService';
import { onDocumentCreatesAttach, resetImage } from '../../../helpdesk/ticketService';
import {
  getAttachmentCategoryList, resetImageService, resetImageRAC,
  getTrackerDetail, getTrackerList,
} from '../../breakdownService';
import {
  getCompanyTimezoneDate, getDateTimeSeconds, getDefaultNoValue, getDateTimeUtc,
  getAllCompanies, queryGeneratorWithUtc,
} from '../../../util/appUtils';
import Images from './images';
import RcaImages from './rcaimages';
import ServiceImages from './serviceImages';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const faIcons = {
  Draft: faStoreAlt,
  Published: faCheckCircle,
  Closed: faTimesCircle,
};

const ActionSurvey = (props) => {
  const {
    details, actionModal, actionId, actionValue, atFinish,
    offset,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [messageTicket, setMessageTicket] = useState('');
  const [closedOnDate, setClosedOnDate] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);
  const {
    uploadPhotoService, uploadPhotoRca,
    trackerFilters,
  } = useSelector((state) => state.breakdowntracker);
  const { updatePartsOrderNoLoadInfo } = useSelector((state) => state.workorder);
  const viewData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const companies = getAllCompanies(userInfo, userRoles);

  const toggle = () => {
    setModal(!modal);
    dispatch(getTrackerDetail(viewData.id, appModels.BREAKDOWNTRACKER));
    const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
    dispatch(getTrackerList(companies, appModels.BREAKDOWNTRACKER, 10, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    atFinish();
  };

  const toggle1 = () => {
    setModal(!modal);
    atFinish();
  };

  useEffect(() => {
    if (actionValue === 'Closed') {
      dispatch(resetImage());
      dispatch(resetImageService());
      dispatch(resetImageRAC());
      dispatch(getAttachmentCategoryList(false, appModels.ATTTACHMENTCATEG));
    }
  }, [actionValue]);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const onDateChange = (e) => {
    setClosedOnDate(e);
  };

  function prepareDocuments(array, id) {
    const result = [];
    for (let i = 0; i < array.length; i += 1) {
      const values = {
        datas: array[i].datas,
        database64: array[i].database64,
        datas_fname: array[i].datas_fname,
        name: array[i].name,
        company_id: array[i].company_id,
        res_model: array[i].res_model,
        res_id: id,
      };
      if (array[i].ir_attachment_categ) {
        values.ir_attachment_categ = array[i].ir_attachment_categ;
      }
      result.push(values);
    }
    return result; // return column data..
  }

  function updateDocuments(id) {
    if (((uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0)
      || (uploadPhotoService && uploadPhotoService.length && uploadPhotoService.length > 0) || (uploadPhotoRca && uploadPhotoRca.length && uploadPhotoRca.length > 0)) && id) {
      const uploadPhoto1 = uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 ? uploadPhoto : [];
      const uploadPhoto2 = uploadPhotoService && uploadPhotoService.length && uploadPhotoService.length > 0 ? uploadPhotoService : [];
      const uploadPhoto3 = uploadPhotoRca && uploadPhotoRca.length && uploadPhotoRca.length > 0 ? uploadPhotoRca : [];
      const newArr = [...uploadPhoto1, ...uploadPhoto2];
      const newArrFinal = [...uploadPhoto3, ...newArr];
      const dcreate = prepareDocuments(newArrFinal, id);
      dispatch(onDocumentCreatesAttach(dcreate));
    }
  }

  function checkDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtc(data);
    }
    return result;
  }

  const handleStateChange = (id, status) => {
    if ((uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0)
      || (uploadPhotoService && uploadPhotoService.length && uploadPhotoService.length > 0) || (uploadPhotoRca && uploadPhotoRca.length && uploadPhotoRca.length > 0)) {
      updateDocuments(id);
      dispatch(resetImage());
      dispatch(resetImageService());
      dispatch(resetImageRAC());
    }
    let values = { state_id: status };
    if (messageTicket && messageTicket !== '') {
      let closedDate = closedOnDate || new Date();
      if (checkDatehasObject(closedDate)) {
        closedDate = getDateTimeUtc(closedDate);
      }
      values = {
        action_taken: DOMPurify.sanitize(messageTicket),
        closed_on: closedDate,
        state_id: status,
      };
    }
    dispatch(updatePartsOrderNoLoad(id, values, appModels.BREAKDOWNTRACKER));
  };
  function getDifferece(date2) {
    const date1 = new Date();
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  function disableDateday(current) {
    let disable = false;
    const startDate = viewData.incident_date;
    const endDate = new Date();
    if (startDate && endDate) {
      disable = current && (current < moment(startDate).subtract(1, 'day').endOf('day') || current > moment(endDate));
    }
    return disable;
  }

  const range = (min, max) => [...Array(max - min + 1).keys()].map((i) => i + min);

  function getDisabledHours() {
    let result = [];
    if (viewData.incident_date) {
      const start = 0;
      const defaultTz = 'Asia/Kolkata';
      const tZone = userInfo.timezone ? userInfo.timezone : defaultTz;
      const end = moment.utc(viewData.incident_date).local().tz(tZone).format('HH');
      console.log(end);
      if (end && end > start) {
        result = range(start, end);
      }
    }
    return result;
  }

  function disabledTime(current) {
    const defaultTz = 'Asia/Kolkata';
    const tZone = userInfo.timezone ? userInfo.timezone : defaultTz;
    const startDate = moment.utc(viewData.incident_date).local().tz(tZone);
    if (startDate && moment(startDate).isSame(current, 'day')) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            hours.push(i);
          }
          return hours.filter((hour) => hour < moment(startDate).hour());
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            minutes.push(i);
          }
          if (selectedHour === moment(startDate).hour()) {
            return minutes.filter((minute) => minute < moment(startDate).minute());
          }
          return [];
        },
        disabledSeconds: (selectedHour, selectedMinute) => {
          const seconds = [];
          for (let i = 0; i < 60; i++) {
            seconds.push(i);
          }
          if (selectedHour === moment(startDate).hour() && selectedMinute === moment(startDate).minute()) {
            return seconds.filter((second) => second < moment(startDate).second());
          }
          return [];
        },
      };
    }
  }

  function disabledRangeTime() {
    return {
      disabledHours: () => getDisabledHours(),
    };
  }

  console.log(closedOnDate);

  const loading = (details && details.loading) || (updatePartsOrderNoLoadInfo && updatePartsOrderNoLoadInfo.loading);

  const closedStateCondition = (!closedOnDate || (messageTicket === '') || (uploadPhotoService && uploadPhotoService.length && uploadPhotoService.length <= 0) || (Object.keys(uploadPhotoService).length === 0));

  return (
    <Modal size={actionValue === 'Closed' ? 'lg' : 'md'} className="border-radius-50px modal-dialog-centered" isOpen={actionModal}>
      <ModalHeaderComponent
        fontAwesomeIcon={actionValue === 'Published' ? faIcons.Published : faIcons[actionValue]}
        closeModalWindow={toggle1}
        title={actionValue === 'Closed' ? 'Close' : actionValue}
        response={updatePartsOrderNoLoadInfo}
      />
      <ModalBody>
        <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {details && (details.data && details.data.length > 0) && (
            <CardBody data-testid="success-case" className="bg-lightblue p-3">
              <Row>
                <Col md="2" xs="2" sm="2" lg="2">
                  <img src={trackerIcon} alt="asset" className="mt-1" width="50" height="45" />
                </Col>
                <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                  <Row>
                    <h6 className="mb-1">
                      {getDefaultNoValue(viewData.name)}
                    </h6>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Type :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(viewData.type)}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Created On :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(getCompanyTimezoneDate(viewData.create_date, userInfo, 'datetime'))}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          )}
        </Card>
        {(updatePartsOrderNoLoadInfo && !updatePartsOrderNoLoadInfo.data) && (
          actionValue === 'Closed' && (
            <Row className="m-2">
              <Col xs={12} sm={10} md={6} lg={6}>
                <Label>
                  Closed On
                  {' '}
                  <span className="ml-1 text-danger">*</span>
                </Label>
                <DatePicker
                  format="DD/MM/YYYY HH:mm"
                  defaultValue={viewData.closed_on ? moment(new Date(getDateTimeSeconds(viewData.closed_on)), 'DD/MM/YYYY HH:mm') : moment(new Date(), 'DD/MM/YYYY HH:mm')}
                  className="w-100"
                  disabledDate={disableDateday}
                  disabledTime={disabledTime}
                  showNow={false}
                  onChange={(e) => onDateChange(e)}
                  showTime={{ format: 'HH:mm' }}
                />
                <Label className="mt-3">
                  Action Taken
                  {' '}
                  <span className="ml-1 text-danger">*</span>
                </Label>
                <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" />
                {!messageTicket && (<span className="text-danger ml-1">Action taken required</span>)}
              </Col>

              <Col xs={12} sm={12} md={6} lg={6}>
                <ServiceImages editId={viewData.id} />
                <RcaImages editId={viewData.id} />
                <Images editId={viewData.id} />
              </Col>
            </Row>
          )
        )}
        <Row className="justify-content-center">
          {updatePartsOrderNoLoadInfo && updatePartsOrderNoLoadInfo.data && !loading && (
            <SuccessAndErrorFormat response={updatePartsOrderNoLoadInfo} successMessage={`This breakdown tracker has been ${actionValue} successfully..`} />
          )}
          {updatePartsOrderNoLoadInfo && updatePartsOrderNoLoadInfo.err && (
            <SuccessAndErrorFormat response={updatePartsOrderNoLoadInfo} />
          )}
          {loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {updatePartsOrderNoLoadInfo && updatePartsOrderNoLoadInfo.data
          ? ''
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              disabled={(actionValue === 'Closed') ? closedStateCondition : loading}
              className="mr-1"
              onClick={() => handleStateChange(viewData.id, actionId)}
            >
              {actionValue === 'Closed' ? 'Close' : actionValue}
            </Button>
          )}
        {(updatePartsOrderNoLoadInfo && updatePartsOrderNoLoadInfo.data
          && (
            <Button
              type="button"
              size="sm"
              disabled={loading}
               variant="contained"
              className="mr-1"
              onClick={toggle}
            >
              Ok
            </Button>
          )
        )}
      </ModalFooter>
    </Modal>
  );
};

ActionSurvey.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionId: PropTypes.string.isRequired,
  actionValue: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
};

export default ActionSurvey;
