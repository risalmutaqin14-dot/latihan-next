'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import parse from "html-react-parser";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Link as LinkIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

type WordPressAuthor = {
  name?: string;
  avatar_urls?: Record<string, string>;
};

type WordPressTerm = {
  id: number;
  taxonomy: string;
  name: string;
};

type WordPressPost = {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  lang?: string;
  polylang_current_lang?: string;
  categories?: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    author?: WordPressAuthor[];
    "wp:term"?: WordPressTerm[][];
    [key: string]: unknown;
  };
};

type SharePlatform = "whatsapp" | "instagram" | "copy";

const normalizeWordPressContent = (html: string) => {
  return html
    .replace(/<(\/?)(article|section|main)\b/gi, "<$1div")
    .replace(/<p>\s*<\/p>/gi, "");
};

export default function BlogPost() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const router = useRouter();

  // --- STATE ---
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // URL API WordPress Anda
  const WP_API_URL = "https://blog.latihan.id/wp-json/wp/v2";

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- 1. FETCH DATA POSTINGAN UTAMA ---
  useEffect(() => {
    if (!mounted || !slug) {
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        // console.log("Fetching slug:", slug);

        const res = await axios.get(`${WP_API_URL}/posts?slug=${slug}&_embed`);

        if (res.data.length > 0) {
          const postData = res.data[0];
          setPost(postData);

          // Deteksi bahasa
          const postLang =
            postData.lang || postData.polylang_current_lang || i18n.language;

          // Ambil Kategori untuk Related Post
          const categoryIds = postData.categories || [];
          const categoryIdsString = categoryIds.join(",");

          fetchRelatedPosts(postData.id, postLang, categoryIdsString);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [mounted, slug, i18n.language]);

  // --- 2. FETCH RELATED POSTS ---
  const fetchRelatedPosts = async (
    currentId: number,
    lang: string,
    categoryIds: string
  ) => {
    try {
      let url = `${WP_API_URL}/posts?_embed&per_page=3&exclude=${currentId}&lang=${lang}`;

      if (categoryIds) {
        url += `&categories=${categoryIds}`;
      }

      // console.log(`Fetching related URL: ${url}`);
      const res = await axios.get(url);
      setRelatedPosts(res.data);
    } catch (error) {
      console.error("Error fetching related:", error);
    }
  };

  // --- 3. LOGIC PROGRESS BAR ---
  useEffect(() => {
    if (!mounted) {
      return;
    }

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  // --- 4. LOGIC GANTI BAHASA ---
  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (post) {
      // navigate("/");
    }
  }, [mounted, i18n.language, post]);

  // --- 5. PERBAIKAN: SANITIZE CONTENT (Allow Iframe & Lists) ---
  useEffect(() => {
    let isActive = true;
    const prepare = async () => {
      if (!post || !mounted) return;

      // Ambil konten mentah dari WordPress
      let content = normalizeWordPressContent(post.content?.rendered || "");

      if (typeof window !== "undefined") {
        try {
          const DOMPurify = (await import("dompurify")).default;

          // KONFIGURASI DOMPURIFY: Izinkan iframe, list, dan atribut untuk formatting
          content = DOMPurify.sanitize(content, {
            ADD_TAGS: ["iframe", "ul", "ol", "li", "blockquote", "h2", "h3", "h4", "h5", "h6", "br", "p", "div", "span", "strong", "em", "b", "i", "u"], // Tambahkan tag formatting teks
            ADD_ATTR: [
              "allow",
              "allowfullscreen",
              "frameborder",
              "scrolling",
              "src",
              "width",
              "height",
              "loading",
              "title",
              "style", // Izinkan atribut style untuk alignment dan formatting
              "align", // Izinkan atribut align untuk text alignment
              "class", // Izinkan class untuk styling
            ],
          });
        } catch {
          // Jika dompurify gagal load, gunakan raw content (fallback)
          // console.warn("DOMPurify not loaded, rendering raw HTML");
        }
      }

      if (isActive) setSanitizedContent(content);
    };

    prepare();

    return () => {
      isActive = false;
    };
  }, [mounted, post]);

  // --- HELPER: FORMAT DATA ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --- FUNGSI SHARE ---
  const handleShare = (platform: SharePlatform) => {
    const currentUrl = window.location.href;
    const shareText = post
      ? `Baca artikel: "${post.title.rendered}"`
      : "Baca artikel ini";

    if (platform === "whatsapp") {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(
        shareText + "\n\n" + currentUrl
      )}`;
      window.open(waUrl, "_blank");
    } else if (platform === "instagram") {
      navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      window.open("https://instagram.com", "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // --- RENDER: LOADING STATE ---
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#324E74]"></div>
      </div>
    );
  }

  // --- RENDER: 404 NOT FOUND ---
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Artikel Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-8">
          Maaf, artikel yang Anda cari tidak tersedia atau URL salah.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-[#324E74] text-white rounded-full"
        >
          Kembali ke Blog
        </button>
      </div>
    );
  }

  // --- DATA MAPPING DARI WP ---
  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://placehold.co/1200x600/e2e8f0/1e293b?text=No+Image";
  const authorName = post._embedded?.["author"]?.[0]?.name || "Admin";
  const authorAvatar =
    post._embedded?.["author"]?.[0]?.avatar_urls?.["96"] ||
    "https://i.pravatar.cc/150";
  const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Blog";
  const postTags =
    post._embedded?.["wp:term"]?.flat().filter((term) => term.taxonomy === "post_tag") ||
    [];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      {/* --- READING PROGRESS BAR (Fixed Top) --- */}
      <div className="fixed top-0 left-0 w-full h-2 z-[60] bg-gray-100">
        <div
          className="h-full bg-[#324E74] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* --- NAVIGASI BACK --- */}
      <div className="fixed top-14 left-4 md:left-8 z-40 hidden xl:block">
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-3 pl-2 pr-6 py-2 bg-white border border-gray-200 rounded-full shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-x-1"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-[#324E74] text-white rounded-full transition-transform duration-300 group-hover:scale-110">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-bold text-gray-600 group-hover:text-[#324E74]">
            {t("BlogPost.backButton") || "Kembali ke Beranda"}
          </span>
        </button>
      </div>

      {/* --- HERO HEADER --- */}
      <header className="pt-6 md:pt-28 pb-10 md:pt-36 md:pb-14 px-4 container mx-auto max-w-5xl text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#324E74] mb-6 tracking-wide uppercase">
          <span className="bg-blue-50 px-3 py-1 rounded-full">
            {categoryName}
          </span>
        </div>

        {/* Judul: Gunakan parse() agar karakter khusus render dengan benar */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-gray-900 mb-8">
          {parse(post.title.rendered)}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm md:text-base border-y border-gray-100 py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img src={authorAvatar} alt={authorName} />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 leading-none">
                {authorName}
              </p>
              <p className="text-xs">{t("BlogPost.writer") || "Penulis"}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            {formatDate(post.date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            {t("BlogPost.readTime") || "5 Menit Baca"}
          </div>
        </div>
      </header>

      {/* --- FEATURED IMAGE --- */}
      <div className="container mx-auto px-4 max-w-6xl mb-16">
        <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl bg-gray-50 border border-gray-100">
          <img
            src={featuredImage}
            alt={post.title.rendered}
            className="w-full h-auto max-h-[700px] object-contain mx-auto"
          />
        </div>
      </div>

      {/* --- CONTENT LAYOUT --- */}
      <div className="container mx-auto px-4 max-w-6xl text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: MAIN ARTICLE CONTENT */}
          <article className="lg:col-span-8">
            <div
              className="blog-content prose prose-slate max-w-none text-gray-600 prose-a:text-blue-600 prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{
                __html:
                  sanitizedContent ||
                  normalizeWordPressContent(post.content?.rendered || ""),
              }}
            />

            {/* TAGS */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {postTags.length > 0 ? (
                  postTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-[#324E74] hover:text-white transition-colors cursor-pointer"
                    >
                      #{tag.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    {t("BlogPost.tags") || "Tidak ada tags"}
                  </span>
                )}
              </div>
            </div>
          </article>

          {/* RIGHT: SIDEBAR */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Share Widget */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 size={20} className="text-[#324E74]" />
                  {t("BlogPost.shareArticle") || "Bagikan Artikel"}
                </h3>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="flex items-center gap-3 w-full p-3 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 group"
                  >
                    <FaWhatsapp size={22} />
                    <span className="font-semibold text-sm">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleShare("instagram")}
                    className="flex items-center gap-3 w-full p-3 rounded-xl bg-pink-50 text-pink-600 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-600 hover:text-white transition-all duration-300 group"
                  >
                    <FaInstagram size={22} />
                    <span className="font-semibold text-sm">Instagram</span>
                  </button>

                  <button
                    onClick={() => handleShare("copy")}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                        ${
                          isCopied
                            ? "bg-[#324E74] text-white"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-600 hover:text-white"
                        }
                      `}
                  >
                    {isCopied ? <Check size={22} /> : <LinkIcon size={22} />}
                    <span className="font-semibold text-sm">
                      {isCopied
                        ? t("BlogPost.copied")
                        : t("BlogPost.copy_link")}
                    </span>
                  </button>
                </div>
              </div>

              {/* CTA Box */}
              <div className="bg-[#324E74] rounded-2xl p-8 text-center text-white relative overflow-hidden group">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(#fff 2px, transparent 2px)",
                    backgroundSize: "16px 16px",
                  }}
                ></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3">
                    {t("BlogPost.contact.title") ||
                      "Siap Transformasi Sekolah Anda?"}
                  </h3>
                  <p className="text-blue-100 text-sm mb-6">
                    {t("BlogPost.contact.desc") ||
                      "Konsultasikan kebutuhan digitalisasi sekolah Anda bersama tim ahli kami."}
                  </p>
                  <a
                    href="https://api.whatsapp.com/send/?phone=6281370000299&text=Hi%2C+I+want+to+ask+about+Latihan-ID"
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-3 bg-white text-[#324E74] font-bold rounded-xl hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
                  >
                    {t("BlogPost.contact.button") || "Hubungi Kami"}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* --- RELATED POSTS --- */}
      <section className="bg-[#F3F5F7] py-20 mt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            {t("BlogPost.other_article") || "Artikel Lainnya"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((item) => (
              <Link
                href={`/blog/${item.slug}`}
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={
                      item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={item.title.rendered}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-bold text-gray-900 mb-2 group-hover:text-[#324E74] line-clamp-2">
                    {parse(item.title.rendered)}
                  </h4>
                  <div
                    className="text-sm text-gray-500 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: item.excerpt.rendered }}
                  />
                </div>
              </Link>
            ))}

            {relatedPosts.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center">
                {t("BlogPost.alret") || "Belum ada artikel terkait lainnya."}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
