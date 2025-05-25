import React, { useEffect, useMemo } from 'react';
import {
  FormControl,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import StepWrapper from '../../../commonComponents/ReactFormWizard/steps/StepWrapper/StepWrapper';
import { useWizardState, useWizardData } from '../../../commonComponents/ReactFormWizard/wizard/WizardRoot';
import InspectionSchedule from '../../../inspectionSchedule/formsAdmin/addInspection';
// import PPMSchedule from '../../../preventiveMaintenance/formsAdmin/addPPM';
import {
  storeModifiedData,
} from '../../setupService';
import SelectChecklistNoStep from './selectChecklistNoStep';

const StepOneInfo = () => {
  const dispatch = useDispatch();
  const { selectedSpaces, modifiedData } = useSelector((state) => state.setup);
  const { editValue } = useWizardData();
  const { wizardState, setWizardState } = useWizardState();
  const [inspectionData, setInspectionData] = React.useState(wizardState?.inspectionData || []);
  const [teamData, setTeamData] = React.useState(wizardState?.teamData || '');
  const [commenceOn, setCommenceOn] = React.useState(wizardState?.commenceOn || dayjs(new Date()));
  const [PPMData, setPPMData] = React.useState(wizardState?.PPMData || []);
  const [typeValue, setTypeValue] = React.useState(selectedSpaces?.maintenanceType || wizardState?.typeValue || { id: 'Inspection', name: 'Daily Inspection', subName: 'These are daily Preventive Maintenance activities' });

  const bulkJsonEdit = { ...wizardState?.bulkJson, ...{ currentStep: 1 } };

  const scheduleData = editValue && editValue[0].editId ? { ...wizardState } : {
    ...wizardState,
    ...{ bulkJson: bulkJsonEdit },
    inspectionData,
    typeValue,
    PPMData,
    teamData,
    commenceOn,
  };

  const onNext = () => setWizardState(editValue && editValue[0].editId ? { ...modifiedData, ...wizardState } : { ...scheduleData, ...selectedSpaces });

  useMemo(() => {
    if (modifiedData && Object.keys(modifiedData).length && editValue && editValue[0].editId) {
      setInspectionData(modifiedData?.inspectionData);
      setTeamData(modifiedData?.teamData);
      setCommenceOn(modifiedData?.commenceOn);
      setWizardState({ ...scheduleData, ...modifiedData });
      onNext();
    }
  }, [modifiedData]);

  useEffect(() => {
    setWizardState({ ...scheduleData, ...selectedSpaces });
  }, [selectedSpaces]);

  useEffect(() => {
    dispatch(storeModifiedData({
      ...modifiedData, teamData, commenceOn, inspectionData,
    }));
  }, [inspectionData, teamData, commenceOn]);

  const mType = [
    { id: 'Inspection', name: 'Daily Inspection', subName: 'These are daily preventive maintenance activities' },
    // { id: 'PPM', name: '52 Week PPM', subName: 'These are planned PPMs with a week long duration' },
  ];

  return (
    <StepWrapper onNext={onNext}>
      <h5 className="font-family-tab">Plan Schedule</h5>
      <Grid container spacing={2} className="p-0">
        {mType.map((mData) => (
          <Grid item xs={12} sm={12} md={12}>
            <Box
              sx={typeValue.id === mData.id ? {
                border: '1px solid #80808087',
                borderRadius: '4px',
                background: '#0000000d',
                margin: '6px 3px',
                padding: '0px 5px',
                cursor: 'pointer',
              } : {
                // borderLeft: '12px solid #00000040',
                border: '1px solid #80808087',
                borderRadius: '4px',
                background: '#ffffff0d',
                margin: '6px 3px',
                padding: '0px 5px',
                cursor: 'pointer',
              }}
              onClick={() => setTypeValue(mData)}
            >
              <ListItem
                alignItems="flex-start"
              >
                <ListItemIcon>
                  <Radio
                    checked={typeValue.id === mData.id}
                   // onChange={() => setTypeValue(mData)}
                    value="a"
                    name="radio-buttons"
                    inputProps={{ 'aria-label': 'A' }}
                  />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={<Typography variant="body2" sx={{ fontWeight: 600, fontSize: '17px' }}>{mData.name}</Typography>}
                  secondary={(
                    <Typography
                      sx={{ display: 'inline', fontSize: '15px' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {mData.subName}
                    </Typography>
        )}
                />
              </ListItem>
            </Box>
          </Grid>
        ))}
      </Grid>
      { typeValue.id === 'Inspection'
        ? (
          <FormControl className="w-100 mt-0">
            <InspectionSchedule setTeamData={setTeamData} teamData={teamData} setInspectionData={setInspectionData} inspectionData={inspectionData} setCommenceOn={setCommenceOn} commenceOn={commenceOn} onNext={onNext} />
          </FormControl>
        )
        // : (
        //   <FormControl className="w-100 mt-0">
        //     <PPMSchedule setPPMData={setPPMData} PPMData={PPMData} onNext={onNext} />
        //   </FormControl>
        // )
        : ''}
      <hr />
      <h5 className="font-family-tab mb-3">Select Checklists</h5>
      <SelectChecklistNoStep />
    </StepWrapper>
  );
};

export default StepOneInfo;
