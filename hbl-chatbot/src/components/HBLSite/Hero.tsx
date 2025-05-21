import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 40px;
  background: linear-gradient(120deg, #f8f9fa 50%, #e9ecef 100%);
`;

const Content = styled.div`
  max-width: 600px;
`;

const Title = styled.h2`
  font-size: 48px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px;
  line-height: 1.2;
  
  span {
    color: #0B792F;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #555;
  margin: 0 0 30px;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  padding: 14px 24px;
  background-color: #0B792F;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #096e2a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(11, 121, 47, 0.2);
  }
`;

const ImageArea = styled.div`
  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

const Hero: React.FC = () => {
  return (
    <HeroContainer id="home">
      <Content>
        <Title>
          Empowering <span>Financial Growth</span> for All
        </Title>
        <Subtitle>
          HBL MicroFinance Bank offers inclusive financial solutions 
          designed to help individuals and businesses thrive. From microloans 
          to savings accounts, we're here to support your financial journey.
        </Subtitle>
        <CTAButton>Apply Now</CTAButton>
      </Content>
      
      <ImageArea>
        <img 
          src="https://placehold.co/600x400/e9ecef/0B792F?text=HBL+Banking+Services&font=montserrat" 
          alt="HBL Banking Services" 
        />
      </ImageArea>
    </HeroContainer>
  );
};

export default Hero;