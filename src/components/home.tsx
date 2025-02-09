import { Slideshow } from './ui/Slideshow'

function Home() {
  return (
    <div className="w-full min-h-screen pt-32"> {/* pt-32 to account for header height */}
      <Slideshow />
      {/* Add other content below the slideshow */}
    </div>
  )
}

export default Home
