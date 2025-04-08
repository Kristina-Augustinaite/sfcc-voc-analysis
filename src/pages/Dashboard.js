import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import SentimentChart from '../components/SentimentChart';
import ReviewsTable from '../components/ReviewsTable';
import DateRangeFilter from '../components/DateRangeFilter';
import RatingTrend from '../components/RatingTrend';
import ThemeCloud from '../components/ThemeCloud';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #212529;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #6c757d;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FilterContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #343a40;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const Dashboard = () => {
  const { 
    filteredReviews, 
    isLoading, 
    error
  } = useAppContext();
  
  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / filteredReviews.length).toFixed(1);
  };
  
  const recentReviews = [...filteredReviews]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  return (
    <DashboardContainer>
      <Title>SFCC Voice of Customer Dashboard</Title>
      
      <FilterContainer>
        <DateRangeFilter />
      </FilterContainer>
      
      <StatsGrid>
        <StatCard>
          <StatValue>{filteredReviews.length}</StatValue>
          <StatLabel>Total Reviews</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{calculateAverageRating()}</StatValue>
          <StatLabel>Average Rating</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {filteredReviews.filter(r => r.rating >= 4).length}
          </StatValue>
          <StatLabel>Positive Reviews (4-5★)</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {filteredReviews.filter(r => r.rating <= 2).length}
          </StatValue>
          <StatLabel>Negative Reviews (1-2★)</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <ChartsGrid>
        <SentimentChart reviews={filteredReviews} />
        <RatingTrend reviews={filteredReviews} />
      </ChartsGrid>
      
      <ThemeCloud reviews={filteredReviews} />
      
      <SectionTitle>Recent Reviews</SectionTitle>
      <ReviewsTable reviews={recentReviews} />
    </DashboardContainer>
  );
};

export default Dashboard; 