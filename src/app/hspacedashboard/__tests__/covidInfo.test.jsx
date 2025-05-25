/* eslint-disable max-len */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';

import { useSelector } from 'react-redux';
import reducer from '../reducer';
import * as actions from '../actions';
import CovidInfo from '../covidInfo';
import * as services from '../dashboardService';
import api from '../../../middleware/api';
import 'babel-polyfill';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

afterEach(cleanup);

const configObj = {
  data: {
    covid: {
      allow_after_non_compliance: false,
      allowed_occupancy_per: 100,
      enable_report_covid_incident: true,
      enable_screening: true,

      helpline: {
        id: 1440,
        mobile: '+91 98745 ',
        name: 'Covid help line',
      },
      landing_page: {
        content: 'The risk of exposure to COVID-19 in the workplace depends on the likelihood of↵coming within 1 metre of others, in having frequent physical contact with↵people who may be infected with COVID-19, and through contact with↵contaminated surfaces and objects.  ↵↵',
        id: 1,
        name: 'Covid Landing',
        type: 'page',
      },
      title: 'COVID 19 INFORMATION',
    },
  },
};
const error = {
  data: {
    message: 'no data found',
  },
};

describe('CovidResources testing', () => {
  // snapshot testing

  it('snapshot testing for GET_CONFIGURATION action', () => {
    useSelector.mockImplementation((fn) => fn({
      config: {
        covidInfo: {
          loading: true,
          err: null,
        },
      },
    }));
    const { asFragment } = render(<CovidInfo />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('snapshot testing for GET_CONFIGURATION_SUCCESS action', () => {
    useSelector.mockImplementation((fn) => fn({
      config: {
        covidInfo: {
          loading: false,
          err: null,
          data: configObj.data,
        },
      },
    }));
    const { asFragment } = render(<CovidInfo />);
    expect(asFragment()).toMatchSnapshot();
  });

  // test for actions

  it('it should mock the getUserInfo function', () => {
    const getConfiguration = () => actions.getConfiguration();
    getConfiguration();
    expect(actions.getConfiguration).toBeDefined();
  });

  // test for services

  it('it should handle getConfig function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getConfiguration');
    const result = services.getConfig();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  // test for reducer

  const initialState = {
    configObj: {},
    covidResources: {},
  };

  it('it should handle initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('it should handle GET_CONFIGURATION action', () => {
    expect(reducer(initialState, { type: actions.GET_CONFIGURATION })).toEqual({
      configObj: {
        loading: true, err: null,
      },
      covidResources: {},
    });
  });

  it('it should handle GET_CONFIGURATION_SUCCESS action', () => {
    expect(reducer(
      initialState,
      { type: actions.GET_CONFIGURATION_SUCCESS, payload: configObj },
    )).toEqual({
      configObj: {
        loading: false, err: null, data: configObj.data,
      },
      covidResources: {},
    });
  });

  it('it should handle GET_CONFIGURATION_FAILURE action', () => {
    expect(reducer(initialState, { type: actions.GET_CONFIGURATION_FAILURE, error })).toEqual({
      configObj: {
        loading: false, err: error.data, data: null,
      },
      covidResources: {},
    });
  });

  // test for middleware

  const create = () => {
    const store = jest.fn();
    const next = jest.fn();
    const invoke = (action) => api(store)(next)(action);
    return { next, invoke };
  };

  it('passes through GET_COVID_RESOURSES action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_CONFIGURATION };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through GET_CONFIGURATION_SUCCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_CONFIGURATION_SUCCESS, payload: configObj };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through GET_CONFIGURATION_FAILURE action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_CONFIGURATION_FAILURE, error };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  // dom testing

  it('dom testing for  GET_CONFIGURATION_SUCCESS action', () => {
    useSelector.mockImplementation((fn) => fn({
      config: {
        configObj:
        {
          loading: false,
          err: null,
          data: configObj.data,
        },
      },
    }));
    const { container, getByText } = render(<CovidInfo />);
    expect(getByText('COVID 19 INFORMATION')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing GET_COVID_RESOURSES action', () => {
    useSelector.mockImplementation((fn) => fn({
      config: {
        configObj:
        {
          loading: true,
          err: null,
        },
      },
    }));
    const { container } = render(<CovidInfo />);
    expect(container).toBeInTheDocument();
  });
});
