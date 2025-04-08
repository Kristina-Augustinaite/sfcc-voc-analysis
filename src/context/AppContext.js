import React, { createContext, useState, useEffect, useContext } from 'react';
import sampleReviews from '../data/sampleReviews';
import { getDateFilter } from '../utils/dateUtils';
import { groupBySentiment } from '../utils/textProcessing';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  // State
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    timeframe: 'all',
    minRating: 1,
    maxRating: 5,
    sources: [],
    searchQuery: ''
  });

  // Load sample data (in a real app, this would fetch from an API)
  useEffect(() => {
    try {
      setIsLoading(true);
      // Simulate API fetch delay
      setTimeout(() => {
        // Format dates to ISO string if needed
        const formattedReviews = sampleReviews.map(review => ({
          ...review,
          date: review.date.includes('T') ? review.date : `${review.date}T00:00:00.000Z`
        }));
        setReviews(formattedReviews);
        setFilteredReviews(formattedReviews);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      setError('Error loading reviews data');
      setIsLoading(false);
    }
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters();
  }, [filters, reviews]);

  // Apply all active filters
  const applyFilters = () => {
    const { timeframe, minRating, maxRating, sources, searchQuery } = filters;
    
    let filtered = [...reviews];
    
    // Apply date filter
    const dateFilter = getDateFilter(timeframe);
    filtered = filtered.filter(review => dateFilter(review.date));
    
    // Apply rating filter
    filtered = filtered.filter(review => 
      review.rating >= minRating && review.rating <= maxRating
    );
    
    // Apply source filter
    if (sources.length > 0) {
      filtered = filtered.filter(review => sources.includes(review.source));
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(query) || 
        review.text.toLowerCase().includes(query) ||
        review.product.toLowerCase().includes(query) ||
        (review.author && review.author.toLowerCase().includes(query))
      );
    }
    
    setFilteredReviews(filtered);
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Get available sources from reviews
  const getAvailableSources = () => {
    const sources = new Set(reviews.map(review => review.source));
    return Array.from(sources);
  };

  // Get sentiment groups
  const getSentimentGroups = () => {
    return groupBySentiment(filteredReviews, 'text');
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      timeframe: 'all',
      minRating: 1,
      maxRating: 5,
      sources: [],
      searchQuery: ''
    });
  };

  // Context value
  const contextValue = {
    reviews,
    filteredReviews,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    getAvailableSources,
    getSentimentGroups
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 