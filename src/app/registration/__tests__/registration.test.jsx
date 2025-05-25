import React from 'react';
import configureMockStore from 'redux-mock-store';
import { render, fireEvent, cleanup } from '@testing-library/react';
// import { Provider, useDispatch, useSelector } from 'react-redux';
import * as redux from 'react-redux';
import { act } from '@testing-library/react-hooks';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/dom';

import MailRegistration from '../mailRegistration';
import UserRegistration from '../registartion';
import * as services from '../service';
import * as actions from '../actions';
import reducer from '../reducer';
import api from '../../../middleware/api';
import store from '../../../store';

afterEach(() => {
  fetchMock.restore();
  cleanup();
});

function renderWithRedux(component) {
  const { Provider } = redux;
  return {
    ...render(<Provider store={store}>{component}</Provider>),
  };
}

describe('registration snapshots', () => {
  it('mail registration renders without crashing', () => {
    const { asFragment } = renderWithRedux(<MailRegistration />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('registration snapshots', () => {
  it('mail registration renders without crashing', () => {
    const registerObject = {
      sessionToken: 'abc',
      mail: 'user@example.com',
    };
    const { asFragment } = renderWithRedux(<UserRegistration registerObject={registerObject} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('registration actions, reducers, middleware', () => {
  it('it should mock getMailValidation function', () => {
    actions.getMailValidation = jest.fn();
    const getMailValidation = (data,data2,data3) => actions.getMailValidation(data,data2,data3);
    getMailValidation('user@example.com', 'token-local', 'tenantId');
    expect(actions.getMailValidation).toBeCalled();
  });

  it('it should mock resetRegistrationProcess function', () => {
    actions.resetRegistrationProcess = jest.fn();
    const resetRegistrationProcess = (data,data2,data3) => actions.resetRegistrationProcess(data,data2,data3);
    resetRegistrationProcess('user@example.com', 'token-local', 'tenantId');
    expect(actions.resetRegistrationProcess).toBeCalled();
  });

  const create = () => {
    const storeCreate = jest.fn();
    const next = jest.fn();
    const invoke = (action) => api(storeCreate)(next)(action);
    return { next, invoke };
  };

  it('passes through CHECK_EMAIL action', () => {
    const { next, invoke } = create();
    const action = { type: actions.CHECK_EMAIL };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through CHECK_EMAIL_SUCCESS action', () => {
    const { next, invoke } = create();
    const action = { type: actions.CHECK_EMAIL_SUCCESS };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through CHECK_EMAIL_FAILURE action', () => {
    const { next, invoke } = create();
    const action = { type: actions.CHECK_EMAIL_FAILURE };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('passes through RESET_REGISTRATION action', () => {
    const { next, invoke } = create();
    const action = { type: actions.RESET_REGISTRATION };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  const initialState = {
    mailResponse: {},
    userRegistartionResponse: {},
    errorMessage: {},
    registerLoading: false,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle CHECK_EMAIL', () => {
    expect(reducer(initialState, {
      type: 'CHECK_EMAIL',
    })).toEqual({
      ...initialState,
      registerLoading: true,
    });
  });

  it('should handle CHECK_EMAIL_SUCCESS', () => {
    expect(reducer(initialState, {
      type: 'CHECK_EMAIL_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      registerLoading: false,
      mailResponse: '',
      errorMessage: {},
    });
  });

  it('should handle CHECK_EMAIL_FAILURE', () => {
    expect(reducer(initialState, {
      type: 'CHECK_EMAIL_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      registerLoading: false,
      errorMessage: '',
    });
  });

  it('should handle REGISTER_USER', () => {
    expect(reducer(initialState, {
      type: 'REGISTER_USER',
    })).toEqual({
      ...initialState,
      registerLoading: true,
    });
  });

  it('should handle REGISTER_USER_SUCCESS', () => {
    expect(reducer(initialState, {
      type: 'REGISTER_USER_SUCCESS',
      payload: { data: '' },
    })).toEqual({
      ...initialState,
      registerLoading: false,
      userRegistartionResponse: '',
      errorMessage: {},
    });
  });

  it('should handle REGISTER_USER_FAILURE', () => {
    expect(reducer(initialState, {
      type: 'REGISTER_USER_FAILURE',
      error: { data: '' },
    })).toEqual({
      ...initialState,
      registerLoading: false,
      errorMessage: '',
      userRegistartionResponse: {},

    });
  });

  it('should handle RESET_REGISTRATION', () => {
    expect(reducer(initialState, {
      type: 'RESET_REGISTRATION',
    })).toEqual({
      ...initialState,
      registerLoading: false,
      mailResponse: {},
      errorMessage: {},
    });
  });

  it('should handle SHOW_REGISTRATION', () => {
    expect(reducer(initialState, {
      type: 'SHOW_REGISTRATION',
    })).toEqual({
      ...initialState,
      registerLoading: false,
      userRegistartionResponse: {},
      errorMessage: {},
    });
  });

  it('should check dispatch is called', () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);

    mockDispatchFn(services.resetRegistration());
    expect(mockDispatchFn).toBeCalled();
  });

  it('should check all service', () => {
    const resetRegistrationSpy = jest.spyOn(services, 'resetRegistration');
    const registerUserSpy = jest.spyOn(services, 'registerUser');
    const getOtpValidationSpy = jest.spyOn(services, 'getOtpValidation');
    const getMailStatusSpy = jest.spyOn(services, 'getMailStatus');

    services.resetRegistration();
    expect(resetRegistrationSpy).toBeCalled();

    services.registerUser();
    expect(registerUserSpy).toBeCalled();

    services.getOtpValidation();
    expect(getOtpValidationSpy).toBeCalled();

    services.getMailStatus('user@example.com, token, tenantId');
    expect(getMailStatusSpy).toBeCalled();
  });

  it('should check mail registration field', () => {
    act(() => {
      renderWithRedux(<MailRegistration />);
    });

    const email = screen.getByLabelText('Email', { selector: 'input' });
    act(() => {
      fireEvent.change(email, {
        target: {
          value: 'user@example.com',
        },
      });
    });

    expect(email).toHaveAttribute('id', 'email');
    expect(email).toHaveAttribute('value', 'user@example.com');
  });

  it('should check otp field', () => {
    const initialState1 = {
      mailRegister: {
        mailResponse: { message: 'OTP has been sent successfully.' },
        userRegistartionResponse: {},
        errorMessage: {},
        loginLoading: false,
        registerLoading: false,
      },
    };

    const onSubmit = jest.fn();
    const mockStore = configureMockStore();
    const { Provider } = redux;
    const { container } = render(<Provider store={mockStore(initialState1)}><MailRegistration onSubmit={onSubmit} /></Provider>);

    const otpField = screen.getByLabelText('OTP', { selector: 'input' });
    act(() => {
      fireEvent.change('otp', {
        target: {
          value: '1234',
        },
      });
    });

    expect(otpField).toHaveAttribute('id', 'otp');
    expect(otpField).toHaveAttribute('value', '1234');

    const backButton = screen.getByText('BACK');
    act(() => {
      fireEvent.click(backButton);
    });
    expect(services.resetRegistration).toHaveBeenCalled();

    act(() => {
      fireEvent.change('email', {
        target: {
          value: 'user@example.com',
        },
      });

      fireEvent.change('otp', {
        target: {
          value: '1234',
        },
      });
      const regButton = screen.getByText('REGISTER');
      fireEvent.click(regButton);
    });
    expect(container).toBeInTheDocument();

    act(() => {
      fireEvent.change('email', {
        target: {
          value: 'user@example.com',
        },
      });

      fireEvent.change('otp', {
        target: {
          value: '',
        },
      });
      const regButton1 = screen.getByText('REGISTER');
      fireEvent.click(regButton1);
    });
    expect(container).toBeInTheDocument();
  });

  it('should check all mail validation conditions', () => {
    const initialState2 = {
      mailRegister: {
        mailResponse: { message: '' },
        userRegistartionResponse: {},
        errorMessage: {},
        loginLoading: false,
        registerLoading: false,
      },
    };

    const onSubmit = jest.fn();
    const mockStore = configureMockStore();
    const { Provider } = redux;
    const { container } = render(<Provider store={mockStore(initialState2)}><MailRegistration onSubmit={onSubmit} /></Provider>);

    act(() => {
      fireEvent.change('email', {
        target: {
          value: 'user@example.com',
        },
      });

      const registerButton = screen.getByText('REGISTER');
      fireEvent.click(registerButton);
    });
    expect(container).toBeInTheDocument();

    act(() => {
      fireEvent.change('email', {
        target: {
          value: 'user.com',
        },
      });

      const regButton = screen.getByText('REGISTER');
      fireEvent.click(regButton);
    });
    expect(container).toBeInTheDocument();
  });

  it('should check otp validation', () => {
    const initialState3 = {
      mailRegister: {
        mailResponse: { message: 'OTP has been sent successfully.' },
        userRegistartionResponse: {},
        errorMessage: {},
        loginLoading: false,
        registerLoading: false,
      },
    };

    const onSubmit = jest.fn();
    const mockStore = configureMockStore();
    const { Provider } = redux;
    const { container } = render(<Provider store={mockStore(initialState3)}><MailRegistration onSubmit={onSubmit} /></Provider>);

    const otpField = screen.getByLabelText('OTP', { selector: 'input' });
    const email = screen.getByLabelText('Email', { selector: 'input' });
    act(() => {
      fireEvent.change(email, {
        target: {
          value: 'user@example.com',
        },
      });

      fireEvent.change(otpField, {
        target: {
          value: '123',
        },
      });

      const registerButton = screen.getByText('REGISTER');
      fireEvent.click(registerButton);
    });
    expect(container).toBeInTheDocument();
  });

  it('should check all dom testing', () => {
    const initialState4 = {
      mailRegister: {
        mailResponse: { message: 'OTP sent succesfully!.' },
        registerLoading: true,
      },
    };

    const onSubmit = jest.fn();
    const { Provider } = redux;
    const mockStore = configureMockStore();
    const { container } = render(<Provider store={mockStore(initialState4)}><MailRegistration onSubmit={onSubmit} /></Provider>);
    expect(container).toBeInTheDocument();
  });

  it('should check all dom testing1', () => {
    const initialState5 = {
      mailRegister: {
        mailResponse: { message: 'OTP sent succesfully!.' },
        registerLoading: false,
        errorMessage: {
          data: { message: 'Invalid OTP' },
        },
      },
    };

    const onSubmit = jest.fn();
    const { Provider } = redux;
    const mockStore = configureMockStore();
    const { container } = render(<Provider store={mockStore(initialState5)}><MailRegistration onSubmit={onSubmit} /></Provider>);

    // const text = screen.getByText(/invalid OTP/i, { exact: true });
    // expect(text).toHaveTextContent('invalid OTP');
    expect(container).toBeInTheDocument();
  });

  it('should check all dom testing2', () => {
    const initialState6 = {
      mailRegister: {
        mailResponse: { message: 'OTP sent succesfully!.' },
        registerLoading: false,
        errorMessage: {
          data: { message: 'Invalid OTP' },
          error: { message: 'Invalid Email' },
        },
      },
    };

    const onSubmit = jest.fn();
    const { Provider } = redux;
    const mockStore = configureMockStore();
    const { container } = render(<Provider store={mockStore(initialState6)}><MailRegistration onSubmit={onSubmit} /></Provider>);

    expect(container).toBeInTheDocument();
  });

  it('should check onSubmit', () => {
    const initialState7 = {
      mailRegister: {
        mailResponse: { message: 'OTP Confirmed Successfully.' },
        userRegistartionResponse: {},
        errorMessage: {},
        loginLoading: false,
        registerLoading: false,
      },
    };

    const registerObject = {
      sessionToken: 'abc',
      mail: 'user@example.com',
    };

    const mockStore = configureMockStore();
    const { Provider } = redux;
    const onSubmit = jest.fn();
    const { container } = render(<Provider store={mockStore(initialState7)}><UserRegistration registerObject={registerObject} onSubmit={onSubmit} /></Provider>);

    const fname = screen.getByLabelText('First Name', { selector: 'input' });
    const lname = screen.getByLabelText('Last Name', { selector: 'input' });
    const workNum = screen.getByLabelText('Work Number', { selector: 'input' });
    const paswrd = screen.getByLabelText('Password', { selector: 'input' });
    const repeatpaswrd = screen.getByLabelText('Re-type Password', { selector: 'input' });

    act(() => {
      fireEvent.change(fname, {
        target: {
          value: 'fname',
        },
      });

      fireEvent.change(lname, {
        target: {
          value: 'lname',
        },
      });

      fireEvent.change(workNum, {
        target: {
          value: '1234567890',
        },
      });

      fireEvent.change(paswrd, {
        target: {
          value: 'passWord@10',
        },
      });

      fireEvent.change(repeatpaswrd, {
        target: {
          value: 'passWord@10',
        },
      });

      const registerButton = screen.getByText('REGISTER');
      fireEvent.click(registerButton);
    });
    expect(container).toBeInTheDocument();
  });

  it('should check all user registration fields', () => {
    const registerObject = {
      sessionToken: 'abc',
      mail: 'user@example.com',
    };
    const { container, getByText } = renderWithRedux(<UserRegistration registerObject={registerObject} />);
    const fname = screen.getByLabelText('First Name', { selector: 'input' });
    const lname = screen.getByLabelText('Last Name', { selector: 'input' });
    const workNum = screen.getByLabelText('Work Number', { selector: 'input' });
    const paswrd = screen.getByLabelText('Password', { selector: 'input' });
    const repeatpaswrd = screen.getByLabelText('Re-type Password', { selector: 'input' });

    act(() => {
      fireEvent.change(fname, {
        target: {
          value: 'fname',
        },
      });
    });

    expect(fname).toHaveAttribute('id', 'firstName');
    expect(fname).toHaveAttribute('value', 'fname');
    expect(lname).toHaveAttribute('id', 'lastName');
    expect(lname).toHaveAttribute('value', '');
    expect(workNum).toHaveAttribute('id', 'workNumber');
    expect(workNum).toHaveAttribute('value', '');
    expect(paswrd).toHaveAttribute('id', 'password');
    expect(paswrd).toHaveAttribute('value', '');
    expect(repeatpaswrd).toHaveAttribute('id', 'repeatPassword');
    expect(repeatpaswrd).toHaveAttribute('value', '');

    act(() => {
      fireEvent.click(getByText('REGISTER'));
    });
    expect(container).toBeInTheDocument();
  });

  it('should handle actions', () => {
    const configuredMockStore = configureMockStore();
    const mockStore = configuredMockStore({});

    const CHECK_EMAIL = () => ({
      type: 'CHECK_EMAIL',
    });

    mockStore.dispatch(CHECK_EMAIL());
    expect(mockStore.getActions()).toMatchSnapshot();

    const CHECK_EMAIL_SUCCESS = (action) => ({
      type: 'CHECK_EMAIL_SUCCESS',
      action,
    });
    mockStore.dispatch(CHECK_EMAIL_SUCCESS(
      {
        data: {
          data: '',
        },
        error: {},
      },
    ));
    expect(mockStore.getActions()).toMatchSnapshot();

    const CHECK_EMAIL_FAILURE = (action) => ({
      type: 'CHECK_EMAIL_FAILURE',
      action,
    });
    mockStore.dispatch(CHECK_EMAIL_FAILURE(
      {
        data: {},
        error: {
          data: '',
        },
      },
    ));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should handle SHOW_REGISTRATION action', () => {
    const expectedAction = {
      type: actions.SHOW_REGISTRATION,
    };
    expect(actions.showRegistrationForm()).toEqual(expectedAction);
  });

  it('should handle RESET_REGISTRATION action', () => {
    const expectedAction = {
      type: actions.RESET_REGISTRATION,
    };
    expect(actions.resetRegistrationProcess()).toEqual(expectedAction);
  });
});
