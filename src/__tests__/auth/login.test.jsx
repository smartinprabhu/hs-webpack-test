import React from 'react';
import { useSelector } from 'react-redux';
import {
  render, fireEvent, screen,
} from '@testing-library/react';
import fetchMock from 'fetch-mock';

import '@testing-library/jest-dom/extend-expect';

import Login from '../../app/auth/login';
import * as actions from '../../app/auth/authActions';
import reducer from '../../app/auth/authReducer';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

describe('login testing', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('login snapshots', () => {
    it('snapshot testing', () => {
      useSelector.mockImplementation((fn) => fn({
        auth: {
          authInfo: null,
          authError: null,
        },
      }));
      const { asFragment } = render(
        <Login />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('login actions, reducers', () => {
    const initialState = {
      authError: null,
      authInfo: null,
    };

    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    const loginRes = {
      access_token: 'fpC8oaGlwknbFbJpHRSmijBvbp53tJ',
      expires_in: 3600,
      token_type: 'Bearer',
      scope: '',
      refresh_token: 'F4Lub38xxOBubAlxjAqQMPcLl68BH6',
    };

    it('it should return the LOGIN_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.LOGIN_SUCCESS,
        payload: loginRes,
      })).toEqual({
        authInfo: loginRes,
        authError: null,
      });
    });

    it('it should return the LOGIN_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.LOGIN_FAILURE,
        error: 'Login Failed',
      })).toEqual({
        authInfo: null,
        authError: 'Login Failed',
      });
    });

    it('it should return the LOGOUT_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.LOGOUT_SUCCESS,
      })).toEqual({
        authInfo: null,
        authError: null,
      });
    });

    it('it should return the LOGOUT_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.LOGOUT_FAILURE,
        error: 'Logout Failed',
      })).toEqual({
        authInfo: null,
        authError: 'Logout Failed',
      });
    });

    it('should handle login failure', () => {
      const data = 'Login Failed';
      const expectedAction = {
        type: actions.LOGIN_FAILURE,
        payload: data,
      };
      expect(actions.loginFailure(data)).toEqual(expectedAction);
    });

    it('should handle request for login success', () => {
      const data = 'success';
      const expectedAction = {
        type: actions.LOGIN_SUCCESS,
        payload: data,
      };
      expect(actions.loginSuccess(data)).toEqual(expectedAction);
    });

    it('should handle logout failure', () => {
      const data = 'Logout Failed';
      const expectedAction = {
        type: actions.LOGOUT_FAILURE,
        payload: data,
      };
      expect(actions.logoutFailure(data)).toEqual(expectedAction);
    });

    it('should handle request for logout success', () => {
      const expectedAction = {
        type: actions.LOGOUT_SUCCESS,
      };
      expect(actions.logoutSuccess()).toEqual(expectedAction);
    });
  });

  const userLoginMock = {
    username: 'technopark@helixsense.com',
    password: 'p',
  };

  it('should test Login', () => {
    const handleSubmit = jest.fn();
    const { container, getByText } = render(<Login handleSubmit={handleSubmit} />);
    const username = screen.getByLabelText('Username', { selector: 'input' });
    const password = screen.getByLabelText('Password', { selector: 'input' });
    fireEvent.change(username, {
      target: {
        value: userLoginMock.username,
      },
    });

    fireEvent.change(password, {
      target: {
        value: userLoginMock.password,
      },
    });

    expect(username).toHaveAttribute('id', 'exampleUsername');
    expect(password).toHaveAttribute('id', 'examplePassword');
    fireEvent.click(getByText('LOGIN'));
    expect(container).toBeInTheDocument();
  });

  it('display error message on login faliure', () => {
    useSelector.mockImplementation((fn) => fn({
      auth: {
        authInfo: null,
        authError: 'Logout Failed',
      },
    }));

    const { container } = render(
      <Login />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Logout Failed');
    expect(container).toBeInTheDocument();
  });
});
