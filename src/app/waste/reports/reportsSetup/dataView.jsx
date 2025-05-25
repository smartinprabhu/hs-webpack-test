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
import { Tooltip } from 'antd';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import ErrorContent from '@shared/errorContent';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
  getListOfModuleOperations, truncateFrontSlashs, getColumnArrayById,
  truncateStars, truncate, queryGeneratorWithUtc, getAllCompanies,
} from '../../../util/appUtils';
import {
  getHelpdeskReportsNoLoad,
} from '../../../helpdesk/ticketService';
import { getReportFilters, resetWasteReport, getWasteReports } from '../../complianceService';
import filtersFields from '../../data/filtersFields.json';
import './stickyTable.css';
// import StaticDataExport from '../../dataExport/staticDataExport';
import CommonGrid from '../../../commonComponents/commonGridStaticData';
import { WasteColumns } from '../../../commonComponents/gridColumns';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const appModels = require('../../../util/appModels').default;

const DataView = React.memo((props) => {
  const {
    afterReset, reportName, collapse,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const [columnsList, setColumnsList] = useState(filtersFields.columns);

  const { maintenanceConfigurationData } = useSelector((state) => state.ticket);

  const { wasteReportFilters, wasteReportsInfo } = useSelector((state) => state.waste);

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  const isTenant = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_tenant;

  useEffect(() => {
    if (maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
      && maintenanceConfigurationData.data.length) {
      if (!isVendorShow && !isTenant) {
        setColumnsList(columnsList.filter((item) => item.accessor !== 'vendor_id' && item.accessor !== 'tenant_name'));
      } else if (!isTenant && isVendorShow) {
        setColumnsList(columnsList.filter((item) => item.accessor !== 'tenant_name'));
      } else if (!isVendorShow && isTenant) {
        setColumnsList(columnsList.filter((item) => item.accessor !== 'vendor_id'));
      }
    }
  }, [maintenanceConfigurationData]);

  const allFields = getColumnArrayById(columnsList, 'accessor');
  const showFields = allFields;

  const limit = 10;
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(0);
  const [columnsFields, setColumns] = useState(showFields);
  const [visibleColumns, setVisibleColumns] = useState({});
  const companies = getAllCompanies(userInfo, userRoles);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inspection Schedule', 'code');
  // const isExportable = allowedOperations.includes(actionCodes['Inspection Checklist Report Export']);

  const redirectToAllReports = () => {
    dispatch(resetWasteReport());
    dispatch(getReportFilters([]));
    if (afterReset) afterReset();
  };

  const refresh = () => {
    if (userInfo && userInfo.data) {
      const customFiltersList = wasteReportFilters.customFilters ? queryGeneratorWithUtc(wasteReportFilters.customFilters, 'create_date', userInfo.data) : '';
      const detailFields = columnsList;
      const fields = getColumnArrayById(detailFields, 'accessor');
      dispatch(getHelpdeskReportsNoLoad(companies, appModels.WASTETRACKER, fields, customFiltersList, false, false));
    }
  };

  function showCustomizedLabel(item, col) {
    let value = '';
    if (typeof item[col.accessor] === 'object') {
      const array = item[col.accessor];
      // eslint-disable-next-line no-unused-vars
      const [id, name] = array;
      value = name;
    } else {
      if (col.accessor === 'description') {
        value = item[col.accessor] && item[col.accessor].length && item[col.accessor].length > 30
          ? (
            <Tooltip title={truncateFrontSlashs(truncateStars(item[col.accessor]))}>
              {truncateFrontSlashs(truncateStars(truncate(item[col.accessor], 30)))}
            </Tooltip>
          )
          : truncateFrontSlashs(truncateStars(item[col.accessor]));// <Markup content={truncateFrontSlashs(truncateStars(item[col.property]))} />;
      } else if (col.accessor === 'constraints') {
        value = item[col.accessor] && item[col.accessor].length && item[col.accessor].length > 30
          ? (
            <Tooltip title={truncateFrontSlashs(truncateStars(item[col.accessor]))}>
              {truncateFrontSlashs(truncateStars(truncate(item[col.accessor], 30)))}
            </Tooltip>
          )
          : truncateFrontSlashs(truncateStars(item[col.accessor]));// <Markup content={truncateFrontSlashs(truncateStars(item[col.property]))} />;
      } else if (col.accessor === 'log_note') {
        value = item[col.accessor] && item[col.accessor].length && item[col.accessor].length > 30
          ? (
            <Tooltip title={truncateFrontSlashs(truncateStars(item[col.accessor]))}>
              {truncateFrontSlashs(truncateStars(truncate(item[col.accessor], 30)))}
            </Tooltip>
          )
          : truncateFrontSlashs(truncateStars(item[col.accessor]));
      } else if (col.accessor === 'asset_id') {
        value = item.type_category === 'asset' ? item.asset_id : item?.equipment_location_id?.[1];
      } else if (col.dateDisplayType) {
        value = item[col.accessor] ? getCompanyTimezoneDate(item[col.accessor], userInfo, col.dateDisplayType) : '-';
      } else {
        value = getDefaultNoValue(item[col.accessor]);
      }
    }
    return value;
  }

  const repData = useMemo(() => (wasteReportsInfo?.data?.length ? wasteReportsInfo.data : []), [wasteReportsInfo]);
  const emptyData = wasteReportsInfo && !wasteReportsInfo.err && !wasteReportsInfo.data && !wasteReportsInfo.loading;
  const loading = (userInfo && userInfo.loading) || (wasteReportsInfo && wasteReportsInfo.loading);

  const { sortedValue } = useSelector((state) => state.equipment);

  // useEffect(() => {
  //   const customFilters = [{
  //     key: 'Today', value: 'Today', label: 'Today', type: 'date', title: 'date',
  //   }];
  //   const customFiltersList = queryGeneratorWithUtc(customFilters, 'create_date', userInfo.data);
  //   const fields = getColumnArrayById(filtersFields.columns, 'accessor');
  //   dispatch(getReportFilters(customFilters));
  //   dispatch(getWasteReports(companies, appModels.WASTETRACKER, fields, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
  // }, [sortedValue.sortBy, sortedValue.sortField]);

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
        person_name: true,
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
    // const offsetValue = page * limit;
    // const endValue = offsetValue + limit;
    setPage(page);
  };

  /* useEffect(() => {
    if (repData.length) {
      setPageData(repData.length ? repData.length > 10 ? repData.slice(0, 10) : repData : []);
    } else {
      setPageData([]);
    }
  }, [repData]); */

  return (
    <Box sx={{ fontFeatureSettings: 'Suisse Intl', position: 'sticky' }}>
      <Box sx={{ backgroundColor: '#fff', borderLeft: '1px solid #0000001f', padding: '10px 0px 10px 18px' }}>
        <div className="pt-2 pl-0 pb-0">
          {wasteReportFilters && wasteReportFilters.customFilters && wasteReportFilters.customFilters.length > 0 && (
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
          {wasteReportFilters && wasteReportFilters.customFilters && wasteReportFilters.customFilters.length > 0 ? wasteReportFilters.customFilters.map((cf) => (
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
      {wasteReportFilters && wasteReportFilters.customFilters && wasteReportFilters.customFilters.length > 0 ? (
        <CommonGrid
          className="reports-table"
          componentClassName="commonGrid"
          tableData={repData}
          page={page}
          columns={WasteColumns()}
          rowCount={repData.length}
          limit={limit}
          checkboxSelection
          pagination
          disableRowSelectionOnClick
          exportFileName="Waste Detail Report"
          listCount={wasteReportsInfo && wasteReportsInfo.data && wasteReportsInfo.data.length}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          loading={wasteReportsInfo && wasteReportsInfo.loading}
          err={wasteReportsInfo && wasteReportsInfo.err}
          noHeader
          disableFilters
          handlePageChange={handlePageChange}
        />
      )
        : <ErrorContent errorTxt="No Data Found" />}

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
