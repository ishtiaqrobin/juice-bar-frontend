import React from "react";
import GooglePlayLogo from "@/assets/webp/google_play.webp";
import AppStoreLogo from "@/assets/webp/app_store.webp";
import Image from "next/image";

const AppFooter = () => {
  return (
    <div className="bg-primary w-full">
      <div className="mx-auto max-w-[940px] flex flex-col md:flex-row justify-between items-center pt-5 md:pt-4 md:px-16 py-4">
        <div>
          <h3 className="text-lg leading-[25px] text-white text-center md:text-left font-semibold">
            FJB is better on the app
          </h3>
          <p className="text-[15px] leading-[23px] text-white text-center md:text-left font-medium">
            Download our FJB App to get the full experience.
          </p>
        </div>
        <div className="flex justify-between items-center py-4 md:py-0 gap-4">
          <button className="hover:cursor-pointer">
            <Image
              src={GooglePlayLogo}
              alt=""
              width={180}
              height={56}
              className="w-[100px] md:w-[180px] h-[32px] md:h-[56px]"
            ></Image>
          </button>
          <button className="hover:cursor-pointer">
            <Image
              src={AppStoreLogo}
              alt=""
              width={180}
              height={56}
              className="w-[100px] md:w-[180px] h-[32px] md:h-[56px]"
            ></Image>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
