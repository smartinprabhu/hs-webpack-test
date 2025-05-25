/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */

import Drawer from '@mui/material/Drawer';
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

import TrackerCheck from '@images/icons/auditBlue.svg';
import { AddThemeBackgroundColor } from '../themes/theme';
import CommonGrid from '../commonComponents/commonGrid';
import { HxAuditSystemColumns } from '../commonComponents/gridColumns';

import {
  setInitialValues,
} from '../purchase/purchaseService';

import DrawerHeader from '../commonComponents/drawerHeader';
import {
  getAllCompanies,
  getDateAndTimeForDifferentTimeZones,
  getListOfOperations,
  queryGeneratorWithUtc, debounce, getNewDataGridFilterArray, getNextPreview,
} from '../util/appUtils';
import { HxAuditSystemModule } from '../util/field';
import {
  resetDeleteAnswers,
  resetPageData,
  resetStorePages,
  resetStoreQuestions,
} from '../survey/surveyService';
import {
  filterStringGenerator,
} from './utils/utils';
import {
  getHxAuditSystemsCount,
  getHxAuditSystemsExport,
  getSystemFilters, getHxAuditSystemsList,
  getHxAuditSystemDetail,
  resetCreateSytem,
  resetUpdateSystem,
} from './auditService';
import AddSystem from './addSystem';
import AuditSystemDetail from './auditDetails/auditSystemDetail';
import actionCodes from './data/actionCodes.json';

const appModels = require('../util/appModels').default;

const AuditConfiguration = (props) => {
  const { match } = props;
  const { params } = match;
  const uuid = params && params.uuid ? params.uuid : false;
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);

  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [reload, setReload] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { apiFields } = HxAuditSystemModule;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    hxAuditSystemsCount, hxAuditSystemsList, hxAuditSystemsCountLoading,
    hxAuditSystemsFilters, hxSystemCreate, hxAuditSystemsExport, hxAuditSystemDetail,
  } = useSelector((state) => state.hxAudits);


  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const actionData = hxAuditSystemDetail && (hxAuditSystemDetail.data && hxAuditSystemDetail.data.length > 0 && !hxAuditSystemDetail.loading) ? hxAuditSystemDetail.data[0] : false;

  const isStatusEditable = actionData && (actionData.state === 'Open' || actionData.state === 'In Progress');

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const isCreatable = allowedOperations.includes(actionCodes['Add Audit System']);

  const isEditable = isStatusEditable;

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        state: true,
        short_code: true,
        department_id: true,
        scope: true,
        objective: true,
        create_date: true,
        overall_score: false,
        company_id: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (hxAuditSystemsFilters && hxAuditSystemsFilters.customFilters) {
      setCustomFilters(hxAuditSystemsFilters.customFilters);
    }
  }, [hxAuditSystemsFilters]);

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
      dispatch(getSystemFilters([]));
      setCustomFilters([]);
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      const customFiltersList = '';
    }
  }, [reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (hxAuditSystemsCount && hxAuditSystemsCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = hxAuditSystemsFilters && hxAuditSystemsFilters.customFilters ? queryGeneratorWithUtc(hxAuditSystemsFilters.customFilters, 'create_date', userInfo.data) : '';
      dispatch(getHxAuditSystemsExport(companies, appModels.HXSYSTEM, hxAuditSystemsCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [startExport]);

  useEffect(() => {
    if (viewId) {
      dispatch(getHxAuditSystemDetail(viewId, appModels.HXSYSTEM));
    }
  }, [viewId]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = hxAuditSystemsFilters.customFilters ? queryGeneratorWithUtc(hxAuditSystemsFilters.customFilters, 'create_date', userInfo.data) : '';
      dispatch(getHxAuditSystemsCount(companies, appModels.HXSYSTEM, false, customFiltersList, globalFilter));
    }
  }, [userInfo, hxAuditSystemsFilters.customFilters]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = hxAuditSystemsFilters.customFilters ? queryGeneratorWithUtc(hxAuditSystemsFilters.customFilters, 'create_date', userInfo.data) : '';
      setCheckRows([]);
      dispatch(getHxAuditSystemsList(companies, appModels.HXSYSTEM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, hxAuditSystemsFilters.customFilters]);

  useMemo(() => {
    if ((hxSystemCreate && hxSystemCreate.data)) {
      const customFiltersList = hxAuditSystemsFilters.customFilters ? queryGeneratorWithUtc(hxAuditSystemsFilters.customFilters, 'create_date', userInfo.data) : '';
      setCheckRows([]);
      dispatch(getHxAuditSystemsCount(companies, appModels.HXSYSTEM, false, customFiltersList, globalFilter));
      dispatch(getHxAuditSystemsList(companies, appModels.HXSYSTEM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [hxSystemCreate]);

  useEffect(() => {
    if (uuid) {
      dispatch(setInitialValues(false, false, false, false));
      setViewId(uuid);
      setViewModal(true);
    }
  }, [uuid]);

  const totalDataCount = hxAuditSystemsCount && hxAuditSystemsCount.length ? hxAuditSystemsCount.length : 0;

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = hxAuditSystemsFilters && hxAuditSystemsFilters.customFilters ? hxAuditSystemsFilters.customFilters : [];
      setCustomFiltersList(filters);
      const filterValues = {
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
      };
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getSystemFilters(filterValues));
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
      dispatch(getSystemFilters(filterValues));
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
      const oldCustomFilters = hxAuditSystemsFilters && hxAuditSystemsFilters.customFilters
        ? hxAuditSystemsFilters.customFilters
        : [];
      const filterValues = {
        states:
        hxAuditSystemsFilters && hxAuditSystemsFilters.states ? hxAuditSystemsFilters.states : [],
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
      dispatch(getSystemFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = hxAuditSystemsFilters && hxAuditSystemsFilters.customFilters
        ? hxAuditSystemsFilters.customFilters
        : [];
      const filterValues = {
        states:
        hxAuditSystemsFilters && hxAuditSystemsFilters.states ? hxAuditSystemsFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getSystemFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const loading = (userInfo && userInfo.loading) || (hxAuditSystemsList && hxAuditSystemsList.loading) || (hxAuditSystemsCountLoading);

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
    dispatch(getSystemFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };


  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(hxAuditSystemsList && hxAuditSystemsList.data && hxAuditSystemsList.data.length && hxAuditSystemsList.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(hxAuditSystemsList && hxAuditSystemsList.data && hxAuditSystemsList.data.length && hxAuditSystemsList.data[hxAuditActionsList.data.length - 1].id);
    }
  }, [hxAuditSystemsList]);

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
      'short_code',
      'scope',
      'objective',
      'department_id',
    ];
    let query = '"|","|","|","|",';

    const oldCustomFilters = hxAuditSystemsFilters && hxAuditSystemsFilters.customFilters
      ? hxAuditSystemsFilters.customFilters
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
        uniqueCustomFilter = getNewDataGridFilterArray(HxAuditSystemColumns(), uniqueCustomFilter);
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getSystemFilters({ customFilters }));
        setOffset(0);
        setPage(0);
      } else {
        const fData = data.items.filter((item) => item.value);
        if (fData && fData.length) {
          let uniqueCustomFilter = _.reverse(
            _.uniqBy(_.reverse([...fData]), 'field'),
          );
          uniqueCustomFilter = getNewDataGridFilterArray(HxAuditSystemColumns(), uniqueCustomFilter);
          const customFilters = [...dateFilters, ...uniqueCustomFilter];
          dispatch(getSystemFilters({ customFilters }));
          setOffset(0);
          setPage(0);
        } else {
          const CustomFilters = [...dateFilters];
          dispatch(getSystemFilters({ customFilters: CustomFilters }));
          setOffset(0);
          setPage(0);
        }
      }
    } else {
      const CustomFilters = [...dateFilters];
      dispatch(getSystemFilters({ customFilters: CustomFilters }));
      setOffset(0);
      setPage(0);
    }
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [hxAuditSystemsFilters],
  );


  const resetForm = () => {
    if (document.getElementById('systemForm')) {
      document.getElementById('systemForm').reset();
    }
    dispatch(resetCreateSytem());
    dispatch(resetUpdateSystem());
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    showAddModal(false);
  };

  const resetAdd = () => {
    dispatch(resetCreateSytem());
    dispatch(resetUpdateSystem());
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
  };

  const onAdd = () => {
    if (document.getElementById('systemForm')) {
      document.getElementById('systemForm').reset();
    }
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    dispatch(resetCreateSytem());
    dispatch(resetUpdateSystem());
    showAddModal(true);
  };

  const handlePageChangeDetail = (page, type) => {
    setDetailArrowNext('');
    setDetailArrowPrev('');
    const nPages = Math.ceil(totalDataCount / limit);
    if (type === 'Next' && page !== nPages) {
      const offsetValue = page * limit;
      setOffset(offsetValue);
      setPage(page);
      setDetailArrowNext(Math.random());
    }
    if (type === 'Prev' && page !== 1) {
      const offsetValue = ((page - 2) * limit);
      setOffset(offsetValue);
      setPage(page - 2);
      setDetailArrowPrev(Math.random());
    }
  };

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        /* sx={{
         height: '90%',
       }} */
        tableData={
          hxAuditSystemsList && hxAuditSystemsList.data && hxAuditSystemsList.data.length
            ? hxAuditSystemsList.data
            : []
        }
        columns={HxAuditSystemColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Audit System List"
        exportFileName="Audit_Systems"
        listCount={totalDataCount}
        exportInfo={{ err: hxAuditSystemsExport.err, loading: hxAuditSystemsExport.loading, data: hxAuditSystemsExport.data ? hxAuditSystemsExport.data : false }}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: isCreatable,
          text: 'Create an System',
          func: () => onAdd(),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        filters={filterStringGenerator(hxAuditSystemsFilters)}
        onFilterChanges={debouncedOnFilterChange}
        loading={hxAuditSystemsList && hxAuditSystemsList.loading}
        err={hxAuditSystemsList && hxAuditSystemsList.err}
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
      <Drawer
        PaperProps={{
          sx: { width: '90%' },
        }}
        anchor="right"
        open={viewModal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName={hxAuditSystemDetail && (hxAuditSystemDetail.data && hxAuditSystemDetail.data.length > 0 && !hxAuditSystemDetail.loading)
            ? hxAuditSystemDetail.data[0].name : 'Audit System'}
          imagePath={TrackerCheck}
          isEditable={isEditable}
          onClose={() => onViewReset()}
          onEdit={() => {
            setEditId(hxAuditSystemDetail && (hxAuditSystemDetail.data && hxAuditSystemDetail.data.length > 0) ? hxAuditSystemDetail.data[0].id : false);
            showEditModal(!editModal);
          }}
          onPrev={() => {
            const prevId = getNextPreview(viewId, 'Prev', hxAuditSystemsList);
            if (prevId === 0) {
              handlePageChangeDetail(currentpage - 1, 'Prev');
            } else {
              setViewId(prevId);
            }
          }}
          onNext={() => {
            const nextId = getNextPreview(viewId, 'Next', hxAuditSystemsList);
            if (nextId === 0) {
              handlePageChangeDetail(currentpage + 1, 'Next');
            } else {
              setViewId(nextId);
            }
          }}
        />
        <AuditSystemDetail offset={offset} />

      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '70%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create an System"
          imagePath={TrackerCheck}
          onClose={() => resetForm()}
        />
        <AddSystem
          editId={false}
          closeModal={() => resetForm()}
          afterReset={() => resetAdd()}
          isShow={addModal}
          addModal
          setViewId={setViewId}
          setViewModal={setViewModal}
        />
      </Drawer>
    </Box>
  );
};

AuditConfiguration.defaultProps = {
  match: false,
};

AuditConfiguration.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default AuditConfiguration;
