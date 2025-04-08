import natural from 'natural';
import { groupBy } from 'lodash';

// Initialize sentiment analyzer from natural
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
const tokenizer = new natural.WordTokenizer();

/**
 * Analyze sentiment of a single text
 * @param {string} text - The text to analyze
 * @returns {Object} Sentiment analysis results
 */
const analyzeSentiment = (text) => {
  if (!text) return { score: 0, comparative: 0, classification: 'neutral' };
  
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const score = analyzer.getSentiment(tokens);
  
  // Get comparative score (normalized by text length)
  const comparative = tokens.length > 0 ? score / tokens.length : 0;
  
  // Classify based on score
  let classification = 'neutral';
  if (comparative > 0.05) classification = 'positive';
  else if (comparative < -0.05) classification = 'negative';
  
  return {
    score,
    comparative: Number(comparative.toFixed(4)),
    classification
  };
};

/**
 * Analyze sentiment for multiple reviews
 * @param {Array} reviews - Array of review objects
 * @returns {Array} Reviews with sentiment data added
 */
const batchAnalyzeSentiment = (reviews) => {
  if (!reviews || !reviews.length) return [];
  
  return reviews.map(review => {
    const sentiment = analyzeSentiment(review.text);
    return {
      ...review,
      sentiment
    };
  });
};

/**
 * Calculate aggregate sentiment metrics for a collection of reviews
 * @param {Array} reviews - Array of review objects
 * @returns {Object} Aggregate sentiment metrics
 */
const calculateAggregateSentiment = (reviews) => {
  if (!reviews || !reviews.length) {
    return {
      averageScore: 0,
      positivePercentage: 0,
      negativePercentage: 0,
      neutralPercentage: 0,
      reviewCount: 0
    };
  }
  
  // First, ensure all reviews have sentiment data
  const reviewsWithSentiment = reviews.map(review => {
    if (review.sentiment) return review;
    const sentiment = analyzeSentiment(review.text);
    return { ...review, sentiment };
  });
  
  // Calculate totals
  const totalScore = reviewsWithSentiment.reduce((sum, review) => sum + review.sentiment.score, 0);
  const averageScore = totalScore / reviewsWithSentiment.length;
  
  // Count by classification
  const classifications = reviewsWithSentiment.map(review => review.sentiment.classification);
  const counts = {
    positive: classifications.filter(c => c === 'positive').length,
    negative: classifications.filter(c => c === 'negative').length,
    neutral: classifications.filter(c => c === 'neutral').length
  };
  
  return {
    averageScore: Number(averageScore.toFixed(4)),
    positivePercentage: Number(((counts.positive / reviewsWithSentiment.length) * 100).toFixed(2)),
    negativePercentage: Number(((counts.negative / reviewsWithSentiment.length) * 100).toFixed(2)),
    neutralPercentage: Number(((counts.neutral / reviewsWithSentiment.length) * 100).toFixed(2)),
    reviewCount: reviewsWithSentiment.length
  };
};

/**
 * Calculate sentiment by rating group
 * @param {Array} reviews - Array of review objects
 * @returns {Object} Sentiment metrics grouped by rating
 */
const calculateSentimentByRating = (reviews) => {
  if (!reviews || !reviews.length) return {};
  
  // Ensure all reviews have sentiment data
  const reviewsWithSentiment = reviews.map(review => {
    if (review.sentiment) return review;
    const sentiment = analyzeSentiment(review.text);
    return { ...review, sentiment };
  });
  
  // Group by rating
  const byRating = groupBy(reviewsWithSentiment, 'rating');
  const result = {};
  
  // Calculate sentiment metrics for each rating group
  Object.entries(byRating).forEach(([rating, ratingReviews]) => {
    result[rating] = calculateAggregateSentiment(ratingReviews);
  });
  
  return result;
};

/**
 * Get reviews with the most extreme sentiment (most positive/negative)
 * @param {Array} reviews - Array of review objects
 * @param {Object} options - Options for filtering
 * @returns {Object} Most positive and negative reviews
 */
const getExtremeSentimentReviews = (reviews, options = {}) => {
  if (!reviews || !reviews.length) {
    return { positive: [], negative: [] };
  }
  
  const { limit = 5, minLength = 20 } = options;
  
  // Ensure all reviews have sentiment data
  const reviewsWithSentiment = reviews.map(review => {
    if (review.sentiment) return review;
    const sentiment = analyzeSentiment(review.text);
    return { ...review, sentiment };
  });
  
  // Filter out very short reviews if specified
  const filteredReviews = minLength 
    ? reviewsWithSentiment.filter(review => review.text.length >= minLength)
    : reviewsWithSentiment;
  
  // Sort by comparative score (descending for positive, ascending for negative)
  const sortedByPositive = [...filteredReviews].sort((a, b) => 
    b.sentiment.comparative - a.sentiment.comparative
  );
  
  const sortedByNegative = [...filteredReviews].sort((a, b) => 
    a.sentiment.comparative - b.sentiment.comparative
  );
  
  return {
    positive: sortedByPositive.slice(0, limit),
    negative: sortedByNegative.slice(0, limit)
  };
};

/**
 * Track sentiment changes over time
 * @param {Array} reviews - Array of review objects
 * @param {Object} options - Options for time grouping
 * @returns {Array} Sentiment trends by time period
 */
const trackSentimentOverTime = (reviews, options = {}) => {
  if (!reviews || !reviews.length) return [];
  
  const { timeUnit = 'month', limit = 12 } = options;
  
  // Ensure all reviews have sentiment and valid dates
  const validReviews = reviews
    .filter(review => review.date)
    .map(review => {
      if (review.sentiment) return review;
      const sentiment = analyzeSentiment(review.text);
      return { ...review, sentiment, date: new Date(review.date) };
    });
  
  // Group reviews by time period
  const groupedReviews = groupReviewsByTimePeriod(validReviews, timeUnit);
  
  // Sort periods chronologically
  const sortedPeriods = Object.keys(groupedReviews).sort();
  
  // Take the most recent periods up to the limit
  const periodsToInclude = sortedPeriods.slice(-limit);
  
  // Calculate sentiment for each period
  return periodsToInclude.map(period => {
    const periodReviews = groupedReviews[period];
    const sentimentMetrics = calculateAggregateSentiment(periodReviews);
    
    return {
      period,
      ...sentimentMetrics,
      reviewCount: periodReviews.length
    };
  });
};

/**
 * Helper to group reviews by time period
 * @param {Array} reviews - Array of review objects with dates
 * @param {string} timeUnit - Time unit for grouping ('day', 'week', 'month', 'year')
 * @returns {Object} Reviews grouped by time period
 */
const groupReviewsByTimePeriod = (reviews, timeUnit) => {
  return reviews.reduce((groups, review) => {
    const date = new Date(review.date);
    let periodKey;
    
    switch(timeUnit) {
      case 'day':
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        break;
      case 'week':
        // Get ISO week number
        const janFirst = new Date(date.getFullYear(), 0, 1);
        const weekNum = Math.ceil((((date - janFirst) / 86400000) + janFirst.getDay() + 1) / 7);
        periodKey = `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
        break;
      case 'year':
        periodKey = `${date.getFullYear()}`;
        break;
      case 'month':
      default:
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!groups[periodKey]) {
      groups[periodKey] = [];
    }
    
    groups[periodKey].push(review);
    return groups;
  }, {});
};

export {
  analyzeSentiment,
  batchAnalyzeSentiment,
  calculateAggregateSentiment,
  calculateSentimentByRating,
  getExtremeSentimentReviews,
  trackSentimentOverTime
}; 