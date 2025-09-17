import React from 'react'
import { HiSun } from "react-icons/hi";
import { FaUser } from "react-icons/fa6";
import { RiSettings3Fill } from "react-icons/ri";

const Navbar = () => {
  return (
    <>
    <div className='nav flex items-center justify-between px-[70px] py-[45px] h-[90px] border-b-[1px] border-gray-800'>
      <div className='logo'>
        <h3 className='text-[25px] font-[700] bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent'>GenUI</h3>
      </div>
      <div className="icons flex items-center gap-[15px] ">
        <div className="icon p-[15px] bg-[#141319] border-[1px]-[#152937] rounded-xl cursor-pointer"><HiSun /></div>
        <div className="icon p-[15px] bg-[#141319] border-[1px]-[#152937] rounded-xl cursor-pointer"><FaUser /></div>
        <div className="icon p-[15px] bg-[#141319] border-[1px]-[#152937] rounded-xl cursor-pointer"><RiSettings3Fill /></div>
      </div>
    </div>
    </>
  )
}

export default Navbar