import React from 'react';
import { useSelector } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import PreScreensModalWindow from '../preScreeningModalWindow';
import * as actions from '../actions';
import * as services from '../preScreeningService';
import api from '../../../../middleware/api';
import reducer from '../reducer';
import 'babel-polyfill';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
  useState: jest.fn(),
}));

const userInfo = {
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  employee: {
    id: '123',
  },
  company: {
    address: 'Water Mark  Building\n222 W. Las Colinas Blvd.\nSuite 755 East\nIrving TX 75039\nUnited States',
    id: 3,
    name: 'Water Mark  Building',
    timezone: 'US/Central',
  },
};
const bookingData = {
  access_status: false,
  actual_in: '',
  actual_out: '',
  book_for: 'myself',
  booking_type: 'individual',
  company: {
    id: 63,
    name: 'Water Mark Building',
  },
  employee: {
    id: 6453,
    name: 'SI ABHI',
  },
  id: 91404,
  is_host: false,
  members: [],
  planned_in: '2020-10-20 01:45:00',
  planned_out: '2020-10-20 10:15:00',
  planned_status: 'Regular',
  prescreen_status: true,
  shift: {
    id: 47,
    name: 'A',
  },
  space: {
    id: 9428,
    latitude: '432.75',
    longitude: '132',
    name: 'WS#41',
    status: 'Ready',
  },
  user_defined: false,
  uuid: 'a517dca6-3910-46fd-aed0-b0bfc48426b9',
  vendor: {
    id: 1450,
    name: 'Motivity Labs(Tenant)',
  },
  working_hours: 0,
};

describe('PreScreensModalWindow testing', () => {
  const openModalWindow = jest.fn();
  it('snapshot testing while having data', () => {
    useSelector.mockImplementation((fn) => fn({
      preScreening: {
        questionarieData: {
          data: [{
            id: 16811,
            mro_quest_grp_id: {},
            name: 'Do you have Cough?',
            type: 'boolean',
          }],
          loading: false,
          err: {},
        },
        preScreeningProcess: {
          data: [2558, 2559, 2560],
          loading: false,
          err: {},
        },
      },
      user: {
        userInfo,
      },
      config: {
        configObj: {
          data: {
            prescreen: [{ id: 1711, name: 'Covid-19 Checklist.' }],
          },
        },
      },
    }));
    const { asFragment } = render(
      <PreScreensModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingData={bookingData}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('snapshot testing while having questionarieData error', () => {
    useSelector.mockImplementation((fn) => fn({
      preScreening: {
        questionarieData: {
          data: [{
            id: 16811,
            mro_quest_grp_id: {},
            name: 'Do you have Cough?',
            type: 'boolean',
          }],
          loading: false,
          err: {},
        },
        preScreeningProcess: {
          data: {},
          loading: false,
          err: 'error',
        },
      },
      user: {
        userInfo,
      },
      config: {
        configObj: {
          data: {
            prescreen: [{ id: 1711, name: 'Covid-19 Checklist.' }],
          },
        },
      },
    }));
    const { asFragment } = render(
      <PreScreensModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingData={bookingData}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('snapshot testing while having preScreeningProcess error', () => {
    useSelector.mockImplementation((fn) => fn({
      preScreening: {
        questionarieData: {
          data: {},
          loading: false,
          err: 'error',
        },
        preScreeningProcess: {
          data: [2558, 2559, 2560],
          loading: false,
          err: {},
        },
      },
      user: {
        userInfo,
      },
      config: {
        configObj: {
          data: {
            prescreen: [{ id: 1711, name: 'Covid-19 Checklist.' }],
          },
        },
      },
    }));
    const { asFragment } = render(
      <PreScreensModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingData={bookingData}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  const create = () => {
    const store = jest.fn();
    const next = jest.fn();
    const invoke = (action) => api(store)(next)(action);
    return { next, invoke };
  };

  it('passes through GET_QUESTIONARY_DATA_SUCCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_QUESTIONARY_DATA_SUCCESS };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through GET_QUESTIONARY_DATA_ERROR action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_QUESTIONARY_DATA_ERROR };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through PRE_SCREENING_PROCESS_SUCCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.PRE_SCREENING_PROCESS_SUCCESS };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through PRE_SCREENING_PROCESS_ERROR action', () => {
    const { next, invoke } = create();
    const action = { type: actions.PRE_SCREENING_PROCESS_ERROR };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('it should handle questionaireDataGetCall', () => {
    const questionaireDataGetCall = () => actions.questionaireDataGetCall();
    questionaireDataGetCall();
    expect(actions.questionaireDataGetCall).toBeDefined();
  });

  it('it should handle preScreeningPostCall', () => {
    const preScreeningPostCall = () => actions.preScreeningPostCall();
    preScreeningPostCall();
    expect(actions.preScreeningPostCall).toBeDefined();
  });

  it('it should handle getQuestionaireData', () => {
    const getQuestionaireData = () => services.getQuestionaireData();
    getQuestionaireData();
    expect(services.getQuestionaireData).toBeDefined();
  });

  it('it should handle saveProcessedPreScreening', () => {
    const saveProcessedPreScreening = () => services.saveProcessedPreScreening();
    saveProcessedPreScreening();
    expect(services.saveProcessedPreScreening).toBeDefined();
  });

  it('it should handle saveProcessedPreScreening function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'preScreeningPostCall');
    const result = services.getQuestionaireData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('it should handle saveProcessedPreScreening function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'preScreeningPostCall');
    const result = services.saveProcessedPreScreening();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  const initialState = {
    questionarieData: {},
    preScreeningProcess: {},
  };

  it('it should handle PRE_SCREENING_PROCESS state', () => {
    expect(reducer(initialState, { type: actions.PRE_SCREENING_PROCESS })).toEqual({
      questionarieData: {},
      preScreeningProcess: { loading: true },
    });
  });

  it('it should handle PRE_SCREENING_PROCESS_SUCCESS state', () => {
    expect(reducer(initialState, {
      type: actions.PRE_SCREENING_PROCESS_SUCCESS,
      payload: { data: [2558, 2559, 2560] },

    })).toEqual({
      questionarieData: {},
      preScreeningProcess: {
        loading: false, data: [2558, 2559, 2560], err: {},
      },
    });
  });

  it('it should handle PRE_SCREENING_PROCESS_ERROR state', () => {
    expect(reducer(initialState, {
      type: actions.PRE_SCREENING_PROCESS_ERROR,
      error: { data: 'error' },
    })).toEqual({
      questionarieData: {},
      preScreeningProcess: { loading: false, err: 'error', data: {} },
    });
  });

  it('it should handle GET_QUESTIONARY_DATA state', () => {
    expect(reducer(initialState, { type: actions.GET_QUESTIONARY_DATA })).toEqual({
      questionarieData: { loading: true },
      preScreeningProcess: {},
    });
  });

  it('it should handle GET_QUESTIONARY_DATA_SUCCESS state', () => {
    expect(reducer(initialState, {
      type: actions.GET_QUESTIONARY_DATA_SUCCESS,
      payload: {
        data: [{
          id: 16811,
          mro_quest_grp_id: {},
          name: 'Do you have Cough?',
          type: 'boolean',
        }],
      },

    })).toEqual({
      preScreeningProcess: {},
      questionarieData: {
        loading: false,
        data: [{
          id: 16811,
          mro_quest_grp_id: {},
          name: 'Do you have Cough?',
          type: 'boolean',
        }],
        err: {},
      },
    });
  });

  it('it should handle GET_QUESTIONARY_DATA_ERROR state', () => {
    expect(reducer(initialState, {
      type: actions.GET_QUESTIONARY_DATA_ERROR,
      payload: 'error',
    })).toEqual({
      preScreeningProcess: {},
      questionarieData: { loading: false, err: 'error', data: {} },
    });
  });

  it('dom testing while initiating the prescreening', () => {
    useSelector.mockImplementation((fn) => fn({
      preScreening: {
        questionarieData: {
          data: [{
            id: 16811,
            constr_mandatory: true,
            name: 'Do you have Cough?',
            type: 'boolean',
          }, {
            id: 16810,
            constr_mandatory: true,
            name: 'Do you have fever?',
            type: 'numerical_box',
          }, {
            id: 16809,
            constr_mandatory: true,
            name: 'Do you have cold?',
            type: 'textbox',
          }],
          loading: false,
          err: {},
        },
        preScreeningProcess: {
          loading: true,
        },
      },
      user: {
        userInfo,
      },
      config: {
        configObj: {
          data: {
            prescreen: { checklists: [{ id: 1711, name: 'Covid-19 Checklist.' }] },
          },
        },
      },
    }));
    const { container, getByText } = render(
      <PreScreensModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingData={bookingData}
      />,
    );
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Back'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing while having preScreeningProcess error', () => {
    useSelector.mockImplementation((fn) => fn({
      preScreening: {
        questionarieData: {
          data: [{
            id: 16811,
            constr_mandatory: true,
            name: 'Do you have Cough?',
            type: 'boolean',
          }],
          loading: false,
          err: {},
        },
        preScreeningProcess: {
          data: [],
          loading: false,
          err: {
            error: {
              message: 'error',
            },
          },
        },
      },
      user: {
        userInfo,
      },
      config: {
        configObj: {
          data: {
            prescreen: { checklists: [{ id: 1711, name: 'Covid-19 Checklist.' }] },
          },
        },
      },
    }));
    const { container, getByText } = render(
      <PreScreensModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingData={bookingData}
      />,
    );
    expect(getByText('error')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing while performing complete screening', () => {
    useSelector.mockImplementation((fn) => fn({
      preScreening: {
        questionarieData: {
          data: [
            {
              id: 16810,
              constr_mandatory: true,
              name: 'Do you have fever?',
              type: 'numerical_box',
            }, {
              id: 16809,
              constr_mandatory: true,
              name: 'Do you have cold?',
              type: 'textbox',
            }],
          loading: true,
          err: {},
        },
        preScreeningProcess: {
          loading: true,
        },
      },
      user: {
        userInfo,
      },
      config: {
        configObj: {
          data: {
            prescreen: { checklists: [{ id: 1711, name: 'Covid-19 Checklist.' }] },
          },
        },
      },
    }));
    const { container, getByText, getByTestId } = render(
      <PreScreensModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingData={bookingData}
      />,
    );
    fireEvent.click(getByText('Next'));
    fireEvent.change(getByTestId('16809'), { target: { value: 'test data' } });
    fireEvent.change(getByTestId('16810'), { target: { value: 123 } });
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Finish'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing while performing complete screening', () => {
    useSelector.mockImplementation((fn) => fn({
      preScreening: {
        questionarieData: {
          data: [{
            id: 16811,
            constr_mandatory: true,
            name: 'Do you have Cough?',
            type: 'boolean',
          }, {
            id: 16810,
            constr_mandatory: true,
            name: 'Do you have fever?',
            type: 'numerical_box',
          }, {
            id: 16809,
            constr_mandatory: true,
            name: 'Do you have cold?',
            type: 'textbox',
          }],
          loading: true,
          err: {},
        },
        preScreeningProcess: {
          loading: true,
        },
      },
      user: {
        userInfo,
      },
      config: {
        configObj: {
          data: {
            prescreen: { checklists: [{ id: 1711, name: 'Covid-19 Checklist.' }] },
          },
        },
      },
    }));
    const { container, getByText, getByTestId } = render(
      <PreScreensModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingData={bookingData}
      />,
    );
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Yes'));
    fireEvent.click(getByText('No'));
    fireEvent.change(getByTestId('16809'), { target: { value: 'test data' } });
    fireEvent.click(getByText('Next'));
    expect(container).toBeInTheDocument();
  });
});
