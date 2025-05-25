import React, { useState, useEffect } from 'react';
import {
    Nav,
    NavLink,
    Col,
    Row,
} from 'reactstrap';
import consumptionBlack from '@images/consumptionBlack.png';

import { useSelector, useDispatch } from 'react-redux';
import { resetNinjaCode } from '../analytics/analytics.service';
// import DashboardView from '../nocDashboards/assetsDashboard/dashboardView';
import { getSequencedMenuItems, getModuleDisplayName } from '../util/appUtils';
import EnergyMeters from './customDashboards/energyMeters';
import SharedDashboard from '../shared/sharedDashboard';

const ConsumptionDashboards = () => {
    const module = 'Consumption Dashboards'
    const [currentTab, setActive] = useState(0);
    const [currentDashboard, setCurrentDashboard] = useState(0);
    const [isOldDashboard, setOldDashboard] = useState(false)

    const dispatch = useDispatch()

    const { userRoles } = useSelector((state) => state.user);

    const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Consumption Dashboards', 'display');

    const menus = getSequencedMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Consumption Dashboards', 'name');

    useEffect(() => {
        if (menus && menus.length) {
            setCurrentDashboard(menus[0])
        }
    }, [])

    const onClickNavLink = (menu, index) => {
        setCurrentDashboard(menu);
        setActive(index);
        dispatch(resetNinjaCode());
    }

    return (
        <>
            <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 border bg-med-blue-dashboard`}>
                <Col sm="12" md="12" lg="12" xs="12">
                    <Row className="mt-0">
                        <Col md="4" sm="4" lg="4" xs="12" >
                            <h3 className="mt-1 d-flex align-items-center text-break">
                                <img src={consumptionBlack} alt="actions" className="mr-3 mb-1" width="30" height="30" />
                                UPS Dashboards
                            </h3>
                        </Col>
                        <Col md="8" sm="8" lg="8" xs="12" className="mt-1 margin-negative-left-30px">
                            <Nav>
                                {menus && menus.length > 0 ? menus.map((menu, index) => (
                                    <div key={menu} onClick={() => (index)}>
                                        <NavLink
                                            className="nav-link-item pt-2 pb-1 pl-1 pr-1"
                                            active={currentTab === index}
                                            href="#"
                                            onClick={() => onClickNavLink(menu, index)}
                                        >
                                            <img
                                                src={consumptionBlack}
                                                className="mr-2 mb-1"
                                                alt={menu.name}
                                                width="17"
                                                height="17"
                                            />
                                            {menu.name}
                                        </NavLink>
                                    </div>
                                )) : ''}
                            </Nav>
                        </Col>
                    </Row>
                    <hr className="m-0 mt-1" />
                    <Row className="p-1">
                        <Col sm="12" md="12" lg="12" xs="12" className="p-0">
                            {currentDashboard && currentDashboard.name !== 'Energy Meters' ? (
                                <SharedDashboard
                                    moduleName={module}
                                    menuName={currentDashboard.name}
                                    setOldDashboard={setOldDashboard}
                                    isOldDashboard={isOldDashboard}
                                />
                            ) : ''}
                            {currentDashboard && currentDashboard.name === 'Energy Meters' ? (
                                <EnergyMeters currentDashboard={currentDashboard} />
                            ) : ''}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}
export default ConsumptionDashboards