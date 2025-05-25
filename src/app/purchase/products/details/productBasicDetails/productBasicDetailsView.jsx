/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Drawer } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
} from '../../../../util/appUtils';
import DrawerHeader from '@shared/drawerHeader';
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import AddReorderingRules from '../../../products/reorderingRules/addReorderingRules';

import GeneralInfo from './generalInfoView';
import { clearAddReOrderingRule } from '../../../purchaseService'

const productBasicDetailsView = (props) => {
  const dispatch = useDispatch()
  const {
    detailData,
  } = props;
  const [openModal, setOpenModal] = useState(false)
  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const onCloseDrawer = () => {
    if (document.getElementById('reorderForm')) {
      document.getElementById('reorderForm').reset();
    }
    dispatch(clearAddReOrderingRule())
    setOpenModal(false)
  }

  return (
    <>
      {viewData && (
        <div>
          <Row className="p-0 work-permit-overview">
            <Col sm="12" md="6" xs="12" lg="6" className="mb-2 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">GENERAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <GeneralInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            {/* <Col sm="12" md="6" xs="12" lg="6" className="mb-2 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ADDITIONAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <AdditionalInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col> */}
          </Row>
        </div>
      )}
      {detailData && detailData.loading && (
        <Card>
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}

      {(detailData && detailData.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(detailData)} />
          </CardBody>
        </Card>
      )}
      <Drawer
        title=""
        closable={false}
        width={736}
        className="drawer-bg-lightblue"
        visible={openModal}
      >
        <DrawerHeader
          title="Create Reordering Rules"
          imagePath={InventoryBlue}
          closeDrawer={onCloseDrawer}
        />
        <AddReorderingRules closeAddModal={() => setOpenModal(false)} afterReset={onCloseDrawer} product={viewData} defaultWarehouse={true} defaultLocation={true} />
      </Drawer>
    </>
  );
};

productBasicDetailsView.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  openWorkOrder: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
};
export default productBasicDetailsView;
