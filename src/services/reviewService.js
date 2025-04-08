import sampleReviews from '../data/sampleReviews';
import { format, parseISO, subMonths } from 'date-fns';

// In a real app, this would fetch from Trustpilot API or a backend service
const fetchReviews = (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredReviews = [...sampleReviews];
      
      // Apply rating filter
      if (filters.minRating) {
        filteredReviews = filteredReviews.filter(review => 
          review.rating >= filters.minRating
        );
      }
      
      if (filters.maxRating) {
        filteredReviews = filteredReviews.filter(review => 
          review.rating <= filters.maxRating
        );
      }
      
      // Apply date range filter
      if (filters.startDate) {
        filteredReviews = filteredReviews.filter(review => 
          new Date(review.date) >= new Date(filters.startDate)
        );
      }
      
      if (filters.endDate) {
        filteredReviews = filteredReviews.filter(review => 
          new Date(review.date) <= new Date(filters.endDate)
        );
      }
      
      // Apply text search
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredReviews = filteredReviews.filter(review => 
          review.text.toLowerCase().includes(term) || 
          review.title.toLowerCase().includes(term)
        );
      }

      // Apply author filter
      if (filters.authors && filters.authors.length > 0) {
        filteredReviews = filteredReviews.filter(review => 
          filters.authors.includes(review.author)
        );
      }

      // Apply verification filter
      if (filters.verifiedOnly) {
        filteredReviews = filteredReviews.filter(review => review.verified);
      }

      // Apply source filter
      if (filters.sources && filters.sources.length > 0) {
        filteredReviews = filteredReviews.filter(review => 
          filters.sources.includes(review.source)
        );
      }

      // Sort the results
      if (filters.sortBy) {
        filteredReviews.sort((a, b) => {
          switch (filters.sortBy) {
            case 'dateDesc':
              return new Date(b.date) - new Date(a.date);
            case 'dateAsc':
              return new Date(a.date) - new Date(b.date);
            case 'ratingDesc':
              return b.rating - a.rating;
            case 'ratingAsc':
              return a.rating - b.rating;
            default:
              return 0;
          }
        });
      } else {
        // Default sorting by date descending
        filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      resolve(filteredReviews);
    }, 300); // simulate network delay
  });
};

// Get predefined date filters
const getDateFilters = () => {
  const now = new Date();
  
  return {
    last30Days: {
      startDate: format(subMonths(now, 1), 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    },
    last3Months: {
      startDate: format(subMonths(now, 3), 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    },
    last6Months: {
      startDate: format(subMonths(now, 6), 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    },
    lastYear: {
      startDate: format(subMonths(now, 12), 'yyyy-MM-dd'),
      endDate: format(now, 'yyyy-MM-dd')
    }
  };
};

// Get all unique sources from the data
const getAllSources = () => {
  const sources = new Set(sampleReviews.map(review => review.source));
  return Array.from(sources);
};

// Get all unique authors from the data
const getAllAuthors = () => {
  const authors = new Set(sampleReviews.map(review => review.author));
  return Array.from(authors);
};

// Get review statistics
const getReviewStats = (reviews = sampleReviews) => {
  const stats = {
    totalReviews: reviews.length,
    averageRating: 0,
    positiveCount: 0,
    neutralCount: 0,
    negativeCount: 0,
    verifiedCount: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  };

  if (reviews.length > 0) {
    // Calculate rating distribution and counts
    reviews.forEach(review => {
      // Count by rating
      stats.ratingDistribution[review.rating]++;
      
      // Count by sentiment category
      if (review.rating >= 4) stats.positiveCount++;
      else if (review.rating <= 2) stats.negativeCount++;
      else stats.neutralCount++;
      
      // Count verified reviews
      if (review.verified) stats.verifiedCount++;
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    stats.averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
  }

  return stats;
};

export {
  fetchReviews,
  getDateFilters,
  getAllSources,
  getAllAuthors,
  getReviewStats
}; 