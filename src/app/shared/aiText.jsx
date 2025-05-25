/* eslint-disable no-nested-ternary */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import {
  Button,
  Skeleton,
  TextField,
  Dialog, DialogActions, DialogContent, DialogContentText,
  List, ListItem, ListItemText, Typography,
  IconButton,
} from '@mui/material';
import {
  BsPencil,
  BsSave,
} from 'react-icons/bs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

import MuiTooltip from '@shared/muiTooltip';
import DialogHeader from '../commonComponents/dialogHeader';
import { AddThemeColor } from '../themes/theme';

const AiText = ({
  actionModal, subject, atCancel, atFinish,
}) => {
  const [modal, setModal] = useState(actionModal);
  const [selected, setSelected] = useState(null);
  const [tone, setTone] = useState('formal');
  const [suggestions, setSuggestions] = useState([]);

  const [isEdit, setEdit] = useState(false);
  const [enteredText, setText] = useState(subject);
  const [tempText, setTempText] = useState(subject);

  useEffect(() => {
    setText(subject);
    setTempText(subject);
  }, [subject]);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const [serverResponse, setServerResponse] = useState({ loading: false, data: null, err: null });

  useEffect(() => {
    if (enteredText) {
      setServerResponse({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}webhook/62fed599-8e83-4242-a571-4be6fb4b6853?user_input=${encodeURIComponent(enteredText)}&token=eget4ykt5kr8ej8jrgt&tone=${tone}`,
        headers: {
          portalDomain: window.location.origin,
        },
      };
      axios(config)
        .then((response) => {
          setServerResponse({
            loading: false, data: response.data, count: response.data.length, err: null,
          });
          if (response && response.data && response.data.length && response.data[0].response && response.data[0].response.length > 0) {
            const newSuggestions = response.data[0].response;
            setSuggestions((prevSuggestions) => {
              const newMessages = [...prevSuggestions, ...newSuggestions];
              const newMessages1 = [...new Map(newMessages.map((item) => [item, item])).values()];
              return newMessages1;
            });
          }
        })
        .catch((error) => {
          setServerResponse({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [enteredText, tone]);

  const handleSelect = (suggestion) => {
    setSelected(suggestion);
  //  onSelect(suggestion); // Callback for parent component
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const types = [
    {
      label: 'Formalize',
      value: 'formal',
    },
    {
      label: 'Casual',
      value: 'casual',
    },
    {
      label: 'Professional',
      value: 'professional',
    },
    {
      label: 'Friendly',
      value: 'friendly',
    },
    {
      label: 'Enthusiastic',
      value: 'enthusiastic',
    },
  ];

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={actionModal}>
      <DialogHeader title="Refine with AI (Beta)" onClose={toggleCancel} response={false} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <p className="font-family-tab">
              Entered Text:
              {' '}
              {!isEdit && (
              <b>{enteredText}</b>
              )}
              {isEdit && (
                <TextField
                  fullWidth
                  name="text"
                  type="text"
                  onChange={(e) => setTempText(e.target.value)}
                  variant="standard"
                  value={tempText}
                  InputLabelProps={{ shrink: true }}
                />
              )}
              {!isEdit && (
              <MuiTooltip title="Edit">
                <IconButton className="ml-1 cursor-pointer" onClick={() => setEdit(true)}>
                  <BsPencil size={15} color="black" className="font-weight-800" />
                </IconButton>
              </MuiTooltip>
              )}
              {isEdit && (
              <Button
                type="button"
                variant="contained"
                size="small"
                className="submit-btn-auto float-right mt-2"
                disabled={!tempText}
                onClick={() => { setSuggestions([]); setText(tempText); setEdit(false); }}
              >

                Save
              </Button>
              )}
            </p>

            <p className="font-family-tab mb-1">Select Tone: </p>
            <Stack direction="row" spacing={1} className="mb-2">
              {types.map((tp, index) => (
                <Chip
                  label={tp.label}
                  color={tone === tp.value ? 'primary' : 'default'}
                  className={tone === tp.value ? 'cursor-pointer font-family-tab' : 'font-family-tab'}
                  disabled={serverResponse.loading}
                  onClick={() => setTone(tp.value)}
                />
              ))}
            </Stack>

            {!serverResponse.loading && suggestions.length > 0 && (
            <p className="font-family-tab mb-0 mt-2">Select any suggestion: </p>
            )}
            <List sx={{
              mt: 1, border: '1px solid #ccc', maxWidth: '100%', p: 0, height: suggestions.length > 0 ? '250px' : 'auto', overflow: 'auto',
            }}
            >
              {serverResponse.loading ? (
                // Show Skeleton Loader
                Array.from({ length: 5 }).map((_, index) => (
                  <ListItem key={index} sx={{ px: 2, py: 1.5, minWidth: '60vw' }}>
                    <Skeleton variant="text" width="100%" height={20} />
                  </ListItem>
                ))
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSelect(suggestion)}
                    className="font-family-tab"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minWidth: '60vw',
                      borderBottom: index !== suggestions.length - 1 ? '1px solid #ddd' : 'none',
                      backgroundColor: selected === suggestion ? '#e3f2fd' : '#fff',
                      px: 2,
                      py: 1.5, // Padding for proper spacing
                    }}
                  >
                    <ListItemText
                      sx={{
                        whiteSpace: 'normal', // Allow text to wrap
                        wordBreak: 'break-word', // Break long words if needed
                        overflow: 'visible', // Ensure visibility
                        flex: 1, // Take full width
                      }}
                      primary={suggestion}
                    />
                    {selected === suggestion && <CheckCircleIcon sx={{ color: AddThemeColor({}).color }} />}
                  </ListItem>
                ))
              ) : (
                <ListItem
                  className="font-family-tab"
                  sx={{
                    minWidth: '60vw',
                    px: 2,
                    py: 1.5, // Padding for proper spacing
                  }}
                >
                  <Typography variant="body2" className="font-family-tab" sx={{ p: 2, color: 'gray' }}>
                    No suggestions found
                  </Typography>
                </ListItem>
              )}
            </List>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="contained"
          className="reset-btn-new1 mr-2"
         // disabled={loading}
          onClick={() => toggleCancel()}
        >

          Cancel
        </Button>
        <Button
          type="button"
          variant="contained"
          className="submit-btn-auto"
          disabled={!selected || serverResponse.loading}
          onClick={() => atFinish(selected)}
        >

          Insert
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AiText;
