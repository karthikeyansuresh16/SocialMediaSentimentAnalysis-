import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './Results.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Results = ({ results }) => {
  const { summary, topic } = results;
  const { categoryCounts, averageScore, totalPosts, timeline } = summary;
  console.log(results);
  const sentimentDistributionData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [categoryCounts.positive, categoryCounts.neutral, categoryCounts.negative],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        hoverBackgroundColor: ['#388E3C', '#FFB300', '#D32F2F'],
      },
    ],
  };
  
  const timelineChartData = {
    labels: timeline.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1} / ${date.getFullYear()}`;
    }),
    datasets: [
      {
        label: 'Sentiment Score',
        data: timeline.map(item => item.score),
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.5)'
      },
    ],
  };
  
  let overallSentiment = 'Neutral';
  let sentimentColor = '#FFC107';
  
  if (averageScore > 0) {
    overallSentiment = 'Positive';
    sentimentColor = '#4CAF50';
  } else if (averageScore < 0) {
    overallSentiment = 'Negative';
    sentimentColor = '#F44336';
  }
  
  return (
    <div className="results-container">
      <h2>Sentiment Analysis Results for "{topic}"</h2>
      
      <div className="summary-stats">
        <div className="stat-card">
          <h3>Total Posts Analyzed</h3>
          <p className="stat-value">{totalPosts}</p>
        </div>
        
        <div className="stat-card">
          <h3>Average Sentiment</h3>
          <p className="stat-value" style={{ color: sentimentColor }}>
            {averageScore.toFixed(2)} ({overallSentiment})
          </p>
        </div>
        
        <div className="stat-card">
          <h3>Sentiment Distribution</h3>
          <p className="stat-breakdown">
            <span className="positive">Positive: {categoryCounts.positive}</span>
            <span className="neutral">Neutral: {categoryCounts.neutral}</span>
            <span className="negative">Negative: {categoryCounts.negative}</span>
          </p>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Sentiment Distribution</h3>
          <Pie data={sentimentDistributionData} />
        </div>
        
        <div className="chart-wrapper">
          <h3>Sentiment Over Time</h3>
          <Line 
            data={timelineChartData} 
            options={{
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Sentiment Score'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Time'
                  }
                }
              }
            }}
          />
        </div>
      </div>
      
     </div>
  );
};

export default Results;