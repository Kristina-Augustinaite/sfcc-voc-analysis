import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import { analyzeSentiment } from '../utils/textProcessing';

const TableContainer = styled.div`
  overflow-x: auto;
  margin: 1rem 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #495057;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e9ecef;
    
    &:hover {
      background-color: #f8f9fa;
    }
  }

  td {
    padding: 1rem;
    color: #212529;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled.span`
  color: ${props => props.filled ? '#ffc107' : '#e9ecef'};
  font-size: 1.2rem;
`;

const SentimentBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    if (props.score > 1) return '#d4edda';
    if (props.score < -1) return '#f8d7da';
    return '#e9ecef';
  }};
  color: ${props => {
    if (props.score > 1) return '#28a745';
    if (props.score < -1) return '#dc3545';
    return '#6c757d';
  }};
`;

const Truncate = styled.div`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VerifiedBadge = styled.span`
  background-color: #17a2b8;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  margin-left: 0.5rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#212529'};
  border: 1px solid #dee2e6;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#0069d9' : '#e9ecef'};
  }
`;

const ReviewLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ReviewsTable = ({ reviews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 8;
  
  if (!reviews || reviews.length === 0) {
    return <p>No reviews found.</p>;
  }
  
  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star key={index} filled={index < rating}>
        ★
      </Star>
    ));
  };
  
  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PageButton 
          key={i} 
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </PageButton>
      );
    }
    
    return pages;
  };
  
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Sentiment</th>
              <th>Author</th>
              <th>Action</th>
            </tr>
          </TableHead>
          <TableBody>
            {currentReviews.map(review => {
              const sentiment = analyzeSentiment(review.text);
              
              return (
                <tr key={review.id}>
                  <td>{formatDate(review.date, 'MMM dd, yyyy')}</td>
                  <td>
                    <Truncate>{review.title}</Truncate>
                  </td>
                  <td>{review.product}</td>
                  <td>
                    <Rating>
                      {renderStars(review.rating)}
                    </Rating>
                  </td>
                  <td>
                    <SentimentBadge score={sentiment.score}>
                      {sentiment.score > 1 ? 'Positive' : sentiment.score < -1 ? 'Negative' : 'Neutral'}
                    </SentimentBadge>
                  </td>
                  <td>
                    {review.author}
                    {review.verified && <VerifiedBadge>Verified</VerifiedBadge>}
                  </td>
                  <td>
                    <ReviewLink to={`/reviews/${review.id}`}>View</ReviewLink>
                  </td>
                </tr>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalPages > 1 && (
        <Pagination>
          {renderPagination()}
        </Pagination>
      )}
    </>
  );
};

export default ReviewsTable; 