import React from 'react';
import {
    IconButton,
    Button
} from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import MuiTooltip from '@shared/muiTooltip';

import MuiAccordion from './muiAccordian';

const ReportsFilterDrawer = ({
  hideHead, onCloseFilters, onCloseFilters1, isReset, onApplyFilters, filtersComponentsArray, isDisabled,
}) => (
  <>
    <div className="filter-drawer-box-custom">
      {!hideHead && (
      <div className="filter-text-box">
        <p className="filter-by-text">Filters</p>
        <MuiTooltip title="Close">
                    <IconButton
                        className="btn"
                        onClick={onCloseFilters1 ? onCloseFilters1 : onCloseFilters}
                    >
                        <IoCloseOutline size={25} />
                    </IconButton>
                </MuiTooltip>
      </div>
      )}
      {filtersComponentsArray && filtersComponentsArray.length && filtersComponentsArray.map((fComponent, index) => (
        <>
          {fComponent.title
            ? (
              <MuiAccordion title={fComponent.title} panel={`${'Panel'}${index}`}>
                {fComponent.component}
              </MuiAccordion>
            )
            : ''}
        </>
      ))}
    </div>
    <div className="sticky-button-30drawer">
      <Button type="button" variant="outlined" className="mr-3" onClick={onCloseFilters}>
        {isReset ? 'Reset' : 'Cancel'}
      </Button>
      <Button type="button" variant="contained" onClick={onApplyFilters} disabled={isDisabled}>
        Apply
      </Button>
    </div>
  </>
);

export default ReportsFilterDrawer;
