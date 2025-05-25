/* eslint-disable import/no-cycle */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer } from 'antd';

import DrawerHeader from '@shared/drawerHeader';
import {
  getDefaultNoValue, htmlToReact,
} from '../../util/appUtils';
import {
  getWorkOrderTypeName,
} from '../utils/utils';
import {
  getAssetDetail,
} from '../../assets/equipmentService';
import AssetDetails from '../../assets/assetDetails/assetsDetail';

const appModels = require('../../util/appModels').default;

const GeneralInfo = (props) => {
  const {
    detailData,
    setViewModal,
  } = props;
  const dispatch = useDispatch();
  const {
    equipmentsDetails,
  } = useSelector((state) => state.equipment);
  const [viewId, setViewId] = useState(0);
  const [detailModal, setDetailModal] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  }, [userInfo, viewId]);

  const onView = (id) => {
    setViewId(id);
    setViewModal(false);
    setDetailModal(true);
  };

  const onViewReset = () => {
    setViewId(0);
    setDetailModal(false);
    setViewModal(true);
  };

  return (detailData && (
  <Row className="m-0">
    <Col sm="12" md="12" xs="12" lg="12">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Cause</span>
      </Row>
      <Row className="m-0">
        <p
          className="font-weight-700 text-capital font-side-heading m-0 p-0 max-height-80 overflow-auto thin-scrollbar"
          dangerouslySetInnerHTML={{ __html: htmlToReact(detailData.cause) }}
        />
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Type</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(getWorkOrderTypeName(detailData.type_category))}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
      {detailData.type_category === 'equipment' && (
        <>
          <Col sm="12" md="6" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Equipment</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-info text-capital text-break cursor-pointer" aria-hidden onClick={() => onView(detailData.equipment_id ? detailData.equipment_id[0] : '')}>
                {getDefaultNoValue(detailData.equipment_id ? detailData.equipment_id[1] : '')}
              </span>
            </Row>
            <p className="mt-2" />
          </Col>
          <Col sm="12" md="6" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Equipment Location</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital text-break">
                {getDefaultNoValue(detailData.equipment_location_id ? detailData.equipment_location_id[1] : '')}
              </span>
            </Row>
            <p className="mt-2" />
          </Col>
        </>
      )}
      {detailData.type_category === 'asset' && (
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Space</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital text-break">
              {getDefaultNoValue(detailData.asset_id ? detailData.asset_id[1] : '')}
            </span>
          </Row>
          <p className="mt-2" />
        </Col>
      )}
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text"> Asset Number</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.sequence)}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="12" xs="12" lg="12">
      <Row className="m-0">
        <span className="m-0 p-0 light-text"> Description</span>
      </Row>
      <Row className="m-0">
        <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
          <Row className="m-0 small-form-content hidden-scrollbar">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.description)}</span>
          </Row>
        </Col>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text"> Site</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.company_id ? detailData.company_id[1] : '')}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Drawer
      title=""
      closable={false}
      className="drawer-bg-lightblue"
      width={1250}
      visible={detailModal}
    >
      <DrawerHeader
        title={equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0)
          ? `${'Equipment'}${' - '}${equipmentsDetails.data[0].name}` : 'Equipment'}
        imagePath={false}
        isEditable={false}
        closeDrawer={() => onViewReset()}
        onEdit={false}
        onPrev={false}
        onNext={false}
      />
      <AssetDetails isEdit={false} afterUpdate={false} viewModal={detailModal} />
    </Drawer>
  </Row>
  )
  );
};

GeneralInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setViewModal: PropTypes.func.isRequired,
};
export default GeneralInfo;
