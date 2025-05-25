import React from 'react';
import * as PropTypes from 'prop-types';

import DetailHeader from './detailHeader';
import AssetDetailTabs from './assetDetailTabs';

const AssetsDetail = (props) => {
  const {
    setViewModal,
    viewModal,
    setEquipmentDetails,
    isEquipmentDetails,
    isITAsset,
    categoryType,
  } = props;
  return (
    <>
      <DetailHeader isITAsset={isITAsset} categoryType={categoryType} />
      <AssetDetailTabs setViewModal={setViewModal} viewModal={viewModal} setEquipmentDetails={setEquipmentDetails} isEquipmentDetails={isEquipmentDetails} isITAsset={isITAsset} />
    </>
  );
};
AssetsDetail.propTypes = {
  setViewModal: PropTypes.func.isRequired,
  viewModal: PropTypes.bool.isRequired,
  setEquipmentDetails: PropTypes.func.isRequired,
  isEquipmentDetails: PropTypes.bool.isRequired,
  isITAsset: PropTypes.bool,
  categoryType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

AssetsDetail.defaultProps = {
  isITAsset: false,
  categoryType: false,
};
export default AssetsDetail;
