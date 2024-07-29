import React from 'react'
import Image from "next/image"

const Features = () => {
  const features  = [
    {
      image: "/image.png",
      title:"Home Page",
      desc:'Managing made easy'
    },
    {
      image: "/image3.png",
      title:"Multi Department Support",
      desc:'Manage assets across your entire organization'
    },
    {
      image: "/image4.png",
      title:"Intuitive Dashboard",
      desc:'Get a bird-eye view of your asset ecosystem'
    },
    {
      image: "/image5.png",
      title:"Community-Driven Reporting",
      desc:'Engage your entire organization in the asset management process'
    },
    {
      image: "/image6.png",
      title:"Real-Time Resource Analysis",
      desc:'Our state-of-the-art resource analysis tool provides'
    },
  ]
  return (
    <div className='min-h-screen mb-10 max-sm:mx-7 mx-44 bg-inherit rounded-3xl max-w-8xl '>
      <center>
      <div className='mt-7 text-4xl md:text-5xl font-bold text-gray-700 mb-[120px] pt-5 md:mt-0 mb-6'>
        Features 
      </div>

      <div className="flex flex-col flex-wrap md:flex-row justify-around mt-16 mb-10 md:gap-32">
        {features.map((feat, index) => (
            <div key={index} className="text-center flex flex-col items-center  mx-auto md:mx-0 mb-8 md:mb-0">
                    <img 
              src={feat.image} 
              alt="hii" 
              className='w-[600px] h-[250px] border-2 border-gray-300'
/>       
               <h3 className="font-bold mb-2 text-xl text-[#2c3e50]">{feat.title}</h3>
            <p className="text-lg text-gray-600">{feat.desc}</p>
        </div>        ))}
      </div>
      </center>
    </div>
  )
}

export default Features