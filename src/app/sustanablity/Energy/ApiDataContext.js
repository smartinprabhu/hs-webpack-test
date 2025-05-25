import React, { createContext, useState, useCallback } from 'react';
// import { isEqual } from 'lodash'; // lodash installation failed, using JSON.stringify as fallback

const ApiDataContext = createContext();

const ApiDataProvider = ({ children }) => {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRequestParams, setLastRequestParams] = useState(null); // To store the params of the last successful fetch

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/forecastData`;
  // warehouseUrl is defined globally in this file but not used as a dependency in fetchData
  // because it's read directly when fetchData is called. This is existing behavior.
  let warehouseUrl = window.localStorage.getItem('iot_url');
  if (warehouseUrl === 'false') {
    warehouseUrl = 'https://hs-dev-warehouse.helixsense.com';
  }

  const fetchData = useCallback(async (bodyParams, forceRefresh = false) => {
    // Using JSON.stringify for param comparison as lodash.isEqual is not available.
    // Note: This can be sensitive to key order if not consistent.
    const paramsChanged = JSON.stringify(lastRequestParams) !== JSON.stringify(bodyParams);

    if (apiData !== null && !forceRefresh && !paramsChanged) {
      console.log('Returning cached API data (params unchanged)');
      return;
    }

    console.log(`Fetching API data. ForceRefresh: ${forceRefresh}, ParamsChanged: ${paramsChanged}. New Params:`, bodyParams);
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch(WEBAPPAPIURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyParams),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Error fetching forecast data: ${response.status}`);
      }
      const data = await response.json();
      console.log('Full API Response from Context:', data);
      
      let processedData = {};
      // Consolidate data processing logic
      if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].length > 1) {
        if (data[0][0] === 'Data' && data[0][1]?.plot) { // diagnostic.jsx style (plot is primary)
            processedData = data[0][1].plot;
             // If other parts of data[0][1] are needed, they should be merged here.
             // For diagnostic, it also uses Root_Cause_Analysis which might be at data[0][1].Root_Cause_Analysis
            if(data[0][1]?.Root_Cause_Analysis) {
                processedData.Root_Cause_Analysis = data[0][1].Root_Cause_Analysis;
            }
            // For predictive, it also uses metrics which might be at data[0][1].metrics
            if(data[0][1]?.metrics) {
                processedData.metrics = data[0][1].metrics;
            }
            // If the entire data[0][1] is expected by some components (like Prescriptive seems to imply)
            // we might need a more specific check or let components handle it.
            // The original Prescriptive used data[0][1].plot, but also had other hardcoded values.
            // If data[0][1] itself contains everything (plot, RCA, metrics), then this is fine.
            // Let's assume for now plot is the primary, and other things are attached if present.
            // This makes `processedData` primarily the plot, with potential attachments.
        } else if (data[0][1]?.plot) { // Energy.jsx style (plot is primary)
            processedData = data[0][1].plot;
        } else if (data[0][1]) { // Prescriptive.jsx might expect the whole object if no 'plot'
            processedData = data[0][1];
        } else {
             console.warn('API response data[0][1] structure not fully recognized. Storing data[0][1].');
            processedData = data[0][1] || {}; // Fallback for data[0][1]
        }
      } else if (data.data && Array.isArray(data.data)) { // predictive.jsx style (data.data is the array of traces)
        processedData = data; // The whole object is needed (contains data.data, data.layout, data.Root_Cause_Analysis, data.metrics)
      } else if (data.plot) { // Another common pattern for plot data
        processedData = data.plot;
      } else {
        console.warn('API response structure not matching expected formats in Context. Storing raw data or empty object.');
        processedData = data || {}; // Fallback to raw data or empty object if data is null/undefined
      }

      setApiData(processedData);
      setLastRequestParams(bodyParams); // Store the params of this successful fetch
    } catch (err) {
      console.error('Fetch error in Context:', err);
      setError(err.message || 'An error occurred while fetching data.');
      setApiData(null); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [apiData, lastRequestParams, WEBAPPAPIURL]); // Added lastRequestParams

  return (
    <ApiDataContext.Provider value={{ apiData, isLoading, error, fetchData, setApiData }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export { ApiDataContext, ApiDataProvider };
