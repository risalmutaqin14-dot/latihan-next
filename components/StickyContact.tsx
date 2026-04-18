import React from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

const StickyContact = () => {
  // REKOMENDASI UKURAN ICON: 22 atau 24 pixel
  const ICON_SIZE = 24; 

  const contacts = [
    {
      id: 1,
      name: "WhatsApp",
      icon: <FaWhatsapp size={ICON_SIZE} />, 
      url: "https://api.whatsapp.com/send/?phone=6281370000299&text=Hi%2C+I+want+to+ask+about+Latihan+ID&type=phone_number&app_absent=0",
      color: "text-[#25D366]",
      bgHover: "hover:bg-green-50",
    },
    // {
    //   id: 2,
    //   name: "Instagram",
    //   icon: <FaInstagram size={ICON_SIZE} />,
    //   url: "https://instagram.com/",
    //   color: "text-[#E4405F]",
    //   bgHover: "hover:bg-pink-50",
    // },
    {
      id: 3,
      name: "Email",
      icon: <HiOutlineMail size={ICON_SIZE} />,
      url: "mailto:info@zerone.id",
      color: "text-[#3B82F6]",
      bgHover: "hover:bg-blue-50",
    },
  ];

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-end">
      {/* Container Putih */}
      <div className="
        bg-white 
        rounded-l-2xl /* Diubah agar lengkungan pas dengan ukuran baru */
        shadow-[0_4px_20px_rgba(0,0,0,0.1)] 
        overflow-hidden border border-r-0 border-gray-100
      ">
        
        {contacts.map((contact) => (
          <a
            key={contact.id}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              relative group flex items-center justify-center
              w-12 h-12        
              md:w-14 md:h-14 
              transition-all duration-300 ease-in-out
              border-b border-gray-100 last:border-b-0
              ${contact.bgHover}
            `}
            aria-label={contact.name}
          >
            {/* Tooltip */}
            <span className="
              absolute right-full mr-3 px-2 py-1
              bg-gray-800 text-white text-xs font-medium rounded opacity-0 
              translate-x-2 pointer-events-none
              group-hover:opacity-100 group-hover:translate-x-0
              transition-all duration-300 whitespace-nowrap shadow-sm
            ">
              {contact.name}
              {/* Panah tooltip */}
              <span className="absolute top-1/2 -right-1 -mt-1 border-4 border-transparent border-l-gray-800"></span>
            </span>

            {/* Icon Wrapper */}
            <div className={`
              ${contact.color} 
              transform transition-transform duration-300 
              group-hover:scale-110 group-hover:-rotate-6
            `}>
              {contact.icon}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default StickyContact;