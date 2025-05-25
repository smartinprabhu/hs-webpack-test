/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { CookiesProvider, Cookies } from 'react-cookie';
import api from '../../middleware/api';
import 'cross-fetch/polyfill';

// Import your own reducer
import rootReducer from '../../rootReducer';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore);

function render(
  ui,
  {
    initialState,
    cookie = new Cookies(),
    store = createStoreWithMiddleware(rootReducer, initialState),
    ...renderOptions
  } = {},
) {
  // eslint-disable-next-line react/prop-types
  function Wrapper({ children }) {
    cookie.set('access_token', 'zpTBXL92ayx7QNhfXnvXJ1Ond4lwJM');
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Router>
        <CookiesProvider cookies={cookie}>
          <Provider store={store}>{children}</Provider>
        </CookiesProvider>
      </Router>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
