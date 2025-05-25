import React from 'react';
import { useSelector } from 'react-redux';

import PantryDetailInfo from './detailInfo';
import PantryDetailTabs from './detailTabs';

const PantryDetailView = () => {
  const { configPantryDetails } = useSelector((state) => state.pantry);


  return (
    <>
      <PantryDetailInfo detailData={configPantryDetails} />
      <PantryDetailTabs detailData={configPantryDetails} />
    </>
  );
};

export default PantryDetailView;
