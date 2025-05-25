import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
} from '@mui/material';

const ChartCard = ({
  title, subtitle, className, children, actions,
}) => (
  <Card className="esg-overview" sx={{ overflow: 'hidden', height: '100%' }}>
    <CardHeader
      sx={{ py: 2, px: 2 }}
      title={(
        <Typography className="font-family-tab" variant="subtitle1" fontWeight={500}>
          {title}
        </Typography>
        )}
      subheader={
          subtitle && (
            <Typography className="font-family-tab" variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )
        }
      action={
          actions && <Box display="flex" alignItems="center">{actions}</Box>
        }
    />
    <CardContent sx={{ py: 0, px: 2 }}>
      {children}
    </CardContent>
  </Card>
);

export default ChartCard;
