"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { AxiosError } from "axios";
import {
  Menu,
  X,
  Globe,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logos, images } from "../data.js";
import PopupButton from "../components/popupdownload";
import { useTranslation } from "react-i18next";
import DeviceSupport from '@/components/DeviceSupport';

import dynamic from "next/dynamic";
import Image from "next/image";

// Lazy load heavy components
const Partner = dynamic(() => import("../components/partner").then(mod => ({ default: mod.Partner })), {
  loading: () => <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#324E74]"></div></div>
});

const TestimonialSection = dynamic(() => import("../components/testimoni"), {
  loading: () => <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#324E74]"></div></div>
});

const BlogSection = dynamic(() => import("../components/blog-section"), {
  loading: () => <div className="flex justify-center items-center h-60"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#324E74]"></div></div>
});

type SupportedLanguage = "id" | "en";
const supportedLanguages: SupportedLanguage[] = ["id", "en"];
const sectionContainer = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

type NavItem = {
  id: "Home" | "Benefit" | "Features" | "Blog" | "Testimonials" | "Contact";
  label: string;
};

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  // Konstanta SEO (Static)
  const SEO_CONFIG = {
    url: "https://latihan.id",
    image: "https://latihan.id/og-image.jpg",
    themeColor: "#324E74",
  };

  const changeLanguage = (lng: SupportedLanguage) => {
    i18n.changeLanguage(lng);
  };

  const navItems = useMemo<NavItem[]>(
    () => [
      { id: "Home", label: t("nav.home") },
      { id: "Benefit", label: t("nav.benefit") },
      { id: "Features", label: t("nav.features") },
      { id: "Blog", label: "Blog" },
      { id: "Testimonials", label: t("nav.testimonials") },
      { id: "Contact", label: t("nav.contact") },
    ],
    [t],
  );

  // Track the section whose bounds currently surround the viewport focus line.
  useEffect(() => {
    let ticking = false;
    const sections = [
      "Home",
      "Benefit",
      "Features",
      "Blog",
      "Testimonials",
      "Contact",
    ] as const;

    const updateActiveSection = () => {
      const viewportOffset = window.innerHeight * 0.3;
      let nextActiveSection: (typeof sections)[number] = sections[0];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;

        if (sectionTop <= viewportOffset && sectionBottom >= viewportOffset) {
          nextActiveSection = sectionId;
          break;
        }

        if (sectionTop < viewportOffset) {
          nextActiveSection = sectionId;
        }
      }

      setActiveSection(nextActiveSection);
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // useCallback untuk fungsi Scroll - uses scrollIntoView untuk menghindari layout recalculation
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMobileMenuOpen(false);
  }, []);

  const BASE_URL = "https://www.latihan.id";

  // Ambil data langsung dari i18n
  const metaTitle = t("meta.title");
  const metaDescription = t("meta.description");

  // Schema.org structured data (JSON-LD) untuk SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: metaTitle,
    description: metaDescription,
    url: BASE_URL,
    image: SEO_CONFIG.image,
    applicationCategory: "EducationalApplication",
    offers: {
      "@type": "Offer",
      price: "0",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/35 backdrop-blur-xl shadow-lg border-b border-slate-200/50 py-4"
            : "bg-white py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 w-[135px] sm:w-[150px]">
              <Image
                src={logos.logoLatihan}
                alt="Latihan.id Logo"
                width={150}
                height={50}
                className="w-full h-auto"
                priority
                sizes="(max-width: 640px) 135px, 150px"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-all duration-300 relative 
                  text-black hover:text-blue-600
                  ${activeSection === item.id ? "text-blue-600" : ""}`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </button>
              ))}

              {/* Language Switcher */}
              <div className="flex items-center gap-3 border-l pl-6 border-gray-300">
                <Globe className="w-4 h-4 text-gray-500" />
                <div className="flex items-center gap-2">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`text-sm font-medium uppercase transition-colors p-1 ${
                        i18n.language === lang
                          ? "text-[#324E74] font-bold"
                          : "text-gray-400 hover:text-[#324E74]"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                  <span className="text-gray-300 hidden md:inline">|</span>
                  {/* Note: Logic divider disesuaikan dgn map */}
                </div>
              </div>

              {/* Sign In Button */}
              <a
                href="https://latihan.id/login"
                className="px-6 py-2 rounded-full font-medium transition-all duration-300 bg-[#324E74] text-white hover:bg-blue-700 hover:shadow-lg"
              >
                {t("nav.login")}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors duration-300 text-black hover:bg-gray-100"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? "max-h-120 opacity-100 mt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 space-y-3 bg-white rounded-lg shadow-lg">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-6 py-2 text-sm font-medium transition-colors duration-200 
                  ${
                    activeSection === item.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-black hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Language Switcher */}
              <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">
                  {t("nav.language")}
                </span>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                        i18n.language === lang
                          ? "bg-white shadow text-[#324E74]"
                          : "text-gray-400"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 pt-2 pb-4">
                <a
                  href="https://latihan.id/login"
                  className="block w-full text-center px-6 py-2 bg-[#324e74] text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  {t("nav.login")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
      {/* Hero Section */}
      <section id="Home" className="pt-24 md:pt-0 mt-5 md:mt-36 mb-0 md:mb-10">
        <div
          className={`${sectionContainer} flex flex-col items-center gap-8  md:flex-row`}
        >
          {/* Text Content */}
          <div className="flex-1 text-left">
            <span className="inline-block text-[#324E74] bg-[#eaedf1] font-bold py-2 px-6 rounded-4xl mb-5 ">
              {t("hero.span")}
            </span>
            <h1 className="text-4xl md:text-[44px] font-bold mb-6 text-bold leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t("hero.description")}
            </p>
            <div className="flex flex-col md:flex-row my-8 gap-4">
              <a
                href="https://api.whatsapp.com/send/?phone=6281370000299&text=Hi%2C+I+want+to+ask+about+Latihan+ID&type=phone_number&app_absent=0"
                className="inline-block py-3 w-60 bg-[#324E74] text-white rounded-full font-semibold text-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                {t("hero.cta")}
              </a>
              <PopupButton />
            </div>

            {/* OPTIMASI 4: Explicit Size untuk mencegah layout shift */}
            <div className="w-1/2 md:w-35 h-auto bg-[#F8FAFC] rounded-lg">
              <Image
                src={images.user}
                alt={t("hero.images.user_active")}
                width={200}
                height={70}
                className="w-full h-auto select-none pointer-events-none"
                priority
                sizes="(max-width: 768px) 50vw, 35vw"
              />
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full flex justify-center md:justify-end">
            <div className="relative bg-[#F8FAFC] rounded-2xl overflow-hidden">
              <Image
                src={images.heroImage}
                alt={t("hero.images.main_hero")}
                width={600}
                height={500}
                className="w-full max-w-xl h-auto object-contain py-10 md:pl-16"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-screen relative left-1/2 -translate-x-1/2 bg-white">
        <div className={sectionContainer}>
          <Partner />
        </div>
      </section>

      <section id="Benefit" className={sectionContainer}>
        {/* About Block */}
        <div className="my-5 md:my-16 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center md:text-left">
              {t("About.title")}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed text-center md:text-left">
              {t("About.description")}
            </p>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="bg-[#F8FAFC] rounded-2xl p-4">
              <Image
                src={images.mockup1}
                alt={t("About.image_alt") || "Latihan.id Dashboard"}
                width={500}
                height={400}
                className="w-full max-w-lg h-auto object-contain transition-transform duration-500 hover:scale-[1.02] drop-shadow-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Features Block Grid */}
        <div className="flex flex-col md:flex-row gap-4 mb-20">
          {/* Main Feature (Blue) */}
          <div className="relative bg-[#324E74] rounded-3xl px-8 pt-8 md:px-16 md:pt-16 text-left space-y-6 overflow-hidden w-full md:w-1/2">
            <h3 className="text-white text-2xl font-bold">
              {t("About.feature.1.title")}
            </h3>
            <p className="text-white pb-64 md:pb-0 z-10 relative">
              {t("About.feature.1.description")}
            </p>
            <Image
              src={images.placholder}
              alt={t("About.feature.1.ALT")}
              width={300}
              height={200}
              className="select-none pointer-events-none pt-10 md:pt-16 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-56 md:h-80 object-cover w-auto"
              sizes="(max-width: 768px) 60vw, 30vw"
            />
          </div>

          {/* Side Features */}
          <div className="flex flex-col gap-4 w-full md:w-1/2 text-left">
            <div className="bg-[#465F81] rounded-3xl p-8 md:p-14 flex-1">
              <h3 className="text-white text-2xl font-bold mb-4">
                {t("About.feature.2.title")}
              </h3>
              <p className="text-white">{t("About.feature.2.description")}</p>
            </div>

            <div className="bg-[#6F839D] rounded-3xl p-8 md:p-14 flex-1">
              <h3 className="text-white text-2xl font-bold mb-4">
                {t("About.feature.3.title")}
              </h3>
              <p className="text-white">{t("About.feature.3.description")}</p>
            </div>
          </div>
        </div>

        {/* Mockup 2 */}
        <div className="w-full flex justify-center">
          <div className="bg-[#F8FAFC] rounded-2xl p-4">
            <Image
              src={images.mockup2}
              alt={t("features.mockup_alt_2") || "Fitur Analisis Latihan.id"}
              width={1000}
              height={600}
              className="mt-10 w-full max-w-5xl h-auto object-contain hover:scale-[1.01] transition-all duration-500 ease-in-out"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="Features" className="py-20 bg-white">
        <div className={sectionContainer}>
          <div className="text-center">
            {" "}
            <span className="text-[#324E74] font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-2 rounded-full mb-4 inline-block">
              {t("features.tag")}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
            {t("features.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((id) => (
              <div
                key={id}
                // NOTE: Added 'overflow-hidden' essentially here to contain the moving blobs
                className="
                    relative group overflow-hidden
                    bg-[#F3F5F7] 
                    rounded-3xl p-8 md:p-10 text-left w-full 
                    transform transition-all duration-500 ease-out
                    hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/30
                    cursor-pointer border border-transparent
                    z-0
                  "
              >
                {/* ================= MAIN BG COLOR TRANSITION ================= */}
                <div className="absolute inset-0 bg-[#324E74] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20"></div>
                {/* ================= BACKGROUND ANIMATED ELEMENTS ================= */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-all duration-700 ease-in-out transform scale-100 group-hover:scale-110 group-hover:rotate-4 -z-10"
                  style={{
                    backgroundImage: `radial-gradient(#ffffff 2px, transparent 2px)`,
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* 2. Bottom-Right Dark Glow Blob (Moves up-left) */}
                <div
                  className="absolute -bottom-20 -right-20 w-64 h-64 
                    bg-blue-600/40 rounded-full blur-[60px] 
                    opacity-0 group-hover:opacity-100 
                    transition-all duration-1000 ease-in-out
                    transform translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0
                    -z-10"
                ></div>

                {/* 3. Top-Left Lighter Glow Blob (NEW - Moves down-right) */}
                <div
                  className="absolute -top-20 -left-20 w-64 h-64 
                    bg-blue-400/30 rounded-full blur-[60px] 
                    opacity-0 group-hover:opacity-100 
                    transition-all duration-1000 ease-in-out delay-100
                    transform -translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0
                    -z-10"
                ></div>

                {/* ================= CONTENT (Kept Relative + Z-Index for layering) ================= */}
                <div className="relative z-10">
                  <div
                    className="w-14 h-14 flex items-center justify-center 
                    bg-[#324E74] text-white 
                    group-hover:bg-white group-hover:text-[#324E74] 
                    text-xl font-bold rounded-2xl mb-6 shadow-sm 
                    transition-all duration-300 group-hover:scale-110"
                  >
                    {id}
                  </div>
                  <h3 className="text-xl md:text-lg font-bold text-[#324E74] mb-3 group-hover:text-white transition-colors duration-300">
                    {t(`features.features.${id}.title`)}
                  </h3>
                  <p className="text-gray-600 text-md leading-relaxed group-hover:text-blue-50 transition-colors duration-300">
                    {t(`features.features.${id}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DeviceSupport />
      </section>

      <BlogSection />

      {/* Testimonial Section */}
      <section id="Testimonials" className="mb-20">
        <div className={sectionContainer}>
          <TestimonialSection />
        </div>
      </section>

      {/* Contact Section */}
      <section className={`${sectionContainer} pb-20`}>
        <div
          id="Contact"
          className="group relative overflow-hidden flex py-24 rounded-3xl items-center justify-center bg-gradient-to-br from-[#324E74] to-[#1E2F46] text-white shadow-2xl"
        >
          {/* 1. Animated Background Pattern */}
          {/* EFEK: Scale membesar + Opacity jadi lebih jelas (10% -> 30%) */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none 
      transition-all duration-1000 ease-in-out 
      group-hover:scale-110 group-hover:rotate-1 group-hover:opacity-30"
            style={{
              backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* 2. Top Right Blob */}
          {/* EFEK: Geser posisi + Opacity jadi terang (30% -> 60%) */}
          <div
            className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500 rounded-full blur-[100px] 
      opacity-30 
      transition-all duration-700 ease-in-out
      group-hover:translate-y-10 group-hover:-translate-x-10 group-hover:opacity-60"
          />

          {/* 3. Bottom Left Blob */}
          {/* EFEK: Geser posisi + Opacity jadi terang (30% -> 60%) */}
          <div
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500 rounded-full blur-[100px] 
      opacity-30 
      transition-all duration-700 ease-in-out
      group-hover:-translate-y-10 group-hover:translate-x-10 group-hover:opacity-60"
          />

          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {t("contact.title")}
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              {t("contact.description")}
            </p>
            <a
              href="https://api.whatsapp.com/send/?phone=6281370000299&text=Hi%2C+I+want+to+ask+about+Latihan+ID&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-white text-[#324E74] rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl inline-block"
            >
              {t("contact.btn_contact")}
            </a>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className={`${sectionContainer} pt-4`}>
        <hr className="border-gray-200 mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-10">
          <Image
            src={logos.logoLatihan}
            alt="Latihan.id Footer Logo"
            width={120}
            height={40}
            className="h-8 w-auto md:h-10 opacity-80 hover:opacity-100 transition-opacity"
            sizes="120px"
          />
          <p className="text-gray-500 text-sm text-center md:text-right">
            &copy; {new Date().getFullYear()} PT Global Zerone Digital. All
            rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
