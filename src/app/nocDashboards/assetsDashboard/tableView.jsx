/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';
import {
  Table,
} from 'reactstrap';
import Pagination from '@material-ui/lab/Pagination';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  Skeleton,
} from 'antd';

import ErrorContent from '@shared/errorContent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import '../../analytics/nativeDashboard/nativeDashboard.scss';
import {
  getDefaultNoValue, getPagesCountV2, truncateFrontSlashs, truncateStars, getCompanyTimezoneDate,
  checkIsDate,
} from '../../util/appUtils';
import StaticDataExport from './staticDataExport';
import {
  getMTName,
  getWorkOrderStateText,
} from '../../workorders/utils/utils';
import {
  getResponseTypeText,
  getStateText,
} from '../../auditSystem/utils/utils';
import AuthService from '../../util/authService';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const appConfig = require('../../config/appConfig').default;

const TableView = React.memo((props) => {
  const { chartData, height } = props;

  const limit = 10;
  const authService = AuthService();
  const classes = useStyles();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [listDataMultipleInfo, setListDataMultipleInfo] = useState({ loading: false, data: null, err: null });
  const [tableDataExport, setTableDataExport] = useState({ loading: false, data: null, err: null });

  const tableValues = chartData && chartData.ks_list_view_data ? JSON.parse(chartData.ks_list_view_data) : false;

  const isUnGrouped = chartData && chartData.ks_list_view_type === 'ungrouped';
  const isListOfQuery = chartData && chartData.ks_data_calculation_type === 'query';

  const modelName = chartData && chartData.ks_model_name ? chartData.ks_model_name : '';

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const isSectionTitle = chartData.ks_model_name === 'mgmtsystem.action';

  const { userInfo } = useSelector((state) => state.user);

  function getExtraSelectionMultiple(company, model, limitValue, offsetValue, fields, searchValueMultiple) {
    setListDataMultipleInfo({ loading: true, data: null, err: null });
    const data = {
      domain: searchValueMultiple, model, fields: JSON.stringify(fields), limit: limitValue, offset: offsetValue,
    };
    const postData = new FormData();
    Object.keys(data).map((payloadObj) => {
      postData.append(payloadObj, data[payloadObj]);
      return postData;
    });
    const config = {
      method: 'post',
      url: `${WEBAPPAPIURL}api/v4/isearch_read`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authService.getAccessToken()}`,
        endpoint: window.localStorage.getItem('api-url'),
      },
      data: postData,
    };
    axios(config)
      .then((response) => {
        setListDataMultipleInfo({ loading: false, data: response.data.data, err: null });
      })
      .catch((error) => {
        setListDataMultipleInfo({ loading: false, data: null, err: error });
      });
  }

  const [isLoading, setIsLoading] = useState(false);

  function getTableExtraSelectionMultiple(company, model, fields, searchValueMultiple) {
    setIsLoading(true);
    setTableDataExport({ loading: true, data: null, err: null });
    const data = {
      domain: searchValueMultiple, model, fields: JSON.stringify(fields),
    };
    const postData = new FormData();
    Object.keys(data).map((payloadObj) => {
      postData.append(payloadObj, data[payloadObj]);
      return postData;
    });
    const config = {
      method: 'post',
      url: `${WEBAPPAPIURL}api/v4/isearch_read`,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authService.getAccessToken()}`,
        endpoint: window.localStorage.getItem('api-url'),
      },
      data: postData,
    };
    axios(config)
      .then((response) => {
        setTableDataExport({ loading: false, data: response.data.data, err: null });
        setIsLoading(false);
      })
      .catch((error) => {
        setTableDataExport({ loading: false, data: null, err: error });
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (tableValues && tableValues.label_fields && tableValues.label_fields.length && isUnGrouped && !isListOfQuery && !isSectionTitle && chartData) {
      getExtraSelectionMultiple(false, chartData.ks_model_name, limit, offset, tableValues.label_fields, chartData.ks_domain ? JSON.stringify(chartData.ks_domain) : []);
    }
  }, [chartData, offset]);

  useEffect(() => {
    if (tableValues && tableValues.label_fields && tableValues.label_fields.length && isUnGrouped && !isListOfQuery && chartData && !isSectionTitle) {
      getTableExtraSelectionMultiple(false, chartData.ks_model_name, tableValues.label_fields, chartData.ks_domain ? JSON.stringify(chartData.ks_domain) : []);
    }
  }, [chartData]);

  const pages = getPagesCountV2(chartData && chartData.ks_record_count ? chartData.ks_record_count : 0, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  function showCustomizedLabel(item, col) {
    const fieldsArray = ['planned_in', 'planned_out', 'date_start_scheduled', 'date'];
    let value = '';
    if (typeof item[col] === 'object') {
      const array = item[col];
      // eslint-disable-next-line no-unused-vars
      const [id, name] = array;
      value = name;
    } else {
      if (col === 'maintenance_type' && modelName === 'mro.order') {
        value = getMTName(item[col]);
      } else if ((col === 'state' && modelName === 'mro.order') || col === 'order_state') {
        value = getWorkOrderStateText(item[col]);
      } else if (col === 'description' && modelName === 'website.support.ticket') {
        value = truncateFrontSlashs(truncateStars(item[col]));// <Markup content={truncateFrontSlashs(truncateStars(item[col.property]))} />;
      } else if (col === 'state' && modelName === 'audit_system.action') {
        value = getStateText(item[col]);
      } else if (col === 'type_action' && modelName === 'audit_system.action') {
        value = getResponseTypeText(item[col]);
      } else if (fieldsArray.includes(col)) {
        value = getCompanyTimezoneDate(item[col], userInfo, 'datetime');
      } else if (checkIsDate(item[col])) {
        value = getCompanyTimezoneDate(item[col], userInfo, 'datetime');
      } else {
        value = getDefaultNoValue(item[col]);
      }
    }
    return value;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          {assetData[i].data && assetData[i].data.length > 0 && assetData[i].data.map((tv) => (
            <td className="p-2" key={tv}>{checkIsDate(tv) ? getCompanyTimezoneDate(tv, userInfo, 'datetime') : getDefaultNoValue(tv)}</td>
          ))}
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading);

  return (
    <>
      {isSectionTitle && (
        <div className="text-center p-0 bg-med-blue-dashboard">
          <h3 className="background-lightgray">{chartData.name}</h3>
        </div>
      )}
      {!isSectionTitle && (
        <div className="p-3">
          <b className="mb-0">{chartData.name}</b>
          {tableValues && tableValues.label && tableValues.label.length > 0 && (
            <StaticDataExport
              chartData={chartData}
              nextLevel={false}
              chartItems={false}
              tableDataExport={tableDataExport}
              isLoading={isLoading}
              showCustomizedLabel={showCustomizedLabel}
            />
          )}
        </div>
      )}
      {(!isUnGrouped || isListOfQuery) && !isSectionTitle && tableValues && tableValues.label && tableValues.label.length > 0 && (
        <>
          <div className="pb-2 max-drawer-height thin-scrollbar" style={{ height: `${height - 55}px`, overflowY: 'auto', width: '100%' }}>
            <Table className="mb-0 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  {tableValues && tableValues.label && tableValues.label.map((tl) => (
                    <th className="p-2 min-width-160 table-column" key={tl}>
                      <div className="font-weight-bold font-size-11">
                        {tl}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getRow(tableValues && tableValues.data_rows ? tableValues.data_rows : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        </>
      )}
      {isUnGrouped && !isListOfQuery && !isSectionTitle && tableValues && tableValues.label && tableValues.label.length > 0 && (
        <>
          <div className="pb-2 max-drawer-height thin-scrollbar" style={{ height: `${height - 55}px`, overflowY: 'auto', width: '100%' }}>
            <Table className="mb-0 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  {tableValues && tableValues.label && tableValues.label.map((tl) => (
                    <th className="p-2 min-width-160 table-column" key={tl}>
                      <div className="font-weight-bold font-size-11">
                        {tl}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.map((item) => (
                  <tr key={`${item.id}-row`}>
                    {tableValues.label_fields && tableValues.label_fields.map((col) => (
                      <td
                        key={`${item.id}-${col}`}
                      >
                        {showCustomizedLabel(item, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr className="m-0" />
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {listDataMultipleInfo && listDataMultipleInfo.loading && (
              <div className="mt-2 text-center">
                <Skeleton active />
              </div>
            )}
            {(listDataMultipleInfo && listDataMultipleInfo.err) && (
              <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
          </div>
        </>
      )}
      {tableValues && tableValues.label && tableValues.label.length === 0 && (
        <>
          {!isSectionTitle && (
            <ErrorContent errorTxt="No data here." />
          )}
        </>
      )}
    </>
  );
});

TableView.propTypes = {
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  height: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
};
export default TableView;
