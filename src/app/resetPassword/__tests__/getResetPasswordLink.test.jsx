import React from 'react';
import * as redux from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import {
  cleanup, fireEvent, render, waitFor,
} from '@testing-library/react';
import 'babel-polyfill';

import api from '../../../middleware/api';
import * as actions from '../action';
import * as services from '../service';
import reducer from '../reducer';
import GetResetPasswordLink from '../getResetPasswordLink';

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

describe('getResetPasswordLink testing', () => {
  it('snapshot testing', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        resetPasswordLinkInfo: {
          loading: true,
        },
      },
    }));
    const { asFragment } = render(<GetResetPasswordLink />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('it should mock getResetPasswordLink function', () => {
    const getResetPasswordLink = (data) => actions.getResetPasswordLink(data);
    getResetPasswordLink();
    expect(actions.getResetPasswordLink).toBeDefined();
  });

  it('it should mock CLEAR_RESET_PASSWORD_DATA action', () => {
    const expectedAction = {
      type: actions.CLEAR_RESET_PASSWORD_DATA,
    };
    expect(actions.showForgotMailFormData()).toEqual(expectedAction);
  });

  it('it should mock the services', () => {
    const showForgotMailForm = jest.spyOn(services, 'showForgotMailForm');
    services.showForgotMailForm();
    expect(showForgotMailForm).toBeCalled();

    const sendResetPasswordLink = jest.spyOn(services, 'sendResetPasswordLink');
    services.sendResetPasswordLink();
    expect(sendResetPasswordLink).toBeCalled();
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

  it('it should return the RESET_PASSWORD_LINK ', () => {
    expect(reducer(initialState, {
      type: actions.RESET_PASSWORD_LINK,
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: {},
      resetPasswordLinkInfo: { loading: true },
      session: null,
    });
  });
  const linkRes = {
    data: {
      message: 'An email with a link to reset your password has been sent to the given email address. The link is only valid for one hour.',
      success: true,
    },
  };

  it('it should return the RESET_PASSWORD_LINK_SUCCESS ', () => {
    expect(reducer(initialState, {
      type: actions.RESET_PASSWORD_LINK_SUCCESS,
      payload: linkRes,
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: {},
      resetPasswordLinkInfo: { loading: false, data: linkRes.data },
      session: null,
    });
  });

  it('it should return the RESET_PASSWORD_LINK_FAILURE ', () => {
    expect(reducer(initialState, {
      type: actions.RESET_PASSWORD_LINK_FAILURE,
      error: {
        data: 'Invalid token',
      },
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: {},
      resetPasswordLinkInfo: {
        loading: false,
        err: 'Invalid token',
      },
      session: null,
    });
  });

  it('it should return the CLEAR_RESET_PASSWORD_DATA', () => {
    expect(reducer(initialState, {
      type: actions.CLEAR_RESET_PASSWORD_DATA,
    })).toEqual({
      checkResetPasswordLinkInfo: {},
      passwordPrivacyPolicyInfo: {},
      resetPasswordInfo: {},
      resetPasswordLinkInfo: { loading: false, data: null, err: null },
      session: null,
    });
  });

  it('dom testing for initial state', async () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {},
    }));
    const { container, getByLabelText, getByText } = render(
      <GetResetPasswordLink />,
    );
    const inputNode = getByLabelText('Email');
    expect(inputNode.value).toBe('');
    fireEvent.change(inputNode, { target: { value: 'si.abhi9876@gmail.com' } });
    expect(inputNode.value).toBe('si.abhi9876@gmail.com');
    fireEvent.click(getByText('SUBMIT'));

    fireEvent.change(inputNode, { target: { value: '' } });
    fireEvent.blur(inputNode);
    let error;
    await waitFor(() => {
      error = getByText('*Please Enter your Email');
    });
    expect(error).not.toBeNull();
    expect(container).toBeInTheDocument();
  });

  it('dom testing for RESET_PASSWORD_LINK_FAILURE', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        resetPasswordLinkInfo: {
          err: {
            error: { message: 'Invalid email' },
          },
        },
      },
    }));
    const { container, getByText } = render(
      <GetResetPasswordLink />,
    );
    expect(getByText('Invalid email')).toBeInTheDocument();
    expect(getByText('BACK')).toBeInTheDocument();
    fireEvent.click(getByText('BACK'));
    expect(container).toBeInTheDocument();
  });

  it('dom testing for RESET_PASSWORD_LINK_SUCCESS action', () => {
    redux.useSelector.mockImplementation((fn) => fn({
      resetPassword: {
        resetPasswordLinkInfo: {
          data: {
            message: 'An email with a link to reset your password has been sent to the given email address. The link is only valid for one hour.',
            success: true,
          },
        },
      },
    }));
    const { getByText } = render(<GetResetPasswordLink />);
    expect(getByText('An email with a link to reset your password has been sent to the given email address. The link is only valid for one hour.')).toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
    fireEvent.click(getByText('OK'));
    expect(mockHistoryPush).toHaveBeenCalledWith({ pathname: '/' });
  });
});
