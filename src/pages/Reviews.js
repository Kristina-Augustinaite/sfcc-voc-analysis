import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import ReviewsTable from '../components/ReviewsTable';
import DateRangeFilter from '../components/DateRangeFilter';

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

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #495057;
  min-width: 80px;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  flex-grow: 1;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SourceCheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const RatingSlider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
`;

const Slider = styled.input`
  flex-grow: 1;
`;

const RatingValue = styled.span`
  font-weight: bold;
  color: #007bff;
  min-width: 30px;
  text-align: center;
`;

const FilterSummary = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: #6c757d;
`;

const Reviews = () => {
  const { 
    filteredReviews, 
    filters, 
    updateFilters, 
    isLoading, 
    getAvailableSources 
  } = useAppContext();
  
  const handleSearchChange = (e) => {
    updateFilters({ searchQuery: e.target.value });
  };
  
  const handleMinRatingChange = (e) => {
    const value = Number(e.target.value);
    updateFilters({ 
      minRating: value,
      maxRating: Math.max(value, filters.maxRating)
    });
  };
  
  const handleMaxRatingChange = (e) => {
    const value = Number(e.target.value);
    updateFilters({ 
      maxRating: value,
      minRating: Math.min(value, filters.minRating)
    });
  };
  
  const handleSourceChange = (source) => {
    let updatedSources;
    
    if (filters.sources.includes(source)) {
      updatedSources = filters.sources.filter(s => s !== source);
    } else {
      updatedSources = [...filters.sources, source];
    }
    
    updateFilters({ sources: updatedSources });
  };
  
  const availableSources = getAvailableSources();
  
  if (isLoading) {
    return <div>Loading reviews data...</div>;
  }
  
  return (
    <PageContainer>
      <Title>Customer Reviews</Title>
      
      <FiltersContainer>
        <FilterRow>
          <FilterLabel>Search:</FilterLabel>
          <SearchInput 
            type="text" 
            placeholder="Search by title, content, or product"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
        </FilterRow>
        
        <DateRangeFilter />
        
        <FilterRow>
          <FilterLabel>Rating:</FilterLabel>
          <RatingSlider>
            <RatingValue>{filters.minRating}</RatingValue>
            <Slider 
              type="range" 
              min={1} 
              max={5} 
              step={1}
              value={filters.minRating}
              onChange={handleMinRatingChange}
            />
            <span>to</span>
            <Slider 
              type="range" 
              min={1} 
              max={5} 
              step={1}
              value={filters.maxRating}
              onChange={handleMaxRatingChange}
            />
            <RatingValue>{filters.maxRating}</RatingValue>
          </RatingSlider>
        </FilterRow>
        
        <FilterRow>
          <FilterLabel>Source:</FilterLabel>
          <SourceCheckboxGroup>
            {availableSources.map(source => (
              <CheckboxLabel key={source}>
                <input 
                  type="checkbox" 
                  checked={filters.sources.includes(source)}
                  onChange={() => handleSourceChange(source)}
                />
                {source}
              </CheckboxLabel>
            ))}
          </SourceCheckboxGroup>
        </FilterRow>
        
        <FilterSummary>
          Showing {filteredReviews.length} of {filteredReviews.length} reviews
        </FilterSummary>
      </FiltersContainer>
      
      <ReviewsTable reviews={filteredReviews} />
    </PageContainer>
  );
};

export default Reviews; 