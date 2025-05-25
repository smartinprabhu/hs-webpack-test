/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import MultipleDataAccordian from '../../commonComponents/multipleFormFields/multipleDataAccordian';
import checkoutFormModel from '../formModel/checkoutFormModel';
import BasicForm from './RequestorForm';
import MaintenanceForm from './maintenanceForm';
import ScheduleForm from './scheduleForm';
import ScheduleSubForm from './scheduleSubForm';
import { useWizardState } from '../../commonComponents/ReactFormWizard/wizard/WizardRoot';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const CreateInspection = (props) => {
  const {
    setInspectionData,
    inspectionData,
    onNext,
    setTeamData,
    teamData,
    setCommenceOn,
    commenceOn,
  } = props;
  const history = useHistory();
  const { wizardState, setWizardState } = useWizardState();
  const [partsAdd, setPartsAdd] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const loadEmptyTd = () => {
    const newData = inspectionData && inspectionData.length ? inspectionData : [];
    newData.push({
      id: false,
      duration: { value: '01:00', label: '01:00' },
      min_duration: '',
      max_duration: '',
      is_enable_time_tracking: 0,
      starts_at: '',
      mo: 0,
      tu: 0,
      we: 0,
      th: 0,
      fr: 0,
      sa: 0,
      su: 0,
      at_start_mro: 0,
      at_done_mro: 0,
      at_review_mro: 0,
      enforce_time: true,
      is_allow_future: 0,
      is_allow_past: 0,
      nfc_scan_at_start: 0,
      nfc_scan_at_done: 0,
      qr_scan_at_start: 0,
      qr_scan_at_done: 0,
      is_exclude_holidays: 0,
      is_missed_alert: 0,
      ends_on: null,
      description: '',
      company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '',
    });
    setInspectionData(newData);
    setPartsAdd(Math.random());
  };

  useEffect(() => {
    console.log(inspectionData);
    if (inspectionData && inspectionData.length === 0) { loadEmptyTd(); }
  }, []);

  useEffect(() => {
    if (partsAdd) {
      onNext();
      setInspectionData(inspectionData);
    }
  }, [partsAdd]);

  useEffect(() => {
      onNext();
      setTeamData(teamData);
      setCommenceOn(commenceOn);
  }, [teamData, commenceOn]);

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 mr-0 ml-0">

      <Col xs={12} sm={12} lg={12} md={12} className="mt-2">
        <MaintenanceForm
          setTeamData={setTeamData} teamData={teamData}
          setCommenceOn={setCommenceOn} commenceOn={commenceOn}
        />
      </Col>
      {/* <Col xs={12} sm={12} lg={12} md={12} className="mt-2">
        <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer float-right mt-4 mb-1" onClick={loadEmptyTd}>
          <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
          <span className="mr-5">Add Inspection Schedule</span>
        </div>
      </Col> */}
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="">
          {(inspectionData && inspectionData.length > 0 && inspectionData.map((formData, index) => (
            !formData.isRemove && (
            <MultipleDataAccordian
              className="mt-3 mb-3"
              indexForm={index}
              //defaultExpanded={`panel${index}`}
              isTextButton
              summarySx={{
                '.MuiAccordionSummary-expandIconWrapper': {
                  transform: 'none !important', // Disable transform (rotation)
                },
              }}
              summary={(
                <BasicForm
                  index={index}
                  formField={formField}
                  formData={formData}
                  setPartsAdd={setPartsAdd}
                  partsAdd={partsAdd}
                  setFieldValue={setInspectionData}
                  setPartsData={setInspectionData} partsData={inspectionData}
                />
)}
              detail={[
                {
                  id: 1,
                  component: <ScheduleSubForm
                    index={index}
                    formField={formField}
                    formData={formData}
                    setPartsAdd={setPartsAdd}
                    partsAdd={partsAdd}
                    setFieldValue={setInspectionData}
                    setPartsData={setInspectionData} partsData={inspectionData}
                  />,
                },
                {
                  id: 2,
                  component: <ScheduleForm
                    index={index}
                    formField={formField}
                    formData={formData}
                    setPartsAdd={setPartsAdd}
                    partsAdd={partsAdd}
                    setFieldValue={setInspectionData}
                    setPartsData={setInspectionData} partsData={inspectionData}
                  />,
                },
              ]}
            />
            )
          )))}
        </div>
      </Col>
    </Row>
  );
};

CreateInspection.defaultProps = {
  spaceId: false,
  pathName: false,
  isTheme: false,
  ischecklist: false,
  isAdmin: false,
  isGlobalITAsset: false,
  categoryType: false,
};

CreateInspection.propTypes = {
  afterReset: PropTypes.func.isRequired,
  spaceId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  isModal: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  pathName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  ischecklist: PropTypes.bool,
  isGlobalITAsset: PropTypes.bool,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default CreateInspection;
