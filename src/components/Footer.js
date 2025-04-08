import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 1rem 2rem;
  text-align: center;
  border-top: 1px solid #e9ecef;
  margin-top: auto;
`;

const Copyright = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <Copyright>
        &copy; {currentYear} SFCC Voice of Customer Analysis. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 