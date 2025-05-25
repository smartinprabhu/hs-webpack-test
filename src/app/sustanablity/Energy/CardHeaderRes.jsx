import React, { useState, useEffect, useCallback } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useHistory } from 'react-router-dom';
import './CardHeader.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
  Button, FormControl, RadioGroup, Radio, FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CustomRadio = styled(Radio)({
  color: 'white',
  '&.Mui-checked': {
    color: 'white',
  },
});

const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  color: 'white',
  textTransform: 'uppercase',
  '& .MuiFormControlLabel-label': {
    color: 'white',
    fontFamily: 'Mulish',
  },
}));

const CardHeader = (props) => {
  const history = useHistory();
  const {
    children,
    headerText,
    subHeader,
    showMiddleBox = false,
    showToggle = false,
    onInputValueChange,
    onLoadUpdate,
    onOptionChange,
    initialSelectedOption,
    staticInputValue,
    showBackButton = false,
    onBackButtonClick,
    fontSize,
  } = props;

  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [inputValue, setInputValue] = useState(staticInputValue || '0');
  const [isEditing, setIsEditing] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [showInfoIcon, setShowInfoIcon] = useState(true);

  useEffect(() => {
    setSelectedOption(initialSelectedOption);
    setInputValue(staticInputValue || '0');
  }, [initialSelectedOption, staticInputValue]);

  const handleOptionChange = useCallback(
    (event) => {
      const newOption = event.target.value;
      setSelectedOption(newOption);
      setInputValue(newOption === 'Dynamic' ? staticInputValue || '0' : '0');
      setIsEditing(false);
      onInputValueChange('');
      onOptionChange(newOption);
    },
    [onInputValueChange, onOptionChange, staticInputValue],
  );

  const handleInputChange = useCallback(
    (event) => {
      const { value } = event.target;
      setInputValue(value);
      setIsEditing(true);
      onInputValueChange(value);
    },
    [onInputValueChange],
  );

  const handleLoadData = useCallback(() => {
    if (inputValue.trim() === '') return;
    setIsEditing(false);
    onLoadUpdate(inputValue);
    setShowInfoIcon(false);
  }, [inputValue, onLoadUpdate]);

  const handleInfoIconClick = useCallback(() => {
    setInfoDialogOpen(true);
  }, []);

  return (
    <div className="card-header-box-responsive">
      <div className="card-header-inner-box-responsive">
        <h5 className="header-box-title-responsive font-family-tab" style={{ fontSize: fontSize || '16px' }}>
          {showBackButton && (
          <Tooltip title="Back to SLD" placement="top">
            <span
              className="cursor-pointer mr-2"
              onClick={() => {
                if (onBackButtonClick) {
                  onBackButtonClick();
                } else if (window.location.pathname === '/water-sld') {
                  history.push('/water-sld');
                } else {
                  history.push('/environment');
                }
              }}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                size="sm"
              />
            </span>
          </Tooltip>

          )}
          {headerText}
          {' '}
          <span className="card-value-responsive font-family-tab">{subHeader}</span>
        </h5>
      </div>

      {showMiddleBox && (
        <div className="card-header-middle-box-responsive">
          <span className="card-header-middle-text-responsive">Area: 100000 Sq.ft</span>
          <span className="card-header-middle-text-responsive">Occupancy: 5000</span>
        </div>
      )}

      {showToggle && (
        <div className="toggle-container">
          <span className="tog1">Target Setting:</span>

          <FormControl component="fieldset" className="fieldset">
            <RadioGroup
              row
              name="target-setting"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <CustomFormControlLabel value="Dynamic" control={<CustomRadio />} label="Dynamic" />
              <CustomFormControlLabel value="Static" control={<CustomRadio />} label="Linear" />
            </RadioGroup>
          </FormControl>

          <input type="text" value={inputValue} onChange={handleInputChange} className="input-box" />
          <span className="tog">{selectedOption === 'Static' ? 'kWh' : '%'}</span>
          {showInfoIcon && <InfoOutlinedIcon onClick={handleInfoIconClick} className="info-icon" />}
        </div>
      )}

      {isEditing && (
        <div className="edit-buttons">
          <Button variant="contained" color="primary" onClick={handleLoadData}>OK</Button>
          <Button variant="contained" color="secondary" onClick={() => { setInputValue(''); setIsEditing(false); }}>Discard</Button>
        </div>
      )}

      <div style={{ marginTop: '8px' }}>{children}</div>

      <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)}>
        <DialogTitle className="dailoge">Target</DialogTitle>
        <DialogContent className="dailoge1">
          <p>
            <b>Linear:</b>
            {' '}
            This target progresses in a straight line, moving steadily toward a defined endpoint.
          </p>
          <p>
            <b>Dynamic:</b>
            {' '}
            This target adapts to real-time factors to stay aligned with shifting goals.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)} color="primary" className="dailoge">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CardHeader;
