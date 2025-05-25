/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { green, red, grey } from '@mui/material/colors';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';

const KPICard = ({
  title,
  value,
  description,
  trend,
  className,
  trendValue,
  icon,
}) => {
  const trendColor = {
    up: green[700],
    down: red[700],
    neutral: grey[600],
  }[trend] || grey[600];

  const TrendIcon = {
    up: ArrowUpwardIcon,
    down: ArrowDownwardIcon,
    neutral: RemoveIcon,
  }[trend] || RemoveIcon;

  return (
    <Card className="esg-overview" sx={{ overflow: 'hidden', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography className="font-family-tab" variant="body2" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            <Typography className="font-family-tab" variant="h5" fontWeight="bold">
              {value}
            </Typography>
            {description && (
              <Typography className="font-family-tab" variant="caption" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box color="primary.main">
              {icon}
            </Box>
          )}
        </Box>

        {trend && (
          <Box
            display="flex"
            alignItems="center"
            mt={2}
            color={trendColor}
            fontSize={12}
            fontWeight={500}
          >
            <TrendIcon fontSize="small" sx={{ mr: 0.5 }} />
            {trendValue}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
