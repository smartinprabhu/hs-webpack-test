const getBookingStatus = (bookingItem, configObj) => {
  const todayDate = new Date();
  const plannedIn = new Date(bookingItem.planned_in);
  let diff = (todayDate.getTime() - plannedIn.getTime()) / 1000;
  diff /= (60 * 60); // hours difference
  // diff /= (60 * 60 * 24); // days difference

  if (Math.abs(diff) < configObj.prescreen.prescreen_period) {
    if (bookingItem.prescreen_status === false && configObj.prescreen.enable_prescreen) {
      return 'PRE-SCREEN';
    } 
    if (bookingItem.prescreen_status && configObj.access.enable_access) {
      return 'ACCESS';
    } 
    if (bookingItem.acess_status === true) {
      // eslint-disable-next-line no-param-reassign
      bookingItem.show = 'OCCUPY';
    } else return 'RELEASE';
  }
  return undefined;
};

export default getBookingStatus;
