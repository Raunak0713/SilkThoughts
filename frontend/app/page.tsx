"use client"

import { ArrowRight, BookOpen, TrendingUp, ChevronDown } from 'lucide-react';
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
  }, []);

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
            Discover stories that glide through your mind with elegance. 
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
      </div>
    </div>
  );
}