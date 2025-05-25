import React from 'react';
import { useSelector } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import OccupySpaceModalWindow from '../occupySpaceModalWindow';
import api from '../../../../middleware/api';
import * as actions from '../actions';
import spaceOccupy from '../occupyService';
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
describe('OccupySpaceModalWindow testing', () => {
  const openModalWindow = jest.fn();
  it('snapshot testing for OCCUPY_SPACE', () => {
    useSelector.mockImplementation((fn) => fn({
      occupy: {
        occupyResponse: {
          loading: true,
        },
      },
      user: {
        userInfo,
      },

    }));
    const { asFragment } = render(<OccupySpaceModalWindow
      openModalWindow={openModalWindow}
      bookingData={bookingItem}
      modalWindowOpen
    />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('snapshot testing for OCCUPY_SPACE_SUCCESS', () => {
    useSelector.mockImplementation((fn) => fn({
      occupy: {
        occupyResponse: {
          loading: false, err: {}, data: [136846],
        },
      },
      user: {
        userInfo,
      },

    }));
    const { asFragment } = render(
      <OccupySpaceModalWindow
        openModalWindow={openModalWindow}
        bookingData={bookingItem}
        modalWindowOpen
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('snapshot testing for OCCUPY_SPACE_SUCCESS', () => {
    useSelector.mockImplementation((fn) => fn({
      occupy: {
        occupyResponse: {
          loading: false, err: 'error', data: {},
        },
      },
      user: {
        userInfo,
      },

    }));
    const { asFragment } = render(<OccupySpaceModalWindow
      openModalWindow={openModalWindow}
      bookingData={bookingItem}
      modalWindowOpen
    />);
    expect(asFragment()).toMatchSnapshot();
  });
  const initialState = {
    occupyResponse: {},
  };
  it('it should handle initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it('it should handle OCCUPY_SPACE state', () => {
    expect(reducer(
      initialState,
      {
        type: actions.OCCUPY_SPACE,
      },
    )).toEqual({
      occupyResponse: {
        loading: true,
      },
    });
  });
  it('it should handle OCCUPY_SPACE_FALURE state', () => {
    expect(reducer(initialState, {
      type: actions.OCCUPY_SPACE_FALURE,
      error: { data: 'error' },
    })).toEqual({
      occupyResponse: {
        loading: false,
        err: 'error',
        data: {},
      },
    });
  });
  it('it should handle OCCUPY_SPACE_SUCCESS state', () => {
    expect(reducer(initialState, {
      type: actions.OCCUPY_SPACE_SUCCESS,
      payload: { data: [136846] },
    })).toEqual({
      occupyResponse: {
        loading: false,
        err: {},
        data: [136846],
      },
    });
  });

  const create = () => {
    const store = jest.fn();
    const next = jest.fn();
    const invoke = (action) => api(store)(next)(action);
    return { next, invoke };
  };

  it('passes through OCCUPY_SPACE action', () => {
    const { next, invoke } = create();
    const action = { type: actions.OCCUPY_SPACE };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through OCCUPY_SPACE_FALURE action', () => {
    const { next, invoke } = create();
    const action = { type: actions.OCCUPY_SPACE_FALURE, error: { data: 'error' } };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through OCCUPY_SPACE_SUCCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.OCCUPY_SPACE_SUCCESS, payload: { data: [136846] } };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('it should handle occupySpace function', () => {
    const occupySpace = () => actions.occupySpace();
    occupySpace();
    expect(actions.occupySpace).toBeDefined();
  });

  it('it should handle spaceOccupy function', async () => {
    const dispatch = jest.fn();
    const spy = jest.spyOn(actions, 'occupySpace');
    const result = spaceOccupy();
    spy.mockImplementation(() => Promise.resolve());
    await result(dispatch);
    expect(dispatch.mock.calls[0]).toBeDefined();
  });

  it('dom testing while having response', () => {
    useSelector.mockImplementation((fn) => fn({
      occupy: {
        occupyResponse: {
          loading: false, err: {}, data: [136846],
        },
      },
      user: {
        userInfo,
      },

    }));
    const { container, getByText, queryByText } = render(
      <OccupySpaceModalWindow
        openModalWindow={openModalWindow}
        bookingData={bookingItem}
        modalWindowOpen
      />,
    );
    expect(queryByText('Unable to occupy the space')).not.toBeInTheDocument();
    expect(getByText('Confirm')).toBeInTheDocument();
    fireEvent.click(getByText('Confirm'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing while having error', () => {
    useSelector.mockImplementation((fn) => fn({
      occupy: {
        occupyResponse: {
          loading: false, err: { error: { message: 'error' } },
        },
      },
      user: {
        userInfo,
      },

    }));
    const { container, getByText } = render(<OccupySpaceModalWindow
      openModalWindow={openModalWindow}
      bookingData={bookingItem}
      modalWindowOpen
    />);
    expect(getByText('Confirm')).toBeInTheDocument();
    fireEvent.click(getByText('Confirm'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing while having error', () => {
    useSelector.mockImplementation((fn) => fn({
      occupy: {
        occupyResponse: {
          loading: false, err: { error: { message: 'Unable to occupy the space' } },
        },
      },
      user: {
        userInfo,
      },
    }));
    const { container, getByText } = render(<OccupySpaceModalWindow
      openModalWindow={openModalWindow}
      bookingData={bookingItem}
      modalWindowOpen
    />);
    expect(getByText('Unable to occupy the space')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });
});
