/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import importMiniIcon from '@images/icons/importMiniBlue.svg';
import plusCircleBlueIcon from '@images/icons/plusCircleBlue.svg';
import InventoryBlack from '@images/sideNavImages/inventory_black.svg';
/* import DrawerHeader from '@shared/drawerHeader'; */
/* import { Drawer } from 'antd'; */
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
} from 'reactstrap';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import actionCodes from '../../inventory/data/actionCodes.json';
import { ProductsFields } from '../../shared/data/tableFields';
import {
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  debounce,
  getActiveTab,
  getAllowedCompanies,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getNextPreview,
  getTabs,
  queryGeneratorWithUtc,
  formatFilterData,
} from '../../util/appUtils';
import {
  Badge
} from "reactstrap";
import { InventoryModule } from '../../util/field';
import PurchaseSegments from '../purchaseSegments';
import {
  clearAddProduct,
  clearEditProduct,
  clearSellerIdsInfo,
  clearTableData,
  clearTaxesInfo,
  getProductDetails,
  getProductList,
  getProductsCount,
  getProductsExport,
  productFilters,
  setProductId,
  getCompanyPrice,
} from '../purchaseService';
import AddProduct from './addProduct';
import actionCodesPurchase from './data/actionCodes.json';
import customDataJson from './data/customData.json';
import ProductDetail from './productDetails';

import CommonGrid from '../../commonComponents/commonGrid';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { updateHeaderData } from '../../core/header/actions';
import inventoryNav from '../../inventory/inventoryNavbar/navlist.json';
import { getInventorySettingDetails } from '../../siteOnboarding/siteService';
import { AddThemeBackgroundColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

const Products = (props) => {
  const { match } = props;
  const isPurchaseProducts = match
    ? match.path.includes('/purchase/products')
    : false;
  const isInventoryProducts = match
    ? match.path.includes('/inventory/products')
    : false;
  const tableColumns = ProductsFields();
  const dispatch = useDispatch();
  const defaultActionText = 'Product Actions';
  const subMenu = 'Purchase Info';
  const subTabMenu = 'Products';
  const subInMenu = 'Products';
  const [limit, setLimit] = useState(10);
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(false);
  const { pinEnableData } = useSelector((state) => state.auth);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [addModal, showAddModal] = useState(false);
  const [filterText, setFilterText] = useState('')

  const [exportList, setExportList] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [valueArray, setValueArray] = useState([]);

  const [bulkUploadModal, showBulkUploadModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [startExport, setStartExport] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const {
    productsInfo, productsCount, addProductInfo, productFiltersInfo, addReorderInfo, updateReorderInfo, productDetailsInfo, updateProductInfo, filterInitailValues, newProductId, productCategoryGroup, productsExportInfo,  companyPrice,
  } = useSelector((state) => state.purchase);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const { bulkUploadTrue } = useSelector((state) => state.inventory);
  const invSettingData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length ? inventorySettingsInfo.data[0] : false;
  const productsListAccess = invSettingData ? invSettingData.products_list_access : false;
  const productsListId = invSettingData && productsListAccess && productsListAccess === 'Company Level' && invSettingData.product_list_company_id.id ? invSettingData.product_list_company_id.id : false;
  const companies = productsListId || getAllowedCompanies(userInfo);

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Inventory',
    'code',
  );

  const allowedOperationsPurchase = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Purchase',
    'code',
  );

  const totalDataCount = productsCount && productsCount.length ? productsCount.length : 0;

  const isCreatable = isPurchaseProducts
    ? allowedOperationsPurchase.includes(actionCodesPurchase['Add Product'])
    : allowedOperations.includes(actionCodes['Add Product']);
  const isEditable = isPurchaseProducts
    ? allowedOperationsPurchase.includes(actionCodesPurchase['Edit Product'])
    : allowedOperations.includes(actionCodes['Edit Product']);
  const isViewable = isPurchaseProducts
    ? allowedOperationsPurchase.includes(actionCodesPurchase['View Product'])
    : allowedOperations.includes(actionCodes['View Product']);
  const isBulkUpload = isPurchaseProducts
    ? allowedOperationsPurchase.includes(
      actionCodesPurchase['Product Bulk Upload'],
    )
    : allowedOperations.includes(actionCodes['Product Bulk Upload']);

  useEffect(() => {
    if (visibleColumns && Object.keys(visibleColumns) && Object.keys(visibleColumns).length === 0) {
      setVisibleColumns({
        _check_: true,
        name: true,
        unique_code: true,
        categ_id: true,
        qty_available: true,
        reserved_quantity: true,
        uom_id: true,
        reordering_min_qty: true,
        reordering_max_qty: true,
        alert_level_qty: true,
        specification: true,
        brand: true,
        preferred_vendor: true,
        standard_price: false,
        type: false,
      });
    }
  }, [visibleColumns]);


  useMemo(() => {
    if (productFiltersInfo && (!productFiltersInfo.customFilters || !productFiltersInfo.customFilters.length || productFiltersInfo.customFilters.length)) {
      const defaultFilters = [
        {
          key: 'qty_available', title: 'Products with Quantity-on-Hand', value: 0, label: 'Products with Quantity-on-Hand', type: 'numless', Header: 'Products with Quantity-on-Hand', id: 'qty_available',
        },
      ];
      setValueArray(defaultFilters);
      dispatch(productFilters(defaultFilters));
    }
  }, []);

  useEffect(() => {
    if (productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length) {
      const strProduct = `product.product,${productDetailsInfo.data[0].id}`;
      const parentId = userInfo.data && userInfo.data.company && userInfo.data.company.parent_id && userInfo.data.company.parent_id.id ? userInfo.data.company.parent_id.id : false;
      const companyId = userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : false;

      let cids = [companyId];
      if (parentId) {
        cids = [parentId, companyId];
      }
      dispatch(getCompanyPrice(productDetailsInfo.data[0].id));
    }
  }, [productDetailsInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getProductDetails(appModels.PRODUCT, viewId));
    }
  }, [viewId]);

  /* useEffect(() => {
    if (updateProductInfo && updateProductInfo.data) {
      dispatch(getProductDetails(appModels.PRODUCT, viewId));
    }
  }, [updateProductInfo]); */

  const getType = (type) => {
    const filteredType = customDataJson.productType.filter((data) => data.value === type);
    if (filteredType && filteredType.length) {
      return filteredType[0].label;
    }
    return '-';
  };

  useEffect(() => {
    if (productsExportInfo && productsExportInfo.data && productsExportInfo.data.length > 0) {
      productsExportInfo.data.map((data) => {
        data.type = getType(data.type);
      });
    }
  }, [productsExportInfo]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      // dispatch(productFilters([], [], []));
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getInventorySettingDetails(userInfo.data.company.id, appModels.INVENTORYCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (addProductInfo && addProductInfo.data) {
      const categoryValuesInfo = productFiltersInfo && productFiltersInfo.categories
        ? getColumnArrayById(productFiltersInfo.categories, 'id')
        : [];
      const typeValuesInfo = productFiltersInfo && productFiltersInfo.types
        ? getColumnArrayById(productFiltersInfo.types, 'id')
        : [];
      const customFilterValuesInfo = productFiltersInfo && productFiltersInfo.customFilters
        ? queryGeneratorWithUtc(
          productFiltersInfo.customFilters,
          false,
          userInfo.data,
        )
        : [];
      dispatch(
        getProductsCount(
          companies,
          appModels.PRODUCT,
          categoryValuesInfo,
          typeValuesInfo,
          customFilterValuesInfo,
          globalFilter,
        ),
      );
      dispatch(
        getProductList(
          companies,
          appModels.PRODUCT,
          limit,
          offset,
          sortedValue.sortBy,
          sortedValue.sortField,
          categoryValuesInfo,
          typeValuesInfo,
          customFilterValuesInfo,
          globalFilter,
        ),
      );
    }
  }, [addProductInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && produtsLength && (productsExportInfo && productsExportInfo.data ? productsExportInfo.data.length !== produtsLength : true)) {

      const offsetValue = 0;
      const categories = productFiltersInfo && productFiltersInfo.categories
        ? getColumnArrayById(productFiltersInfo.categories, 'id')
        : [];
      const types = productFiltersInfo && productFiltersInfo.types
        ? getColumnArrayById(productFiltersInfo.types, 'id')
        : [];
      const customFilters = productFiltersInfo && productFiltersInfo.customFilters
        ? queryGeneratorWithUtc(
          productFiltersInfo.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getProductsExport(
          companies,
          appModels.PRODUCT,
          produtsLength,
          offsetValue,
          InventoryModule.inventoryProductApiFields,
          categories,
          types,
          customFilters,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [userInfo, startExport]);

  useEffect(() => {
    if (userInfo && userInfo.data && ((inventorySettingsInfo && inventorySettingsInfo.data) || (inventorySettingsInfo && inventorySettingsInfo.err)) && (inventorySettingsInfo && !inventorySettingsInfo.loading)) {
      const categoryValuesInfo = productFiltersInfo && productFiltersInfo.categories ? getColumnArrayById(productFiltersInfo.categories, 'id') : [];
      const typeValuesInfo = productFiltersInfo && productFiltersInfo.types ? getColumnArrayById(productFiltersInfo.types, 'id') : [];
      const customFilterValuesInfo = productFiltersInfo && productFiltersInfo.customFilters ? queryGeneratorWithUtc(productFiltersInfo.customFilters, false, userInfo.data) : [];
      dispatch(getProductsCount(companies, appModels.PRODUCT, categoryValuesInfo, typeValuesInfo, customFilterValuesInfo, globalFilter));
    }
  }, [userInfo, JSON.stringify(productFiltersInfo.customFilters), inventorySettingsInfo, globalFilter, bulkUploadTrue]);

  useEffect(() => {
    if (userInfo && userInfo.data && ((inventorySettingsInfo && inventorySettingsInfo.data) || (inventorySettingsInfo && inventorySettingsInfo.err)) && (inventorySettingsInfo && !inventorySettingsInfo.loading)) {
      const categoryValuesInfo = productFiltersInfo && productFiltersInfo.categories ? getColumnArrayById(productFiltersInfo.categories, 'id') : [];
      const typeValuesInfo = productFiltersInfo && productFiltersInfo.types ? getColumnArrayById(productFiltersInfo.types, 'id') : [];
      const customFilterValuesInfo = productFiltersInfo && productFiltersInfo.customFilters ? queryGeneratorWithUtc(productFiltersInfo.customFilters, false, userInfo.data) : '';
      dispatch(getProductList(companies, appModels.PRODUCT, limit, offset, sortedValue.sortBy, sortedValue.sortField, categoryValuesInfo, typeValuesInfo, customFilterValuesInfo, globalFilter));
    }
  }, [userInfo, offset, inventorySettingsInfo, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(productFiltersInfo.customFilters), addReorderInfo, globalFilter, updateReorderInfo, bulkUploadTrue]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && updateProductInfo
      && updateProductInfo.data
    ) {
      const categoryValuesInfo = productFiltersInfo && productFiltersInfo.categories
        ? getColumnArrayById(productFiltersInfo.categories, 'id')
        : [];
      const typeValuesInfo = productFiltersInfo && productFiltersInfo.types
        ? getColumnArrayById(productFiltersInfo.types, 'id')
        : [];
      const customFilterValuesInfo = productFiltersInfo && productFiltersInfo.customFilters
        ? queryGeneratorWithUtc(
          productFiltersInfo.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getProductList(
          companies,
          appModels.PRODUCT,
          limit,
          offset,
          sortedValue.sortBy,
          sortedValue.sortField,
          categoryValuesInfo,
          typeValuesInfo,
          customFilterValuesInfo,
          globalFilter,
        ),
      );
    }
  }, [userInfo, updateProductInfo]);

  const getPickingCompany = (array) => {
    const pickData = array;
    for (let i = 0; i < pickData.length; i += 1) {
      const pickValue = `${pickData[i].name}`;
      pickData[i].categ_id[1] = [pickData[i].id, pickValue];
    }
    return pickData;
  };

  const dateFilters = productFiltersInfo
    && productFiltersInfo.customFilters
    && productFiltersInfo.customFilters.length > 0
    ? productFiltersInfo.customFilters
    : [];

  const handleRadioboxChange = (event) => {
    const { value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
        Header: value,
        id: value,
      },
    ];
    const oldCustomFilters = productFiltersInfo && productFiltersInfo.customFilters
      ? productFiltersInfo.customFilters
      : [];

    const customFilters1 = [
      ...(oldCustomFilters.length > 0
        ? oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        )
        : ''),
      ...filters,
    ];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(productFilters(customFilters1));

    setOffset(0);
    setPage(1);
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
      },
    ];
    const oldCustomFilters = productFiltersInfo && productFiltersInfo.customFilters
      ? productFiltersInfo.customFilters
      : [];

    if (checked) {
      const customFiltersData = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ];
      dispatch(productFilters(customFiltersData));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];
    const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
      userInfo,
      startDate,
      endDate,
    );

    if (startDate && endDate) {
      start = getDateRangeObj[0];
      end = getDateRangeObj[1];
    }
    if (startDate && endDate) {
      filters = [
        {
          key: value,
          value,
          label: value,
          type: 'customdate',
          start,
          end,
        },
      ];
    }
    if (start && end) {
      const oldCustomFilters = productFiltersInfo && productFiltersInfo.customFilters
        ? productFiltersInfo.customFilters
        : [];
      const customFilters1 = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(productFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  useEffect(() => {
    if (productsCount && productsCount.data) {
      setTotalProductCount(productsCount.data.length);
    }
  }, [productsCount, addProductInfo]);

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(productsInfo && productsInfo.data && productsInfo.data.length && productsInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(productsInfo && productsInfo.data && productsInfo.data.length && productsInfo.data[productsInfo.data.length - 1].id);
    }
  }, [productsInfo]);

  const handlePageChangeDetail = (page, type) => {
    setDetailArrowNext('');
    setDetailArrowPrev('');
    const nPages = Math.ceil(totalDataCount / limit);
    if (type === 'Next' && page !== nPages) {
      const offsetValue = page * limit;
      setOffset(offsetValue);
      setPage(page);
      setDetailArrowNext(Math.random());
    }
    if (type === 'Prev' && page !== 1) {
      const offsetValue = ((page - 2) * limit);
      setOffset(offsetValue);
      setPage(page - 2);
      setDetailArrowPrev(Math.random());
    }
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const editReset = () => {
    setEdit(false);
    setOpenUpdateModal(false);
    dispatch(clearEditProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
    dispatch(clearSellerIdsInfo());
  };

  const addReset = () => {
    if (document.getElementById('productForm')) {
      document.getElementById('productForm').reset();
      showAddModal(false);
    }
    setOpenAddProductModal(false);
    /* if (addProductInfo && addProductInfo.data && addProductInfo.data.data && addProductInfo.data.data.length) {
      setViewProduct(addProductInfo.data.data[0]);
    } */
    dispatch(clearAddProduct());
    clearEditProduct();
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
    dispatch(clearSellerIdsInfo());
  };

  const resetClose = () => {
    if (document.getElementById('productForm')) {
      document.getElementById('productForm').reset();
    }
    if (isEdit) {
      setEdit(false);
      setOpenUpdateModal(false);
      dispatch(clearEditProduct());
      dispatch(clearTableData());
      dispatch(clearTaxesInfo());
      dispatch(clearSellerIdsInfo());
    } else {
      setOpenAddProductModal(false);
      dispatch(clearAddProduct());
      dispatch(clearTableData());
      dispatch(clearTaxesInfo());
      dispatch(clearSellerIdsInfo());
    }
  };

  useEffect(() => {
    if (newProductId) {
      setViewProduct(newProductId);
      dispatch(setProductId(false));
    }
  }, [newProductId]);

  const showCreateModal = () => {
    if (document.getElementById('productForm')) {
      document.getElementById('productForm').reset();
    }
    setOpenAddProductModal(true);
    dispatch(clearSellerIdsInfo());
    dispatch(clearTaxesInfo());
    dispatch(clearAddProduct());
    dispatch(clearTableData());
  };

  useEffect(() => {
    if (selectedActions === 'Product Bulk Upload') {
      showBulkUploadModal(true);
    }
  }, [enterAction]);

  const faIcons = {
    ADDLOCATION: plusCircleBlueIcon,
    ADDLOCATIONACTIVE: plusCircleBlueIcon,
    ASSETBULKUPLOAD: importMiniIcon,
    ASSETBULKUPLOADACTIVE: importMiniIcon,
  };

  const valueCheck = (dataArray) => {
    let returnValue = true;
    dataArray.map((item) => {
      if (!item.value) {
        returnValue = false;
      }
    });
    return returnValue;
  };

  const onFilterChange = (data) => {
    const fields = InventoryModule.inventoryProductFilterFields;
    let query = '"|","|","|","|","|","|","|","|",';
    const oldCustomFilters = productFiltersInfo && productFiltersInfo.customFilters ? productFiltersInfo.customFilters : [];
    const dateFilters = oldCustomFilters.filter((item) => item.type === 'date' || item.type === 'customdate');

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      fields.filter((field) => {
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }

    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        data.items.map((dataItem) => {
          const label = tableColumns.find((column) => column.field === dataItem.field)
          dataItem.value = dataItem?.value ? dataItem.value : ''
          dataItem.header = label?.headerName
        })
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), "header")
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(productFilters(customFilters));
      }
    } else {
      dispatch(productFilters([...dateFilters]));
    }
    let filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : []
    setFilterText(formatFilterData(filtersData, data?.quickFilterValues?.[0]))
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [productFiltersInfo],
  );

  const handleCustomFilterClose = (cfValue, cf) => {
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    const customFiltersListInfo = productFiltersInfo.customFilters.filter((item) => item.value !== cfValue);
    dispatch(productFilters(customFiltersListInfo));
    setOffset(0);
    setPage(1);
  };

  /*useEffect(() => {
    const oldCustomFilters = productFiltersInfo && productFiltersInfo.customFilters
      ? productFiltersInfo.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );
    // setCustomFilters({});
    dispatch(productFilters(dateFilters));
    setGlobalFilter(false);
  }, []);*/


  const produtsLength = productsCount && productsCount.data && productsCount.data.length
    ? productsCount.data.length
    : 0;



  const loading = (userInfo && userInfo.loading)
    || (productDetailsInfo && productDetailsInfo.loading)
    || (addReorderInfo && addReorderInfo.loading);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Inventory',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, inventoryNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Products',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Inventory',
        moduleName: 'Inventory',
        menuName: 'Products',
        link: '/inventory/products',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  const customFilters = productFiltersInfo && productFiltersInfo.customFilters
    ? queryGeneratorWithUtc(
      productFiltersInfo.customFilters,
      false,
      userInfo.data,
    )
    : '';

  return (
    <Box>
      {/*  <Row className={isPurchaseProducts ? 'ml-1 mr-1 mt-2 mb-2 p-3 border purchase-module' : 'purchase-module pt-2 ml-1 mr-1 mt-2 mb-2 p-3 border'}> */}
      {isPurchaseProducts && (
        <Col sm="12" md="12" lg="12">
          <PurchaseSegments id={subTabMenu} />
        </Col>
      )}
      {isInventoryProducts && (
        <>
          {/* <Header
            headerPath="Inventory"
            nextPath=""
            pathLink="/inventory/operations"
            headerTabs={tabss.filter((e) => e)}
            activeTab={activeTab}
          /> */}
        </>

        /* <Col sm="12" md="12" lg="12">
            <InventoryNavbar id={subInMenu} />
          </Col> */
      )}
      {/* isBulkUpload && (
                        <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="actionDropdown pr-2">
                          <DropdownToggle
                            caret
                            // eslint-disable-next-line max-len
                            className={selectedActionImage !== '' ? 'bg-white text-navy-blue pb-05 pt-05 font-11 rounded-pill text-left' : 'btn-navyblue pb-05 pt-05 font-11 rounded-pill text-left'}
                          >
                            {selectedActionImage !== ''
                              ? (
                                <img alt="add" className="mr-2 pb-2px" src={faIcons[`${selectedActionImage}ACTIVE`]} height="15" width="15" />
                              ) : ''}
                            <span className="font-weight-700">
                              {!selectedActionImage && (
                                <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                              )}
                              {selectedActions}
                              <FontAwesomeIcon size="sm" color="primary" className="float-right ml-1 mt-1" icon={faChevronDown} />
                            </span>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              id="switchAction"
                              className="pl-2 pr-0"
                              onClick={() => { showBulkUploadModal(true); }}
                            >
                              <img src={importMiniIcon} className="mr-2" height="15" width="15" alt="upload" />
                              <span className="mr-0">Bulk Upload</span>
                            </DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      ) */}
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        tableData={
          productsInfo && productsInfo.data && productsInfo.data.length
            ? productsInfo.data
            : []
        }
        columns={ProductsFields()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Product Lists"
        exportFileName="Products"
        listCount={totalProductCount}
        exportInfo={productsExportInfo}
        page={currentPage}
        rowCount={totalProductCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={productsInfo && productsInfo.loading}
        err={productsInfo && productsInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        isBulkUpload={isBulkUpload}
        filters={filterText}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={
          <>
            {productFiltersInfo.customFilters && productFiltersInfo.customFilters.length > 0 ? productFiltersInfo.customFilters.map((cf) => (
              (cf.type === 'numless' && cf.label && cf.label !== '') ?
                <p key={cf.value} className="mr-2 content-inline">
                  <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                    {(cf.type === 'numless') && (
                      <span>
                        {cf.label}
                      </span>
                    )}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </p> : ''
            )) : ''}
          </>}
      />

      <Drawer
        PaperProps={{
          sx: { width: '65%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Products"
          imagePath={InventoryBlack}
          onClose={() => addReset()}
        />
        <AddProduct
          reset={() => {
            addReset();
          }}
          editId={false}
          closeAddModal={() => {
            setOpenAddProductModal(false);
          }}
          visibility={addModal}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={
            productDetailsInfo
              && productDetailsInfo.data
              && productDetailsInfo.data.length > 0
              ? productDetailsInfo.data[0].name
              : 'Product'
          }
          imagePath={InventoryBlack}
          onClose={() => onViewReset()}
          isEditable={
            isEditable && productDetailsInfo && !productDetailsInfo.loading
          }
          onEdit={() => {
            setEdit(
              productDetailsInfo
                && productDetailsInfo.data
                && productDetailsInfo.data.length > 0
                ? productDetailsInfo.data[0].id
                : false,
            );
            setOpenUpdateModal(!openUpdateModal);
          }}
          onPrev={() => {
            setViewId(getNextPreview(viewId, 'Prev', productsInfo));
          }}
          onNext={() => {
            setViewId(getNextPreview(viewId, 'Next', productsInfo));
          }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', productsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', productsInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', productsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', productsInfo));
          }}
        />
        <ProductDetail />
      </Drawer>

      {/* <Col sm="12" md="12" lg="12" xs="12" className="p-2">
        <Row className="helpDesk-ticket">
          <Col md="12" sm="12" lg="12" xs="12" className="pl-1 pt-2 pr-2 helpDesk-ticketsTable list">

            <Card className="p-2 mb-2 h-100 bg-lightblue">
              <CardBody className="bg-color-white p-1 m-0">
                <Row className="p-2 tickets-title">
                  <Col md="8" xs="12" sm="8" lg="8">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      Product List :
                      {' '}
                      {totalProductCount}
                    </span>
                    <div className="content-inline">
                      {productFiltersInfo.customFilters && productFiltersInfo.customFilters.length ? productFiltersInfo.customFilters.map((cf) => (
                        (cf.type === 'customdate' || cf.type === 'date')
                        && (
                        <p key={cf.value} className="mr-2 content-inline">
                          <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                            {cf.type === 'customdate' && (
                            <span>
                              {cf.label}
                              {'  '}
                              :
                                {' '}
                              {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                              {' - '}
                              {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                            </span>
                            )}
                            {cf.type === 'date' && cf.label}
                            <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                          </Badge>
                        </p>
                        )
                      )) : ''}
                    </div>
                  </Col>
                  <Col md="4" xs="12" sm="4" lg="4">
                    <div className="float-right">
                      <Refresh
                        loadingTrue={loading}
                        setReload={setReload}
                      />
                      {isBulkUpload && (
                        <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="actionDropdown pr-2">
                          <DropdownToggle
                            caret
                            // eslint-disable-next-line max-len
                            className={selectedActionImage !== '' ? 'bg-white text-navy-blue pb-05 pt-05 font-11 rounded-pill text-left' : 'btn-navyblue pb-05 pt-05 font-11 rounded-pill text-left'}
                          >
                            {selectedActionImage !== ''
                              ? (
                                <img alt="add" className="mr-2 pb-2px" src={faIcons[`${selectedActionImage}ACTIVE`]} height="15" width="15" />
                              ) : ''}
                            <span className="font-weight-700">
                              {!selectedActionImage && (
                                <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                              )}
                              {selectedActions}
                              <FontAwesomeIcon size="sm" color="primary" className="float-right ml-1 mt-1" icon={faChevronDown} />
                            </span>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              id="switchAction"
                              className="pl-2 pr-0"
                              onClick={() => { showBulkUploadModal(true); }}
                            >
                              <img src={importMiniIcon} className="mr-2" height="15" width="15" alt="upload" />
                              <span className="mr-0">Bulk Upload</span>
                            </DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      )}
                      <ListDateFilters dateFilters={dateFilters} customFilters={productFiltersInfo.customFilters} handleCustomFilterClose={handleCustomFilterClose} setCustomVariable={setCustomVariable} customVariable={customVariable} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                      {isCreatable && (
                        <CreateList name="Add Product" showCreateModal={showCreateModal} />
                      )}
                    </div>
                    {bulkUploadModal && (
                      <ProductBulkUpload
                        atFinish={() => {
                          showBulkUploadModal(false);
                          setSelectedActionImage('');
                          showBulkUploadModal(false);
                        }}
                        bulkUploadModal
                      />
                    )}
                  </Col>
                </Row>
                {(productsInfo && productsInfo.data && productsInfo.data.length > 0) && (
                  <span data-testid="success-case" />
                )}
                <div className="thin-scrollbar">
                  <div className="table-responsive common-table">
                    <DynamicTable
                      columnData={productsInfo.data}
                      columns={ProductsFields()}
                      loading={productsInfo.loading || (inventorySettingsInfo && inventorySettingsInfo.loading)}
                      setViewId={setViewId}
                      setViewModal={setViewModal}
                      onFilterChanges={onFilterChange}
                      rowCount={totalProductCount}
                      page={currentPage}
                      limit={limit}
                      handlePageChange={handlePageChange}
                      exportFileName="Products"
                      filters={filterStringGeneratorProducts(productFiltersInfo)}
                      setRows={setRows}
                      rows={rows}
                      setStartExport={setStartExport}
                      exportInfo={productsExportInfo}
                      visibleColumns={visibleColumns}
                      setVisibleColumns={setVisibleColumns}
                      isForm={openUpdateModal || openAddProductModal}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={1250}
        visible={openUpdateModal}
      >

        <DrawerHeader
          title="Update Products"
          imagePath={InventoryBlack}
          closeDrawer={() => resetClose()}
        />
        <AddProduct
          reset={() => { editReset(); }}
          closeModal={() => { setOpenUpdateModal(false); }}
          viewProduct={viewProduct}
          isEdit={isEdit}
          isUpdate={openUpdateModal ? Math.random() : false}
          visibility={openUpdateModal}
        />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={1250}
        visible={openAddProductModal}
      >

        <DrawerHeader
          title="Create Products"
          imagePath={InventoryBlack}
          closeDrawer={() => addReset()}
        />
        <AddProduct
          reset={() => { addReset(); }}
          closeAddModal={() => { setOpenAddProductModal(false); }}
          visibility={openAddProductModal}
        />
      </Drawer>
      <Drawer
        title=""
        closable={false}
        width="80%"
        className="drawer-bg-lightblue-no-scroll"
        visible={viewModal}
      >
        <DrawerHeader
          title={productDetailsInfo && (productDetailsInfo.data && productDetailsInfo.data.length > 0)
            ? productDetailsInfo.data[0].name : 'Product'}
          imagePath={InventoryBlack}
          closeDrawer={() => onViewReset()}
          isEditable={(isEditable && (productDetailsInfo && !productDetailsInfo.loading))}
          onEdit={() => {
            setEdit(productDetailsInfo && (productDetailsInfo.data && productDetailsInfo.data.length > 0) ? productDetailsInfo.data[0].id : false);
            setOpenUpdateModal(!openUpdateModal);
          }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', productsInfo)); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next', productsInfo)); }}
        />
        <ProductDetail />
      </Drawer>
        </Row> */}
    </Box>
  );
};

Products.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
Products.defaultProps = {
  match: undefined,
};
export default Products;
