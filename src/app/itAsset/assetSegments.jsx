import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Row,
  Nav,
  NavLink,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import tabs from './assetList.json';
import { setInitialValues } from '../purchase/purchaseService';
import {
  setCurrentTab,
} from '../inventory/inventoryService';
import { getEquipmentFilters } from '../assets/equipmentService';
import Assets from '../assets/equipments';

const AssetSegments = () => {
  const [currentTab, setActive] = useState('Components');
  const [activeSet, isSet] = useState(false);
  const menuList = ['Components', 'Accessories', 'Equipments'];
  const dispatch = useDispatch();
  const { currentWorkingTab } = useSelector((state) => state.inventory);

  // const { userRoles } = useSelector((state) => state.user);

  // const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'name');

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (menuList && menuList.length) {
      const activeMenus = [];
      menuList.map((menu) => (
        tabs && tabs.tabsList && tabs.tabsList[menu] && (
          activeMenus.push(tabs.tabsList[menu].name)
        )
      ));
      const index = activeMenus.findIndex((obj) => (obj === 'Components'));
      if (index === -1) {
        setActive(activeMenus[0]);
      }
    }
  }, [menuList]);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else if (!activeSet) {
      setActive('Components');
    }
  }, [currentWorkingTab, activeSet]);

  return (
    <>
      <Card className="border-0 h-100 iTAssetOverview-subHeader">
        <CardBody className="p-0">
          <Row className="p-1 ml-2 mt-1 ">
            <Nav>
              {menuList && menuList.map((menu) => (
                tabs && tabs.tabsList && tabs.tabsList[menu] && (
                <div key={menu} className="mr-4 ml-4">
                  <NavLink
                    className="nav-link-item pt-2 pb-1 pl-1 pr-1"
                    active={currentTab === tabs.tabsList[menu].name}
                    href="#"
                    onClick={() => {
                      dispatch(setCurrentTab(''));
                      setActive(tabs.tabsList[menu].name);
                      isSet(true);
                      dispatch(getEquipmentFilters([]));
                      dispatch(setInitialValues(false, false, false, false));
                    }}
                  >
                    {tabs.tabsList[menu].name}
                  </NavLink>
                </div>
                )
              ))}
            </Nav>
          </Row>
          {currentTab === 'Components'
            ? <Assets menuType="ITAsset" assetType="Components" />
            : ''}
          {currentTab === 'Accessories'
            ? <Assets menuType="ITAsset" assetType="Accessories" />
            : ''}
          {currentTab === 'Equipments'
            ? <Assets menuType="ITAsset" assetType="Equipments" />
            : ''}
        </CardBody>
      </Card>
    </>
  );
};

export default AssetSegments;
