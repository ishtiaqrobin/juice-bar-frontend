import Image from "next/image";
import IconFJBStripe from "@/assets/svg/icon_fjb_strip.svg";

export default function BrandingIcon() {
    return (
        <div className="hidden md:block mb-3">
            <Image src={IconFJBStripe} alt="Logo" width={40} height={16} />
        </div>
    );
}