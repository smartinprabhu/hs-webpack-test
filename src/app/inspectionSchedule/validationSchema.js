import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    categoryType,
    PPMBy,
    interval,
    startingDate,
    endDate,
    maintenanceTeamId,
    schedulerType,
    HourlyConfiguration,
  },
} = checkoutFormModel;

export default [
  Yup.object().shape({
    [title.name]: Yup.string()
      .required(`${title.requiredErrorMsg}`)
      .max(50, 'Title is too large'),
    [categoryType.name]: Yup.string()
      .nullable()
      .required(`${categoryType.requiredErrorMsg}`),
    [PPMBy.name]: Yup.string()
      .nullable()
      .required(`${PPMBy.requiredErrorMsg}`),
    [interval.name]: Yup.number()
      .integer().typeError('Only integers are allowed'),
    [startingDate.name]: Yup.string()
      .nullable()
      .required(`${startingDate.requiredErrorMsg}`),
    [endDate.name]: Yup.string()
      .nullable()
      .required(`${endDate.requiredErrorMsg}`),
    [maintenanceTeamId.name]: Yup.string()
      .nullable()
      .required(`${maintenanceTeamId.requiredErrorMsg}`),
    [schedulerType.name]: Yup.string()
      .nullable()
      .required(`${schedulerType.requiredErrorMsg}`),
    [HourlyConfiguration.name]: Yup.string().when('is_hourly', {
      is: true,
      then: Yup.string().required('Hourly configuration is required'),
    }),
  }),
];
