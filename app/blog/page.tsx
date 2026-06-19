'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowRight, Clock } from 'lucide-react'
import { BLOG_POSTS, type BlogPost } from '@/lib/blog'

const CATEGORIES: (BlogPost['category'] | 'All')[] = ['All', 'Income Tax', 'GST', 'Identity', 'Guides']

export default function BlogIndexPage() {
  const [activeCat, setActiveCat] = useState<typeof CATEGORIES[number]>('All')

  const filtered = activeCat === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === activeCat)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC] pt-16">

        {/* Hero */}
        <div className="bg-brand-teal py-14 sm:py-18 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              The JanSamaadhan Blog
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto">
              Plain-language guides on tax filing, GST, identity documents, and government compliance — written by our verified CAs.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all
                  ${activeCat === cat
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-teal/40'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">No posts in this category yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-brand-teal/30 hover:shadow-md transition-all group flex flex-col"
                >
                  {/* Cover */}
                  <div className={`h-28 bg-gradient-to-br ${post.coverColor} flex items-center justify-center relative`}>
                    <span className="text-4xl">{post.emoji}</span>
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-semibold text-sm text-gray-800 leading-snug mb-2 group-hover:text-brand-teal transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{post.excerpt}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Clock size={11} /> {post.readTime}
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-brand-teal group-hover:underline">
                        Read <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
