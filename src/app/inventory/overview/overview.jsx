/* eslint-disable max-len */
/* eslint-disable quote-props */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardBody, Col, Row, Modal, ModalBody,
  UncontrolledTooltip, CardTitle, Collapse, Input, Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import incomingIcon from '@images/incoming.svg';
import outcomingIcon from '@images/outcoming.svg';
import filterIcon from '@images/filter.png';
import transferIcon from '@images/transfers.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import collapseIcon from '@images/collapse.png';

import DetailViewFormat from '@shared/detailViewFormat';
import SearchList from '@shared/listViewFilters/search';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import {
  getAllowedCompanies,
  extractTextObject,
  getDateTimeUtc,
  queryGenerator,
  getListOfModuleOperations,
  prepareDocuments,
} from '../../util/appUtils';
import {
  getStockPickingTypesList,
  getTransferFilters,
  resetAddReceiptInfo,
} from '../../purchase/purchaseService';
import { setCurrentTab } from '../inventoryService';
import AddReceipt from '../../purchase/rfq/rfqDetails/receiveProducts/addReceipt/addReceipt';
import filtersFields from './data/filtersFields.json';
import actionCodes from '../data/actionCodes.json';
import AsyncFileUpload from '../../commonComponents/asyncFileUpload';

const appModels = require('../../util/appModels').default;

const defaultIcon = {
  'outgoing': outcomingIcon,
  'incoming': incomingIcon,
  'internal': transferIcon,
};

const Overview = () => {
  const dispatch = useDispatch();

  const [addRfqModal, showAddRfqModal] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [types, setTypes] = useState(['incoming', 'outgoing', 'internal']);
  const [typesItems, setTypesItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehousesItems, setWarehousesItems] = useState([]);
  const [whGroups, setWhGroups] = useState([]);
  const [filtersList, setFilters] = useState([]);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [typeCollapse, setTypeCollapse] = useState(true);
  const [whCollapse, setWhCollapse] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { operationTypesInfo, addReceiptInfo } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Transfer']);

  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  AsyncFileUpload(addReceiptInfo, uploadPhoto);

  useEffect(() => {
    if (operationTypesInfo && operationTypesInfo.data && ((filtersList && !filtersList.length) && (warehouses && !warehouses.length))) {
      const whGroupsData = operationTypesInfo.data.length ? operationTypesInfo.data : [];
      const arrayUniqueByKey = [...new Map(whGroupsData.map((item) => [item.warehouse_id ? item.warehouse_id[0] : '', item])).values()];
      setWhGroups(arrayUniqueByKey);
    }
  }, [operationTypesInfo, warehouses, filtersList]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFilters = filtersList ? queryGenerator(filtersList) : '';
      dispatch(getStockPickingTypesList(companies, appModels.STOCKPICKINGTYPES, types, warehouses, customFilters));
    }
  }, [userInfo, types, warehouses, filtersList]);

  const loadTransfers = (key, value, source, destination, title) => {
    const stateValues = [{ id: 'assigned', label: 'Ready' }];
    const typeFilters = [{
      id: key, label: `${title} (${value})`, source_id: source, destination_id: destination, name: title,
    }];
    dispatch(getTransferFilters(stateValues, [], typeFilters, []));
    dispatch(setCurrentTab('Transfers'));
  };

  const loadTransfersType = (key, value, wh, source, destination, title) => {
    const whname = wh && wh.length ? wh[1] : 'Warehouse';
    const typeFilters = [{
      id: key, label: `${title} (${value}) - ${whname}`, source_id: source, destination_id: destination, name: title,
    }];
    dispatch(getTransferFilters([], [], typeFilters, []));
    dispatch(setCurrentTab('Transfers'));
  };

  const loadTransfersTypeFilter = (key, value, wh, source, destination, title) => {
    const whname = wh && wh.length ? wh[1] : 'Warehouse';
    const typeFilters = [{
      id: key, label: `${title} (${value}) - ${whname}`, source_id: source, destination_id: destination, name: title,
    }];
    dispatch(getTransferFilters([], [], typeFilters, []));
  };

  const loadTransfersState = (stateValue, stateLabel, key, value, source, destination, count, title) => {
    if (count) {
      if (stateValue === 'confirmed') {
        const stateValues = [{ id: stateValue, label: stateLabel }];
        const typeFilters = [{
          id: key, label: `${title} (${value})`, source_id: source, destination_id: destination, name: title,
        }];
        dispatch(getTransferFilters(stateValues, [], typeFilters, []));
        dispatch(setCurrentTab('Transfers'));
      } else {
        let filters = [];
        const typeFilters = [{
          id: key, label: `${title} (${value})`, source_id: source, destination_id: destination, name: title,
        }];
        if (stateValue === 'scheduled_date') {
          filters = [
            {
              key: stateValue, value: getDateTimeUtc(new Date()), label: stateLabel, name: title, type: 'dateless',
            },
          ];
        }
        if (stateValue === 'backorder_id') {
          filters = [
            {
              key: stateValue, value: '', label: stateLabel, name: title, type: 'set',
            },
          ];
        }
        dispatch(getTransferFilters([], [], typeFilters, filters));
        dispatch(setCurrentTab('Transfers'));
      }
    }
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    resetForm({ values: '' });
    setFilters(filters);
  };

  const handleCustomFilterClose = (value) => {
    setFilters(filtersList.filter((item) => item.key !== value));
  };

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setTypes((state) => [...state, value]);
      setTypesItems((state) => [...state, values]);
    } else {
      setTypes(types.filter((item) => item !== value));
      setTypesItems(typesItems.filter((item) => item.id !== value));
    }
  };

  const handleWhCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setWarehouses((state) => [...state, value]);
      setWarehousesItems((state) => [...state, values]);
    } else {
      setWarehouses(warehouses.filter((item) => item !== value));
      setWarehousesItems(warehousesItems.filter((item) => item.id !== value));
    }
  };

  const onReset = () => {
    dispatch(resetAddReceiptInfo());
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setTypes([]);
    setTypesItems([]);
    setWarehousesItems([]);
    setWarehouses([]);
    setFilters([]);
  };

  return (

    <Row className="pt-2">
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
        {collapse ? (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer filter-left ml-4" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Filters
            </UncontrolledTooltip>
          </>
        ) : (
          <Card className="p-1 h-100 bg-lightblue side-filters-list " onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
            {!collapse ? (
              <>
                <CardTitle className="mt-2 ml-2 mb-1 mr-2">
                  <Row lg="12" sm="12" md="12">
                    <Col lg="10" sm="10" md="10" className="mr-0">
                      <h4>
                        Filters
                      </h4>
                    </Col>
                    {filtersIcon && (
                    <Col lg="2" sm="2" md="2" className="mt-1">
                      <img
                        src={collapseIcon}
                        height="25px"
                        aria-hidden="true"
                        width="25px"
                        alt="Collapse"
                        onClick={() => setCollapse(!collapse)}
                        className="cursor-pointer collapse-margin-left-align"
                        id="collapse"
                      />
                      <UncontrolledTooltip target="collapse" placement="right">
                        Collapse
                      </UncontrolledTooltip>
                    </Col>
                    )}
                  </Row>
                </CardTitle>
                <hr className="m-0 border-color-grey ml-2px" />
                <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
                  <Row className="m-0">
                    <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                      <p className="m-0 font-weight-800 collapse-heading">BY OPERATION TYPE CODE</p>
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                      <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setTypeCollapse(!typeCollapse)} size="sm" icon={typeCollapse ? faChevronUp : faChevronDown} />
                    </Col>
                  </Row>
                  <Collapse isOpen={typeCollapse}>
                    <div>
                      {filtersFields.types.map((mt, index) => (
                        <span className="mb-1 d-block font-weight-500" key={mt.value}>
                          <div className="checkbox">
                            <Input
                              type="checkbox"
                              id={`checkboxasaction${index}`}
                              name={mt.label}
                              value={mt.value}
                              checked={types.some((selectedValue) => selectedValue === mt.value)}
                              onChange={handleCheckboxChange}
                            />
                            <Label htmlFor={`checkboxasaction${index}`}>
                              <span>{mt.label}</span>
                            </Label>
                            {' '}
                          </div>
                        </span>
                      ))}
                    </div>
                  </Collapse>
                  <hr className="mt-2" />
                  <Row className="m-0">
                    <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                      <p className="m-0 font-weight-800 collapse-heading">BY WAREHOUSE</p>
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                      <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setWhCollapse(!whCollapse)} size="sm" icon={whCollapse ? faChevronUp : faChevronDown} />
                    </Col>
                  </Row>
                  <Collapse isOpen={whCollapse}>
                    <div>
                      {whGroups && whGroups.length > 0 && whGroups.map((wh) => (
                        wh.warehouse_id && (
                        <span className="mb-1 d-block font-weight-500" key={wh.warehouse_id[0]}>
                          <div className="checkbox">
                            <Input
                              type="checkbox"
                              id={`checkboxasaction${wh.warehouse_id[0]}`}
                              name={wh.warehouse_id[1]}
                              value={wh.warehouse_id[0]}
                              checked={warehouses.some((selectedValue) => parseInt(selectedValue) === parseInt(wh.warehouse_id[0]))}
                              onChange={handleWhCheckboxChange}
                            />
                            <Label htmlFor={`checkboxasaction${wh.warehouse_id[0]}`}>
                              <span>{wh.warehouse_id[1]}</span>
                            </Label>
                            {' '}
                          </div>
                        </span>
                        )
                      ))}
                    </div>
                  </Collapse>
                  <hr className="mt-2" />
                  {((types && types.length > 0) || (warehouses && warehouses.length > 0) || (filtersList && filtersList.length > 0)) && (
                  <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                  )}
                </CardBody>
              </>
            ) : ''}
          </Card>
        )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1' : 'pl-1 pt-2 pr-2'}>
        <Card className={collapse ? 'filter-margin-right p-2 mb-2 h-100 bg-lightblue ' : 'p-2 mb-2 h-100 bg-lightblue overview-card'}>
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2">
              <Col md="8" xs="12" sm="8" lg="8">
                <div className="content-inline">
                  <span className="p-0 mr-2 font-weight-800 font-medium">
                    Overview :
                    {' '}
                    {operationTypesInfo && operationTypesInfo.data && operationTypesInfo.data.length ? operationTypesInfo.data.length : 0 }
                  </span>
                  {filtersList && filtersList.map((cf) => (
                    <p key={cf.key} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {cf.label}
                        {cf.type === 'text' && (
                        <span>
                          {'  '}
                          &quot;
                          {decodeURIComponent(cf.value)}
                          &quot;
                        </span>
                        )}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                </div>
              </Col>
              <Col md="4" xs="12" sm="4" lg="4">
                <div className="float-right">
                  <SearchList formFields={filtersFields.fields} searchHandleSubmit={searchHandleSubmit} />
                </div>
              </Col>
            </Row>
            <div className="thin-scrollbar p-2">
              <Row>
                {(operationTypesInfo && operationTypesInfo.data && operationTypesInfo.data.length > 0) && operationTypesInfo.data.map((ot) => (
                  <Col md="4" xs="12" sm="12" lg="4" className="mb-4" key={ot.id}>
                    <Card className="p-2 bg-med-blue">
                      <Row>
                        <Col md="9" xs="12" sm="12" lg="9">
                          <h6
                            className="text-info mb-0 text-capital cursor-pointer"
                            aria-hidden="true"
                            onClick={() => loadTransfersType(ot.id, ot.code, ot.warehouse_id, ot.default_location_src_id, ot.default_location_dest_id, ot.name)}
                          >
                            {ot.name}
                          </h6>
                          <p className="font-tiny m-0">
                            {ot.code}
                          </p>
                          <p className="font-tiny m-0">
                            {extractTextObject(ot.warehouse_id)}
                            {' '}
                            (WH)
                          </p>
                          <div className="p-2">
                            <Row>
                              <Col md="6" xs="12" sm="12" lg="6">
                                <span
                                  className={ot.count_picking_waiting ? 'font-tiny cursor-pointer' : 'font-tiny'}
                                  aria-hidden="true"
                                  onClick={() => loadTransfersState('confirmed', 'Waiting', ot.id, ot.code, ot.default_location_src_id, ot.default_location_dest_id, ot.count_picking_waiting, ot.name)}
                                >
                                  Waiting
                                </span>
                              </Col>
                              <Col md="6" xs="12" sm="12" lg="6">
                                <span
                                  className={ot.count_picking_waiting ? 'font-tiny cursor-pointer' : 'font-tiny'}
                                  aria-hidden="true"
                                  onClick={() => loadTransfersState('confirmed', 'Waiting', ot.id, ot.code, ot.default_location_src_id, ot.default_location_dest_id, ot.count_picking_waiting, ot.name)}
                                >
                                  {ot.count_picking_waiting}
                                </span>
                              </Col>
                              <Col md="6" xs="12" sm="12" lg="6">
                                <span
                                  className={ot.count_picking_late ? 'font-tiny cursor-pointer' : 'font-tiny'}
                                  aria-hidden="true"
                                  onClick={() => loadTransfersState('scheduled_date', 'Late', ot.id, ot.code, ot.default_location_src_id, ot.default_location_dest_id, ot.count_picking_late, ot.name)}
                                >
                                  Late
                                </span>
                              </Col>
                              <Col md="6" xs="12" sm="12" lg="6">
                                <span
                                  className={ot.count_picking_late ? 'font-tiny cursor-pointer' : 'font-tiny'}
                                  aria-hidden="true"
                                  onClick={() => loadTransfersState('scheduled_date', 'Late', ot.id, ot.code, ot.default_location_src_id, ot.default_location_dest_id, ot.count_picking_late, ot.name)}
                                >
                                  {ot.count_picking_late}
                                </span>
                              </Col>
                              <Col md="6" xs="12" sm="12" lg="6">
                                <span
                                  className={ot.count_picking_backorders ? 'font-tiny cursor-pointer' : 'font-tiny'}
                                  aria-hidden="true"
                                  onClick={() => loadTransfersState('backorder_id', 'Backorders', ot.id, ot.code, ot.default_location_src_id, ot.default_location_dest_id, ot.count_picking_backorders, ot.name)}
                                >
                                  Back orders
                                </span>
                              </Col>
                              <Col md="6" xs="12" sm="12" lg="6">
                                <span
                                  className={ot.count_picking_backorders ? 'font-tiny cursor-pointer' : 'font-tiny'}
                                  aria-hidden="true"
                                  onClick={() => loadTransfersState('backorder_id', 'Backorders', ot.id, ot.code, ot.default_location_src_id, ot.default_location_dest_id, ot.count_picking_backorders, ot.name)}
                                >
                                  {ot.count_picking_backorders}
                                </span>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Col md="3" xs="12" sm="12" lg="3">
                          <img
                            src={ot.code && defaultIcon[ot.code] ? defaultIcon[ot.code] : transferIcon}
                            width="30"
                            height="30"
                            alt="notification"
                            className="ml-1 mr-1 cursor-pointer"
                            aria-hidden="true"
                            onClick={() => loadTransfersType(ot.id, ot.code, ot.warehouse_id, ot.default_location_src_id, ot.default_location_dest_id, ot.name)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6" xs="12" sm="12" lg="6">
                          {isCreatable && (
                          <div
                            aria-hidden="true"
                            className="font-weight-600 text-lightblue cursor-pointer m-1"
                            onClick={() => { loadTransfersTypeFilter(ot.id, ot.code, ot.warehouse_id, ot.default_location_src_id, ot.default_location_dest_id, ot.name); showAddRfqModal(true); }}
                          >
                            <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="13" width="13" />
                            <span className="mr-1">Add</span>
                          </div>
                          )}
                        </Col>
                        <Col md="6" xs="12" sm="12" lg="6">
                          <Button
                            disabled={!ot.count_picking_ready}
                            type="button"
                            size="sm"
                            onClick={() => loadTransfers(ot.id, ot.code, ot.default_location_src_id, ot.default_location_dest_id, ot.name)}
                            className="float-right"
                             variant="contained"
                          >
                            {ot.count_picking_ready}
                            {'  '}
                            To Process
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
              <DetailViewFormat detailResponse={operationTypesInfo} />
              <Modal size={(addReceiptInfo && addReceiptInfo.data) ? 'sm' : 'xl'} className="border-radius-50px purchase-modal" isOpen={addRfqModal}>
                <ModalHeaderComponent title="Add Transfer" imagePath={false} closeModalWindow={() => { showAddRfqModal(false); onReset(); }} response={addReceiptInfo} />
                <ModalBody className="mt-0 pt-0">
                  <AddReceipt
                    id={false}
                    editId={false}
                    typeDisabled
                    afterReset={() => { showAddRfqModal(false); onReset(); }}
                  />
                </ModalBody>
              </Modal>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Overview;
