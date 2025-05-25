export default {
  formId: 'tenantUpdateForm',
  formField: {
    nameValue: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    mobile: {
      name: 'mobile',
      label: 'Mobile',
      required: true,
      requiredErrorMsg: 'Mobile is required',
    },
    email: {
      name: 'email',
      label: 'Email',
      required: true,
      requiredErrorMsg: 'Email is required',
      invalidErrorMsg: 'Email is not valid (e.g. abc@example.com)',
    },
    address: {
      name: 'street',
      label: 'Address',
      required: true,
      requiredErrorMsg: 'Address is required',
    },
    onSpotSpaceBooking: {
      name: 'allow_onspot_space_booking',
      label: 'Allow on Spot Space Booking',
      required: false,
    },
    createWorkSchedule: {
      name: 'create_work_schedule',
      label: 'Employee can create work schedule CW',
      required: false,
    },
    generateMorAr: {
      name: 'generate_mor_after_release',
      label: 'Generate MOR after Release',
      required: false,
    },
    requireChecklist: {
      name: 'require_checklist',
      label: 'Checklist',
      required: false,
    },
    workScheduleGracePeriod: {
      name: 'work_schedule_grace_period',
      label: 'Work Schedule Grace Period (Minutes)',
      required: false,
    },
    enablePrescreen: {
      name: 'enable_prescreen',
      label: 'Enable Prescreen',
      required: false,
    },
    prescreenPeriod: {
      name: 'prescreen_period',
      label: 'Prescreen Period (Hours)',
      required: false,
    },
    prescreenIsMandatory: {
      name: 'prescreen_is_mandatory',
      label: 'Prescreen is Mandatory',
      required: false,
    },
    bookFromOutlook: {
      name: 'book_from_outlook',
      label: 'Book from Outlook',
      required: false,
    },
    enableAccess: {
      name: 'enable_access',
      label: 'Enable Access',
      required: false,
    },
    skipOccupy: {
      name: 'skip_occupy',
      label: 'Skip Occupy',
      required: false,
    },
    detectMask: {
      name: 'detect_mask',
      label: 'Detect Mask',
      required: false,
    },
    faceDetectionMandatory: {
      name: 'face_detection_mandatory',
      label: 'Face Detection is Mandatory',
      required: false,
    },
    prereleaseRequired: {
      name: 'prerelease_required',
      label: 'Prerelease Required',
      required: false,
    },
    prereleasePeriod: {
      name: 'prerelease_period',
      label: 'Prescreen Period (Hours)',
      required: false,
    },
    autoRelease: {
      name: 'auto_release',
      label: 'Auto Release',
      required: false,
    },
    autoReleaseGracePeriod: {
      name: 'auto_release_grace_period',
      label: 'Grace Period for Unreleased work schedule',
      required: false,
    },
    enableGroupBooking: {
      name: 'enable_group_booking',
      label: 'Enable Group Booking',
      required: false,
    },
    enableBookingForOthers: {
      name: 'enable_booking_for_others',
      label: 'Enable Booking for Others',
      required: false,
    },
    prescreenRequiredEverySchedule: {
      name: 'prescreen_required_every_schedule',
      label: 'Prescreen Required Every Schedule',
      required: false,
    },
    covidTitle: {
      name: 'covid_title',
      label: 'Title',
      required: false,
    },
    allowedOccupancyPer: {
      name: 'allowed_occupancy_per',
      label: 'Allowed Occupancy (%)',
      required: false,
    },
    enableScreening: {
      name: 'enable_screening',
      label: 'Enable Screening',
      required: false,
    },
    allowAfterNonCompliance: {
      name: 'allow_after_non_compliance',
      label: 'Allow After Non Compliance',
      required: false,
    },
    enableCovidConfig: {
      name: 'enable_covid_config',
      label: 'Enable Covid Configuration',
      required: false,
    },
    enableReportCovidIncident: {
      name: 'enable_report_covid_incident',
      label: 'Enable Report Covid Incident',
      required: false,
    },
    requireAttendance: {
      name: 'require_attendance',
      label: 'Attendance',
      required: false,
    },
    attendanceWithFaceDetection: {
      name: 'attendance_with_face_detection',
      label: 'Attendance with Face Detection',
      required: false,
    },
    attendanceSource: {
      name: 'attendance_source',
      label: 'Attendance Source',
      required: false,
    },
    otpValidityPeriod: {
      name: 'otp_validity_period',
      label: 'OTP Validity Period (in Minutes)',
      required: false,
    },
    validDomains: {
      name: 'valid_domains',
      label: 'Valid Domains',
      required: false,
    },
    allowUserRegistrationWithValidDomain: {
      name: 'allow_user_registration_with_valid_domain',
      label: 'Allow User Registration with Valid Domain',
      required: false,
    },
    tenantCode: {
      name: 'tenant_code',
      label: 'Tenant Code',
      required: true,
      requiredErrorMsg: 'Tenant Code is required',
    },
    conferenceRoomSpaceId: {
      name: 'conference_room_space_id',
      label: 'Space Conference Room',
      required: false,
    },
    officeRoomSpaceId: {
      name: 'office_room_space_id',
      label: 'Space Office Room',
      required: false,
    },
    workStationSpaceId: {
      name: 'workstation_space_id',
      label: 'Space Workstation',
      required: false,
    },
    buildingSpaceId: {
      name: 'building_space_id',
      label: 'Space Building',
      required: false,
    },
    conferenceSubtypeId: {
      name: 'conference_room_space_sub_type_id',
      label: 'Conference Room',
      required: false,
    },
    officeSubtypeId: {
      name: 'office_room_space_sub_type_id',
      label: 'Office Room',
      required: false,
    },
    workstationSubtypeId: {
      name: 'workstation_space_sub_type_id',
      label: 'Workstation',
      required: false,
    },
    enableLandingPageId: {
      name: 'enable_landing_page_id',
      label: 'Landing Page',
      required: false,
    },
    enableOtherResourcesId: {
      name: 'enable_other_resources_id',
      label: 'Other Resources',
      required: false,
    },
    safetyResourcesId: {
      name: 'safety_resources_id',
      label: 'Safety Measures Resources',
      required: false,
    },
    enableWorkspaceInstructionId: {
      name: 'enable_workspace_instruction_id',
      label: 'Workspace Instructions',
      required: false,
    },
    helpLineId: {
      name: 'help_line_id',
      label: 'Help Line',
      required: false,
    },
    ticketCategoryId: {
      name: 'ticket_category_id',
      label: 'Category',
      required: false,
    },
    subCategoryId: {
      name: 'sub_category_id',
      label: 'Sub Category',
      required: false,
    },
    maintenanceTeamId: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
      required: false,
    },
    futureLimit: {
      name: 'future_limit',
      label: 'Future Limit',
      required: false,
    },
    futureLimitUom: {
      name: 'future_limit_uom',
      label: 'Future Limit UOM',
      required: false,
    },
    minimumDuration: {
      name: 'minimum_duration',
      label: 'Minimum Duration',
      required: false,
    },
    minimumDurationUom: {
      name: 'minimum_duration_uom',
      label: 'Minimum Duration UOM',
      required: false,
    },
    bufferPeriod: {
      name: 'buffer_period',
      label: 'Buffer Period',
      required: false,
    },
    bufferPeriodUom: {
      name: 'buffer_period_uom',
      label: 'Buffer Period UOM',
      required: false,
    },
    spaceNeighbourIds: {
      name: 'space_neighbour_ids',
      label: 'Neigbourhoods',
      required: false,
    },
    removeNeighbourId: {
      name: 'remove_neighbour_id',
      label: 'Remove Neigbourhoods',
      required: false,
    },
    checkListIds: {
      name: 'check_list_ids',
      label: 'Select Checklist',
      required: false,
    },
  },
};
