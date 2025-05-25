/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Input,
} from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
  Dialog,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import workOrdersBlue from '@images/icons/workOrders.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import { createCancelReq, getHxPPMCancelDetails } from './ppmService';
import {
  getAllowedCompanies,
  getColumnArrayById,
  getDateLocalMuI,
} from '../util/appUtils';
import DialogHeader from '../commonComponents/dialogHeader';
import { getAssetPPMSchdules } from '../inspectionSchedule/inspectionService';
import RelatedSchedules from '../inspectionSchedule/viewer/relatedPPMSchedules';
import SpaceSelection from '../inspectionSchedule/viewer/spaceSelection';
import EquipmentsSelection from '../commonComponents/equipmentsSelection';

dayjs.extend(isoWeek);
const appModels = require('../util/appModels').default;

const PPMCancelRequestBulk = ({
  afterReset, closeModal, setViewId, setViewModal,
}) => {
  const dispatch = useDispatch();

  const [typeSelected, setType] = React.useState('all');

  const [assetType, setAssetType] = React.useState('Equipment');
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const [messageTicket, setMessageTicket] = useState('');

  const [multipleModal, setMultipleModal] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);

  const [equipments, setEquipments] = useState([]);
  const [spaces, setSpaces] = useState([]);

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const [trigger, setTrigger] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [parentSchedules, setParentSchedules] = useState([]);
  const [showRelatedSchedules, setShowRelatedSchedules] = useState(false);
  const [assetFilterModal, setAssetFilterModal] = useState(false);
  const [spaceFilterModal, setSpaceFilterModal] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target?.value?.trimStart() || '');
  };

  const { hxCreatePpmCancelRequest, hxPpmCancelDetails } = useSelector((state) => state.ppm);
  const { ppmAssetsSchedules } = useSelector((state) => state.inspection);
  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const configData = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const addDays = (days, date) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  useEffect(() => {
    setCheckRows([]);
    setParentSchedules([]);
    const startWeek = dayjs().startOf('isoWeek').format('YYYY-MM-DD');
    const endWeek = dayjs(addDays(365, new Date())).startOf('isoWeek').format('YYYY-MM-DD');
    if (assetType === 'Space' && spaces && spaces.length > 0) {
      dispatch(getAssetPPMSchdules(companies, 'ppm.scheduler_week', assetType, getColumnArrayById(spaces, 'id'), false, startWeek, endWeek));
    } else if (equipments && equipments.length && assetType === 'Equipment') {
      dispatch(getAssetPPMSchdules(companies, 'ppm.scheduler_week', assetType, getColumnArrayById(equipments, 'id'), false, startWeek, endWeek));
    }
  }, [assetType, trigger]);

  useEffect(() => {
    if (hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && hxCreatePpmCancelRequest.data.length) {
      dispatch(getHxPPMCancelDetails(hxCreatePpmCancelRequest.data[0], appModels.HXPPMCANCEL, 'ppm.scheduler_week', 'view'));
    }
  }, [hxCreatePpmCancelRequest]);

  useEffect(() => {
    if (ppmAssetsSchedules && ppmAssetsSchedules.data && ppmAssetsSchedules.data.length && ppmAssetsSchedules.data[0].starts_on) {
      if (typeSelected !== 'current') {
        setCheckRows(ppmAssetsSchedules.data);
        setParentSchedules(ppmAssetsSchedules.data);
      } else {
        setCheckRows([]);
        setParentSchedules([]);
      }
    } else {
      setCheckRows([]);
      setParentSchedules([]);
    }
  }, [ppmAssetsSchedules]);

  const toggle = () => {
    // atFinish();
  };

  const handleTypeChange = (event) => {
    setAssetType(event.target.value);
    setEquipments([]);
    setSpaces([]);
    setCheckRows([]);
    setParentSchedules([]);
  };

  const onEquipmentDelete = (id) => {
    setEquipments((prev) => prev.filter((r) => r.id !== id));
    setTrigger(Math.random());
  };

  const onSpaceDelete = (id) => {
    setSpaces((prev) => prev.filter((r) => r.id !== id));
    setTrigger(Math.random());
  };

  const onFetchAssetSchedules = () => {
    setAssetFilterModal(false);
    setTrigger(Math.random());
  };

  const onAssetModalChange = (data) => {
    if (data && data.length) {
      const newData = data.filter((item) => item.name);
      // const allData = [...newData, ...equipments];
      const newData1 = [...new Map(newData.map((item) => [item.id, item])).values()];
      setEquipments(newData1);
    //  setTrigger(Math.random());
    } else {
      setEquipments([]);
    }
  };

  const onSpaceModalChange = (data) => {
    /* const newData = data.filter((item) => item.space_name);
    const allData = [...newData, ...spaces];
    const newData1 = [...new Map(allData.map((item) => [item.id, item])).values()]; */
    setSpaceFilterModal(false);
    setSpaces(data);
    setTrigger(Math.random());
  };

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateLocalMuI(data);
    } else {
      result = moment(data).format('YYYY-MM-DD');
    }
    return result;
  }

  const handleStateChange = async () => {
    try {
      setIsOpenSuccessAndErrorModalWindow(true);
      let postData = {};
      if (configData && configData.approval_required_for_cancel) {
        postData = {
          requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          reason: messageTicket,
          requested_by_id: userInfo && userInfo.data && userInfo.data.id,
          state: 'Pending',
          cancel_approval_authority: configData && configData.cancel_approval_authority && configData.cancel_approval_authority.id ? configData.cancel_approval_authority.id : false,
          ppm_scheduler_ids: [[6, 0, getColumnArrayById(checkedRows, 'id')]],
          expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
        };
      } else {
        postData = {
          requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          reason: messageTicket,
          requested_by_id: userInfo && userInfo.data && userInfo.data.id,
          state: 'Approved',
          approved_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          approved_by_id: userInfo && userInfo.data && userInfo.data.id,
          ppm_scheduler_ids: [[6, 0, getColumnArrayById(checkedRows, 'id')]],
          expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
        };
      }
      const payload = { model: 'ppm.scheduler_cancel', values: postData };
      dispatch(createCancelReq('ppm.scheduler_cancel', payload));
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
      // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  const onLoadRequest = (eid, ename) => {
    if (setViewId && setViewModal) {
      setViewId(hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && hxCreatePpmCancelRequest.data.length && hxCreatePpmCancelRequest.data[0]);
      setViewModal(true);
      closeModal();
    }
    if (hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.err) {
      if (afterReset) afterReset();
    }
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const closeAddMaintenance = () => {
    if (hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.err) {
      closeModal();
    }
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const getFiledData = (data) => getColumnArrayById(data, 'id');

  const loading = hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.loading;

  const isDisabled = !((typeSelected === 'all' && messageTicket && checkedRows.length && ((assetType === 'Space' && spaces && spaces.length > 0) || (assetType === 'Equipment' && equipments && equipments.length > 0))));

  return (

    <Box
      sx={{
        padding: '0px 0px 0px 20px',
        width: '100%',
        maxHeight: '100vh',
        overflow: 'auto',
        marginBottom: '70px',
      }}
    >

      <>

        <Row className="ml-2 mr-2 mt-0">
          <Col xs={12} sm={12} md={12} lg={12} className="mt-3 col-auto">
            <FormControl className="font-family-tab">
              <FormLabel id="demo-row-radio-buttons-group-label" className="font-family-tab font-tiny">Type</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={assetType}
                onChange={handleTypeChange}
              >
                <FormControlLabel className="font-family-tab" value="Equipment" control={<Radio />} label="Equipment" />
                <FormControlLabel className="font-family-tab" value="Space" control={<Radio />} label="Space" />
              </RadioGroup>
            </FormControl>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="mt-0 mb-1 col-auto">
            <p className="font-tiny font-family-tab">
              Click the &#39;Select
              {' '}
              {assetType === 'Equipment' ? 'Equipment' : 'Spaces'}
              &#39; button to select
              {' '}
              {assetType === 'Equipment' ? 'equipment' : 'spaces'}
              {' '}
              and view their ppm schedules.
            </p>
          </Col>
        </Row>

        <div className="pl-4 pr-3 mb-2">
          {assetType === 'Equipment' && (
          <>
            <Button
              type="button"
              variant="contained"
              size="small"
              disabled={ppmAssetsSchedules && ppmAssetsSchedules.loading}
              onClick={() => setAssetFilterModal(true)}
            >
              Select Equipment
            </Button>
            {equipments && equipments.length > 0 && (
            <>
              <p className="font-family-tab mt-3 ">
                Selected Equipment:
                {' '}
                {equipments.length}
              </p>
              <Stack className="mb-3" direction="row" flexWrap="wrap">
                {equipments.map((row) => (
                  <Chip
                    key={row.id}
                    label={row.name} // or row.equipmentName or whatever field represents it
                    onDelete={() => onEquipmentDelete(row.id)}
                    className="mb-3 mr-3"
                  />
                ))}
              </Stack>
            </>
            )}
            {assetFilterModal && (
            <EquipmentsSelection
              onAssetModalChange={onAssetModalChange}
              filterModal={assetFilterModal}
              setEquipments={setEquipments}
              equipments={equipments}
              finishText="Get Schedules"
              onClose={onFetchAssetSchedules}
              onCancel={() => setAssetFilterModal(false)}
            />
            )}
          </>
          )}
          {assetType === 'Space' && (

            <>
              <Button
                type="button"
                variant="contained"
                size="small"
                disabled={ppmAssetsSchedules && ppmAssetsSchedules.loading}
                onClick={() => setSpaceFilterModal(true)}
              >
                Select Spaces
              </Button>
              {spaces && spaces.length > 0 && (
              <>
                <p className="font-family-tab mt-3 ">
                  Selected Spaces:
                  {' '}
                  {spaces.length}
                </p>
                <Stack className="mb-3" direction="row" flexWrap="wrap">
                  {spaces.map((row) => (
                    <Chip
                      key={row.id}
                      label={row.space_name} // or row.equipmentName or whatever field represents it
                      onDelete={() => onSpaceDelete(row.id)}
                      className="mb-3 mr-3"
                    />
                  ))}
                </Stack>
              </>
              )}
              {spaceFilterModal && (
              <SpaceSelection
                filterModal={spaceFilterModal}
                spaces={spaces && spaces.length > 0 ? spaces : []}
                setSpaces={onSpaceModalChange}
                onCancel={() => setSpaceFilterModal(false)}
              />
              )}
            </>

          )}
          {(spaces.length > 0 || equipments.length > 0) && ppmAssetsSchedules && !ppmAssetsSchedules.loading && ppmAssetsSchedules.data && (
            <p
              className={`mb-1 font-family-tab font-14 ${parentSchedules && parentSchedules.length > 0 ? 'text-info cursor-pointer' : ''}`}
              onClick={() => setShowRelatedSchedules(!!(parentSchedules && parentSchedules.length > 0))}
            >
              View All Schedules of the Selected Assets (Selected Schedules:
              {' '}
              {checkedRows.length}
              )
            </p>
          )}
          {ppmAssetsSchedules && ppmAssetsSchedules.loading && (
            <Loader />
          )}
          <Dialog size="lg" fullWidth open={showRelatedSchedules}>
            <DialogHeader title="View All the Schedules of the Selected Assets" onClose={() => { setShowRelatedSchedules(false); }} />
            <RelatedSchedules
              typeSelected={typeSelected}
              setEvents={setCheckRows}
              selectedSchedules={checkedRows && checkedRows.length > 0 ? checkedRows : []}
              events={parentSchedules && parentSchedules.length > 0 ? parentSchedules : []}
              onClose={() => { setShowRelatedSchedules(false); }}
            />
          </Dialog>

        </div>
        {checkedRows && checkedRows.length > 0 && (
        <div className="pl-4 pr-3">

          <Row className="mt-0">

            <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
              <FormLabel id="demo-row-radio-buttons-group-label" className="font-family-tab font-tiny">
                Reason
                {' '}
                <span className="ml-1 text-danger font-weight-800"> * </span>
              </FormLabel>
              <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
            </Col>
          </Row>
        </div>
        )}
      </>

      <Row className="justify-content-center font-family-tab w-100">
        {configData && configData.approval_required_for_cancel && hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.data && !loading && (
        <SuccessAndErrorFormat response={false} staticInfoMessage="Cancellation of PPM requires approval." />
        )}
        {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.err && (
        <SuccessAndErrorFormat response={hxCreatePpmCancelRequest} />
        )}
      </Row>

      <div className="float-right sticky-button-90drawer z-Index-1099">
        {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || isDisabled}
              onClick={() => handleStateChange()}
            >
              {configData && configData.approval_required_for_cancel ? 'Request' : 'Create'}
            </Button>
          )}
        {(hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data
          && (
            <Button
              type="button"
              size="sm"
              disabled={loading}
              variant="contained"
              className="submit-btn"
              onClick={toggle}
            >
              Ok
            </Button>
          )
        )}
      </div>
      <SuccessAndErrorModalWindow
        isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
        setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
        type="create"
        newId={hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && hxPpmCancelDetails && hxPpmCancelDetails.data && hxPpmCancelDetails.data.length > 0 ? hxPpmCancelDetails.data[0].id : false}
        newName={hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && hxPpmCancelDetails && hxPpmCancelDetails.data && hxPpmCancelDetails.data.length > 0 && hxPpmCancelDetails.data[0].requested_by_id.name ? 'Request' : false}
        successOrErrorData={hxCreatePpmCancelRequest}
        headerImage={workOrdersBlue}
        headerText="Cancellation Request"
        onLoadRequest={onLoadRequest}
        successRedirect={closeAddMaintenance}
        response={hxCreatePpmCancelRequest}
      />
    </Box>
  );
};

export default PPMCancelRequestBulk;
