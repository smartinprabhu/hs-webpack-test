import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Row,
  Nav,
  NavLink,
} from 'reactstrap';

import OrderLines from './orderLines';
import PantryOverview from './pantryOverview';
import tabs from './tabs.json';

const OrderSegments = () => {
  const [currentTab, setActive] = useState('Pantry Overview');

  return (
    <>
      <Card className="border-0 bg-lightblue globalModal-sub-cards">
        <CardBody className="pl-0 pr-0">
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
          <div className="tab-content-scroll hidden-scrollbar">
            {currentTab === 'Pantry Overview'
              ? <PantryOverview />
              : ''}
            {currentTab === 'Products'
              ? OrderLines
              : ''}
          </div>
        </CardBody>
      </Card>

    </>
  );
};

export default OrderSegments;
