import React from 'react';
import styled from 'styled-components';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { groupByDate, formatDate } from '../utils/dateUtils';
import { parseISO, format } from 'date-fns';

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

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '0.5rem', 
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ 
            color: entry.color,
            margin: '0.25rem 0'
          }}>
            {`${entry.name}: ${entry.value.toFixed(1)}`}
          </p>
        ))}
        <p style={{ margin: '0.25rem 0', fontSize: '0.8rem' }}>
          {`Reviews: ${payload[0]?.payload?.count || 0}`}
        </p>
      </div>
    );
  }

  return null;
};

const RatingTrend = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <ChartContainer>
        <Title>Rating Trend</Title>
        <NoData>No data available for rating trend analysis.</NoData>
      </ChartContainer>
    );
  }

  // Group reviews by date
  const groupedByDate = groupByDate(reviews, 'date', 'day');
  
  // Convert to array for chart
  const data = Object.entries(groupedByDate)
    .map(([date, dateReviews]) => {
      // Calculate average rating
      const totalRating = dateReviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / dateReviews.length;
      
      return {
        date,
        avgRating,
        count: dateReviews.length,
        // Format date for display
        displayDate: format(parseISO(dateReviews[0].date), 'MMM dd, yyyy')
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return (
    <ChartContainer>
      <Title>Rating Trend</Title>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 100
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="displayDate" 
            angle={-45} 
            textAnchor="end"
            height={100}
            interval={Math.ceil(data.length / 8)}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 5]} 
            ticks={[1, 2, 3, 4, 5]} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgRating"
            name="Average Rating"
            stroke="#007bff"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RatingTrend; 