import React from 'react';
import { useSelector } from 'react-redux';
import { render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import { CALL_API } from '../../middleware/api';
import Dashboard from '../../app/dashboard/dashboard';
import GoogleMapView from '../../app/dashboard/googleMapView';
import GoogleMapLocation from '../../app/dashboard/googleMapLocation';
import * as actions from '../../app/dashboard/actions';
import * as services from '../../app/dashboard/dashboardService';
import reducer from '../../app/dashboard/reducer';
import mockData from './mockData.json';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

const companyRes = mockData.companyDataResponse;
const buildingRes = mockData.buildingDataResponse;
const userRes = mockData.userResponse;

describe('Dashboard testing', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('Dashboard snapshots', () => {
    it('snapshot testing', () => {
      useSelector.mockImplementation((fn) => fn({
        config: {
          buildingData: {},
          companyData: {},
        },
        user: {
          userInfo: {},
        },
      }));
      const { asFragment } = render(
        <Router><Dashboard /></Router>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Dashboard actions, reducers', () => {
    const initialState = {
      buildingData: {},
      companyData: {},
    };

    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('it should return the GET_COMPANIES', () => {
      expect(reducer(initialState, {
        type: actions.GET_COMPANIES,
      })).toEqual({
        buildingData: {},
        companyData: { loading: true },
      });
    });

    it('it should return the GET_COMPANIES_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_COMPANIES_SUCCESS,
        payload: {
          data: companyRes, error: {}, length: 10, status: true, status_code: 200,
        },
      })).toEqual({
        companyData: { loading: false, data: companyRes },
        buildingData: {},
      });
    });

    it('it should return the GET_COMPANIES_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_COMPANIES_FAILURE,
        error: 'No data found.',
      })).toEqual({
        buildingData: {}, companyData: { err: undefined, loading: false },
      });
    });

    it('it should return the GET_BUILDING', () => {
      expect(reducer(initialState, {
        type: actions.GET_BUILDING,
      })).toEqual({
        companyData: {},
        buildingData: { loading: true },
      });
    });

    it('it should return the GET_BUILDING_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_BUILDING_SUCCESS,
        payload: {
          data: buildingRes, error: {}, length: 10, status: true, status_code: 200,
        },
      })).toEqual({
        buildingData: { loading: false, data: buildingRes },
        companyData: {},
      });
    });

    it('it should return the GET_BUILDING_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_BUILDING_FAILURE,
      })).toEqual({
        buildingData: { err: undefined, loading: false }, companyData: {},
      });
    });

    it('should handle Company Action', () => {
      const payload = 3;

      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read/res.company?domain=[["id","in",[${payload}]]]&fields=["area_sqft","code","name","latitude","longitude","street","res_company_categ_id"]`,
          types: [actions.GET_COMPANIES, actions.GET_COMPANIES_SUCCESS, actions.GET_COMPANIES_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getCompanies(3)).toEqual(expectedAction);
    });

    it('should handle Building Action', () => {
      const payload = 3;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read/mro.equipment.location?domain=[["company_id","in",[${payload}]],["asset_category_id", "ilike", "building"]]&fields=["space_name","parent_id","area_sqft","child_ids"]`,
          types: [actions.GET_BUILDING, actions.GET_BUILDING_SUCCESS, actions.GET_BUILDING_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getBuildings(3)).toEqual(expectedAction);
    });
  });

  describe('Dashboard Services', () => {
    it('it should mock the service Company', () => {
      const serviceMock = jest.spyOn(services, 'getCompaniesInfo');
      services.getCompaniesInfo(3);
      expect(serviceMock).toBeCalled();
    });

    it('it should mock the service Building', () => {
      const serviceMock = jest.spyOn(services, 'getBuildingByCompanyId');
      services.getBuildingByCompanyId(3);
      expect(serviceMock).toBeCalled();
    });
  });

  describe('Dashboard Component', () => {
    it('Renders <Dashboard /> component correctly', () => {
      render(<Router><Dashboard /></Router>);
      expect(screen.getByText('All Buildings')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('it Shows Apps List', () => {
      render(<Router><Dashboard /></Router>);
      expect(screen.getByText('Apps')).toBeInTheDocument();
    });

    it('it Shows New App options', () => {
      const { container } = render(<Router><Dashboard /></Router>);
      const element = container.querySelector('.newApp');
      expect(element).toBeInTheDocument();
    });

    it('it Shows Notifications List', () => {
      const { container } = render(<Router><Dashboard /></Router>);
      const element = container.querySelector('.notification-list');
      expect(element).toBeInTheDocument();
    });

    it('it Shows Notifications Count', () => {
      const { container } = render(<Router><Dashboard /></Router>);
      const element = container.querySelector('.badge');
      expect(element).toBeInTheDocument();
    });

    it('it Shows Map View', () => {
      useSelector.mockImplementation((fn) => fn({
        config: {
          companyData: { loading: false, data: companyRes },
        },
        user: {
          userInfo: userRes,
        },
      }));
      const { container } = render(<Router><GoogleMapView /></Router>);
      const element = container.querySelector('.map');
      expect(element).toBeInTheDocument();
    });

    it('it Shows Sites List', () => {
      useSelector.mockImplementation((fn) => fn({
        config: {
          companyData: { loading: false, data: companyRes },
        },
        user: {
          userInfo: userRes,
        },
      }));
      const { container } = render(<Router><Dashboard /></Router>);
      const element = container.querySelector('.siteList');
      expect(element).toBeInTheDocument();
    });

    it('it Shows Sites Component Loader', () => {
      useSelector.mockImplementation((fn) => fn({
        config: {
          companyData: { loading: false, data: companyRes },
        },
        user: {
          userInfo: { loading: true },
        },
      }));
      render(<Router><Dashboard /></Router>);
      expect(screen.queryByTestId('loading-sites')).toBeVisible();
    });

    it('it shows building count', () => {
      useSelector.mockImplementation((fn) => fn({
        config: {
          buildingData: { loading: false, data: buildingRes },
        },
        user: {
          userInfo: userRes,
        },
      }));

      const { container } = render(<Router><Dashboard /></Router>);
      const element = container.querySelector('.buildingcount');
      expect(element).toBeInTheDocument();
    });

    it('it shows Total Area', () => {
      useSelector.mockImplementation((fn) => fn({
        config: {
          companyData: { loading: false, data: companyRes },
        },
        user: {
          userInfo: userRes,
        },
      }));

      const { container } = render(<Router><Dashboard /></Router>);
      const element = container.querySelector('.totalarea');
      expect(element).toBeInTheDocument();
    });

    it('it shows Map Location Listing inside google map', () => {
      useSelector.mockImplementation((fn) => fn({
        config: {
          companyData: { loading: false, data: companyRes },
        },
        user: {
          userInfo: userRes,
        },
      }));

      const { container } = render(<Router><GoogleMapLocation text="Divayasree" address="2/502" /></Router>);
      const element = container.querySelector('.mapicon');
      expect(element).toBeInTheDocument();
    });
  });
});
