import React from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { FaRegistered } from 'react-icons/fa';

import MuiTooltip from '@shared/muiTooltip';

import { AddThemeBackgroundColor } from '../themes/theme';

import {
  truncate,
} from '../util/appUtils';

const DetailViewHeader = (props) => {
  const {
    mainHeader, status, shortRight, isScheduled, subHeader, actionComponent, className, mainTwoHeader, mainThreeHeader, extraHeader,
  } = props;
  return (
    <Box
      sx={AddThemeBackgroundColor({
        width: '100%',
        height: '100px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      })}
      className={className}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            width: 'auto',
            alignItems: 'center',
            marginBottom: '5px',
          }}
        >
          <MuiTooltip title={<Typography>{mainHeader}</Typography>}>
            <Typography
              sx={{
                font: 'normal normal normal 20px Suisse Intl',
                letterSpacing: '1.05px',
                color: '#FFFFFF',
              }}
            >
              {truncate(mainHeader, 50)}
              {isScheduled && (
                <MuiTooltip title={<Typography>Rescheduled</Typography>}>
                  <FaRegistered
                    size={15}
                    cursor="pointer"
                    className="ml-1"
                  />
                </MuiTooltip>
              )}
            </Typography>
          </MuiTooltip>
          {status}
        </Box>
        <Typography
          sx={{
            font: 'normal normal normal 16px Suisse Intl',
            letterSpacing: '0.63px',
            color: '#FFFFFF',
            marginTop: '10px',
          }}
        >
          {subHeader}
        </Typography>
        {extraHeader ? (
          <Typography
            sx={{
              font: 'normal normal normal 14px Suisse Intl',
              letterSpacing: '0.63px',
              color: '#FFFFFF',
              marginTop: '10px',
            }}
          >
            {extraHeader}
          </Typography>
        ) : ''}
      </Box>
      {mainTwoHeader && mainTwoHeader.length > 0 && (
      <Box
        sx={{
          width: '25%',
          alignItems: 'left',
          marginBottom: '5px',
        }}
      >
        {
                        mainTwoHeader.map((data) => (
                          data.header ? (
                            <>
                              <Typography
                                sx={{
                                  font: 'normal normal normal 14px Suisse Intl',
                                  letterSpacing: '0.63px',
                                  color: '#FFFFFF',
                                  marginBottom: '10px',
                                  lineBreak: 'anywhere',
                                }}
                              >
                                {data.header}
                              </Typography>
                              <Typography
                                sx={{
                                  font: 'normal normal normal 14px Suisse Intl',
                                  letterSpacing: '0.63px',
                                  color: '#FFFFFF',
                                  marginBottom: '10px',
                                  lineBreak: 'anywhere',
                                }}
                              >
                                {data.value}
                              </Typography>
                            </>
                          ) : ''
                        ))
}
      </Box>
      )}
      {mainThreeHeader && mainThreeHeader.length > 0 && (
      <Box
        sx={!shortRight ? {
          width: 'auto',
          alignItems: 'left',
          marginBottom: '5px',
        } : {
          width: 'auto',
          alignItems: 'left',
          marginBottom: '5px',
          marginRight: '18%'
        }}
      >
        {
                        mainThreeHeader.map((data) => (
                          data.header ? (
                            <>
                              <Typography
                                sx={{
                                  font: 'normal normal normal 14px Suisse Intl',
                                  letterSpacing: '0.63px',
                                  color: '#FFFFFF',
                                  marginBottom: '10px',
                                  lineBreak: 'anywhere',
                                }}
                              >
                                {data.header}
                              </Typography>
                              <Typography
                                sx={{
                                  font: 'normal normal normal 14px Suisse Intl',
                                  letterSpacing: '0.63px',
                                  color: '#FFFFFF',
                                  marginBottom: '10px',
                                  lineBreak: 'anywhere',
                                }}
                              >
                                {data.value}
                              </Typography>
                            </>
                          ) : ''
                        ))
}
      </Box>
      )}
      {actionComponent}
    </Box>
  );
};
export default DetailViewHeader;
