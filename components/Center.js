import { useSession, signOut } from "next-auth/react"
import {Icon} from '@iconify/react'
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500"
]

function Center() {
    const { data: session } = useSession();
    const [color, setColor] = useState(null)
    const spotifyApi = useSpotify();
    // Can use this
    // const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    // or 
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body);
        }).catch(err => console.log("Something went wrong, 2nd useEffect in center.js", err))
    }, [spotifyApi, playlistId])

    console.log(playlist)
    return (
        // Flex grow takes up as much room as possible
        <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div onClick={() => signOut()}  className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-70 rounded-full p-1 pr-2 ">
                    <img src={session?.user.image ? session.user.image : '/user.png'} alt="" className="rounded-full w-10 h-10"/>
                    <h2>{session?.user.name}</h2>
                    <Icon icon="codicon:triangle-down"  className="h-5 w-5"/>
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black h-80 mb-5`}>
                <img className="w-44 h-44 shadow-2xl ml-5" src={playlist?.images?.[0]?.url} alt=""/>
                <div className="">
                    <p className="text-xs font-light">PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>
            <Songs/>
        </div>
    )
}



export default Center
