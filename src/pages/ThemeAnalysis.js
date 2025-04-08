import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { extractThemes } from '../utils/textProcessing';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ThemeCloud from '../components/ThemeCloud';
import DateRangeFilter from '../components/DateRangeFilter';
import ReviewsTable from '../components/ReviewsTable';

const PageContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #212529;
`;

const FiltersContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ThemeDetailsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 2rem 0;
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #343a40;
`;

const SelectedThemeHeading = styled.h3`
  color: #007bff;
  margin-bottom: 1rem;
`;

const ThemeDescription = styled.p`
  color: #6c757d;
  margin-bottom: 1.5rem;
`;

const NoTheme = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-style: italic;
`;

const ThemeAnalysis = () => {
  const { filteredReviews, isLoading } = useAppContext();
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [relatedReviews, setRelatedReviews] = useState([]);
  
  // Extract themes when reviews change
  useEffect(() => {
    if (!filteredReviews || filteredReviews.length === 0) {
      setThemes([]);
      return;
    }
    
    // Extract review content
    const reviewTexts = filteredReviews.map(review => review.text);
    
    // Get themes
    const extractedThemes = extractThemes(reviewTexts, 15);
    setThemes(extractedThemes);
    
    // Reset selected theme when reviews change
    setSelectedTheme(null);
    setRelatedReviews([]);
  }, [filteredReviews]);
  
  // When a theme is selected, find related reviews
  useEffect(() => {
    if (!selectedTheme || !filteredReviews) {
      setRelatedReviews([]);
      return;
    }
    
    // Find reviews that mention the selected theme
    const related = filteredReviews.filter(review => 
      review.text.toLowerCase().includes(selectedTheme.word)
    );
    
    setRelatedReviews(related);
  }, [selectedTheme, filteredReviews]);
  
  const handleThemeClick = (theme) => {
    setSelectedTheme(theme);
  };
  
  if (isLoading) {
    return <div>Loading theme analysis data...</div>;
  }
  
  // Prepare data for bar chart
  const chartData = themes.slice(0, 10).map(theme => ({
    theme: theme.word,
    count: theme.count
  }));
  
  return (
    <PageContainer>
      <Title>Theme Analysis</Title>
      
      <FiltersContainer>
        <DateRangeFilter />
      </FiltersContainer>
      
      <ThemeCloud 
        reviews={filteredReviews} 
        onThemeClick={handleThemeClick}
      />
      
      <ChartContainer>
        <SectionTitle>Top Themes</SectionTitle>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="theme" 
              angle={-45} 
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Frequency" 
              fill="#8884d8" 
              onClick={(data) => {
                const theme = themes.find(t => t.word === data.theme);
                if (theme) {
                  setSelectedTheme(theme);
                }
              }}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <ThemeDetailsContainer>
        {selectedTheme ? (
          <>
            <SelectedThemeHeading>
              Theme: "{selectedTheme.word}"
            </SelectedThemeHeading>
            <ThemeDescription>
              This theme appears in {relatedReviews.length} reviews ({Math.round((relatedReviews.length / filteredReviews.length) * 100)}% of total).
              The average rating of reviews mentioning this theme is {
                relatedReviews.length > 0 
                  ? (relatedReviews.reduce((sum, review) => sum + review.rating, 0) / relatedReviews.length).toFixed(1)
                  : 'N/A'
              }.
            </ThemeDescription>
            <SectionTitle>Reviews Mentioning This Theme</SectionTitle>
            <ReviewsTable reviews={relatedReviews} />
          </>
        ) : (
          <NoTheme>
            Select a theme from the word cloud or bar chart to see related reviews.
          </NoTheme>
        )}
      </ThemeDetailsContainer>
    </PageContainer>
  );
};

export default ThemeAnalysis; 