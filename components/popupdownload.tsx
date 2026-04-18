'use client';

import { useState } from "react";
import { logos } from "../data.js";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function PopupButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div>
      {/* Tombol */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-block py-3 w-60 z-0  bg-white text-[#324E74] rounded-full font-semibold text-center text-[#324E74] border-2 border-[#324E74]
             hover:bg-[#263a57] hover:text-white transition-all duration-300 transform hover:scale-105"
      >
        {t("hero.btn_download")}
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-xl z-50 animate-[fadeIn_500ms_ease-out]">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-150 text-center animate-[popupFade_320ms_cubic-bezier(0.22,1,0.36,1)]">
            <h2 className="text-xl font-bold mb-4 text-[#324E74]">{t("popup.title")}</h2>
            <p className="text-gray-700 mb-6">
              {t("popup.description")} <a href="https://api.whatsapp.com/send/?phone=6281370000299&text=Hi%2C+I+want+to+ask+about+zerOne.id+service&type=phone_number&app_absent=0" className="text-blue-500 underline">WhatsApp.</a> 
            </p>
            <div className="container flex flex-col md:flex-row items-center mb-6 gap-4 justify-center">
              <a
                href="https://play.google.com/store/apps/details?id=id.zerone.latihanid"
                target="_blank"
                rel="noreferrer"
                className="block w-full md:w-auto"
              >
                <Image
                  src={logos.playStore}
                  alt={t("popup.badges.play_store")}
                  width={200}
                  height={60}
                  className="w-50"
                />
              </a>
              <a
                href="https://apps.apple.com/id/app/latihan-id/id6466146230"
                target="_blank"
                rel="noreferrer"
                className="block w-full md:w-auto"
              >
                <Image
                  src={logos.appStore}
                  alt={t("popup.badges.app_store")}
                  width={200}
                  height={60}
                  className="w-50"
                />
              </a>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-[#324E74] text-white rounded-full font-medium hover:bg-[#263a57] transition-colors"
            >
              {t("popup.btn_close")}
            </button>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes popupFade {
              from {
                opacity: 0;
                transform: translateY(16px) scale(0.96);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};
