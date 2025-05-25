import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  CircularProgress,
  IconButton,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { DataGrid } from '@mui/x-data-grid';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../ThemeContext';
import { debounce } from 'lodash'; // Import debounce from lodash

const Item = ({ sx, ...other }) => {
  const { themes } = useTheme();
  return (
    <Box
      sx={[
        (theme) => ({
          bgcolor: themes === 'light' ? '#2D2E2D' : '#fff',
          color: themes === 'light' ? '#FFFFFF' : 'grey.800',
          border: '1px solid',
          borderColor: themes === 'light' ? '#4A4B4A' : 'grey.300',
          p: 2,
          borderRadius: 2,
          textAlign: 'left',
          fontSize: '0.875rem',
          fontWeight: '700',
          marginTop: '5px',
          ...(theme.applyStyles &&
            theme.applyStyles('dark', {
              bgcolor: '#101010',
              color: 'grey.300',
              borderColor: 'grey.800',
            })),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
      className="out-box"
    />
  );
};

const Emission = React.memo(({ headerText }) => { // Memoize the component to prevent unnecessary re-renders
  const { themes } = useTheme();
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [datasetType, setDatasetType] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
    totalRecords: 0,
    totalPages: 0,
  });
  const [naicsPagination, setNaicsPagination] = useState({
    page: 0,
    pageSize: 5,
  });
  const [summary, setSummary] = useState(null);
  const [filterColumn, setFilterColumn] = useState('None');
  const [filterRange, setFilterRange] = useState([0, 1]);
  const [filterActualRange, setFilterActualRange] = useState({ min: 0, max: 0 });
  const [confidenceRange, setConfidenceRange] = useState([0, 0.5]);
  const [lowConfidenceRows, setLowConfidenceRows] = useState([]);
  const [naicsOptions, setNaicsOptions] = useState([]);
  const [corrections, setCorrections] = useState({});
  const [message, setMessage] = useState('');
  const [chartData, setChartData] = useState({
    confidence_data: [],
    emission_data: { labels: [], values: [] },
    record_count_data: [],
  });
  const [loading, setLoading] = useState(false);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const fileInputRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'descending' });
  const [ghgBreakdown, setGhgBreakdown] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/emission`;

  useEffect(() => {
    axios
      .get(`${WEBAPPAPIURL}/get-naics-options/`)
      .then((response) => {
        setNaicsOptions(response.data.naics_options || []);
      })
      .catch((error) => setMessage(`Error fetching NAICS options: ${error.message}`));
  }, []);

  useEffect(() => {
    if (sessionId) {
      const fetchConfidenceData = async () => {
        try {
          const response = await axios.get(`${WEBAPPAPIURL}/get-all-data/`, {
            params: {
              session_id: sessionId,
              page: 1,
              page_size: pagination.totalRecords || 1000,
              filter_column: undefined,
              filter_min: undefined,
              filter_max: undefined,
            },
          });
          const allData = response.data.processed_data.data || [];
          const confidenceScores = allData
            .map((row) => Number(row['Confidence Score']))
            .filter((score) => !isNaN(score) && score >= 0 && score <= 1);

          setChartData((prev) => ({
            ...prev,
            confidence_data: confidenceScores,
          }));
        } catch (error) {
          setMessage(`Error fetching confidence data: ${error.response?.data?.detail || error.message}`);
        }
      };

      fetchConfidenceData();
    }
  }, [sessionId, pagination.totalRecords]);

  useEffect(() => {
    if (sessionId) {
      setLoading(true);
      const fetchData = async () => {
        try {
          let filterMin = null;
          let filterMax = null;
          if (
            filterColumn !== 'None' &&
            ['Amount', 'Emission Factor', 'Total Emission', 'Confidence Score'].includes(filterColumn)
          ) {
            const [mappedMin, mappedMax] = getMappedRangeValues(filterRange);
            filterMin = mappedMin;
            filterMax = mappedMax;
          }

          console.log('Fetching data with params:', {
            session_id: sessionId,
            page: pagination.currentPage,
            page_size: pagination.pageSize,
            filter_column: filterColumn !== 'None' ? filterColumn : undefined,
            filter_min: filterMin,
            filter_max: filterMax,
          });

          const response = await axios.get(`${WEBAPPAPIURL}/get-all-data/`, {
            params: {
              session_id: sessionId,
              page: pagination.currentPage,
              page_size: pagination.pageSize,
              filter_column: filterColumn !== 'None' ? filterColumn : undefined,
              filter_min: filterMin,
              filter_max: filterMax,
            },
          });

          console.log('API Response:', {
            current_page: response.data.processed_data.current_page,
            page_size: response.data.processed_data.page_size,
            total_records: response.data.processed_data.total_records,
            total_pages: response.data.processed_data.total_pages,
            data_length: response.data.processed_data.data?.length || 0,
            data_sample: response.data.processed_data.data?.slice(0, 2),
          });

          const processedData = response.data.processed_data.data || [];
          setProcessedData(processedData);
          setFilteredData(processedData);
          setPagination((prev) => ({
            ...prev,
            currentPage: response.data.processed_data.current_page || 1,
            pageSize: response.data.processed_data.page_size || 5,
            totalRecords: response.data.processed_data.total_records ?? prev.totalRecords,
            totalPages: response.data.processed_data.total_pages || 0,
          }));

          applyConfidenceFilter(processedData, confidenceRange);

          const chartData = response.data.chart_data;
          setChartData((prev) => ({
            ...prev,
            emission_data: {
              labels: Array.isArray(chartData.emission_data?.labels) ? chartData.emission_data.labels : [],
              values: Array.isArray(chartData.emission_data?.values)
                ? chartData.emission_data.values.map((v) => {
                    const num = Number(v);
                    return !isNaN(num) && num >= 0 ? num : 0;
                  })
                : [],
            },
            record_count_data: Array.isArray(chartData.record_count_data)
              ? chartData.record_count_data.map((item) => ({
                  naics: item.naics,
                  title: item.title,
                  count: Number(item.count),
                }))
              : [],
          }));

          setCorrections(response.data.manual_corrections || {});
        } catch (error) {
          console.error('Error fetching data:', error.response?.data || error.message);
          setMessage(`Error fetching data: ${error.response?.data?.detail || error.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [sessionId, pagination.currentPage, pagination.pageSize, filterColumn, filterRange]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setSessionId(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${WEBAPPAPIURL}/upload-and-classify/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSessionId(response.data.session_id || null);
      setDatasetType(response.data.dataset_type || null);
      setSummary(response.data.summary || null);
      setMessage('Data classified successfully.');
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    } catch (error) {
      setMessage(`Error classifying data: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyConfidenceFilter = (data, range) => {
    const lowConfidence = data.filter((row) => {
      const score = Number(row['Confidence Score']);
      return !isNaN(score) && score >= range[0] && score <= range[1];
    });
    const indexedLowConfidence = lowConfidence.map((row, idx) => {
      const originalIdx = processedData.findIndex(
        (pRow) =>
          pRow.Description === row.Description &&
          pRow['NAICS Code'] === row['NAICS Code'] &&
          pRow['Confidence Score'] === row['Confidence Score'],
      );
      return {
        ...row,
        originalIndex: originalIdx >= 0 ? originalIdx : idx,
      };
    });
    setLowConfidenceRows(indexedLowConfidence.sort((a, b) => a['Confidence Score'] - b['Confidence Score']));
  };

  const handleFilterChange = (e) => {
    const newFilterColumn = e.target.value;
    setFilterColumn(newFilterColumn);
    if (newFilterColumn === 'None') {
      setFilteredData([...processedData]);
      applyConfidenceFilter(processedData, confidenceRange);
      setFilterRange([0, 1]);
      setFilterActualRange({ min: 0, max: 0 });
    } else {
      if (['Amount', 'Emission Factor', 'Total Emission', 'Confidence Score'].includes(newFilterColumn)) {
        const values = processedData.map((row) => Number(row[newFilterColumn])).filter((v) => !isNaN(v));
        let actualMin;
        let actualMax;
        if (newFilterColumn === 'Confidence Score') {
          actualMin = 0;
          actualMax = 1;
        } else {
          actualMin = values.length > 0 ? Math.floor(Math.min(...values)) : 0;
          actualMax = values.length > 0 ? Math.ceil(Math.max(...values)) : 0;
          if (actualMax - actualMin < 1) {
            actualMax = actualMin + 1;
          }
        }
        setFilterActualRange({ min: actualMin, max: actualMax });
        setFilterRange([0, 1]);
      }
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  };

  const handleRangeChange = (values) => {
    setFilterRange(values);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleConfidenceRangeChange = (values) => {
    setConfidenceRange(values);
    applyConfidenceFilter(filteredData, values);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const handleCorrection = async (index, newNaics, originalNaics) => {
    if (!sessionId || !datasetType || !newNaics || isNaN(parseInt(index))) {
      setMessage('Cannot apply correction: Missing required fields.');
      return;
    }

    setLoading(true);
    try {
      const originalNaicsStr = String(originalNaics).split(',')[0].trim();
      const newNaicsStr = String(newNaics).trim();
      const needsRecalculation = originalNaicsStr !== newNaicsStr;

      const payload = {
        session_id: sessionId,
        index: parseInt(index),
        new_naics: newNaicsStr,
        dataset_type: datasetType,
        recalculate: needsRecalculation,
      };

      const response = await axios.post(`${WEBAPPAPIURL}/update-entry/`, payload);
      setProcessedData(response.data.data || []);
      setFilteredData(response.data.data || []);
      applyConfidenceFilter(response.data.data || [], confidenceRange);
      setCorrections((prev) => ({ ...prev, [index]: newNaicsStr }));
      setMessage(
        needsRecalculation
          ? 'Entry updated and recalculated successfully.'
          : 'Entry updated successfully. No recalculation needed.',
      );
    } catch (error) {
      setMessage(`Error updating entry: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyAllCorrections = async () => {
    if (!sessionId || !datasetType) {
      setMessage('Session or dataset type not available.');
      return;
    }

    if (Object.keys(corrections).length === 0) {
      setMessage('No corrections to apply.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${WEBAPPAPIURL}/apply-all-corrections/`, {
        session_id: sessionId,
        dataset_type: datasetType,
        corrections,
      });
      setProcessedData(response.data.data || []);
      setFilteredData(response.data.data || []);
      applyConfidenceFilter(response.data.data || [], confidenceRange);
      setMessage('All corrections applied successfully.');
    } catch (error) {
      setMessage(`Error applying corrections: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validateAndSave = async () => {
    if (!sessionId || !datasetType) {
      setMessage('Session or dataset type not available.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${WEBAPPAPIURL}/validate-and-save/`, {
        session_id: sessionId,
        dataset_type: datasetType,
        manual_corrections: corrections,
      });
      setMessage(response.data.message + (response.data.retrain_result ? ` ${response.data.retrain_result}` : ''));
      setShowNextSteps(true);
    } catch (error) {
      setMessage(`Error validating and saving: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startOver = async () => {
    setLoading(true);
    try {
      await axios.post(`${WEBAPPAPIURL}/reset/`);
      setFile(null);
      setSessionId(null);
      setDatasetType(null);
      setProcessedData([]);
      setFilteredData([]);
      setSummary(null);
      setFilterColumn('None');
      setFilterRange([0, 1]);
      setFilterActualRange({ min: 0, max: 0 });
      setConfidenceRange([0, 0.5]);
      setLowConfidenceRows([]);
      setCorrections({});
      setChartData({
        confidence_data: [],
        emission_data: { labels: [], values: [] },
        record_count_data: [],
      });
      setShowNextSteps(false);
      setPagination({
        currentPage: 1,
        pageSize: 5,
        totalRecords: 0,
        totalPages: 0,
      });
      setNaicsPagination({
        page: 0,
        pageSize: 5,
      });
      setMessage('Application reset. Please upload new data.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setMessage(`Error resetting application: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!filteredData.length) {
      setMessage('No data to download.');
      return;
    }
    const csv = convertToCSV(filteredData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'classified_scope3_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0])
      .filter((col) => col !== 'index')
      .join(',');
    const rows = data
      .map((row) =>
        Object.entries(row)
          .filter(([col]) => col !== 'index')
          .map(([_, val]) => `"${(val ?? '').toString().replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n');
    return `${headers}\n${rows}`;
  };

  const getHistogramData = () => {
    const validData = chartData.confidence_data.filter((v) => !isNaN(v) && v >= 0 && v <= 1);
    if (validData.length === 0) return [];

    const numBins = 20;
    const binSize = 1 / numBins;
    const bins = Array.from({ length: numBins }, (_, i) => ({
      bin: `${(i * binSize).toFixed(2)} - ${((i + 1) * binSize).toFixed(2)}`,
      count: 0,
    }));

    validData.forEach((value) => {
      const binIndex = Math.min(Math.floor(value / binSize), numBins - 1);
      bins[binIndex].count += 1;
    });

    return bins;
  };

  const getNaicsCountData = () => {
    console.log('Raw record_count_data:', chartData.record_count_data);

    const data = chartData.record_count_data.map((item) => {
      const countValue = Number(item.count);
      return {
        name: `${item.naics} - ${item.title}`,
        count: isNaN(countValue) ? 0 : countValue,
      };
    });

    console.log('Processed NAICS Count Data:', data);

    return [...data].sort((a, b) => {
      if (sortConfig.key === 'name') {
        const aValue = parseInt(a.name.split(' - ')[0]);
        const bValue = parseInt(b.name.split(' - ')[0]);
        return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }
      return sortConfig.direction === 'ascending' ? a.count - b.count : b.count - a.count;
    });
  };

  const columns =
    datasetType === 'capital_goods'
      ? [
          { field: 'Serial Number', headerName: 'Serial Number', width: 150 },
          { field: 'Year', headerName: 'Year', width: 100 },
          { field: 'Site', headerName: 'Site', width: 120 },
          { field: 'Description', headerName: 'Description', width: 200 },
          { field: 'Refined Description', headerName: 'Refined Description', width: 200 },
          { field: 'NAICS Code', headerName: 'NAICS Code', width: 120 },
          { field: 'NAICS with N', headerName: 'NAICS with N', width: 120 },
          { field: 'USEEIO Code', headerName: 'USEEIO Code', width: 120 },
          {
            field: 'Emission Factor',
            headerName: 'Emission Factor',
            width: 150,
            renderCell: (params) => {
              const naicsCodes = String(params.row['NAICS Code']).trim();
              const emissionFactor = params.row['Emission Factor'];
              const idx = params.row.id;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                    {emissionFactor !== undefined ? emissionFactor.toString() : ''}
                  </Typography>
                  {naicsCodes && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        cursor: 'pointer',
                        color: themes === 'light' ? '#00FF00' : '#008000',
                      }}
                      onMouseEnter={() => handleEmissionFactorHover(naicsCodes, idx)}
                      onMouseLeave={handleEmissionFactorLeave}
                    >
                      i
                    </Box>
                  )}
                  {showTooltip === idx && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bgcolor: '#000000',
                        color: '#FFFFFF',
                        p: 2,
                        borderRadius: 2,
                        zIndex: 1000,
                        top: '100%',
                        left: 0,
                        width: '300px',
                      }}
                    >
                      <Typography variant="h6">GHG Breakdown</Typography>
                      <Typography>
                        <strong>Total Emission Factor:</strong>{' '}
                        {emissionFactor !== undefined ? emissionFactor.toExponential(2) : 'N/A'}{' '}
                        kg CO2e
                      </Typography>
                      {ghgBreakdown && Object.keys(ghgBreakdown).length > 0 ? (
                        Object.entries(ghgBreakdown).map(([naicsCode, breakdown]) => {
                          const totalContribution = breakdown.reduce(
                            (sum, item) => sum + item.value,
                            0,
                          );
                          return (
                            <Box key={naicsCode}>
                              <Typography variant="h6">
                                NAICS {naicsCode}
                              </Typography>
                              <Typography>
                                <strong>Sum of Contributions:</strong>{' '}
                                {totalContribution.toExponential(2)} kg CO2e
                              </Typography>
                              {breakdown && breakdown.length > 0 ? (
                                <>
                                  <ul>
                                    {breakdown
                                      .filter((item) => item.value > 1e-6)
                                      .map((item, i) => (
                                        <li key={i}>
                                          {item.gas}: {item.value.toExponential(2)} kg CO2e
                                        </li>
                                      ))}
                                  </ul>
                                  <Typography variant="caption">
                                    *Note: Sum of contributions may slightly differ from Total
                                    Emission Factor due to rounding or excluded minor gases (below
                                    1e-6 kg CO2e).
                                  </Typography>
                                </>
                              ) : (
                                <Typography>
                                  No significant GHG contributions for NAICS {naicsCode}.
                                </Typography>
                              )}
                            </Box>
                          );
                        })
                      ) : (
                        <Typography>
                          No significant GHG contributions found for this record.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              );
            },
          },
          { field: 'UoM (Emission Factor)', headerName: 'UoM (Emission Factor)', width: 150 },
          { field: 'Total Emission', headerName: 'Total Emission', width: 150 },
          { field: 'UoM (Total Emission)', headerName: 'UoM (Total Emission)', width: 150 },
          { field: 'Amount', headerName: 'Amount', width: 120 },
          { field: 'Confidence Score', headerName: 'Confidence Score', width: 150 },
        ]
      : [
          { field: 'Serial Number', headerName: 'Serial Number', width: 150 },
          { field: 'Year', headerName: 'Year', width: 100 },
          { field: 'Description', headerName: 'Description', width: 200 },
          { field: 'Refined Description', headerName: 'Refined Description', width: 200 },
          { field: 'NAICS Code', headerName: 'NAICS Code', width: 120 },
          {
            field: 'Emission Factor',
            headerName: 'Emission Factor',
            width: 150,
            renderCell: (params) => {
              const naicsCodes = String(params.row['NAICS Code']).trim();
              const emissionFactor = params.row['Emission Factor'];
              const idx = params.row.id;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                    {emissionFactor !== undefined ? emissionFactor.toString() : ''}
                  </Typography>
                  {naicsCodes && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        cursor: 'pointer',
                        color: themes === 'light' ? '#00FF00' : '#008000',
                      }}
                      onMouseEnter={() => handleEmissionFactorHover(naicsCodes, idx)}
                      onMouseLeave={handleEmissionFactorLeave}
                    >
                      i
                    </Box>
                  )}
                  {showTooltip === idx && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bgcolor: '#000000',
                        color: '#FFFFFF',
                        p: 2,
                        borderRadius: 2,
                        zIndex: 1000,
                        top: '100%',
                        left: 0,
                        width: '300px',
                      }}
                    >
                      <Typography variant="h6">GHG Breakdown</Typography>
                      <Typography>
                        <strong>Total Emission Factor:</strong>{' '}
                        {emissionFactor !== undefined ? emissionFactor.toExponential(2) : 'N/A'}{' '}
                        kg CO2e
                      </Typography>
                      {ghgBreakdown && Object.keys(ghgBreakdown).length > 0 ? (
                        Object.entries(ghgBreakdown).map(([naicsCode, breakdown]) => {
                          const totalContribution = breakdown.reduce(
                            (sum, item) => sum + item.value,
                            0,
                          );
                          return (
                            <Box key={naicsCode}>
                              <Typography variant="h6">
                                NAICS {naicsCode}
                              </Typography>
                              <Typography>
                                <strong>Sum of Contributions:</strong>{' '}
                                {totalContribution.toExponential(2)} kg CO2e
                              </Typography>
                              {breakdown && breakdown.length > 0 ? (
                                <>
                                  <ul>
                                    {breakdown
                                      .filter((item) => item.value > 1e-6)
                                      .map((item, i) => (
                                        <li key={i}>
                                          {item.gas}: {item.value.toExponential(2)} kg CO2e
                                        </li>
                                      ))}
                                  </ul>
                                  <Typography variant="caption">
                                    *Note: Sum of contributions may slightly differ from Total
                                    Emission Factor due to rounding or excluded minor gases (below
                                    1e-6 kg CO2e).
                                  </Typography>
                                </>
                              ) : (
                                <Typography>
                                  No significant GHG contributions for NAICS {naicsCode}.
                                </Typography>
                              )}
                            </Box>
                          );
                        })
                      ) : (
                        <Typography>
                          No significant GHG contributions found for this record.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              );
            },
          },
          { field: 'UoM (Emission Factor)', headerName: 'UoM (Emission Factor)', width: 150 },
          { field: 'Total Emission', headerName: 'Total Emission', width: 150 },
          { field: 'UoM (Total Emission)', headerName: 'UoM (Total Emission)', width: 150 },
          { field: 'Amount', headerName: 'Amount', width: 120 },
          { field: 'UoM (Amount)', headerName: 'UoM (Amount)', width: 120 },
          { field: 'Confidence Score', headerName: 'Confidence Score', width: 150 },
        ];

  const lowConfidenceColumns = [
    {
      field: 'originalIndex',
      headerName: '#',
      width: 100,
      valueGetter: (params) => params.row.originalIndex + 1,
    },
    { field: 'Description', headerName: 'Description', width: 200 },
    { field: 'NAICS Code', headerName: 'Predicted NAICS Code', width: 150 },
    {
      field: 'Correct NAICS Code',
      headerName: 'Correct NAICS Code',
      width: 300,
      renderCell: (params) => (
        <FormControl fullWidth>
          <Select
            value={corrections[params.row.originalIndex] || params.row['NAICS Code']}
            onChange={(e) => {
              const newNaics = e.target.value;
              setCorrections((prev) => ({
                ...prev,
                [params.row.originalIndex]: newNaics,
              }));
            }}
            disabled={loading}
            sx={{
              color: themes === 'light' ? '#FFFFFF' : '#000000',
              backgroundColor: themes === 'light' ? '#4A4B4A' : '#E4E4ED',
              '& .MuiSvgIcon-root': { color: themes === 'light' ? '#FFFFFF' : '#000000' },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: themes === 'light' ? '#FFFFFF' : '#000000',
              },
            }}
          >
            {naicsOptions.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.code} - {option.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() =>
            handleCorrection(
              params.row.originalIndex,
              corrections[params.row.originalIndex] || params.row['NAICS Code'],
              params.row['NAICS Code'],
            )
          }
          disabled={loading}
          sx={{
            bgcolor: themes === 'light' ? '#09684C' : '#0B694C',
            color: '#FFFFFF',
            '&:hover': { bgcolor: themes === 'light' ? '#084C38' : '#09553C' },
          }}
        >
          Apply
        </Button>
      ),
    },
  ];

  // Debounced handlers to prevent rapid state updates that might cause reloads
  const debouncedPageChange = useCallback(
    debounce((newPage) => {
      console.log('Changing page to:', newPage + 1);
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage + 1,
      }));
    }, 300),
    []
  );

  const debouncedPageSizeChange = useCallback(
    debounce((newPageSize) => {
      console.log('Changing page size to:', newPageSize);
      setPagination((prev) => ({
        ...prev,
        pageSize: newPageSize,
        currentPage: 1,
        totalPages: Math.ceil(prev.totalRecords / newPageSize),
      }));
    }, 300),
    []
  );

  const handlePageChange = (newPage) => {
    debouncedPageChange(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    debouncedPageSizeChange(newPageSize);
  };

  const handleNaicsPageChange = (params) => {
    setNaicsPagination({
      page: params.page,
      pageSize: params.pageSize,
    });
  };

  const handleEmissionFactorHover = async (naicsCodes, index) => {
    if (!sessionId || !datasetType) return;

    try {
      const response = await axios.get(
        `${WEBAPPAPIURL}/get-ghg-breakdown/?session_id=${sessionId}&naics_codes=${naicsCodes}&dataset_type=${datasetType}`,
      );
      setGhgBreakdown(response.data.ghg_breakdown_by_naics || {});
      setShowTooltip(index);
    } catch (error) {
      setGhgBreakdown({});
      setShowTooltip(null);
    }
  };

  const handleEmissionFactorLeave = () => {
    setShowTooltip(null);
    setGhgBreakdown(null);
  };

  const getMappedRangeValues = (normalizedRange) => {
    let actualMin;
    let actualMax;
    if (filterColumn === 'Confidence Score') {
      actualMin = 0;
      actualMax = 1;
    } else {
      actualMin = filterActualRange.min;
      actualMax = filterActualRange.max;
    }
    const mappedMin = actualMin + (actualMax - actualMin) * normalizedRange[0];
    const mappedMax = actualMin + (actualMax - actualMin) * normalizedRange[1];
    return [mappedMin, mappedMax];
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'row',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(0, 1fr)' },
        gap: 5,
        padding: 2,
        bgcolor: themes === 'light' ? '#1A1B1A' : '#FDFCFE',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ gridColumn: { xs: '1', md: '1 / 6' }, gridRow: '1 / 5' }}>
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: '5px',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {headerText && <p className="p-2 font-weight-800">{headerText}</p>}
        <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'nowrap', overflowX: 'auto' }}>
          <Item sx={{ flex: '0 0 30%', minWidth: 250 }}>
            <Typography
              variant="h6"
              sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
              className="diagnostic-tit"
            >
              Step 1: Upload and Classify Data
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <TextField
                type="file"
                inputProps={{ accept: '.xlsx' }}
                onChange={handleFileChange}
                inputRef={fileInputRef}
                disabled={loading}
                sx={{
                  '& .MuiInputBase-root': {
                    color: themes === 'light' ? '#FFFFFF' : '#000000',
                    backgroundColor: themes === 'light' ? '#4A4B4A' : '#E4E4ED',
                  },
                  '& .MuiInputBase-input': {
                    marginTop: '-8px',
                  },
                }}
              />
            </FormControl>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading || !file}
              sx={{
                mt: 2,
                bgcolor: themes === 'light' ? '#09684C' : '#0B694C',
                color: '#FFFFFF',
                '&:hover': { bgcolor: themes === 'light' ? '#084C38' : '#09553C' },
              }}
            >
              {loading ? 'Classifying...' : 'Classify Data'}
            </Button>
          </Item>

          {summary && (
            <Item sx={{ flex: '0 0 70%', minWidth: 250 }}>
              <Typography
                variant="h6"
                sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                className="diagnostic-tit"
              >
                Data Summary
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 2,
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <Item>
                  <Typography
                    sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                    className="ft-15"
                  >
                    Total Records
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}
                    className="ft-15"
                  >
                    {summary.total_records}
                  </Typography>
                </Item>
                <Item>
                  <Typography
                    sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                    className="ft-15"
                  >
                    Average Confidence
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}
                    className="ft-15"
                  >
                    {(summary.avg_confidence * 100).toFixed(2)}%
                  </Typography>
                </Item>
                <Item>
                  <Typography
                    sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                    className="ft-15"
                  >
                    Needs Review ({'<'}
                    50%)
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}
                    className="ft-15"
                  >
                    {summary.total_low_confidence} ({summary.low_confidence_pct.toFixed(1)}
                    %)
                  </Typography>
                </Item>
                <Item>
                  <Typography
                    sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                    className="ft-15"
                  >
                    Emission Range
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: themes === 'light' ? '#00FF00' : '#008000' }}
                    className="ft-15"
                  >
                    {summary.emission_range}
                  </Typography>
                </Item>
              </Box>
            </Item>
          )}
        </Box>

        {processedData.length > 0 && !showNextSteps && (
          <>
            <Item sx={{ gridColumn: '1 / 5' }}>
              <Typography
                variant="h6"
                sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                className="diagnostic-tit"
              >
                Step 2: View Classified Emissions
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                  <strong>Data Type:</strong> {datasetType?.replace('_', ' ')}
                </Typography>
                <IconButton
                  onClick={downloadCSV}
                  disabled={loading}
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    '&:hover': {
                      bgcolor: themes === 'light' ? '#2C2D2C' : 'white',
                    },
                  }}
                  aria-label="Download as CSV"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    cursor="pointer"
                    className="expand-icon mr-2"
                    height="30"
                    width="30"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                {filterColumn !== 'None' && (
                  filterActualRange.min !== filterActualRange.max ? (
                    <Box sx={{ width: 300 }}>
                      <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                        Filter {filterColumn}
                      </Typography>
                      <Slider
                        range
                        min={0}
                        max={1}
                        value={filterRange}
                        onChange={handleRangeChange}
                        step={0.01}
                        disabled={loading}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                          {filterRange[0].toFixed(2)} ({getMappedRangeValues(filterRange)[0].toFixed(2)})
                        </Typography>
                        <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                          {filterRange[1].toFixed(2)} ({getMappedRangeValues(filterRange)[1].toFixed(2)})
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                      All values are the same. Filtering by slider is not applicable.
                    </Typography>
                  )
                )}
              </Box>

              <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                <DataGrid
                  rows={filteredData.map((row, index) => ({ id: index, ...row }))}
                  columns={columns}
                  pageSizeOptions={[5, 10, 20, 50]}
                  paginationModel={{
                    page: pagination.currentPage - 1,
                    pageSize: pagination.pageSize,
                  }}
                  onPaginationModelChange={(newModel) => {
                    handlePageChange(newModel.page);
                    if (newModel.pageSize !== pagination.pageSize) {
                      handlePageSizeChange(newModel.pageSize);
                    }
                  }}
                  rowCount={pagination.totalRecords}
                  paginationMode="server"
                  disableSelectionOnClick
                  sx={{
                    bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                    color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    '& .MuiDataGrid-root': {
                      bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    },
                    '& .MuiDataGrid-cell': {
                      bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    },
                    '& .MuiDataGrid-row': {
                      bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                      '&:hover': {
                        bgcolor: themes === 'light' ? '#2C2D2C !important' : '#F0F0F0 !important',
                      },
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      bgcolor: themes === 'light' ? '#1E1F1E !important' : '#F5F5F5 !important',
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                      fontWeight: 'bold',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    },
                    '& .MuiDataGrid-footerContainer': {
                      bgcolor: themes === 'light' ? '#1E1F1E !important' : '#E4E4ED !important',
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    },
                    '& .MuiTablePagination-root': {
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    },
                    '& .MuiDataGrid-columnSeparator': {
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    },
                    '& .MuiDataGrid-sortIcon': {
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    },
                    '& .MuiDataGrid-menuIconButton': {
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    },
                    '& .MuiDataGrid-overlay': {
                      bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                      color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                      bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                    },
                  }}
                />
              </Box>
            </Item>

            <Item sx={{ gridColumn: '1 / 5' }}>
              <Typography
                variant="h6"
                sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                className="diagnostic-tit"
              >
                Data Insights
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                    className="diagnostic-tit"
                  >
                    Confidence Score Distribution
                  </Typography>
                  {chartData.confidence_data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={getHistogramData()}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="bin" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#1599E0" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                      No confidence data available.
                    </Typography>
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                    className="diagnostic-tit"
                  >
                    Record Count by NAICS Code
                  </Typography>
                  {getNaicsCountData().length > 0 ? (
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={getNaicsCountData().map((item, index) => ({ id: index, ...item }))}
                        columns={[
                          {
                            field: 'name',
                            headerName: 'NAICS Code',
                            width: 470,
                            sortable: true,
                            renderCell: (params) => (
                              <Typography
                                onClick={() => handleSort('name')}
                                sx={{
                                  cursor: 'pointer',
                                  color: themes === 'light' ? '#FFFFFF' : '#000000',
                                }}
                              >
                                {params.value}
                                {sortConfig.key === 'name' &&
                                  (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                              </Typography>
                            ),
                          },
                          {
                            field: 'count',
                            headerName: 'Count',
                            width: 100,
                            sortable: true,
                            renderCell: (params) => {
                              const countValue = params.value ?? 0;
                              return (
                                <Typography
                                  onClick={() => handleSort('count')}
                                  sx={{
                                    cursor: 'pointer',
                                    color: themes === 'light' ? '#FFFFFF' : '#000000',
                                    backgroundColor: 'transparent',
                                  }}
                                >
                                  {countValue}
                                  {/* Removed the sorting arrow (↑ or ↓) as requested */}
                                </Typography>
                              );
                            },
                          },
                        ]}
                        pageSizeOptions={[5, 10, 20]}
                        paginationModel={{
                          page: naicsPagination.page,
                          pageSize: naicsPagination.pageSize,
                        }}
                        onPaginationModelChange={handleNaicsPageChange}
                        rowCount={getNaicsCountData().length}
                        disableSelectionOnClick
                        sx={{
                          bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                          color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          '& .MuiDataGrid-root': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-cell': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-row': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                            '&:hover': {
                              bgcolor: themes === 'light' ? '#2C2D2C !important' : '#F0F0F0 !important',
                            },
                          },
                          '& .MuiDataGrid-columnHeaders': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#F5F5F5 !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                            fontWeight: 'bold',
                          },
                          '& .MuiDataGrid-columnHeaderTitle': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-footerContainer': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#E4E4ED !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiTablePagination-root': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-columnSeparator': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-sortIcon': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-menuIconButton': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-overlay': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-virtualScroller': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                          },
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                      No record count data available.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Item>

            <Box sx={{ gridColumn: '1 / 5' }}>
              <Item>
                <Typography
                  variant="h6"
                  sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
                  className="diagnostic-tit"
                >
                  Step 3: Review the Low Confidence Predictions
                </Typography>
                <Box sx={{ mt: 2, width: 300 }}>
                  <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                    Confidence Score Range
                  </Typography>
                  <Slider
                    range
                    min={0}
                    max={1}
                    step={0.01}
                    value={confidenceRange}
                    onChange={handleConfidenceRangeChange}
                    disabled={loading}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                      {confidenceRange[0].toFixed(2)}
                    </Typography>
                    <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                      {confidenceRange[1].toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {lowConfidenceRows.length > 0 ? (
                  <>
                    <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                      <DataGrid
                        rows={lowConfidenceRows.map((row, index) => ({ id: index, ...row }))}
                        columns={lowConfidenceColumns}
                        pageSizeOptions={[5, 10, 20, 50]}
                        paginationModel={{ page: 0, pageSize: 5 }}
                        disableSelectionOnClick
                        sx={{
                          bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                          color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          '& .MuiDataGrid-root': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-cell': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-row': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                            '&:hover': {
                              bgcolor: themes === 'light' ? '#2C2D2C !important' : '#F0F0F0 !important',
                            },
                          },
                          '& .MuiDataGrid-columnHeaders': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#F5F5F5 !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                            fontWeight: 'bold',
                          },
                          '& .MuiDataGrid-columnHeaderTitle': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-footerContainer': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#E4E4ED !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiTablePagination-root': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-columnSeparator': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-sortIcon': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-menuIconButton': {
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-overlay': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                            color: themes === 'light' ? '#FFFFFF !important' : '#000000 !important',
                          },
                          '& .MuiDataGrid-virtualScroller': {
                            bgcolor: themes === 'light' ? '#1E1F1E !important' : '#FDFCFE !important',
                          },
                        }}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      onClick={applyAllCorrections}
                      disabled={loading || Object.keys(corrections).length === 0}
                      sx={{
                        mt: 2,
                        bgcolor: themes === 'light' ? '#09684C' : '#0B694C',
                        color: '#FFFFFF',
                        '&:hover': { bgcolor: themes === 'light' ? '#084C38' : '#09553C' },
                      }}
                    >
                      Apply All Corrections
                    </Button>
                  </>
                ) : (
                  <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', mt: 2 }}>
                    No rows with confidence score in the selected range.
                  </Typography>
                )}
              </Item>
            </Box>

            <Box sx={{ gridColumn: '1 / 5', display: 'flex', justifyContent: 'center' }}>
              <Item sx={{ maxWidth: 300, width: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', textAlign: 'center' }}
                  className="diagnostic-tit"
                >
                  Step 4: Validate and Save
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={validateAndSave}
                    disabled={loading}
                    sx={{
                      bgcolor: themes === 'light' ? '#09684C' : '#0B694C',
                      color: '#FFFFFF',
                      '&:hover': { bgcolor: themes === 'light' ? '#084C38' : '#09553C' },
                    }}
                  >
                    Validate and Save
                  </Button>
                </Box>
              </Item>
            </Box>
          </>
        )}

        {showNextSteps && (
          <Item>
            <Typography
              variant="h6"
              sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}
            >
              Next Steps
            </Typography>
            <Typography sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000', mt: 1 }}>
              Data has been validated and saved successfully.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={startOver}
                disabled={loading}
                sx={{
                  bgcolor: themes === 'light' ? '#09684C' : '#0B694C',
                  color: '#FFFFFF',
                  '&:hover': { bgcolor: themes === 'light' ? '#084C38' : '#09553C' },
                }}
              >
                Start Over
              </Button>
            </Box>
          </Item>
        )}
      </Box>
    </Box>
  );
});

export default Emission;