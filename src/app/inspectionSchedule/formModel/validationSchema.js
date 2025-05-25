/* eslint-disable radix */
/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    groupId,
    maintenanceTeamId,
    commencesOn,
    descriptionValue,
    equipmentId,
    spaceId,
    startsAt,
    durationAt,
  },
} = checkoutFormModel;

export default [
  Yup.object().shape({
    [groupId.name]: Yup.string()
      .nullable()
      .required(`${groupId.requiredErrorMsg}`),
    [maintenanceTeamId.name]: Yup.string()
      .nullable()
      .required(`${maintenanceTeamId.requiredErrorMsg}`),
    [commencesOn.name]: Yup.string()
      .nullable()
      .required(`${commencesOn.requiredErrorMsg}`),
    [descriptionValue.name]: Yup.string()
      .nullable()
      .required(`${descriptionValue.requiredErrorMsg}`),
    [startsAt.name]: Yup.number()
      .min(0.00, 'Start At must be between 0.00 and 24.00')
      .max(24.00, 'Start At must be between 0.00 and 24.00')
      .required('Start At is required'),
    [durationAt.name]: Yup.number()
      .min(0.00, 'Duration At must be between 0.00 and 24.00')
      .max(24.00, 'Duration At must be between 0.00 and 24.00')
      .required(`${durationAt.requiredErrorMsg}`),
    [equipmentId.name]: Yup.string().when('category_type', (val) => {
      if (val && val.value === 'Equipment') {
        return Yup.string().required(`${equipmentId.requiredErrorMsg}`);
      }
    }),
    [spaceId.name]: Yup.string().when('category_type', (val) => {
      if (val && val.value === 'Space') {
        return Yup.string().required(`${spaceId.requiredErrorMsg}`);
      }
    }),
  }),
];
