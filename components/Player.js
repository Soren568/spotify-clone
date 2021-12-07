import { Icon } from "@iconify/react";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify"


function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50);
    const songInfo = useSongInfo();
    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id);
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackIdState, spotifyApi, session])

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false)
            } else {
                spotifyApi.play();
                setIsPlaying(true)
            }
        })
    }

    // DEBOUNCING - waits a certain amount of time after change so there isnt constant request sent to Spotify
    useEffect(() => {
        if(volume > 0 && volume < 100){
            debouncedAdjustVolume(volume)
        }
    }, [volume])
    // useCallBack similar to a use effect 
    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch(err => {})
        }, 400), [])


    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-800 text-white grid grid-cols-3 text-xs md:text-bas px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-14 w-14" src={songInfo?.album?.images?.[0]?.url} alt="" />
                <h3>{songInfo?.name}</h3>
                <p>{songInfo?.artists?.[0]?.name}</p>
            </div>

            {/* Center */}
            <div className="flex space-x-4 items-center justify-center">
                <Icon icon="ph:shuffle" className="text-gray-500 h-4 w-4 cursor-pointer hover:text-white" />
                <Icon icon="ant-design:step-backward-outlined" className="text-gray-400 h-5 w-5 cursor-pointer hover:text-white" />
                {isPlaying ? (
                    <Icon onClick={() => handlePlayPause()} icon="ant-design:pause-circle-filled" className="h-10 w-10 cursor-pointer hover:scale-110" />
                ) : (
                    <Icon onClick={() => handlePlayPause()} icon="ant-design:play-circle-filled" className="h-10 w-10 cursor-pointer hover:scale-110" />
                )}
                <Icon icon="ant-design:step-forward-outlined" className="text-gray-400 h-5 w-5 cursor-pointer hover:text-white" />
                <Icon icon="fluent:arrow-repeat-all-24-regular" className="text-gray-500 h-4 w-4 cursor-pointer hover:text-white" />
            </div>

            {/* Right */}
            <div className="flex items-center justify-end space-x-2 md:space-x-3 pr-5">
                <Icon icon="bi:volume-down" className="text-gray-500 h-6 w-6"/>
                <input type="range" name="" id="" value={volume} onChange={(e) => setVolume(Number(e.target.value))} min={0} max={100} className="w-14 md:w-28"/>
            </div>
        </div>
    )
}

export default Player
