import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import {
  Tooltip,
} from '@mui/material';
import { AddThemeColor, DateFilterButtons } from '../../themes/theme';
import fieldInfoData from '../data/fieldInfo.json';

export function getDefinitonByLabel(value) {
  let res = '';
  if (fieldInfoData && fieldInfoData.definitionList[value]) {
    if (fieldInfoData.definitionList[value].label && fieldInfoData.definitionList[value].label !== '') {
      res += fieldInfoData.definitionList[value].label;
      res += ' - ';
    }
    res += fieldInfoData.definitionList[value].definition;
  }

  return res;
}

export function infoValue(fieldValue, fieldName) {
  if (getDefinitonByLabel(fieldValue) && getDefinitonByLabel(fieldValue) !== '') {
    if (fieldName) {
      return (
        <div>
          {fieldName}
          <Tooltip title={getDefinitonByLabel(fieldValue)} placement="right">
            <span className="ml-2">
              <InfoIcon style={{ color: AddThemeColor({}).color }} sx={{ fontSize: 15 }} />
            </span>
          </Tooltip>
        </div>
      );
    }
    return (
      <Tooltip title={getDefinitonByLabel(fieldValue)} placement="right">
        <span className="ml-2">
          <InfoIcon style={{ color: AddThemeColor({}).color }} sx={{ fontSize: 15 }} />
        </span>
      </Tooltip>
    );
  }
  return '';
}

export function editValue() {
  return (
    <Tooltip title="Double Click the cell to edit" placement="right">
      <span className="ml-2">
        <EditIcon style={{ color: AddThemeColor({}).color }} sx={{ fontSize: 15 }} />
      </span>
    </Tooltip>
  );
}

export function checkRequiredFields(array, module) {
  let result = false;
  const arrayNew = array.filter((item) => !item.isRemove);

  let nameCount = 0;
  let teamCategory = 0;
  let category = 0;
  let team = 0;
  if (module === 'teams') {
    for (let i = 0; i < arrayNew.length; i += 1) {
      if (arrayNew[i].name && arrayNew[i].name !== '') {
        nameCount += 1;
      }
      if (arrayNew[i].team_category_id && arrayNew[i].team_category_id !== '') {
        teamCategory += 1;
      }
    }
    result = nameCount === arrayNew.length && teamCategory === arrayNew.length;
  }
  if (module === 'assets') {
    for (let i = 0; i < arrayNew.length; i += 1) {
      if (arrayNew[i].name && arrayNew[i].name !== '') {
        nameCount += 1;
      }
      if (arrayNew[i].category_id && arrayNew[i].category_id !== '') {
        category += 1;
      }
      if (arrayNew[i].maintenance_team_id && arrayNew[i].maintenance_team_id !== '') {
        team += 1;
      }
    }
    result = nameCount === arrayNew.length && category === arrayNew.length && team === arrayNew.length;
  }
  if (module === 'Building' || module === 'Floor' || module === 'Wing' || module === 'Room' || module === 'Space') {
    for (let i = 0; i < arrayNew.length; i += 1) {
      if (arrayNew[i].space_name && arrayNew[i].space_name !== '') {
        nameCount += 1;
      }
    }
    result = nameCount === arrayNew.length;
  }
  return result;
}

export function addParents(data) {
  let children = [];
  const filterData = data && data.length ? data : [];
  if (filterData.length) {
    children = filterData.map((space) => (
      {
        id: space.id,
        name: space.space_name,
        space_name: space.space_name,
        childs: space.child_ids,
        parent_id: space.parent_id,
        type: space.asset_category_id ? space.asset_category_id[1] : '',
        typeId: space.asset_category_id ? space.asset_category_id[0] : '',
        err: space.error ? space.error : '',
        isLeaf: false,
      }));
  }
  return children;
}

export function addChildParents(data, category) {
  let children = [];
  let filterData = data && data.length ? data : [];
  if (category === 'Space' || category === 'Room') {
    filterData = filterData.filter(
      (item) => item?.space_category?.name !== 'Room' && item?.space_category?.name !== 'Space',
    );
  }
  if (category === 'Wing') {
    filterData = filterData.filter(
      (item) => item?.space_category?.name !== 'Wing' && item?.space_category?.name !== 'Room' && item?.space_category?.name !== 'Space',
    );
  }
  if (filterData.length) {
    children = filterData.map((space) => (
      {
        id: space.id,
        treeNodeId: `${space.id}`,
        name: space.name,
        children: addChildParents(space.child, category),
        space_name: space.name,
        childs: space.child,
        parent_id: space.parent && space.parent.id ? space.parent.id : '',
        isLeaf: false,
        type: space.space_category && space.space_category.name ? space.space_category.name : '',
        typeId: space.space_category && space.space_category.id ? space.space_category.id : '',
        err: space.error ? space.error : '',
      }));
  }
  return children;
}

export function addChildrensAll(parents, data, parentId, category) {
  const reDefinedData = parents;
  if (parentId) {
    const index = reDefinedData.findIndex((obj) => (obj.id === parentId));
    if ((reDefinedData[index]) && (!reDefinedData[index].parentId)) {
      reDefinedData[index].children = data?.length ? addChildParents(data, category) : undefined;
    }
  }
  return reDefinedData;
}

export function addChildrens(parents, data, parentId, category) {
  const reDefinedData = parents;
  if (parentId) {
    const index = reDefinedData.findIndex((obj) => (obj.id === parentId));
    if (category === 'Space') {
      const newData = data.filter((item) => item.asset_categ_type !== 'room' && item.asset_categ_type !== 'space');
      if ((reDefinedData[index]) && (!reDefinedData[index].parentId)) {
        reDefinedData[index].children = (newData);
      }
    } else if ((reDefinedData[index]) && (!reDefinedData[index].parentId)) {
      reDefinedData[index].children = (data);
    }
  }

  return reDefinedData;
}

export function checkMaintenanceRequiredFields(array, currentStepIndex) {
  let result = false;
  let subArrayResult = false;
  const arrayNew = array;

  let equipmentValue = 0;
  let spaceValue = 0;

  let startAt = 0;
  let duration = 0;
  const commences_on = 0;
  let maintenance_team_id = 0;
  let description = 0;
  let inspectionData = 0;
  let teamData = 0;
  let commenceOn = 0;

  let startOn = 0;
  let endsOn = 0;
  let schedule_period_id = 0;
  let maintenance_year_id = 0;
  let week = 0;
  let PPMData = 0;

  const operation = 0;
  let checklist = 0;
  if (currentStepIndex === 0) {
    for (let i = 0; i < arrayNew.length; i += 1) {
      if (arrayNew[i].equipmentValue && arrayNew[i].equipmentValue.length > 0) {
        equipmentValue += 1;
      }
      if (arrayNew[i].spaceValue && arrayNew[i].spaceValue.length > 0) {
        spaceValue += 1;
      }
      subArrayResult = equipmentValue === arrayNew.length || spaceValue === arrayNew.length;
      result = subArrayResult;
    }
    result = true;
  } else if (currentStepIndex === 1) {
    for (let i = 0; i < arrayNew.length; i += 1) {
      const type = arrayNew[i].typeValue;
      if (type && type.id === 'Inspection') {
        const scheduleData = arrayNew[i].inspectionData;
        const schedule = scheduleData && scheduleData.length && scheduleData.filter((item) => !item.isRemove);
        if (arrayNew[i].inspectionData && arrayNew[i].inspectionData.length > 0) {
          inspectionData += 1;
        }
        if (arrayNew[i].teamData && arrayNew[i].teamData !== '') {
          teamData += 1;
        }
        if (arrayNew[i].commenceOn && arrayNew[i].commenceOn !== '' && arrayNew[i].commenceOn !== null) {
          commenceOn += 1;
        }
        if (arrayNew[i].inspectionData && arrayNew[i].inspectionData.length > 0) {
          for (let j = 0; j < schedule.length; j += 1) {
            if (schedule[j].starts_at && schedule[j].starts_at !== '') {
              startAt += 1;
            }
            if (schedule[j].duration && schedule[j].duration !== '') {
              duration += 1;
            }
            /* if (schedule[j].commences_on && schedule[j].commences_on !== '' && schedule[j].commences_on !== null) {
              commences_on += 1;
            } */
            /* if (schedule[j].maintenance_team_id && schedule[j].maintenance_team_id !== '') {
              maintenance_team_id += 1;
            } */
            if (schedule[j].description && schedule[j].description !== '') {
              description += 1;
            }
          }
          subArrayResult = startAt === schedule.length
            && duration === schedule.length
            // && commences_on === schedule.length
            // && maintenance_team_id === schedule.length
            && description === schedule.length;
        }
      } else {
        const scheduleDataPPM = arrayNew[i].PPMData;
        const schedule = scheduleDataPPM && scheduleDataPPM.length && scheduleDataPPM.filter((item) => !item.isRemove);
        if (arrayNew[i].PPMData && arrayNew[i].PPMData.length > 0) {
          PPMData += 1;
        }
        if (arrayNew[i].PPMData && arrayNew[i].PPMData.length > 0) {
          for (let j = 0; j < schedule.length; j += 1) {
            if (schedule[j].starts_on && schedule[j].starts_on !== 'null') {
              startOn += 1;
            }
            if (schedule[j].ends_on && schedule[j].ends_on !== 'null') {
              endsOn += 1;
            }
            if (schedule[j].duration && schedule[j].duration !== '') {
              duration += 1;
            }
            if (schedule[j].maintenance_team_id && schedule[j].maintenance_team_id !== '') {
              maintenance_team_id += 1;
            }
            if (schedule[j].schedule_period_id && schedule[j].schedule_period_id !== '') {
              schedule_period_id += 1;
            }
            if (schedule[j].maintenance_year_id && schedule[j].maintenance_year_id !== '') {
              maintenance_year_id += 1;
            }
            if (schedule[j].week && schedule[j].week !== '') {
              week += 1;
            }
          }
          subArrayResult = startOn === schedule.length
            && endsOn === schedule.length
            && duration === schedule.length
            && week === schedule.length
            && schedule_period_id === schedule.length
            && maintenance_team_id === schedule.length
            && maintenance_year_id === schedule.length;
        }
      }
    }
    result = arrayNew[0].typeValue && arrayNew[0].typeValue.id === 'Inspection' ? subArrayResult && inspectionData === arrayNew.length && teamData === arrayNew.length && commenceOn === arrayNew.length : subArrayResult && PPMData === arrayNew.length;
  } else if (currentStepIndex === 2) {
    for (let i = 0; i < arrayNew.length; i += 1) {
      // if (arrayNew[i].operation && arrayNew[i].operation !== '') {
      //   operation += 1;
      // }
      if (arrayNew[i].checklistData && arrayNew[i].checklistData !== '') {
        checklist += 1;
      }
      // subArrayResult = operation === arrayNew.length && checklist === arrayNew.length;
      subArrayResult = checklist === arrayNew.length;
      result = subArrayResult;
    }
  } else if (currentStepIndex === 3) {
    result = true;
  }
  return result;
}

export function checkMaintenanceRequiredFieldsCombine(array, currentStepIndex) {
  let result = false;
  let subArrayResult = false;
  const arrayNew = array;

  let equipmentValue = 0;
  let spaceValue = 0;

  let startAt = 0;
  let duration = 0;
  const commences_on = 0;
  let maintenance_team_id = 0;
  let description = 0;
  let inspectionData = 0;
  let teamData = 0;
  let commenceOn = 0;

  let startOn = 0;
  let endsOn = 0;
  let schedule_period_id = 0;
  let maintenance_year_id = 0;
  let week = 0;
  let PPMData = 0;

  const operation = 0;
  let checklist = 0;
  if (currentStepIndex === 0) {
    for (let i = 0; i < arrayNew.length; i += 1) {
      if (arrayNew[i].equipmentValue && arrayNew[i].equipmentValue.length > 0) {
        equipmentValue += 1;
      }
      if (arrayNew[i].spaceValue && arrayNew[i].spaceValue.length > 0) {
        spaceValue += 1;
      }
      subArrayResult = equipmentValue === arrayNew.length || spaceValue === arrayNew.length;
      result = subArrayResult;
    }
    result = true;
  } else if (currentStepIndex === 1) {
    let cLength = false;
    for (let i = 0; i < arrayNew.length; i += 1) {
      const type = arrayNew[i].typeValue;
      if (arrayNew[i].checklistData && arrayNew[i].checklistData !== '') {
        checklist += 1;
      }
      // subArrayResult = operation === arrayNew.length && checklist === arrayNew.length;
      cLength = checklist === arrayNew.length;
      if (type && type.id === 'Inspection') {
        const scheduleData = arrayNew[i].inspectionData;
        const schedule = scheduleData && scheduleData.length && scheduleData.filter((item) => !item.isRemove);
        if (arrayNew[i].inspectionData && arrayNew[i].inspectionData.length > 0) {
          inspectionData += 1;
        }
        if (arrayNew[i].teamData && arrayNew[i].teamData !== '') {
          teamData += 1;
        }
        if (arrayNew[i].commenceOn && arrayNew[i].commenceOn !== '' && arrayNew[i].commenceOn !== null) {
          commenceOn += 1;
        }
        if (arrayNew[i].inspectionData && arrayNew[i].inspectionData.length > 0) {
          for (let j = 0; j < schedule.length; j += 1) {
            if (schedule[j].starts_at && schedule[j].starts_at !== '') {
              startAt += 1;
            }
            if (schedule[j].duration && schedule[j].duration !== '') {
              duration += 1;
            }
            /* if (schedule[j].commences_on && schedule[j].commences_on !== '' && schedule[j].commences_on !== null) {
              commences_on += 1;
            } */
            /* if (schedule[j].maintenance_team_id && schedule[j].maintenance_team_id !== '') {
              maintenance_team_id += 1;
            } */
            if (schedule[j].description && schedule[j].description !== '') {
              description += 1;
            }
          }
          subArrayResult = startAt === schedule.length
            && duration === schedule.length
            // && commences_on === schedule.length
            // && maintenance_team_id === schedule.length
            && description === schedule.length;
        }
      } else {
        const scheduleDataPPM = arrayNew[i].PPMData;
        const schedule = scheduleDataPPM && scheduleDataPPM.length && scheduleDataPPM.filter((item) => !item.isRemove);
        if (arrayNew[i].PPMData && arrayNew[i].PPMData.length > 0) {
          PPMData += 1;
        }
        if (arrayNew[i].PPMData && arrayNew[i].PPMData.length > 0) {
          for (let j = 0; j < schedule.length; j += 1) {
            if (schedule[j].starts_on && schedule[j].starts_on !== 'null') {
              startOn += 1;
            }
            if (schedule[j].ends_on && schedule[j].ends_on !== 'null') {
              endsOn += 1;
            }
            if (schedule[j].duration && schedule[j].duration !== '') {
              duration += 1;
            }
            if (schedule[j].maintenance_team_id && schedule[j].maintenance_team_id !== '') {
              maintenance_team_id += 1;
            }
            if (schedule[j].schedule_period_id && schedule[j].schedule_period_id !== '') {
              schedule_period_id += 1;
            }
            if (schedule[j].maintenance_year_id && schedule[j].maintenance_year_id !== '') {
              maintenance_year_id += 1;
            }
            if (schedule[j].week && schedule[j].week !== '') {
              week += 1;
            }
          }
          subArrayResult = startOn === schedule.length
            && endsOn === schedule.length
            && duration === schedule.length
            && week === schedule.length
            && schedule_period_id === schedule.length
            && maintenance_team_id === schedule.length
            && maintenance_year_id === schedule.length;
        }
      }
    }
    result = arrayNew[0].typeValue && arrayNew[0].typeValue.id === 'Inspection' ? subArrayResult && inspectionData === arrayNew.length && teamData === arrayNew.length && commenceOn === arrayNew.length && cLength : subArrayResult && PPMData === arrayNew.length && cLength;
  } else if (currentStepIndex === 2) {
    result = true;
  }
  return result;
}
