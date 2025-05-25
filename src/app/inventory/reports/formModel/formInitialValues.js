import formModel from './formModel';

const {
  formField: {
    computeAtDate,
    inventoryDate,
  },
} = formModel;

export default {
  [computeAtDate.name]: '0',
  [inventoryDate.name]: '',
};
