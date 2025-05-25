import {
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import {
  Col, Row,
  Table,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { infoValue } from '../../utils/utils';
import { } from '../../../themes/theme';
import StepWrapper from '../../../commonComponents/ReactFormWizard/steps/StepWrapper/StepWrapper';

import { useWizardState } from '../../../commonComponents/ReactFormWizard/wizard/WizardRoot';
import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const PreviewInspectionSchedule = () => {
  const { wizardState, setWizardState } = useWizardState();
  const { userRoles, userInfo } = useSelector((state) => state.user);
  const { modifiedData } = useSelector((state) => state.setup);

  useEffect(() => {
    const bulkJson = { ...wizardState?.bulkJson, ...{ currentStep: 3 } };
    setWizardState({ ...wizardState, ...bulkJson });
  }, []);

  useEffect(() => {
    if (modifiedData && Object.keys(modifiedData).length) {
      const bJson = modifiedData?.bulkJson;
      if (bJson) {
        bJson.currentStep = 3;
      }
    }
    setWizardState({ ...wizardState, ...modifiedData });
  }, [modifiedData]);

  const assetType = wizardState.type === 'ah' ? 'Space' : 'Equipment';
  const equipmentHead = ['Name', 'Space', 'Category'];
  const spaceHead = ['Name', 'Space', 'Category'];
  const tableHeaderSchedule = ['Starts At (Hours)', 'Duration (Hours)', 'Commences On', 'Maintenance Team'];
  const tableHeader = wizardState?.type === 'e' ? equipmentHead : spaceHead;

  return (
    <StepWrapper>
      <h6 className="mb-4">
        Preview of the scheduler
        <hr className="m-1" />
      </h6>
      <Row className="mb-3 ml-0 pl-0">
        <Col xs={12} sm={12} md={12} lg={3}>
          <Row className="m-0">
            <Typography
              sx={({
                font: 'normal normal medium 14px Suisse Intl',
                letterSpacing: '0.7px',
                fontWeight: 500,
                marginBottom: '10px',
                paddingBottom: '4px',
                color: '#6A6A6A',
              })}
            >
              Maintenance Type
              {infoValue('maintenance_type')}
            </Typography>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(wizardState?.typeValue?.id || '')}</span>
          </Row>
        </Col>
        <Col xs={12} sm={12} md={12} lg={3}>
          <Row className="m-0">
            <Typography
              sx={({
                font: 'normal normal medium 14px Suisse Intl',
                letterSpacing: '0.7px',
                fontWeight: 500,
                marginBottom: '10px',
                paddingBottom: '4px',
                color: '#6A6A6A',
              })}
            >
              Asset Type
              {infoValue('asset_type')}
            </Typography>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(assetType)}</span>
          </Row>
        </Col>
        <Col xs={12} sm={12} md={12} lg={3}>
          {wizardState.type === 'ah'
            ? (
              <>
                <Row className="m-0">
                  <Typography
                    sx={({
                      font: 'normal normal medium 14px Suisse Intl',
                      letterSpacing: '0.7px',
                      fontWeight: 500,
                      marginBottom: '10px',
                      paddingBottom: '4px',
                      color: '#6A6A6A',
                    })}
                  >
                    Space Category
                    {infoValue('categorySpace')}
                  </Typography>
                </Row>
                <Row className="m-0">
                  <span className="m-1 font-weight-500">{getDefaultNoValue(wizardState.category ? wizardState.category.name : '')}</span>
                </Row>
              </>
            )
            : (
              <>
                <Row className="m-0">
                  <Typography
                    sx={({
                      font: 'normal normal medium 14px Suisse Intl',
                      letterSpacing: '0.7px',
                      fontWeight: 500,
                      marginBottom: '10px',
                      paddingBottom: '4px',
                      color: '#6A6A6A',
                    })}
                  >
                    Equipment Category
                    {infoValue('categoryEquipment')}
                  </Typography>
                </Row>
                <Row className="m-0">
                  <span className="m-1 font-weight-500">{getDefaultNoValue(wizardState.category && wizardState.category.path_name ? wizardState.category.path_name : '')}</span>
                </Row>
              </>
            )}
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Row className="m-0 mt-2">
            <Typography
              sx={({
                font: 'normal normal medium 14px Suisse Intl',
                letterSpacing: '0.7px',
                fontWeight: 500,
                marginBottom: '10px',
                paddingBottom: '4px',
                color: '#6A6A6A',
              })}
            >
              {assetType}
              {' '}
              List
              {infoValue(wizardState.type === 'ah' ? 'space_list' : 'equipment_list')}
            </Typography>
          </Row>
          <Row className="m-0">
            <Table responsive className="border">
              <thead className="bg-lightblue">
                <tr>
                  {tableHeader.map((hd) => (
                    <th className="p-2 border-0">
                      {hd}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wizardState?.type === 'ah' && wizardState?.spaceValue && wizardState?.spaceValue.length > 0 && wizardState?.spaceValue.map((sp) => (
                  <tr key={sp.id}>
                    <td
                      aria-hidden="true"
                      className="w-20 p-2"
                    >
                      <span className="font-weight-400">{sp.space_name}</span>
                    </td>
                    <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{sp.path_name}</span></td>
                    <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{sp.asset_category_id ? sp.asset_category_id[1] : ''}</span></td>
                  </tr>
                ))}
                {wizardState?.type === 'e' && wizardState?.equipmentValue && wizardState?.equipmentValue.length > 0 && wizardState?.equipmentValue.map((sp) => (
                  <tr key={sp.id}>
                    <td
                      aria-hidden="true"
                      className="w-20 p-2"
                    >
                      <span className="font-weight-400">{sp.name}</span>
                    </td>
                    <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{sp.location_id ? sp.location_id[1] : ''}</span></td>
                    <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{sp.category_id ? sp.category_id[1] : ''}</span></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Typography
            sx={({
              font: 'normal normal medium 14px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 600,
              marginBottom: '10px',
              paddingBottom: '4px',
              color: '#6A6A6A',
            })}
          >
            {wizardState?.typeValue?.id}
            {' '}
            (These will be scheduled on
            {' '}
            {wizardState?.typeValue?.id === 'PPM' ? 'Weekly' : 'Daily'}
            {' '}
            basis)
            {infoValue('userName')}
          </Typography>
        </Col>
        {/* {wizardState?.typeValue?.id === 'Inspection' ? (
          <Col xs={12} sm={12} md={12} lg={12}>
            <Row className="m-0">
              <Table responsive className="w-100 border">
                <thead className="bg-lightblue">
                  <tr>
                    {tableHeaderSchedule.map((hd) => (
                      <th className="p-2 border-0">
                        {hd}
                        {infoValue('inspection')}
                      </th>
                    ))}
                    <th className="p-2 min-width-160 border-0">
                      <span className="invisible">Del</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {wizardState?.inspectionData && wizardState?.inspectionData.length > 0 && wizardState?.inspectionData.map((sp) => (
                    <tr key={sp.id}>
                      <td
                        aria-hidden="true"
                        className="p-2"
                      >
                        <span className="font-weight-400">{sp.starts_at}</span>
                      </td>
                      <td className="p-2"><span className="font-weight-400 d-inline-block">{sp.duration.value}</span></td>
                      <td className="p-2"><span className="font-weight-400 d-inline-block">{getCompanyTimezoneDate(sp.commences_on, userInfo, 'datetime')}</span></td>
                      <td className="p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(sp.maintenance_team_id && sp.maintenance_team_id.name ? sp.maintenance_team_id.name : '')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
          </Col>
        )
          : (
            <>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Row className="m-0">
                  <Table responsive>
                    <thead className="bg-lightblue">
                      <tr>
                        <td className="p-2 w-20 border-0">
                          Schedule period
                        </td>
                        <td className="p-2 min-width-200 border-0">
                          {getDefaultNoValue(wizardState.schedulePeriod ? wizardState.schedulePeriod.label : '')}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 w-20 border-0">
                          Exclude Days
                        </td>
                        <td className="p-2 min-width-200 border-0">{returnCheckIcon()}</td>
                      </tr>
                      <tr>
                        <td className="p-2 w-20  border-0">
                          Starts At
                        </td>
                        <td className="p-2 min-width-200  border-0">
                          {getDefaultNoValue(getCompanyTimezoneDate(wizardState?.startAt, userInfo, 'datetime'))}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 w-20  border-0">
                          Duration
                        </td>
                        <td className="p-2 min-width-200  border-0">
                          {getDefaultNoValue(wizardState?.PPMDuration || '')}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 w-20  border-0">
                          Repeat
                        </td>
                        <td className="p-2 min-width-200  border-0">
                          {getDefaultNoValue((wizardState?.repeatValue && wizardState?.repeatValue.label) || '')}
                        </td>
                      </tr>
                    </thead>
                    <tbody />
                  </Table>
                </Row>
              </Col>
              <hr className="m-1" />
            </>
          )} */}
        <Col xs={12} sm={12} md={12} lg={6}>
          <Row className="m-0">
            <Typography
              sx={({
                font: 'normal normal medium 14px Suisse Intl',
                letterSpacing: '0.7px',
                fontWeight: 500,
                marginBottom: '10px',
                paddingBottom: '4px',
                color: '#6A6A6A',
              })}
            >
              Maintenance Operation
              {infoValue('MaintenanceOperation')}
            </Typography>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(wizardState?.operation?.name || '')}</span>
          </Row>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6}>
          <Row className="m-0">
            <Typography
              sx={({
                font: 'normal normal medium 14px Suisse Intl',
                letterSpacing: '0.7px',
                fontWeight: 500,
                marginBottom: '10px',
                paddingBottom: '4px',
                color: '#6A6A6A',
              })}
            >
              Maintenance Checklist
              {infoValue('MaintenanceChecklist')}
            </Typography>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(wizardState?.checklistData?.name || '')}</span>
          </Row>
        </Col>
      </Row>
    </StepWrapper>
  );
};

export default PreviewInspectionSchedule;
