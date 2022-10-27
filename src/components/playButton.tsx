import { useEffect, useState } from "react";

export const PlayButton = ({ audioURL }) => {
  // const audio: string = audioURL.toString()
  // console.log('audio', audio)
   const [audio, setAudio] = useState(new Audio(audioURL.toString()));
  const [playing, setPlaying] = useState(false);

  const play = () => {
    audio.play()
    setPlaying(true)
  };

  const pause = () => {
    audio.pause()
    setPlaying(false)
  };

  // useEffect(() => {
  //     playing ? audio.play() : audio.pause();
  //   },
  //   [playing]
  // );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

 
  // const { playing, togglePlayPause, load, pause, play } = useAudioPlayer()

  // const handlePlay = () => {
  //   if (!playing) {
  //     load([{file: audio, autoplay: true, format: ["mp3"]}])
  //     // play()
  //   } else {
  //     pause()
  //   }
  // }
  return !playing ?
  <button
    onClick={play}
    className='font-bold text-gray-100 text-xs border-gray-400 border h-12 w-12 rounded-full'
  >
     play
  </button> : 
  <button
    onClick={pause}
    className='font-bold text-gray-100 text-xs border-gray-400 border h-12 w-12 rounded-full'
  >
     pause
  </button>
}