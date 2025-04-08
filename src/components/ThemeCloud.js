import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { extractThemes } from '../utils/textProcessing';

const CloudContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #212529;
  font-size: 1.25rem;
`;

const CloudContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  min-height: 200px;
`;

const ThemeTag = styled.div`
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 20px;
  background-color: ${props => `hsla(${props.hue}, 80%, 65%, 0.9)`};
  color: white;
  font-size: ${props => `${Math.max(1, Math.min(props.size, 2.5))}rem`};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
`;

const ThemeCloud = ({ reviews, onThemeClick }) => {
  const [themes, setThemes] = useState([]);
  
  useEffect(() => {
    if (!reviews || reviews.length === 0) {
      setThemes([]);
      return;
    }
    
    // Extract review content
    const reviewTexts = reviews.map(review => review.text);
    
    // Get themes
    const extractedThemes = extractThemes(reviewTexts, 25);
    setThemes(extractedThemes);
  }, [reviews]);
  
  if (!reviews || reviews.length === 0) {
    return (
      <CloudContainer>
        <Title>Common Themes</Title>
        <NoData>No data available for theme analysis.</NoData>
      </CloudContainer>
    );
  }
  
  if (themes.length === 0) {
    return (
      <CloudContainer>
        <Title>Common Themes</Title>
        <NoData>Analyzing themes...</NoData>
      </CloudContainer>
    );
  }
  
  // Get max count for scaling
  const maxCount = Math.max(...themes.map(theme => theme.count));
  
  return (
    <CloudContainer>
      <Title>Common Themes</Title>
      <CloudContent>
        {themes.map((theme, index) => {
          // Scale size based on frequency
          const size = 1 + (theme.count / maxCount) * 1.5;
          
          // Generate a hue based on the index for variety
          const hue = (index * 30) % 360;
          
          return (
            <ThemeTag 
              key={theme.word}
              size={size}
              hue={hue}
              title={`${theme.word}: ${theme.count} occurrences`}
              onClick={() => onThemeClick && onThemeClick(theme)}
            >
              {theme.word}
            </ThemeTag>
          );
        })}
      </CloudContent>
    </CloudContainer>
  );
};

export default ThemeCloud; 