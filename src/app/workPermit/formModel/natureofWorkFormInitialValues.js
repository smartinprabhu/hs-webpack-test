import natureofWorkCheckoutFormModel from './naturefoWorkCheckoutFormModel';

const {
  formField: {
    title,
    preparednessCheckList,
    maintenanceCheckList,
    issuePermitCheckList,
    ehsInstructions,
    termsAndConditions,
    approvalAuthority,
    issuePermitApprovalAuthority,
    ehsAuthority,
    securityOffice,
    companyId,
    canBeExtended,
  },
} = natureofWorkCheckoutFormModel;

export default {
  [title.name]: '',
  [preparednessCheckList.name]: '',
  [maintenanceCheckList.name]: '',
  [issuePermitCheckList.name]: '',
  [ehsInstructions.name]: '',
  [termsAndConditions.name]: '',
  [approvalAuthority.name]: '',
  [issuePermitApprovalAuthority.name]: '',
  [ehsAuthority.name]: '',
  [securityOffice.name]: '',
  [companyId.name]: '',
  [canBeExtended.name]: '',
};
