const appConfig = require('../../config/appConfig').default;

export function getUnAllocatedSpaces(subarray, array) {
  const columnUnallocate = [];
  const child = array;

  const subId = subarray && subarray.length > 0 ? subarray[0].id : '';
  const subImage = subarray && subarray.length > 0 ? subarray[0].file_path : '';
  if (array && array.length > 0) {
    for (let i = 0; i < child.length; i += 1) {
      const subType1 = child[i].asset_category_id[0];
      if (child[i].latitude === false || child[i].latitude === '0') {
        if (subType1 === subId) {
          child[i].latitude = '0';
          child[i].longitude = '0';
          child[i].imgready = `${window.location.origin}${subImage}`;
          child[i].imgbooked = `${window.location.origin}${subImage}`;
          child[i].imgmaintain = `${window.location.origin}${subImage}`;
          child[i].imgempty = `${window.location.origin}${subImage}`;
          child[i].imgheight = '40px';
          child[i].imgwidth = '40px';
          columnUnallocate.push(child[i]);
        }
      }
    }
  }
  return columnUnallocate; // return column data..
}
export function getAllocatedSpacesById(subId, array) {
  const column = [];
  const child = array;
  if (array && array.length > 0) {
    for (let i = 0; i < child.length; i += 1) {
      const subType1 = child[i].asset_category_id[0];
      if (child[i].latitude !== '' && child[i].latitude !== false && child[i].latitude !== '0') {
        if (subType1 === subId) {
          child[i].latitude = '0';
          child[i].longitude = '0';
          child[i].imgready = '@images/cready.svg';
          child[i].imgbooked = '@images/cbooked.svg';
          child[i].imgmaintain = '@images/cmaintanence.svg';
          child[i].imgempty = '@images/cempty.svg';
          child[i].imgheight = '40px';
          child[i].imgwidth = '40px';
          column.push(child[i]);
        }
      }
    }
  }
  return column; // return column data..
}

const apiURL= localStorage.getItem('api-url');

export function getAllocatedSpaces(categoryArray, array) {
  const columnAllocate = [];
  const allocat = array;
  if (array && array.length > 0 && categoryArray && categoryArray.length > 0) {
    for (let j = 0; j < categoryArray.length; j += 1) {
      const subType = categoryArray[j].id;
      const subImage = categoryArray[j].file_path ? categoryArray[j].file_path : '';
      for (let i = 0; i < allocat.length; i += 1) {
        const subId = allocat[i].asset_category_id[0];
        if (subId === subType && allocat[i].latitude !== '' && allocat[i].latitude !== false && allocat[i].latitude !== '0') {
          allocat[i].imgready = `${apiURL}${subImage}`;
          allocat[i].imgbooked = `${apiURL}${subImage}`;
          allocat[i].imgmaintain = `${apiURL}${subImage}`;
          allocat[i].imgempty = `${apiURL}${subImage}`;
          allocat[i].imgheight = '30px';
          allocat[i].imgwidth = '30px';
          columnAllocate.push(allocat[i]);
        }
      }
    }
  }
  return columnAllocate; // return column data..
}

export function getTotalCount(id, array) {
  const allocat = array;
  let count = 0;
  if (array && array.length > 0) {
    for (let i = 0; i < allocat.length; i += 1) {
      const subId = allocat[i].asset_category_id[0];
      if (subId === id) {
        count += 1;
      }
    }
  }
  return count; // return column data..
}
export function getAssigned(id, array) {
  const allocat = array;
  let count = 0;
  if (array && array.length > 0) {
    for (let i = 0; i < allocat.length; i += 1) {
      const subId = allocat[i].asset_category_id[0];
      if (subId === id && allocat[i].latitude !== '' && allocat[i].latitude !== false && allocat[i].latitude !== '0') {
        count += 1;
      }
    }
  }
  return count; // return column data..
}

export function getUnAssigned(id, array) {
  const allocat = array;
  let count = 0;
  if (array && array.length > 0) {
    for (let i = 0; i < allocat.length; i += 1) {
      const subId = allocat[i].asset_category_id[0];
      if (subId === id && (allocat[i].latitude === false || allocat[i].latitude === '0')) {
        count += 1;
      }
    }
  }
  return count; // return column data..
}
export function getSpacePath(id, array) {
  const category = array;
  let path = '';
  if (array && array.length > 0) {
    for (let i = 0; i < category.length; i += 1) {
      const subId = category[i].id;
      if (subId === id && category[i].file_path) {
        path += `${window.location.origin}${category[i].file_path}`;
      }
    }
  }
  return path; // return column data..
}

export function zoomin(initialWidth, setInitialWidth) {
  const myImg = document.getElementById('svg-drag');
  if (myImg.clientWidth !== null) {
    const currWidth = myImg.clientWidth;
    if (!initialWidth) setInitialWidth(myImg.clientWidth);
    myImg.style.width = `${currWidth + 50}px`;
  }
}

export function zoomout(initialWidth, setInitialWidth) {
  const myImg = document.getElementById('svg-drag');
  if (myImg.clientWidth !== null) {
    const currWidth = myImg.clientWidth;
    if (!initialWidth) setInitialWidth(myImg.clientWidth);
    myImg.style.width = `${currWidth - 50}px`;
  }
}
export function reset(initialWidth) {
  const myImg = document.getElementById('svg-drag');
  if (myImg.clientWidth !== null) {
    myImg.style.width = `${initialWidth}px`;
    myImg.style.transform = 'translate(0, 0)';
  }
}

export function draggablefromtop() {
  // var elmId = document.getElementById('mySvg');
  // var svgimg = document.createElementNS("http://www.w3.org/2000/svg", "image");
  // svgimg.setAttribute('width', '100%');
  // svgimg.setAttribute('height', '100%');
  // svgimg.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', image);
  // elmId.appendChild(svgimg);
  const imgBox = document.getElementById('imgageBox');
  const contBox = document.getElementById('contBox');
  if (imgBox) {
    imgBox.addEventListener('dragstart', (e) => {
      setTimeout(() => {
        e.target.className = 'hide';
      }, 0);
    });
    imgBox.addEventListener('dragend', (e) => {
      e.target.className = 'imgBox';
    });
    contBox.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    contBox.addEventListener('dragenter', () => {
    });
    contBox.addEventListener('dragleave', () => {
    });
    contBox.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e) {
        imgBox.style.left = e.clientX;
        imgBox.style.top = e.clientY;
        imgBox.style.color = 'red';
      }
      // e.target.append(imgBox);
    });
  }
}
