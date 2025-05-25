import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Row,
  Nav,
  NavLink,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import General from './general';
import tabs from './tabs.json';

const PantrySegments = (props) => {
  const {
    detail,
  } = props;
  const [currentTab, setActive] = useState('General Info');

  return (
    <>
      <Card className="border-0 h-100">
        <CardBody>
          <Row>
            <Nav>
              {tabs && tabs.tabsList.map((item) => (
                <div className="mr-2 ml-3" key={item.id}>
                  <NavLink className="nav-link-item pt-2 pb-1 pl-1 pr-1" active={currentTab === item.name} href="#" onClick={() => setActive(item.name)}>{item.name}</NavLink>
                </div>
              ))}
            </Nav>
          </Row>
          <br />
          {currentTab === 'General Info'
            ? <General detail={detail} />
            : ''}
        </CardBody>
      </Card>

    </>
  );
};

PantrySegments.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default PantrySegments;
