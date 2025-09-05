import { notFound } from &apo:next/navigation&apo:;
import Image from &apo:next/image&apo:;
import { format } from &apo:date-fns&apo:;
import ShareButtons from &apo:@/components/ShareButtons&apo:;
import ReadingProgressBar from &apo:@/components/ReadingProgressBar&apo:;
import Link from &apo:next/link&apo:;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getPost(slug) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/blog/${slug}/`, { cache: &apo:no-store&apo: });
        if (!res.ok && res.status === 404) return null;
        if (!res.ok) throw new Error(&apo:Failed to fetch post&apo:);
        return res.json();
    } catch (error) {
        console.error("Fetch error for blog post:", error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const post = await getPost(params.slug);
    if (!post) {
        return { title: &apo:Post Not Found&apo: };
    }
    return {
        title: `${post.title} | Ronohs Decor Blog`,
        description: post.meta_description || post.excerpt,
    };
}

export default async function BlogPostPage({ params }) {
    const { slug } = params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            <ReadingProgressBar />
            <div className="bg-white py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        {post.category && (
                            <Link href={`/blog/category/${post.category.slug}`} className="text-base font-semibold text-indigo-600 uppercase tracking-wider hover:underline">
                                {post.category.name}
                            </Link>
                        )}
                        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 font-serif tracking-tight sm:text-5xl">
                            {post.title}
                        </h1>
                        <div className="mt-6 flex justify-center items-center space-x-4 text-gray-500">
                            <span>By {post.author.name}</span>
                            <span>•</span>
                            <time dateTime={post.published_date}>
                                {format(new Date(post.published_date), &apo:MMMM d, yyyy&apo:)}
                            </time>
                        </div>
                    </div>

                    {post.featured_image && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-12">
                            <Image
                                src={post.featured_image}
                                alt={post.image_caption || post.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 896px"
                            />
                        </div>
                    )}

                    <div className="prose prose-indigo lg:prose-xl mx-auto">
                        <p className="lead">{post.excerpt}</p>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-200">
                        <ShareButtons title={post.title} url={`/blog/${post.slug}`} />
                    </div>
                </div>
            </div>
        </>
    );
}