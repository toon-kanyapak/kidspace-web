import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import Home from './pages/Home'

/* Content screens */
const Play = lazy(() => import('./pages/Play'))
const Activities = lazy(() => import('./pages/Activities'))
const ActivityDetail = lazy(() => import('./pages/ActivityDetail'))
const Articles = lazy(() => import('./pages/Articles'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Stories = lazy(() => import('./pages/Stories'))
const StoryReader = lazy(() => import('./pages/StoryReader'))
const Reading = lazy(() => import('./pages/Reading'))
const ReadingLesson = lazy(() => import('./pages/ReadingLesson'))

/* English */
const Speak = lazy(() => import('./pages/Speak'))
const SpeakLesson = lazy(() => import('./pages/SpeakLesson'))
const Words = lazy(() => import('./pages/Words'))
const WordSet = lazy(() => import('./pages/WordSet'))
const Talk = lazy(() => import('./pages/Talk'))
const TalkScene = lazy(() => import('./pages/TalkScene'))

/* Hubs & tools */
const Games = lazy(() => import('./pages/Games'))
const Brain = lazy(() => import('./pages/Brain'))
const Versus = lazy(() => import('./pages/Versus'))
const Coding = lazy(() => import('./pages/Coding'))
const Draw = lazy(() => import('./pages/Draw'))
const Classroom = lazy(() => import('./pages/Classroom'))
const ClassroomNumbers = lazy(() => import('./pages/ClassroomNumbers'))
const ClassroomMelodica = lazy(() => import('./pages/ClassroomMelodica'))
const ClassroomFlashcards = lazy(() => import('./pages/ClassroomFlashcards'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Settings = lazy(() => import('./pages/Settings'))
const Feedback = lazy(() => import('./pages/Feedback'))

/* Logic games */
const GreaterLess = lazy(() => import('./games/GreaterLess'))
const MonkeyMath = lazy(() => import('./games/MonkeyMath'))
const CountFind = lazy(() => import('./games/CountFind'))
const PatternTrain = lazy(() => import('./games/PatternTrain'))
const MarbleSum = lazy(() => import('./games/MarbleSum'))
const RocketLine = lazy(() => import('./games/RocketLine'))
const BundleFactory = lazy(() => import('./games/BundleFactory'))
const ConsonantFish = lazy(() => import('./games/ConsonantFish'))

/* Brain gym */
const StarGrid = lazy(() => import('./brain/StarGrid'))
const Hedgehog = lazy(() => import('./brain/Hedgehog'))
const Tangled = lazy(() => import('./brain/Tangled'))
const Simon = lazy(() => import('./brain/Simon'))
const WhatsMissing = lazy(() => import('./brain/WhatsMissing'))
const SameAgain = lazy(() => import('./brain/SameAgain'))

/* Versus */
const XOMove = lazy(() => import('./versus/XOMove'))
const TicTacToe = lazy(() => import('./versus/TicTacToe'))
const MemoryMatch = lazy(() => import('./versus/MemoryMatch'))
const SpotDiff = lazy(() => import('./versus/SpotDiff'))
const SnakeLadder = lazy(() => import('./versus/SnakeLadder'))
const WhoIsIt = lazy(() => import('./versus/WhoIsIt'))

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />

        <Route path="play" element={<Play />} />
        <Route path="activities" element={<Activities />} />
        <Route path="activities/:id" element={<ActivityDetail />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:id" element={<ArticleDetail />} />
        <Route path="stories" element={<Stories />} />
        <Route path="stories/:id" element={<StoryReader />} />
        <Route path="reading" element={<Reading />} />
        <Route path="reading/:id" element={<ReadingLesson />} />

        <Route path="speak" element={<Speak />} />
        <Route path="speak/:id" element={<SpeakLesson />} />
        <Route path="words" element={<Words />} />
        <Route path="words/:id" element={<WordSet />} />
        <Route path="talk/daily" element={<Talk />} />
        <Route path="talk/daily/:id" element={<TalkScene />} />

        <Route path="games" element={<Games />} />
        <Route path="games/greater-less" element={<GreaterLess />} />
        <Route path="games/monkey-math" element={<MonkeyMath />} />
        <Route path="games/count-find" element={<CountFind />} />
        <Route path="games/pattern-train" element={<PatternTrain />} />
        <Route path="games/marble-sum" element={<MarbleSum />} />
        <Route path="games/rocket-line" element={<RocketLine />} />
        <Route path="games/bundle-factory" element={<BundleFactory />} />
        <Route path="games/consonant-fish" element={<ConsonantFish />} />

        <Route path="brain" element={<Brain />} />
        <Route path="brain/star-grid" element={<StarGrid />} />
        <Route path="brain/hedgehog" element={<Hedgehog />} />
        <Route path="brain/tangled" element={<Tangled />} />
        <Route path="brain/simon" element={<Simon />} />
        <Route path="brain/whats-missing" element={<WhatsMissing />} />
        <Route path="brain/same-again" element={<SameAgain />} />

        <Route path="versus" element={<Versus />} />
        <Route path="versus/xo-move" element={<XOMove />} />
        <Route path="versus/tic-tac-toe" element={<TicTacToe />} />
        <Route path="versus/memory-match" element={<MemoryMatch />} />
        <Route path="versus/spot-diff" element={<SpotDiff />} />
        <Route path="versus/snake-ladder" element={<SnakeLadder />} />
        <Route path="versus/who-is-it" element={<WhoIsIt />} />

        <Route path="coding" element={<Coding />} />
        <Route path="draw" element={<Draw />} />
        <Route path="classroom" element={<Classroom />} />
        <Route path="classroom/numbers" element={<ClassroomNumbers />} />
        <Route path="classroom/melodica" element={<ClassroomMelodica />} />
        <Route path="classroom/flashcards" element={<ClassroomFlashcards />} />

        <Route path="quiz/parent-type" element={<Quiz />} />
        <Route path="settings" element={<Settings />} />
        <Route path="feedback" element={<Feedback />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
