import React from 'react';
import * as redux from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, fireEvent } from '@testing-library/react';

import api from '../../../middleware/api';
import * as actions from '../action';
import * as services from '../service';
import reducer from '../reducer';
import CheckResetPasswordLink from '../checkResetPasswordLink';

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

afterEach(cleanup);

describe('checkResetPasswordLink testing', () => {
  it('snapshot testing', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        checkResetPasswordLinkInfo: {
          loading: true,
        },
      },
    }));
    const { asFragment } = render(
      <CheckResetPasswordLink location={{ session_uuid: '?uuid=594ebbd6aef01565b1c43c66e04c1bc0c2126c9a4771cdcd46d77b7a5ab4a931:63dc7ed1010d3c3b8269faf0ba7491d4' }} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('it should mock checkResetPasswordLink function', () => {
    const checkResetPasswordLink = (values) => actions.checkResetPasswordLink(values);
    checkResetPasswordLink();
    expect(actions.checkResetPasswordLink).toBeDefined();
  });

  it('it should create an action to save session_uuid', () => {
    const sessionUuid = '1234:4567';
    const expectedAction = {
      type: actions.SAVE_SESSIONUUID,
      payload: sessionUuid,
    };
    expect(actions.saveSessionId(sessionUuid)).toEqual(expectedAction);
  });

  it('it should mock the services', () => {
    const testResetPasswordLink = jest.spyOn(services, 'testResetPasswordLink');
    services.testResetPasswordLink();
    expect(testResetPasswordLink).toBeCalled();
  });

  const initialState = {
    checkResetPasswordLinkInfo: {},
    passwordPrivacyPolicyInfo: {},
    resetPasswordInfo: {},
    resetPasswordLinkInfo: {},
    session: null,
  };

  it('it should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('it should return the CHECK_RESET_PASSWORD_LINK', () => {
    expect(reducer(initialState, {
      type: actions.CHECK_RESET_PASSWORD_LINK,
    })).toEqual({
      checkResetPasswordLinkInfo: { loading: true },
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: {},
      resetPasswordLinkInfo: {},
      session: null,
    });
  });

  it('it should return the CHECK_RESET_PASSWORD_LINK_SUCCESS', () => {
    expect(reducer(initialState, {
      type: actions.CHECK_RESET_PASSWORD_LINK_SUCCESS,
      status: true,
    })).toEqual({
      checkResetPasswordLinkInfo: { loading: false, data: true },
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: {},
      resetPasswordLinkInfo: {},
      session: null,
    });
  });

  it('it should return the CHECK_RESET_PASSWORD_LINK_FAILURE', () => {
    expect(reducer(initialState, {
      type: actions.CHECK_RESET_PASSWORD_LINK_FAILURE,
      error: {
        data: {
          message: 'Session expired or invalid.',
        },
      },
    })).toEqual({
      checkResetPasswordLinkInfo: {
        loading: false,
        err: {
          message: 'Session expired or invalid.',
        },
      },
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: {},
      resetPasswordLinkInfo: {},
      session: null,
    });
  });

  it('it should return the SAVE_SESSIONUUID', () => {
    expect(reducer(initialState, {
      type: actions.SAVE_SESSIONUUID,
      payload: {},
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: {},
      resetPasswordLinkInfo: {},
      session: {},
    });
  });

  const create = () => {
    const store = jest.fn();
    const next = jest.fn();
    const invoke = (action) => api(store)(next)(action);
    return { next, invoke };
  };

  it('passes through CHECK_RESET_PASSWORD_LINK action', () => {
    const { next, invoke } = create();
    const action = { type: actions.CHECK_RESET_PASSWORD_LINK };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dom testing', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        checkResetPasswordLinkInfo: {
          err: {
            error: {
              message: 'Session expired or invalid.',
            },
          },
        },
      },
    }));

    const { container, getByText } = render(<CheckResetPasswordLink
      location={{ session_uuid: '?uuid=594ebbd6aef01565b1c43c66e04c1bc0c2126c9a4771cdcd46d77b7a5ab4a931:63dc7ed1010d3c3b8269faf0ba7491d4' }}
    />);
    expect(getByText('Session expired or invalid.')).toBeInTheDocument();
    expect(getByText('Forgot Password')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });
  it('dom testing', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        checkResetPasswordLinkInfo: {
          data: true,
          loading: true,
        },
      },
    }));
    const { getByText, getByRole } = render(<CheckResetPasswordLink
      location={{ session_uuid: '?uuid=594ebbd6aef01565b1c43c66e04c1bc0c2126c9a4771cdcd46d77b7a5ab4a931:63dc7ed1010d3c3b8269faf0ba7491d4' }}
    />);
    expect(getByRole('button')).toBeInTheDocument();
    fireEvent.click(getByText('Reset Password'));
    expect(mockHistoryPush).toBeCalledWith({ pathname: '/create-new-password' });
  });
});
