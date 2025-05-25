import React, { useState } from 'react';
import {
    Col,
    Row,
    Card,
    CardBody
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';

import Loader from '@shared/loading';

import tabs from './tabs.json';
import TeamMemberInfo from './teamMemberInfo'
import Teams from '../../../adminSetup/siteConfiguration/teamMemberDetails/teams';

const TeamMemberDetailTabs = () => {

    const [currentTab, setActive] = useState('General');

    const { userDetails } = useSelector((state) => state.setup);
    const { TabPane } = Tabs;

    const changeTab = (key) => {
        setActive(key);
    };
    return (
        <>

            <Card className="border-0 bg-lightblue globalModal-sub-cards">
                {userDetails && (userDetails.data && userDetails.data.length > 0) && (
                    <CardBody className="pl-0 pr-0">
                        <Row>
                            <Col md={12} sm={12} xs={12} lg={12} className="pl-2 pr-1">
                                <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                                    {tabs && tabs.tabsList.map((tabData) => (
                                        <TabPane tab={tabData.name} key={tabData.name} />
                                    ))}
                                </Tabs>
                                <div className="tab-content-scroll hidden-scrollbar">
                                    {currentTab === 'General'
                                        ? <TeamMemberInfo detail={userDetails} />
                                        : ''}
                                    {currentTab === 'Teams'
                                        ? <Card>
                                            <CardBody className="pl-3 pb-0 pt-0 pr-0">
                                                <Teams />
                                            </CardBody>
                                        </Card>
                                        : ''}
                                </div>
                            </Col>
                        </Row>
                        <br />
                    </CardBody>
                )}
                {userDetails && userDetails.loading && (
                    <CardBody className="mt-4" data-testid="loading-case">
                        <Loader />
                    </CardBody>
                )}
            </Card>

        </>
    )
}
export default TeamMemberDetailTabs