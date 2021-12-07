import { Icon } from '@iconify/react';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import { playlistIdState } from '../atoms/playlistAtom';

function Sidebar() {
    // Need to persist the state in _app.js
    const { data: session, status } = useSession()
    const [playlists, setPlaylists] = useState([])
    // want to store playlistId globally so we'll use recoil
    //  -> in _app.js wrap component in RecoilRoot
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    const spotifyApi = useSpotify();

    // console.log(playlistId)

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                console.log(data)
                setPlaylists(data.body.items)
            })
        }
        // console.log(playlists)
    }, [session, spotifyApi])


    return (
        <div className="pb-36 text-gray-500 p-5 text-xs border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex">
            <div className="space-y-4 ">
                {/* <button onClick={() => signOut()} className="flex items-center space-x-2 hover:text-white transition-colors ease-linear font-semibold">
                    <Icon icon="heroicons-solid:logout" className="h-5 w-5" />
                    <p>Logout</p>
                </button> */}
                <button className="flex items-center space-x-2 hover:text-white transition-colors ease-linear font-semibold">
                    <Icon icon="ci:home-fill" className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white transition-colors ease-linear font-semibold">
                    <Icon icon="akar-icons:search" className="h-5 w-5" />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white transition-colors ease-linear font-semibold">
                    <Icon icon="clarity:library-solid" className="h-5 w-5" />
                    <p>Your Library</p>
                </button>
                <hr className="border-t-[1px] border-gray-900" />

                <button className="flex items-center space-x-2 hover:text-white transition-colors ease-linear font-semibold">
                    <Icon icon="bx:bxs-add-to-queue" className="h-5 w-5" />
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white transition-colors ease-linear font-semibold">
                    <Icon icon="bx:bxs-heart-square" className="h-5 w-5" />
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white transition-colors ease-linear font-semibold">
                    <Icon icon="fluent:sound-source-24-filled" className="h-5 w-5" />
                    <p>Your Episodes</p>
                </button>
                <hr className="border-t-[1px] border-gray-800" />

                {/* Playlists... */}
                <div className='space-y-3'>
                    {playlists.map((playlist) =>
                        (<p key={playlist.id} className="cursor-default hover:text-white" onClick={() => setPlaylistId(playlist.id)}>{playlist.name}</p>)
                    )}
                </div>

            </div>
        </div>
    )
}

export default Sidebar
