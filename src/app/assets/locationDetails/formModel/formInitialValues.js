import locationFormModel from './locationFormModel';

const {
  formField: {
    spaceName,
    shortCode,
    areaSqft,
    Type,
    parentId,
    subType,
    company,
    vendorId,
    spaceStatus,
    spaceType,
    maintenanceTeam,
    maxOccupancy,
    bookingAllowed,
  },
} = locationFormModel;

export default {
  [spaceName.name]: '',
  [shortCode.name]: '',
  [areaSqft.name]: '',
  [Type.name]: '',
  [parentId.name]: '',
  [subType.name]: '',
  [company.name]: '',
  [vendorId.name]: '',
  [spaceStatus.name]: '',
  [spaceType.name]: '',
  [maintenanceTeam.name]: '',
  [maxOccupancy.name]: '',
  [bookingAllowed.name]: 'no',
};
