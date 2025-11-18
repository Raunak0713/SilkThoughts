"use client"

import { ArrowRight, BookOpen, TrendingUp, ChevronDown, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

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
  author: {
    id: number;
    name: string;
    bio?: string;
    avatar?: {
      url: string;
      alternativeText?: string;
      formats?: {
        thumbnail?: { url: string };
        small?: { url: string };
      };
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

interface CustomDropdownProps {
  options: { id: number; name: string; slug: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function CustomDropdown({ options, value, onChange, placeholder }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.slug === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="appearance-none px-6 py-3 pr-10 bg-white/5 backdrop-blur-md border border-white/20 text-white/70 rounded-full text-sm focus:outline-none focus:border-white/40 hover:bg-white/10 transition-all cursor-pointer w-48"
      >
        <span className={selectedOption ? 'text-white' : 'text-white/70'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50">
          <div className="max-h-60 overflow-y-auto">
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="w-full px-6 py-3 text-left text-white/70 hover:bg-white/10 transition-colors text-sm"
            >
              {placeholder}
            </button>
            {options.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.slug);
                  setIsOpen(false);
                }}
                className="w-full px-6 py-3 text-left text-white hover:bg-white/10 transition-colors text-sm"
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('http://localhost:1337/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []))
      .catch(err => console.error('Error fetching categories:', err));

    fetch('http://localhost:1337/api/tags')
      .then(res => res.json())
      .then(data => setTags(data.data || []))
      .catch(err => console.error('Error fetching tags:', err));

    fetch('http://localhost:1337/api/blogs?populate=*')
      .then(res => res.json())
      .then(data => setBlogs(data.data || []))
      .catch(err => console.error('Error fetching blogs:', err));

    fetch('http://localhost:1337/api/authors?populate=*')
      .then(res => res.json())
      .then(data => setAuthors(data.data || []))
      .catch(err => console.error('Error fetching authors:', err));
  }, []);

  const getAvatarUrl = (author: Author | Blog['author']) => {
    if (author?.avatar?.url) {
      return `http://localhost:1337${author.avatar.formats?.thumbnail?.url || author.avatar.formats?.small?.url || author.avatar.url}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name)}&background=ffffff&color=1e293b&size=128`;
  };

  const getAuthorById = (id : number) => {
    return authors.find(author => author.id === id)
  }

  const filteredBlogs = blogs.filter(blog => {
    const categoryMatch = !selectedCategory || blog.category.slug === selectedCategory;
    const tagMatch = !selectedTag || blog.tags.some(tag => tag.slug === selectedTag);
    return categoryMatch && tagMatch;
  });

  return (
    <div className="relative min-h-screen">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'py-4' 
          : 'py-6'
      }`}>
        <div className={`mx-auto transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'max-w-4xl px-6 py-3 backdrop-blur-md rounded-full shadow-2xl shadow-black/10' 
            : 'max-w-7xl px-8'
        } flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">SilkThoughts</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#" className="text-white/80 hover:text-white transition-colors">Stories</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Authors</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Categories</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
          </div>

          <button className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all shadow-lg">
            Start Reading
          </button>
        </div>
      </nav>

      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-sm text-white/90">Where Ideas Flow Like Silk</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter mb-6 leading-none">
            Silk
            <span className="block text-white/90">
              Thoughts
            </span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mb-12 leading-relaxed font-light">
            Discover blogs that glide through your mind with elegance. 
            A curated collection of thoughts worth reading.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="group px-8 py-4 bg-white text-slate-900 rounded-full text-lg font-medium hover:bg-white/90 transition-all shadow-2xl shadow-black/20 flex items-center gap-2 justify-center">
              Explore Stories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full text-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2 justify-center">
              <BookOpen className="w-5 h-5" />
              Latest Posts
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 pb-24">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Curated Narratives
            </h2>
            <p className="text-white/60 text-lg mb-8">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'} that resonate
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <CustomDropdown
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="All Categories"
              />
              <CustomDropdown
                options={tags}
                value={selectedTag}
                onChange={setSelectedTag}
                placeholder="All Tags"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map(blog => (
              <div
                key={blog.id}
                onClick={() => router.push(`blog/${blog.id}`)}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`http://localhost:1337${blog.cover.formats?.small?.url || blog.cover.url}`}
                    alt={blog.cover.alternativeText}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors flex-1">
                      {blog.title.split(' ').slice(0, 2).join(' ')}
                      {blog.title.split(' ').length > 2 ? '...' : ''}
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
                      {blog.tags.slice(0, 1).map(tag => (
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
                        src={getAvatarUrl(getAuthorById(blog.author.id)!)}
                        alt={blog.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-white/70 text-sm">{blog.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/50" />
                      <span className="text-white/70 text-sm">
                        {new Date(blog.published).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-white/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Stories Found</h3>
              <p className="text-white/60">Try adjusting your filters to discover more content</p>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-8 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Meet Our Authors
            </h2>
            <p className="text-white/60 text-lg">
              The voices behind the stories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authors.map(author => (
              <div
                key={author.id}
                onClick={() => router.push(`/author/${author.id}`)}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={getAvatarUrl(author)}
                    alt={author.name}
                    className="shrink-0 w-16 h-16 rounded-full border-2 border-white/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
                      {author.name}
                    </h3>
                    <p className="text-white/60 text-sm mb-2">{author.email}</p>
                    <p className="text-white/70 text-sm line-clamp-2">{author.bio}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}