import React from 'react';
import { useSelector } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ReleaseModalWindow from '../releaseModal';
import reducer from '../reducer';
import * as actions from '../actions';
import saveReleaseData from '../releaseService';
import api from '../../../../middleware/api';
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

describe('release testing', () => {
  const openModalWindow = jest.fn();
  it('snapshot testing for SAVE_RELEASE action', () => {
    useSelector.mockImplementation((fn) => fn({
      release: {
        releaseInfo: {
          loading: true,
        },
      },
      user: {
        userInfo,
      },
    }));
    const { asFragment } = render(
      <ReleaseModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingItem={bookingItem}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('snapshot testing for SAVE_RELEASE_SUCCESS action', () => {
    useSelector.mockImplementation((fn) => fn({
      release: {
        releaseInfo: {
          loading: false,
          data: [{ id: 780036 }],
          err: {},
        },
      },
      user: {
        userInfo,
      },
    }));
    const { asFragment } = render(
      <ReleaseModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingItem={bookingItem}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('snapshot testing for SAVE_RELEASE_FALURE action', () => {
    useSelector.mockImplementation((fn) => fn({
      release: {
        releaseInfo: {
          loading: false,
          err: {
            error: {
              data: 'error',
            },
          },
          data: [],
        },
      },
      user: {
        userInfo,
      },
    }));
    const { asFragment } = render(
      <ReleaseModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingItem={bookingItem}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  const initialState = {
    releaseInfo: {},
  };

  it('it should handle for initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('it should handle for SAVE_RELEASE', () => {
    expect(reducer(initialState, { type: actions.SAVE_RELEASE })).toEqual({
      releaseInfo: {
        loading: true,
      },
    });
  });
  it('it should handle for SAVE_RELEASE_SUCCESS', () => {
    expect(reducer(initialState, {
      type: actions.SAVE_RELEASE_SUCCESS,
      payload: {
        data: [{ id: 780036 }],
      },
    })).toEqual({
      releaseInfo: {
        loading: false,
        data: [{ id: 780036 }],
        err: {},
      },
    });
  });
  it('it should handle for SAVE_RELEASE_FALURE', () => {
    expect(reducer(initialState, { type: actions.SAVE_RELEASE_FALURE, error: { data: 'error' } })).toEqual({
      releaseInfo: {
        loading: false,
        data: [],
        err: 'error',
      },
    });
  });
  const create = () => {
    const store = jest.fn();
    const next = jest.fn();
    const invoke = (action) => api(store)(next)(action);
    return { next, invoke };
  };

  it('passes through SAVE_RELEASE action', () => {
    const { next, invoke } = create();
    const action = { type: actions.SAVE_RELEASE };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through SAVE_RELEASE_SUCCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.SAVE_RELEASE_SUCCESS };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through SAVE_RELEASE_FALURE action', () => {
    const { next, invoke } = create();
    const action = { type: actions.SAVE_RELEASE_FALURE };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('it handle saveRelease function', () => {
    const saveRelease = () => actions.saveRelease();
    saveRelease();
    expect(actions.saveRelease).toBeDefined();
  });

  it('it handle saveReleaseData function', () => {
    const saveRelease = () => saveReleaseData();
    saveRelease();
    expect(saveReleaseData).toBeDefined();
  });

  it('it should handle saveReleaseData function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'saveRelease');
    const result = saveReleaseData();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('dom testing while having data', () => {
    useSelector.mockImplementation((fn) => fn({
      release: {
        releaseInfo: {
          loading: true,
        },
      },
      user: {
        userInfo,
      },
    }));
    const { container, getByText } = render(
      <ReleaseModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingItem={bookingItem}
      />,
    );
    fireEvent.click(getByText('Confirm'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing while having error', () => {
    useSelector.mockImplementation((fn) => fn({
      release: {
        releaseInfo: {
          loading: false,
          data: [],
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
    }));
    const { container, getByText } = render(
      <ReleaseModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingItem={bookingItem}
      />,
    );
    fireEvent.click(getByText('OK'));
    expect(container).toBeInTheDocument();
  });
  it('dom testing while having error', () => {
    useSelector.mockImplementation((fn) => fn({
      release: {
        releaseInfo: {
          data: [123],
        },
      },
      user: {
        userInfo,
      },
    }));
    const { container, getByText } = render(
      <ReleaseModalWindow
        openModalWindow={openModalWindow}
        modalWindowOpen
        bookingItem={bookingItem}
      />,
    );
    fireEvent.click(getByText('Confirm'));
    expect(container).toBeInTheDocument();
  });
});
