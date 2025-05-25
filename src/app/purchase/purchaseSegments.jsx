import React, { useEffect } from 'react';
import {
  Card,
  CardBody,
  Row,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import tabs from './tabs.json';
import {
  setIsPo, setIsRequestQuotation, setProductRedirectId, setInitialValues, setProducts, productFilters, getVendorFilters, getPurchaseAgreementFilters,
} from './purchaseService';
import {
  getMenuItems,
} from '../util/appUtils';

const PurchaseSegments = (props) => {
  const { id } = props;
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'name');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const onClickMenu = () => {
    dispatch(productFilters([], [], []));
    dispatch(getVendorFilters([], [], []));
    dispatch(getPurchaseAgreementFilters([]));
    dispatch(setIsPo(false));
    dispatch(setIsRequestQuotation(false));
    dispatch(setProductRedirectId(false));
    dispatch(setProducts(false));
    dispatch(setInitialValues(false, false, false, false));
  };

  return (
    <>
      <Card className="border-0 h-100">
        <CardBody className="p-0">
          <Row className="p-1 ml-2 mt-1">
            <Nav>
              {menuList && menuList.map((menu, index) => (
                tabs && tabs.tabsList && tabs.tabsList[menu] && (
                  <div className="mr-4 ml-4">
                    <NavItem key={menu} onClick={() => (index)}>
                      <NavLink
                        className={tabs.tabsList[menu].name === id ? 'nav-link-item active pt-2 pb-1 pl-1 pr-1' : 'nav-link-item pt-2 pb-1 pl-1 pr-1'}
                        onClick={onClickMenu}
                        tag={Link}
                        to={`${tabs.tabsList[menu].pathName}`}
                      >
                        {tabs.tabsList[menu].name}
                      </NavLink>
                    </NavItem>
                  </div>
                )
              ))}
            </Nav>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

PurchaseSegments.propTypes = {
  id: PropTypes.number.isRequired,
};

export default PurchaseSegments;
