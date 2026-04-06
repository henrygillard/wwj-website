import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Gallery from './components/Gallery'
import VideoSection from './components/VideoSection'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Lightbox from './components/Lightbox'
import { TapeStrip } from './components/TapeStrip'

export default function App() {
  const [lightboxSrc, setLightboxSrc] = useState(null)

  return (
    <>
      <Nav />
      <Hero />
      <TapeStrip />
      <About onOpenPhoto={setLightboxSrc} />
      <TapeStrip />
      <Gallery onOpenPhoto={setLightboxSrc} />
      <TapeStrip />
      <VideoSection />
      <TapeStrip />
      <Contact />
      <Footer />
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  )
}
