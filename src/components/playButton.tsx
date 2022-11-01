import Image from "next/image";
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
      className='rounded-full'
    >
      <Image src="/images/ic-play.png" width='40px' height='44px' />
    </button> :
    <button
      onClick={pause}
      className='rounded-full'
    >
      <Image src="/images/ic-pause.png" width='40px' height='44px' />
    </button>
}