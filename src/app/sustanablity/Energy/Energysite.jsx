import React, { useEffect, useState } from 'react';
import {
  useMediaQuery,
  Box,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Typography,
  Tooltip,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Button,
} from '@mui/material';
import axios from 'axios';
import Plot from 'react-plotly.js';
import ReactMarkdown from 'react-markdown';
import { Bolt as BoltIcon } from '@mui/icons-material';
import PlotTypeSelector from './sustainablity/Plotselect';
import Card from './CardRes';
import CardHeader from './CardHeaderRes';
import { useTheme } from '../../ThemeContext';

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
          p: 1,
          borderRadius: 2,
          textAlign: 'left',
          fontSize: '0.875rem',
          fontWeight: '700',
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

const Sustainability = ({ showBackButton, onBackButtonClick, headerText }) => {
  const [plotData, setPlotData] = useState({});
  const [allPlotData, setAllPlotData] = useState([]); // New state to store all period data
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [isLoading, setIsLoading] = useState(true);
  const [explanation, setExplanation] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [copyStatus, setCopyStatus] = useState([]);
  const [loadingIcons, setLoadingIcons] = useState({});
  const [isAiIconVisible, setIsAiIconVisible] = useState({});
  const [dragging, setDragging] = useState(false);
  const { themes } = useTheme();
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const isMobile = useMediaQuery('(max-width: 768px)');
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/energysite`;

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value;
    setSelectedPeriod(newPeriod);
    // Filter allPlotData locally instead of making a new API call
    const data = allPlotData.find((item) => item[0] === newPeriod);
    if (data) {
      setPlotData(data[1]);
      setError('');
    } else {
      setError('No data found for the selected period.');
      setPlotData({});
    }
  };

  useEffect(() => {
    const fetchAllPlotData = async () => {
      setIsLoading(true);
      try {
        // Fetch data for all periods in a single call
        const response = await axios.post(`${WEBAPPAPIURL}/forecast`, {});
        setAllPlotData(response.data); // Store all data
        // Set initial plotData for the default period ('Today')
        const initialData = response.data.find((item) => item[0] === selectedPeriod);
        if (initialData) {
          setPlotData(initialData[1]);
          setError('');
        } else {
          setError('No data found for the selected period.');
          setPlotData({});
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'An error occurred while fetching the plot data.');
        setPlotData({});
        setAllPlotData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPlotData();
  }, []); // Empty dependency array to run only on mount

  const fetchExplanation = async (period, chartType) => {
    setLoadingIcons((prevState) => ({ ...prevState, [chartType]: true }));
    try {
      const response = await axios.get(
        `${WEBAPPAPIURL}/explain_ai/explain_chart`, // Updated to use WEBAPPAPIURL
        { params: { period, chart_type: chartType } },
      );
      const explanationData = {
        explanation: response.data.explanation,
        title: getTitle(chartType),
        subtitle: getSubtitle(chartType),
        chart_type: chartType,
      };
      setExplanation(explanationData);
      setOpenModal(true);
    } catch (error) {
      console.error('Error:', error);
      setError(
        error.response?.data?.error ||
        (error.request ? 'No response received from the server' : 'Error setting up the request'),
      );
    } finally {
      setLoadingIcons((prevState) => ({ ...prevState, [chartType]: false }));
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const getTitle = (chartType) => {
    switch (chartType) {
      case 'consumption_plot':
      case 'pie':
      case 'eb_tco2_plot':
      case 'dg_tco2_plot':
      case 'solar_energy_plot':
      case 'utility_plot':
      case 'trend_plot':
      case 'EUI':
      case 'EIO':
        return 'AI - Overview  |';
      default:
        return 'AI Overview |';
    }
  };

  const getSubtitle = (chartType) => {
    switch (chartType) {
      case 'pie':
        return 'Energy By Sources';
      case 'consumption_plot':
        return 'Energy Prediction';
      case 'eb_tco2_plot':
        return 'Carbon Emission (EB)';
      case 'dg_tco2_plot':
        return 'Carbon Emission (DG)';
      case 'solar_energy_plot':
        return 'Green Energy Consumption';
      case 'utility_plot':
        return 'Energy By Utility';
      case 'trend_plot':
        return 'Energy Trend by Sources';
      case 'EUI':
        return 'Energy Use Intensity';
      case 'EIO':
        return 'Energy Intensity Per Capita';
      default:
        return '';
    }
  };

  const theme = createTheme({
    components: {
      MuiRadio: {
        styleOverrides: {
          root: {
            color: themes === 'light' ? '#FFFFFF' : '#000000',
          },
        },
      },
    },
  });

  const customLayout = {
    paper_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
    plot_bgcolor: themes === 'light' ? '#2D2E2D' : '#FEFDFE',
    font: {
      color: themes === 'light' ? '#FFFFFF' : '#000000',
      family: 'Mulish, sans-serif',
    },
    xaxis: {
      showgrid: false,
      zeroline: false,
      showline: false,
      tickfont: { color: themes === 'light' ? '#FFFFFF' : '#000000' },
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      showline: false,
      tickfont: { color: themes === 'light' ? '#FFFFFF' : '#000000' },
    },
    showlegend: true,
    annotations: [
      {
        font: {
          color: themes === 'light' ? '#FFFFFF' : '#000000',
        },
      },
    ],
    margin: {
      t: 50,
      l: 30,
      r: 30,
      b: 30,
    },
  };

  const aiIcon = (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.4 }}
    >
      <circle cx="15" cy="15" r="15" fill="#2D2D2D" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.7931 21.3048C11.7405 21.7026 11.4013 22 11 22C10.5986 22 10.2594 21.7026 10.2069 21.3048L10.206 21.2984L10.2023 21.2719C10.1988 21.2477 10.1934 21.2108 10.1858 21.1624C10.1706 21.0657 10.1471 20.9237 10.1142 20.7478C10.048 20.3951 9.94496 19.9107 9.79736 19.3833C9.49016 18.2851 9.03336 17.1647 8.43431 16.5657C7.83526 15.9666 6.7149 15.5098 5.61666 15.2026C5.08929 15.055 4.60489 14.952 4.25218 14.8858C4.0763 14.8529 3.93434 14.8294 3.83759 14.8142C3.78925 14.8066 3.75228 14.8012 3.7281 14.7977L3.70163 14.794L3.69594 14.7932C3.69601 14.7932 3.69586 14.7932 3.69594 14.7932C3.29732 14.7405 3 14.4013 3 14C3 13.5986 3.29737 13.2594 3.69523 13.2069L3.70163 13.206L3.7281 13.2023C3.75228 13.1988 3.78925 13.1934 3.83759 13.1858C3.93434 13.1706 4.0763 13.1471 4.25218 13.1142C4.60489 13.048 5.08929 12.945 5.61666 12.7974C6.7149 12.4902 7.83526 12.0334 8.43431 11.4343C9.03336 10.8353 9.49016 9.71488 9.79736 8.61664C9.94496 8.08928 10.048 7.60488 10.1142 7.25216C10.1471 7.07632 10.1706 6.93432 10.1858 6.8376C10.1934 6.78928 10.1988 6.75232 10.2023 6.72808L10.206 6.7016L10.2068 6.69592C10.2068 6.696 10.2068 6.69584 10.2068 6.69592C10.2594 6.29808 10.5986 6 11 6C11.4014 6 11.7406 6.29736 11.7931 6.6952L11.794 6.7016L11.7977 6.72808C11.8012 6.75232 11.8066 6.78928 11.8142 6.8376C11.8294 6.93432 11.8529 7.07632 11.8858 7.25216C11.952 7.60488 12.055 8.08928 12.2026 8.61664C12.5098 9.71488 12.9666 10.8353 13.5657 11.4343C14.1647 12.0334 15.2851 12.4902 16.3834 12.7974C16.9107 12.945 17.3951 13.048 17.7478 13.1142C17.9237 13.1471 18.0657 13.1706 18.1624 13.1858C18.2107 13.1934 18.2477 13.1988 18.2719 13.2023L18.2984 13.206L18.3041 13.2068C18.304 13.2068 18.3042 13.2068 18.3041 13.2068C18.7019 13.2594 19 13.5986 19 14C19 14.4014 18.7026 14.7406 18.3048 14.7931L18.2984 14.794L18.2719 14.7977C18.2477 14.8012 18.2107 14.8066 18.1624 14.8142C18.0657 14.8294 17.9237 14.8529 17.7478 14.8858C17.3951 14.952 16.9107 15.055 16.3834 15.2026C15.2851 15.5098 14.1647 15.9666 13.5657 16.5657C12.9666 17.1647 12.5098 18.2851 12.2026 19.3833C12.055 19.9107 11.952 20.3951 11.8858 20.7478C11.8529 20.9237 11.8294 21.0657 11.8142 21.1624C11.8066 21.2108 11.8012 21.2477 11.7977 21.2719L11.794 21.2984L11.7931 21.3048ZM14.8978 14C14.0115 14.3258 13.0817 14.787 12.4343 15.4343C11.787 16.0817 11.3258 17.0115 11 17.8978C10.6742 17.0115 10.213 16.0817 9.56568 15.4343C8.91834 14.787 7.98851 14.3258 7.10221 14C7.98851 13.6742 8.91834 13.213 9.56568 12.5657C10.213 11.9183 10.6742 10.9885 11 10.1022C11.3258 10.9885 11.787 11.9183 12.4343 12.5657C13.0817 13.213 14.0115 13.6742 14.8978 14Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.847 9.69584C19.824 9.86988 19.6756 10 19.5 10C19.3244 10 19.176 9.8699 19.153 9.69584L19.1526 9.69304L19.151 9.68145C19.1495 9.67088 19.1471 9.6547 19.1438 9.63355C19.1372 9.59123 19.1269 9.52912 19.1124 9.45217C19.0835 9.29786 19.0384 9.08594 19.9738 8.85521C18.8394 8.37473 18.6396 7.88457 18.3775 7.62249C18.1154 7.36041 17.6253 7.16055 17.1448 7.02615C16.9141 6.96158 16.7021 6.9165 16.5478 6.88755C16.4709 6.87313 16.4088 6.86285 16.3664 6.85623C16.3453 6.85291 16.3291 6.85052 16.3185 6.84898L16.307 6.84738L16.3045 6.84702C16.1304 6.82399 16 6.67556 16 6.5C16 6.32441 16.1301 6.17601 16.3042 6.15301L16.307 6.15262L16.3185 6.15102C16.3291 6.14948 16.3453 6.14709 16.3664 6.14377C16.4088 6.13715 16.4709 6.12687 16.5478 6.11245C16.7021 6.0835 16.9141 6.03842 17.1448 5.97385C17.6253 5.83945 18.1154 5.6396 18.3775 5.37752C18.6396 5.11544 18.8394 4.62526 18.9738 4.14478C19.0384 3.91406 19.0835 3.70214 19.1124 3.54782C19.1269 3.47089 19.1372 3.40877 19.1438 3.36645C19.1471 3.34531 19.1495 3.32914 19.151 3.31854L19.1526 3.30695L19.153 3.30446C19.176 3.13041 19.3244 3 19.5 3C19.6756 3 19.824 3.1301 19.847 3.30415L19.8474 3.30695L19.849 3.31854C19.8505 3.32914 19.8529 3.34531 19.8562 3.36645C19.8628 3.40877 19.8731 3.47089 19.8876 3.54782C19.9165 3.70214 19.9616 3.91406 20.0262 4.14478C20.1606 4.62526 20.3604 5.11544 20.6225 5.37752C20.8846 5.6396 21.3747 5.83945 21.8552 5.97385C22.0859 6.03842 22.2979 6.0835 22.4522 6.11245C22.5291 6.12687 22.5912 6.13715 22.6335 6.14377C22.6547 6.14709 22.6709 6.14948 22.6815 6.15102L22.693 6.15262L22.6955 6.15298C22.8696 6.17597 23 6.32441 23 6.5C23 6.67559 22.8699 6.82399 22.6958 6.84699L22.693 6.84738L22.6815 6.84898C22.6709 6.85052 22.6547 6.85291 22.6335 6.85623C22.5912 6.86285 22.5291 6.87313 22.4522 6.88755C22.2979 6.9165 22.0859 6.96158 21.8552 7.02615C21.3747 7.16055 20.8846 7.36041 20.6225 7.62249C20.3604 7.88457 20.1606 8.37473 20.0262 8.85521C19.9616 9.08594 19.9165 9.29786 19.8876 9.45217C19.8731 9.52912 19.8628 9.59123 19.8562 9.63355C19.8529 9.6547 19.8505 9.67088 19.849 9.68145L19.8474 9.69304L19.847 9.69584Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.9461 26.6089C20.9165 26.8327 20.7257 27 20.5 27C20.2742 27 20.0834 26.8327 20.0539 26.6089L20.0534 26.6053L20.0513 26.5904C20.0493 26.5768 20.0463 26.556 20.042 26.5289C20.0335 26.4744 20.0203 26.3946 20.0017 26.2956C19.9645 26.0973 19.9065 25.8248 19.8235 25.5281C19.6507 24.9104 19.3938 24.2802 19.0568 23.9432C18.7198 23.6062 18.0896 23.3493 17.4719 23.1765C17.1752 23.0935 16.9027 23.0355 16.7044 22.9983C16.6054 22.9797 16.5256 22.9665 16.4711 22.958C16.444 22.9537 16.4232 22.9507 16.4096 22.9487L16.3947 22.9466L16.3915 22.9462C16.1677 22.9166 16 22.7257 16 22.5C16 22.2742 16.1673 22.0834 16.3911 22.0539L16.3947 22.0534L16.4096 22.0513C16.4232 22.0493 16.444 22.0463 16.4711 22.042C16.5256 22.0335 16.6054 22.0203 16.7044 22.0017C16.9027 21.9645 17.1752 21.9065 17.4719 21.8235C18.0896 21.6507 18.7198 21.3938 19.0568 21.0568C19.3938 20.7198 19.6507 20.0896 19.8235 19.4719C19.9065 19.1752 19.9645 18.9027 20.0017 18.7043C20.0203 18.6054 20.0335 18.5256 20.042 18.4712C20.0463 18.444 20.0493 18.4232 20.0513 18.4095L20.0534 18.3947L20.0538 18.3915C20.0834 18.1677 20.2742 18 20.5 18C20.7258 18 20.9166 18.1673 20.9461 18.3911L20.9466 18.3947L20.9487 18.4095C20.9507 18.4232 20.9537 18.444 20.958 18.4712C20.9665 18.5256 20.9797 18.6054 20.9983 18.7043C21.0355 18.9027 21.0935 19.1752 21.1765 19.4719C21.3493 20.0896 21.6062 20.7198 21.9432 21.0568C22.2802 21.3938 22.9104 21.6507 23.5281 21.8235C23.8248 21.9065 24.0973 21.9645 24.2957 22.0017C24.3946 22.0203 24.4744 22.0335 24.5288 22.042C24.556 22.0463 24.5768 22.0493 24.5905 22.0513L24.6053 22.0534L24.6085 22.0538C24.8323 22.0834 25 22.2742 25 22.5C25 22.7258 24.8327 22.9166 24.6089 22.9461L24.6053 24.9466L24.5905 24.9487C24.5768 24.9507 24.556 24.9537 24.5288 24.958C24.4744 24.9665 24.3946 24.9797 24.2957 24.9983C24.0973 25.0355 23.8248 25.0935 23.5281 25.1765C22.9104 25.3493 22.2802 25.6062 21.9432 25.9432C21.6062 26.2802 21.3493 26.9104 21.1765 27.5281C21.0935 27.8248 21.0355 28.0973 20.9983 28.2956C20.9797 28.3946 20.9665 28.4744 20.958 28.5289C20.9537 28.556 20.9507 28.5768 20.9487 28.5904L20.9466 28.6053L20.9461 28.6089Z"
        fill="white"
      />
    </svg>
  );

  const loadingIcon = <CircularProgress size={24} style={{ color: '#e5e0e0' }} />;

  const copyToClipboard = (text, index) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[index] = 'tick';
          return newStatus;
        });
        setTimeout(() => {
          setCopyStatus((prevStatus) => {
            const newStatus = [...prevStatus];
            newStatus[index] = 'copy';
            return newStatus;
          });
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const formatExplanation = (text) => (
    <div style={{ margin: '20px', fontSize: '16px' }}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );

  const formatSolarTco2PlotExplanation = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('###')) {
        return (
          <h3 key={index} style={{ marginTop: 20 }}>
            {line.replace('###', '')}
          </h3>
        );
      }
      if (line.startsWith('##')) {
        return (
          <h2 key={index} style={{ marginTop: 20 }}>
            {line.replace('##', '')}
          </h2>
        );
      }
      if (line.startsWith('* ') || line.match(/^\s*\*/)) {
        return (
          <li key={index} style={{ marginTop: 10 }}>
            {line.replace(/^\s*\*/, '')}
          </li>
        );
      }
      if (line.includes('*')) {
        const parts = line.split('*');
        return (
          <p key={index} style={{ marginTop: 10 }}>
            {parts.map((part, partIndex) => (partIndex % 2 === 0 ? part : <b key={partIndex}>{part}</b>))}
          </p>
        );
      }
      return (
        <p key={index} style={{ marginTop: 10 }}>
          {line}
        </p>
      );
    });
  };

  const formatTrendPlotExplanation = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('###')) {
        return (
          <h3 key={index} style={{ marginTop: 20 }}>
            {line.replace('###', '')}
          </h3>
        );
      }
      if (line.startsWith('##')) {
        return (
          <h2 key={index} style={{ marginTop: 20 }}>
            {line.replace('##', '')}
          </h2>
        );
      }
      if (line.startsWith('*') || line.match(/^\s*\*/)) {
        return (
          <li key={index} style={{ marginTop: 10 }}>
            {line.replace(/^\s*\*/, '')}
          </li>
        );
      }
      if (line.includes('*')) {
        const parts = line.split('*');
        return (
          <p key={index} style={{ marginTop: 10 }}>
            {parts.map((part, partIndex) => (partIndex % 2 === 0 ? part : <b key={partIndex}>{part}</b>))}
          </p>
        );
      }
      return (
        <p key={index} style={{ marginTop: 10 }}>
          {line}
        </p>
      );
    });
  };

  const EnergyCard = ({ EUI, EIO }) => {
    const [isAiIconVisible, setIsAiIconVisible] = useState({
      EUI: false,
      EIO: false,
    });

    return (
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Mulish, sans-serif',
            fontSize: '16px',
            fontWeight: '500',
            color: themes === 'light' ? '#d0c8c8' : 'black',
            marginTop: '-6px',
          }}
        >
          Energy Intensity
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BoltIcon sx={{ color: '#ff8200 !important' }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: 'Mulish, sans-serif',
                fontSize: '17px',
                fontWeight: 'normal',
                color: themes === 'light' ? '#FFFFFF' : '#000000',
              }}
            >
              Energy Use Intensity
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: isMobile ? '33px' : '40px',
            }}
            onMouseEnter={() => setIsAiIconVisible((prevState) => ({ ...prevState, EUI: true }))}
            onMouseLeave={() => setIsAiIconVisible((prevState) => ({ ...prevState, EUI: false }))}
          >
            <Typography
              variant="h6"
              sx={{
                lineHeight: 1,
                color: '#ff8200',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                fontFamily: 'Mulish, sans-serif',
              }}
            >
              {EUI !== undefined ? EUI : 'N/A'}
            </Typography>
            {isAiIconVisible.EUI && (
              <Tooltip
                title={<span style={{ fontSize: '12px' }}>Explain with AI</span>}
                arrow
                placement="top"
              >
                <IconButton
                  size="small"
                  style={{
                    color: '#ff8200',
                    marginLeft: '38px',
                  }}
                  onClick={() => fetchExplanation(selectedPeriod, 'EUI')}
                >
                  {loadingIcons.EUI ? loadingIcon : aiIcon}
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: '12px',
              fontFamily: 'Mulish, sans-serif',
              color: themes === 'light' ? '#FFFFFF' : '#000000',
              ml: isMobile ? '38px' : '45px',
              mt: '5px',
            }}
          >
            kWh/Sqft
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BoltIcon sx={{ color: '#ff8200 !important' }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: 'Mulish, sans-serif',
                fontSize: '17px',
                fontWeight: 'normal',
                color: themes === 'light' ? '#FFFFFF' : '#000000',
              }}
            >
              Energy Use Per Capita
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: isMobile ? '33px' : '40px',
            }}
            onMouseEnter={() => setIsAiIconVisible((prevState) => ({ ...prevState, EIO: true }))}
            onMouseLeave={() => setIsAiIconVisible((prevState) => ({ ...prevState, EIO: false }))}
          >
            <Typography
              variant="h6"
              sx={{
                lineHeight: 1,
                color: '#ff8200',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                fontFamily: 'Mulish, sans-serif',
              }}
            >
              {EIO !== undefined ? EIO : 'N/A'}
            </Typography>
            {isAiIconVisible.EIO && (
              <Tooltip
                title={<span style={{ fontSize: '12px' }}>Explain with AI</span>}
                arrow
                placement="top"
              >
                <IconButton
                  size="small"
                  style={{
                    color: '#ff8200',
                    marginLeft: '28px',
                  }}
                  onClick={() => fetchExplanation(selectedPeriod, 'EIO')}
                >
                  {loadingIcons.EIO ? loadingIcon : aiIcon}
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: '10px',
              fontFamily: 'Mulish, sans-serif',
              color: themes === 'light' ? '#FFFFFF' : '#000000',
              ml: isMobile ? '38px' : '45px',
              mt: '5px',
            }}
          >
            kWh/Capita
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ overflow: openModal ? 'auto' : 'auto' }}>
        <Card>
          <CardHeader
            headerText={headerText || 'Sustainability'}
            showBackButton={showBackButton}
            onBackButtonClick={onBackButtonClick}
            plotType={selectedPeriod}
            // handlePlotTypeChange={handlePeriodChange}
            isDropdown={isMobile}
            fontSize="17px"
          >
            <PlotTypeSelector
              plotType={selectedPeriod}
              handlePlotTypeChange={handlePeriodChange}
              isDropdown={isMobile}
            />
          </CardHeader>
          <div className="main-content-1">
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ color: themes === 'light' ? '#FFFFFF' : '#000000' }}>
                <Typography>{error}</Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridAutoFlow: 'row',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                  gap: 1,
                  padding: 1,
                }}
              >
                {/* Pie Chart */}
                <Item sx={isMobile ? {} : { gridColumn: '1', gridRow: '1' }}>
                  {plotData.pie && plotData.pie.data ? (
                    <Box
                      position="relative"
                      sx={{ height: '100%', marginTop: '-8px' }}
                      className={`plot-container ${themes === 'light' ? 'light-mode' : ''}`}
                      onMouseEnter={() => setIsAiIconVisible((prevState) => ({ ...prevState, pie: true }))}
                      onMouseLeave={() => setIsAiIconVisible((prevState) => ({ ...prevState, pie: false }))}
                    >
                      <Plot
                        data={plotData.pie.data.map((trace) => ({
                          ...trace,
                          domain: { x: [0.0, 0.56], y: [0, 1] },
                        }))}
                        layout={{
                          ...customLayout,
                          ...plotData.pie.layout,
                          title: {
                            text: 'Energy By Sources',
                            font: {
                              family: 'Mulish, sans-serif',
                              size: 16,
                              color: themes === 'light' ? '#d0c8c8' : 'black',
                              fontWeight: 'bold',
                            },
                            y: 0.9,
                            x: 0.05,
                            xanchor: 'left',
                          },
                          annotations: plotData.pie.layout.annotations.map((annotation) => ({
                            ...annotation,
                            font: {
                              ...annotation.font,
                              color: themes === 'light' ? '#FFFFFF' : '#000000',
                            },
                          })),
                          font: {
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                          },
                          height: 280,
                          margin: {
                            l: 10,
                            r: 70,
                            t: 50,
                            b: 20,
                          },
                          autosize: true,
                        }}
                        config={{
                          displayModeBar: false,
                          displaylogo: false,
                        }}
                        style={{ width: '100%', height: '100%' }}
                      />
                      {isAiIconVisible.pie && (
                        <Tooltip
                          title={<span style={{ fontSize: '12px' }}>Explain with AI</span>}
                          arrow
                          placement="top"
                        >
                          <IconButton
                            size="small"
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              color: '#ff8200',
                            }}
                            onClick={() => fetchExplanation(selectedPeriod, 'pie')}
                          >
                            {loadingIcons.pie ? loadingIcon : aiIcon}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body1" color="error">
                      No data available for the selected period.
                    </Typography>
                  )}
                </Item>

                {/* Energy Intensity Card */}
                <Item sx={isMobile ? {} : { gridColumn: '2', gridRow: '1' }}>
                  <EnergyCard EUI={plotData.EUI} EIO={plotData.EIO} />
                </Item>

                {/* Consumption Plot */}
                <Item sx={isMobile ? {} : { gridColumn: '3', gridRow: '1' }}>
                  {plotData.consumption_plot && (
                    <Box
                      className={`plot-container ${themes === 'light' ? 'light-mode' : ''}`}
                      position="relative"
                      sx={{ flex: 1, height: isMobile ? 310 : 280, marginTop: '-12px' }}
                      onMouseEnter={() =>
                        setIsAiIconVisible((prevState) => ({
                          ...prevState,
                          consumption_plot: true,
                        }))
                      }
                      onMouseLeave={() =>
                        setIsAiIconVisible((prevState) => ({
                          ...prevState,
                          consumption_plot: false,
                        }))
                      }
                    >
                      <Plot
                        data={plotData.consumption_plot.data}
                        layout={{
                          ...customLayout,
                          ...plotData.consumption_plot.layout,
                          title: {
                            text: 'Energy Prediction',
                            font: {
                              family: 'Mulish, sans-serif',
                              size: 16,
                              color: themes === 'light' ? '#d0c8c8' : 'black',
                              fontWeight: 'bold',
                            },
                            y: 0.9,
                            x: 0.05,
                            xanchor: 'left',
                          },
                          yaxis: {
                            visible: false,
                            showticklabels: false,
                          },
                          annotations: plotData.consumption_plot.layout.annotations.map(
                            (annotation) => ({
                              ...annotation,
                              font: {
                                ...annotation.font,
                                color: themes === 'light' ? '#FFFFFF' : '#000000',
                                family: 'Mulish, sans-serif', // Fix font for "Last Day Predicted Today" and "Predicted Change"
                              },
                            }),
                          ),
                          font: {
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                            family: 'Mulish, sans-serif',
                          },
                          height: isMobile ? 310 : 280,
                          autosize: true,
                        }}
                        style={{ width: '100%', height: '100%' }}
                        config={{
                          displayModeBar: false,
                          displaylogo: false,
                        }}
                        useResizeHandler
                      />
                      {isAiIconVisible.consumption_plot && (
                        <Tooltip
                          title={<span style={{ fontSize: '12px' }}>Explain with AI</span>}
                          arrow
                          placement="top"
                        >
                          <IconButton
                            size="small"
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              color: '#ff8200',
                            }}
                            onClick={() => fetchExplanation(selectedPeriod, 'consumption_plot')}
                          >
                            {loadingIcons.consumption_plot ? loadingIcon : aiIcon}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Item>

                {/* Carbon Emissions and Solar Energy */}
                <Item sx={isMobile ? {} : { gridColumn: '4', gridRow: '1' }}>
                  <Box
                    className={`carbon1 ${themes === 'light' ? 'light-mode' : ''}`}
                    sx={{ height: '280px' }}
                  >
                    {plotData.eb_tco2_plot && (
                      <Box
                        position="relative"
                        sx={{ height: '33%' }}
                        onMouseEnter={() =>
                          setIsAiIconVisible((prevState) => ({ ...prevState, eb_tco2_plot: true }))
                        }
                        onMouseLeave={() =>
                          setIsAiIconVisible((prevState) => ({ ...prevState, eb_tco2_plot: false }))
                        }
                      >
                        <Plot
                          data={plotData.eb_tco2_plot.data}
                          layout={{
                            ...customLayout,
                            ...plotData.eb_tco2_plot.layout,
                            title: {
                              text: 'Carbon Emissions (EB)',
                              font: {
                                family: 'Mulish, sans-serif',
                                size: 15,
                                color: themes === 'light' ? '#d0c8c8' : 'black',
                                fontWeight: 'bold',
                              },
                              y: 0.85,
                              x: 0.05,
                              xanchor: 'left',
                            },
                            annotations: plotData.eb_tco2_plot.layout.annotations.map(
                              (annotation) => ({
                                ...annotation,
                                font: {
                                  ...annotation.font,
                                  color: themes === 'light' ? '#FFFFFF' : '#000000',
                                },
                              }),
                            ),
                            height: 92,
                            autosize: true,
                          }}
                          config={{
                            displayModeBar: false,
                            displaylogo: false,
                          }}
                          style={{ width: '100%', height: '100%' }}
                        />
                        {isAiIconVisible.eb_tco2_plot && (
                          <Tooltip
                            title={<span style={{ fontSize: '12px' }}>Explain with AI</span>}
                            arrow
                            placement="top"
                          >
                            <IconButton
                              size="small"
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                color: '#ff8200',
                              }}
                              onClick={() => fetchExplanation(selectedPeriod, 'eb_tco2_plot')}
                            >
                              {loadingIcons.eb_tco2_plot ? loadingIcon : aiIcon}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    )}
                    {plotData.dg_tco2_plot && (
                      <Box
                        position="relative"
                        sx={{ height: '33%' }}
                        onMouseEnter={() =>
                          setIsAiIconVisible((prevState) => ({ ...prevState, dg_tco2_plot: true }))
                        }
                        onMouseLeave={() =>
                          setIsAiIconVisible((prevState) => ({ ...prevState, dg_tco2_plot: false }))
                        }
                      >
                        <Plot
                          data={plotData.dg_tco2_plot.data}
                          layout={{
                            ...customLayout,
                            ...plotData.dg_tco2_plot.layout,
                            title: {
                              text: 'Carbon Emissions (DG)',
                              font: {
                                family: 'Mulish, sans-serif',
                                size: 15,
                                color: themes === 'light' ? '#d0c8c8' : 'black',
                                fontWeight: 'bold',
                              },
                              y: 0.85,
                              x: 0.05,
                              xanchor: 'left',
                            },
                            annotations: plotData.dg_tco2_plot.layout.annotations.map(
                              (annotation) => ({
                                ...annotation,
                                font: {
                                  ...annotation.font,
                                  color: themes === 'light' ? '#FFFFFF' : '#000000',
                                },
                              }),
                            ),
                            height: 92,
                            autosize: true,
                          }}
                          config={{
                            displayModeBar: false,
                            displaylogo: false,
                          }}
                          style={{ width: '100%', height: '100%' }}
                        />
                        {isAiIconVisible.dg_tco2_plot && (
                          <Tooltip
                            title={<span style={{ fontSize: '12px' }}>Explain with AI</span>}
                            arrow
                            placement="top"
                          >
                            <IconButton
                              size="small"
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                color: '#ff8200',
                              }}
                              onClick={() => fetchExplanation(selectedPeriod, 'dg_tco2_plot')}
                            >
                              {loadingIcons.dg_tco2_plot ? loadingIcon : aiIcon}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    )}
                    {plotData.solar_energy_plot && (
                      <Box
                        position="relative"
                        sx={{ height: '33%' }}
                        onMouseEnter={() =>
                          setIsAiIconVisible((prevState) => ({
                            ...prevState,
                            solar_energy_plot: true,
                          }))
                        }
                        onMouseLeave={() =>
                          setIsAiIconVisible((prevState) => ({
                            ...prevState,
                            solar_energy_plot: false,
                          }))
                        }
                      >
                        <Box sx={{ height: '100%' }}>
                          <Plot
                            data={plotData.solar_energy_plot.data}
                            layout={{
                              ...customLayout,
                              ...plotData.solar_energy_plot.layout,
                              title: {
                                text: 'Green Energy Generated',
                                font: {
                                  family: 'Mulish, sans-serif',
                                  size: 15,
                                  color: themes === 'light' ? '#d0c8c8' : 'black',
                                  fontWeight: 'bold',
                                },
                                y: 0.85,
                                x: 0.05,
                                xanchor: 'left',
                              },
                              annotations: plotData.solar_energy_plot.layout.annotations.map(
                                (annotation) => ({
                                  ...annotation,
                                  font: {
                                    ...annotation.font,
                                    color: themes === 'light' ? '#FFFFFF' : '#000000',
                                  },
                                }),
                              ),
                              height: 92,
                              autosize: true,
                            }}
                            config={{
                              displayModeBar: false,
                              displaylogo: false,
                            }}
                            style={{ width: '100%', height: '100%' }}
                          />
                          {isAiIconVisible.solar_energy_plot && (
                            <Tooltip
                              title={<span style={{ fontSize: '12px' }}>Explain with AI</span>}
                              arrow
                              placement="top"
                            >
                              <IconButton
                                size="small"
                                style={{
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  color: '#ff8200',
                                }}
                                onClick={() => fetchExplanation(selectedPeriod, 'solar_energy_plot')}
                              >
                                {loadingIcons.solar_energy_plot ? loadingIcon : aiIcon}
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Item>

                {/* Utility Plot */}
                <Item sx={isMobile ? {} : { gridColumn: '1 / 3', gridRow: '2' }}>
                  {plotData.utility_plot && (
                    <Box
                      position="relative"
                      sx={{ flex: 1, height: isMobile ? 410 : 450 }}
                      className={`plot-container ${themes === 'light' ? 'light-mode' : ''}`}
                      onMouseEnter={() =>
                        setIsAiIconVisible((prevState) => ({
                          ...prevState,
                          utility_plot: true,
                        }))
                      }
                      onMouseLeave={() =>
                        setIsAiIconVisible((prevState) => ({
                          ...prevState,
                          utility_plot: false,
                        }))
                      }
                    >
                      <Plot
                        data={plotData.utility_plot.data.map((d) => ({
                          ...d,
                          text: d.x.map((value) => `${value.toFixed(2)} kWh`),
                          hoverinfo: 'text',
                        }))}
                        layout={{
                          ...customLayout,
                          ...plotData.utility_plot.layout,
                          title: {
                            text: 'Energy By Utility',
                            font: {
                              family: 'Mulish, sans-serif',
                              size: 16,
                              color: themes === 'light' ? '#d0c8c8' : 'black',
                              fontWeight: 'bold',
                            },
                            y: 0.95,
                            x: 0.05,
                            xanchor: 'left',
                          },
                          xaxis: {
                            showticklabels: true,
                            range: [
                              -4,
                              Math.max(
                                ...plotData.utility_plot.data.map((d) => Math.max(...d.x)),
                              ) * 1.8,
                            ],
                            showgrid: false,
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                          },
                          yaxis: {
                            showticklabels: true,
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                          },
                          annotations: plotData.utility_plot.layout.annotations.map(
                            (annotation) => ({
                              ...annotation,
                              font: {
                                ...annotation.font,
                                color: themes === 'light' ? '#FFFFFF' : '#000000',
                              },
                            }),
                          ),
                          font: {
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                          },
                          height: isMobile ? 410 : 450,
                          autosize: true,
                        }}
                        style={{ width: '100%', height: '100%' }}
                        config={{
                          displayModeBar: false,
                          displaylogo: false,
                        }}
                        useResizeHandler
                      />
                      {isAiIconVisible.utility_plot && (
                        <Tooltip
                          title={<span style={{ fontSize: '12px' }}>Explain with AI</span>}
                          arrow
                          placement="top"
                        >
                          <IconButton
                            size="small"
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              color: '#ff8200',
                            }}
                            onClick={() => fetchExplanation(selectedPeriod, 'utility_plot')}
                          >
                            {loadingIcons.utility_plot ? loadingIcon : aiIcon}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Item>

                {/* Trend Plot */}
                <Item sx={isMobile ? {} : { gridColumn: '3 / 5', gridRow: '2' }}>
                  {plotData.trend_plot && (
                    <Box
                      className={`plot-container ${themes === 'light' ? 'light-mode' : ''}`}
                      position="relative"
                      sx={{ flex: 1, height: isMobile ? 410 : 450 }}
                      onMouseEnter={() =>
                        setIsAiIconVisible((prevState) => ({
                          ...prevState,
                          trend_plot: true,
                        }))
                      }
                      onMouseLeave={() =>
                        setIsAiIconVisible((prevState) => ({
                          ...prevState,
                          trend_plot: false,
                        }))
                      }
                    >
                      <Plot
                        data={plotData.trend_plot.data}
                        layout={{
                          ...customLayout,
                          ...plotData.trend_plot.layout,
                          title: {
                            text: 'Energy Trend By Source',
                            font: {
                              family: 'Mulish, sans-serif',
                              size: 16,
                              color: themes === 'light' ? '#d0c8c8' : 'black',
                              fontWeight: 'bold',
                            },
                            y: 0.95,
                            x: 0.05,
                            xanchor: 'left',
                          },
                          yaxis: {
                            showgrid: false,
                            title: {
                              text: 'Consumption (kWh)',
                              font: {
                                family: 'Mulish, sans-serif',
                                size: 14,
                                color: themes === 'light' ? '#FFFFFF' : '#000000',
                              },
                            },
                            tickfont: {
                              family: 'Mulish, sans-serif',
                              size: 10,
                              color: themes === 'light' ? '#FFFFFF' : '#000000',
                            },
                          },
                          font: {
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                          },
                          height: isMobile ? 410 : 450,
                          autosize: true,
                        }}
                        style={{ width: '100%', height: '100%' }}
                        config={{
                          displayModeBar: true,
                          displaylogo: false,
                          modeBarButtonsToRemove: [],
                          toImageButtonOptions: {
                            format: 'png',
                            filename: 'custom_image',
                            height: 400,
                            width: 700,
                            scale: 1,
                          },
                        }}
                        useResizeHandler
                      />
                      {isAiIconVisible.trend_plot && (
                        <Tooltip
                          title={<span style={{ fontSize: '12px' }}>Explain with AI</span>}
                          arrow
                          placement="top"
                        >
                          <IconButton
                            size="small"
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              color: '#ff8200',
                            }}
                            onClick={() => fetchExplanation(selectedPeriod, 'trend_plot')}
                          >
                            {loadingIcons.trend_plot ? loadingIcon : aiIcon}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Item>
              </Box>
            )}
          </div>
        </Card>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openModal}>
            <Box
              onMouseDown={handleMouseDown}
              sx={{
                position: 'fixed',
                top: `${position.y}px`,
                left: `${position.x}px`,
                width: '80%',
                maxWidth: '1000px',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                borderRadius: '8px',
                overflow: 'hidden',
                maxHeight: '80vh',
                zIndex: 1300,
                cursor: dragging ? 'grabbing' : 'grab',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Box
                className="modal-header"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  position: 'sticky',
                  top: 0,
                  backgroundColor: 'white',
                  zIndex: 1000,
                  paddingBottom: '8px',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <div className="gap">
                  <Typography variant="h6" component="h2" marginTop="16px">
                    {explanation?.title || 'AI Overview'}
                  </Typography>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mt: 2, fontWeight: 'bold' }}
                  >
                    {explanation?.subtitle || ''}
                  </Typography>
                </div>
                <div className="copy">
                  <button
                    className="copy-icon1"
                    onClick={() => copyToClipboard(explanation?.explanation || '', 0)}
                  >
                    <img
                      src={`../images/${
                        copyStatus[0] === 'tick' ? 'check-mark.png' : 'copy.png'
                      }`}
                      alt={copyStatus[0] === 'tick' ? 'Copied' : 'Copy'}
                      className="img1"
                    />
                  </button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </div>
              </Box>
              <Box
                sx={{
                  overflowY: 'auto',
                  maxHeight: 'calc(80vh - 100px)',
                  mt: 2,
                }}
              >
                <Typography>
                  {explanation
                    ? explanation.chart_type === 'solar_energy_plot'
                      ? formatSolarTco2PlotExplanation(explanation.explanation)
                      : explanation.chart_type === 'trend_plot'
                        ? formatTrendPlotExplanation(explanation.explanation)
                        : formatExplanation(explanation.explanation)
                    : 'No explanation available.'}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 2, textAlign: 'center' }}
                  className="copy-top"
                >
                  Note: Responses may contain inaccuracies.
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default Sustainability;