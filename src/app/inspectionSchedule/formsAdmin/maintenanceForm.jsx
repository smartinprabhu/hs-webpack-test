/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import {
  FormControl,
} from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getTeamList } from '../../assets/equipmentService';
import Selection from '../../commonComponents/multipleFormFields/selection';
import MuiDatePicker from '../../commonComponents/multipleFormFields/muiDatePicker';

import { infoValue } from '../../adminSetup/utils/utils';

import {
  extractOptionsObject,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

dayjs.extend(utc);
dayjs.extend(timezone);

const RequestorForm = (props) => {
  const {
    setFieldValue,
    setTeamData,
    teamData,
    formField,
    setCommenceOn,
    commenceOn,
  } = props;
  const { teamsInfo } = useSelector((state) => state.equipment);

  return (
    <Box
      sx={{
        width: '100%',
        marginTop: '20px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '3%',
          flexWrap: 'wrap',
        }}
      >
            <FormControl
              sx={{
                width: '48%',
                marginTop: 'auto',
                marginBottom: '5px',
              }}
              variant="standard"
            >
               <Selection
                 paramsSet={setTeamData}
                 paramsValue={teamData}
                 paramsId={Math.random()}
                 callData={getTeamList}
                 dropdownsInfo={teamsInfo}
                 dropdownOptions={extractOptionsObject(teamsInfo, teamData)}
                 moduleName={appModels.TEAM}
                 labelName="Maintenance Team"
                 callDataFields={{ category: false, fields: ['name'] }}
                 columns={['id', 'name']}
                 isRequired
                 infoText="maintenance_team_id"
                 advanceSearchHeader="Maintenance Team List"
               />

            </FormControl>
            <FormControl
              sx={{
                width: '48%',
                marginTop: 'auto',
                marginBottom: '5px',
              }}
              variant="standard"
            >
       <MuiDatePicker
         label={(
              <>
              Commences On
              <span className="text-danger ml-1">*</span>
                {infoValue('commences_on')}
              </>
            )}
         value={commenceOn}
         onChange={(e) => setCommenceOn(e)}
         minDate={dayjs(new Date())}
       />
            </FormControl>
      </Box>
    </Box>
  );
};

RequestorForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default RequestorForm;
