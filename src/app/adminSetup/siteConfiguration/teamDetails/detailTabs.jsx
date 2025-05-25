/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  Button,
  CardBody,
  CardHeader,
  Collapse,
  Col,
  Row,
} from 'reactstrap';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import tabs from './tabs.json';
import Members from './members';
import Spaces from './spaces';

const detailTabs = () => {
  const [currentTab, setActive] = useState('Team Members');

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0">
          <CardBody>
            <Row>
              <Col md={12} sm={12} xs={12} lg={12}>
                {tabs && tabs.tabsList.map((tabData) => (
                  <div
                    id="accordion"
                    className="accordion-wrapper mb-3 border-0"
                    key={tabData.name}
                  >
                    <Card className="border-0">
                      <CardHeader id={`heading${tabData.name}`} className="p-2 bg-lightgrey border-0">
                        <Button
                          block
                          color="text-dark"
                          id={`heading${tabData.name}`}
                          className="text-left m-0 p-0 border-0 box-shadow-none"
                          onClick={() => setActive(tabData.name)}
                          aria-expanded={currentTab}
                          aria-controls={`collapse${tabData.name}`}
                        >
                          <span className="collapse-heading font-weight-800">
                            {tabData.name}
                            {' '}
                          </span>
                          {currentTab === tabData.name
                            ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                            : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleDown} />}
                        </Button>
                      </CardHeader>

                      <Collapse
                        isOpen={currentTab === tabData.name}
                        data-parent="#accordion"
                        id={`collapse${tabData.name}`}
                        className="border-0"
                        aria-labelledby={`heading${tabData.name}`}
                      >
                        {currentTab === tabData.name && currentTab === 'Team Members'
                          ? <Members />
                          : ''}
                        {currentTab === tabData.name && currentTab === 'Spaces'
                          ? <Spaces />
                          : ''}
                      </Collapse>
                    </Card>
                  </div>

                ))}
              </Col>
            </Row>
            <br />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default detailTabs;
