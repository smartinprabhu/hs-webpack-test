import React from 'react';

import {
  translateText,
} from '../../util/appUtils';

import customActionData from '../data/customData.json';

export function getStateLabel(staten, userData) {
  if (customActionData && customActionData.states[staten]) {
    return <span className={customActionData.states[staten].classPriority}>{translateText(customActionData.states[staten].text, userData || false)}</span>;
  }
  return '';
}

export function getPriorityLabel(staten) {
  if (customActionData && customActionData.priorities[staten]) {
    return <span className={customActionData.priorities[staten].classPriority}>{customActionData.priorities[staten].text}</span>;
  }
  return '';
}

export function getPriorityClass(staten) {
  if (customActionData && customActionData.priorities[staten]) {
    return customActionData.priorities[staten].classPriority;
  }
  return '';
}
export function getPriorityColor(staten) {
  if (customActionData && customActionData.priorities[staten]) {
    return customActionData.priorities[staten].color;
  }
  return '';
}

export function getPriorityShLabel(staten, userData) {
  if (customActionData && customActionData.prioritiesSchools[staten]) {
    return <span className={customActionData.prioritiesSchools[staten].classPriority}>{translateText(customActionData.prioritiesSchools[staten].text, userData || false)}</span>;
  }
  return '';
}

export function getPriorityShClass(staten) {
  if (customActionData && customActionData.prioritiesSchools[staten]) {
    return customActionData.prioritiesSchools[staten].classPriority;
  }
  return '';
}
export function getPriorityShColor(staten) {
  if (customActionData && customActionData.prioritiesSchools[staten]) {
    return customActionData.prioritiesSchools[staten].color;
  }
  return '';
}
