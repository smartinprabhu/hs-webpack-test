import React from 'react';
import { useSelector } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import api from '../../../../middleware/api';
import * as actions from '../actions';
import saveAccessData from '../accessService';
import AccessModalWindow from '../accessModal';
import reducer from '../reducer';
import 'babel-polyfill';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

const userInfo = {
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
const accessInfo = {
  message: 'Welcome. You are allowed to access - Water Mark Building',
  status: true,
};
const bookingItem = {
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
describe('accessModal testing', () => {
  const openModalWindow = jest.fn();
  it('snapshot testing for SAVE_ACCESS action', () => {
    useSelector.mockImplementation((fn) => fn({
      access: {
        accessInfo: {
          err: null,
          loading: true,
        },
      },
      user: {
        userInfo,
      },
    }));
    const { asFragment } = render(
      <AccessModalWindow
        modalWindowOpen
        openModalWindow={openModalWindow}
        bookingItem={bookingItem}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('snapshot testing for SAVE_ACCESS_SUCCESS action', () => {
    useSelector.mockImplementation((fn) => fn({
      access: {
        accessInfo: {
          err: null,
          data: accessInfo,
          loading: false,
        },
      },
      user: {
        userInfo,
      },
    }));
    const { asFragment } = render(
      <AccessModalWindow
        modalWindowOpen
        openModalWindow={openModalWindow}
        bookingItem={bookingItem}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('snapshot testing for SAVE_ACCESS_FALURE action', () => {
    useSelector.mockImplementation((fn) => fn({
      access: {
        accessInfo: {
          err: {
            message: 'error',
          },
          loading: false,
        },
      },
      user: {
        userInfo,
      },
    }));
    const { asFragment } = render(
      <AccessModalWindow
        modalWindowOpen
        openModalWindow={openModalWindow}
        bookingItem={bookingItem}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  const initialState = {
    accessInfo: { err: null },
    bookingListInfo: {},
  };

  it('it should handle initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('it should handle initial state', () => {
    expect(reducer(initialState, { type: actions.SAVE_ACCESS })).toEqual({
      accessInfo: { loading: true }, bookingListInfo: {},
    });
  });

  it('it should handle SAVE_ACCESS_SUCCESS state', () => {
    expect(reducer(initialState, {
      type: actions.SAVE_ACCESS_SUCCESS,
      payload: { data: accessInfo },
    })).toEqual({
      accessInfo: { err: {}, data: accessInfo, loading: false },
      bookingListInfo: {},
    });
  });

  it('it should handle SAVE_ACCESS_FALURE state', () => {
    expect(reducer(initialState, {
      type: actions.SAVE_ACCESS_FALURE,
      error: { data: 'an error occured' },
    })).toEqual({
      accessInfo: { err: 'an error occured', data: {}, loading: false },
      bookingListInfo: {},
    });
  });

  it('it should mock the saveAccessData function', () => {
    const saveAccess = () => saveAccessData('1', '2', '3');
    saveAccess();
    expect(saveAccessData).toBeDefined();
  });

  it('it should mock the saveAccess function', () => {
    const saveAccess = () => actions.saveAccess();
    saveAccess();
    expect(actions.saveAccess).toBeDefined();
  });

  it('it should handle saveAccessData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'saveAccess');
    const result = saveAccessData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  const create = () => {
    const store = jest.fn();
    const next = jest.fn();
    const invoke = (action) => api(store)(next)(action);
    return { next, invoke };
  };

  it('passes through SAVE_ACCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.SAVE_ACCESS };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through SAVE_ACCESS_FALURE action', () => {
    const { next, invoke } = create();
    const action = { type: actions.SAVE_ACCESS_FALURE, error: { data: 'error' } };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through SAVE_ACCESS_SUCCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.SAVE_ACCESS_SUCCESS, payload: { data: bookingItem } };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dom testing while having data', () => {
    useSelector.mockImplementation((fn) => fn({
      access: {
        accessInfo: {
          err: null,
          data: accessInfo,
          loading: false,
        },
      },
      user: {
        userInfo,
      },
    }));
    const { container, getByText } = render(
      <AccessModalWindow
        modalWindowOpen
        openModalWindow={openModalWindow}
        bookingItem={bookingItem}
      />,
    );
    fireEvent.click(getByText('Confirm'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing while having error', () => {
    useSelector.mockImplementation((fn) => fn({
      access: {
        accessInfo: {
          err: {
            error: 'error',
          },
          loading: false,
        },
      },
      user: {
        userInfo,
      },
    }));
    const { container, getByText } = render(
      <AccessModalWindow
        modalWindowOpen
        openModalWindow={openModalWindow}
        bookingItem={bookingItem}
      />,
    );
    expect(getByText('error')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it('dom testing while having error as object', async () => {
    useSelector.mockImplementation((fn) => fn({
      access: {
        accessInfo: {
          err: {
            error:
              { message: 'error' },
          },
          loading: false,
        },
      },
      user: {
        userInfo,
      },
    }));
    const { container, getByText } = render(
      <AccessModalWindow
        modalWindowOpen
        openModalWindow={openModalWindow}
        bookingItem={bookingItem}
      />,
    );
    await waitFor(() => {
      expect(getByText('error')).toBeInTheDocument();
    });
    expect(container).toBeInTheDocument();
  });
});
