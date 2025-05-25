import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    typeId,
    equipmentId,
    consumptionCost,
    unitCost,
    totalCost,
    subType,
    fromDate,
    toDate,
    descriptionValue,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [typeId.name]: '',
  [equipmentId.name]: '',
  [consumptionCost.name]: '',
  [unitCost.name]: '',
  [totalCost.name]: '',
  [subType.name]: '',
  [fromDate.name]: '',
  [toDate.name]: '',
  [descriptionValue.name]: '',
};
