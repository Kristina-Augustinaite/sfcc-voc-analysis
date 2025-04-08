import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>SFCC VOC Analysis</Logo>
      <Nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/reviews">Reviews</NavLink>
        <NavLink to="/themes">Theme Analysis</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 