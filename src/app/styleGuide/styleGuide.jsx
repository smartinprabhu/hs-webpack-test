import React, { useState } from 'react';
import {
  Card, Button, CardHeader, CardBody, Row, Col,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import './styleGuide.scss';
import StyleGuideColors from './styleGuideColors.json';

const styleGuide = () => {
  const [dropdownOpen, setDropDownOpenClose] = useState(false);

  const textTypes = {
    lowerCase: 'abcdefghijklmnopqrstuvwxyz',
    upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '1234567890',
    dropdownOpen: false,
  };

  const fontTextBlock = (
    <div>
      <div>{textTypes.lowerCase}</div>
      <div>{textTypes.upperCase}</div>
      <div>{textTypes.numbers}</div>
    </div>
  );

  return (
    <div className="mt-3">
      <Card>
        <CardHeader>Headers</CardHeader>
        <CardBody>
          <h1>HELIX SENSE &quot;h1&quot;</h1>
          <h2>HELIX SENSE  &quot;h2 &quot;</h2>
          <h3>HELIX SENSE  &quot;h3 &quot;</h3>
          <h4>HELIX SENSE  &quot;h4 &quot;</h4>
          <h5>HELIX SENSE  &quot;h5 &quot;</h5>
          <h6>HELIX SENSE  &quot;h6 &quot;</h6>
        </CardBody>
      </Card>
      <Card className="mt-4">
        <CardHeader>Colors Palette</CardHeader>
        <CardBody>
          <Row>
            {StyleGuideColors.map((colorProp) => (
              <Col key={colorProp.id} sm="2">
                <Row>
                  <Col sm="3">
                    <div className={`image-size rounded-circle ${colorProp.color}`} />
                  </Col>
                  <Col sm="9">
                    <h6>{colorProp.name}</h6>
                    <div>
                      <small>{colorProp.code}</small>
                    </div>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
      <Card className="mt-4">
        <CardHeader>Buttons</CardHeader>
        <CardBody>
          <Col sm="12">
            <Button color="danger" size="lg">Mandy</Button>
            <Button className="ml-3"  variant="contained" size="lg">Cloud Burst</Button>
            <Button className="ml-3" outline  variant="contained" size="lg">Secondary</Button>
            <Button className="ml-3 roundCorners"  variant="contained" size="lg">Cloud Burst Rounded</Button>
            <Button className="ml-3 roundCorners" outline  variant="contained" size="lg">Secondary outline Rounded</Button>
            <Button className="ml-3 roundCorners" color="red" size="lg">red Rounded</Button>
            <Button className="ml-3 noBorder" outline  variant="contained" size="lg">Secondary</Button>
          </Col>
          <h4 className="mt-5">
            Drop Down
          </h4>
          <Dropdown isOpen={dropdownOpen} toggle={() => setDropDownOpenClose(!dropdownOpen)}>
            <DropdownToggle className="defaultDropDown" caret>
              Cloud Burst Drop down
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem>Some Action</DropdownItem>
              <DropdownItem disabled>Action (disabled)</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Foo Action</DropdownItem>
              <DropdownItem>Bar Action</DropdownItem>
              <DropdownItem>Quo Action</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardBody>
      </Card>
      <Card className="mt-4 font-size20">
        <CardHeader>Typograpghy</CardHeader>
        <CardBody>
          <Row>
            <Col sm="6 font-weight-800">
              <div>Lato Bold</div>
              {fontTextBlock}
            </Col>
            <Col sm="6 font-family-redHat">
              <div>Red Hat Display Bold</div>
              {fontTextBlock}
            </Col>
            <Col sm="12 mt-5 font-weight-400">
              <div>Lato Medium</div>
              {fontTextBlock}
            </Col>
            <Col sm="12 mt-5 font-weight-300">
              <div>Lato Light</div>
              {fontTextBlock}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default styleGuide;
