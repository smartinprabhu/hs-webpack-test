export const HelpdeskModule = {
  helpdeskApiFields: '["sla_end_date","is_cancelled","is_on_hold_requested","ticket_type","description","issue_type",("category_id",["id","name","cat_display_name"]),("sub_category_id",["id","name","sub_cat_display_name"]),("asset_id",["id","name","path_name"]),"incident_state","level","sla_timer","channel","close_time",("requestee_id",["id","name"]),("company_id",["id","name"]),"person_name","sla_status","type_category",("create_uid",["id","name"]),"create_date","tenant_name","log_note","last_commented_by","log_note_date",("priority_id",["id","name"]),("state_id",["id","name"]),"work_location","subject","ticket_number","id","sla_time","email","city_name","state_name",("region_id",["id","name"]),("site_sub_categ_id",["id","name"]),"constraints","cost",("maintenance_team_id",["id","name"]),("closed_by_id",["id","name"]),("equipment_location_id",["id","name","path_name"]),("incident_type_id",["id","name"]),("parent_id",["id","name"]),("vendor_id",["id","name"])]',
  helpdeskShowFields: [
    'asset_id', 'category_id', 'closed_by_id', 'close_time', 'city_name', 'company_id', 'create_date', 'create_uid', 'description', 'equipment_location_id',
    'incident_state', 'maintenance_team_id', 'person_name', 'priority_id', 'region_id', 'sla_status', 'state_id', 'state_name', 'subject', 'ticket_number',
    'site_sub_categ_id', 'sub_category_id', 'constraints', 'cost', 'ticket_type',
  ],
  helpdeskSelectedColumns: [
    'asset_id', 'category_id', 'closed_by_id', 'close_time', 'company_id', 'create_date', 'create_uid', 'description', 'equipment_location_id',
    'incident_state', 'maintenance_team_id', 'person_name', 'priority_id', 'sla_status', 'state_id', 'subject', 'ticket_number',
    'constraints', 'cost', 'ticket_type',
  ],
  helpdeskSearchColumns: [
    'requestee_id', 'subject', 'ticket_number', 'channel', 'category_id', 'maintenance_team_id', 'sub_category_id', 'company_id', 'issue_type',
    'create_uid', 'state_id', 'priority_id', 'city_name', 'state_name', 'region_id', 'vendor_id', 'site_sub_categ_id', 'sla_status',
  ],
  helpdeskExtraSearchColumns: [
    'requestee_id', 'subject', 'ticket_number', 'channel', 'category_id', 'maintenance_team_id', 'sub_category_id', 'company_id', 'issue_type',
    'create_uid', 'state_id', 'priority_id', 'city_name', 'state_name', 'region_id', 'vendor_id', 'site_sub_categ_id', 'sla_status', 'person_name',
  ],
  helpdeskAdvanceSearchColumns: [
    'state_id', 'priority_id', 'category_id', 'channel', 'maintenance_team_id', 'region_id', 'company_id', 'sla_status', 'sub_category_id',
  ],
  helpdeskHiddenColumns: [
    'email', 'parent_id', 'sla_end_date', 'sla_end_date', 'issue_type', 'sub_category_id', 'sla_time', 'level', 'sla_timer', 'channel',
    'purchase_date', 'id', 'log_note', 'last_commented_by', 'log_note_date', 'city_name', 'state_name', 'region_id', 'site_sub_categ_id',
  ],
};

export const IncidentModule = {
  incidentApiFields: [
    'ticket_number', 'create_date', 'create_uid', 'closed_by_id', 'close_time', 'incident_state',
    'person_name', 'priority_id', 'category_id', 'asset_id', 'state_id', 'sla_timer', 'sla_status', 'subject', 'type_category',
    'equipment_location_id', 'work_location', 'incident_type_id', 'sla_time', 'company_id', 'email',
  ],
  incidentColumns: [
    'ticket_number', 'category_id', 'subject', 'create_date', 'log_note', 'last_commented_by', 'log_note_date',
  ],
};

export const AssetModule = {
  assetApiFields: [
    'id', 'name', 'equipment_seq', 'category_id', 'state', 'block_id', 'floor_id', 'location_id', 'maintenance_team_id', 'equipment_number', 'model', 'purchase_date', 'serial',
    'vendor_id', 'manufacturer_id', 'warranty_start_date', 'warranty_end_date', 'monitored_by_id', 'managed_by_id', 'maintained_by_id', 'tag_status', 'validation_status', 'company_id',
    'validated_by', 'validated_on', 'is_qr_tagged', 'is_nfc_tagged', 'is_rfid_tagged', 'is_virtually_tagged', 'amc_start_date', 'amc_end_date', 'amc_type', 'brand',
  ],
  assetSearchColumns: [
    'name', 'category_id', 'equipment_seq', 'maintenance_team_id', 'model', 'maintained_by_id', 'managed_by_id', 'validation_status', 'validated_by',
    'serial', 'state', 'vendor_id', 'manufacturer_id', 'company_id',
  ],
  assetHiddenColumns: [
    'id', 'equipment_number', 'model', 'purchase_date', 'serial', 'vendor_id', 'monitored_by_id', 'managed_by_id', 'maintained_by_id', 'manufacturer_id',
    'warranty_start_date', 'warranty_end_date', 'tag_status', 'validation_status', 'validated_by', 'validated_on', 'amc_start_date', 'amc_end_date', 'amc_type',
  ],
  assetAdvanceSearchColumns: [
    'category_id', 'vendor_id', 'manufacturer_id', 'state', 'maintenance_team_id', 'company_id',
  ],
};

export const InspectionModule = {
  inspectionApiFields: [
    'uuid', 'asset_number', 'category_type', 'commences_on', 'equipment_id', 'space_id', 'group_id', 'maintenance_team_id', 'check_list_id', 'priority', 'task_id',
    'duration', 'parent_id', 'order_ids', 'starts_at', 'mo', 'tu', 'we', 'th', 'fr', 'sa', 'su',
  ],
  inspectionHiddenColumns: [
    'uuid', 'priority', 'task_id', 'parent_id', 'id',
  ],
  inspectionSearchColumns: [
    'asset_number', 'priority', 'group_id', 'uuid', 'equipment_id', 'category_type', 'maintenance_team_id',
  ],
  inspectionAdvanceSearchColumns: [
    'category_type', 'priority', 'group_id', 'maintenance_team_id',
  ],
};

export const ConfigurationModule = {
  configApiFields: [
    'name', 'parent_id', 'res_company_categ_id', 'code', 'create_date', 'city', 'country_id', 'state_id', 'street',
  ],
  configSearchColumns: [
    'name', 'code', 'parent_id',
  ],
  configAdvanceSearchColumns: [
    'res_company_categ_id',
  ],
  configHiddenColumns: [
    'id', 'city',
  ],

};

export const WorkOrdersModule = {
  workApiFields: [
    'sequence', 'asset_id', 'equipment_id', 'name', 'maintenance_team_id', 'state', 'equipment_location_id', 'priority', 'date_scheduled', 'employee_id',
    'type_category', 'task_id', 'date_planned', 'date_execution', 'create_date', 'pause_reason_id', 'description', 'equip_asset_common', 'maintenance_type',
  ],
  workSearchColumns: [
    'sequence', 'name', 'type_category', 'state', 'employee_id', 'priority', 'maintenance_team_id', 'maintenance_type',
  ],
  workAdvanceSearchColumns: [
    'state', 'priority', 'type_category', 'maintenance_team_id', 'maintenance_type',
  ],
  workHiddenColumns: [
    'id', 'employee_id', 'type_category', 'task_id', 'date_planned', 'date_execution', 'create_date', 'pause_reason_id', 'description', 'equip_asset_common',
    'maintenance_type', 'issue_type',
  ],
};

export const InventoryModule = {
  inventoryApiFields: [
    'name', 'partner_id', 'use_in', 'asset_id', 'requested_on', 'employee_id', 'space_id', 'department_id', 'note', 'request_state', 'dc_no', 'po_no', 'expires_on', 'location_id', 'location_dest_id',
  ],
  inventoryOutgoingApiFields: [
    'name', 'partner_id', 'requested_on', 'note', 'request_state', 'dc_no', 'po_no', 'location_id', 'location_dest_id',
  ],
  inventoryInternalApiFields: [
    'name', 'use_in', 'asset_id', 'space_id', 'employee_id', 'department_id', 'requested_on', 'note', 'request_state', 'location_id', 'expires_on', 'location_dest_id',
  ],
  inventoryDefaultColumnField: [
    'name', 'partner_id', 'requested_on', 'note', 'request_state',
  ],
  invenotryExtraDefaultColumnField: [
    'name', 'use_in', 'asset_id', 'space_id', 'employee_id', 'department_id', 'requested_on', 'note', 'request_state',
  ],
  inventorySearchColumn: [
    'name', 'partner_id', 'request_state', 'requested_on',
  ],
  inventoryAdvanceSearchColumn: [
    'request_state', 'requested_on',
  ],
  inventoryHiddenColumn: [
    'dc_no', 'po_no', 'expires_on', 'location_id', 'location_dest_id',
  ],
  inventoryOutgoingHiddenColumn: [
    'dc_no', 'po_no', 'location_id', 'location_dest_id',
  ],
  inventoryInternalHiddenColumn: [
    'expires_on', 'location_id', 'location_dest_id',
  ],
  stockAuditApiFields: [
    'name', 'create_uid', 'date', 'state', 'line_ids', 'location_id', 'reason_id', 'comments', 'total_qty',
  ],
  stockAuditSearchColumn: [
    'name', 'location_id', 'state', 'date',
  ],
  stockAuditAdvanceSearchColumn: [
    'state', 'date',
  ],
  stockAuditHiddenColumn: [
    'total_qty', 'reason_id', 'comments',
  ],
  scrapApiFields: [
    'name', 'create_date', 'product_id', 'scrap_qty', 'location_id', 'scrap_location_id', 'state', 'date_expected', 'origin',
  ],
  scrapSearchColumn: [
    'name', 'product_id', 'state',
  ],
  scrapAdvanceSearchColumn: [
    'state',
  ],
  scrapHiddenColumn: [],
  inventoryProductApiFields: [
    'id', 'name', 'unique_code', 'categ_id', 'qty_available', 'uom_id', 'type', 'responsible_id', 'specification', 'brand', 'preferred_vendor',
    'reordering_min_qty', 'reordering_max_qty', 'alert_level_qty', 'standard_price',
  ],
  inventoryProductFilterFields: [
    'name', 'categ_id', 'uom_id', 'type', 'responsible_id', 'preferred_vendor', 'unique_code', 'brand', 'specification',
  ],
  inventoryProductCategoryApiFields: [
    'create_date', 'name', 'parent_id', 'product_count', 'property_valuation',
  ],
  inventoryPantryCategorySearchCoumns: [
    'id', 'name', 'parent_id',
  ],
  inventoryPantryCategoryHiddenColumns: [
    'id', 'create_date',
  ],
  inventoryPantryCategoryAdvanceSearchColumn: [
    'parent_id',
  ],
  wareHouseApiFields: [
    'create_date', 'name', 'lot_stock_id', 'partner_id', 'active',
  ],
  wareHouseSearchColumn: [
    'name', 'partner_id',
  ],
  wareHouseAdvanceSearchColumn: [
    'partner_id',
  ],
  wareHouseHiddenColumn: [
    'create_date',
  ],
  locationApiFields: [
    'create_date', 'display_name', 'usage', 'location_id', 'partner_id', 'company_id', 'posx', 'posy', 'posz', 'barcode', 'active',
  ],
  locationSearchColumns: [
    'usage', 'display_name',
  ],
  locationHiddenColumns: [
    'partner_id', 'posx', 'posy', 'posz', 'barcode', 'create_date',
  ],
  locationAdvanceSearchColumn: [
    'usage',
  ],
  operationTypeApiField: [
    'create_date', 'name', 'code', 'warehouse_id', 'sequence_id', 'default_location_src_id', 'default_location_dest_id', 'barcode',
    'show_operations', 'show_reserved', 'return_picking_type_id', 'active',
  ],
  operationTypeSearchColumn: [
    'name', 'code',
  ],
  operationTypeAdvanceSearchColumn: [
    'code',
  ],
  operationTypeHiddenCoulmn: [
    'default_location_src_id', 'default_location_dest_id', 'create_date', 'code',
  ],
  reOrderingSearchColumn: [
    'name', 'product_id',
  ],
  reOrderingAdvanceSearchColumn: [
    'product_id',
  ],
  reOrderingHiddenColumn: [
    'id', 'product_max_qty', 'product_min_qty', 'product_uom',
  ],
  reOrderingColumnList: [
    'name', 'product_id', 'location_id', 'warehouse_id', 'qty_multiple',
  ],
};

export const GatePassModule = {
  gatePassApiFields: [
    'description', 'type', 'requestor_id', 'gatepass_number', 'gatepass_type', 'requested_on', 'state', 'reference', 'space_id', 'name', 'email', 'bearer_return_on',
    'approved_on', 'approved_by',
  ],
  gatePassSearchColumn: [
    'reference', 'requestor_id', 'name', 'state', 'type', 'space_id', 'gatepass_type',
  ],
  gatePassHiddenColumn: [
    'id', 'name', 'email', 'bearer_return_on', 'approved_on', 'approved_by',
  ],
  gatePassAdvanceSearchColumn: [
    'state', 'type',
  ],
};

export const VistorManagementModule = {
  visitorApiFields: [
    'company_id', 'organization', 'allowed_sites_id', 'type_of_visitor', 'host_name', 'entry_status', 'actual_in', 'actual_out', 'visitor_name',
    'state', 'name', 'planned_in', 'planned_out', 'visitor_badge', 'purpose', 'purpose_id', 'tenant_id', 'additional_fields_ids',
  ],
  visitorSearchColumns: [
    'email', 'visitor_name', 'phone', 'host_name', 'entry_status', 'state', 'type_of_visitor', 'allowed_sites_id', 'name',
  ],
  visitorAdvanceSearchColumn: [
    'entry_status', 'state', 'type_of_visitor', 'allowed_sites_id',
  ],
  visitorHiddenColumns: [
    'id', 'phone', 'email', 'type_of_visitor', 'purpose_id', 'planned_in', 'planned_out',
  ],
  visitorColumnFields: [
    'name', 'visitor_name', 'organization', 'host_name', 'allowed_sites_id', 'visitor_badge', 'actual_in', 'actual_out', 'entry_status', 'state', 'purpose',
  ],
};

export const TransactionModule = {
  transactionApiFields: [
    'name', 'commodity', 'is_requires_verification', 'state', 'company_id', 'capacity', 'vendor_id', 'initial_reading', 'final_reading', 'difference', 'tanker_id', 'sequence', 'location_id',
    'in_datetime', 'out_datetime', 'id', 'is_enable_amount',
  ],
  transactionSeachColumns: [
    'commodity', 'vendor_id', 'tanker_id',
  ],
  transactionHiddenColumns: [
    'id', 'sequence', 'location_id', 'in_datetime', 'out_datetime',
  ],
  transactionAdvanceSearchColumns: [
    'vendor_id', 'commodity',
  ],
  tankersApiFields: [
    'name', 'commodity', 'capacity', 'vendor_id', 'company_id',
  ],
  tankersSearchColumn: [
    'commodity', 'vendor_id', 'name',
  ],
  tankersAdvanceSearchColumn: [
    'vendor_id', 'commodity',
  ],
  tankersHiddenColumn: [
    'id', 'sequence', 'location_id', 'in_datetime', 'out_datetime', 'initial_reading', 'final_reading', 'difference', 'tanker_id',
  ],
};

export const MailRoomManagementModule = {
  inBoundSearchColumn: [
    'sender', 'tracking_no', 'courier_id', 'recipient', 'state',
  ],
  inBoundHiddenColumn: [
    'courier_id', 'recipient', 'department_id', 'collected_on', 'collected_by',
  ],
  inBoundAdvanceSearchColumn: [
    'recipient', 'state',
  ],
  outBoundSearchColumn: [
    'sent_to', 'tracking_no', 'courier_id', 'recipient', 'state',
  ],
  outBoundAdvanceSearchColumn: [
    'recipient', 'state',
  ],
  outBoundHiddenColumn: [
    'courier_id', 'recipient', 'department_id', 'delivered_on', 'delivered_by',
  ],
};

export const WorkPermitModule = {
  workPermitApiFields: [
    'name', 'reference','valid_through', 'vendor_id', 'state', 'planned_start_time', 'planned_end_time', 'space_id', 'equipment_id', 'nature_work_id',
    'requestor_id', 'maintenance_team_id', 'department_id', 'type', 'duration', 'type_of_request', 'work_location', 'work_technician_ids',
  ],
  workPermitSearchColumn: [
    'name', 'reference', 'vendor_id', 'state', 'nature_work_id', 'maintenance_team_id', 'department_id',
  ],
  workPermitHiddenColumn: [
    'id', 'requestor_id', 'maintenance_team_id', 'type', 'duration',
  ],
  workPermitAdvanceSearchColumn: [
    'state', 'vendor_id', 'nature_work_id', 'maintenance_team_id',
  ],
  natureWorkAPiFields: [
    'name',
    'id',
    'task_id',
    'preparedness_checklist_id',
    'issue_permit_checklist_id',
    'approval_authority_id',
    'issue_permit_approval_id',
    'ehs_authority_id',
    'security_office_id',
    'type_of_request',
    'is_can_be_extended',
    'ehs_instructions',
    'company_id',
    'ehs_instructions',
    'terms_conditions',
  ],
  natureWorkSearchColumn: [
    'id', 'name', 'reference',
  ],
  natureWorKAdvanceSearchColumn: [],
  natureWorkHiddenColumn: [
    'id', 'company_id', 'ehs_instructions',
  ],
  checkListApiFields: [
    'name',
    'active',
    'create_date',
    'company_id',
  ],
  checkListSearchColumn: [
    'name',
  ],
  checkListAdvanceSearchColumn: [],
  checkListHiddenColumn: [
    'id', 'company_id', 'ehs_instructions',
  ],
};

export const AuditSystemModule = {
  auditAPiFields: [
    'reference', 'name', 'date', 'state', 'audit_system_id', 'facility_manager_id', 'create_date',
  ],
  auditSearchColumn: [
    'id', 'reference', 'name', 'audit_system_id', 'state',
  ],
  auditAdvanceSearchColumn: [
    'audit_system_id', 'state',
  ],
  auditHiddenColumn: [
    'id', 'create_date',
  ],
  actionApiFields: [
    'name',
    'date_deadline',
    'type_action',
    'audit_id',
    'user_id',
    'helpdesk_id',
    'state',
    'create_date',
  ],
  actionSearchColumn: [
    'id', 'type_action', 'name', 'audit_id', 'state',
  ],
  actionAdvanceSearchColumn: [
    'type_action', 'state', 'audit_id',
  ],
  actionHiddenColumn: [
    'id', 'create_date',
  ],
};

export const PantryModule = {
  ordersAPiFields: [
    'name', 'employee_id', 'pantry_id', 'space_id', 'ordered_on', 'state', 'confirmed_on', 'cancelled_on', 'delivered_on', 'employee_name',
  ],
  ordersSearchColumn: [
    'id', 'name', 'employee_id', 'pantry_id', 'space_id', 'state',
  ],
  ordersAdvanceSearchColumn: [
    'state', 'employee_id', 'pantry_id', 'space_id',
  ],
  ordersHiddenColumn: [
    'id', 'ordered_on', 'confirmed_on', 'cancelled_on', 'delivered_on',
  ],
  pantryApiFields: [
    'create_date', 'name', 'pantry_sequence', 'maintenance_team_id', 'resource_calendar_id', 'state', 'company_id',
  ],
  pantrySearchColumn: [
    'id', 'name', 'pantry_sequence', 'maintenance_team_id',
  ],
  pantryAdvanceSearchColumn: [
    'maintenance_team_id',
  ],
  pantryHiddenColumn: [
    'id', 'create_date',
  ],
  pantryProductApiFields: [
    'name', 'categ_id', 'pantry_ids', 'minimum_order_qty', 'maximum_order_qty', 'active', 'weight', 'volume', 'new_until',
    'company_id', 'uom_id.name', 'uom_po_id.name', 'image_medium', 'create_date',
  ],
  pantryProductSearchColumn: [
    'id', 'name', 'active',
  ],
  pantryProdcutAdvanceSearchCOlumn: [
    'active',
  ],
  pantryProductHiddenColumn: [
    'id', 'active', 'weight', 'volume', 'new_until', 'company_id.name', 'create_date', 'image_medium', 'uom_id.name', 'uom_po_id.name',
  ],
};

export const SurveyModule = {
  surveyApiField: [
    'id', 'title', 'stage_id', 'user_input_ids', 'category_type', 'tot_sent_survey', 'tot_start_survey', 'tot_comp_survey', 'uuid', 'create_date', 'is_send_email',
  ],
  surveySearchColumn: [
    'title', 'stage_id', 'category_type',
  ],
  surveyHiddenColumn: [
    'id', 'user_input_ids', 'category_type', 'tot_sent_survey', 'tot_start_survey',
  ],
  surveyAdvanceSearchColumn: [
    'stage_id', 'category_type',
  ],
};

export const BuildingComplianceModule = {
  buildingApiFields: [
    'name', 'compliance_id', 'compliance_act', 'submitted_to', 'state', 'company_id', 'next_expiry_date', 'create_date',
    'applies_to', 'sla_status', 'compliance_category_id', 'license_number', 'type', 'description', 'is_renewed', 'last_renewed_by', 'last_renewed_on',
  ],
  buildingSearchColumn: [
    'name', 'compliance_act', 'company_id', 'compliance_category_id', 'state', 'applies_to', 'license_number', 'type',
  ],
  buildingAdvanceSearchColumn: [
    'compliance_category_id', 'applies_to', 'state', 'type',
  ],
  buildingHiddenColumn: [
    'id', 'compliance_category_id', 'sla_status', 'applies_to', 'create_date', 'company_id',
  ],
};

export const BuildingComplianceTempModule = {
  buildingApiFields: [
    'name', 'compliance_act', 'submitted_to', 'company_id', 'create_date', 'compliance_category_id', 'type',
  ],
  buildingSearchColumn: [
    'name', 'compliance_act', 'company_id', 'compliance_category_id', 'type', 'submitted_to',
  ],
  buildingAdvanceSearchColumn: [
    'compliance_category_id', 'type',
  ],
  buildingHiddenColumn: [
    'id', 'create_date', 'company_id',
  ],
};

export const WasteModule = {
  buildingApiFields: [
    'name', 'operation', 'type', 'weight', 'logged_on', 'company_id', 'vendor', 'create_date',
    'tenant', 'carried_by', 'accompanied_by', 'security_by',
  ],
  buildingSearchColumn: [
    'operation', 'type', 'vendor', 'tenant',
  ],
  buildingAdvanceSearchColumn: [
    'operation',
  ],
  buildingHiddenColumn: [
    'id', 'name', 'create_date', 'carried_by', 'company_id', 'accompanied_by', 'security_by',
  ],
};

export const AdminSetupModule = {
  adminSearchColumn: [
    'name', 'email', 'company_id', 'role_ids',
  ],
  adminAdvanceSearchColumn: [
    'company_id', 'role_ids',
  ],
  adminHiddenColumn: [
    'mobile', 'active',
  ],
  maintenanceApiFields: [
    'name', 'company_id', 'employee_id', 'maintenance_cost_analytic_account_id', 'team_type', 'member_ids', 'team_category_id',
    'labour_cost_unit', 'resource_calendar_id', 'responsible_id', 'location_ids',
  ],
  maintenanceSearchColumn: [
    'name',
  ],
  maintenanceHiddenColumn: [
    'team_type', 'labour_cost_unit', 'company_id[1]',
  ],
  maintenanceAdvanceSearchColumn: [],
  operationApiFields: [
    'id',
    'name',
    'order_duration',
    'maintenance_type',
    'active',
    'create_date',
    'company_id',
    'type_category',
  ],
  operationSearchColumn: [
    'name', 'maintenance_type',
  ],
  operationAdvanceSearchColumn: [
    'maintenance_type',
  ],
  operationHiddenColumn: [
    'id', 'type_category', 'company_id',
  ],
  buildingApiFields: [
    'id',
    'space_name',
    'sequence_asset_hierarchy',
    'max_occupancy',
    'area_sqft',
    'parent_id',
    'floor_id',
    'block_id',
  ],
};

export const HRModule = {
  hrFields: [
    'name',
    'team_category_id',
    'employee_id',
    'maintenance_cost_analytic_account_id',
    'team_type',
    'labour_cost_unit',
    'company_id',
  ],
};

export const ConsumptionTrackerModule = {
  apiFields: [
    'name', 'audit_for', 'temp_type_id', 'company_id', 'tracker_template_id', 'start_date', 'end_date', 'state', 'id', 'created_by_id', 'created_on', 'reviewed_by_id', 'reviewed_on', 'approved_by_id', 'approved_on',
  ],
  searchColumns: [
    'name', 'audit_for', 'tracker_template_id', 'state', 'temp_type_id',
  ],
  advanceSearchColumns: [
    'state',
  ],
  hiddenColumns: [
    'id', 'created_by_id', 'created_on', 'reviewed_by_id', 'reviewed_on', 'approved_by_id', 'approved_on',
  ],
};

export const IncidentNewModule = {
  apiFields: [
    'reference',
    'name',
    'state',
    'category_id',
    'severity_id',
    'priority_id',
    'probability_id',
    'incident_type_id',
    'incident_on',
    'maintenance_team_id',
    'target_closure_date',
    'company_id',
    'sub_category_id',
    'assigned_id',
    'reported_by_id',
    'reported_on',
    'acknowledged_by_id',
    'acknowledged_on',
    'resolved_by_id',
    'resolved_on',
    'validated_by_id',
    'validated_on',
  ],
  searchColumns: [
    'name', 'category_id', 'tracker_template_id', 'state', 'severity_id',
  ],
  advanceSearchColumns: [
    'state',
  ],
  hiddenColumns: [
    'id', 'sub_category_id', 'corrective_action', 'assigned_id', 'reported_by_id', 'reported_on', 'acknowledged_by_id', 'acknowledged_on', 'resolved_by_id', 'resolved_on', 'validated_by_id', 'validated_on',
  ],
};

export const HxAuditActionModule = {
  apiFields: [
    'name',
    'state',
    'category_id',
    'severity',
    'type',
    'sla_status',
    'company_id',
    'responsible_id',
    'deadline',
    'audit_id',
    'resolution',
    'description',
  ],
  searchColumns: [
    'name', 'category_id', 'audit_id', 'state', 'severity',
  ],
  advanceSearchColumns: [
    'state',
  ],
  hiddenColumns: [
    'id', 'resolution', 'description',
  ],
};

export const HxInspCancelModule = {
  apiFields: [
    'requested_by_id',
    'requested_on',
    'expires_on',
    'state',
    'reason',
    'remarks',
    'company_id',
    'approved_by_id',
    'approved_on',
    'cancel_approval_authority',
    'is_cancel_for_all_assets',
    'from_date',
    'to_date'
  ],
  searchColumns: [
    'name', 'category_id', 'audit_id', 'state', 'severity',
  ],
  advanceSearchColumns: [
    'state',
  ],
  hiddenColumns: [
    'id', 'resolution', 'description',
  ],
};

export const HxPPMCancelModule = {
  apiFields: [
    'requested_by_id',
    'requested_on',
    'expires_on',
    'state',
    'remarks',
    'reason',
    'company_id',
    'approved_by_id',
    'approved_on',
    'cancel_approval_authority',
  ],
  searchColumns: [
    'name', 'category_id', 'audit_id', 'state', 'severity',
  ],
  advanceSearchColumns: [
    'state',
  ],
  hiddenColumns: [
    'id', 'resolution', 'description',
  ],
};

export const HxAuditSystemModule = {
  apiFields: [
    'name',
    'state',
    'short_code',
    'department_id',
    'scope',
    'objective',
    'create_date',
    'company_id',
    'overall_score',
  ],
  searchColumns: [
    'name', 'short_code', 'scope', 'state', 'department_id',
  ],
  advanceSearchColumns: [
    'state',
  ],
  hiddenColumns: [
    'id', 'company_id', 'overall_score',
  ],
};

export const HxAuditorsModule = {
  apiFields: [
    'name',
    'email',
    'type',
    'mobile',
    'certification_status',
    'certificate_expires_on',
    'platform_access',
    'create_date',
    'company_id',
  ],
  searchColumns: [
    'name', 'short_code', 'scope', 'state', 'department_id',
  ],
  advanceSearchColumns: [
    'state',
  ],
  hiddenColumns: [
    'id', 'company_id', 'overall_score',
  ],
};

export const HazardModule = {
  buildingApiFields: [
    'reference',
    'name',
    'state',
    'type_category',
    'asset_id',
    'equipment_id',
    'category_id',
    'priority_id',
    'description',
    'incident_type_id',
    'incident_on',
    'maintenance_team_id',
    'target_closure_date',
    'company_id',
    'assigned_id',
    'reported_by_id',
    'reported_on',
    'acknowledged_by_id',
    'acknowledged_on',
    'resolved_by_id',
    'resolved_on',
    'validated_by_id',
    'validated_on',
  ],
  buildingSearchColumn: [
    'name', 'category_id', 'state',
  ],
  buildingAdvanceSearchColumn: [
    'state',
  ],
  buildingHiddenColumn: [
    'id', 'corrective_action', 'reported_by_id', 'acknowledged_by_id', 'acknowledged_on', 'resolved_by_id', 'resolved_on', 'validated_by_id', 'validated_on',
  ],
};

export const AdminSetupFacilityModule = {
  teamListApiFields: [
    'id',
    'name',
    'company_id',
    'maintenance_cost_analytic_account_id',
    'team_category_id',
    'resource_calendar_id',
  ],
  assetApiFields: '[\'id\',\'name\',\'equipment_seq\',(\'category_id\', [\'id\', \'name\']),(\'block_id\', [\'id\', \'space_name\']),(\'floor_id\', [\'id\', \'space_name\']),(\'location_id\', [\'id\', \'path_name\', \'space_name\']),(\'maintenance_team_id\', [\'id\', \'name\'])]',
};

export const AttendanceModule = {
  logApiFields: [
    'id',
    'employee_id',
    'create_date',
    'type',
    'valid',
    'vendor_id',
    'device_id',
    'department_id',
  ],
};
