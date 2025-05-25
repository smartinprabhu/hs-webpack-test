import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import {
  Box as MuiBox,
  Dialog,
  ListItem,
  Typography,
  IconButton,
  ListItemButton,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import { StaticDateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';


import filtersFields from '@shared/data/filtersFields.json';
import MuiTooltip from '@shared/muiTooltip';
import { getDateAndTimeForDifferentTimeZones, getCompanyTimezoneDate } from '../util/appUtils';
import { DateFilterButtons } from '../themes/theme';

const GridDateFilter = (props) => {
  const {
    onClickRadioButton, onChangeCustomDate, setCustomVariable, customVariable, setFilterFromOverview, themes,
  } = props;
  const { userInfo } = useSelector((state) => state.user);
  const [isDataFilter, showDateFilter] = useState(false);
  const [dateRangeDialog, setDateRangeDialog] = useState(false);
  const [customDateValue, setCustomDateValue] = useState([null, null]);
  const iconColor = themes === 'light' ? '#000000' : 'primary';

  const onCloseDateFilter = () => {
    if (dateRangeDialog) {
      setDateRangeDialog(false);
    } else {
      showDateFilter(false);
    }
  };
  const onChangeDate = (value) => {
    if (value === undefined) {
      setCustomVariable(false);
      onClickRadioButton({
        target: {
          checked: false,
          value: '',
        },
      });
    }

    if (setFilterFromOverview) {
      setFilterFromOverview(false);
    }

    if (value && value.type !== 'custom') {
      const data = {
        target: {
          checked: true,
          value: value.label,
        },
      };
      setCustomVariable(value.label);
      onClickRadioButton(data);
    } else if (value && value.type === 'custom') {
      setDateRangeDialog(true);
    } else if (!value) {
      setCustomVariable(false);
      onClickRadioButton({
        target: {
          checked: false,
          value: customDateValue,
        },
      });
    }
  };

  useEffect(() => {
    if (customDateValue && customDateValue.length > 1 && customDateValue[0] && customDateValue[1]) {
      if (customDateValue && customDateValue.length && customDateValue[0] && customDateValue[0] !== null) {
        showDateFilter(false);

        const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
          userInfo,
          customDateValue[0].$d,
          customDateValue[1].$d,
        );
        setCustomVariable(`${getCompanyTimezoneDate(getDateRangeObj[0], userInfo, 'date')} - ${getCompanyTimezoneDate(getDateRangeObj[1], userInfo, 'date')}`);
        onChangeCustomDate(customDateValue[0].$d, customDateValue[1].$d);
      }
    }
  }, [customDateValue]);

  return (
    <>

      {customVariable && (
      <IconButton className="header-filter-btn" color="primary" onClick={() => showDateFilter(true)}>
        {customVariable}
        <IoCloseOutline
          onClick={() => onChangeDate()}
          cursor="pointer"
          size={20}
        />
      </IconButton>
      )}
      <MuiTooltip
        title={(
          <Typography style={{ whiteSpace: 'nowrap' }}>
            Date Filters
            {customVariable && (
            <>
              {' ( '}
              {customVariable}
              {' ) '}

            </>
            )}
          </Typography>
                )}
      >
        <IconButton className="header-link-btn" onClick={() => showDateFilter(true)}>
          {' '}
          <TodayOutlinedIcon size={25} color="primary" style={{ color: iconColor }} />
          {' '}
        </IconButton>
      </MuiTooltip>
      <Dialog maxWidth="lg" open={isDataFilter}>
        <div className={!dateRangeDialog ? 'list-dates-filter-pop-up' : 'dates-filter-pop-up'}>
          <div className="url-popup-header-box">
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'Suisse Intl',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              <TodayOutlinedIcon size={25} />
              Date Filters
            </Typography>
            <IconButton
              onClick={() => onCloseDateFilter()}
              className="btn"
              type="button"
            >
              <IoCloseOutline size={28} />
            </IconButton>
          </div>
          <MuiBox
            sx={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '10px 0px 20px 0px',
            }}
            component="ul"
          >
            {!dateRangeDialog ? (
              <>
                {filtersFields && filtersFields.dateFilters.map((dl) => (
                  <ListItemButton
                    sx={DateFilterButtons({
                      width: '31%',
                      border: '1px solid #0000001f',
                    }, customVariable === dl.label)}
                    onClick={() => onChangeDate(dl)}
                  >
                    <ListItem
                      sx={{
                        diplay: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {dl.label}
                    </ListItem>
                  </ListItemButton>
                ))}
              </>
            )
              : (
                <div className="dates-filter-pop-up">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDateRangePicker
                      closeOnSelect
                      displayStaticWrapperAs="desktop"
                      value={customDateValue}
                      onChange={(newValue) => {
                        setCustomDateValue(newValue);
                      }}
                      renderInput={(startProps, endProps) => (
                        <>
                            <TextField {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} />
                          </>
                      )}
                    />
                  </LocalizationProvider>
                </div>
              )}
          </MuiBox>
        </div>
      </Dialog>
    </>
  );
};

export default GridDateFilter;
