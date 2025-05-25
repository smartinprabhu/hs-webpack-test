/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import {
  FormGroup,
} from 'reactstrap';
import {
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
} from '@mui/material';

import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';

import {
  getTypeId,
  getPPMYearlyExportLink,
  createPreventive,
  getPPMYearlyReport, resetPPMYearlyExportLinkInfo,
  resetCreatePreventive,
} from '../../../ppmService';
import { getTeamList } from '../../../../assets/equipmentService';

const SideFilterYearlyPPM = ({
  apiReportName,
  filterOpen,
  setFilterOpen,
  resetFilters,
  setResetFilters,
  setShowResetOption,
}) => {
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear().toString();
  const [customFilters, setCustomFilters] = useState({
    preventiveFor: 'equipment', maintenanceYear: { year: currentYear }, scheduleValue: [], date: [null, null], spaceValue: [], equipValue: [], statusValue: [], locationId: [],
  });
  const [date, changeDate] = useState(false);
  const [preventiveFor, setPreventiveFor] = useState('equipment');

  const [scheduleValue, setScheduleValue] = useState([]);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isNoData, setIsNoData] = useState(false);

  const [statusValue, setStatusValue] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const {
    ppmYearlyReport,
    addPreventiveInfo,
  } = useSelector((state) => state.ppm);

  const { teamsInfo } = useSelector((state) => state.equipment);

  const [spaceValue, setSpaceValue] = useState([]);
  const [equipValue, setEquipValue] = useState([]);

  const [locationId, setLocationId] = useState([]);

  const [maintenanceYear, setMaintenanceYear] = useState({ year: currentYear });

  useEffect(() => {
    if (isFilter && userInfo && userInfo.data && userInfo.data.company && customFilters.maintenanceYear && customFilters.maintenanceYear.year) {
      dispatch(getPPMYearlyReport(userInfo.data.company.id, customFilters.maintenanceYear.year));
    }
  }, [userInfo, customFilters, isFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && customFilters.maintenanceYear && customFilters.maintenanceYear.year) {
      dispatch(getTeamList(userInfo.data.company.id, 'ppm.maintenance.year', customFilters.maintenanceYear.year, false, ['id', 'name']));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    dispatch(getTypeId({
      preventiveFor, scheduleValue, maintenanceYear, statusValue, date: customFilters.date, spaceValue, equipValue, locationId,
    }));
  }, []);

  useEffect(() => {
    if (isNoData && addPreventiveInfo && addPreventiveInfo.data && addPreventiveInfo.data.length) {
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      dispatch(getPPMYearlyExportLink(addPreventiveInfo.data[0], conetxt));
      setIsNoData(false);
      dispatch(resetCreatePreventive());
    } else if (addPreventiveInfo && addPreventiveInfo.data && !addPreventiveInfo.data.length) {
      setIsNoData(false);
      setIsFilter(false);
      dispatch(resetPPMYearlyExportLinkInfo());
      dispatch(resetCreatePreventive());
    } else if (addPreventiveInfo && addPreventiveInfo.err) {
      setIsNoData(false);
      dispatch(resetPPMYearlyExportLinkInfo());
      dispatch(resetCreatePreventive());
      setIsFilter(false);
    }
  }, [addPreventiveInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && ppmYearlyReport && ppmYearlyReport.data && ppmYearlyReport.data.length && ppmYearlyReport.data[ppmYearlyReport.data.length - 1].id) {
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      dispatch(getPPMYearlyExportLink(ppmYearlyReport.data[ppmYearlyReport.data.length - 1].id, conetxt));
      setIsNoData(false);
    } else if (ppmYearlyReport && ppmYearlyReport.data && !ppmYearlyReport.data.length) {
      setIsNoData(true);
      // dispatch(resetPPMYearlyExportLinkInfo());
    } else if (ppmYearlyReport && ppmYearlyReport.err) {
      dispatch(resetPPMYearlyExportLinkInfo());
      setIsFilter(false);
    }
  }, [ppmYearlyReport]);

  useEffect(() => {
    if (ppmYearlyReport && ppmYearlyReport.data && !ppmYearlyReport.data.length && isNoData && isFilter) {
      const postData = {
        maintenance_year_id: teamsInfo && teamsInfo.data && teamsInfo.data.length ? teamsInfo.data[0].id : false, // Provide a valid value or replace 'null' with the correct key-value pair
        name: `${userInfo.data.company.name}-${customFilters.maintenanceYear.year}`,
        company_id: userInfo.data.company.id,
        type: 'Download',
      };
      const payload = { model: 'ppm.import.log', values: postData };
      dispatch(createPreventive(payload, 'ppm.import.log'));
    }
  }, [ppmYearlyReport, isNoData]);

  const onScheduleChange = (data) => {
    setMaintenanceYear(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, maintenanceYear: data, statusValue, date, spaceValue, equipValue, locationId,
    }));
  };

  const handleResetClick = () => {
    setScheduleValue([]);
    setPreventiveFor('equipment');
    setSpaceValue([]);
    setEquipValue([]);
    setLocationId([]);
    setIsFilter(false);
    setStatusValue([]);
    changeDate([null, null]);
    dispatch(getTypeId({
      preventiveFor: 'equipment', maintenanceYear: { year: currentYear }, scheduleValue: [], statusValue: [], date: false, spaceValue: [], equipValue: [], locationId: [],
    }));
  };

  moment.locale('en-gb', {
    week: {
      dow: 1, /// Date offset
    },
  });

  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false);
      setShowResetOption(false);
      setCustomFilters({
        preventiveFor: 'equipment', maintenanceYear: { year: currentYear }, scheduleValue: [], date: [null, null], spaceValue: [], equipValue: [], statusValue: [], locationId: [],
      });
      handleResetClick();
      dispatch(resetPPMYearlyExportLinkInfo());
      setIsFilter(false);
    }
  }, [resetFilters]);

  const onApplyFilters = () => {
    setCustomFilters({
      preventiveFor, scheduleValue, date, maintenanceYear, spaceValue, equipValue, statusValue, locationId,
    });
    setFilterOpen(false);
    setIsFilter(Math.random());
    dispatch(resetPPMYearlyExportLinkInfo());
  };

  const onCloseFilters = () => {
    dispatch(getTypeId({
      preventiveFor, scheduleValue, maintenanceYear, statusValue, date: customFilters.date, spaceValue, equipValue, locationId,
    }));
    // dispatch(resetPPMStatus());
    changeDate(customFilters.date);
    setPreventiveFor(customFilters.preventiveFor);
    setScheduleValue(customFilters.scheduleValue);
    setSpaceValue(customFilters.spaceValue);
    setEquipValue(customFilters.equipValue);
    setStatusValue(customFilters.statusValue);
    setLocationId(customFilters.locationId);
    setMaintenanceYear(customFilters.maintenanceYear);
    setFilterOpen(false);
  };

  const getYearsList = () => {
    const currentYearInt = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => ({ year: (currentYearInt - i).toString() }));
    return years;
  };

  useEffect(() => {
    if ((customFilters.maintenanceYear && customFilters.maintenanceYear.year && customFilters.maintenanceYear.year !== currentYear)) {
      setShowResetOption(true);
    }
  }, [customFilters]);

  const filtersComponentsArray = [
    {
      title: 'BY MAINTENANCE YEAR',
      component:
  <FormGroup>
    <Autocomplete
      id="tags-filledschedule"
      size="small"
      name="schedule"
      open={scheduleOpen}
      value={maintenanceYear && maintenanceYear.year ? maintenanceYear.year : ''}
      onOpen={() => {
        setScheduleOpen(true);
      }}
      onClose={() => {
        setScheduleOpen(false);
      }}
      disableClearable
      options={getYearsList()}
      onChange={(e, options, action, value) => onScheduleChange(options, action, value)}
      getOptionSelected={(option, value) => option.year === value.year}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.year)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label="Maintenance Year"
          className="without-padding"
          placeholder="Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  </FormGroup>,
    },
  ];

  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          isDisabled={!(maintenanceYear)}
        />
      </Drawer>

    </>
  );
};

export default SideFilterYearlyPPM;
