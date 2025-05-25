/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Col, Row,
  Card,
  CardBody,
} from 'reactstrap';
import {
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { Spin } from 'antd';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import '../dashboard.scss';
import { getDataArry, getDataArryCount } from '../utils/utils';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import {
  newpercalculate,
} from '../../util/staticFunctions';
import { getPagesCountV2, getColumnArrayById } from '../../util/appUtils';
import { getColorCode } from '../utils/utils';
import customData from '../data/customData.json';
import DynamicTableView from './dynamicTableView';
import DynamicDataExport from './dynamicDataExport';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AssetQuipmentCards = ({ data, dataList }) => {
  const [isViewList, setViewList] = useState(false);
  const [modelName, setModel] = useState(false);
  const [listName, setListName] = useState(false);
  const [domainData, setDomain] = useState([]);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const classes = useStyles();
  const limit = 20;

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const arrGrids = dataList ? JSON.parse(dataList) : [];
  const dataIds = Object.keys(arrGrids);
  const dataArray1 = getDataArry(data || [], dataIds, 'ks_dashboard_item_type', 'ks_tile');

  const dataArray = dataArray1.sort((a, b) => a.sequence - b.sequence);

  const total = getDataArryCount(data || [], dataIds, 'ks_dashboard_item_type', 'ks_tile');

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName] ? getColumnArrayById(customData[modelName], 'property') : [];
      dispatch(getExtraSelectionMultiple(false, modelName, limit, offset, fields, JSON.stringify(domainData)));
    }
  }, [modelName, offset]);

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName] ? getColumnArrayById(customData[modelName], 'property') : [];
      dispatch(getExtraSelectionMultipleCount(false, modelName, fields, JSON.stringify(domainData)));
    }
  }, [modelName]);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const handleViewList = (model, domain, name) => {
    setViewList(true);
    setDomain(domain);
    setListName(name);
    setModel(model);
  };

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  return (
    <Row className="">
      { /* <Col md={3} lg={3} sm={6} xs={6} key={dl.id} className="text-center px-3 cursor-pointer" onClick={() => handleViewList(dl.ks_model_name, dl.ks_domain, dl.name)}>
            <StatisticCard
              title={dl.name}
              value={dl.ks_record_count}
              total={total}
              showPercentage
            />
        </Col> */ }
      {!isViewList && (
      <>
        {dataArray && dataArray.length > 0 && dataArray.map((actions) => (
          <Col sm="12" md="12" lg="2" xs="12" className="p-1 insight" key={actions.name}>
            <Card
              className="bg-white shadow-card-dashboard cursor-pointer"
              style={{ borderLeft: `3px solid ${getColorCode(actions.ks_background_color)}` }}
              onClick={() => handleViewList(actions.ks_model_name, actions.ks_domain, actions.name)}
            >
              <CardBody id="Tooltip-Insights" className="text-right p-3">
                <h6 className="font-weight-800 mb-1">
                  {actions.name}
                </h6>
                <h2 className="mb-1">{actions.ks_record_count}</h2>
                <span className="fon-tiny">{`${newpercalculate(total, actions.ks_record_count)}%`}</span>
              </CardBody>
            </Card>
          </Col>
        ))}
      </>
      )}
      {isViewList && (
        <Col md={12} lg={12} sm={12} xs={12}>
          <h4>
            <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setViewList(false); setModel(false); setOffset(0); setPage(1); }} icon={faArrowLeft} />
            {listName}
            <DynamicDataExport
              listName={listName}
              modelName={modelName}
              domainData={domainData}
            />
          </h4>
          {listDataMultipleInfo && listDataMultipleInfo.loading && (
            <div className="p-3 text-center">
              <Spin />
            </div>
          )}
          <DynamicTableView
            columns={customData && customData[modelName] ? customData[modelName] : []}
            data={listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : []}
            propertyAsKey="id"
            modelName={modelName}
          />
          {loading || pages === 0 ? (<span />) : (
            <div className={`${classes.root} float-right`}>
              <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
            </div>
          )}
            {(listDataMultipleInfo && listDataMultipleInfo.err) && (
            <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
        </Col>
      )}
    </Row>
  );
};

export default AssetQuipmentCards;
