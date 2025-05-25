/* eslint-disable import/no-unresolved */
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from '@material-ui/lab/Pagination';
import {
  ToggleButton as MuiToggleButton,
  TextField,
  ToggleButtonGroup,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import Loader from '@shared/loading';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardBody,
} from 'reactstrap';
import {
  getCategoryCount,
  getCategoryList,
} from '../../../assets/equipmentService';
import ListCard from '../../../commonComponents/listCard';
import { getAssetCategoryList } from '../../../preventiveMaintenance/ppmService';
import { getAllowedCompanies, getPagesCountV2 } from '../../../util/appUtils';
import CategoryListTable from './selectAssets';

const appModels = require('../../../util/appModels').default;

const ToggleButton = styled(MuiToggleButton)(({ selectedColor }) => ({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: selectedColor,
    textTransform: 'capitalize',
  },
  '&.Mui-disabled': {
    textTransform: 'capitalize',
  },
}));

const MaintenanceSegments = () => {
  const dispatch = useDispatch();
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { assetCategoriesInfo } = useSelector((state) => state.ppm);
  const { categoriesInfo, categoryCountInfo } = useSelector((state) => state.equipment);
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [typeValue, setTypeValue] = useState('ah');
  const [categoryId, setCategoryId] = useState(false);
  const [categoryLoad, setCategoryLoad] = useState(false);

  const getCategoryData = () => {
    if (typeValue === 'e') {
      return categoriesInfo && categoriesInfo.data && categoriesInfo.data.length ? categoriesInfo.data : [];
    }
    return assetCategoriesInfo && assetCategoriesInfo.data && assetCategoriesInfo.data.length ? assetCategoriesInfo.data : [];
  };

  const totalDataCount = categoryCountInfo && categoryCountInfo.length ? categoryCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const categoryList = getCategoryData(typeValue);

  useEffect(() => {
    if (categoryLoad) {
      setCategoryId(categoryId);
    }
  }, [categoryLoad]);

  useEffect(() => {
    (async () => {
      if (typeValue === 'e') {
        await dispatch(getCategoryList(companies, appModels.EQUIPMENTCATEGORY, keyword, '20', offset));
        await dispatch(getCategoryCount(companies, appModels.EQUIPMENTCATEGORY, keyword));
      } else {
        await dispatch(getAssetCategoryList(companies, appModels.ASSETCATEGORY, keyword, '20', offset));
        await dispatch(getCategoryCount(companies, appModels.ASSETCATEGORY, keyword));
      }
    })();
  }, [typeValue, keyword, offset]);

  const handleChange = (event, nextView) => {
    setTypeValue(nextView);
    setCategoryId(false);
  };

  const onClickCard = (cId) => {
    setCategoryId(cId);
    setCategoryLoad(Math.random());
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const loadingData = (assetCategoriesInfo && assetCategoriesInfo.loading) || (categoriesInfo && categoriesInfo.loading);

  return (
    <div className="insights-box">
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          marginBottom: '10px',
          // padding: '7px',
          fontFamily: 'Suisse Intl',
        }}
      >
        <div className="hv-80 tree-card tree-card-left thin-scrollbar">
          <Box
            sx={{
              margin: '3px',
              marginBottom: '6px',
              position: 'sticky',
              top: 0,
              width: '99%',
              backgroundColor: '#ffff',
              zIndex: 2,
            }}
          >
            <ToggleButtonGroup exclusive value={typeValue} size="small" onChange={handleChange} aria-label="Basic button group" fullWidth>
              <ToggleButton value="ah" selectedColor="#c367e5">SPACE</ToggleButton>
              <ToggleButton value="e" selectedColor="#c367e5">EQUIPMENT</ToggleButton>
              {/* <ToggleButton value="e" selectedColor={AddThemeColor({}).color}>Equipment</ToggleButton> */}
            </ToggleButtonGroup>
            <TextField
              className="rounded-pill mt-2 mb-2 w-100"
              id="asset-search"
              value={keyword}
              bsSize="sm"
              autoComplete="off"
              placeholder="Search Here"
              variant="standard"
              onClick={() => setSearchOpen(!searchOpen)}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => setSearchOpen(!searchOpen)} onChange={(e) => setKeyword(e.target.value)}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ height: '30px' }}>
              {loadingData || pages === 0 ? (<span />) : (
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} className="font-11" showFirstButton showLastButton />
              )}
            </Box>
          </Box>
          {loadingData
          && (
          <div className="loader" data-testid="loading-case">
            <Loader />
          </div>
          )}
          {categoryList.map((cData) => (
            <ListCard categoryData={cData} onClickCard={onClickCard} categoryId={categoryId} />
          ))}
        </div>
        <div className="tree-card-center" />
        <div className="hv-80 tree-card tree-card-right thin-scrollbar">
          {categoryId ? (
            <CategoryListTable categoryId={categoryId} typeValue={typeValue} />
          )
            : (
              <Card className="border-0 p-1 bg-lightblue h-100">
                <CardBody className="p-1 bg-color-white m-0">
                  <div className="text-center justify-content-center font-17 mt-25p">
                    Plan Your Maintenances.
                  </div>
                </CardBody>
              </Card>
            )}
        </div>
      </Box>
    </div>
  );
};

export default MaintenanceSegments;
