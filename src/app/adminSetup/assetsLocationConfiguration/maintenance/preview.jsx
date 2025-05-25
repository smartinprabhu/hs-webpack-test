import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import {
  
  Table,
} from 'reactstrap';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import { FaTimesCircle } from 'react-icons/fa';
import { AiFillCheckCircle } from 'react-icons/ai';
import { infoValue } from '../../utils/utils';
import StepWrapper from '../../../commonComponents/ReactFormWizard/steps/StepWrapper/StepWrapper';
import { AddThemeBackgroundColor, AddThemeColor } from '../../../themes/theme';
import DetailViewLeftPanel from '../../../commonComponents/detailViewLeftPanel';
import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
} from '../../../util/appUtils';
import {
  detailViewHeaderClass,
} from '../../../commonComponents/utils/util';
import { useWizardState } from '../../../commonComponents/ReactFormWizard/wizard/WizardRoot';

const PreviewInspectionSchedule = () => {
  const { wizardState, setWizardState } = useWizardState();
  const { userRoles, userInfo } = useSelector((state) => state.user);
  const { modifiedData } = useSelector((state) => state.setup);

  const returnCheckIcon = (showGreen, showText) => (
    <Box
      sx={{
        width: '50%',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '5px 0px 5px 0px',
        minHeight: '50px',
        fontSize: "14px",
      }}
    >
      <Typography>
        {showGreen ? (
          <AiFillCheckCircle
            size={15}
            cursor="pointer"
            className="mr-1"
            style={{ color: 'green' }}
          />
        ) : (
          <FaTimesCircle
            size={15}
            cursor="pointer"
            className="mr-1"
            style={{ color: 'red' }}
          />
        )}
        {showText}
      </Typography>
    </Box>
  );

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

  const getArrayToCommaValuesTime = (array, key) => {
    let ids = '';
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        ids += `${parseFloat((array[i][key])).toFixed(2)},`;
      }
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  };

  const assetType = wizardState.type === 'ah' ? 'Space' : 'Equipment';
  const inspectionData = wizardState?.inspectionData && wizardState?.inspectionData.length ? wizardState?.inspectionData[0] : false;
  const equipmentHead = ['Name', 'Path Name'];
  const spaceHead = ['Name', 'Path Name'];
  const tableHeader = wizardState?.type === 'e' ? equipmentHead : spaceHead;

  const assetList = (
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
  );

  return (
    <StepWrapper>
      <Box
        sx={AddThemeBackgroundColor({
          width: '100%',
          height: '30px',
          padding: '20px',
          display: 'flex',
          marginBottom: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
        })}
      // className={className}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              width: 'auto',
              alignItems: 'center',
              marginBottom: '5px',
            }}
          >
            <Typography
              sx={{
                font: 'normal normal normal 20px Suisse Intl',
                letterSpacing: '1.05px',
                color: '#FFFFFF',
              }}
            >
              Preview of the Scheduler -
              {' '}
              {getDefaultNoValue(wizardState?.typeValue?.id || '')}
            </Typography>
            <Typography
              sx={{
                font: 'normal normal normal 18px Suisse Intl',
                letterSpacing: '1.05px',
                color: '#FFFFFF',
              }}
            >
              (
              {' '}
              {getDefaultNoValue(assetType)}
              {' '}
              -
              {' '}
              {wizardState.type === 'ah'
                ? getDefaultNoValue(wizardState.category ? wizardState.category.name : '')
                : getDefaultNoValue(wizardState.category && wizardState.category.path_name ? wizardState.category.path_name : '')}
              {' '}
              )
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography
        sx={detailViewHeaderClass}
      >
        {assetType}
        {' '}
        List
      </Typography>
      {assetList}
      <DetailViewLeftPanel
        panelData={[
          // {
          //   header: 'Asset Information',
          //   leftSideData:
          //     [
          //       {
          //         property: 'Asset Type',
          //         value: getDefaultNoValue(assetType),
          //       },
          //     ],
          //   rightSideData:
          //     [
          //       {
          //         property: wizardState.type === 'ah' ? 'Space Category' : 'Equipment Category',
          //         value: wizardState.type === 'ah'
          //           ? getDefaultNoValue(wizardState.category ? wizardState.category.name : '')
          //           : getDefaultNoValue(wizardState.category && wizardState.category.path_name ? wizardState.category.path_name : ''),
          //       },
          //     ],
          // },
          {
            header: 'Maintenance Information',
            leftSideData:
              [
                {
                  property: infoValue('maintenance_team_id', 'Maintenance Team'),
                  value: getDefaultNoValue(wizardState?.teamData?.name || ''),
                },
                {
                  property: infoValue('MaintenanceChecklist', 'Checklist'),
                  value: getDefaultNoValue(wizardState?.checklistData?.name || ''),
                },
                {
                  property: infoValue('duration', 'Duration'),
                  value: inspectionData?.duration?.label,
                },
              ],
            rightSideData:
              [
                {
                  property: infoValue('MaintenanceOperation', 'Maintenance Operation'),
                  value: getDefaultNoValue(wizardState?.operation?.name || ''),
                },
                {
                  property: infoValue('starts_at', 'Starts At'),
                  value: getArrayToCommaValuesTime(inspectionData?.starts_at, 'label'),
                },
                {
                  property: 'Exclude Holidays?',
                  value: <span className={` ${inspectionData?.is_exclude_holidays ? 'text-success' : 'text-danger'} m-0 p-0 font-weight-700 text-capital`}>{inspectionData?.is_exclude_holidays ? 'Yes' : 'No'}</span>,
                },
              ],
          },
          {
            header: 'Schedule Information',
            leftSideData:
              [
                {
                  property: infoValue('commences_on', 'Commences On'),
                  value: getDefaultNoValue(getCompanyTimezoneDate(wizardState?.commenceOn, userInfo, 'datetime')),
                },
              ],
            rightSideData:
              [
                {
                  property: 'Ends On',
                  value: getDefaultNoValue(getCompanyTimezoneDate(inspectionData?.ends_on, userInfo, 'datetime')),
                },

              ],
          },
        ]}
      />
      <Typography
        sx={detailViewHeaderClass}
      >
        Options
      </Typography>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            Exclude Days
          </Typography>
          <small>Select any days you would like to exclude from the scheduling options</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
            }}
          >
            {returnCheckIcon(inspectionData?.mo, 'Mon')}
            {returnCheckIcon(inspectionData?.tu, 'Tue')}
            {returnCheckIcon(inspectionData?.we, 'Wed')}
            {returnCheckIcon(inspectionData?.th, 'Thu')}
            {returnCheckIcon(inspectionData?.fr, 'Fri')}
            {returnCheckIcon(inspectionData?.sa, 'Sat')}
            {returnCheckIcon(inspectionData?.su, 'Sun')}
          </Box>
        </Box>
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            Capture Picture
          </Typography>
          <small>Select when to capture a picture during the inspection process</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
            }}
          >
            {returnCheckIcon(inspectionData?.at_start_mro, 'At Start')}
            {returnCheckIcon(inspectionData?.at_review_mro, 'At Review')}
            {returnCheckIcon(inspectionData?.at_done_mro, 'At Done')}
          </Box>
        </Box>

      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            Time Enforcement
          </Typography>
          <small>Select the time enforcement option for your inspection</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
            }}
          >
            {returnCheckIcon(inspectionData?.enforce_time, 'Enforce Time')}
            {returnCheckIcon(inspectionData?.is_allow_future, 'Allow Future')}
            {returnCheckIcon(inspectionData?.is_allow_past, 'Allow Past')}
          </Box>
        </Box>
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            QR Scan
          </Typography>
          <small>Choose an QR scan option for your inspection</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
            }}
          >
            {returnCheckIcon(inspectionData?.qr_scan_at_start, 'QR Scan At Start')}
            {returnCheckIcon(inspectionData?.qr_scan_at_done, 'QR Scan At Done')}
          </Box>
        </Box>
      </Box>
      <Box sx={{
        width: '100%',
        display: 'flex',
      }}>
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            NFC
          </Typography>
          <small>Choose an NFC scan option for your inspection</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
            }}
          >
            {returnCheckIcon(inspectionData?.nfc_scan_at_start, 'NFC Scan At Start')}
            {returnCheckIcon(inspectionData?.nfc_scan_at_done, 'NFC Scan At Done')}
          </Box>
        </Box>
      </Box>
    </StepWrapper>
  );
};

export default PreviewInspectionSchedule;
