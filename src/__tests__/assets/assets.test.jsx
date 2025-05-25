import React from 'react';
import { useSelector } from 'react-redux';
import {
  render, screen,
} from '@testing-library/react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import fetchMock from 'fetch-mock';

import '@testing-library/jest-dom/extend-expect';

import { CALL_API } from '../../middleware/api';
import Equipments from '../../app/assets/equipments';
import AssetDetailInfo from '../../app/assets/assetDetails/assetDetailInfo';
import AssetSuccess from '../../app/assets/assetSuccess/assetSuccess';
import * as actions from '../../app/assets/actions';
import reducer from '../../app/assets/reducer';
import mockData from './mockData.json';
import { getFirstDayofMonth, getLastDayofMonth } from '../../app/util/appUtils';

const appModels = require('../../app/util/appModels').default;

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

describe('Assets testing', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('Assets snapshots', () => {
    it('Assets testing', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          equipmentsInfo: {},
        },
        user: {
          userInfo: {},
        },
      }));
      const { asFragment } = render(
        <Router><Equipments /></Router>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('Assets actions, reducers', () => {
    const initialState = {};

    it('should return the initial state', () => {
      expect(reducer(initialState, {})).toEqual(initialState);
    });

    const errorRes = mockData.errorResponse;
    const countRes = mockData.equipmentCountResponse;
    const listRes = mockData.equipmentListResponse;
    const categoryRes = mockData.categoryResponse;
    const categoryListRes = mockData.categoryListResponse;
    const employeesRes = mockData.employeesResponse;
    const teamsRes = mockData.teamsResponse;
    const equipmentRes = mockData.equipmentDetails;
    const floorsRes = mockData.floorsDetails;
    const floorChildsRes = mockData.floorsChilds;
    const spaceRes = mockData.spaceDetails;
    const dashboardRes = mockData.dashboardData;
    const expirtyAssetsRes = mockData.expiryAssets;

    it('it should return the GET_EQUIPMENTS_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_EQUIPMENTS_INFO,
      })).toEqual({
        equipmentsInfo: { loading: true },
      });
    });

    it('it should return the GET_EQUIPMENTS_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_EQUIPMENTS_INFO_SUCCESS,
        payload: {
          data: listRes, error: {}, length: 10, status: true,
        },
      })).toEqual({
        equipmentsInfo: { loading: false, data: listRes },
      });
    });

    it('it should return the GET_EQUIPMENTS_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_EQUIPMENTS_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        equipmentsInfo: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_EQUIPMENTS_COUNT', () => {
      expect(reducer(initialState, {
        type: actions.GET_EQUIPMENTS_COUNT,
      })).toEqual({
        equipmentsCountLoading: true,
      });
    });

    it('it should return the GET_EQUIPMENTS_COUNT_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_EQUIPMENTS_COUNT_SUCCESS,
        payload: {
          data: countRes, error: {}, length: 1, status: true,
        },
      })).toEqual({
        equipmentsCount: countRes,
        equipmentsCountLoading: false,
      });
    });

    it('it should return the GET_EQUIPMENTS_COUNT_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_EQUIPMENTS_COUNT_FAILURE,
        payload: errorRes,
      })).toEqual({
        equipmentsCountErr: errorRes,
        equipmentsCountLoading: false,
      });
    });

    it('it should return the GET_CATEGORIES_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_CATEGORIES_INFO,
      })).toEqual({
        loading: true,
      });
    });

    it('it should return the GET_CATEGORIES_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_CATEGORIES_INFO_SUCCESS,
        payload: {
          data: categoryListRes, error: {}, length: 10, status: true,
        },
      })).toEqual({
        categoriesInfo: {
          data: categoryListRes, error: {}, length: 10, status: true,
        },
        loading: false,
      });
    });

    it('it should return the GET_CATEGORIES_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_CATEGORIES_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        categoriesErr: errorRes,
        loading: false,
      });
    });

    it('it should return the GET_CATEGORIES_GROUP_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_CATEGORIES_GROUP_INFO,
      })).toEqual({
        categoryGroupsInfo: { loading: true },
      });
    });

    it('it should return the GET_CATEGORIES_GROUP_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_CATEGORIES_GROUP_INFO_SUCCESS,
        payload: {
          data: categoryRes, error: {}, length: 126, status: true,
        },
      })).toEqual({
        categoryGroupsInfo: { loading: false, data: categoryRes },
      });
    });

    it('it should return the GET_CATEGORIES_GROUP_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_CATEGORIES_GROUP_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        categoryGroupsInfo: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_TEAMS_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_TEAMS_INFO,
      })).toEqual({
        loading: true,
      });
    });

    it('it should return the GET_TEAMS_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_TEAMS_INFO_SUCCESS,
        payload: {
          data: teamsRes, error: {}, length: 10, status: true,
        },
      })).toEqual({
        teamsInfo: {
          data: teamsRes, error: {}, length: 10, status: true,
        },
        loading: false,
      });
    });

    it('it should return the GET_TEAMS_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_TEAMS_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        teamsErr: errorRes,
        loading: false,
      });
    });

    it('it should return the GET_EMPLOYESS_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_EMPLOYESS_INFO,
      })).toEqual({
        loading: true,
      });
    });

    it('it should return the GET_EMPLOYESS_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_EMPLOYESS_INFO_SUCCESS,
        payload: {
          data: employeesRes, error: {}, length: 10, status: true,
        },
      })).toEqual({
        employeesInfo: {
          data: employeesRes, error: {}, length: 10, status: true,
        },
        loading: false,
      });
    });

    it('it should return the GET_EMPLOYESS_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_EMPLOYESS_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        employeesErr: errorRes,
        loading: false,
      });
    });

    it('it should return the CREATE_ASSET_INFO', () => {
      expect(reducer(initialState, {
        type: actions.CREATE_ASSET_INFO,
      })).toEqual({
        addAssetInfo: { loading: true },
      });
    });

    it('it should return the CREATE_ASSET_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.CREATE_ASSET_INFO_SUCCESS,
        payload: {
          data: [], error: {}, length: 1, status: true,
        },
      })).toEqual({
        addAssetInfo: { loading: false, data: [] },
      });
    });

    it('it should return the CREATE_ASSET_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.CREATE_ASSET_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        addAssetInfo: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_ASSET_DETAILS', () => {
      expect(reducer(initialState, {
        type: actions.GET_ASSET_DETAILS,
      })).toEqual({
        equipmentsDetails: { loading: true },
      });
    });

    it('it should return the GET_ASSET_DETAILS_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_ASSET_DETAILS_SUCCESS,
        payload: {
          data: equipmentRes, error: {}, length: 1, status: true,
        },
      })).toEqual({
        equipmentsDetails: { loading: false, data: equipmentRes },
      });
    });

    it('it should return the GET_ASSET_DETAILS_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_ASSET_DETAILS_FAILURE,
        payload: errorRes,
      })).toEqual({
        equipmentsDetails: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_FLOORS_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_FLOORS_INFO,
      })).toEqual({
        getFloorsInfo: { loading: true },
      });
    });

    it('it should return the GET_FLOORS_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_FLOORS_INFO_SUCCESS,
        payload: {
          data: floorsRes, error: {}, length: 5, status: true,
        },
      })).toEqual({
        getFloorsInfo: { loading: false, data: floorsRes },
      });
    });

    it('it should return the GET_FLOORS_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_FLOORS_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        getFloorsInfo: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_SPACE_CHILDS', () => {
      expect(reducer(initialState, {
        type: actions.GET_SPACE_CHILDS,
      })).toEqual({
        spaceChilds: { loading: true },
      });
    });

    it('it should return the GET_SPACE_CHILDS_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_SPACE_CHILDS_SUCCESS,
        payload: {
          data: floorChildsRes, error: {}, length: 13, status: true,
        },
      })).toEqual({
        spaceChilds: { loading: false, data: floorChildsRes },
      });
    });

    it('it should return the GET_SPACE_CHILDS_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_SPACE_CHILDS_FAILURE,
        payload: errorRes,
      })).toEqual({
        spaceChilds: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_SPACE_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_SPACE_INFO,
      })).toEqual({
        getSpaceInfo: { loading: true },
      });
    });

    it('it should return the GET_SPACE_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_SPACE_INFO_SUCCESS,
        payload: {
          data: spaceRes, error: {}, length: 1, status: true,
        },
      })).toEqual({
        getSpaceInfo: { loading: false, data: spaceRes },
      });
    });

    it('it should return the GET_SPACE_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_SPACE_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        getSpaceInfo: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_ASSETS_DASHBOARD_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_ASSETS_DASHBOARD_INFO,
      })).toEqual({
        assetDashboard: { loading: true },
      });
    });

    it('it should return the GET_ASSETS_DASHBOARD_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_ASSETS_DASHBOARD_INFO_SUCCESS,
        payload: {
          data: dashboardRes, error: {}, length: 6, status: true,
        },
      })).toEqual({
        assetDashboard: { loading: false, data: dashboardRes },
      });
    });

    it('it should return the GET_ASSETS_DASHBOARD_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_ASSETS_DASHBOARD_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        assetDashboard: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_EXPIRY_ASSETS_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_EXPIRY_ASSETS_INFO,
      })).toEqual({
        expiryAssets: { loading: true },
      });
    });

    it('it should return the GET_EXPIRY_ASSETS_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_EXPIRY_ASSETS_INFO_SUCCESS,
        payload: {
          data: expirtyAssetsRes, error: {}, length: 2, status: true,
        },
      })).toEqual({
        expiryAssets: { loading: false, data: expirtyAssetsRes },
      });
    });

    it('it should return the GET_EXPIRY_ASSETS_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_EXPIRY_ASSETS_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        expiryAssets: { loading: false, err: errorRes },
      });
    });

    it('should handle Equipments List Action', () => {
      const company = 3;
      const limit = 10;
      const offset = 0;
      const states = [3, 5];
      const categories = [4, 5];
      const model = appModels.EQUIPMENT;

      // eslint-disable-next-line max-len
      const payload = `domain=[["company_id","in",[${company}]],["state","in",${JSON.stringify(states)}],["category_id","in",[${categories}]]&model=${model}&fields=["name","state","location_id","category_id","equipment_seq","maintenance_team_id"]&limit=${limit}&offset=${offset}`;

      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_EQUIPMENTS_INFO, actions.GET_EQUIPMENTS_INFO_SUCCESS, actions.GET_EQUIPMENTS_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getEquipmentsInfo(company, model, limit, offset, states, categories)).toEqual(expectedAction);
    });

    it('should handle Equipments Count Action', () => {
      const company = 3;
      const states = [3, 5];
      const categories = [4, 5];
      const model = appModels.EQUIPMENT;

      const payload = `domain=[["company_id","in",[${company}]],["state","in",${JSON.stringify(states)}],["category_id","in",[${categories}]]]&model=${model}&fields=["__count"]&groupby=[]`;

      const expectedAction = {
        [CALL_API]: {
          endpoint: `read_group?${payload}`,
          types: [actions.GET_EQUIPMENTS_COUNT, actions.GET_EQUIPMENTS_COUNT_SUCCESS, actions.GET_EQUIPMENTS_COUNT_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getEquipmentsCount(company, model, states, categories)).toEqual(expectedAction);
    });

    it('should handle Equipments Category Groups Action', () => {
      const company = 3;
      const model = appModels.EQUIPMENT;
      const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["category_id"]&groupby=["category_id"]`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `read_group?${payload}`,
          types: [actions.GET_CATEGORIES_GROUP_INFO, actions.GET_CATEGORIES_GROUP_INFO_SUCCESS, actions.GET_CATEGORIES_GROUP_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getCategoryGroupsInfo(company, model)).toEqual(expectedAction);
    });

    it('should handle Get Categories Action', () => {
      const company = 3;
      const model = appModels.EQUIPMENTCATEGORY;
      const keyword = 'F1';

      const payload = `domain=[["company_id","in",[${company}]],["name","ilike","${keyword}"]]&model=${model}&fields=["name"]&limit=10&offset=0`;

      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_CATEGORIES_INFO, actions.GET_CATEGORIES_INFO_SUCCESS, actions.GET_CATEGORIES_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getCategoryInfo(company, model, keyword)).toEqual(expectedAction);
    });

    it('should handle Get Teams Action', () => {
      const company = 3;
      const model = appModels.TEAM;
      const keyword = 'Service';
      const payload = `domain=[["company_id","in",[${company}]],["name","ilike","${keyword}"]]&model=${model}&fields=["name"]&limit=10&offset=0`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_TEAMS_INFO, actions.GET_TEAMS_INFO_SUCCESS, actions.GET_TEAMS_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getTeamInfo(company, model, keyword)).toEqual(expectedAction);
    });

    it('should handle Get Employees Action', () => {
      const company = 3;
      const model = appModels.USER;
      const keyword = 'Ela';
      const payload = `domain=[["company_id","in",[${company}]],["name","ilike","${keyword}"]]&model=${model}&fields=["name"]&limit=10&offset=0`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_EMPLOYESS_INFO, actions.GET_EMPLOYESS_INFO_SUCCESS, actions.GET_EMPLOYESS_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getEmployeeInfo(company, model, keyword)).toEqual(expectedAction);
    });

    it('should handle Create Equipment Action', () => {
      const formValues = mockData.equipmentFormValues;
      const expectedAction = {
        [CALL_API]: {
          endpoint: 'create/mro.equipment',
          types: [actions.CREATE_ASSET_INFO, actions.CREATE_ASSET_INFO_SUCCESS, actions.CREATE_ASSET_INFO_FAILURE],
          method: 'POST',
          payload: formValues,
        },
      };
      expect(actions.createAssetInfo(formValues)).toEqual(expectedAction);
    });

    it('should handle View Equipment Action', () => {
      const id = 3;
      const modelName = appModels.EQUIPMENT;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
          types: [actions.GET_ASSET_DETAILS, actions.GET_ASSET_DETAILS_SUCCESS, actions.GET_ASSET_DETAILS_FAILURE],
          method: 'GET',
          id,
        },
      };
      expect(actions.getAssetDetails(id, modelName)).toEqual(expectedAction);
    });

    it('should handle Get Floors Action', () => {
      const company = 3;
      const model = appModels.SPACE;
      const payload = `domain=[["company_id","in",[${company}]],["asset_category_id", "ilike", "Floor"]]&model=${model}&fields=["id","space_name"]&limit=100&offset=0`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_FLOORS_INFO, actions.GET_FLOORS_INFO_SUCCESS, actions.GET_FLOORS_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getFloorsInfo(company, model)).toEqual(expectedAction);
    });

    it('should handle Get Floor Childs Action', () => {
      const company = 3;
      const model = appModels.SPACE;
      const parentId = 1;
      const payload = `domain=[["company_id","in",[${company}]],["parent_id","=",${parentId}]]&model=${model}&fields=["id","name"]&limit=100&offset=0`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_SPACE_CHILDS, actions.GET_SPACE_CHILDS_SUCCESS, actions.GET_SPACE_CHILDS_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getSpaceChildsInfo(company, model, parentId)).toEqual(expectedAction);
    });

    it('should handle Get Space Details Action', () => {
      const id = 3;
      const model = appModels.SPACE;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `read/${model}?domain=[]&ids=[${id}]&fields=[]`,
          types: [actions.GET_SPACE_INFO, actions.GET_SPACE_INFO_SUCCESS, actions.GET_SPACE_INFO_FAILURE],
          method: 'GET',
          id,
        },
      };
      expect(actions.getSpaceInfo(model, id)).toEqual(expectedAction);
    });

    it('should handle Get Dashboard Details Action', () => {
      const start = `${getFirstDayofMonth()} 01:00:00`;
      const end = `${getLastDayofMonth()} 23:59:59`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `dashboard_data?filter=l_custom&start_time=${start}&end_time=${end}&name=Assets`,
          types: [actions.GET_ASSETS_DASHBOARD_INFO, actions.GET_ASSETS_DASHBOARD_INFO_SUCCESS, actions.GET_ASSETS_DASHBOARD_INFO_FAILURE],
          method: 'GET',
          start,
        },
      };
      expect(actions.getAssetDashboardInfo(start, end)).toEqual(expectedAction);
    });

    it('should handle Get Expiry Asset Details Action', () => {
      const model = appModels.SPACE;
      const company = 3;
      const start = getFirstDayofMonth();
      const end = getLastDayofMonth();
      let payload = `domain=[["company_id","in",[${company}]],["warranty_end_date",">=","${start}"],["warranty_end_date","<=","${end}"]]`;
      payload = `${payload}&model=${model}&fields=["id","name","warranty_end_date"]`;
      payload = `${payload}&limit=10&offset=0`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_EXPIRY_ASSETS_INFO, actions.GET_EXPIRY_ASSETS_INFO_SUCCESS, actions.GET_EXPIRY_ASSETS_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getExpiryAssetsInfo(start, end, company, model)).toEqual(expectedAction);
    });

    it('display error message on Equipments Failure', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          equipmentsInfo: { loading: false, err: 'Something went wrong' },
        },
        user: {
          userInfo: {},
        },
      }));

      render(
        <Router><Equipments /></Router>,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });

    it('display Loader on Equipments Loading', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          equipmentsInfo: { loading: true },
        },
        user: {
          userInfo: {},
        },
      }));

      render(
        <Router><Equipments /></Router>,
      );
      expect(screen.queryByTestId('loading-case')).toBeVisible();
    });

    it('display Equipments on Equipments Success', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          equipmentsInfo: { loading: false, data: listRes },
        },
        user: {
          userInfo: {},
        },
      }));

      render(
        <Router><Equipments /></Router>,
      );
      expect(screen.queryByTestId('success-case')).toBeVisible();
    });

    it('display error message on Equipment Details Failure', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          equipmentsDetails: { loading: false, err: 'Something went wrong' },
        },
      }));

      render(
        <Router><AssetDetailInfo /></Router>,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });

    it('display Loader on Equipment Details Loading', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          equipmentsDetails: { loading: true },
        },
      }));

      render(
        <Router><AssetDetailInfo /></Router>,
      );
      expect(screen.queryByTestId('loading-case')).toBeVisible();
    });

    it('display Equipment Details on Equipment Details Success', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          equipmentsDetails: { loading: false, data: equipmentRes },
        },
      }));

      render(
        <Router><AssetDetailInfo /></Router>,
      );
      expect(screen.queryByTestId('success-case')).toBeVisible();
    });

    it('display error message on Equipment Create Failure', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          addAssetInfo: { loading: false, err: 'Something went wrong' },
        },
      }));

      render(
        <Router><AssetSuccess /></Router>,
      );
      expect(screen.queryByTestId('error-case')).toBeVisible();
    });

    it('display Loader on Equipment Create Loading', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          addAssetInfo: { loading: true },
        },
      }));

      render(
        <Router><AssetSuccess /></Router>,
      );
      expect(screen.queryByTestId('loading-case')).toBeVisible();
    });

    it('display Success Message on Equipment Create Success', () => {
      useSelector.mockImplementation((fn) => fn({
        equipment: {
          addAssetInfo: { loading: false, data: [] },
        },
      }));

      render(
        <Router><AssetSuccess /></Router>,
      );
      expect(screen.queryByTestId('success-case')).toBeVisible();
    });
  });
});
