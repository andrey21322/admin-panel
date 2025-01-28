import React, { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ data, language, theme, t }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = data.filter(item => {
    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (!start || itemDate >= start) && (!end || itemDate <= end);
  });

  const salesByDate = filteredData.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + item.quantity;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: t.sales || 'Sales',
        data: Object.values(salesByDate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const salesByProduct = filteredData.reduce((acc, item) => {
    acc[item.product] = (acc[item.product] || 0) + item.quantity;
    return acc;
  }, {});

  const doughnutChartData = {
    labels: Object.keys(salesByProduct),
    datasets: [
      {
        data: Object.values(salesByProduct),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#00FA9A'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#00FA9A'],
      },
    ],
  };

  const trendData = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: t.trend || 'Trend Analysis',
        data: filteredData.map(item => item.quantity),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        pointBorderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-left">
          <div className={theme === 'dark' ? "chart large-chart" : "chart large-chart light"}>
            <h3 style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t.salesByDate}</h3>
            <Bar data={barChartData} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
              },
              scales: {
                x: {
                  title: { display: true, text: t.date || 'Date', color: theme === 'dark' ? 'white' : 'black' },
                  ticks: { color: theme === 'dark' ? 'white' : 'black' },
                },
                y: {
                  title: { display: true, text: t.sales || 'Sales', color: theme === 'dark' ? 'white' : 'black' },
                  ticks: { color: theme === 'dark' ? 'white' : 'black' },
                },
              },
            }} />
          </div>

          <div className={theme === 'dark' ? "filter" : "filter light"}>
            <label style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t.startDate}:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={theme === 'dark' ? "date-picker" : "date-picker-light"}
            />
            <label style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t.endDate || 'End Date'}:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={theme === 'dark' ? "date-picker" : "date-picker-light"}
            />
          </div>
        </div>

        <div className="dashboard-right">
          <div className={theme === 'dark' ? "chart large-chart" : "chart large-chart light "}>
            <h3 style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t.salesByProduct || 'Sales by Product'}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '50%' }}>
                <Doughnut data={doughnutChartData} options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }} />
              </div>
              <div className="legend" style={{ marginLeft: '20px' }}>
                {Object.keys(salesByProduct).map((product, index) => (
                  <div key={index} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: doughnutChartData.datasets[0].backgroundColor[index] }}
                    ></span>
                    <span className={theme === 'dark' ? "legend-label" : "legend-label cb"}>{product}: {salesByProduct[product]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={theme === 'dark' ? "chart large-chart" : "chart large-chart light"}>
            <h3 style={{ color: theme === 'dark' ? 'white' : 'black' }}>{t.trendAnalysis || 'Trend Analysis'}</h3>
            <Line data={trendData} options={{
              responsive: true,
              plugins: {
                legend: { display: true },
                tooltip: { enabled: true },
              },
              scales: {
                x: {
                  title: { display: true, text: t.date || 'Date', color: theme === 'dark' ? 'white' : 'black' },
                  ticks: { color: theme === 'dark' ? 'white' : 'black' },
                },
                y: {
                  title: { display: true, text: t.quantity || 'Quantity', color: theme === 'dark' ? 'white' : 'black' },
                  ticks: { color: theme === 'dark' ? 'white' : 'black' },
                },
              },
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
