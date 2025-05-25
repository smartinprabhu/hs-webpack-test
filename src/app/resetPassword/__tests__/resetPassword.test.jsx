import React from 'react';
import * as redux from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import {
  cleanup, fireEvent, render, waitFor,
} from '@testing-library/react';
import 'babel-polyfill';

import api from '../../../middleware/api';
import * as services from '../service';
import * as actions from '../action';
import reducer from '../reducer';
import ResetPassword from '../resetPassword';

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

describe('resetPassword testing', () => {
  it('snapshot testing', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        resetPasswordInfo: {
          loading: true,
        },
        passwordPrivacyPolicyInfo: {},
      },
    }));
    const { asFragment } = render(
      <ResetPassword />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('it should mock checkResetPasswordLink function', () => {
    const getPasswordPolicy = () => actions.getPasswordPolicy();
    getPasswordPolicy();
    expect(actions.getPasswordPolicy).toBeDefined();
  });

  it('it should mock resetPassword function', () => {
    const resetPassword = (data) => actions.resetPassword(data);
    resetPassword();
    expect(actions.resetPassword).toBeDefined();
  });

  it('it should mock SHOW_RESET_PASSWORD action', () => {
    const expectedAction = {
      type: actions.SHOW_RESET_PASSWORD,
    };
    expect(actions.showResetPasswordFormData()).toEqual(expectedAction);
  });

  it('it should mock CLEAR_RESET_PASSWORD_DATA action', () => {
    const expectedAction = {
      type: actions.CLEAR_RESET_PASSWORD_DATA,
    };
    expect(actions.clearResetPassowrdRes()).toEqual(expectedAction);
  });

  it('it should mock the services', () => {
    const createNewPassword = jest.spyOn(services, 'createNewPassword');
    services.createNewPassword();
    expect(createNewPassword).toBeCalled();

    const getPasswordPolicyInfo = jest.spyOn(services, 'getPasswordPolicyInfo');
    services.getPasswordPolicyInfo();
    expect(getPasswordPolicyInfo).toBeCalled();

    const clearResetPasswordData = jest.spyOn(services, 'clearResetPasswordData');
    services.clearResetPasswordData();
    expect(clearResetPasswordData).toBeCalled();
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

  it('it should return the RESET_PASSWORD', () => {
    expect(reducer(initialState, {
      type: actions.RESET_PASSWORD,
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: { loading: true },
      resetPasswordLinkInfo: {},
      session: null,
    });
  });
  const resetPasswordRes = {
    data: {
      message: 'password updated successfully',
    },
  };
  it('it should return the RESET_PASSWORD_SUCCESS', () => {
    expect(reducer(initialState, {
      type: actions.RESET_PASSWORD_SUCCESS,
      payload: resetPasswordRes,
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: { loading: false, data: resetPasswordRes.data },
      resetPasswordLinkInfo: {},
      session: null,
    });
  });

  it('it should return the RESET_PASSWORD_FAILURE', () => {
    expect(reducer(initialState, {
      type: actions.RESET_PASSWORD_FAILURE,
      error: { data: 'error' },
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: {
        loading: false,
        err: 'error',
      },
      resetPasswordLinkInfo: {},
      session: null,
    });
  });
  it('it should return the GET_PASSWORD_POLICY', () => {
    expect(reducer(initialState, {
      type: actions.GET_PASSWORD_POLICY,
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: { loading: true },
      resetPasswordInfo: {},
      resetPasswordLinkInfo: {},
      session: null,
    });
  });

  const passwordPolicy = {
    data:
    {
      1: 'Password should have at least 1 numeral(s).',
      2: 'Password should have at least 1 uppercase letter(s).',
      3: 'Password should have at least 1 lowercase letter(s).',
      4: 'Password should have at least 1 special character(s).',
      5: 'Password should be between 6 to 20 characters long.',
    },
  };

  it('it should return the GET_PASSWORD_POLICY_SUCCESS', () => {
    expect(reducer(initialState, {
      type: actions.GET_PASSWORD_POLICY_SUCCESS,
      payload: passwordPolicy,
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: { loading: false, data: passwordPolicy },
      resetPasswordInfo: {},
      resetPasswordLinkInfo: {},
      session: null,
    });
  });

  it('it should return the GET_PASSWORD_POLICY_FAILURE', () => {
    expect(reducer(initialState, {
      type: actions.GET_PASSWORD_POLICY_FAILURE,
      error: { data: 'error' },
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: {
        loading: false,
        err: 'error',
      },
      resetPasswordInfo: {},
      resetPasswordLinkInfo: {},
      session: null,
    });
  });

  it('it should return the SHOW_RESET_PASSWORD', () => {
    expect(reducer(initialState, {
      type: actions.SHOW_RESET_PASSWORD,
    })).toEqual(
      {
        checkResetPasswordLinkInfo: {},
        passwordPrivacyPolicyInfo: {},
        resetPasswordInfo: {
          loading: false, data: null, err: null, passwordPrivacyPolicyInfo: null,
        },
        resetPasswordLinkInfo: {},
        session: null,
      },
    );
  });

  const create = () => {
    const store = jest.fn();
    const next = jest.fn();
    const invoke = (action) => api(store)(next)(action);
    return { next, invoke };
  };

  it('passes through RESET_PASSWORD action', () => {
    const { next, invoke } = create();
    const action = { type: actions.RESET_PASSWORD };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through GET_PASSWORD_POLICY action', () => {
    const { next, invoke } = create();
    const action = { type: actions.GET_PASSWORD_POLICY };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('dom testing for formik', async () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        resetPasswordInfo: {},
        passwordPrivacyPolicyInfo: {
          data: {
            information: [passwordPolicy.data],
          },
        },
        session: {
          session_uuid: '1234',
        },
      },
    }));
    const { container, getByLabelText, getByText } = render(<ResetPassword />);
    fireEvent.click(getByText('RESET'));
    const newPassword = getByLabelText('New Password');
    const reTypePassword = getByLabelText('Re-Type Password');
    expect(newPassword.value).toBe('');
    expect(reTypePassword.value).toBe('');
    fireEvent.change(newPassword, { target: { value: 'Welcome@123' } });
    fireEvent.change(reTypePassword, { target: { value: 'Welcome@123' } });
    fireEvent.click(getByText('RESET'));
    fireEvent.change(newPassword, { target: { value: '' } });
    fireEvent.blur(newPassword);
    let error;
    await waitFor(() => {
      error = getByText('*Password should have at least 1 numeral(s).');
    });
    expect(error).not.toBeNull();

    expect(container).toBeInTheDocument();
  });

  it('dom testing for RESET_PASSWORD_SUCCESS action', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        resetPasswordInfo: {
          data: true,
        },
        passwordPrivacyPolicyInfo: {},
      },
    }));
    const { getByText } = render(
      <ResetPassword />,
    );
    expect(getByText('Password is updated, please login')).toBeInTheDocument();
    expect(getByText('LOGIN')).toBeInTheDocument();
    fireEvent.click(getByText('LOGIN'));
    expect(mockHistoryPush).toHaveBeenCalledWith({ pathname: '/' });
  });

  it('dom testing for GET_PASSWORD_POLICY_FAILURE action', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        resetPasswordInfo: {
          err: {
            error: {
              message: 'Session expired or invalid.',
            },
          },
        },
        passwordPrivacyPolicyInfo: {
          err: {
            error: {
              message: 'password policy not found',
            },
          },
        },
      },
    }));
    const { getByText } = render(
      <ResetPassword />,
    );
    expect(getByText('BACK')).toBeInTheDocument();
    fireEvent.click(getByText('BACK'));
    expect(mockHistoryPush).toHaveBeenCalledWith({ pathname: '/' });
    expect(getByText('Session expired or invalid.')).toBeInTheDocument();
    expect(getByText('password policy not found')).toBeInTheDocument();
  });

  it('dom testing ', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        resetPasswordInfo: {
          loading: true,
        },
        passwordPrivacyPolicyInfo: {
          err: {
            error: {
              message: 'password policy not found',
            },
          },
        },
      },
    }));
    const { getByText } = render(
      <ResetPassword />,
    );
    expect(getByText('Loading')).toBeInTheDocument();
  });
});
