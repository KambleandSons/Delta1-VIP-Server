import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FiveTop from './components/FiveTop';
import Support from './components/Support';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Checkpoint from './components/Checkpoint';
import Teach from './components/Teach';
import Review from './components/Review';
import Cert from './components/Cert';
import Persona from './components/Persona';
import Library from './components/Library';
import HelpAndFooter from './components/HelpAndFooter';
import AriaPlayer from './components/AriaPlayer';
import PdfViewer from './components/PdfViewer';
import AskDrawer from './components/AskDrawer';

function MainHallway() {
  const { openPlayer } = useApp();

  useEffect(() => {
    // Wire all elements with .wt-start to start Aria walkthrough
    const triggers = document.querySelectorAll('.wt-start');
    const handler = () => openPlayer();
    triggers.forEach(t => t.addEventListener('click', handler));
    return () => {
      triggers.forEach(t => t.removeEventListener('click', handler));
    };
  }, [openPlayer]);

  return (
    <>
      <Navbar />
      <Hero />
      <FiveTop />
      <Support />
      <Step1 />
      <Step2 />
      <Step3 />
      <Checkpoint />
      <Teach />
      <Review />
      <Cert />
      <Persona />
      <Library />
      <HelpAndFooter />

      {/* Floating and Overlay Components */}
      <AriaPlayer />
      <PdfViewer />
      <AskDrawer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainHallway />
    </AppProvider>
  );
}
