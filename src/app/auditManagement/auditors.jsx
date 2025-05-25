/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */

import { Box } from '@mui/system';
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AddThemeBackgroundColor } from '../themes/theme';
import CommonGrid from '../commonComponents/commonGrid';
import { HxAuditorsColumns } from '../commonComponents/gridColumns';

import {
  getAllCompanies,
  getCompanyAccessLevel,
  getDateAndTimeForDifferentTimeZones,
  queryGeneratorWithUtc, debounce, getNewDataGridFilterArray,
} from '../util/appUtils';
import { HxAuditorsModule } from '../util/field';
import {
  filterStringGenerator,
} from './utils/utils';
import {
  getHxAuditorsCount,
  getHxAuditorsExport,
  getAuditorsFilters, getHxAuditorsList,
} from './auditService';

const appModels = require('../util/appModels').default;

const Auditors = (props) => {
  const { match } = props;
  const { params } = match;
  const uuid = params && params.uuid ? params.uuid : false;
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);

  const [viewId, setViewId] = useState(false);
  const [reload, setReload] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const { apiFields } = HxAuditorsModule;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    hxAuditorsConfigCount, hxAuditorsConfigList, hxAuditorsConfigCountLoading,
    hxAuditorsFilters, hxAuditorsExportConfigList, hxAuditConfig,
  } = useSelector((state) => state.hxAudits);

  const configData = hxAuditConfig && hxAuditConfig.data && hxAuditConfig.data.length ? hxAuditConfig.data[0] : false;

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        email: true,
        type: true,
        certification_status: true,
        certificate_expires_on: true,
        platform_access: true,
        mobile: false,
        create_date: false,
        company_id: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (hxAuditorsFilters && hxAuditorsFilters.customFilters) {
      setCustomFilters(hxAuditorsFilters.customFilters);
    }
  }, [hxAuditorsFilters]);

  useEffect(() => {
    if (
      customFilters
      && customFilters.length
      && valueArray
      && valueArray.length === 0
    ) {
      setValueArray(customFilters);
    }
  }, [customFilters]);

  useEffect(() => {
    if (reload) {
      dispatch(getAuditorsFilters([]));
      setCustomFilters([]);
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      const customFiltersList = '';
    }
  }, [reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (hxAuditorsConfigCount && hxAuditorsConfigCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = hxAuditorsFilters && hxAuditorsFilters.customFilters ? queryGeneratorWithUtc(hxAuditorsFilters.customFilters, 'create_date', userInfo.data) : '';
      const accessLevel = getCompanyAccessLevel(configData && configData.auditors_access ? configData.auditors_access : '', userInfo);
      dispatch(getHxAuditorsExport(accessLevel, appModels.HXAUDITORS, hxAuditorsConfigCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [startExport]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = hxAuditorsFilters.customFilters ? queryGeneratorWithUtc(hxAuditorsFilters.customFilters, 'create_date', userInfo.data) : '';
      const accessLevel = getCompanyAccessLevel(configData && configData.auditors_access ? configData.auditors_access : '', userInfo);
      dispatch(getHxAuditorsCount(accessLevel, appModels.HXAUDITORS, false, customFiltersList, globalFilter));
    }
  }, [userInfo, hxAuditorsFilters.customFilters, hxAuditConfig]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = hxAuditorsFilters.customFilters ? queryGeneratorWithUtc(hxAuditorsFilters.customFilters, 'create_date', userInfo.data) : '';
      setCheckRows([]);
      const accessLevel = getCompanyAccessLevel(configData && configData.auditors_access ? configData.auditors_access : '', userInfo);
      dispatch(getHxAuditorsList(accessLevel, appModels.HXAUDITORS, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, hxAuditorsFilters.customFilters, hxAuditConfig]);

  const totalDataCount = hxAuditorsConfigCount && hxAuditorsConfigCount.length ? hxAuditorsConfigCount.length : 0;

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = hxAuditorsFilters && hxAuditorsFilters.customFilters ? hxAuditorsFilters.customFilters : [];
      setCustomFiltersList(filters);
      const filterValues = {
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
      };
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getAuditorsFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item.type !== 'date' && item.type !== 'customdate'));
      const filterValues = {
        customFilters: customFiltersList.filter((item) => item.type !== 'date' && item.type !== 'customdate'),
      };
      setValueArray(
        valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
      );
      dispatch(getAuditorsFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];
    const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
      userInfo,
      startDate,
      endDate,
    );

    if (startDate && endDate) {
      start = getDateRangeObj[0];
      end = getDateRangeObj[1];
    }
    if (startDate && endDate) {
      filters = [
        {
          key: value,
          value,
          label: value,
          type: 'customdate',
          start,
          end,
          Header: value,
          id: value,
        },
      ];
    }
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = hxAuditorsFilters && hxAuditorsFilters.customFilters
        ? hxAuditorsFilters.customFilters
        : [];
      const filterValues = {
        states:
        hxAuditorsFilters && hxAuditorsFilters.states ? hxAuditorsFilters.states : [],
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
        // customFilters: [
        //   ...oldCustomFilters.filter(
        //     (item) => item.type !== 'date'
        //       && item.type !== 'customdate'
        //       && item.type !== 'datearray',
        //   ),
        //   ...filters,
        // ],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getAuditorsFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = hxAuditorsFilters && hxAuditorsFilters.customFilters
        ? hxAuditorsFilters.customFilters
        : [];
      const filterValues = {
        states:
        hxAuditorsFilters && hxAuditorsFilters.states ? hxAuditorsFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getAuditorsFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const loading = (userInfo && userInfo.loading) || (hxAuditorsConfigList && hxAuditorsConfigList.loading) || (hxAuditorsConfigCountLoading);

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter(
      (item) => item.value !== cfValue,
    );
    dispatch(getAuditorsFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const valueCheck = (dataArray) => {
    let returnValue = true;
    dataArray.map((item) => {
      if (!item.value) {
        returnValue = false;
      }
    });
    return returnValue;
  };

  const onFilterChange = (data) => {
    const fields = [
      'name',
      'email',
      'type',
      'mobile',
      'certification_status',
      'platform_access',
      'company_id',
    ];
    let query = '"|","|","|","|","|","|",';

    const oldCustomFilters = hxAuditorsFilters && hxAuditorsFilters.customFilters
      ? hxAuditorsFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      fields.filter((field) => {
        query += `["${field}","ilike","${data.quickFilterValues[0]}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }
    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        let uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'field'),
        );
        uniqueCustomFilter = getNewDataGridFilterArray(HxAuditorsColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getAuditorsFilters({ customFilters }));
        setOffset(0);
        setPage(0);
      } else {
        const fData = data.items.filter((item) => item.value);
        if (fData && fData.length) {
          let uniqueCustomFilter = _.reverse(
            _.uniqBy(_.reverse([...fData]), 'field'),
          );
          uniqueCustomFilter = getNewDataGridFilterArray(HxAuditorsColumns(), uniqueCustomFilter);
          const customFilters = [...dateFilters, ...uniqueCustomFilter];
          dispatch(getAuditorsFilters({ customFilters }));
          setOffset(0);
          setPage(0);
        } else {
          const CustomFilters = [...dateFilters];
          dispatch(getAuditorsFilters({ customFilters: CustomFilters }));
          setOffset(0);
          setPage(0);
        }
      }
    } else {
      const CustomFilters = [...dateFilters];
      dispatch(getAuditorsFilters({ customFilters: CustomFilters }));
      setOffset(0);
      setPage(0);
    }
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [hxAuditorsFilters],
  );

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        /* sx={{
         height: '90%',
       }} */
        tableData={
            hxAuditorsConfigList && hxAuditorsConfigList.data && hxAuditorsConfigList.data.length
              ? hxAuditorsConfigList.data
              : []
        }
        columns={HxAuditorsColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Auditors List"
        exportFileName="Auditors"
        listCount={totalDataCount}
        exportInfo={{ err: hxAuditorsExportConfigList.err, loading: hxAuditorsExportConfigList.loading, data: hxAuditorsExportConfigList.data ? hxAuditorsExportConfigList.data : false }}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: false,
          text: 'Create an Auditor',
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        filters={filterStringGenerator(hxAuditorsFilters)}
        onFilterChanges={debouncedOnFilterChange}
        loading={hxAuditorsConfigList && hxAuditorsConfigList.loading}
        err={hxAuditorsConfigList && hxAuditorsConfigList.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        placeholderText="Search Name, Type ..."
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              (cf.type === 'id' && cf.label && cf.label !== '')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'text' || cf.type === 'id') && (
                        <span>
                          {decodeURIComponent(cf.name)}
                        </span>
                      )}
                      <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                    </Badge>
                  </p>
                ) : ''
            )) : ''}
          </>
        )}
      />
    </Box>
  );
};

Auditors.defaultProps = {
  match: false,
};

Auditors.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default Auditors;
