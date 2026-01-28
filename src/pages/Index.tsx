import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { TokenSection } from '@/components/TokenSection';
import { Ecosystem } from '@/components/Ecosystem';
import { Footer } from '@/components/Footer';
import { MusicPlayer } from '@/components/MusicPlayer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <TokenSection />
        <Ecosystem />
      </main>
      <Footer />
      <MusicPlayer />
    </div>
  );
};

export default Index;
