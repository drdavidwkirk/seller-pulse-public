import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OpeningFrame from './vignettes/OpeningFrame'
import MoviePreview from './vignettes/MoviePreview'
import SocialReveal from './vignettes/SocialReveal'
import Marcus from './vignettes/Marcus'
import Conversational from './vignettes/Conversational'
import CFO from './vignettes/CFO'
import CoachingLayer from './vignettes/CoachingLayer'
import CHRO from './vignettes/CHRO'

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
