/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, CardTitle, Col, Input, Label, Row, Table, Tooltip,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import reportsIcon from '@images/icons/reports.svg';
import filterMiniIcon from '@images/icons/searchBlack.svg';
import {
  getColumnArrayById,
  isArrayValueExists, getLocalDate,
} from '../../../util/appUtils';
import SideFilters from './sidebar/sideFilters';
import { getppmLabel, getPriorityLabel } from '../../../preventiveMaintenance/utils/utils';
import {
  getPreventiveDetail, getCheckedRows,
} from '../../../preventiveMaintenance/ppmService';
import reportListData from '../../../preventiveMaintenance/data/reportsTable.json';

const appModels = require('../../../util/appModels').default;

const reportList = () => {
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const statusValue = 0;
  const categoryValue = 0;
  const priorityValue = 0;
  const [isFilter, showFilter] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [openValues, setOpenValues] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [columns, setColumns] = useState(['name', 'time_period', 'priority', 'ppm_by', 'create_date', 'mro_ord_count', 'category_type']);

  const toggle = (id) => {
    setOpenValues((state) => [...state, id]);
  };

  const { userInfo } = useSelector((state) => state.user);
  const {
    ppmFilter, reportId,
  } = useSelector((state) => state.ppm);

  const reportInfo = reportListData;

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getPreventiveDetail(viewId, appModels.PPMCALENDAR));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRows(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (ppmFilter && ppmFilter.customFilters) {
      const vid = isArrayValueExists(ppmFilter.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          showFilter(false);
        }
      }
    }
  }, [ppmFilter]);

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => item !== value));
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = reportInfo && reportInfo.data ? reportInfo.data : [];
      setCheckRows(getColumnArrayById(data, 'id'));
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };
  return (
    <Card className="p-1 bg-lightblue h-100 side-filters-list">
      <CardBody className="p-1">
        <Row>
          <Col sm="12" md="12" lg="12">
            <Card className="bg-lightblue border-0 pr-2 pl-2 h-100">
              <CardTitle className="mb-0">
                {reportId && reportId.length > 0
                  ? (
                    <div className="d-inline">
                      <img src={reportsIcon} className="mr-1 mb-1" height="18" width="18" alt="reports" />
                      <span className="font-weight-800 font-17 ml-1">{reportId[0].name}</span>
                    </div>
                  )
                  : ''}
                <div className="float-right">
                  <img
                    aria-hidden="true"
                    alt="Filters"
                    src={filterMiniIcon}
                    id="Filters"
                    className="cursor-pointer mr-2"
                    onClick={() => { showFilter(!isFilter); }}
                    onMouseOver={() => toggle(6)}
                    onMouseLeave={() => setOpenValues([])}
                    onFocus={() => toggle(6)}
                  />
                  <Tooltip
                    placement="top"
                    isOpen={openValues.some((selectedValue) => selectedValue === 6)}
                    target="Filters"
                  >
                    Search
                  </Tooltip>
                </div>
              </CardTitle>
              <hr className="mt-1 mb-1 border-color-grey" />
            </Card>
          </Col>
        </Row>
        <Row className="pt-2">
          <Col md="3" sm="3" lg="3" xs="12">
            <SideFilters
              offset={offset}
              id={viewId}
              scheduleValue={statusValue}
              categoryValue={categoryValue}
              priorityValue={priorityValue}
              afterReset={() => { setOffset(0); }}
              sortBy={sortBy}
              sortField={sortField}
              columns={columns}
            />
          </Col>
          <Col md="9" sm="9" lg="9" xs="12">
            {viewId ? (
              <div className="card h-100" />
            ) : (
              <Card className="p-2 bg-white border-0 h-100">
                <CardBody className="p-1 m-0">
                  {(reportInfo && reportInfo.data) && (
                  <span data-testid="success-case" />
                  )}
                  {(reportInfo && reportInfo.data) && (
                  <div>
                    <Table responsive>
                      <thead className="bg-gray-light">
                        <tr>
                          <th>
                            <div className="checkbox">
                              <Input
                                type="checkbox"
                                value="all"
                                className="m-0 position-relative"
                                name="checkall"
                                id="checkboxtkhead"
                                checked={isAllChecked}
                                onChange={handleTableCellAllChange}
                              />
                              <Label htmlFor="checkboxtkhead" />
                            </div>
                          </th>
                          <th className="min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Report Number
                            </span>
                          </th>
                          <th className="min-width-100">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('time_period'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Schedule
                            </span>
                          </th>
                          <th className="min-width-100">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('priority'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Priority
                            </span>
                          </th>
                          <th className="min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('ppm_by'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Performed by
                            </span>
                          </th>
                          <th className="min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('create_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Created On
                            </span>
                          </th>
                          {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                          <th className="min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Company
                            </span>
                          </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {reportInfo.data.map((ppm, index) => (

                          <tr key={ppm.id}>
                            <td className="w-5">
                              <div className="checkbox">
                                <Input
                                  type="checkbox"
                                  value={ppm.id}
                                  id={`checkboxtk${index}`}
                                  className="ml-0"
                                  name={ppm.name}
                                  checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(ppm.id))}
                                  onChange={handleTableCellChange}
                                />
                                <Label htmlFor={`checkboxtk${index}`} />
                              </div>
                            </td>
                            <td
                              aria-hidden="true"
                              // className="cursor-pointer"
                              onClick={() => { showFilter(false); }}
                            >
                              <span className="font-weight-600">{ppm.name}</span>
                            </td>
                            <td><span className="font-weight-400">{ppm.time_period}</span></td>
                            <td>
                              {(ppm.priority) && (
                              <span className="font-weight-400">
                                {getPriorityLabel(ppm.priority)}
                              </span>
                              )}
                            </td>
                            <td><span className="font-weight-400">{getppmLabel(ppm.ppm_by)}</span></td>
                            <td><span className="font-weight-400">{getLocalDate(ppm.create_date)}</span></td>
                            {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                            <td><span className="font-weight-400">{ppm.company_id ? ppm.company_id[1] : ''}</span></td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  )}
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default reportList;
