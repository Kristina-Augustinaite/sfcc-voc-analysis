import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { groupBySentiment } from '../utils/textProcessing';

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: 400px;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #212529;
  font-size: 1.25rem;
`;

const SentimentStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => {
    switch (props.type) {
      case 'positive': return '#28a745';
      case 'negative': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '0.5rem', 
        border: '1px solid #ccc', 
        borderRadius: '4px' 
      }}>
        <p style={{ margin: 0 }}>{`${payload[0].name}: ${payload[0].value} reviews`}</p>
        <p style={{ margin: 0 }}>{`${payload[0].payload.percentage}%`}</p>
      </div>
    );
  }

  return null;
};

const SentimentChart = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p>No data available for sentiment analysis.</p>;
  }

  const sentimentGroups = groupBySentiment(reviews, 'text');
  
  // Ensure all sentiment categories exist
  const positive = sentimentGroups.positive || [];
  const neutral = sentimentGroups.neutral || [];
  const negative = sentimentGroups.negative || [];
  
  // Calculate total
  const total = reviews.length;
  
  // Prepare data for pie chart
  const data = [
    { 
      name: 'Positive', 
      value: positive.length,
      percentage: Math.round((positive.length / total) * 100),
      color: '#28a745' 
    },
    { 
      name: 'Neutral', 
      value: neutral.length,
      percentage: Math.round((neutral.length / total) * 100),
      color: '#6c757d' 
    },
    { 
      name: 'Negative', 
      value: negative.length,
      percentage: Math.round((negative.length / total) * 100),
      color: '#dc3545' 
    }
  ];
  
  return (
    <ChartContainer>
      <Title>Sentiment Analysis</Title>
      
      <SentimentStats>
        <StatItem>
          <StatValue type="positive">{positive.length}</StatValue>
          <StatLabel>Positive</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue type="neutral">{neutral.length}</StatValue>
          <StatLabel>Neutral</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue type="negative">{negative.length}</StatValue>
          <StatLabel>Negative</StatLabel>
        </StatItem>
      </SentimentStats>
      
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="middle" 
            align="right"
            layout="vertical"
            wrapperStyle={{
              paddingLeft: "20px",
              right: 0
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SentimentChart; 