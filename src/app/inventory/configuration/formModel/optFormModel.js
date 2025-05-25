export default {
  formId: 'optForm',
  formField: {
    name: {
      name: 'name',
      label: 'Operation Type',
      requiredErrorMsg: 'Operation Type is required',
    },
    sequenceId: {
      name: 'sequence_id',
      label: 'Reference Sequence',
      requiredErrorMsg: 'Reference Sequence is required',
    },
    warehouseId: {
      name: 'warehouse_id',
      label: 'Warehouse',
      requiredErrorMsg: 'Warehouse is required',
    },
    barcode: {
      name: 'barcode',
      label: 'Barcode',
      requiredErrorMsg: 'Barcode is required',
    },
    operationType: {
      name: 'code',
      label: 'Type of Operation',
      requiredErrorMsg: 'Type of Operation is required',
    },
    showOperations: {
      name: 'show_operations',
      label: 'Show Detailed Operations',
      requiredErrorMsg: 'Show Detailed is required',
    },
    showReserved: {
      name: 'show_reserved',
      label: 'Show Reserved',
      requiredErrorMsg: 'Show Reserved is required',
    },
    defaultSource: {
      name: 'default_location_src_id',
      label: 'Default Source Location',
      requiredErrorMsg: 'Company is required',
    },
    defaultDestination: {
      name: 'default_location_dest_id',
      label: 'Default Destination Location',
      requiredErrorMsg: 'Company is required',
    },
    pickingId: {
      name: 'return_picking_type_id',
      label: 'Operation Type for Returns',
      requiredErrorMsg: 'Company is required',
    },
    isApprovalRequired: {
      name: 'is_confirmed',
      label: 'Is Approval Required?',
    },
    role: {
      name: 'approval_user_role_ids',
      label: 'Role',
      requiredErrorMsg: 'Role is required',
    },
    isRequestExpiry: {
      name: 'is_request_expiry',
      label: 'Request Expiry?',
    },
    expiryDuration: {
      name: 'expiry_duration',
      label: 'Expiry Duration(Hours)',
    },
    isExpiryEmail: {
      name: 'is_expiry_email',
      label: 'Expiry Email?',
    },
    isReminderEmail: {
      name: 'is_reminder_email',
      label: 'Reminder Email?',
    },
    ReminderDuration: {
      name: 'reminder_duration',
      label: 'Reminder Duration(Hours)',
    },
    Requested: {
      name: 'requested',
      label: 'Requested',
    },
    Approved: {
      name: 'approved',
      label: 'Approved',
    },
    Rejected: {
      name: 'rejected',
      label: 'Rejected',
    },
    Delivered: {
      name: 'delivered',
      label: 'Delivered',
    },
    bnRequested: {
      name: 'bn_requested',
      label: 'Request',
    },
    bnApproved: {
      name: 'bn_approved',
      label: 'Approve',
    },
    bnRejected: {
      name: 'bn_rejected',
      label: 'Reject',
    },
    bnDelivered: {
      name: 'bn_delivered',
      label: 'Deliver',
    },
  },
};
