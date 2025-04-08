import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/dateUtils';
import { analyzeSentiment } from '../utils/textProcessing';

const DetailContainer = styled.div`
  padding: 2rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #6c757d;
  text-decoration: none;
  margin-bottom: 1.5rem;
  
  &:hover {
    color: #007bff;
    text-decoration: underline;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 800px;
`;

const ReviewTitle = styled.h1`
  margin-bottom: 0.5rem;
  color: #343a40;
`;

const ReviewMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.span`
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
`;

const MetaValue = styled.span`
  font-weight: 500;
  color: #212529;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled.span`
  color: ${props => props.filled ? '#ffc107' : '#e9ecef'};
  font-size: 1.2rem;
`;

const ReviewContent = styled.div`
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #212529;
`;

const VerifiedBadge = styled.span`
  background-color: #17a2b8;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  margin-left: 0.5rem;
`;

const AnalysisSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
`;

const SectionTitle = styled.h2`
  color: #343a40;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const SentimentResult = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => {
    if (props.score > 1) return '#d4edda';
    if (props.score < -1) return '#f8d7da';
    return '#e9ecef';
  }};
  color: ${props => {
    if (props.score > 1) return '#155724';
    if (props.score < -1) return '#721c24';
    return '#343a40';
  }};
  margin-bottom: 1rem;
`;

const NotFound = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
  margin-top: 2rem;
`;

const ReviewDetail = () => {
  const { id } = useParams();
  const { reviews, isLoading } = useAppContext();
  const [review, setReview] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  
  useEffect(() => {
    if (!isLoading && reviews.length > 0) {
      const foundReview = reviews.find(r => r.id === Number(id));
      
      if (foundReview) {
        setReview(foundReview);
        
        // Analyze sentiment
        const sentimentResult = analyzeSentiment(foundReview.text);
        setSentiment(sentimentResult);
      }
    }
  }, [id, reviews, isLoading]);
  
  if (isLoading) {
    return <div>Loading review data...</div>;
  }
  
  if (!review) {
    return (
      <DetailContainer>
        <BackLink to="/reviews">← Back to all reviews</BackLink>
        <NotFound>
          <h2>Review Not Found</h2>
          <p>The review you're looking for doesn't exist or has been removed.</p>
        </NotFound>
      </DetailContainer>
    );
  }
  
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star key={index} filled={index < rating}>
        ★
      </Star>
    ));
  };
  
  const getSentimentLabel = (score) => {
    if (score > 2) return 'Very Positive';
    if (score > 0) return 'Positive';
    if (score < -2) return 'Very Negative';
    if (score < 0) return 'Negative';
    return 'Neutral';
  };
  
  return (
    <DetailContainer>
      <BackLink to="/reviews">← Back to all reviews</BackLink>
      
      <Card>
        <ReviewTitle>{review.title}</ReviewTitle>
        
        <ReviewMeta>
          <MetaItem>
            <MetaLabel>Date</MetaLabel>
            <MetaValue>{formatDate(review.date, 'MMM dd, yyyy')}</MetaValue>
          </MetaItem>
          
          <MetaItem>
            <MetaLabel>Product</MetaLabel>
            <MetaValue>{review.product}</MetaValue>
          </MetaItem>
          
          <MetaItem>
            <MetaLabel>Author</MetaLabel>
            <MetaValue>
              {review.author}
              {review.verified && <VerifiedBadge>Verified</VerifiedBadge>}
            </MetaValue>
          </MetaItem>
          
          <MetaItem>
            <MetaLabel>Rating</MetaLabel>
            <MetaValue>
              <Rating>
                {renderStars(review.rating)}
              </Rating>
            </MetaValue>
          </MetaItem>
        </ReviewMeta>
        
        <ReviewContent>
          <p>{review.text}</p>
        </ReviewContent>
        
        {sentiment && (
          <AnalysisSection>
            <SectionTitle>Sentiment Analysis</SectionTitle>
            <SentimentResult score={sentiment.score}>
              <h3>{getSentimentLabel(sentiment.score)}</h3>
              <p>Sentiment Score: {sentiment.score}</p>
              <p>
                {sentiment.score > 0 
                  ? 'This review expresses positive sentiment.' 
                  : sentiment.score < 0 
                    ? 'This review expresses negative sentiment.'
                    : 'This review is neutral in sentiment.'}
              </p>
            </SentimentResult>
          </AnalysisSection>
        )}
      </Card>
    </DetailContainer>
  );
};

export default ReviewDetail; 