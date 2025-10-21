import React from 'react';

const StartOrder = () => {
    return (
        <div className="bg-[#F4F5F5] px-4 py-[20px] flex items-center justify-center gap-12">
            <h2 className="text-base leading-5 text-black font-semibold">
                Let's Order for Delivery or Self Collect
            </h2>
            <button className="bg-[#F4F5F5] border-2 border-red-500 px-12.5 py-2.5 rounded-full text-sm leading-3.5 font-medium text-primary hover:cursor-pointer transition-colors">
                Start Order
            </button>
        </div>
    );
};

export default StartOrder;
