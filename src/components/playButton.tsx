import { useAudioPlayer } from "react-use-audio-player"

export const PlayButton = ({ audioURL }) => {
  const { playing, togglePlayPause } = useAudioPlayer({
    src: audioURL,
    format: 'mp3',
    autoplay: false
  })

  // const handleAudio = () => {
  //   playing && pause()
  //   !playing
  // }
  return <button
    onClick={togglePlayPause}
    className='font-bold text-gray-100 text-xs border-gray-400 border h-12 w-12 rounded-full'
  >
    {!playing ? 'play' : 'pause'}
  </button>
}