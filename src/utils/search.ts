// This file contains search utility functions

// Simple relevance scoring function for text search
export function calculateRelevance(text: string, query: string): number {
  const queryTerms = query.split(' ').filter(term => term.length > 2);
  let score = 0;
  
  // Base score: does text contain the query
  if (text.includes(query)) {
    score += 10;
  }
  
  // Add scores for individual terms
  queryTerms.forEach(term => {
    if (text.includes(term)) {
      score += 2;
      
      // Bonus for exact word matches
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(text)) {
        score += 3;
      }
    }
  });
  
  return score;
}

