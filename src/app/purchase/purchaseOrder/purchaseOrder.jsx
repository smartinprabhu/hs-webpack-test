/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { Col, Row, UncontrolledTooltip } from 'reactstrap';

import filterIcon from '@images/filter.png';
import SideFilters from '../rfq/sidebar';
import RfqList from '../rfq/rfqList';
import PurchaseSegments from '../purchaseSegments';

const PurchaseOrder = () => {
  const subMenu = 'Purchase Info';
  const subTabMenu = 'Purchase Orders';
  const [offset, setOffset] = useState(0);
  const [viewId, setViewId] = useState(0);
  const [page, setPage] = useState(1);
  const [statusValue, setStatusValue] = useState(0);
  const [orderValue, setOrderValue] = useState(0);
  const [vendorValue, setVendorValue] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [collapse, setCollapse] = useState(false);

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
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border  purchase-module">
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
              isPurchaseOrder
              setCollapse={setCollapse}
              collapse={collapse}
            />
          </>
        )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1 list' : ' list pl-1 pt-2 pr-2'}>
        <RfqList getStatusValue={getStatusValue} pageVal={page} offsetNumber={offset} isPo collapse={collapse} />
      </Col>
    </Row>
  );
};

export default PurchaseOrder;
