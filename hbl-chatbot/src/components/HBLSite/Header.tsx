import React from 'react';
import styled from 'styled-components';
import hblLogo from '../../assets/hbl-logo.png';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  img {
    height: 40px;
  }
  
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #0B792F;
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    gap: 25px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  li {
    font-size: 16px;
    font-weight: 500;
  }
  
  a {
    color: #333;
    text-decoration: none;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #0B792F;
      transition: width 0.3s;
    }
    
    &:hover:after {
      width: 100%;
    }
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo>
        <img src={hblLogo} alt="HBL MicroFinance Bank" />
        <h1>HBL MicroFinance Bank</h1>
      </Logo>
      
      <Nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#loans">Loans</a></li>
          <li><a href="#deposits">Deposits</a></li>
          <li><a href="#digital">Digital Banking</a></li>
          <li><a href="#business">Business</a></li>
          <li><a href="#about">About Us</a></li>
        </ul>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;