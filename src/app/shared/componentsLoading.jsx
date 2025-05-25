import React from "react";

import PageLoader from "./pageLoader";

const ComponentsLoading = () => (
  <div className="home-box">
    {/* <Header headerPath="HomeK" nextPath="" pathLink="/" /> */}
    <div className="content-inner-box">
      {/* <Circles
        height="80"
        width="80"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible
      /> */}
      <PageLoader type="max" />
    </div>
  </div>
);

export default ComponentsLoading;
