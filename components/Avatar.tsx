import Image from "next/image"
import { rings } from "@dicebear/collection"
import { createAvatar } from "@dicebear/core"
const Avatar = ({seed,className}:{seed:string,className?:string }) => {
    const avata = createAvatar(rings,{
        seed,
    })
    const svg=avata.toString();
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
    return (
        <Image
            src={dataUrl}
            width={100}
            height={100}
            className={className}
            alt="User Avatar"
        />
    )
}

export default Avatar
