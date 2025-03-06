import React from 'react'

function NavBar() {
    return (
        <div className='w-full z-50 bg-white flex items-center justify-between py-2 px-2'>

            <div className='flex items-center justify-between gap-x-10 '>

                <div>
                    <h1 className='text-xl'>
                        logo
                    </h1>
                </div>
                <div>
                    <button className='text-[15px] md:text-lg border-1 border-[#007f84] rounded-lg
                    py-2 px-4 text-[#007f84] font-semibold hover:bg-[#007f84] hover:text-white duration-300 hover:shadow-2xl cursor-pointer '>How to</button>
                </div>

            </div>
            <div className='px-4'>
                <h1 className='text-xl'>
                    logo
                </h1>

            </div>

        </div>
    )
}

export default NavBar
