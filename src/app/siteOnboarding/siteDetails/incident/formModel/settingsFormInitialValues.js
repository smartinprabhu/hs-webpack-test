import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    IncidentReportPartA,
    IncidentReportPartB,
  },
} = checkoutFormModel;

export default {
  [IncidentReportPartA.name]: '',
  [IncidentReportPartB.name]: '',
};
