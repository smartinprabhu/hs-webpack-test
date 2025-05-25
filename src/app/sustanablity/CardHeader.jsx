import React, { useState, useEffect, useCallback } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import {
  FormControl, RadioGroup, Radio, FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import './CardHeader.css'; // External styles
import { CustomRadio, CustomFormControlLabel } from '../sustanablity/Energy/StyledComponents';


const CardHeader = ({
  children,
  headerText,
  subHeader,
  // showMiddleBox = false,
  showToggle = false,
  onInputValueChange,
  onLoadUpdate,
  onOptionChange,
  initialSelectedOption,
  staticInputValue,
  showBackButton = false,
  onBackButtonClick,
  fontSize,
}) => {
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [inputValue, setInputValue] = useState(staticInputValue || '');
  const [isEditing, setIsEditing] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [showInfoIcon, setShowInfoIcon] = useState(true);

  // Handle prop updates
  useEffect(() => {
    setSelectedOption(initialSelectedOption);
    setInputValue(staticInputValue || '');
  }, [initialSelectedOption, staticInputValue]);

  // Handle option change
  const handleOptionChange = useCallback(
    (event) => {
      const newOption = event.target.value;
      setSelectedOption(newOption);
      setInputValue(newOption === 'Dynamic' ? staticInputValue || '' : '');
      setIsEditing(false);
      onInputValueChange('');
      onOptionChange(newOption);
    },
    [onInputValueChange, onOptionChange, staticInputValue],
  );

  // Handle input change
  const handleInputChange = useCallback(
    (event) => {
      const { value } = event.target;
      setInputValue(value);
      setIsEditing(true);
      onInputValueChange(value);
    },
    [onInputValueChange],
  );

  // Load data handler
  const handleLoadData = useCallback(() => {
    if (inputValue.trim()) {
      setIsEditing(false);
      onLoadUpdate(inputValue);
      setShowInfoIcon(false);
    }
  }, [inputValue, onLoadUpdate]);

  // Toggle info dialog
  const handleInfoIconClick = useCallback(() => {
    setInfoDialogOpen(true);
  }, []);

  return (
    <div className="card-header-container">
      {/* Header section */}
      <div className="card-header">
        <h1 className="header-title" style={{ fontSize: fontSize || '2rem' }}>
          {showBackButton && (
            <button
              onClick={onBackButtonClick}
              className="back-button"
            >
              <span className="back-symbol">&lt;</span>
              {' '}
              Back
            </button>
          )}
          {headerText}
          {' '}
          <span className="sub-header">{subHeader}</span>
        </h1>
      </div>

      {/* Middle section */}
{/*       {showMiddleBox && (
        <div className="card-header-middle">
          <span className="middle-text">Area: 100,000 Sq.ft</span>
          <span className="middle-text">Occupancy: 5,000</span>
        </div>
      )}
 */}
      {/* Toggle section */}
      {showToggle && (
        <div className="toggle-section">
          <span className="toggle-label">Target Setting:</span>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <CustomFormControlLabel
                value="Dynamic"
                control={<CustomRadio />}
                label="Dynamic"
              />
              <CustomFormControlLabel
                value="Static"
                control={<CustomRadio />}
                label="Linear"
              />
            </RadioGroup>
          </FormControl>

          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="input-box"
          />
          <span className="unit-label">
            {selectedOption === 'Static' ? 'kWh' : '%'}
          </span>

          {showInfoIcon && (
            <InfoOutlinedIcon
              onClick={handleInfoIconClick}
              className="info-icon"
            />
          )}
        </div>
      )}

      {/* Action buttons */}
      {isEditing && (
        <div className="action-buttons">
          <Button onClick={handleLoadData} variant="contained" color="primary">
            OK
          </Button>
          <Button
            onClick={() => {
              setInputValue('');
              setIsEditing(false);
            }}
            variant="contained"
            color="secondary"
          >
            Discard
          </Button>
        </div>
      )}

      {/* Children content */}
      <div>{children}</div>

      {/* Info Dialog */}
      <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)}>
        <DialogTitle className="dialog-title">Target</DialogTitle>
        <DialogContent className="dialog-content">
          <p>
            <b>Linear:</b>
            {' '}
            Progresses in a straight line toward a defined endpoint.
          </p>
          <p>
            <b>Dynamic:</b>
            {' '}
            Adapts to real-time factors like temperature and seasonality.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CardHeader;
