import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import Song from "./Song";
import {Icon} from '@iconify/react';


function Songs() {
    const playlist = useRecoilValue(playlistState);
    return (
        <div className="px-8 flex flex-col space-y-1 pb-28 text-white ">
            <div className="grid grid-cols-2 text-gray-500 pt-3 px-5 border-b-[.5px] border-gray-700">
                <div className="flex items-center space-x-3">
                    <p className="">#</p>
                    <div>
                        <p className="w-36 lg:w-64 tracking-wider text-xs">TITLE</p>
                    </div>
                </div>

                <div className="flex items-center justify-between ml-auto md:ml-0">
                    <p className='hidden md:inline w-40 tracking-wider text-xs'>ALBUM</p>
                    <Icon icon="fe:clock" className="text-lg" />
                </div>
            </div>
            {playlist?.tracks.items.map((track, i) => (
                <Song key={track.track.id} track={track} order={i} />
            ))}
        </div>
    )
}

export default Songs
