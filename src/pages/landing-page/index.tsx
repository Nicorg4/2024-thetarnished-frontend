import { useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import { Header, Features, Content, GlobalStyle, HowItWorks, Testimonials, Pricing, FAQ, Footer } from './components';

const App = () => {
  const {checkSession} = useAuth();

  useEffect(() => {
    checkSession();
  }, [checkSession])
  
  return (
    <>
      <GlobalStyle />
      <Content>
        <Header />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Footer />
      </Content>
    </>
  );
};

export default App;
