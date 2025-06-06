import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    requestor,
    typeValue,
    equipment,
    workLocation,
    space,
    maintenanceTeam,
    vendor,
    vendorPoc,
    vendorMobile,
    vendorEmail,
    noVendorTechnicians,
    typeOfRequest,
    typeOfWork,
    natureOfWork,
    plannedStartTime,
    plannedEndTime,
    durationValue,
    preparednessCheckList,
    maintenanceCheckList,
    issuePermitCheckList,
    jobDescription,
    ehsInstructions,
    termsAndConditions,
    approvalAuthority,
    issuePermitAuthority,
    ehsAuthority,
    securityOffice,
    reviewer,
    departmentId,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [requestor.name]: '',
  [typeValue.name]: '',
  [equipment.name]: '',
  [workLocation.name]: '',
  [space.name]: '',
  [maintenanceTeam.name]: '',
  [vendor.name]: '',
  [vendorPoc.name]: '',
  [vendorMobile.name]: '',
  [vendorEmail.name]: '',
  [noVendorTechnicians.name]: '',
  [typeOfRequest.name]: '',
  [typeOfWork.name]: '',
  [natureOfWork.name]: '',
  [plannedStartTime.name]: '',
  [plannedEndTime.name]: '',
  [durationValue.name]: '0.00',
  [preparednessCheckList.name]: '',
  [maintenanceCheckList.name]: '',
  [issuePermitCheckList.name]: '',
  [jobDescription.name]: '',
  [ehsInstructions.name]: '',
  [termsAndConditions.name]: '',
  [approvalAuthority.name]: '',
  [issuePermitAuthority.name]: '',
  [ehsAuthority.name]: '',
  [securityOffice.name]: '',
  [reviewer.name]: '',
  [departmentId.name]: '',
  start_valid: 'yes',
  end_valid: 'yes',
  valid_valid: 'yes',
  valid_through: false,
  equipment_ids: [],
  space_ids: [],
};
