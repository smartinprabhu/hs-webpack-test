import shiftFormModel from './gaugeFormModel';

const {
  formField: {
    gaugeId,
    thresholdMin,
    thresholdMax,
    activeType,
    createMo,
  },
} = shiftFormModel;

export default {
  [gaugeId.name]: '',
  [thresholdMin.name]: '',
  [thresholdMax.name]: '',
  [activeType.name]: '',
  [createMo.name]: '',
};
