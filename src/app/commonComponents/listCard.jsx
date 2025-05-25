/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import {
  ListItem, ListItemText, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useDispatch } from 'react-redux';

const MaintenanceSegments = ({ categoryData, onClickCard, categoryId }) => {
  const dispatch = useDispatch();

  return (
    <Box
      sx={categoryId.id === categoryData.id ? {
        borderLeft: '12px solid #168dfc',
        borderRadius: '4px',
        background: '#0789b50d',
        margin: '6px 3px',
        padding: '0px 5px',
        cursor: 'pointer',
      } : {
        borderLeft: '12px solid #00000040',
        borderRadius: '4px',
        background: '#0000000d',
        margin: '6px 3px',
        padding: '0px 5px',
        cursor: 'pointer',
      }}
      onClick={() => { onClickCard(categoryData); }}
    >
      <ListItem
        alignItems="flex-start"
        disablePadding
      >
        <ListItemText
          disableTypography
          primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{categoryData.name || categoryData.path_name }</Typography>}
        />
      </ListItem>
      <ListItem
        alignItems="flex-start"
        disablePadding
        secondaryAction={(
          <Typography
            sx={{ display: 'inline', fontSize: '12px' }}
          >
            0
          </Typography>
      )}
      >
        <ListItemText
          secondary={(
            <Typography
              sx={{ display: 'inline', fontSize: '12px' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              DAILY INSPECTION
            </Typography>
          )}
        />
      </ListItem>
      <ListItem
        alignItems="flex-start"
        disablePadding
        secondaryAction={(
          <Typography sx={{ display: 'inline', fontSize: '12px' }}>
            0
          </Typography>
      )}
      >
        <ListItemText
          secondary={(

            <Typography
              sx={{ display: 'inline', fontSize: '12px' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              WEEKLY PPMs
            </Typography>
          )}
        />
      </ListItem>
    </Box>
  );
};

MaintenanceSegments.propTypes = {
  categoryData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default MaintenanceSegments;
