import moment from 'moment-timezone';
import { convertUtcTimetoCompanyTimeZone } from '../shared/dateTimeConvertor';
import { StringsMeta } from './appUtils';

function getBookingAction(bookingItem, configObj, timezone) {
  const timeZoneDate = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  const todayDate = (new Date(timeZoneDate));
  const plannedIn = new Date(convertUtcTimetoCompanyTimeZone(bookingItem.planned_in, 'YYYY-MM-DD HH:mm:ss', timezone));
  const plannedOut = new Date(convertUtcTimetoCompanyTimeZone(bookingItem.planned_out, 'YYYY-MM-DD HH:mm:ss', timezone));
  let diff = (plannedIn.getTime() - todayDate.getTime()) / 1000;
  diff /= (60 * 60); // hours difference
  // diff /= (60 60 24); // days difference
  let action;
  let cancel = false;
  if (todayDate > plannedOut) {
    return undefined; // for past date
  }
  if (todayDate < plannedIn || bookingItem.space.status === StringsMeta.MAINTAINANCE_IN_PROGRESS) {
    cancel = true; // for future today's bookings
  }
  if (bookingItem.state === StringsMeta.BOOKED && bookingItem.space.status !== StringsMeta.MAINTAINANCE_IN_PROGRESS) { // logic only if booked item state is Booked
    if (configObj && configObj.prescreen && configObj.prescreen.enable_prescreen && (diff < configObj.prescreen.prescreen_period)) {
      action = StringsMeta.PRE_SCREEN; // LABEL: Awaiting Pre-screen
    } else if (configObj && configObj.prescreen && configObj.prescreen.enable_prescreen && (diff > configObj.prescreen.prescreen_period)) {
      cancel = true; // LABEL: Awaiting Pre-screen
    } else if (configObj && configObj.access && configObj.prescreen && configObj.access.enable_access && (diff < configObj.prescreen.prescreen_period)) {
      action = StringsMeta.ACCESS; // LABEL: Ready to access the building
    } else if (configObj && configObj.access && configObj.prescreen && configObj.access.skip_occupy === false && (diff < configObj.prescreen.prescreen_period)) { // skip_occupy === false means enable_occupy true
      action = StringsMeta.OCCUPY; // LABEL: Ready to occupy
    } else {
      cancel = true; // If there is no actions
    }
  }
  // IF Pre-screen process is enabled
  if (bookingItem.state === StringsMeta.PRESCREENED) {
    if (configObj && configObj.access && configObj.prescreen && configObj.access.enable_access && (diff < configObj.prescreen.prescreen_period)) {
      cancel = false;
      action = StringsMeta.ACCESS; // LABEL: Ready to access the building
    } else if (configObj && configObj.access && configObj.prescreen && !configObj.access.enable_access && !configObj.access.skip_occupy && (diff < configObj.prescreen.prescreen_period)) { // skip_occupy === false means enable_occupy true
      cancel = false;
      action = StringsMeta.OCCUPY; // LABEL: Ready to occupy
    }
    else if (configObj && configObj.access && configObj.prescreen && !configObj.access.enable_access && configObj.access.skip_occupy && (diff < configObj.prescreen.prescreen_period)) { // skip_occupy === false means enable_occupy true
      cancel = false;
      action = StringsMeta.RELEASED; // LABEL: Ready to occupy
    }
  }
  // IF Access process is enabled
  if (bookingItem.state === StringsMeta.ACCESSED) {
    if (configObj && configObj.access && configObj.prescreen && configObj.access.skip_occupy === false && (diff < configObj.prescreen.prescreen_period)) { // skip_occupy === false means enable_occupy true
      cancel = false;
      action = StringsMeta.OCCUPY; // LABEL: Ready to occupy
    } else if(configObj && configObj.access && configObj.access.skip_occupy && (diff < configObj.prescreen.prescreen_period)) {
      cancel = false;
      action = StringsMeta.RELEASED;
    }
  }
  // IF Occupy process is enabled
  if (bookingItem.state === StringsMeta.OCCUPIED) {
    cancel = false;
    action = StringsMeta.RELEASE; // LABEL: Space is occupied
  }
  // IF Released process is enabled
  if (bookingItem && bookingItem.state && bookingItem.state.toUpperCase() === StringsMeta.RELEASED) {
    cancel = false;
    action = StringsMeta.RELEASED; // LABEL: Space is released
  }

  if (cancel) {
    return [StringsMeta.CANCEL, action];
  }

  return [action];
}
export default getBookingAction;
