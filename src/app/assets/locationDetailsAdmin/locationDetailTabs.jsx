import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Nav,
  NavLink,
} from 'reactstrap';

import Assets from './assets';
import tabs from './tabs.json';

const LocationDetailTabs = () => {
  const [currentTab, setActive] = useState('Assets');

  return (
    <>
      <Card className="border-0 h-100">
        <CardBody className="m-0 p-3">
          <Row>
            <Col md={12} sm={12} xs={12} lg={12}>
              <Nav>
                {tabs && tabs.tabsList.map((item) => (
                  <div className="mr-2 ml-2" key={item.id}>
                    <NavLink className="nav-link-item pt-2 pb-1 pl-1 pr-1" active={currentTab === item.name} href="#" onClick={() => setActive(item.name)}>{item.name}</NavLink>
                  </div>
                ))}
              </Nav>
            </Col>
          </Row>

          <br />
          {currentTab === 'Assets'
            ? <Assets />
            : ''}
        </CardBody>
      </Card>

    </>
  );
};

export default LocationDetailTabs;
