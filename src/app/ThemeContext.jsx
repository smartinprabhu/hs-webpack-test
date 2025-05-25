import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  updateUser,
} from './adminSetup/setupService';
import { getJsonString, isJsonString } from './util/appUtils';

const appModels = require('./util/appModels').default;

// Create the context
const ThemeContext = createContext(null);

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [themes, setTheme] = useState(localStorage.getItem('user_theme_mode') || 'dark');

  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const isWebUserJson = userInfo && userInfo.data && userInfo.data.user_preference && isJsonString(userInfo.data.user_preference) && getJsonString(userInfo.data.user_preference)
    ? getJsonString(userInfo.data.user_preference) : false;
  const userTheme = isWebUserJson && isWebUserJson.theme ? isWebUserJson.theme : '';

  useMemo(() => {
    if (userTheme) {
      setTheme(userTheme);
    } else {
      setTheme('dark');
    }
  }, [userInfo]);

  useEffect(() => {
    // Apply the theme class to the body
    document.body.className = themes === 'light' ? 'light-mode' : 'dark-mode';
  }, [themes]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      const obj = {
        theme: newTheme,
      };
      const postDataValues = {
        user_preference: JSON.stringify(obj),
      };
      dispatch(updateUser(userInfo && userInfo.data && userInfo.data.tenant_id, postDataValues, appModels.TEAMMEMEBERS));
      localStorage.setItem('user_theme_mode', newTheme); // Store the new theme in localStorage
      return newTheme;
    });
  };

  const contextValue = useMemo(() => ({ themes, toggleTheme }), [themes, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);
