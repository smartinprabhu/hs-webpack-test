/* eslint-disable consistent-return */
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

export const TimeZoneDateConvertor = ({ date, format }) => {
  const { userInfo } = useSelector((state) => state.user);
  if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone) {
    const companyTimezoneTime = moment.utc(date).tz(userInfo.data.company.timezone).format('YYYY-MM-DD HH:mm:ss');
    const companyTimezoneDate = new Date(companyTimezoneTime.replace(' ', 'T'));
    return moment(companyTimezoneDate).format(format);
  }
  return false;
};

export const TimeZoneTimeConvertor = ({ date, format }) => {
  const { userInfo } = useSelector((state) => state.user);
  if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone) {
    return moment(date, 'HH:mm:ss').tz(userInfo.data.company.timezone).format(format);
  }
  return false;
};

export function utcConverter(date, format, zone) {
  if (date && zone) {
    const formattedDate = moment.tz(date, zone).utc().format(format);
    return formattedDate;
  } if (date) {
    const formattedDate = moment.utc(date).format(format);
    return formattedDate;
  } return undefined;
}

export function getUtcTimefromZone(date, format, zone) {
  if (date) {
    const strDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
    const slicedStartDate = moment.tz(strDate, zone);
    const formattedDate = utcConverter(slicedStartDate, format, zone);
    return formattedDate;
  }
}

export function convertUtcTimetoCompanyTimeZone(date, format, timezone) {
  if (timezone) {
    const companyTimezoneTime = moment.utc(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    return moment(new Date(companyTimezoneTime.replace(' ', 'T'))).format(format);
  }
}

export function getCurrentTimeZoneTime(format, timezone) {
  if (timezone) {
    const companyTimezoneTime = moment.utc(new Date()).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    return moment(new Date(companyTimezoneTime.replace(' ', 'T'))).format(format);
  }
}

export function getDateWithAddedMins(date, format, timezone, mins) {
  if (timezone) {
    const companyTimezoneTime = moment.utc(date).tz(timezone).add(mins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    return moment(new Date(companyTimezoneTime.replace(' ', 'T'))).format(format);
  }
}

export function getDateWithSubtractedMins(date, format, timezone, mins) {
  if (timezone) {
    const companyTimezoneTime = moment.utc(date).tz(timezone).subtract(mins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    return moment(new Date(companyTimezoneTime.replace(' ', 'T'))).format(format);
  }
}

export function getTimeWithSubtractedMins(date, format, mins) {
  const companyTimezoneTime = moment(date).subtract(mins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  return moment(new Date(companyTimezoneTime.replace(' ', 'T'))).format(format);
}

export function getUtcDate(date, format) {
  let formattedDate = moment.utc(date).format(format);
  if (moment(date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
    const newDateItem = moment(date).format('YYYY-MM-DD');
    const stringdate = new Date(newDateItem).toISOString();
    formattedDate = moment.utc(stringdate).format(format);
  }
  return formattedDate;
}


export function getFormat(type) {
  let defaultFormat = 'DD MMM YYYY';
  if (type && type === 'datetime') {
    defaultFormat = 'DD MMM YYYY hh:mm A';
  }
  if (type && type === 'time') {
    defaultFormat = 'hh:mm A';
  }
  if (type && type === 'date') {
    defaultFormat = 'DD MMM YYYY';
  }
  if (type && type === 'monthyear') {
    defaultFormat = 'MMM YYYY';
  }
  if (type && type === 'datetimeseconds') {
    defaultFormat = 'YYYY-MM-DDTHH:mm:ss';
  }
  if (type && type === 'datetimesecs') {
    defaultFormat = 'YYYY-MM-DD HH:mm:ss';
  }
  return defaultFormat;
}

function getDateFormatNew(format) {
  const dateArray = {
    a: 'ddd',
    A: 'dddd',
    b: 'MMM',
    B: 'MMMM',
    d: 'DD',
    m: 'MM',
    w: 'Do',
    y: 'YY',
    Y: 'YYYY',
  };
  let str = '';
  for (let i = 0; i < format.length; i += 1) {
    if ((format[i].toString() in dateArray)) {
      str += dateArray[format[i].toString()];
    } else {
      str += format[i];
    }
  }
  return str;
}

export function truncatePercentageAndDateType(format, type) {
  let result = '';
  if (format && type) {
    if (type === 'date' || type === 'monthyear') {
      result = getDateFormatNew(format.replaceAll('%', ''));
    }
    if (type === 'datetime') {
      const dStr = getDateFormatNew(format.replaceAll('%', ''));
      result = `${dStr} hh:mm A`;
    }
    if (type === 'time') {
      result = 'hh:mm A';
    }
  }
  return result;
}

export function getDateFormat(input, userResponse, type) {
  let local = '';
  const defaultTf = getFormat(type);
  if (input && userResponse && userResponse.data) {
    const uData = userResponse.data && userResponse.data.general;
    const defaultTz = 'Asia/Kolkata';
    const tZone = uData && uData.timezone ? uData.timezone : defaultTz;
    const dateFormat = uData && userResponse.data.general.date_format ? truncatePercentageAndDateType(userResponse.data.general.date_format, type) : defaultTf;
    local = moment.utc(input).local().tz(tZone).format(dateFormat);
  }
  return local;
}

export function getCompanyTimeZoneDate() {
  const { userInfo } = useSelector((state) => state.user);
  if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone) {
    const timeZoneDate = moment().tz(userInfo.data.company.timezone).format('YYYY-MM-DD HH:mm:ss');
    const todayDate = (new Date(timeZoneDate.replace(' ', 'T')));
    return todayDate;
  }
}

export default TimeZoneDateConvertor;
