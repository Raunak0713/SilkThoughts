"use client";

import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  BookOpen,
  Share2,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, JSX } from "react";
import { useParams } from "next/navigation";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

interface TagType {
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
  content: BlocksContent;
  cover: {
    url: string;
    alternativeText: string;
    formats?: {
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
  author: {
    id: number;
    documentId: string;
    name: string;
    email: string;
    bio: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  tags: TagType[];
}

export default function BlogPage() {
  const params = useParams();
  const blogId = parseInt(params.id as string);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
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
    fetch("http://localhost:1337/api/blogs?populate=*")
      .then((res) => res.json())
      .then((data) => {
        const allBlogs = data.data || [];
        const foundBlog = allBlogs.find((b: Blog) => b.id === blogId);
        setBlog(foundBlog || null);

        if (foundBlog) {
          const related = allBlogs
            .filter(
              (b: Blog) =>
                b.id !== blogId &&
                (b.category?.id === foundBlog.category?.id ||
                  b.tags.some((tag) =>
                    foundBlog.tags.some((t: { id: number; }) => t.id === tag.id)
                  ))
            )
            .slice(0, 3);
          setRelatedBlogs(related);
        }
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, [blogId]);

  const renderContent = (content: any[]) => {
    return content.map((block, index) => {
      if (block.type === "paragraph") {
        return (
          <p key={index} className="text-white/80 text-lg leading-relaxed mb-6">
            {block.children.map((child: any, i: number) => child.text).join("")}
          </p>
        );
      }
      return null;
    });
  };

  if (!blog) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-white/50 mx-auto mb-4 animate-pulse" />
          <p className="text-white/70 text-lg">Loading story...</p>
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
              ? "max-w-4xl px-4 md:px-6 py-3 backdrop-blur-md rounded-full shadow-2xl shadow-black/10"
              : "max-w-7xl px-4 md:px-8"
          } flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
              SilkThoughts
            </span>
          </div>

          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back Home</span>
          </a>
        </div>
      </nav>

      <div className="relative z-10 pt-24 md:pt-32">
        <div className="max-w-5xl mx-auto px-4 md:px-8 mb-12 md:mb-16">
          <div className="mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4 md:mb-6">
              <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <span className="text-xs md:text-sm text-white/90">
                {blog.category.name}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-4 md:mb-8 leading-tight">
              {blog.title}
            </h1>

            <p className="text-lg md:text-2xl text-white/70 leading-relaxed mb-6 md:mb-8 font-light">
              {blog.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 pb-6 md:pb-8 border-b border-white/10">
              <a
                href={`/author/${blog.author.id}`}
                className="flex items-center gap-3 group w-full sm:w-auto"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 transition-colors">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium group-hover:text-white/80 transition-colors truncate">
                    {blog.author.name}
                  </p>
                  <p className="text-white/60 text-xs md:text-sm truncate">
                    {blog.author.bio}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm">
                  {new Date(blog.published).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <button className="ml-auto flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs md:text-sm hover:bg-white/20 transition-all">
                <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
            {blog.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs md:text-sm hover:bg-white/20 transition-all cursor-pointer"
              >
                <Tag className="w-3 h-3 md:w-4 md:h-4" />
                {tag.name}
              </span>
            ))}
          </div>

          <div className="relative mb-8 md:mb-12 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <img
              src={`http://localhost:1337${
                blog.cover.formats?.large?.url ||
                blog.cover.formats?.medium?.url ||
                blog.cover.url
              }`}
              alt={blog.cover.alternativeText}
              className="w-full h-[300px] md:h-[500px] object-cover"
            />
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-12 mb-8 md:mb-12">
            <div className="prose prose-invert prose-lg max-w-none">
              <BlocksRenderer
                content={blog.content}
                blocks={{
                  paragraph: ({ children }) => (
                    <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                      {children}
                    </p>
                  ),

                  heading: ({ children, level }) => {
                    const styles = {
                      1: "text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 mt-8 md:mt-12 tracking-tight",
                      2: "text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 mt-6 md:mt-10 tracking-tight",
                      3: "text-xl md:text-3xl font-bold text-white mb-3 md:mb-5 mt-4 md:mt-8 tracking-tight",
                      4: "text-lg md:text-2xl font-semibold text-white mb-3 md:mb-4 mt-4 md:mt-6",
                      5: "text-base md:text-xl font-semibold text-white mb-2 md:mb-3 mt-3 md:mt-5",
                      6: "text-sm md:text-lg font-semibold text-white mb-2 md:mb-3 mt-2 md:mt-4",
                    };
                    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                    return (
                      <Tag className={styles[level as keyof typeof styles]}>
                        {children}
                      </Tag>
                    );
                  },

                  list: ({ children, format }) => {
                    if (format === "ordered") {
                      return (
                        <ol className="list-decimal list-inside text-white/80 text-base md:text-lg mb-4 md:mb-6 space-y-1 md:space-y-2 ml-4">
                          {children}
                        </ol>
                      );
                    }
                    return (
                      <ul className="list-disc list-inside text-white/80 text-base md:text-lg mb-4 md:mb-6 space-y-1 md:space-y-2 ml-4">
                        {children}
                      </ul>
                    );
                  },

                  "list-item": ({ children }) => (
                    <li className="text-white/80 leading-relaxed text-base md:text-lg">
                      {children}
                    </li>
                  ),

                  link: ({ children, url }) => (
                    <a
                      href={url}
                      className="text-white underline hover:text-white/80 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),

                  code: ({ children }) => (
                    <pre className="bg-black/40 border border-white/20 rounded-xl p-4 md:p-6 mb-4 md:mb-6 overflow-x-auto">
                      <code className="text-white/90 text-xs md:text-sm font-mono">
                        {children}
                      </code>
                    </pre>
                  ),

                  image: ({ image }) => (
                    <figure className="my-4 md:my-8">
                      <img
                        src={
                          image.url.startsWith("http")
                            ? image.url
                            : `http://localhost:1337${image.url}`
                        }
                        alt={image.alternativeText || ""}
                        className="w-full rounded-xl md:rounded-2xl shadow-2xl"
                      />
                      {image.caption && (
                        <figcaption className="text-white/60 text-xs md:text-sm text-center mt-2 md:mt-3 italic">
                          {image.caption}
                        </figcaption>
                      )}
                    </figure>
                  ),

                  quote: ({ children }) => (
                    <blockquote className="border-l-4 border-white/30 pl-4 md:pl-6 py-1 md:py-2 my-4 md:my-8 italic text-white/70 text-lg md:text-xl">
                      {children}
                    </blockquote>
                  ),
                }}
                modifiers={{
                  bold: ({ children }) => (
                    <strong className="font-bold text-white">{children}</strong>
                  ),
                  italic: ({ children }) => (
                    <em className="italic text-white/90">{children}</em>
                  ),
                  underline: ({ children }) => (
                    <u className="underline">{children}</u>
                  ),
                  strikethrough: ({ children }) => (
                    <s className="line-through text-white/60">{children}</s>
                  ),
                  code: ({ children }) => (
                    <code className="bg-black/40 border border-white/20 rounded px-1.5 py-0.5 md:px-2 md:py-1 text-xs md:text-sm font-mono text-white/90">
                      {children}
                    </code>
                  ),
                }}
              />
            </div>
          </div>

          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-full flex items-center justify-center shrink-0">
                <User className="w-6 h-6 md:w-10 md:h-10 text-white/70" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  About {blog.author.name}
                </h3>
                <p className="text-white/70 text-base md:text-lg mb-4">{blog.author.bio}</p>
                <a
                  href={`/author/${blog.author.id}`}
                  className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors font-medium"
                >
                  View all stories
                  <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 rotate-180" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}