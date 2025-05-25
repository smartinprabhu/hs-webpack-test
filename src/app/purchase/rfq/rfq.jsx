/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { Col, Row, UncontrolledTooltip } from 'reactstrap';
import filterIcon from '@images/filter.png';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SideFilters from './sidebar';

import RfqList from './rfqList';
import PurchaseSegments from '../purchaseSegments';
import {
  getMenuItems,
} from '../../util/appUtils';

const Rfq = () => {
  const subMenu = 'Purchase Info';
  const subTabMenu = 'Request for Quotation';
  const [offset, setOffset] = useState(0);
  const [viewId, setViewId] = useState(0);
  const [page, setPage] = useState(1);
  const [statusValue, setStatusValue] = useState(0);
  const [orderValue, setOrderValue] = useState(0);
  const [vendorValue, setVendorValue] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [collapse, setCollapse] = useState(false);

  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'name');

  const menuData = menuList.filter((item) => item === subTabMenu);
  const isMenu = !!(menuData && menuData.length);

  if (!isMenu) {
    return (<Redirect to="/purchase/purchaserequest" />);
  }

  const getStatusValue = (status, order, vendor, os, vid, sb, sf, p) => {
    setStatusValue(status);
    setOrderValue(order);
    setVendorValue(vendor);
    setOffset(os);
    setViewId(vid);
    setSortBy(sb);
    setSortField(sf);
    setPage(p);
  };

  return (
    <>
      <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border purchase-module">
        <Col sm="12" md="12" lg="12">
          <PurchaseSegments id={subTabMenu} />
        </Col>
        <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
          {collapse ? (
            <>
              <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer filter-left ml-4" id="filters" />
              <UncontrolledTooltip target="filters" placement="right">
                Filters
              </UncontrolledTooltip>
            </>
          ) : (
            <>
              <SideFilters
                offset={offset}
                id={viewId}
                statusValue={statusValue}
                orderValue={orderValue}
                vendorValue={vendorValue}
                afterReset={() => { setPage(1); setOffset(0); }}
                sortBy={sortBy}
                sortField={sortField}
                setCollapse={setCollapse}
                collapse={collapse}
              />
            </>
          )}
        </Col>
        <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1 list' : 'list pl-1 pt-2 pr-2'}>
          <RfqList getStatusValue={getStatusValue} pageVal={page} offsetNumber={offset} collapse={collapse} />
        </Col>
      </Row>
    </>
  );
};

export default Rfq;
