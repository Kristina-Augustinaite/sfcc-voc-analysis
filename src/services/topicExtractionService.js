import natural from 'natural';
import { groupBy, countBy, sortBy } from 'lodash';

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const stopwords = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be',
  'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does',
  'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he',
  'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its',
  'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once',
  'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some',
  'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you', 'your', 'yours', 'yourself',
  'yourselves', 'also', 'get', 'got', 'im'
]);

// Add domain-specific stopwords related to reviews
const reviewStopwords = new Set([
  'review', 'star', 'stars', 'rating', 'rated', 'product', 'service', 'customer',
  'experience', 'purchased', 'buy', 'bought', 'ordering', 'order', 'received'
]);

/**
 * Extract keywords from text
 * @param {string} text - Text to extract keywords from
 * @param {Object} options - Options for keyword extraction
 * @returns {Array} Extracted keywords
 */
const extractKeywords = (text, options = {}) => {
  if (!text) return [];
  
  const { 
    minWordLength = 3, 
    removeStopwords = true,
    removeDomainStopwords = true,
    stemWords = false 
  } = options;
  
  // Tokenize and normalize
  let tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Filter tokens
  tokens = tokens.filter(token => {
    // Skip short words
    if (token.length < minWordLength) return false;
    
    // Skip stopwords if enabled
    if (removeStopwords && stopwords.has(token)) return false;
    
    // Skip domain-specific stopwords if enabled
    if (removeDomainStopwords && reviewStopwords.has(token)) return false;
    
    // Keep only alphanumeric words (allowing apostrophes for contractions)
    return /^[a-z0-9']+$/.test(token);
  });
  
  // Apply stemming if enabled
  if (stemWords) {
    tokens = tokens.map(token => stemmer.stem(token));
  }
  
  return tokens;
};

/**
 * Extract top keywords from a collection of reviews
 * @param {Array} reviews - Array of review objects
 * @param {Object} options - Options for extraction
 * @returns {Array} Top keywords with frequency
 */
const extractTopKeywords = (reviews, options = {}) => {
  if (!reviews || !reviews.length) return [];
  
  const { 
    textField = 'text',
    limit = 20,
    minWordLength = 3,
    removeStopwords = true,
    removeDomainStopwords = true,
    stemWords = false,
    minFrequency = 2
  } = options;
  
  // Collect all keywords from all reviews
  const allKeywords = [];
  
  reviews.forEach(review => {
    if (!review[textField]) return;
    
    const keywords = extractKeywords(review[textField], {
      minWordLength,
      removeStopwords,
      removeDomainStopwords,
      stemWords
    });
    
    allKeywords.push(...keywords);
  });
  
  // Count frequencies
  const frequencies = countBy(allKeywords);
  
  // Convert to array and filter by minimum frequency
  const keywordsList = Object.entries(frequencies)
    .map(([keyword, count]) => ({ keyword, count }))
    .filter(item => item.count >= minFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  
  return keywordsList;
};

/**
 * Extract top keywords by sentiment
 * @param {Array} reviews - Array of review objects with sentiment analysis
 * @param {Object} options - Options for extraction
 * @returns {Object} Top keywords for positive, negative, and neutral reviews
 */
const extractKeywordsBySentiment = (reviews, options = {}) => {
  if (!reviews || !reviews.length) return { 
    positive: [], 
    negative: [], 
    neutral: [] 
  };
  
  // Ensure all reviews have sentiment
  const reviewsWithSentiment = reviews.map(review => {
    if (review.sentiment) return review;
    
    // If sentiment analysis is not available, return as neutral
    return { 
      ...review, 
      sentiment: { classification: 'neutral' } 
    };
  });
  
  // Group by sentiment
  const grouped = groupBy(
    reviewsWithSentiment, 
    review => review.sentiment.classification
  );
  
  // Ensure all sentiment groups exist
  const sentiments = ['positive', 'negative', 'neutral'];
  sentiments.forEach(sentiment => {
    if (!grouped[sentiment]) {
      grouped[sentiment] = [];
    }
  });
  
  // Extract keywords for each sentiment
  return {
    positive: extractTopKeywords(grouped.positive, options),
    negative: extractTopKeywords(grouped.negative, options),
    neutral: extractTopKeywords(grouped.neutral, options)
  };
};

/**
 * Extract bigrams (2-word phrases) from reviews
 * @param {Array} reviews - Array of review objects
 * @param {Object} options - Options for extraction
 * @returns {Array} Top bigrams with frequency
 */
const extractTopBigrams = (reviews, options = {}) => {
  if (!reviews || !reviews.length) return [];
  
  const { 
    textField = 'text',
    limit = 20,
    minFrequency = 2,
    removeStopwords = true
  } = options;
  
  // All bigrams from all reviews
  const allBigrams = [];
  
  reviews.forEach(review => {
    if (!review[textField]) return;
    
    // Tokenize and filter
    let tokens = tokenizer.tokenize(review[textField].toLowerCase());
    
    if (removeStopwords) {
      tokens = tokens.filter(token => 
        !stopwords.has(token) && !reviewStopwords.has(token)
      );
    }
    
    // Extract bigrams
    for (let i = 0; i < tokens.length - 1; i++) {
      if (tokens[i].length > 2 && tokens[i+1].length > 2) {
        allBigrams.push(`${tokens[i]} ${tokens[i+1]}`);
      }
    }
  });
  
  // Count frequencies
  const frequencies = countBy(allBigrams);
  
  // Convert to array and filter by minimum frequency
  const bigramsList = Object.entries(frequencies)
    .map(([phrase, count]) => ({ phrase, count }))
    .filter(item => item.count >= minFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  
  return bigramsList;
};

/**
 * Compare top keywords between two periods
 * @param {Array} period1Reviews - First period reviews
 * @param {Array} period2Reviews - Second period reviews
 * @param {Object} options - Options for extraction
 * @returns {Object} Keyword comparison results
 */
const compareKeywordsBetweenPeriods = (period1Reviews, period2Reviews, options = {}) => {
  const period1Keywords = extractTopKeywords(period1Reviews, {
    ...options,
    limit: 100 // Get more keywords for better comparison
  });
  
  const period2Keywords = extractTopKeywords(period2Reviews, {
    ...options,
    limit: 100 // Get more keywords for better comparison
  });
  
  const period1Map = new Map(period1Keywords.map(k => [k.keyword, k]));
  const period2Map = new Map(period2Keywords.map(k => [k.keyword, k]));
  
  // Find keywords that increased the most
  const increasedKeywords = period2Keywords
    .map(p2 => {
      const p1 = period1Map.get(p2.keyword);
      if (!p1) return { keyword: p2.keyword, count: p2.count, change: p2.count };
      
      return {
        keyword: p2.keyword,
        count: p2.count,
        previousCount: p1.count,
        change: p2.count - p1.count,
        percentChange: p1.count > 0 ? ((p2.count - p1.count) / p1.count) * 100 : Number.POSITIVE_INFINITY
      };
    })
    .filter(k => k.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, options.limit || 10);
  
  // Find keywords that decreased the most
  const decreasedKeywords = period1Keywords
    .map(p1 => {
      const p2 = period2Map.get(p1.keyword);
      if (!p2) return { keyword: p1.keyword, previousCount: p1.count, change: -p1.count };
      
      return {
        keyword: p1.keyword,
        count: p2.count,
        previousCount: p1.count,
        change: p2.count - p1.count,
        percentChange: ((p2.count - p1.count) / p1.count) * 100
      };
    })
    .filter(k => k.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, options.limit || 10);
  
  // Find new keywords that didn't exist in period 1
  const newKeywords = period2Keywords
    .filter(p2 => !period1Map.has(p2.keyword))
    .sort((a, b) => b.count - a.count)
    .slice(0, options.limit || 10);
  
  return {
    increased: increasedKeywords,
    decreased: decreasedKeywords,
    new: newKeywords,
    period1Top: period1Keywords.slice(0, options.limit || 10),
    period2Top: period2Keywords.slice(0, options.limit || 10)
  };
};

/**
 * Group reviews by common topics/themes
 * @param {Array} reviews - Array of review objects
 * @param {Object} options - Options for topic extraction
 * @returns {Object} Reviews grouped by detected topics
 */
const groupReviewsByTopic = (reviews, options = {}) => {
  if (!reviews || !reviews.length) return { topics: [], groupedReviews: {} };
  
  const { 
    textField = 'text',
    topicCount = 5,
    keywordsPerTopic = 5
  } = options;
  
  // Extract all keywords with frequencies
  const allKeywords = extractTopKeywords(reviews, {
    textField,
    limit: 100,
    minFrequency: 3
  });
  
  // Map to keep track of each review's relevant keywords
  const reviewKeywords = reviews.map(review => {
    const keywords = extractKeywords(review[textField], {
      minWordLength: 3,
      removeStopwords: true,
      removeDomainStopwords: true
    });
    
    return {
      review,
      keywords: new Set(keywords)
    };
  });
  
  // Group keywords into topics (simple approach)
  // For a more sophisticated approach, a proper clustering algorithm would be needed
  const topKeywords = allKeywords.slice(0, topicCount);
  
  // For each topic keyword, find related reviews
  const topics = topKeywords.map(topic => {
    // Find reviews containing this keyword
    const relatedReviews = reviewKeywords
      .filter(item => item.keywords.has(topic.keyword))
      .map(item => item.review);
    
    // Find related keywords that frequently appear with this topic
    const coOccurringKeywords = allKeywords
      .filter(keyword => keyword.keyword !== topic.keyword)
      .map(keyword => {
        // Count how many times this keyword appears with the topic keyword
        const coOccurrences = reviewKeywords.filter(
          item => item.keywords.has(topic.keyword) && item.keywords.has(keyword.keyword)
        ).length;
        
        return {
          keyword: keyword.keyword,
          coOccurrences
        };
      })
      .filter(item => item.coOccurrences > 0)
      .sort((a, b) => b.coOccurrences - a.coOccurrences)
      .slice(0, keywordsPerTopic - 1);
    
    return {
      mainKeyword: topic.keyword,
      frequency: topic.count,
      relatedKeywords: coOccurringKeywords.map(k => k.keyword),
      reviewCount: relatedReviews.length
    };
  });
  
  // Group reviews by the topic they most strongly relate to
  const groupedReviews = {};
  
  // Initialize topic groups
  topics.forEach(topic => {
    groupedReviews[topic.mainKeyword] = [];
  });
  
  // Add "other" category for reviews not matching any topic
  groupedReviews["other"] = [];
  
  // Assign each review to its best matching topic
  reviewKeywords.forEach(({ review, keywords }) => {
    let bestMatch = null;
    let maxMatches = 0;
    
    // Find topic with most keyword matches
    topics.forEach(topic => {
      // Check mainKeyword
      let matches = keywords.has(topic.mainKeyword) ? 1 : 0;
      
      // Check related keywords
      topic.relatedKeywords.forEach(relatedKeyword => {
        if (keywords.has(relatedKeyword)) {
          matches++;
        }
      });
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = topic.mainKeyword;
      }
    });
    
    // Assign review to best matching topic or "other"
    if (bestMatch && maxMatches > 0) {
      groupedReviews[bestMatch].push(review);
    } else {
      groupedReviews["other"].push(review);
    }
  });
  
  return {
    topics,
    groupedReviews
  };
};

export {
  extractKeywords,
  extractTopKeywords,
  extractKeywordsBySentiment,
  extractTopBigrams,
  compareKeywordsBetweenPeriods,
  groupReviewsByTopic
}; 