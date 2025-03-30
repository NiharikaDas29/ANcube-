"use client"
import { motion } from "framer-motion";
export default function Bg() {
    return(
   <>
<div className="relative bg-white min-h-screen overflow-hidden flex flex-col">
  {/* Top Section (Logo + Buttons) */}
  <div className="hidden md:flex md:justify-between md:items-center w-full p-5">
    {/* Logo on the Left */}
    <div>
      <img src="./images/logo1.jpg" alt="Logo" className="h-18" />
    </div>
    {/* Right Side Buttons */}
    <div className="hidden md:flex  md:items-center space-x-5">
      <a href="#" className="text-blue-600 hover:text-gray-900">
        Login
      </a>
      <a
        href="#"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Get Started
      </a>
    </div>
  </div>
  {/* Grid Background */}
  <div className="absolute inset-0 bg-grid-light bg-opacity-20 pointer-events-none" />
  {/* Blur Effect on Sides */}
  <div className="hidden lg:flex absolute top-10 left-10 w-60 h-60 bg-blue-300 opacity-30 blur-3xl rounded-full"></div>
  <div className="hidden lg:flex absolute bottom-20 right-20 w-80 h-80 bg-blue-400 opacity-30 blur-3xl rounded-full"></div>
  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
 
  {/* Hero Section */}
  <div className="relative z-10 text-center flex-grow flex flex-col justify-center items-center p-10">

                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl font-bold text-black">
                    Generate <span className="text-blue-600">Social Media Posts</span> faster than you <br />
                    <span className="text-blue-600">brew your coffee</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-gray-600 mt-4">
                    AI-driven platform to enhance your creativity effortlessly.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-6 flex flex-col gap-3 items-center justify-center sm:flex-row">
                    <motion.a href="#" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 md:hidden">Get Started</motion.a>
                    <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="border border-gray-400 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-100">Watch Demo</motion.button>
                </motion.div>
  </div>
</div>

   </>
    )
}