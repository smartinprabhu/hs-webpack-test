/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    equipment,
    space,
    requestor,
    typeOfWork,
    natureOfWork,
    workLocation,
    plannedStartTime,
    plannedEndTime,
    preparednessCheckList,
    typeOfRequest,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  start_valid: Yup.string()
    .required('Planned In'),
  end_valid: Yup.string()
    .required('Planned Out'),
  valid_valid: Yup.string()
    .required('Planned Out'),
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
  [requestor.name]: Yup.string()
    .required(`${requestor.requiredErrorMsg}`),
  /* [typeOfWork.name]: Yup.string()
    .required(`${typeOfWork.requiredErrorMsg}`), */
  [natureOfWork.name]: Yup.string()
    .required(`${natureOfWork.requiredErrorMsg}`),
  [plannedStartTime.name]: Yup.date()
    .nullable()
    .required(`${plannedStartTime.requiredErrorMsg}`),
  [plannedEndTime.name]: Yup.date()
    .nullable()
    .required(`${plannedEndTime.requiredErrorMsg}`),
  [typeOfRequest.name]: Yup.string()
    .required(`${typeOfRequest.requiredErrorMsg}`),
  [preparednessCheckList.name]: Yup.string().when('has_preparednessCheckList', {
    is: 'true',
    then: Yup.string().required(`${preparednessCheckList.requiredErrorMsg}`),
  }),
  [workLocation.name]: Yup.string().when('has_work_location', {
    is: 'Required',
    then: Yup.string().required(`${workLocation.requiredErrorMsg}`)
      .max(150, 'Work location name is too large'),
  }),
  [equipment.name]: Yup.string().when('type', {
    is: 'Equipment',
    then: Yup.string().required(equipment.requiredErrorMsg),
  }),

  [space.name]: Yup.string().when('type', {
    is: 'Space',
    then: Yup.string().required(space.requiredErrorMsg),
  }),
});

export default validationSchema;
