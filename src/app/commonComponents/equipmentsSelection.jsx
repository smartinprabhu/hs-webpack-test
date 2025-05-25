/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React, { useState } from 'react';

import Drawer from '@mui/material/Drawer';

import assetIcon from '@images/icons/assetDefault.svg';

import DrawerHeader from './drawerHeader';

import Assets from '../assets/equipments';

const EquipmentsSelection = ({
  onAssetModalChange, categoryId, filterModal, finishText, onClose, onCancel, setEquipments, equipments,
}) => {
  const [addModal, showAddModal] = useState(filterModal);

  const onFinish = () => {
    showAddModal(false);
    onClose();
  };

  const onCancelModal = () => {
    showAddModal(false);
    onCancel();
  };


  return (
    <Drawer
      PaperProps={{
        sx: { width: '80%' },
      }}
      anchor="right"
      open={addModal}
      ModalProps={{
        disableEnforceFocus: false,
      }}
    >
      <DrawerHeader
        headerName="Select Equipment"
        imagePath={assetIcon}
        onClose={() => onCancelModal()}
      />
      <Assets
        isSearch
        isMini
        onAssetChange={onAssetModalChange}
        resetAssets={() => setEquipments([])}
        finishText={finishText}
        isCommon
        assetCategory={categoryId}
        oldAssets={equipments && equipments.length > 0 ? equipments : []}
        afterReset={() => onFinish()}
      />
    </Drawer>
  );
};

export default EquipmentsSelection;
