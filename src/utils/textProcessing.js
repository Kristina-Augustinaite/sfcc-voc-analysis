import natural from 'natural';
import Sentiment from 'sentiment';

const tokenizer = new natural.WordTokenizer();
const sentiment = new Sentiment();
const stemmer = natural.PorterStemmer;

// Add common prefixes that should be kept with their words
const commonPrefixes = ['multi', 'pre', 'post', 'non', 'sub', 'inter', 'intra'];

/**
 * Perform sentiment analysis on text
 * @param {string} text - The text to analyze
 * @returns {Object} Sentiment analysis result with score and comparative values
 */
export const analyzeSentiment = (text) => {
  if (!text) return { score: 0, comparative: 0 };
  return sentiment.analyze(text);
};

/**
 * Extract key themes/topics from a collection of texts
 * @param {Array} texts - Array of text strings
 * @param {number} maxThemes - Maximum number of themes to return
 * @returns {Array} Array of objects with word and count properties
 */
export const extractThemes = (texts, maxThemes = 20) => {
  if (!texts || !Array.isArray(texts) || texts.length === 0) return [];

  // Preprocess text to handle hyphenated words
  const preprocessText = (text) => {
    return text.replace(/\b(multi|pre|post|non|sub|inter|intra)-(\w+)/gi, (match, prefix, word) => {
      return prefix + word; // Join prefix with word
    });
  };

  // Join all texts and tokenize
  const allText = preprocessText(texts.join(' ')).toLowerCase();
  const tokens = tokenizer.tokenize(allText);
  
  // Remove stop words and create stem mapping
  const stopWords = natural.stopwords;
  const stemMapping = {};
  const filteredTokens = tokens.filter(token => {
    // Keep compound words with common prefixes
    const hasPrefix = commonPrefixes.some(prefix => token.startsWith(prefix) && token.length > prefix.length);
    return (token.length > 2 && 
           !stopWords.includes(token) &&
           !/^\d+$/.test(token) && // Remove pure numbers
           (hasPrefix || !/[^a-zA-Z\s]/.test(token))); // Allow compound words with prefixes
  });
  
  // Create stem to original word mapping
  filteredTokens.forEach(token => {
    const stem = stemmer.stem(token);
    // For compound words, always prefer the full compound word
    const hasPrefix = commonPrefixes.some(prefix => token.startsWith(prefix));
    if (!stemMapping[stem] || hasPrefix || token.length < stemMapping[stem].length) {
      stemMapping[stem] = token;
    }
  });
  
  // Count frequencies using stems
  const frequencies = {};
  filteredTokens.forEach(token => {
    const stem = stemmer.stem(token);
    frequencies[stem] = (frequencies[stem] || 0) + 1;
  });
  
  // Convert to array, map back to original words, and sort
  const themes = Object.entries(frequencies)
    .map(([stem, count]) => ({
      word: stemMapping[stem] || stem,
      count
    }))
    .filter(theme => theme.count > 1 && theme.word.length > 3) // Remove single occurrences and very short words
    .sort((a, b) => b.count - a.count)
    .slice(0, maxThemes);
  
  return themes;
};

/**
 * Calculate the average sentiment score for a collection of texts
 * @param {Array} texts - Array of text strings
 * @returns {number} Average sentiment score
 */
export const calculateAverageSentiment = (texts) => {
  if (!texts || !Array.isArray(texts) || texts.length === 0) return 0;
  
  const totalScore = texts.reduce((sum, text) => {
    const { score } = analyzeSentiment(text);
    return sum + score;
  }, 0);
  
  return totalScore / texts.length;
};

/**
 * Group reviews by sentiment category
 * @param {Array} reviews - Array of review objects
 * @param {string} textProperty - Property name containing the text to analyze
 * @returns {Object} Object with sentiment categories as keys and arrays of reviews as values
 */
export const groupBySentiment = (reviews, textProperty = 'content') => {
  if (!reviews || !Array.isArray(reviews)) return {};
  
  return reviews.reduce((groups, review) => {
    const { score } = analyzeSentiment(review[textProperty]);
    let category;
    
    if (score >= 2) category = 'positive';
    else if (score <= -2) category = 'negative';
    else category = 'neutral';
    
    if (!groups[category]) {
      groups[category] = [];
    }
    
    groups[category].push(review);
    return groups;
  }, {});
}; 