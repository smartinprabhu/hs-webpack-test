/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import scheduleFormModel from './formModel';

const {
  formField: {
    dateValue,
    location,
    employeeId,
    assetIds,
    remark,
  },
} = scheduleFormModel;

const validationSchema = Yup.object().shape({

  [dateValue.name]: Yup.string()
    .required(`${dateValue.requiredErrorMsg}`),
  [location.name]: Yup.string().when('checkout_to', {
    is: 'Location',
    then: Yup.string().required(`${location.requiredErrorMsg}`),
  }),
  [employeeId.name]: Yup.string().when('checkout_to', {
    is: 'Employee',
    then: Yup.string().required(`${employeeId.requiredErrorMsg}`),
  }),
  [assetIds.name]: Yup.string().when('checkout_to', {
    is: 'Equipment',
    then: Yup.string().required(`${assetIds.requiredErrorMsg}`),
  }),
  [remark.name]: Yup.string()
    .nullable()
    .required(`${remark.requiredErrorMsg}`),

});

export default validationSchema;
