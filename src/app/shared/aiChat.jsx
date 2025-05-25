/* eslint-disable no-nested-ternary */
import React, {
  useEffect, useRef, useState,
} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';
import {
  Input,
} from 'reactstrap';
import {
  BsStars, BsPersonCircle, BsCopy, BsPencil,
} from 'react-icons/bs';
import axios from 'axios';
import { useSelector } from 'react-redux';

import MuiTooltip from '@shared/muiTooltip';

import { AddThemeColor } from '../themes/theme';
import { useTheme } from '../ThemeContext';
import AuthService from '../util/authService';
import { getJsonString, isJsonString, copyToClipboardText } from '../util/appUtils';

const AiChat = ({
  model, setAiFilter, setAiFilterTemp, setAiPrompt, onView, count, moduleName, isClear, cards,
}) => {
  const [message, setMessage] = useState('');

  const { themes } = useTheme();
  const authService = AuthService();
  const { userInfo } = useSelector((state) => state.user);

  const [messages, setMessages] = useState(authService.getAiMessages() && isJsonString(authService.getAiMessages()) && getJsonString(authService.getAiMessages()) ? getJsonString(authService.getAiMessages()) : []);

  const [serverResponse, setServerResponse] = useState({ loading: false, data: null, err: null });

  const [selectedCard, setSelectedCard] = React.useState(-1);

  const [isTextHover, setTextHover] = React.useState(false);

  const [textHoverKey, setTextHoverKey] = React.useState(false);
  const [aiFilterTemp, setAiFilterTemp1] = React.useState(false);

  const [isFilter, setIsFilter] = React.useState(false);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const chatEndRef = useRef(null);

  const onMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Scroll to the latest message when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages && messages.length) {
      authService.storeAiMessages(JSON.stringify(messages));
    }
    if (model) {
      const oldModel = authService.getAiModel();
      if (oldModel !== model) {
        authService.storeAiMessages(JSON.stringify([]));
        setMessages([]);
        authService.storeAiModel(model);
      } else {
        authService.storeAiModel(model);
      }
    }
  }, [JSON.stringify(messages), model]);

  useEffect(() => {
    if (isClear) {
      setMessages([]);
      setSelectedCard(-1);
    }
  }, [isClear]);

  const extractConditions = (inputArray) => {
    if (!Array.isArray(inputArray)) return ''; // Handle invalid input

    // Extract only array elements
    const conditions = inputArray.filter(
      (item) => Array.isArray(item) || item === '|',
    );

    // If the first element is an array, remove outer brackets
    return Array.isArray(conditions[0]) || conditions[0] === '|'
      ? JSON.stringify(conditions).slice(1, -1)
      : JSON.stringify(conditions);
  };

  const handleRecieveMessage = (msg) => {
    if (message) {
      setServerResponse({
        loading: true, data: null, count: 0, err: null,
      });
      setIsFilter(false);
      const tempMessage = { text: 'Processing...', sender: 'server' };
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, tempMessage];
        return newMessages;
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}webhook/7de1a806-366e-4651-9d07-e8d4ae483987?prompt=${encodeURIComponent(msg)}&token=eget4ykt5kr8ej8jrgt&model=${model}`,
        headers: {
          portalDomain: window.location.origin,
        },
      };
      axios(config)
        .then((response) => {
          setServerResponse({
            loading: false, data: response.data, count: response.data.length, err: null,
          });
          const result = response.data && response.data.response_text ? response.data : false;
          if (result && result.domain && result.domain.length) {
            setAiFilterTemp(encodeURIComponent(extractConditions(result.domain)));
            setAiFilterTemp1(encodeURIComponent(extractConditions(result.domain)));
            // setAiFilter(encodeURIComponent(extractConditions(result.domain)));
            setAiPrompt(message);
            setIsFilter(true);
          } else {
            setIsFilter(false);
          }
          setMessages((prevMessages) => prevMessages.map((msg1, index) => (index === prevMessages.length - 1 // Update last added message
            ? { text: result && result.response_text ? result.response_text : 'Sorry unable to proccess your request', sender: 'server' }
            : msg1)));
        })
        .catch((error) => {
          setServerResponse({
            loading: false, data: null, count: 0, err: error,
          });
          setIsFilter(false);
          setMessages((prevMessages) => prevMessages.map((msg1, index) => (index === prevMessages.length - 1
            ? { text: 'Sorry, Network Error.', sender: 'server' }
            : msg1)));
        });
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return; // Prevent empty messages

    const userMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    handleRecieveMessage(message);
    setMessage(''); // Clear input field

    // Simulate server response after 1 sec
    /* setTimeout(() => {
      const serverResponse = { text: `Echo: ${message}`, sender: 'server' };
      setMessages((prevMessages) => [...prevMessages, serverResponse]);
    }, 1000); */
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line in the textarea
      setSelectedCard(-1);
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="p-3">
        {!(messages && messages.length > 0) && (
          <>
            <h5 className="font-family-tab text-center">
              Hi
              <span className="ml-2 text-info">
                {userInfo.data.name}
                !
              </span>
            </h5>
            <h5 className="font-family-tab text-center text-grey" style={{ opacity: '0.5' }}> How can i help you today?</h5>
          </>
        )}
        {!message && !(messages && messages.length > 0) && cards.map((card, index) => (
          <Card sx={{ marginBottom: '10px' }}>
            <CardActionArea
              onClick={() => { setSelectedCard(index); setMessage(card.description); }}
              data-active={selectedCard === index ? '' : undefined}
              sx={{
                height: '100%',
                '&[data-active]': {
                  backgroundColor: 'action.selected',
                  '&:hover': {
                    backgroundColor: 'action.selectedHover',
                  },
                },
              }}
            >
              <CardContent sx={{ height: '100%', padding: '10px' }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={1}>
                    <BsStars size={25} color={themes === 'light' ? '#000000' : AddThemeColor({}).color} className="mr-2" />
                  </Grid>
                  <Grid item xs={11}>
                    <Typography variant="h6" sx={{ fontSize: '1rem' }} className="font-family-tab" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" className="font-family-tab" color="text.secondary">
                      {card.description}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}

        {messages.map((msg, index) => (
          <div
            className="ai-chat-message"
            key={index}
            onMouseLeave={() => { setTextHover(false); setTextHoverKey(null); }}
            onMouseEnter={() => { setTextHover(msg.sender === 'user'); setTextHoverKey(msg.sender === 'user' ? index : null); }}
          >
            {/* Message Container */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '5px',
              }}
              className="ai-chat-item"
            >
              {msg.sender === 'server' && (
              <BsStars
                size={20}
                color={themes === 'light' ? '#000000' : AddThemeColor({}).color}
                className="mr-2"
              />
              )}

              {/* Message Bubble */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px',
                  borderRadius: '8px',
                  border: themes === 'light' ? '1px solid white' : 'none',
                  background: msg.sender === 'user' ? (themes === 'light' ? '#1E1F1E' : '#dcf8c6') : (themes === 'light' ? '#1E1F1E' : '#f1f1f1'),
                  maxWidth: '80%',
                  position: 'relative',
                }}
                className="font-family-tab"
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
              <BsPersonCircle
                size={20}
                color={themes === 'light' ? '#000000' : AddThemeColor({}).color}
                className="ml-2"
              />
              )}
            </div>
            {msg.sender === 'server' && isFilter && aiFilterTemp && messages.length === (index + 1) && count > 0 && (
              <p aria-hidden style={{ marginLeft: '30px' }} className="font-family-tab font-tiny text-info cursor-pointer text-decoration-underline mb-0" onClick={() => { setAiFilter(aiFilterTemp); onView(); }}>
                View
                {' '}
                {count}
                {' '}
                {moduleName}
                .
              </p>
            )}
            {msg.sender === 'server' && isFilter && messages.length === (index + 1) && count === 0 && (
            <p aria-hidden style={{ marginLeft: '30px', opacity: '0.7' }} className="font-family-tab font-tiny mb-0">
              No records found.
            </p>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                minHeight: '24px',
                marginLeft: msg.sender === 'server' ? '24px' : '0',
                marginRight: msg.sender === 'user' ? '24px' : '0',
                transition: 'opacity 0.2s',
                opacity: isTextHover && textHoverKey === index ? 1 : 0,
              }}
              className="ai-chat-tools"
            >
              <MuiTooltip title="Copy">
                <IconButton className="cursor-pointer" onClick={() => copyToClipboardText(msg.text)} size="small">
                  <BsCopy size={15} color="black" className="font-weight-800" />
                </IconButton>
              </MuiTooltip>
              <MuiTooltip title="Edit">
                <IconButton className="cursor-pointer" onClick={() => setMessage(msg.text)} size="small">
                  <BsPencil size={15} color="black" className="font-weight-800" />
                </IconButton>
              </MuiTooltip>
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>
      <div className="sticky-button-30drawer-no-align">
        <div className="p-0">
          <Input
            type="textarea"
            name="body"
            label="Action Taken"
            placeholder="Enter your prompt here"
            value={message}
            disabled={serverResponse.loading}
            onKeyDown={handleKeyDown}
            onChange={onMessageChange}
            className="font-family-tab font-weight-700"
            rows="3"
            autoFocus
          />
          <p style={{ opacity: '0.7' }} className="ml-1 font-family-tab font-tiny font-weight-400 mb-0">Hit Enter to continue</p>
        </div>
        <div className="text-center p-1 mt-3">
          <p className="font-family-tab font-tiny font-weight-400 mb-0" style={{ opacity: '0.7' }}>
            Ask AI (Beta) can make mistakes, including about assets, maintenance records or personnel.Please verify the information before taking action.
          </p>
        </div>
      </div>
    </>
  );
};

export default AiChat;
