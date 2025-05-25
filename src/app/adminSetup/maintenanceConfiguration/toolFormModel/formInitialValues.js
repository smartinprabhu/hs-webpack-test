import toolFormModel from './toolFormModel';

const {
  formField: {
    nameValue,
    toolCostUnit,
    status,
  },
} = toolFormModel;

export default {
  [nameValue.name]: '',
  [toolCostUnit.name]: '',
  [status.name]: '',
};
