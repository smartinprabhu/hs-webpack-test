/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React, { useState } from 'react';

import Drawer from '@mui/material/Drawer';

import assetIcon from '@images/icons/assetDefault.svg';

import DrawerHeader from './drawerHeader';

import InspectionList from '../adminSetup/assetsLocationConfiguration/maintenance/inspectionList';

import { getDateTimeUtcMuI } from '../util/appUtils';

const SchedulesSelection = ({
  onScheduleModalChange, holidayEnd, holidayStart, filterModal, finishText, onClose, onCancel, setSchedules, schedules,
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
        headerName="Select Schedule"
        imagePath={assetIcon}
        onClose={() => onCancelModal()}
      />
      <InspectionList
        isBulkSelect
        onScheduleChange={onScheduleModalChange}
        resetSchedule={() => setSchedules([])}
        finishText={finishText}
        oldSchedules={schedules && schedules.length > 0 ? schedules : []}
        afterReset={() => onFinish()}
        holidayEnd={getDateTimeUtcMuI(holidayEnd)}
        holidayStart={getDateTimeUtcMuI(holidayStart)}
      />
    </Drawer>
  );
};

export default SchedulesSelection;
