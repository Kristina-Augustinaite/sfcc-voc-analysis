import { 
  analyzeSentiment, 
  batchAnalyzeSentiment, 
  calculateAggregateSentiment, 
  calculateSentimentByRating, 
  getExtremeSentimentReviews,
  trackSentimentOverTime,
  groupReviewsByTimePeriod
} from '../services/sentimentService';

import {
  extractTopKeywords,
  extractKeywordsBySentiment,
  extractTopBigrams,
  compareKeywordsBetweenPeriods,
  groupReviewsByTopic
} from '../services/topicExtractionService';

// Sample reviews for demonstration
const sampleReviews = [
  {
    id: 1,
    text: "I absolutely love this product! It's the best purchase I've made all year. Works perfectly and looks great.",
    rating: 5,
    date: new Date('2023-01-10')
  },
  {
    id: 2,
    text: "Good quality for the price. Shipped quickly and does exactly what it claims to do.",
    rating: 4,
    date: new Date('2023-01-15')
  },
  {
    id: 3,
    text: "It's okay, but the battery life could be better. Not sure if I would recommend it.",
    rating: 3,
    date: new Date('2023-01-20')
  },
  {
    id: 4,
    text: "Disappointed with this purchase. The product broke after just two weeks of normal use.",
    rating: 2,
    date: new Date('2023-02-01')
  },
  {
    id: 5,
    text: "Terrible quality and awful customer service. Complete waste of money. Do not buy!",
    rating: 1,
    date: new Date('2023-02-05')
  },
  {
    id: 6,
    text: "The design is beautiful and modern. Fits perfectly in my home.",
    rating: 5,
    date: new Date('2023-02-10')
  },
  {
    id: 7,
    text: "Easy to set up and the instructions were clear. Good value overall.",
    rating: 4,
    date: new Date('2023-02-15')
  },
  {
    id: 8,
    text: "Shipping was slow and packaging was damaged. The product works but I expected better service.",
    rating: 3,
    date: new Date('2023-02-20')
  },
  {
    id: 9,
    text: "The battery life is amazing, and it charges quickly. Great for travel!",
    rating: 5,
    date: new Date('2023-03-01')
  },
  {
    id: 10,
    text: "Unreliable connection and frequently drops signal. Customer support wasn't helpful at all.",
    rating: 2,
    date: new Date('2023-03-05')
  }
];

// Compare two time periods
const period1Reviews = sampleReviews.filter(review => review.date < new Date('2023-02-01'));
const period2Reviews = sampleReviews.filter(review => review.date >= new Date('2023-02-01'));

/**
 * Run a complete Voice of Customer analysis demo
 */
const runVoCDemo = () => {
  console.log('=== VOICE OF CUSTOMER ANALYSIS DEMO ===\n');
  
  // Step 1: Analyze sentiment for all reviews
  console.log('STEP 1: SENTIMENT ANALYSIS');
  console.log('--------------------------------');
  
  const reviewsWithSentiment = batchAnalyzeSentiment(sampleReviews);
  
  // Show the first review with sentiment analysis
  console.log('\nSample review with sentiment analysis:');
  console.log(JSON.stringify(reviewsWithSentiment[0], null, 2));
  
  // Step 2: Calculate aggregate sentiment metrics
  console.log('\nSTEP 2: AGGREGATE SENTIMENT METRICS');
  console.log('--------------------------------');
  
  const aggregateSentiment = calculateAggregateSentiment(reviewsWithSentiment);
  console.log('\nAggregate Sentiment Metrics:');
  console.log(JSON.stringify(aggregateSentiment, null, 2));
  
  // Step 3: Calculate sentiment by rating
  console.log('\nSTEP 3: SENTIMENT BY RATING');
  console.log('--------------------------------');
  
  const sentimentByRating = calculateSentimentByRating(reviewsWithSentiment);
  console.log('\nSentiment Metrics by Rating:');
  console.log(JSON.stringify(sentimentByRating, null, 2));
  
  // Step 4: Find extreme sentiment reviews
  console.log('\nSTEP 4: EXTREME SENTIMENT REVIEWS');
  console.log('--------------------------------');
  
  const extremeReviews = getExtremeSentimentReviews(reviewsWithSentiment);
  console.log('\nMost Positive Review:');
  console.log(JSON.stringify(extremeReviews.mostPositive, null, 2));
  
  console.log('\nMost Negative Review:');
  console.log(JSON.stringify(extremeReviews.mostNegative, null, 2));
  
  // Step 5: Track sentiment over time
  console.log('\nSTEP 5: SENTIMENT OVER TIME');
  console.log('--------------------------------');
  
  const monthlySentiment = trackSentimentOverTime(reviewsWithSentiment, 'month');
  console.log('\nMonthly Sentiment Trends:');
  console.log(JSON.stringify(monthlySentiment, null, 2));
  
  // Step 6: Extract top keywords
  console.log('\nSTEP 6: TOP KEYWORDS');
  console.log('--------------------------------');
  
  const topKeywords = extractTopKeywords(reviewsWithSentiment, { limit: 10 });
  console.log('\nTop 10 Keywords:');
  console.log(JSON.stringify(topKeywords, null, 2));
  
  // Step 7: Extract keywords by sentiment
  console.log('\nSTEP 7: KEYWORDS BY SENTIMENT');
  console.log('--------------------------------');
  
  const keywordsBySentiment = extractKeywordsBySentiment(reviewsWithSentiment, { limit: 5 });
  console.log('\nTop Keywords by Sentiment:');
  console.log(JSON.stringify(keywordsBySentiment, null, 2));
  
  // Step 8: Extract top bigrams (phrases)
  console.log('\nSTEP 8: TOP BIGRAMS (PHRASES)');
  console.log('--------------------------------');
  
  const topBigrams = extractTopBigrams(reviewsWithSentiment, { limit: 10 });
  console.log('\nTop 10 Phrases:');
  console.log(JSON.stringify(topBigrams, null, 2));
  
  // Step 9: Compare keywords between time periods
  console.log('\nSTEP 9: KEYWORD TRENDS BETWEEN PERIODS');
  console.log('--------------------------------');
  
  // First, add sentiment to both periods
  const period1WithSentiment = batchAnalyzeSentiment(period1Reviews);
  const period2WithSentiment = batchAnalyzeSentiment(period2Reviews);
  
  const keywordComparison = compareKeywordsBetweenPeriods(
    period1WithSentiment, 
    period2WithSentiment, 
    { limit: 5 }
  );
  
  console.log('\nKeyword Trends Between January and February-March:');
  console.log(JSON.stringify(keywordComparison, null, 2));
  
  // Step 10: Group reviews by topic
  console.log('\nSTEP 10: REVIEWS GROUPED BY TOPIC');
  console.log('--------------------------------');
  
  const topicGroups = groupReviewsByTopic(reviewsWithSentiment, {
    topicCount: 3,
    keywordsPerTopic: 3
  });
  
  console.log('\nDetected Topics:');
  console.log(JSON.stringify(topicGroups.topics, null, 2));
  
  console.log('\nSample of Reviews by Topic:');
  Object.entries(topicGroups.groupedReviews).forEach(([topic, reviews]) => {
    console.log(`\nTopic: ${topic} (${reviews.length} reviews)`);
    if (reviews.length > 0) {
      console.log(`Sample review: "${reviews[0].text}"`);
    }
  });
  
  // Summary insights
  console.log('\n=== SUMMARY INSIGHTS ===');
  console.log('--------------------------------');
  
  console.log(`Total Reviews Analyzed: ${reviewsWithSentiment.length}`);
  console.log(`Overall Sentiment: ${aggregateSentiment.averageScore.toFixed(2)} (${aggregateSentiment.positivePercentage.toFixed(1)}% positive)`);
  console.log(`Main Topics: ${topicGroups.topics.map(t => t.mainKeyword).join(', ')}`);
  console.log(`Top Concerns in Negative Reviews: ${keywordsBySentiment.negative.slice(0, 3).map(k => k.keyword).join(', ')}`);
  console.log(`Trending Topics: ${keywordComparison.increased.slice(0, 3).map(k => k.keyword).join(', ')}`);
  
  return {
    reviewsWithSentiment,
    aggregateSentiment,
    sentimentByRating,
    extremeReviews,
    monthlySentiment,
    topKeywords,
    keywordsBySentiment,
    topBigrams,
    keywordComparison,
    topicGroups
  };
};

// Export the demo function
export default runVoCDemo; 