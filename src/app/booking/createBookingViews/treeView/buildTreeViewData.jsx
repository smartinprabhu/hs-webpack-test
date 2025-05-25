import uniqBy from 'lodash/uniqBy';
import union from 'lodash/union';
import { compareAsec, compareDesc } from '../../../util/appUtils';

function searchSpaces(data, selectedSpaceNameValue){
  let searchFilterData = [];
  if(selectedSpaceNameValue && selectedSpaceNameValue.length){
    data.map((key) => {
      if(key.space_name.toLowerCase().includes(selectedSpaceNameValue.toLowerCase())){
        searchFilterData.push(key);
      }
    });
  }
  return searchFilterData;
}

function addChildrensWithDsec(data, parentId, selectedSpaceNameValue, treeViewDataName) {
  let children = [];
  let filterData = data.filter((space) => space && space.parent && space.parent.id === parentId);
  let childData = filterData.filter((space) => space.is_parent === false);

  childData = childData.sort(compareDesc);
  filterData = uniqBy(union(childData, filterData), 'id')

  if (selectedSpaceNameValue && selectedSpaceNameValue.length >= 2 && !(treeViewDataName)) {
    filterData =  searchSpaces(data, selectedSpaceNameValue);
  }

  data.map((key) => {
    if (key.asset_categ_type === 'building') {
      let datas = _.remove(data, function (n) {
        return n.asset_categ_type === 'building';
      });
    }
  });

  if (filterData) {
    children = filterData.map((space) => (
      {
        id: space.id,
        treeNodeId: `${space.id}`,
        name: space.space_name,
        sort_sequence: space.asset_categ_type === "floor" ? space.sort_sequence : '',
        children: space.parent.id && addChildrensWithDsec(data, space.id),
        is_booking_allowed: space.availability_status,
        space_name: space.space_name,
        is_parent: space.is_parent,
        max_occupancy: space.max_occupancy,
        status: space.status === 'Ready' ? 'Ready to occupy' : space.status,
        path_name: space.path_name,
        space_number: space.space_number,
        isBookingAllowed: space.is_booking_allowed,
        spaceCategory: space.space_category,
        childCount: space.child_count,
        err: space.error ? space.error : '',
        bookings: space.bookings,
        shifts: space.shifts,
      }));
  }
  let sortFloors = children.sort((a, b) => (a.sort_sequence > b.sort_sequence ? -1 : 1));
  return children;
}


function addChildrensAsec(data, parentId, selectedSpaceNameValue, treeViewDataName) {
  let children = [];
  let filterData = data.filter((space) => space && space.parent && space.parent.id === parentId);
  let childData = filterData.filter((space) => space.is_parent === false);

  childData = childData.sort(compareAsec);
  filterData = uniqBy(union(childData, filterData), 'id')

  if (selectedSpaceNameValue && selectedSpaceNameValue.length >= 2 && !(treeViewDataName)) {
    filterData =  searchSpaces(data, selectedSpaceNameValue);
  }

  data.map((key) => {
    if (key.asset_categ_type === 'building') {
      let datas = _.remove(data, function (n) {
        return n.asset_categ_type === 'building';
      });
    }
  });

  if (filterData) {
    children = filterData.map((space) => (
      {
        id: space.id,
        treeNodeId: `${space.id}`,
        name: space.space_name,
        sort_sequence: space.asset_categ_type === "floor" ? space.sort_sequence : '',
        children: space.parent.id && addChildrensAsec(data, space.id),
        is_booking_allowed: space.availability_status,
        space_name: space.space_name,
        is_parent: space.is_parent,
        max_occupancy: space.max_occupancy,
        status: space.status === 'Ready' ? 'Ready to occupy' : space.status,
        path_name: space.path_name,
        space_number: space.space_number,
        isBookingAllowed: space.is_booking_allowed,
        spaceCategory: space.space_category,
        childCount: space.child_count,
        err: space.error ? space.error : '',
        bookings: space.bookings,
        shifts: space.shifts,
      }));
  }
  let sortFloors = children.sort((a, b) => (a.sort_sequence < b.sort_sequence ? -1 : 1));
  return children;
}

export function buildTreeViewData(workSpaces) {
  const treeViewData = {};
  const rootObject = workSpaces && workSpaces.length > 0 && workSpaces[0];
  treeViewData.treeNodeId = 'root';
  treeViewData.key = rootObject && rootObject.id;
  treeViewData.name = rootObject && rootObject.space_name;
  treeViewData.is_parent = rootObject && rootObject.is_parent;
  treeViewData.id = rootObject && rootObject.id;
  if (rootObject && rootObject.id) treeViewData.children = addChildrens(workSpaces, rootObject.id);
  return treeViewData;
}

export function buildTreeViewObj(workSpaces, rootObj, selectedSpaceNameValue, sortingAsec, sortingDsec,) {
  let treeViewData = {};
  let treeViewBookingData = [];
  let treeViewDataName = false;
  const rootObject = rootObj && rootObj.filters && rootObj.filters.building_space;
  treeViewData.treeNodeId = 'root';
  treeViewData.key = rootObject && rootObject.id;
  treeViewData.name = rootObject && rootObject.name;
  treeViewData.is_parent = true;
  treeViewData.id = rootObject && rootObject.id;
  if (selectedSpaceNameValue && selectedSpaceNameValue.length >= 2) {
    treeViewBookingData = searchSpaces(workSpaces, selectedSpaceNameValue);
  }
  treeViewDataName = treeViewData.name.toLowerCase().includes(selectedSpaceNameValue && selectedSpaceNameValue.length ? selectedSpaceNameValue.toLowerCase() : selectedSpaceNameValue)
  if (rootObject && rootObject.id && sortingAsec) {
    treeViewData.children = addChildrensAsec(workSpaces, rootObject.id, selectedSpaceNameValue, treeViewDataName);
  } else if (rootObject && rootObject.id && sortingDsec) {
    treeViewData.children = addChildrensWithDsec(workSpaces, rootObject.id, selectedSpaceNameValue, treeViewDataName);
  } else if (rootObject && rootObject.id && !(sortingAsec && sortingDsec)) {
    treeViewData.children = addChildrensAsec(workSpaces, rootObject.id, selectedSpaceNameValue, treeViewDataName);
  }
  if (selectedSpaceNameValue && selectedSpaceNameValue.length && !(treeViewBookingData && treeViewBookingData.length) && !(treeViewData.name.toLowerCase().includes(selectedSpaceNameValue ? selectedSpaceNameValue.toLowerCase() : selectedSpaceNameValue))) {
    return null;
  } else {
    return treeViewData;
  }
}

export function getSpaceFromNodeId(workSpaces, nodeId) {
  const selectedSpace = workSpaces.find((s) => s.id === Number(nodeId));
  return selectedSpace || {};
}