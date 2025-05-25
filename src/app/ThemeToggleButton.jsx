/* eslint-disable react/button-has-type */
import React from 'react';
import { useTheme } from './ThemeContext';
import './ThemeToggleButton.css'; // Add a custom CSS file for styles

const ThemeToggleButton = () => {
  const { themes, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button className="theme-toggle-button" onClick={toggleTheme}>
        <div className={`toggle-icon ${themes}`}>
          <img
            src={
              themes === 'dark'
                ? './moon.png'
                : './brightness-1.png'
            }
            alt={themes === 'dark' ? 'Dark Mode' : 'Light Mode'}
          />
        </div>
      </button>
    </div>
  );
};

export default ThemeToggleButton;
