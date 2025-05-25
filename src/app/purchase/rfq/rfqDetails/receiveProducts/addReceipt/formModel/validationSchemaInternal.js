import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    pickingTypeId,
    assetId,
    spaceId,
    employeeId,
    departmentId,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [pickingTypeId.name]: Yup.string()
    .nullable()
    .required(`${pickingTypeId.requiredErrorMsg}`),
  [assetId.name]: Yup.string().when('use_in', (val) => {
    if (val && val.value === 'Asset') {
      return Yup.string().required(`${assetId.requiredErrorMsg}`);
    }
  }),
  [spaceId.name]: Yup.string().when('use_in', (val) => {
    if (val && val.value === 'Location') {
      return Yup.string().required(`${spaceId.requiredErrorMsg}`);
    }
  }),
  [employeeId.name]: Yup.string().when('use_in', (val) => {
    if (val && val.value === 'Employee') {
      return Yup.string().required(`${employeeId.requiredErrorMsg}`);
    }
  }),
  [departmentId.name]: Yup.string().when('use_in', (val) => {
    if (val && val.value === 'Department') {
      return Yup.string().required(`${departmentId.requiredErrorMsg}`);
    }
  }),
});

export default validationSchema;
