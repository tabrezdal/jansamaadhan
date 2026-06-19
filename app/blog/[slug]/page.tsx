import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from '@/lib/blog'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — JanSamaadhan Blog`,
    description: post.excerpt,
  }
}

// Tiny content renderer for the simple "## heading" / "- bullet" / plain paragraph
// blocks used in lib/blog.ts — intentionally minimal, no markdown library needed.
function PostBody({ content }: { content: string[] }) {
  return (
    <div className="legal-doc">
      {content.map((block, i) => {
        if (block.startsWith('## ')) {
          return <h2 key={i}>{block.slice(3)}</h2>
        }
        if (block.startsWith('- ')) {
          // Group consecutive bullet lines isn't needed here since each block
          // is already a single bullet — render each as its own <li> inside a <ul>
          return (
            <ul key={i} className="!mb-2">
              <li>{block.slice(2)}</li>
            </ul>
          )
        }
        return <p key={i}>{block}</p>
      })}
    </div>
  )
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const related = getRelatedPosts(post.slug)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC] pt-16">

        {/* Cover header */}
        <div className={`bg-gradient-to-br ${post.coverColor} py-14 sm:py-20 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs mb-6 transition-colors group">
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Blog
            </Link>
            <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm mb-4">
              {post.category}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-xs">
              <span className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                  {post.author.replace('CA ', '').charAt(0)}
                </div>
                {post.author} · {post.authorRole}
              </span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PostBody content={post.content} />

          {/* Author footer */}
          <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              {post.author.replace('CA ', '').charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{post.author}</p>
              <p className="text-xs text-gray-400">{post.authorRole} · JanSamaadhan</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-2xl bg-brand-surface border border-brand-teal/10 p-6 text-center">
            <p className="text-sm font-semibold text-brand-teal mb-1.5">Need help with this yourself?</p>
            <p className="text-xs text-gray-500 mb-4">Get matched with a verified CA and have it handled in hours, not weeks.</p>
            <Link href="/services" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-teal text-white text-sm font-semibold rounded-xl hover:bg-brand-teal2 transition-all">
              Browse Services →
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="font-semibold text-gray-800 text-sm mb-4">Related articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(r => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-brand-teal/30 hover:shadow-sm transition-all flex items-start gap-3"
                  >
                    <span className="text-xl flex-shrink-0">{r.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 leading-snug mb-1">{r.title}</p>
                      <p className="text-[11px] text-gray-400">{r.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
