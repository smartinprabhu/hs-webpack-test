/* eslint-disable array-callback-return */
/* eslint-disable new-cap */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import moment from 'moment';
import 'jspdf-autotable';
import {
  getDateTimeUtc, filterDataPdf, customFilterDataArray,
} from '../../util/appUtils';

function getPercent(percent, total) {
  if ((percent && total)) {
    return (percent / 100) * total;
  }
  return 0;
}

export function getTotalTax(array, key, key1) {
  let count = 0;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key] && array[i][key].length) {
      for (let j = 0; j < array[i][key].length; j += 1) {
        count += getPercent(array[i][key][j].amount, array[i][key1]);
      }
    }
  }
  return count; // return column data..
}

export function getTaxData(array, value) {
  const result = [];
  for (let i = 0; i < array.length; i += 1) {
    if (value && value.length) {
      value.map((data) => {
        const idValue = typeof data === 'object' ? data.id : data;
        if (array[i].id === idValue) {
          result.push({ id: array[i].id, name: array[i].name, amount: array[i].amount });
        }
      });
    }
  }
  return result; // return column data..
}

export function getDataWithTaxId(array, array1) {
  const result = [];
  for (let i = 0; i < array.length; i += 1) {
    const value = array[i].taxes_id;
    array[i].taxes_id = getTaxData(array1, value);
    result.push(array[i]);
  }
  return result;
}

export function getOrderLines(array, key) {
  const result = [];
  const txVal = false;
  const txDate = new Date();
  for (let i = 0; i < array.length; i += 1) {
    const val = array[i][key];
    if (val && val.length > 0) {
      array[i][key] = [[6, 0, [val[0]]]];
    } else {
      array[i][key] = txVal;
    }
    const val1 = array[i].company_id;
    if (val1 && val1.length > 0) {
      array[i].company_id = val1[0];
    } else {
      array[i].company_id = txVal;
    }
    const val2 = array[i].date_planned;
    if (val2 && val2.length > 0) {
      array[i].date_planned = moment(val2).format('YYYY-MM-DD HH:mm:ss');
    } else {
      array[i].date_planned = moment(txDate).format('YYYY-MM-DD HH:mm:ss');
    }
    const val3 = array[i].product_id;
    if (val3 && typeof val3 === 'object') {
      array[i].product_id = val3[0];
    } else if (val3 && typeof val3 === 'number') {
      array[i].product_id = val3;
    } else {
      array[i].product_id = txVal;
    }
    result.push(array[i]);
  }
  return result; // return column data..
}

export function getOrderLinesRequest(array) {
  const result = [];
  const txVal = false;
  const txDate = new Date();
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].product_id && (typeof array[i].product_id === 'object' || typeof array[i].product_id === 'number')) {
      const val = array[i].taxes_id;
      if (val && val.length > 0) {
        const taxesData = [];
        val.map((taxId) => {
          taxesData.push(taxId.id);
        });
        array[i].taxes_id_new = [[6, 0, taxesData]];
      } else {
        array[i].taxes_id_new = [[6, 0, []]];
      }
      const val1 = array[i].company_id;
      if (val1 && val1.length > 0) {
        array[i].company_id_new = val1[0];
      } else {
        array[i].company_id_new = txVal;
      }
      const val2 = array[i].date_planned;
      if (val2 && typeof val2 === 'object') {
        array[i].date_planned_new = getDateTimeUtc(val2);
      } else if (val2) {
        array[i].date_planned_new = val2;
      } else {
        array[i].date_planned_new = getDateTimeUtc(txDate);
      }
      const val3 = array[i].product_id;
      if (val3 && typeof val3 === 'object') {
        array[i].product_id_new = val3[0];
      } else if (val3 && typeof val3 === 'number') {
        array[i].product_id_new = val3;
      } else {
        array[i].product_id_new = txVal;
      }
      result.push(array[i]);
    }
  }
  return result; // return column data..
}

export function getNewRequestArray(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      company_id: pl.company_id_new,
      date_planned: pl.date_planned_new,
      id: pl.id,
      name: pl.name,
      price_subtotal: pl.price_subtotal,
      price_unit: pl.price_unit,
      product_id: pl.product_id_new,
      product_qty: pl.product_qty,
      product_uom: pl.product_uom && pl.product_uom.length > 0 ? pl.product_uom[0] : 1,
      taxes_id: pl.taxes_id_new,
      isRemove: pl.isRemove,
    }));
  }
  return requestProduts;
}

export function getNewArray(array) {
  const resources = [];
  if (array && array.length > 0) {
    for (let i = 0; i < array.length; i += 1) {
      const val = array[i];
      val.type = val.type ? getProductTypes(val.type) : '-';
      val.standard_price = val.standard_price ? val.standard_price : '0';
      val.weight = val.weight ? val.weight : '0';
      val.volume = val.volume ? val.volume : '0';
      resources.push(val);
    }
  }
  return resources;
};

export function getNewVendorBankArray(array) {
  let vendorBanks = [];
  if (array && array.length > 0) {
    vendorBanks = array.map((pl) => ({
      id: pl.id,
      bank_id: pl.bank_id && pl.bank_id[0] ? pl.bank_id[0] : '',
      acc_number: pl.acc_number,
    }));
  }
  return vendorBanks;
}

export function removeEmptyArrayElements(array, field) {
  let arrayNotEmpty = [];
  if (array && array.length > 0) {
    if (field === 'add') {
      arrayNotEmpty = array.filter((item) => item.bank_id !== '' && item.acc_number !== '');
    } else {
      arrayNotEmpty = array.filter((item) => item.bank_id !== '' && item.acc_number !== '' && item.id >= 0);
    }
  }
  return arrayNotEmpty;
}

export function exportingFieldsArray(tableFields, fields, dataFields, setDataFields) {
  let array = [];
  fields.map((field) => {
    const exportField = tableFields.find((tableField) => tableField.property === field);
    if (exportField && exportField.property === 'id') {
      array.unshift(exportField);
    }
    if (exportField) {
      array.push(exportField);
    }
    array = [...new Set(array)];
  });
  setDataFields(array);
  return dataFields;
}

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const states = filters.statuses ? filters.statuses : [];
  const orderes = filters.orderes ? filters.orderes : [];
  const vendores = filters.vendores ? filters.vendores : [];
  const languages = filters.languages ? filters.languages : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (states && states.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterDataPdf(states);
  }

  if (orderes && orderes.length > 0) {
    filterTxt += 'Ordered Date : ';
    filterTxt += filterDataPdf(orderes);
  }

  if (vendores && vendores.length > 0) {
    filterTxt += 'Vendor : ';
    filterTxt += filterDataPdf(vendores);
  }

  if (languages && languages.length > 0) {
    filterTxt += 'Languages : ';
    filterTxt += filterDataPdf(languages);
  }

  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function filterStringGeneratorRequest(filters) {
  let filterTxt = '';
  const states = filters.statuses ? filters.statuses : [];
  const orderes = filters.orderes ? filters.orderes : [];
  const vendores = filters.vendores ? filters.vendores : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (states && states.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterDataPdf(states);
  }

  if (orderes && orderes.length > 0) {
    filterTxt += 'Request Date : ';
    filterTxt += filterDataPdf(orderes);
  }

  if (vendores && vendores.length > 0) {
    filterTxt += 'Vendor : ';
    filterTxt += filterDataPdf(vendores);
  }

  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function filterStringGeneratorProducts(filters) {
  let filterTxt = '';
  const types = filters.types ? filters.types : [];
  const categories = filters.categories ? filters.categories : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (types && types.length > 0) {
    filterTxt += 'Product Type : ';
    filterTxt += filterDataPdf(types);
  }

  if (categories && categories.length > 0) {
    filterTxt += 'Product Category : ';
    filterTxt += filterDataPdf(categories);
  }

  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function filterStringGeneratorTransfers(filters) {
  let filterTxt = '';
  const statuses = filters.statuses ? filters.statuses : [];
  const orderes = filters.orderes ? filters.orderes : [];
  const types = filters.orderes ? filters.types : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (statuses && statuses.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterDataPdf(statuses);
  }

  if (orderes && orderes.length > 0) {
    filterTxt += 'Scheduled Date : ';
    filterTxt += filterDataPdf(orderes);
  }

  if (types && types.length > 0) {
    filterTxt += 'Operation Type : ';
    filterTxt += filterDataPdf(types);
  }

  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function filterStringGeneratorReOderingRules(filters) {
  let filterTxt = '';
  const customFilters = filters.customFilters ? filters.customFilters : [];
  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function getColumnArrayByTaxesIdWithArray(array, col) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      column.push(array[i][col]);
    }
  }
  return column.flat(); // return column data..
}
export function getDateFormatChange(array) {
  const result = [];
  let fVal = '';
  for (let i = 0; i < array.length; i += 1) {
    const value = array[i].date_planned;
    if (value) {
      fVal = new Date(value);
    } else {
      fVal = '';
    }
    array[i].date_planned = fVal;
    result.push(array[i]);
  }
  return result;
}

export function getRequiredMessageProductVendor(postdata) {
  let result = false;
  if (postdata && postdata.length > 0) {
    for (let i = 0; i < postdata.length; i += 1) {
      if (!postdata[i].newName || postdata[i].newName === '') {
        result = 'Vendor name is required';
      } else if (!postdata[i].min_qty || postdata[i].min_qty === '') {
        result = 'Minimal quantity is required';
      } else if (!postdata[i].price || postdata[i].price === '') {
        result = 'Price is required';
      } else if (postdata[i].date_start > postdata[i].date_end) {
        result = 'End date should be greater than start date';
      }
    }
  }
  return result;
}
