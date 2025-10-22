import React from 'react';

const StartOrder = () => {
    return (
        <div className="bg-[#F4F5F5] px-4 pt-2.5 pb-5 md:pt-2 md:pb-[20px] flex items-center justify-center gap-8 md:gap-12">
            <h2 className="text-[11px] md:text-base leading-[18px] md:leading-5 text-black font-semibold">
                Let's Order for Delivery or Self Collect
            </h2>
            <button className="bg-[#F4F5F5] border-2 border-red-500 px-3 md:px-12.5 py-1.5 md:py-2.5 rounded-full text-sm leading-3.5 font-medium text-primary hover:cursor-pointer transition-colors">
                Start Order
            </button>
        </div>
    );
};

export default StartOrder;
