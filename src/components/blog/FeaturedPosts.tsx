import React from 'react';
import { Post } from '../../types';
import { BlogCard } from './BlogCard';

interface FeaturedPostsProps {
  posts: Post[];
}

export const FeaturedPosts: React.FC<FeaturedPostsProps> = ({ posts }) => {
  const featuredPosts = posts.slice(0, 3);
  
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Posts</h2>
          <p className="mt-4 text-lg text-gray-600">Discover our most popular blog posts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPosts.map(post => (
            <div key={post._id} className="h-full">
              <BlogCard post={post} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};