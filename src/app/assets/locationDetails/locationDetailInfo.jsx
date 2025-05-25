/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import {
  Typography,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Image } from 'antd';
import ErrorContent from '@shared/errorContent';
import workstationBlue from '@images/icons/deskBlue.svg';
import { getDefaultNoValue, generateErrorMessage } from '../../util/appUtils';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import { detailViewHeaderClass } from '../../commonComponents/utils/util';

const LocationDetailInfo = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [seeMore, setMore] = useState(false);
  const [modalImage, setModalImage] = useState(false);

  const toggleImage = () => {
    setModalImage(!modalImage);
  };
  const toggle = () => {
    setModal(!modal);
  };

  const { userInfo } = useSelector((state) => state.user);
  const {
    getFloorsInfo, getSpaceInfo,
  } = useSelector((state) => state.equipment);

  const isUserError = (userInfo && userInfo.err) || (getFloorsInfo && getFloorsInfo.err);
  const isUserLoading = (userInfo && userInfo.loading) || (getFloorsInfo && getFloorsInfo.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const floorsErrmsg = (getFloorsInfo && getFloorsInfo.err) ? generateErrorMessage(getFloorsInfo) : userErrorMsg;
  const errorMsg = (getSpaceInfo && getSpaceInfo.err) ? generateErrorMessage(getSpaceInfo) : floorsErrmsg;

  const filePath = getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length && getSpaceInfo.data[0].image_medium ? `data:image/png;base64,${getSpaceInfo.data[0].image_medium}` : false;

  const leftInfoArray = [
    {
      property: 'Location',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.path_name)
    },
    {
      property: 'Parent Space',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.parent_id ? getSpaceInfo?.data?.[0]?.parent_id[1] : '')
    },
    {
      property: 'Category',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.asset_category_id ? getSpaceInfo?.data?.[0]?.asset_category_id[1] : '')
    },
    {
      property: 'Sub Category',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.asset_subcategory_id ? getSpaceInfo?.data?.[0]?.asset_subcategory_id[1] : '')
    },
    {
      property: 'Maintenance Team',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.maintenance_team_id ? getSpaceInfo?.data?.[0]?.maintenance_team_id[1] : '')
    },
    {
      property: 'Company',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.company_id ? getSpaceInfo?.data?.[0]?.company_id[1] : '')
    },
    {
      property: 'Manager',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.manager_id ? getSpaceInfo?.data?.[0]?.manager_id[1] : '')
    },
    {
      property: 'Vendor',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.vendor_id ? getSpaceInfo?.data?.[0]?.vendor_id[1] : '')
    },
  ]

  const rightInfoArray = [
    {
      property: 'Alias Name',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.alias_name_space)
    },
    {
      property: 'Sort Sequence',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.sort_sequence)
    },
    {
      property: 'Square Feet',
      value: getSpaceInfo?.data?.[0]?.area_sqft
    },
    {
      property: 'Max Occupancy',
      value: getSpaceInfo?.data?.[0]?.max_occupancy
    },
    {
      property: 'External QR Code',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.qr_code)
    },
    {
      property: 'Monitored By (L1)',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.monitored_by_id ? getSpaceInfo?.data?.[0]?.monitored_by_id[1] : '')
    },
    {
      property: 'Managed By (L2)',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.managed_by_id ? getSpaceInfo?.data?.[0]?.managed_by_id[1] : '')
    },
    {
      property: 'Maintained By (L3)',
      value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.maintained_by_id ? getSpaceInfo.data[0].maintained_by_id[1] : '')
    },
  ]
  return (
    <>
      {getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length > 0 && (<>
        <DetailViewLeftPanel
          panelData={[{
            header: 'LOCATION INFO',
            leftSideData: leftInfoArray,
            rightSideData: rightInfoArray
          }
          ]}
        />
        <Typography
          sx={detailViewHeaderClass}
        >
          MAP OVERVIEW
        </Typography>
        {(getSpaceInfo?.data?.[0]?.upload_images) && (
          <Image.PreviewGroup>
            <Image
              width="30%"
              height="auto"
              src={`data:image/png;base64,${getSpaceInfo?.data?.[0]?.upload_images}`}
            />
          </Image.PreviewGroup>
        )}
        {!(getSpaceInfo?.data?.[0]?.upload_images) && (
          <ErrorContent errorTxt="No data found." />
        )}
      </>)}
      {((getSpaceInfo && getSpaceInfo.err) || isUserError) && (
        <CardBody>
          <ErrorContent errorTxt={errorMsg} />
        </CardBody>
      )}
      <Modal isOpen={modal} size="lg">
        <ModalHeader toggle={toggle}>Map Overview</ModalHeader>
        <ModalBody>
          <img
            src={getSpaceInfo?.data?.[0]?.upload_images ? `data:image/png;base64,${getSpaceInfo?.data?.[0]?.upload_images}` : ''}
            alt="floor"
            width="100%"
            height="100%"
            aria-hidden="true"
          />
        </ModalBody>
      </Modal>
      <Modal isOpen={modalImage} size="lg">
        <ModalHeader toggle={toggleImage}>{getSpaceInfo?.data?.[0]?.space_name}</ModalHeader>
        <ModalBody>
          <img
            src={filePath || workstationBlue}
            alt="location1"
            width="100%"
            height="100%"
          />
        </ModalBody>
      </Modal>
    </>
  );
};
export default LocationDetailInfo;
