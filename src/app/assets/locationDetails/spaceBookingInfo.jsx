/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import {
  Box,
} from '@mui/material';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getDefaultNoValue,
  generateErrorMessage,
} from '../../util/appUtils';
import PropertyAndValue from '../../commonComponents/propertyAndValue';

const SpaceBookingInfo = () => {
  const { getSpaceInfo } = useSelector((state) => state.equipment);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: "50%",
          }}
        >
          <PropertyAndValue
            data={{
              property: 'Space Type',
              value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.type_id ? getSpaceInfo?.data?.[0]?.type_id[1] : '')
            }}
          />
          <PropertyAndValue
            data={{
              property: 'Sub Type',
              value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.sub_type_id ? getSpaceInfo?.data?.[0]?.sub_type_id[1] : '')
            }}
          />
          <PropertyAndValue
            data={{
              property: 'Tenant',
              value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.tenant_id ? getSpaceInfo?.data?.[0]?.tenant_id[1] : '')
            }}
          />
        </Box>
        <Box
          sx={{
            width: "50%",
          }}
        >
          <PropertyAndValue
            data={{
              property: 'Space Status',
              value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.space_status)
            }}
          />
          <PropertyAndValue
            data={{
              property: 'Booking Allowed',
              value: getSpaceInfo?.data?.[0]?.is_booking_allowed ? 'Yes' : 'No'
            }}
          />
          <PropertyAndValue
            data={{
              property: 'Employee',
              value: getDefaultNoValue(getSpaceInfo?.data?.[0]?.employee_id ? getSpaceInfo?.data?.[0]?.employee_id[1] : '')
            }}
          />
        </Box>
      </Box>
      {getSpaceInfo && getSpaceInfo.loading && (
        <Card>
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}
      {(getSpaceInfo && getSpaceInfo.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(getSpaceInfo)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
export default SpaceBookingInfo;
