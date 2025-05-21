import React from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import hblLogo from '../../assets/hbl-logo.png';

const FooterContainer = styled.footer`
  background-color: #222;
  color: #fff;
  padding: 60px 40px 30px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterColumn = styled.div`
  h3 {
    font-size: 18px;
    margin: 0 0 20px;
    position: relative;
    padding-bottom: 10px;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: #0B792F;
    }
  }
`;

const AboutSection = styled(FooterColumn)`
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    
    img {
      height: 40px;
    }
    
    h2 {
      margin: 0;
      font-size: 18px;
      color: white;
    }
  }
  
  p {
    margin: 0 0 20px;
    line-height: 1.7;
    color: #ccc;
  }
`;

const LinksSection = styled(FooterColumn)`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 12px;
    
    a {
      text-decoration: none;
      color: #ccc;
      transition: color 0.2s;
      display: inline-flex;
      align-items: center;
      
      &:before {
        content: '›';
        margin-right: 8px;
        color: #0B792F;
      }
      
      &:hover {
        color: white;
      }
    }
  }
`;

const ContactSection = styled(FooterColumn)`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 15px;
    color: #ccc;
    
    svg {
      color: #0B792F;
      margin-top: 4px;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  
  a {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
      background-color: #0B792F;
      transform: translateY(-3px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 30px;
  margin-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #999;
  font-size: 14px;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <AboutSection>
          <div className="logo">
            <img src={hblLogo} alt="HBL MicroFinance Bank" />
            <h2>HBL MicroFinance Bank</h2>
          </div>
          <p>
            HBL MicroFinance Bank is committed to providing accessible 
            financial services that empower individuals and businesses 
            to achieve their goals and improve their financial well-being.
          </p>
          <SocialLinks>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaYoutube /></a>
          </SocialLinks>
        </AboutSection>
        
        <LinksSection>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#branches">Branch Network</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#faq">FAQs</a></li>
          </ul>
        </LinksSection>
        
        <LinksSection>
          <h3>Services</h3>
          <ul>
            <li><a href="#loans">Microloans</a></li>
            <li><a href="#deposits">Savings Accounts</a></li>
            <li><a href="#digital">Digital Banking</a></li>
            <li><a href="#business">Business Services</a></li>
            <li><a href="#insurance">Microinsurance</a></li>
            <li><a href="#remittance">Remittance Services</a></li>
          </ul>
        </LinksSection>
        
        <ContactSection>
          <h3>Contact Us</h3>
          <ul>
            <li>
              <FaMapMarkerAlt />
              <div>16th & 17th Floor, HBL Tower, Blue Area, Islamabad, Pakistan</div>
            </li>
            <li>
              <FaPhoneAlt />
              <div>+92-51-111-222-333</div>
            </li>
            <li>
              <FaEnvelope />
              <div>info@hblmfb.com</div>
            </li>
          </ul>
        </ContactSection>
      </FooterContent>
      
      <Copyright>
        &copy; {new Date().getFullYear()} HBL MicroFinance Bank. All Rights Reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;