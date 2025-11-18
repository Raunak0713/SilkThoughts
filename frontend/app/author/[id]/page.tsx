"use client";

import { ArrowLeft, Mail, BookOpen, Calendar, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Blog {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  published: string;
  cover: {
    url: string;
    alternativeText: string;
    formats?: {
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
  category: {
    name: string;
    slug: string;
  };
  tags: Tag[];
}

interface Author {
  id: number;
  documentId: string;
  name: string;
  email: string;
  bio: string;
  avatar?: {
    url: string;
    alternativeText?: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  };
}

export default function AuthorPage() {
  const params = useParams();
  const authorId = parseInt(params.id as string);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [author, setAuthor] = useState<Author | null>(null);
  const [authorBlogs, setAuthorBlogs] = useState<Blog[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("http://localhost:1337/api/authors?populate=*")
      .then((res) => res.json())
      .then((data) => {
        setAuthors(data.data || []);
        const foundAuthor = data.data.find((a: Author) => a.id === authorId);
        setAuthor(foundAuthor || null);
      })
      .catch((err) => console.error("Error fetching authors:", err));

    fetch("http://localhost:1337/api/blogs?populate=*")
      .then((res) => res.json())
      .then((data) => {
        const blogs = data.data || [];
        const filteredBlogs = blogs.filter(
          (blog: any) => blog.author?.id === authorId
        );
        setAuthorBlogs(filteredBlogs);
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, [authorId]);

  const getAvatarUrl = (author: Author) => {
    if (author.avatar?.url) {
      return `http://localhost:1337${
        author.avatar.formats?.small?.url || author.avatar.url
      }`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      author.name
    )}&background=ffffff&color=1e293b&size=256`;
  };

  if (!author) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-white/50 mx-auto mb-4 animate-pulse" />
          <p className="text-white/70 text-lg">Loading author profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div
          className={`mx-auto transition-all duration-500 ease-in-out ${
            isScrolled
              ? "max-w-4xl px-6 py-3 backdrop-blur-md rounded-full shadow-2xl shadow-black/10"
              : "max-w-7xl px-8"
          } flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              Silk Thoughts
            </span>
          </div>

          <a
            href="/"
            className="flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </a>
        </div>
      </nav>

      <div className="relative z-10 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 mb-16 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-white/20 to-white/5 rounded-full blur-2xl"></div>
                <img
                  src={getAvatarUrl(author)}
                  alt={author.name}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm text-white/90">Featured Author</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                  {author.name}
                </h1>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                  <div className="flex items-center gap-2 text-white/70">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{author.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm">
                      {authorBlogs.length}{" "}
                      {authorBlogs.length === 1 ? "Story" : "Stories"}
                    </span>
                  </div>
                </div>

                <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                  {author.bio}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Published Stories
            </h2>
            <p className="text-white/60 text-lg">
              Explore {authorBlogs.length}{" "}
              {authorBlogs.length === 1 ? "masterpiece" : "masterpieces"} by{" "}
              {author.name}
            </p>
          </div>

          {authorBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authorBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`http://localhost:1337${
                        blog.cover.formats?.small?.url || blog.cover.url
                      }`}
                      alt={blog.cover.alternativeText}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors flex-1">
                        {blog.title.split(" ").slice(0, 2).join(" ")}
                        {blog.title.split(" ").length > 2 ? "..." : ""}
                      </h3>
                      <span className="px-3 py-1 bg-white/10 border border-white/20 text-white/80 rounded-full text-xs font-medium whitespace-nowrap">
                        {blog.category.name}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4 mb-4">
                      <p className="text-white/60 text-sm flex-1">
                        {blog.description.length > 25
                          ? `${blog.description.substring(0, 25)}...`
                          : blog.description}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {blog.tags.slice(0, 1).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 bg-white/5 border border-white/10 text-white/70 rounded-full text-xs whitespace-nowrap"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {blog.tags.length > 1 && (
                          <span className="px-2 py-1 bg-white/5 border border-white/10 text-white/70 rounded-full text-xs whitespace-nowrap">
                            +{blog.tags.length - 1}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <img
                          src={getAvatarUrl(author)}
                          alt={author.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-white/70 text-sm">
                          {author.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/50" />
                        <span className="text-white/70 text-sm">
                          {new Date(blog.published).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
              <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No Stories Yet
              </h3>
              <p className="text-white/60">
                This author hasn't published any stories yet. Stay tuned!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
