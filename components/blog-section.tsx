'use client';

import { useState, useEffect } from "react";
import type { AxiosError } from "axios";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import parse from "html-react-parser";
import Image from "next/image";

type WordPressPost = {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
};

export default function BlogSection() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchPosts = async () => {
      const wordpressURL =
        "https://www.latihan.id/wp-json/wp/v2/posts?_embed&per_page=18";

      setLoading(true);
      try {
        const res = await axios.get<WordPressPost[]>(wordpressURL);
        setPosts(res.data);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Gagal mengambil data WP:", err);
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById("Blog")?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <section id="Blog" className="py-20 bg-[#F8FAFC] rounded-2xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Blog */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#324E74] font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-2 rounded-full mb-4 inline-block">
            {t("blog.tag")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("blog.title")}
          </h2>
          <p className="text-gray-600 text-lg">{t("blog.sub-title")}</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#324E74]"></div>
          </div>
        ) : (
          <>
            {/* Grid Blog Posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[500px]">
              {currentPosts.map((post) => {
                const imgUrl =
                  post._embedded &&
                  post._embedded["wp:featuredmedia"] &&
                  post._embedded["wp:featuredmedia"][0].source_url
                    ? post._embedded["wp:featuredmedia"][0].source_url
                    : "https://placehold.co/600x400/324E74/FFFFFF?text=No+Image";

                return (
                  <article
                    key={post.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                  >
                    {/* Image Wrapper */}
                    <div className="relative overflow-hidden h-60 w-full bg-gray-100 rounded-lg">
                      <Image
                        src={imgUrl}
                        alt={post.title.rendered}
                        fill
                        className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-grow text-left">
                      <div className="flex items-center text-gray-400 text-sm mb-4 gap-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>5 min read</span>
                      </div>

                      <h3 className="text-xl text-left font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#324E74] transition-colors">
                        {parse(post.title.rendered)}
                      </h3>

                      <div className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow text-left line-clamp-3">
                        {parse(post.excerpt.rendered)}
                      </div>

                      <a
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 w-fit px-6 py-2.5 rounded-full bg-[#324E74] text-white font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                      >
                        {t("blog.readmore")}
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {posts.length > itemsPerPage && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  aria-label="Slide sebelumnya"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[#324E74] hover:bg-blue-50 hover:shadow-md"
                  }`}
                >
                  <ChevronLeft size={24} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 border ${
                        currentPage === number
                          ? "bg-[#324E74] text-white border-[#324E74] shadow-lg transform scale-110"
                          : "bg-white text-gray-500 border-gray-200 hover:border-[#324E74] hover:text-[#324E74]"
                      }`}
                    >
                      {number}
                    </button>
                  ),
                )}

                <button
                  aria-label="Slide selanjutnya"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[#324E74] hover:bg-blue-50 hover:shadow-md"
                  }`}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}