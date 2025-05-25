/* eslint-disable linebreak-style */
const initialState = {
  spaceChilds: {},
  floorView: {},
  updateFloor: {},
  employeeList: {},
  updateSpace: {},
  spaceCategory: {},
  spaceFilters: {},
  spaceSelected: {},
  updateSpaceInfo: {},
  bulkDraggableSpaces: {},
  isDiscard: false,
  isUpdateSpaces: false,
  categoryInfo: false,
  updateDrag: false,
  popoverSpace: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_FLOORS_VIEW_INFO':
      return {
        ...state,
        floorView: (state.floorView, { loading: true, data: null, err: null }),
      };
    case 'GET_FLOORS_VIEW_SUCCESS':
      return {
        ...state,
        floorView: (state.floorView, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_FLOORS_VIEW_FAILURE':
      return {
        ...state,
        floorView: (state.floorView, { loading: false, err: action.error, data: null }),
      };
    case 'CLEAR_DROPDOWN_DATAS':
      return {
        ...state,
        floorView: (state.floorView, { loading: true, err: null, data: null }),
      };
    case 'GET_FLOORS_CHILD_INFO':
      return {
        ...state,
        spaceChilds: (state.spaceChilds, { loading: true, data: null, err: null }),
        updateSpace: (state.updateSpace, { loading: false }),
      };
    case 'GET_FLOORS_CHILD_SUCCESS':
      return {
        ...state,
        spaceChilds: (state.spaceChilds, { loading: false, data: action.payload.data, err: null }),
      };
    case 'GET_FLOORS_CHILD_FAILURE':
      return {
        ...state,
        spaceChilds: (state.spaceChilds, { loading: false, err: action.error, data: [] }),
      };
    case 'GET_EMPLOYEE_INFO':
      return {
        ...state,
        employeeList: (state.employeeList, { loading: true, data: null, err: null }),
      };
    case 'GET_EMPLOYEE_INFO_SUCCESS':
      return {
        ...state,
        employeeList: (state.employeeList,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'GET_EMPLOYEE_INFO_FAILURE':
      return {
        ...state,
        employeeList: (state.employeeList, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_FLOOR_MAP':
      return {
        ...state,
        updateFloor: (state.updateFloor, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_FLOOR_MAP_SUCCESS':
      return {
        ...state,
        updateFloor: (state.updateFloor, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_FLOOR_MAP_FAILURE':
      return {
        ...state,
        updateFloor: (state.updateFloor, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_SPACE_INFO':
      return {
        ...state,
        updateSpace: (state.updateSpace, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_SPACE_INFO_SUCCESS':
      return {
        ...state,
        updateSpace: (state.updateSpace, { loading: false, data: action.payload.data, err: null }),
      };
    case 'UPDATE_SPACE_INFO_FAILURE':
      return {
        ...state,
        updateSpace: (state.updateSpace, { loading: false, err: action.error, data: null }),
      };
    case 'UPDATE_SPACES_INFO':
      return {
        ...state,
        updateSpaceInfo: (state.updateSpaceInfo, { loading: true, data: null, err: null }),
      };
    case 'UPDATE_SPACES_SUCCESS':
      return {
        ...state,
        updateSpaceInfo: (state.updateSpaceInfo,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'UPDATE_SPACES_FAILURE':
      return {
        ...state,
        updateSpaceInfo: (state.updateSpaceInfo,
        {
          loading: false, err: action.error.data, data: null,
        }),
      };
    case 'RESET_DATA':
      return {
        ...state,
        updateSpaceInfo: (state.updateSpaceInfo, { loading: null, data: null, err: null }),
      };
    case 'GET_SPACE_CATEGORY_INFO':
      return {
        ...state,
        spaceCategory: (state.spaceCategory, { loading: true, data: null, err: null }),
      };
    case 'GET_SPACE_CATEGORY_SUCCESS':
      return {
        ...state,
        spaceCategory: (state.spaceCategory,
        {
          loading: false, data: action.payload.data, err: null,
        }),
      };
    case 'GET_SPACE_CATEGORY_FAILURE':
      return {
        ...state,
        spaceCategory: (state.spaceCategory, { loading: false, err: action.error, data: null }),
      };
    case 'SPACE_FILTERS':
      return {
        ...state,
        spaceFilters: (state.spaceFilters, action.payload),
      };
    case 'SPACE_SELECT':
      return {
        ...state,
        spaceSelected: (state.spaceSelected, action.payload),
      };
    case 'BULK_DRAGGABLE_SPACES':
      return {
        ...state,
        bulkDraggableSpaces: (state.bulkDraggableSpaces, action.payload),
      };
    case 'BULK_DISCARD_DATA':
      return {
        ...state,
        isDiscard: (state.errorMessage, action.payload),
      };
    case 'BULK_UPDATE_SPACES':
      return {
        ...state,
        isUpdateSpaces: (state.isUpdateSpaces, action.payload),
      };
    case 'UPDATE_DRAG_SPACE':
      return {
        ...state,
        updateDragSpaces: (state.updateDragSpaces, action.payload),
      };
    case 'POPOVER_OPEN_WINDOW':
      return {
        ...state,
        popoverSpace: (state.popoverSpace, action.payload),
      };
    case 'SET_CATEG':
      return {
        ...state,
        categoryInfo: (state.categoryInfo, action.payload),
      };
    case 'CLEAR_UPDATE_MAP_DATA':
      return {
        ...state,
        updateFloor: (state.floorView, { loading: null, data: null, err: null }),
      }
    default:
      return state;
  }
}

export default reducer;
