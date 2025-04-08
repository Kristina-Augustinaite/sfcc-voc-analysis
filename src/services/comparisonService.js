import { groupBy } from 'lodash';

/**
 * Compare ratings across two time periods
 * @param {Array} period1Reviews - Reviews from the first period
 * @param {Array} period2Reviews - Reviews from the second period
 * @returns {Object} Comparison of ratings between periods
 */
const compareRatings = (period1Reviews, period2Reviews) => {
  if (!period1Reviews?.length && !period2Reviews?.length) {
    return { period1: null, period2: null, change: null };
  }

  const period1Avg = period1Reviews?.length 
    ? period1Reviews.reduce((sum, review) => sum + review.rating, 0) / period1Reviews.length 
    : null;
    
  const period2Avg = period2Reviews?.length 
    ? period2Reviews.reduce((sum, review) => sum + review.rating, 0) / period2Reviews.length 
    : null;

  let change = null;
  let percentChange = null;
  
  if (period1Avg !== null && period2Avg !== null) {
    change = period2Avg - period1Avg;
    percentChange = period1Avg !== 0 ? (change / period1Avg) * 100 : null;
  }

  return {
    period1: period1Avg ? Number(period1Avg.toFixed(2)) : null,
    period2: period2Avg ? Number(period2Avg.toFixed(2)) : null,
    change: change ? Number(change.toFixed(2)) : null,
    percentChange: percentChange ? Number(percentChange.toFixed(2)) : null
  };
};

/**
 * Compare review volume across two time periods
 * @param {Array} period1Reviews - Reviews from the first period
 * @param {Array} period2Reviews - Reviews from the second period
 * @returns {Object} Comparison of review volumes between periods
 */
const compareVolume = (period1Reviews, period2Reviews) => {
  const period1Count = period1Reviews?.length || 0;
  const period2Count = period2Reviews?.length || 0;
  
  const change = period2Count - period1Count;
  const percentChange = period1Count !== 0 
    ? (change / period1Count) * 100 
    : (period2Count > 0 ? 100 : 0);

  return {
    period1: period1Count,
    period2: period2Count,
    change: change,
    percentChange: Number(percentChange.toFixed(2))
  };
};

/**
 * Compare ratings distribution across two periods
 * @param {Array} period1Reviews - Reviews from the first period
 * @param {Array} period2Reviews - Reviews from the second period
 * @returns {Object} Comparison of rating distributions
 */
const compareRatingDistribution = (period1Reviews, period2Reviews) => {
  const period1Dist = getRatingDistribution(period1Reviews);
  const period2Dist = getRatingDistribution(period2Reviews);
  
  const changes = {};
  
  // Calculate changes for each rating
  for (let i = 1; i <= 5; i++) {
    const r1 = period1Dist[i] || 0;
    const r2 = period2Dist[i] || 0;
    
    changes[i] = {
      period1: r1,
      period2: r2,
      change: Number((r2 - r1).toFixed(2)),
      percentChange: r1 !== 0 
        ? Number(((r2 - r1) / r1 * 100).toFixed(2)) 
        : (r2 > 0 ? 100 : 0)
    };
  }
  
  return changes;
};

/**
 * Helper to get rating distribution percentages
 * @param {Array} reviews - Array of reviews
 * @returns {Object} Distribution of ratings as percentages
 */
const getRatingDistribution = (reviews) => {
  if (!reviews || !reviews.length) return {};
  
  const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    }
  });
  
  const total = reviews.length;
  const distribution = {};
  
  Object.keys(counts).forEach(rating => {
    distribution[rating] = Number(((counts[rating] / total) * 100).toFixed(2));
  });
  
  return distribution;
};

/**
 * Compare reviews across sources
 * @param {Array} reviews - Array of all reviews
 * @returns {Object} Comparison metrics by source
 */
const compareAcrossSources = (reviews) => {
  if (!reviews || !reviews.length) return {};
  
  // Group reviews by source
  const bySource = groupBy(reviews, 'source');
  
  const comparison = {};
  
  // Calculate metrics for each source
  Object.entries(bySource).forEach(([source, sourceReviews]) => {
    const avgRating = sourceReviews.reduce((sum, review) => sum + review.rating, 0) / sourceReviews.length;
    
    comparison[source] = {
      count: sourceReviews.length,
      percentage: Number(((sourceReviews.length / reviews.length) * 100).toFixed(2)),
      avgRating: Number(avgRating.toFixed(2)),
      distribution: getRatingDistribution(sourceReviews)
    };
  });
  
  return comparison;
};

/**
 * Split reviews into two periods based on a dividing date
 * @param {Array} reviews - Array of all reviews
 * @param {Date|string} dividingDate - Date to split the periods
 * @returns {Object} Reviews split into two periods
 */
const splitReviewsByDate = (reviews, dividingDate) => {
  if (!reviews || !reviews.length) {
    return { period1: [], period2: [] };
  }
  
  const divDate = dividingDate instanceof Date 
    ? dividingDate 
    : new Date(dividingDate);
  
  return {
    period1: reviews.filter(review => new Date(review.date) < divDate),
    period2: reviews.filter(review => new Date(review.date) >= divDate)
  };
};

/**
 * Get predefined time period options for comparisons
 * @returns {Array} Time period options
 */
const getComparisonPeriods = () => {
  const now = new Date();
  
  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  // Calculate date 90 days ago
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(now.getDate() - 90);
  
  // Calculate date 180 days ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setDate(now.getDate() - 180);
  
  // Calculate date 365 days ago
  const oneYearAgo = new Date();
  oneYearAgo.setDate(now.getDate() - 365);
  
  return [
    { 
      id: 'last30',
      name: 'Last 30 Days vs Previous 30 Days', 
      currentStart: thirtyDaysAgo,
      previousStart: new Date(thirtyDaysAgo.getTime() - (30 * 24 * 60 * 60 * 1000))
    },
    { 
      id: 'last90',
      name: 'Last 90 Days vs Previous 90 Days', 
      currentStart: ninetyDaysAgo,
      previousStart: new Date(ninetyDaysAgo.getTime() - (90 * 24 * 60 * 60 * 1000))
    },
    { 
      id: 'last180',
      name: 'Last 6 Months vs Previous 6 Months', 
      currentStart: sixMonthsAgo,
      previousStart: new Date(sixMonthsAgo.getTime() - (180 * 24 * 60 * 60 * 1000))
    },
    { 
      id: 'yearOverYear',
      name: 'This Year vs Last Year', 
      currentStart: oneYearAgo,
      previousStart: new Date(oneYearAgo.getTime() - (365 * 24 * 60 * 60 * 1000))
    }
  ];
};

/**
 * Comprehensive comparison between two periods
 * @param {Array} period1Reviews - Reviews from the first period
 * @param {Array} period2Reviews - Reviews from the second period
 * @returns {Object} Complete comparison metrics
 */
const generateComprehensiveComparison = (period1Reviews, period2Reviews) => {
  return {
    ratings: compareRatings(period1Reviews, period2Reviews),
    volume: compareVolume(period1Reviews, period2Reviews),
    distribution: compareRatingDistribution(period1Reviews, period2Reviews),
    period1Count: period1Reviews?.length || 0,
    period2Count: period2Reviews?.length || 0
  };
};

export {
  compareRatings,
  compareVolume,
  compareRatingDistribution,
  compareAcrossSources,
  splitReviewsByDate,
  getComparisonPeriods,
  generateComprehensiveComparison
}; 