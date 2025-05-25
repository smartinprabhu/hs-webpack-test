/* eslint-disable max-len */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { useSelector } from 'react-redux';
import { render, cleanup } from '@testing-library/react';

import * as actions from '../actions';
import reducer from '../reducer';
import api from '../../../middleware/api';
import CovidResources from '../covidResourses';
import * as services from '../dashboardService';
import 'babel-polyfill';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));
afterEach(cleanup);

const covidResources = {
  data: [
    {
      description: '<p><span>COVID-19 spreads primarily through respiratory droplets or contact with contaminated surfaces. Exposure can occur at the workplace, while traveling to work, during work-related travel to an area with local community transmission, as well as on the way to and from the workplace.</span><br></p>',
      id: 1,
      name: 'Tips for health and safety at the workplace in the context of COVID-19',
      type_selection: 'page',
      url: false,
    },
    {
      description: false,
      id: 2,
      name: 'Covid 19 Info111',
      type_selection: 'url',
      url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/coronavirus-safety.html',

    },
    {
      description: false,
      id: 4,
      name: 'Covid 19 Info111',
      type_selection: 'url',
      url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/coronavirus-safety.html',

    },
    {
      description: false,
      id: 5,
      name: 'Covid 19 Info111',
      type_selection: 'url',
      url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/coronavirus-safety.html',

    },
  ],
};
const error = {
  data: {
    message: 'no data found',
  },
};

describe('CovidResources testing', () => {
  it('snapshot testing for GET_COVID_RESOURSES action', () => {
    useSelector.mockImplementation((fn) => fn({
      config: {
        covidResources: {
          loading: true,
          err: null,
        },
      },
    }));
    const { asFragment } = render(<CovidResources />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('snapshot testing for GET_COVID_RESOURSES_SUCCESS action', () => {
    useSelector.mockImplementation((fn) => fn({
      config: {
        covidResources: {
          loading: false,
          err: null,
          data: covidResources.data,
        },
      },
    }));
    const { asFragment } = render(<CovidResources />);
    expect(asFragment()).toMatchSnapshot();
  });

  // test for actions

  it('it should mock the getCovidResources function', () => {
    const getCovidResources = () => actions.getCovidResources();
    getCovidResources();
    expect(actions.getCovidResources).toBeDefined();
  });

  // test for services

  it('it should handle getCovidResourcesInfo function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'getCovidResources');
    const result = services.getCovidResourcesInfo();
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

  it('it should handle GET_COVID_RESOURSES action', () => {
    expect(reducer(initialState, { type: actions.GET_COVID_RESOURSES })).toEqual({
      configObj: {}, covidResources: { loading: true, err: null },
    });
  });

  it('it should handle GET_COVID_RESOURSES_SUCCESS action', () => {
    expect(reducer(initialState, {
      type: actions.GET_COVID_RESOURSES_SUCCESS,
      payload: covidResources,
    })).toEqual({
      configObj: {}, covidResources: { loading: false, err: null, data: covidResources.data },
    });
  });
  it('it should handle GET_COVID_RESOURSES_FAILURE action', () => {
    expect(reducer(initialState, { type: actions.GET_COVID_RESOURSES_FAILURE, error })).toEqual({
      configObj: {}, covidResources: { loading: false, err: error.data, data: null },
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
    const action = { type: actions.GET_COVID_RESOURSES };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through GET_COVID_RESOURSES_SUCCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_COVID_RESOURSES_SUCCESS, payload: covidResources };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through GET_COVID_RESOURSES_FAILURE action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_COVID_RESOURSES_FAILURE, error };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  // dom testing

  it('dom testing with covidResources', () => {
    covidResources.data.push({
      description: false,
      id: 6,
      name: 'Covid 19 Info111',
      type_selection: 'url',
      url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/coronavirus-safety.html',
    }, {
      description: false,
      id: 8,
      name: 'Covid 19 Info111',
      type_selection: 'url',
      url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/coronavirus-safety.html',

    });
    useSelector.mockImplementation((fn) => fn({
      config: {
        covidResources: {
          loading: false,
          err: null,
          data: covidResources.data,
        },
      },
    }));
    const { container } = render(<CovidResources />);
    expect(container).toBeInTheDocument();
  });

  it('dom testing without covidResources', () => {
    useSelector.mockImplementation((fn) => fn({
      config: {
        covidResources: {
          loading: false,
          err: {
            data: [],
            status_code: 400,
          },
          data: [],
        },
      },
    }));
    const { container } = render(<CovidResources />);
    expect(container).toBeInTheDocument();
  });
});
