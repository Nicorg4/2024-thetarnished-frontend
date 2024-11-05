import styled, { keyframes } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import colors from '../../assets/colors';
import { FaArrowRightLong } from "react-icons/fa6";
import { BsTwitterX, BsFacebook, BsInstagram } from "react-icons/bs";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRegCircleCheck } from "react-icons/fa6";

export const Content = styled.div`
  height: 100vh;

  @media (max-width: 700px) {
    height: 100%;
  }
`;

const HeaderSection = styled.header`
  padding: 40px;
  text-align: center;
  color: white;
  z-index: 0;
  background: rgba(0, 0, 0, 0.7);
  height: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  transition: transform 0.3s ease;
  color: ${colors.secondary};
  text-align: center;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin: 20px auto;
  color: ${colors.secondary};
`;

const GetStartedButton = styled.button`
  background: ${colors.primary};
  color: ${colors.secondary};
  padding: 12px 24px;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  z-index: 10;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-3px);
  }
`;

const FeaturesSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 67%;
  padding: 20px 50px;
  justify-content: center;
`;

const FeaturesTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: ${colors.secondary};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`

const FeatureCard = styled.div`
  background: ${colors.secondary};
  padding: 20px;
  color: ${colors.primary};
  border-radius: 8px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column ;
  justify-content: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
`;

const StepsSection = styled.section`
  text-align: center;
  z-index: 10;
  background-color: ${colors.secondary};
  padding: 100px;
  padding-bottom: 150px;
`;

const StepsTitle = styled.h2`
  font-size: 2.5rem;
  color: ${colors.primary};
  transition: transform 0.3s ease;
  margin-bottom: 50px;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StepsList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 80px;
`;

const StepCard = styled(motion.div)`
  background: ${colors.primary};
  padding: 20px;
  border-radius: 8px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: ${colors.secondary};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const StepTitle = styled.h4`
  font-size: 1.5rem;
`;

const StepDescription = styled.p`
  font-size: 1rem;
`;

const Arrow = styled(motion.div)`
  font-size: 2rem;
  color: ${colors.primary};
  transition: transform 0.3s ease;
  @media (max-width: 1100px) {
    display: none;
  }
`;

const TestimonialsSection = styled.section`
  padding: 50px 20px;
  text-align: center;
  background-color: ${colors.secondary};
  border-bottom: 1px solid ${colors.primary};
  border-top: 1px solid ${colors.primary};
  padding-bottom: 50px;
`;

const TestimonialsTitle = styled.h2`
    color: ${colors.primary};
`

const TestimonialCard = styled(motion.div)`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding: 20px;
  max-width: 500px;
  margin: 20px auto;
`;

const TestimonialText = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: ${colors.primary};
`;

const TestimonialAuthor = styled.p`
  font-size: 1rem;
  font-weight: bold;
`;

interface AlternativeProps {
    alternative?: boolean
}

const PricingSection = styled.section`
  background-color: ${colors.secondary};
  color: white;
  padding: 50px 20px;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 1000px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;


const PricingCard = styled(motion.div)`
  position: relative ;
  background: ${colors.primary};
  border-radius: 8px;
  padding: 30px;
  width: 250px;
  margin: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: ${colors.secondary};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 400px;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;


const AlternativePricingCard = styled(PricingCard)`
  background: ${colors.secondary};
  border: 1px solid ${colors.primary};
`;


const PricingTitle = styled.h3<AlternativeProps>`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: ${(props) => (props.alternative ? colors.primary : colors.secondary)};
`;

const PricingPrice = styled.p<AlternativeProps>`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${(props) => (props.alternative ? colors.primary : colors.secondary)};
`;


const PricingDescription = styled.p<AlternativeProps>`
  font-size: 1rem;
  color: ${(props) => (props.alternative ? colors.primary : colors.secondary)};
  margin-bottom: 20px;
  line-height: 1.5;
`;


const PricingFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  text-align: left;
  font-size: 1rem;
  color: ${colors.secondary};
`;

const AlternativeFeatures = styled.ul`
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
    text-align: left;
    font-size: 1rem;
    color: ${colors.primary};
`;

const Feature = styled.li`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px ;
  &:before {
    margin-right: 8px;
  }
`;


const ActionButton = styled.div<AlternativeProps>`
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: 60%;
  transform: translateX(-50%);
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.alternative ? colors.primary : colors.secondary)};
  color: ${(props) => (props.alternative ? colors.secondary : colors.primary)};
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const FAQSection = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FAQTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 15px;
  color: ${colors.primary};
`;

const FAQItem = styled.div`
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  max-width: 500px;
`;

const FAQQuestion = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  color: ${colors.secondary};
`;

interface ArrowIconProps {
  open: boolean;
}
const ArrowIcon = styled.div<ArrowIconProps>`
  margin-left: 10px;
  transition: transform 0.3s ease-in-out;
  ${({ open }) => open && `transform: rotate(180deg);`}
`;

const FAQAnswer = styled.div<ArrowIconProps>`

  max-height: ${({ open }) => (open ? "1000px" : "0px")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  font-size: 16px;
  color: ${colors.primary};
`;

const FooterSection = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  padding-bottom: 20px;
  background-color: black;
  color: white;
  font-size: 14px;
  text-align: center;
  width: 100%;
`;

const SocialLinksContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const SocialLink = styled.a`
  color: white;
  font-size: 24px;
  transition: color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    color: #4CAF50;
    transform: scale(1.1);
  }
`;

const CopyrightText = styled.p`
  margin-top: 10px;
  font-size: 12px;
`;

export const AnimatedStars = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  
`;

const twinkling = keyframes`
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const floating = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px);
  }
  100% {
    transform: translateY(0);
  }
  
`;

interface StarProps extends React.SVGProps<SVGCircleElement> {
    delay?: string;
  }

export const Star = styled.circle<StarProps>`
  fill: white;
  opacity: 0.7;
  animation: ${twinkling} 5s infinite ease-in-out alternate, ${floating} 10s infinite ease-in-out;
  animation-delay: ${props => props.delay};
`;

export const Header = () => {
    const navigate = useNavigate();

    const getStarted = () => {
        navigate('/register');
    };
    return (
        <HeaderSection>
          <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Title>Welcome to Link & Learn</Title>
            </motion.div>
            <Subtitle>Seamlessly connect students and teachers. Schedule, manage, and pay for classes, all in one place!</Subtitle>
            <GetStartedButton onClick={getStarted}>Get Started</GetStartedButton>
            <AnimatedStars xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
                <Star cx="100" cy="100" r="2" delay="2s"/>
                <Star cx="200" cy="200" r="2" delay="0s"/>
                <Star cx="300" cy="300" r="2" delay="1s"/>
                <Star cx="500" cy="100" r="2" delay="0s"/>
                <Star cx="600" cy="500" r="2" delay="0s"/>
                <Star cx="700" cy="300" r="2" delay="1s"/>
                <Star cx="100" cy="500" r="2" delay="2s"/>
                <Star cx="300" cy="600" r="2" delay="1s"/>
                <Star cx="650" cy="50" r="2" delay="1s"/>
            </AnimatedStars>
        </HeaderSection>
    );
};

export const Features: React.FC = () => {
  const featureItems = [
    {
      title: "Effortless Class Scheduling",
      description: "Teachers and students can easily coordinate their availability and schedule classes in real-time.",
      delay: 0.5,
    },
    {
      title: "Class Reservation & Payment",
      description: "Reserve classes with just a few clicks and pay upfront to secure your spot in the class.",
      delay: 0.6,
    },
    {
      title: "Real-Time Notifications",
      description: "Receive instant updates about your classes, including confirmation, reminders, and cancellations.",
      delay: 0.7,
    },
  ];

  return (
    <FeaturesSection>
      <FeaturesTitle>Key Features</FeaturesTitle>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {featureItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: item.delay }}
          >
            <FeatureCard>
              <FeatureTitle>{item.title}</FeatureTitle>
              <FeatureDescription>{item.description}</FeatureDescription>
            </FeatureCard>
          </motion.div>
        ))}
      </motion.div>
    </FeaturesSection>
  );
};

export const HowItWorks = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stepAnimation = {
    hidden: { opacity: 0, x: 50 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: index * 0.2 },
    }),
  };

  const steps = [
    {
      title: "Step 1: Set Your Availability",
      description: "Teachers can set their availability in real-time, allowing students to choose the best times.",
    },
    {
      title: "Step 2: Reserve Classes",
      description: "Students select their preferred class times and teachers confirm or cancel if needed.",
    },
    {
      title: "Step 3: Learn First, Pay Later",
      description: "Once the class is completed, instructors will prompt students to make the payment.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const currentRef = sectionRef.current;
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <StepsSection ref={sectionRef}>
      <StepsTitle>How It Works</StepsTitle>
      <StepsList>
        {steps.map((step, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '80px' }}>
            <StepCard
              variants={stepAnimation}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={index}
            >
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
            {index < steps.length - 1 && (
              <Arrow
                variants={stepAnimation}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={index}
              >
                <FaArrowRightLong />
              </Arrow>
            )}
          </div>
        ))}
      </StepsList>
    </StepsSection>
  );
};

export const Testimonials = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const testimonialAnimation = {
    hidden: { opacity: 0, y: 100 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.2 },
    }),
  };

  const testimonials = [
    {
      text: "Link & Learn made scheduling and paying for my classes so easy. It's a game-changer!",
      author: "- Jane Doe, Student",
    },
    {
      text: "As a teacher, I love how simple it is to manage my availability and connect with students.",
      author: "- John Smith, Teacher",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const currentRef = sectionRef.current;
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <TestimonialsSection ref={sectionRef}>
      <TestimonialsTitle>What Our Users Say</TestimonialsTitle>
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={index}
          variants={testimonialAnimation}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={index}
        >
          <TestimonialText>{testimonial.text}</TestimonialText>
          <TestimonialAuthor>{testimonial.author}</TestimonialAuthor>
        </TestimonialCard>
      ))}
    </TestimonialsSection>
  );
};

export const Pricing = () => {
  const navigate = useNavigate();
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const flipAnimation = {
    hidden: { opacity: 0, rotateY: -180 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const currentRef = sectionRef.current;
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div style={{backgroundColor: '#fff', paddingTop: '80px', paddingBottom: '80px', display: 'flex', flexDirection:'column' ,justifyContent: 'center', alignItems: 'center'}}>
    <PricingTitle alternative>Our special plans for students:</PricingTitle>
    <PricingSection ref={sectionRef}>
      <PricingCard
        variants={flipAnimation}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <PricingTitle>Basic Plan</PricingTitle>
        <PricingPrice>Free</PricingPrice>
        <PricingDescription>
          Perfect for newcomers. Start exploring with limited features.
        </PricingDescription>
        <PricingFeatures>
          <Feature><FaRegCircleCheck />Access to basic features</Feature>
          <Feature><FaRegCircleCheck />Limited usage per month</Feature>
          <Feature><FaRegCircleCheck />Email support</Feature>
        </PricingFeatures>
        <ActionButton onClick={() => navigate("/register")}>Start for Free</ActionButton>
      </PricingCard>

      <AlternativePricingCard
        variants={flipAnimation}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <PricingTitle alternative>Standard Plan</PricingTitle>
        <PricingPrice alternative>$9.99/month</PricingPrice>
        <PricingDescription alternative>
          Get more flexibility with additional features and better support.
        </PricingDescription>
        <AlternativeFeatures>
          <Feature><FaRegCircleCheck />All Basic Plan features</Feature>
          <Feature><FaRegCircleCheck />Up to 50 classes per month</Feature>
          <Feature><FaRegCircleCheck />Priority email support</Feature>
        </AlternativeFeatures>
        <ActionButton alternative>Select Plan</ActionButton>
      </AlternativePricingCard>

      <PricingCard
        variants={flipAnimation}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <PricingTitle>Premium Plan</PricingTitle>
        <PricingPrice>$19.99/month</PricingPrice>
        <PricingDescription>
          Everything you need for an advanced experience, with full support.
        </PricingDescription>
        <PricingFeatures>
          <Feature><FaRegCircleCheck />All Standard Plan features</Feature>
          <Feature><FaRegCircleCheck />24/7 support</Feature>
          <Feature><FaRegCircleCheck />Unlimited classes</Feature>
        </PricingFeatures>
        <ActionButton>Select Plan</ActionButton>
      </PricingCard>
    </PricingSection>
    </div>
  );
};
  

export const FAQ = () => {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [open7, setOpen7] = useState(false);
  
    return (
      <FAQSection>
        <FAQTitle>Frequently Asked Questions</FAQTitle>
        <FAQItem>
          <FAQQuestion onClick={() => setOpen1(!open1)}>
            How do I sign up?
            <ArrowIcon open={open1}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open1}>
            Simply click the 'Get Started' button at the top to create an account and begin.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen2(!open2)}>
            How do I reset my password?
            <ArrowIcon open={open2}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open2}>
            Go to the settings page and click "Reset Password" to begin the process.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen3(!open3)}>
            How can I change my email address?
            <ArrowIcon open={open3}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open3}>
            Is not possible to change your email address as this is the only way to verify your identity.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen4(!open4)}>
            Is there a mobile app available?
            <ArrowIcon open={open4}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open4}>
            No, but our app is fully compatible with mobile devices and can be accessed through any web browser.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen5(!open5)}>
            Can I upgrade my plan later?
            <ArrowIcon open={open5}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open5}>
            Absolutely! You can upgrade your plan at any time through the "Account Settings" page.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen6(!open6)}>
            How do I contact support?
            <ArrowIcon open={open6}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open6}>
            You can reach out to our support team by emailing linkandlearnonline@gmail.com.
          </FAQAnswer>
        </FAQItem>
  
        <FAQItem>
          <FAQQuestion onClick={() => setOpen7(!open7)}>
            Are there any discounts for students?
            <ArrowIcon open={open7}>▼</ArrowIcon>
          </FAQQuestion>
          <FAQAnswer open={open7}>
            Yes! We offer a 20% discount for students. Simply use the code STUDENT20 at checkout.
          </FAQAnswer>
        </FAQItem>
      </FAQSection>
    );
  };

export const Footer = () => (
    <FooterSection>
      <SocialLinksContainer>
        <SocialLink href="#" target="_blank" aria-label="Facebook">
          <BsFacebook />
        </SocialLink>
        <SocialLink href="#" target="_blank" aria-label="Twitter">
          <BsTwitterX />
        </SocialLink>
        <SocialLink href="#" target="_blank" aria-label="Instagram">
          <BsInstagram />
        </SocialLink>
      </SocialLinksContainer>
      <CopyrightText>&copy; 2024 Link & Learn. All rights reserved.</CopyrightText>
    </FooterSection>
  );


  export const GlobalStyle = createGlobalStyle`
    body {
      font-family: 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
      width: 100%;
      background: rgb(89,185,99);
      background: linear-gradient(143deg, rgba(89,185,99,1) 0%, rgba(38,78,42,1) 35%, rgba(15,41,46,1) 84%);
    }
  
    h1, h2, h3, h4 {
      margin: 0;
      padding: 0;
    }
  
    p {
      margin: 10px 0;
    }
  `;