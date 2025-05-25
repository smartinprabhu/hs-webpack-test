a/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import addIcon from '@images/icons/plusCircleGrey.svg';

import MultipleDataAccordian from '../../commonComponents/multipleFormFields/multipleDataAccordian';
import checkoutFormModel from '../formModel/checkoutFormModel52Week';
import BasicForm from './RequestorForm';
import { useWizardState } from '../../commonComponents/ReactFormWizard/wizard/WizardRoot';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const CreateInspection = (props) => {
  const {
    setPPMData,
    PPMData,
    onNext,
  } = props;
  const history = useHistory();
  const { wizardState, setWizardState } = useWizardState();
  // const [PPMData, setPPMData] = useState(wizardState?.PPMData || []);
  const [partsAdd, setPartsAdd] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const loadEmptyTd = () => {
    const newData = PPMData && PPMData.length ? PPMData : [];
    newData.push({
      id: 'math.Radom()',
      performed_by: {
        value: 'Internal',
        label: 'Internal',
      },
      starts_on: null,
      ends_on: null,
      duration: '',
      schedule_period_id: {
        value: 'Weekly',
        label: 'Weekly',
      },
      maintenance_team_id: '',
      maintenance_year_id: '',
      vendor_id: '',
      week: '',
      company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '',
    });
    setPPMData(newData);
    setPartsAdd(Math.random());
  };

  useEffect(() => {
    if (PPMData && PPMData.length === 0) {
      loadEmptyTd();
    }
  }, [PPMData]);

  useEffect(() => {
    if (partsAdd) {
      onNext();
      setPPMData(PPMData);
    }
  }, [partsAdd]);

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="createFormScrollbar">
          {(PPMData && PPMData.length > 0 && PPMData.map((formData, index) => (
            !formData.isRemove && (
              <BasicForm
                index={index}
                formField={formField}
                formData={formData}
                setPartsAdd={setPartsAdd}
                partsAdd={partsAdd}
                setFieldValue={setPPMData}
                setPartsData={setPPMData} partsData={PPMData}
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
