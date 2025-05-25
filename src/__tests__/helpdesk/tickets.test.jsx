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
import Tickets from '../../app/helpdesk/tickets';
import BasicInfo from '../../app/helpdesk/viewTicket/basicInfo';
import TicketSuccess from '../../app/helpdesk/ticketSuccess/ticketSuccess';
import * as actions from '../../app/helpdesk/actions';
import * as services from '../../app/helpdesk/ticketService';
import reducer from '../../app/helpdesk/reducer';
import mockData from './mockData.json';

const appModels = require('../../app/util/appModels').default;

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

describe('tickets testing', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('tickets snapshots', () => {
    it('tickets testing', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          ticketsInfo: {},
        },
        user: {
          userInfo: {},
        },
      }));
      const { asFragment } = render(
        <Router><Tickets /></Router>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('ticket actions, reducers', () => {
    const initialState = {};

    it('should return the initial state', () => {
      expect(reducer(initialState, {})).toEqual(initialState);
    });

    const errorRes = mockData.errorResponse;
    const countRes = mockData.ticketCountResponse;
    const listRes = mockData.ticketListResponse;
    const categoryRes = mockData.categoryResponse;
    const stateRes = mockData.statesResponse;
    const priorityRes = mockData.priorityResponse;
    const ticketData = mockData.ticketDetails;
    const spacesRes = mockData.ticketSpaces;
    const categoriesRes = mockData.ticketCategories;
    const subCategoriesRes = mockData.ticketSubCategories;
    const equipmentsRes = mockData.ticketEquipments;

    it('it should return the GET_TICKETS_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_TICKETS_INFO,
      })).toEqual({
        ticketsInfo: { loading: true },
      });
    });

    it('it should return the GET_TICKETS_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_TICKETS_INFO_SUCCESS,
        payload: {
          data: listRes, error: {}, length: 10, status: true, status_code: 200,
        },
      })).toEqual({
        ticketsInfo: { loading: false, data: listRes },
      });
    });

    it('it should return the GET_TICKETS_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_TICKETS_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        ticketsInfo: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_TICKETS_COUNT', () => {
      expect(reducer(initialState, {
        type: actions.GET_TICKETS_COUNT,
      })).toEqual({
        ticketCountLoading: true,
      });
    });

    it('it should return the GET_TICKETS_COUNT_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_TICKETS_COUNT_SUCCESS,
        payload: {
          data: countRes, error: {}, length: 1, status: true,
        },
      })).toEqual({
        ticketsCount: countRes,
        ticketCountLoading: false,
      });
    });

    it('it should return the GET_TICKETS_COUNT_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_TICKETS_COUNT_FAILURE,
        payload: errorRes,
      })).toEqual({
        ticketsCountErr: errorRes,
        ticketCountLoading: false,
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
          data: categoryRes, error: {}, length: 35, status: true,
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

    it('it should return the GET_STATES_GROUP_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_STATES_GROUP_INFO,
      })).toEqual({
        stateGroupsInfo: { loading: true },
      });
    });

    it('it should return the GET_STATES_GROUP_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_STATES_GROUP_INFO_SUCCESS,
        payload: {
          data: stateRes, error: {}, length: 10, status: true,
        },
      })).toEqual({
        stateGroupsInfo: { loading: false, data: stateRes },
      });
    });

    it('it should return the GET_STATES_GROUP_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_STATES_GROUP_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        stateGroupsInfo: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_PRIORITIES_GROUP_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_PRIORITIES_GROUP_INFO,
      })).toEqual({
        priorityGroupsInfo: { loading: true },
      });
    });

    it('it should return the GET_PRIORITIES_GROUP_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_PRIORITIES_GROUP_INFO_SUCCESS,
        payload: {
          data: priorityRes, error: {}, length: 6, status: true,
        },
      })).toEqual({
        priorityGroupsInfo: { loading: false, data: priorityRes },
      });
    });

    it('it should return the GET_PRIORITIES_GROUP_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_PRIORITIES_GROUP_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        priorityGroupsInfo: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_TICKET_DETAILS_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_TICKET_DETAILS_INFO,
      })).toEqual({
        ticketDetail: { loading: true },
      });
    });

    it('it should return the GET_TICKET_DETAILS_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_TICKET_DETAILS_INFO_SUCCESS,
        payload: {
          data: ticketData, error: {}, length: 1, status: true,
        },
      })).toEqual({
        ticketDetail: { loading: false, data: ticketData },
      });
    });

    it('it should return the GET_TICKET_DETAILS_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_TICKET_DETAILS_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        ticketDetail: { loading: false, err: errorRes },
      });
    });

    it('it should return the GET_SPACES_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_SPACES_INFO,
      })).toEqual({
        loading: true,
      });
    });

    it('it should return the GET_SPACES_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_SPACES_INFO_SUCCESS,
        payload: {
          data: spacesRes, error: {}, length: 10, status: true,
        },
      })).toEqual({
        spacesInfo: {
          data: spacesRes, error: {}, length: 10, status: true,
        },
        loading: false,
      });
    });

    it('it should return the GET_SPACES_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_SPACES_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        spacesErr: errorRes,
        loading: false,
      });
    });

    it('it should return the GET_CATEGORY_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_CATEGORY_INFO,
      })).toEqual({
        loading: true,
      });
    });

    it('it should return the GET_CATEGORY_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_CATEGORY_INFO_SUCCESS,
        payload: {
          data: categoriesRes, error: {}, length: 10, status: true,
        },
      })).toEqual({
        categoryInfo: {
          data: categoriesRes, error: {}, length: 10, status: true,
        },
        loading: false,
      });
    });

    it('it should return the GET_CATEGORY_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_CATEGORY_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        categoryErr: errorRes,
        loading: false,
      });
    });

    it('it should return the GET_SUBCATEGORY_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_SUBCATEGORY_INFO,
      })).toEqual({
        loading: true,
      });
    });

    it('it should return the GET_SUBCATEGORY_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_SUBCATEGORY_INFO_SUCCESS,
        payload: {
          data: subCategoriesRes, error: {}, length: 3, status: true,
        },
      })).toEqual({
        subCategoryInfo: {
          data: subCategoriesRes, error: {}, length: 3, status: true,
        },
        loading: false,
      });
    });

    it('it should return the GET_SUBCATEGORY_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_SUBCATEGORY_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        subCategoryErr: errorRes,
        loading: false,
      });
    });

    it('it should return the GET_EQUIPMENT_INFO', () => {
      expect(reducer(initialState, {
        type: actions.GET_EQUIPMENT_INFO,
      })).toEqual({
        loading: true,
      });
    });

    it('it should return the GET_EQUIPMENT_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.GET_EQUIPMENT_INFO_SUCCESS,
        payload: {
          data: equipmentsRes, error: {}, length: 10, status: true,
        },
      })).toEqual({
        equipmentInfo: {
          data: equipmentsRes, error: {}, length: 10, status: true,
        },
        loading: false,
      });
    });

    it('it should return the GET_EQUIPMENT_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.GET_EQUIPMENT_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        equipmentErr: errorRes,
        loading: false,
      });
    });

    it('it should return the CREATE_TICKET_INFO', () => {
      expect(reducer(initialState, {
        type: actions.CREATE_TICKET_INFO,
      })).toEqual({
        addTicketInfo: { loading: true, err: null },
      });
    });

    it('it should return the CREATE_TICKET_INFO_SUCCESS', () => {
      expect(reducer(initialState, {
        type: actions.CREATE_TICKET_INFO_SUCCESS,
        payload: {
          data: [], error: {}, length: 1, status: true,
        },
      })).toEqual({
        addTicketInfo: { loading: false, data: [] },
      });
    });

    it('it should return the CREATE_TICKET_INFO_FAILURE', () => {
      expect(reducer(initialState, {
        type: actions.CREATE_TICKET_INFO_FAILURE,
        payload: errorRes,
      })).toEqual({
        addTicketInfo: { loading: false, err: errorRes },
      });
    });

    it('should handle Tickets List Action', () => {
      const company = 3;
      const limit = 10;
      const offset = 0;
      const states = [3, 5];
      const categories = [4, 5];
      const priorities = [7, 8];
      const model = appModels.HELPDESK;

      let payload = `domain=[["company_id","in",[${company}]]`;
      payload = `${payload},["state_id","in",[${states}]]`;
      payload = `${payload},["category_id","in",[${categories}]]`;
      payload = `${payload},["priority_id","in",[${priorities}]]`;
      payload = `${payload}]&model=${model}`;
      payload = `${payload}&fields=["ticket_number","subject","priority_id","category_id","description",`;
      payload = `${payload}"equipment_location_id","state_id","create_date","sla_active","maintenance_team_id","sla_timer","close_date","sla_time","sla_status","sla_end_date","close_time"]`;
      payload = `${payload}&limit=${limit}&offset=${offset}`;

      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_TICKETS_INFO, actions.GET_TICKETS_INFO_SUCCESS, actions.GET_TICKETS_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getTicketsInfo(company, model, limit, offset, states, categories, priorities)).toEqual(expectedAction);
    });

    it('it should mock the Tickets List service', () => {
      const company = 3;
      const limit = 10;
      const offset = 0;
      const states = [3, 5];
      const categories = [4, 5];
      const priorities = [7, 8];
      const model = appModels.HELPDESK;
      const serviceMock = jest.spyOn(services, 'getTicketList');
      services.getTicketList(company, model, limit, offset, states, categories, priorities);
      expect(serviceMock).toHaveBeenCalledWith(company, model, limit, offset, states, categories, priorities);
    });

    it('should handle Tickets Count Action', () => {
      const company = 3;
      const states = [3, 5];
      const categories = [4, 5];
      const priorities = [7, 8];
      const model = appModels.HELPDESK;

      let payload = `domain=[["company_id","in",[${company}]]`;
      payload = `${payload},["state_id","in",[${states}]]`;
      payload = `${payload},["category_id","in",[${categories}]]`;
      payload = `${payload},["priority_id","in",[${priorities}]]`;
      payload = `${payload}]&model=${model}&fields=["__count"]&groupby=[]`;

      const expectedAction = {
        [CALL_API]: {
          endpoint: `read_group?${payload}`,
          types: [actions.GET_TICKETS_COUNT, actions.GET_TICKETS_COUNT_SUCCESS, actions.GET_TICKETS_COUNT_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getTicketsCount(company, model, states, categories, priorities)).toEqual(expectedAction);
    });

    it('it should mock the Tickets Count service', () => {
      const company = 3;
      const states = [3, 5];
      const categories = [4, 5];
      const priorities = [7, 8];
      const model = appModels.HELPDESK;
      const serviceMock = jest.spyOn(services, 'getTicketCount');
      services.getTicketCount(company, model, states, categories, priorities);
      expect(serviceMock).toHaveBeenCalledWith(company, model, states, categories, priorities);
    });

    it('should handle Tickets Category Groups Action', () => {
      const company = 3;
      const model = appModels.HELPDESK;
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

    it('it should mock the Tickets Category Groups service', () => {
      const company = 3;
      const model = appModels.HELPDESK;
      const serviceMock = jest.spyOn(services, 'getCategoryGroups');
      services.getCategoryGroups(company, model);
      expect(serviceMock).toHaveBeenCalledWith(company, model);
    });

    it('should handle Tickets Prorities Groups Action', () => {
      const company = 3;
      const model = appModels.HELPDESK;
      const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["priority_id"]&groupby=["priority_id"]`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `read_group?${payload}`,
          types: [actions.GET_PRIORITIES_GROUP_INFO, actions.GET_PRIORITIES_GROUP_INFO_SUCCESS, actions.GET_PRIORITIES_GROUP_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getPriorityGroupsInfo(company, model)).toEqual(expectedAction);
    });

    it('it should mock the Tickets Prorities Groups service', () => {
      const company = 3;
      const model = appModels.HELPDESK;
      const serviceMock = jest.spyOn(services, 'getPriorityGroups');
      services.getPriorityGroups(company, model);
      expect(serviceMock).toHaveBeenCalledWith(company, model);
    });

    it('should handle View Ticket Action', () => {
      const id = 3;
      const modelName = appModels.HELPDESK;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `read/${modelName}?ids=[${id}]&fields=[]`,
          types: [actions.GET_TICKET_DETAILS_INFO, actions.GET_TICKET_DETAILS_INFO_SUCCESS, actions.GET_TICKET_DETAILS_INFO_FAILURE],
          method: 'GET',
          id,
        },
      };
      expect(actions.getTicketData(id, modelName)).toEqual(expectedAction);
    });

    it('it should mock the View Ticket service', () => {
      const id = 3;
      const modelName = appModels.HELPDESK;
      const serviceMock = jest.spyOn(services, 'getTicketDetail');
      services.getTicketDetail(id, modelName);
      expect(serviceMock).toHaveBeenCalledWith(id, modelName);
    });

    it('should handle Tickets States Groups Action', () => {
      const company = 3;
      const model = appModels.HELPDESK;
      const payload = `domain=[["company_id","in",[${company}]]]&model=${model}&fields=["state_id"]&groupby=["state_id"]`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `read_group?${payload}`,
          types: [actions.GET_STATES_GROUP_INFO, actions.GET_STATES_GROUP_INFO_SUCCESS, actions.GET_STATES_GROUP_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getStateGroupsInfo(company, model)).toEqual(expectedAction);
    });

    it('it should mock the Tickets States Groups service', () => {
      const company = 3;
      const model = appModels.HELPDESK;
      const serviceMock = jest.spyOn(services, 'getStateGroups');
      services.getStateGroups(company, model);
      expect(serviceMock).toHaveBeenCalledWith(company, model);
    });

    it('should handle Get Spaces Action', () => {
      const company = 3;
      const model = appModels.SPACE;
      const keyword = 'F1';
      let payload = `domain=[["company_id","in",[${company}]]`;
      payload = `${payload},["path_name","ilike","${keyword}"]`;
      payload = `${payload}]&model=${model}&fields=["path_name"]&limit=10&offset=0`;

      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_SPACES_INFO, actions.GET_SPACES_INFO_SUCCESS, actions.GET_SPACES_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getSpacesInfo(company, model, keyword)).toEqual(expectedAction);
    });

    it('it should mock the Get Spaces service', () => {
      const company = 3;
      const model = appModels.SPACE;
      const keyword = 'F1';
      const serviceMock = jest.spyOn(services, 'getSpacesList');
      services.getSpacesList(company, model, keyword);
      expect(serviceMock).toHaveBeenCalledWith(company, model, keyword);
    });

    it('should handle Get Equipments Action', () => {
      const company = 3;
      const model = appModels.EQUIPMENT;
      const keyword = 'Chiller';
      let payload = `domain=[["company_id","in",[${company}]]`;
      payload = `${payload},["name","ilike","${keyword}"]`;
      payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0`;

      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_EQUIPMENT_INFO, actions.GET_EQUIPMENT_INFO_SUCCESS, actions.GET_EQUIPMENT_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getEquipmentInfo(company, model, keyword)).toEqual(expectedAction);
    });

    it('it should mock the Get Equipments service', () => {
      const company = 3;
      const model = appModels.EQUIPMENT;
      const keyword = 'Chiller';
      const serviceMock = jest.spyOn(services, 'getEquipmentList');
      services.getEquipmentList(company, model, keyword);
      expect(serviceMock).toHaveBeenCalledWith(company, model, keyword);
    });

    it('should handle Get Categories Action', () => {
      const company = 3;
      const model = appModels.TICKETCATEGORY;
      const keyword = 'Tank';
      let payload = `domain=[["company_id","in",[${company}]]`;
      payload = `${payload},["name","ilike","${keyword}"]`;
      payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0`;
      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_CATEGORY_INFO, actions.GET_CATEGORY_INFO_SUCCESS, actions.GET_CATEGORY_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getCategoryInfo(company, model, keyword)).toEqual(expectedAction);
    });

    it('it should mock the Get Categories service', () => {
      const company = 3;
      const model = appModels.TICKETCATEGORY;
      const keyword = 'Tank';
      const serviceMock = jest.spyOn(services, 'getCategoryList');
      services.getCategoryList(company, model, keyword);
      expect(serviceMock).toHaveBeenCalledWith(company, model, keyword);
    });

    it('should handle Get Subcategories Action', () => {
      const company = 3;
      const model = appModels.TICKETSUBCATEGORY;
      const category = 1;
      const keyword = 'Tank';
      let payload = `domain=[["company_id","in",[${company}]],["parent_category_id", "=", ${category}]`;
      payload = `${payload},["name","ilike","${keyword}"]`;
      payload = `${payload}]&model=${model}&fields=["name"]&limit=10&offset=0`;

      const expectedAction = {
        [CALL_API]: {
          endpoint: `search_read?${payload}`,
          types: [actions.GET_SUBCATEGORY_INFO, actions.GET_SUBCATEGORY_INFO_SUCCESS, actions.GET_SUBCATEGORY_INFO_FAILURE],
          method: 'GET',
          payload,
        },
      };
      expect(actions.getSubCategoryInfo(company, model, category, keyword)).toEqual(expectedAction);
    });

    it('it should mock the Get Subcategories service', () => {
      const company = 3;
      const model = appModels.TICKETSUBCATEGORY;
      const category = 1;
      const keyword = 'Tank';
      const serviceMock = jest.spyOn(services, 'getSubCategoryList');
      services.getSubCategoryList(company, model, category, keyword);
      expect(serviceMock).toHaveBeenCalledWith(company, model, category, keyword);
    });

    it('should handle Create Ticket Action', () => {
      const formValues = mockData.ticketFormValues;
      const expectedAction = {
        [CALL_API]: {
          endpoint: 'create/website.support.ticket',
          types: [actions.CREATE_TICKET_INFO, actions.CREATE_TICKET_INFO_SUCCESS, actions.CREATE_TICKET_INFO_FAILURE],
          method: 'POST',
          payload: formValues,
        },
      };
      expect(actions.addTicketInfo(formValues)).toEqual(expectedAction);
    });

    it('it should mock the Create Ticket service', () => {
      const formValues = mockData.ticketFormValues;
      const serviceMock = jest.spyOn(services, 'createTicket');
      services.createTicket(formValues);
      expect(serviceMock).toHaveBeenCalledWith(formValues);
    });

    it('display error message on Tickets Failure', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          ticketsInfo: { loading: false, err: 'Something went wrong' },
        },
        user: {
          userInfo: {},
        },
      }));

      render(
        <Router><Tickets /></Router>,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });

    it('display Loader on Tickets Loading', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          ticketsInfo: { loading: true },
        },
        user: {
          userInfo: {},
        },
      }));

      render(
        <Router><Tickets /></Router>,
      );
      expect(screen.queryByTestId('loading-case')).toBeVisible();
    });

    it('display Tickets on Tickets Success', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          ticketsInfo: { loading: false, data: listRes },
        },
        user: {
          userInfo: {},
        },
      }));

      render(
        <Router><Tickets /></Router>,
      );
      expect(screen.queryByTestId('success-case')).toBeVisible();
    });

    it('display Ticket Details on Ticket View Success', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          ticketDetail: { loading: false, data: ticketData },
        },
      }));

      render(
        <Router><BasicInfo /></Router>,
      );
      expect(screen.queryByTestId('success-case')).toBeVisible();
    });

    it('display error message on Ticket Details Failure', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          ticketDetail: { loading: false, err: 'Something went wrong' },
        },
      }));

      render(
        <Router><BasicInfo /></Router>,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });

    it('display Loader on Ticket Details Loading', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          ticketDetail: { loading: true },
        },
      }));

      render(
        <Router><BasicInfo /></Router>,
      );
      expect(screen.queryByTestId('loading-case')).toBeVisible();
    });

    it('display Success Message on Ticket Create Success', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          addTicketInfo: { loading: false, data: [] },
        },
      }));

      render(
        <Router><TicketSuccess /></Router>,
      );
      expect(screen.queryByTestId('success-case')).toBeVisible();
    });

    it('display error message on Ticket Create Failure', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          addTicketInfo: { loading: false, err: 'Something went wrong' },
        },
      }));

      render(
        <Router><TicketSuccess /></Router>,
      );
      expect(screen.queryByTestId('error-case')).toBeVisible();
    });

    it('display Loader on Ticket Create Loading', () => {
      useSelector.mockImplementation((fn) => fn({
        ticket: {
          addTicketInfo: { loading: true },
        },
      }));

      render(
        <Router><TicketSuccess /></Router>,
      );
      expect(screen.queryByTestId('loading-case')).toBeVisible();
    });
  });
});
