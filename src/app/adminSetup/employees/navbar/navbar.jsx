import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faCog,
} from '@fortawesome/free-solid-svg-icons';

import sideNav from './navlist.json';

const faIcons = {
  EMPLOYEES: faUsers,
};

const Navbar = (props) => {
  const { id } = props;
  return (
    <Row>
      <Col md="6" sm="6" lg="3">
        <h3 className="mt-1">
          <FontAwesomeIcon color="deepskyblue" className="mr-2" size="sm" icon={faCog} />
          {sideNav.title}
        </h3>
      </Col>
      <Col md="6" sm="6" lg="9">
        <Nav>
          {sideNav && sideNav.data.map((data, index) => (
            <NavItem key={data.id} onClick={() => (index)}>
              <NavLink className={(index + 1) === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${data.pathName}`}>
                <FontAwesomeIcon className="mr-2" size="sm" icon={faIcons[data.name]} />
                {data.displayname}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Col>
    </Row>
  );
};

Navbar.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Navbar;
