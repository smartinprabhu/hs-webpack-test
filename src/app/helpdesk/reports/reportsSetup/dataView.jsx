/* eslint-disable max-len */
/* eslint-disable no-lonely-if */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect, useMemo } from 'react';
import * as PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';

import {
  getCompanyTimezoneDate,
  isJsonString, getJsonString,
  getTenentOptions,
} from '../../../util/appUtils';
import './stickyTable.css';
import CommonGrid from '../../../commonComponents/commonGrid';
import { TicketsColumnsReports, TicketsDynamicColumns } from '../../../commonComponents/gridColumns';

const DataView = React.memo((props) => {
  const {
    afterReset, activeFilter, activeTemplate, reportName, collapse,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  const [tableColumns, setTableColumns] = useState(TicketsColumnsReports());

  const {
    moduleFilters, helpdeskReportFilters, tenantConfig, helpdeskDetailReportInfo, maintenanceConfigurationData,
  } = useSelector((state) => state.ticket);

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  let isTenant = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].tenant_visible && maintenanceConfigurationData.data[0].tenant_visible !== 'None';

  const configData = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0];

  let isChannelVisible = configData && configData.channel_visible !== 'None';
  let isTicketTypeVisible = configData && configData.ticket_type_visible !== 'None';
  let isTeamVisible = configData && configData.maintenance_team_visible !== 'None';

  if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant' && getTenentOptions(userInfo, tenantConfig)) {
    const tConfig = getTenentOptions(userInfo, tenantConfig);
    isTenant = tConfig.tenant_visible !== 'None';
    isChannelVisible = tConfig.channel_visible !== 'None';
    isTicketTypeVisible = tConfig.ticket_type_visible !== 'None';
    isTeamVisible = tConfig.maintenance_team_visible !== 'None';
  }

  useEffect(() => {
    if (maintenanceConfigurationData && maintenanceConfigurationData.data) {
      setTableColumns(TicketsColumnsReports(isVendorShow, isTenant, isTicketTypeVisible, isChannelVisible, isTeamVisible));
    }
  }, [maintenanceConfigurationData]);

  const limit = 10;
  const [page, setPage] = useState(0);
  // const [columnsFields, setColumns] = useState(showFields);
  const [visibleColumns, setVisibleColumns] = useState({});

  useEffect(() => {
    if (!(activeFilter || (helpdeskReportFilters && helpdeskReportFilters.customFilters && helpdeskReportFilters.customFilters.length > 0))) {
      setPage(0);
    }
  }, [activeFilter, helpdeskReportFilters]);

  const repData = useMemo(() => (helpdeskDetailReportInfo?.data?.length ? helpdeskDetailReportInfo.data : []), [helpdeskDetailReportInfo]);
  const emptyData = helpdeskDetailReportInfo && !helpdeskDetailReportInfo.err && !helpdeskDetailReportInfo.data && !helpdeskDetailReportInfo.loading;
  const loading = (userInfo && userInfo.loading) || (helpdeskDetailReportInfo && helpdeskDetailReportInfo.loading);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        ticket_number: true,
        subject: true,
        log_note: true,
        last_commented_by: true,
        log_note_date: true,
        state_id: true,
        maintenance_team_id: true,
        asset_id: true,
        priority_id: true,
        category_id: true,
        description: true,
        create_date: true,
        create_uid: true,
        requestee_id: true,
        closed_by_id: true,
        close_time: true,
        channel: true,
        sla_status: true,
        sub_category_id: true,
        issue_type: true,
        sla_end_date: true,
        parent_id: true,
        company_id: true,
        email: true,
        vendor_id: true,
        tenant_name: true,
        region_id: true,
        city_name: true,
        state_name: true,
        site_sub_categ_id: true,
        constraints: true,
        cost: true,
        ticket_type: true,
      });
    }
  }, [visibleColumns]);

  const handlePageChange = (page) => {
  //  const offsetValue = page * limit;
    setPage(page);
    // setPageData(repData ? repData.slice(offsetValue, (offsetValue + limit)) : 0);
  };

  /* useEffect(() => {
    if (repData && repData.length) {
      setPageData(repData.length ? repData.length > 10 ? repData.slice(0, 10) : repData : []);
    } else {
      setPageData([]);
    }
  }, [helpdeskDetailReportInfo]); */

  function getActiveFilterName() {
    const data = moduleFilters && moduleFilters.data ? moduleFilters.data : [];
    const fData = data.filter(
      (item) => item.domain === activeFilter,
    );
    return fData && fData.length && fData[0].name ? fData[0].name : '';
  }

  function getActiveDataFields() {
    const data = moduleFilters && moduleFilters.data ? moduleFilters.data : [];
    let fData = data.filter(
      (item) => item.domain === activeFilter,
    );
    if (activeTemplate) {
      fData = data.filter(
        (item) => item.name === activeTemplate,
      );
    }
    return fData && fData.length && fData[0].custom_fields && isJsonString(fData[0].custom_fields) && getJsonString(fData[0].custom_fields).field_mappings ? getJsonString(fData[0].custom_fields).field_mappings : false;
  }

  return (
    <Box sx={{ fontFeatureSettings: 'Suisse Intl', position: 'sticky' }}>
      {(activeFilter || (helpdeskReportFilters && helpdeskReportFilters.customFilters && helpdeskReportFilters.customFilters.length > 0)) && (
        <Box sx={{ backgroundColor: '#fff', borderLeft: '1px solid #0000001f', padding: '10px 0px 10px 18px' }}>
          <div className="pt-2 pl-0 pb-0">
            {helpdeskReportFilters && helpdeskReportFilters.customFilters && helpdeskReportFilters.customFilters.length > 0 && (
              <>
                <p className="m-0">
                  Total Records :
                  {' '}
                  {repData && !loading && repData.length > 0 ? repData.length : 0}
                  {' '}
                </p>
                <span className="mr-2">Filters : </span>
              </>
            )}
            {activeFilter && (
              <>
                <span className="mr-2">Filters : </span>
                <span className="mr-2 content-inline font-tiny">{getActiveFilterName()}</span>
              </>
            )}
            {!activeFilter && helpdeskReportFilters && helpdeskReportFilters.customFilters && helpdeskReportFilters.customFilters.length > 0 ? helpdeskReportFilters.customFilters.map((cf) => (
              <span key={cf.value} className="mr-2 content-inline font-tiny">

                {(cf.type === 'inarray') ? (
                  <>
                    {cf.title}
                    <span>
                      {'  '}
                      :
                      {' '}
                      {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
                    </span>
                  </>
                ) : (
                  <>
                    {cf.type === 'date' && (
                      <>
                        Created On :
                        {' '}
                      </>
                    )}
                    {cf.label}
                  </>

                )}
                {' '}
                {(cf.type === 'text' || cf.type === 'id') && (
                  <span>
                    {'  '}
                    :
                    {' '}
                    {decodeURIComponent(cf.value)}
                  </span>
                )}
                {(cf.type === 'customdate' && cf.key !== 'date') && (
                  <span>
                    {'  '}
                    :
                    {' '}
                    {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                    {' - '}
                    {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                  </span>
                )}
                {(cf.type === 'customdate' && cf.key === 'date') && (
                  <span>
                    {'  '}
                    :
                    {' '}
                    {decodeURIComponent(cf.arrayLabel ? cf.value : cf.value)}
                  </span>
                )}

              </span>
            )) : ''}
          </div>
        </Box>
      )}
      <CommonGrid
        className="reports-table"
        componentClassName="commonGrid"
        tableData={repData}
        page={page}
        columns={getActiveDataFields() ? TicketsDynamicColumns(getActiveDataFields(), isVendorShow, isTenant, isTicketTypeVisible, isChannelVisible, isTeamVisible) : tableColumns}
        rowCount={repData ? repData.length : 0}
        limit={limit}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        exportFileName="Tickets Detail Report"
        listCount={helpdeskDetailReportInfo && helpdeskDetailReportInfo.data && helpdeskDetailReportInfo.data.length}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        loading={helpdeskDetailReportInfo && helpdeskDetailReportInfo.loading}
        err={helpdeskDetailReportInfo && helpdeskDetailReportInfo.err}
        noHeader
        disableFilters
        handlePageChange={handlePageChange}
      />
    </Box>
  );
});

DataView.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
DataView.defaultProps = {
  collapse: false,
};

export default DataView;
