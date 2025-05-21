import React from 'react';
import styled from 'styled-components';
import { FaMoneyBillWave, FaPiggyBank, FaMobileAlt, FaStore } from 'react-icons/fa';

const ProductsSection = styled.section`
  padding: 80px 40px;
  background-color: white;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 50px;
  color: #333;
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background-color: #0B792F;
    margin: 20px auto 0;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  background-color: rgba(11, 121, 47, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  svg {
    font-size: 32px;
    color: #0B792F;
  }
`;

const ProductTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 15px;
  color: #333;
`;

const ProductDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin: 0 0 20px;
`;

const LearnMore = styled.a`
  color: #0B792F;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:after {
    content: '→';
    margin-left: 5px;
    transition: transform 0.2s;
  }
  
  &:hover:after {
    transform: translateX(4px);
  }
`;

const Products: React.FC = () => {
  return (
    <ProductsSection>
      <SectionTitle>Our Financial Products</SectionTitle>
      
      <ProductsGrid>
        <ProductCard id="loans">
          <IconWrapper>
            <FaMoneyBillWave />
          </IconWrapper>
          <ProductTitle>Microloans</ProductTitle>
          <ProductDescription>
            Accessible loans designed for small businesses and entrepreneurs looking 
            to start or expand their ventures, with flexible repayment options.
          </ProductDescription>
          <LearnMore href="#loans">Learn More</LearnMore>
        </ProductCard>
        
        <ProductCard id="deposits">
          <IconWrapper>
            <FaPiggyBank />
          </IconWrapper>
          <ProductTitle>Savings Accounts</ProductTitle>
          <ProductDescription>
            Secure and convenient savings solutions with competitive 
            interest rates to help you build a better financial future.
          </ProductDescription>
          <LearnMore href="#deposits">Learn More</LearnMore>
        </ProductCard>
        
        <ProductCard id="digital">
          <IconWrapper>
            <FaMobileAlt />
          </IconWrapper>
          <ProductTitle>Digital Banking</ProductTitle>
          <ProductDescription>
            Access your accounts, make transfers, and manage your finances 
            from anywhere using our secure mobile and internet banking platforms.
          </ProductDescription>
          <LearnMore href="#digital">Learn More</LearnMore>
        </ProductCard>
        
        <ProductCard id="business">
          <IconWrapper>
            <FaStore />
          </IconWrapper>
          <ProductTitle>Business Solutions</ProductTitle>
          <ProductDescription>
            Comprehensive financial services for businesses of all sizes, 
            including working capital loans, equipment financing, and more.
          </ProductDescription>
          <LearnMore href="#business">Learn More</LearnMore>
        </ProductCard>
      </ProductsGrid>
    </ProductsSection>
  );
};

export default Products;