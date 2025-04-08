import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const Label = styled.label`
  font-weight: 500;
  color: #495057;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  background-color: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#212529'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#0069d9' : '#e9ecef'};
  }
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #dc3545;
  background-color: white;
  color: #dc3545;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.2s;
  
  &:hover {
    background-color: #dc3545;
    color: white;
  }
`;

const DateRangeFilter = () => {
  const { filters, updateFilters, resetFilters } = useAppContext();
  
  const timeframes = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'all', label: 'All Time' }
  ];
  
  const handleTimeframeChange = (timeframe) => {
    updateFilters({ timeframe });
  };
  
  return (
    <FilterContainer>
      <Label>Time Period:</Label>
      <FilterGroup>
        {timeframes.map(timeframe => (
          <FilterButton
            key={timeframe.value}
            active={filters.timeframe === timeframe.value}
            onClick={() => handleTimeframeChange(timeframe.value)}
          >
            {timeframe.label}
          </FilterButton>
        ))}
      </FilterGroup>
      
      <ResetButton onClick={resetFilters}>
        Reset Filters
      </ResetButton>
    </FilterContainer>
  );
};

export default DateRangeFilter; 