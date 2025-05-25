/* eslint-disable import/no-unresolved */
import { Tabs } from 'antd';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/system';
import DetailViewTab from '../../commonComponents/detailViewTab';
import SiteConfiguration from './siteBasicDetails';
import {
   TabPanel,
} from '../../util/appUtils';
import MaintenanceChecklistInfo from '../../adminSetup/maintenanceConfiguration/checklists';

const { TabPane } = Tabs;
const SiteDetailTabs = (props) => {
  const {
    setDetailViewClose,
  } = props;
  const [value, setValue] = useState(0);
  const [currentTab, setActive] = useState('Configuration');
  let tabs = ['Configuration', 'Maintenance Checklist'];

  const changeTab = (key) => {
    setActive(key);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const { siteDetails, onBoardCopyInfo } = useSelector((state) => state.site);
  const loading = (siteDetails && siteDetails.loading) || (onBoardCopyInfo && onBoardCopyInfo.loading);

  return (
    !loading && (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            width: '100%',
          }}
        >
          <DetailViewTab
            value={value}
            handleChange={handleTabChange}
            tabs={tabs}
          />
          <TabPanel value={value} index={0}>
            <SiteConfiguration detailData={siteDetails} setDetailViewClose={setDetailViewClose} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MaintenanceChecklistInfo detailData={siteDetails} setDetailViewClose={setDetailViewClose} />
          </TabPanel>
        </Box>
      </Box>
    /* <Card className="border-0 globalModal-sub-cards bg-lightblue">
        {siteDetails && (siteDetails.data && siteDetails.data.length > 0) && (
          <CardBody className="pl-0 pr-0">
            <Row>
              <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
                <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                  {tabs && tabs.tabsList.map((tabData) => (
                    <TabPane tab={tabData.name} key={tabData.name} />
                  ))}
                </Tabs>
                <div className="tab-content-scroll hidden-scrollbar">
                  {currentTab === 'Configuration'
                    ? <SiteConfiguration detailData={siteDetails} setDetailViewClose={setDetailViewClose} />
                    : ''}
                  {currentTab === 'Maintenance Checklist'
                    ? <MaintenanceChecklistInfo detailData={siteDetails} setDetailViewClose={setDetailViewClose} />
                    : ''}
                </div>
              </Col>
            </Row>
            <br />
          </CardBody>
        )}
      </Card> */
    )
  );
};

SiteDetailTabs.propTypes = {
  setDetailViewClose: PropTypes.func.isRequired,
};

export default SiteDetailTabs;
