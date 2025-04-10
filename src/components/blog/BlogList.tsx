import React from 'react';
import { Post } from '../../types';
import { BlogCard } from './BlogCard';
import { Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogListProps {
  posts: Post[];
  isLoading?: boolean;
  ownBlogs?: boolean;
}

export const BlogList: React.FC<BlogListProps> = ({ posts, isLoading = false, ownBlogs=false }) => {
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gray-200 h-48 rounded"></div>
                <div className="p-6 md:w-2/3">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-4">No posts found</h3>
        <p className="text-gray-600">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post._id} className="relative">
            {ownBlogs && (
              <Link 
                to={`/edit-blog/${post._id}`} 
                className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                title="Edit blog post"
              >
                <Edit size={18} className="text-blue-600" />
              </Link>
            )}
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};