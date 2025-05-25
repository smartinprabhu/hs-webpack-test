import React from 'react';
import {
  DialogTitle,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MuiTooltip from '@shared/muiTooltip';

const DialogHeader = ({
  title, subtitle, onClose, isLeftSubTitle, rightButton, imagePath, fontAwesomeIcon, response, sx, disableClose, hideClose = false,
}) => (
  <DialogTitle sx={sx || ''}>
    <div className="url-popup-header-box">
      <Box sx={{
        fontFamily: 'Suisse Intl',
      }}
      >
        <Typography
          className="font-family-tab"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '20px',
            fontWeight: '700',
            wordBreak: 'break-word',
          }}
        >
          {imagePath ? (<img src={imagePath} className="mr-2" alt="altImage" width="25" height="25" />) : ''}
          {fontAwesomeIcon ? <FontAwesomeIcon className="mx-2 fa-lg" icon={fontAwesomeIcon} /> : ''}
          {title}
        </Typography>
        <Typography
          className="font-family-tab"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: isLeftSubTitle ? '12px' : '10px',
            marginLeft: isLeftSubTitle ? '3px' : '42px',
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      {/* <IconButton
                    onClick={onClose}
                    className="btn"
                    type="button"
                >
                    <IoCloseOutline size={28} />
                </IconButton> */}
      {response && (response.data || response.status || response.loading) ? '' : (
        !hideClose && (
        <MuiTooltip title={<Typography>Close</Typography>}>
          <IconButton
            onClick={onClose}
            className={rightButton ? 'btn float-right' : 'btn'}
            type="button"
            disabled={disableClose}
          >
            <IoCloseOutline size={28} />
          </IconButton>
        </MuiTooltip>
        )
      )}
    </div>
  </DialogTitle>
);
export default DialogHeader;
