import React, { useState } from 'react';
import { DatePicker } from 'antd';
import {
  Collapse, Col, Row,

} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

const { RangePicker } = DatePicker;

const ReportSideFilter = ({ date, changeDate }) => {
  const [statusCollapse, setStatusCollapse] = useState(true);

  const onDateRangeChange = (dates) => {
    changeDate(dates);
  };

  const handleResetClick = () => {
    changeDate(false);
  };
  return (
    <>
      <>
        <Row className="m-0">
          <Col md="12" lg="12" sm="12" xs="12" className="p-0">
            <div aria-hidden="true" className="float-right cursor-pointer mr-2 text-info font-weight-800" onClick={handleResetClick}>Reset Filters</div>
          </Col>
        </Row>
        <hr className="mt-1" />
      </>
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY DATE FILTER</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setStatusCollapse(!statusCollapse); }} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={statusCollapse}>
        <div>
          <RangePicker
            onChange={onDateRangeChange}
            value={date}
            format="DD-MM-y"
            size="small"
            className="mt-1 mx-wd-220"
          />
        </div>
      </Collapse>
    </>
  );
};
export default ReportSideFilter;
