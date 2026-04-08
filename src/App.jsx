import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OpeningFrame from './vignettes/opening-frame'
import MoviePreview from './vignettes/movie-preview'
import SocialReveal from './vignettes/social-reveal'
import Marcus from './vignettes/vignette-1-marcus'
import Conversational from './vignettes/vignette-2-conversational'
import CFO from './vignettes/vignette-3-cfo-rebuilt'
import CoachingLayer from './vignettes/vignette-4-coaching-layer'
import CHRO from './vignettes/vignette-5-chro-rebuilt'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/opening"  element={<OpeningFrame />} />
        <Route path="/preview"  element={<MoviePreview />} />
        <Route path="/social"   element={<SocialReveal />} />
        <Route path="/marcus"   element={<Marcus />} />
        <Route path="/pipeline" element={<Conversational />} />
        <Route path="/cfo"      element={<CFO />} />
        <Route path="/coaching" element={<CoachingLayer />} />
        <Route path="/chro"     element={<CHRO />} />
        <Route path="/"         element={<MoviePreview />} />
      </Routes>
    </BrowserRouter>
  )
}
