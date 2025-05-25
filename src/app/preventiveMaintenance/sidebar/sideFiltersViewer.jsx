/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Collapse, Card, CardBody, CardTitle, Col, Input, Label, Row, UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import collapseIcon from '@images/collapse.png';
import { getPreventiveViewerFilter } from '../ppmService';
import {
  getColumnArrayById,
} from '../../util/appUtils';

import preventiveActions from '../data/preventiveActions.json';

const sideFiltersViewer = (props) => {
  const {
    scheduleValue, preventiveByValue, categoryValue, priorityValue, setCollapse, collapse,
    isInspection,
  } = props;
  const dispatch = useDispatch();
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkCategoryValue, setCheckCategoryValue] = useState([]);
  const [checkCategoryItems, setCheckCategoryItems] = useState([]);
  const [checkppmByValue, setCheckppmByValue] = useState([]);
  const [checkppmByItems, setCheckppmByItems] = useState([]);
  const [checkPriorityValues, setCheckPriorityValues] = useState([]);
  const [checkPriorityItems, setCheckPriorityItems] = useState([]);
  const [statusCollapse, setStatusCollapse] = useState(!isInspection);
  const [categoryCollapse, setCategoryCollapse] = useState(false);
  const [preventiveByCollapse, setPreventiveByCollapse] = useState(false);
  const [priorityCollapse, setPriorityCollapse] = useState(false);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [filtersIcon, setFilterIcon] = useState(false);

  const [checkTypeValues, setCheckTypeValues] = useState([]);
  const [checkTypeItems, setCheckTypeItems] = useState([]);

  const [typeCollapse, setTypeCollapse] = useState(!!isInspection);

  const {
    ppmFilterViewer,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    if (scheduleValue && scheduleValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== scheduleValue));
    }
    if (preventiveByValue && preventiveByValue !== 0) {
      setCheckppmByItems(checkppmByItems.filter((item) => item.id !== preventiveByValue));
    }
    if (categoryValue && categoryValue !== 0) {
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== categoryValue));
    }
    if (priorityValue && priorityValue !== 0) {
      setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== priorityValue));
    }
  }, [scheduleValue, preventiveByValue, categoryValue, priorityValue]);

  useEffect(() => {
    const payload = {
      states: checkItems, preventiveBy: checkppmByItems, categories: checkCategoryItems, priorities: checkPriorityItems, types: checkTypeItems, customFilters: customFiltersList,
    };
    dispatch(getPreventiveViewerFilter(payload));
  }, [checkItems, checkppmByItems, checkCategoryItems, checkPriorityItems, checkTypeItems]);

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckValues((state) => [...state, value]);
      setCheckItems((state) => [...state, values]);
    } else {
      setCheckValues(checkValues.filter((item) => item !== value));
      setCheckItems(checkItems.filter((item) => item.id !== value));
    }
  };

  const handlePreventiveByCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckppmByValue((state) => [...state, value]);
      setCheckppmByItems((state) => [...state, values]);
    } else {
      setCheckppmByValue(checkppmByValue.filter((item) => item !== value));
      setCheckppmByItems(checkppmByItems.filter((item) => item.id !== value));
    }
  };

  const handleCategoryCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckCategoryValue((state) => [...state, value]);
      setCheckCategoryItems((state) => [...state, values]);
    } else {
      setCheckCategoryValue(checkCategoryValue.filter((item) => item !== value));
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== value));
    }
  };

  const handlePriorityCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckPriorityValues((state) => [...state, value]);
      setCheckPriorityItems((state) => [...state, values]);
    } else {
      setCheckPriorityValues(checkPriorityValues.filter((item) => item !== value));
      setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== value));
    }
  };

  const handleTypeByCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckTypeValues((state) => [...state, value]);
      setCheckTypeItems((state) => [...state, values]);
    } else {
      setCheckTypeValues(checkTypeValues.filter((item) => item !== value));
      setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
    }
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCheckCategoryValue([]);
    setCheckCategoryItems([]);
    setCheckppmByValue([]);
    setCheckppmByItems([]);
    setCheckPriorityValues([]);
    setCheckPriorityItems([]);
    setCheckTypeValues([]);
    setCheckTypeItems([]);
    setCustomFilters([]);
  };

  const scheduleValues = ppmFilterViewer && ppmFilterViewer.states ? getColumnArrayById(ppmFilterViewer.states, 'id') : [];
  const ppmByValue = ppmFilterViewer && ppmFilterViewer.preventiveBy ? getColumnArrayById(ppmFilterViewer.preventiveBy, 'id') : [];
  const categoryValues = ppmFilterViewer && ppmFilterViewer.categories ? getColumnArrayById(ppmFilterViewer.categories, 'id') : [];
  const priorityValues = ppmFilterViewer && ppmFilterViewer.priorities ? getColumnArrayById(ppmFilterViewer.priorities, 'id') : [];
  const typeValues = ppmFilterViewer && ppmFilterViewer.types ? getColumnArrayById(ppmFilterViewer.types, 'id') : [];

  const scheduleList = ppmFilterViewer && ppmFilterViewer.states ? ppmFilterViewer.states : [];
  const ppmByList = ppmFilterViewer && ppmFilterViewer.preventiveBy ? ppmFilterViewer.preventiveBy : [];
  const CategoryList = ppmFilterViewer && ppmFilterViewer.categories ? ppmFilterViewer.categories : [];
  const priorityList = ppmFilterViewer && ppmFilterViewer.priorities ? ppmFilterViewer.priorities : [];
  const typesList = ppmFilterViewer && ppmFilterViewer.types ? ppmFilterViewer.types : [];

  return (
    <Card className="p-1 bg-lightblue h-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
      {!collapse ? (
        <>
          {' '}
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
                  className="cursor-pointer collapse-icon-margin-left"
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
          <CardBody className="ml-2 p-0 mt-2 h-100 position-relative scrollable-list thin-scrollbar">
            {isInspection && (
              <>
                <Row className="m-0">
                  <Col md="8" className="p-0">
                    <p className="m-0 font-weight-800 collapse-heading">BY TYPE</p>
                  </Col>
                  <Col md="4" className="text-right p-0">
                    <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setTypeCollapse(!typeCollapse)} size="sm" icon={typeCollapse ? faChevronUp : faChevronDown} />
                  </Col>
                </Row>
                <Collapse isOpen={typeCollapse}>
                  <div className="pl-1">
                    {preventiveActions && preventiveActions.types && preventiveActions.types.map((pt) => (
                      <span className="mb-1 d-block font-weight-500" key={pt.value}>
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            id={`checkboxcitemaction${pt.value}`}
                            value={pt.value}
                            name={pt.label}
                            checked={typeValues.some((selectedValue) => selectedValue.includes(pt.value))}
                            onChange={handleTypeByCheckboxChange}
                          />
                          <Label htmlFor={`checkboxcitemaction${pt.value}`}>
                            <span>{pt.label}</span>
                          </Label>

                          {' '}
                        </div>
                      </span>
                    ))}
                  </div>
                </Collapse>
                <hr className="mt-2" />
              </>
            )}
            <Row className="m-0">
              <Col md="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY SCHEDULE</p>
              </Col>
              <Col md="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setStatusCollapse(!statusCollapse); }} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={statusCollapse}>
              <div>
                {preventiveActions.timeperiod.map((tp, index) => (
                  <span className="mb-1 d-block font-weight-500" key={tp.value}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxstateaction${index}`}
                        value={tp.value}
                        name={tp.label}
                        checked={scheduleValues.some((selectedValue) => selectedValue === tp.value)}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor={`checkboxstateaction${index}`}>
                        <span>{tp.label}</span>
                      </Label>
                      {' '}
                    </div>
                  </span>
                ))}
              </div>
            </Collapse>
            <hr className="mt-2" />
            <Row className="m-0">
              <Col md="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY  PRIORITY</p>
              </Col>
              <Col md="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setPriorityCollapse(!priorityCollapse)} size="sm" icon={priorityCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={priorityCollapse}>
              <div className="pl-1">
                {preventiveActions.priority.map((priority, index) => (
                  <span className="mb-1 d-block font-weight-500" key={priority.value}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxpriorityaction${index}`}
                        value={priority.value}
                        name={priority.label}
                        checked={priorityValues.some((selectedValue) => selectedValue === priority.value)}
                        onChange={handlePriorityCheckboxChange}
                      />
                      {' '}
                      <Label htmlFor={`checkboxpriorityaction${index}`}>
                        <span>{priority.label}</span>
                      </Label>
                    </div>
                  </span>
                ))}
              </div>
            </Collapse>
            <hr className="mt-2" />
            <Row className="m-0">
              <Col md="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">PERFORMED BY</p>
              </Col>
              <Col md="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setPreventiveByCollapse(!preventiveByCollapse)} size="sm" icon={preventiveByCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={preventiveByCollapse}>
              <div className="pl-1">
                {preventiveActions.ppmBy.map((ppmBy, index) => (
                  <span className="mb-1 d-block font-weight-500" key={ppmBy.value}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxcitemaction${index}`}
                        value={ppmBy.value}
                        name={ppmBy.label}
                        checked={ppmByValue.some((selectedValue) => selectedValue.includes(ppmBy.value))}
                        onChange={handlePreventiveByCheckboxChange}
                      />
                      <Label htmlFor={`checkboxcitemaction${index}`}>
                        <span>{ppmBy.label}</span>
                      </Label>

                      {' '}
                    </div>
                  </span>
                ))}
              </div>
            </Collapse>
            <hr className="mt-2" />
            <Row className="m-0">
              <Col md="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY CATEGORY</p>
              </Col>
              <Col md="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setCategoryCollapse(!categoryCollapse)} size="sm" icon={categoryCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={categoryCollapse}>
              <div className="pl-1">
                {preventiveActions.ppmFor.map((cv, index) => (
                  <span className="mb-1 d-block font-weight-500" key={cv.value}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxcategoryitemaction${index}`}
                        value={cv.value}
                        name={cv.label}
                        checked={categoryValues.some((selectedValue) => selectedValue.includes(cv.value))}
                        onChange={handleCategoryCheckboxChange}
                      />
                      <Label htmlFor={`checkboxcategoryitemaction${index}`}>
                        <span>{cv.label}</span>
                      </Label>

                      {' '}
                    </div>
                  </span>
                ))}
              </div>
            </Collapse>
            <hr className="mt-2" />
            {((scheduleList && scheduleList.length > 0)
              || (CategoryList && CategoryList.length > 0)
              || (ppmByList && ppmByList.length > 0) || (typesList && typesList.length > 0) || (priorityList && priorityList.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
              <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
            )}
          </CardBody>
        </>
      ) : ''}
    </Card>

  );
};

sideFiltersViewer.propTypes = {
  scheduleValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  preventiveByValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  categoryValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  priorityValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  setCollapse: PropTypes.func,
  collapse: PropTypes.bool,
  isInspection: PropTypes.bool,
};
sideFiltersViewer.defaultProps = {
  setCollapse: () => { },
  collapse: false,
  isInspection: false,
};

export default sideFiltersViewer;
