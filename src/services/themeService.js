import natural from 'natural';
import { groupBy } from 'lodash';

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stopwords = natural.stopwords;
const stemmer = natural.PorterStemmer;
const TfIdf = natural.TfIdf;

// Extract themes from a collection of reviews
const extractThemes = (reviews, textField = 'text', limit = 20) => {
  if (!reviews || !reviews.length) return [];
  
  // Combine all review texts
  const allTexts = reviews.map(review => review[textField]);
  const combinedText = allTexts.join(' ').toLowerCase();
  
  // Tokenize and filter
  const tokens = tokenizer.tokenize(combinedText);
  const filteredTokens = tokens.filter(token => 
    token.length > 2 && !stopwords.includes(token) &&
    !/^\d+$/.test(token) // Remove pure numbers
  );
  
  // Stem words to group similar words
  const stemmed = filteredTokens.map(token => stemmer.stem(token));
  
  // Count frequencies
  const frequencies = {};
  stemmed.forEach(stem => {
    frequencies[stem] = (frequencies[stem] || 0) + 1;
  });
  
  // Convert to array and sort
  return Object.entries(frequencies)
    .map(([word, count]) => ({ word, count }))
    .filter(item => item.count > 1) // Remove singletons
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Calculate relevance of themes to specific ratings
const themeRelevanceByRating = (reviews, textField = 'text', themeLimit = 10) => {
  if (!reviews || !reviews.length) return {};
  
  // Group reviews by rating
  const groupedByRating = groupBy(reviews, 'rating');
  
  // Extract themes for each rating
  const themesByRating = {};
  for (const [rating, ratingReviews] of Object.entries(groupedByRating)) {
    themesByRating[rating] = extractThemes(ratingReviews, textField, themeLimit);
  }
  
  return themesByRating;
};

// Identify trending themes over time
const trendingThemes = (reviews, timeFrame = 'month', textField = 'text', limit = 10) => {
  if (!reviews || !reviews.length) return [];
  
  // Group reviews by time period
  const groupedByPeriod = groupReviewsByTimePeriod(reviews, timeFrame);
  
  // Extract themes for each period
  const themesByPeriod = {};
  for (const [period, periodReviews] of Object.entries(groupedByPeriod)) {
    themesByPeriod[period] = extractThemes(periodReviews, textField, limit * 2); // Get more themes for better comparison
  }
  
  // Calculate theme trends
  const themeTrends = [];
  const periods = Object.keys(themesByPeriod).sort();
  
  if (periods.length < 2) return [];
  
  // Compare first and last period to find trends
  const oldestPeriod = periods[0];
  const newestPeriod = periods[periods.length - 1];
  
  const oldThemes = themesByPeriod[oldestPeriod].reduce((map, theme) => {
    map[theme.word] = theme.count;
    return map;
  }, {});
  
  const newThemes = themesByPeriod[newestPeriod];
  
  // Calculate growth and identify trending themes
  newThemes.forEach(theme => {
    const oldCount = oldThemes[theme.word] || 0;
    const growth = oldCount === 0 ? 100 : ((theme.count - oldCount) / oldCount) * 100;
    
    themeTrends.push({
      ...theme,
      growth,
      isNew: oldCount === 0
    });
  });
  
  // Sort by growth and then by count
  return themeTrends
    .sort((a, b) => b.growth - a.growth || b.count - a.count)
    .slice(0, limit);
};

// Helper function to group reviews by time period
const groupReviewsByTimePeriod = (reviews, timeFrame) => {
  if (!reviews || !reviews.length) return {};
  
  return groupBy(reviews, review => {
    const date = new Date(review.date);
    
    switch (timeFrame) {
      case 'day':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      case 'week':
        // Get week number
        const weekNumber = getWeekNumber(date);
        return `${date.getFullYear()}-W${weekNumber}`;
      case 'month':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `${date.getFullYear()}-Q${quarter}`;
      case 'year':
        return `${date.getFullYear()}`;
      default:
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
  });
};

// Helper function to get week number
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Find reviews related to a specific theme
const findReviewsByTheme = (reviews, theme, textField = 'text') => {
  if (!reviews || !reviews.length || !theme) return [];
  
  // Stem the theme word for better matching
  const stemmedTheme = stemmer.stem(theme.toLowerCase());
  
  // Find reviews containing the theme
  return reviews.filter(review => {
    const text = review[textField].toLowerCase();
    const tokens = tokenizer.tokenize(text);
    const stemmed = tokens.map(token => stemmer.stem(token));
    
    return stemmed.includes(stemmedTheme);
  });
};

// Calculate theme importance using TF-IDF
const calculateThemeImportance = (reviews, textField = 'text', limit = 15) => {
  if (!reviews || !reviews.length) return [];
  
  const tfidf = new TfIdf();
  
  // Add each review as a document
  reviews.forEach(review => {
    tfidf.addDocument(review[textField]);
  });
  
  // Get most important terms across all documents
  const termImportance = {};
  
  for (let i = 0; i < tfidf.documents.length; i++) {
    tfidf.listTerms(i).forEach(item => {
      if (item.term.length > 2 && !stopwords.includes(item.term) && !/^\d+$/.test(item.term)) {
        termImportance[item.term] = (termImportance[item.term] || 0) + item.tfidf;
      }
    });
  }
  
  // Convert to array and sort
  return Object.entries(termImportance)
    .map(([word, score]) => ({ word, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export {
  extractThemes,
  themeRelevanceByRating,
  trendingThemes,
  findReviewsByTheme,
  calculateThemeImportance
}; 