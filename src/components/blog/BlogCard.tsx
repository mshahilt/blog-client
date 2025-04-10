import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { Card } from '../ui/Card';

interface BlogCardProps {
  post: Post;
  variant?: 'compact' | 'full';
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, variant = 'full' }) => {
  if (variant === 'compact') {
    return (
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <Link to={`/blog/${post._id}`}>
          <div className="h-40 overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{post.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{formatDate(post.createdAt)}</p>
            <div 
              className="text-gray-600 mb-4 line-clamp-3" 
              dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }} 
            />
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
      <Link to={`/blog/${post._id}`}>
        <div className="md:flex">
          <div className="md:w-1/3 h-48 md:h-auto">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="p-6 md:w-2/3">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-3">
              By {post.author.name} • {formatDate(post.createdAt)}
            </p>
            <div 
              className="text-gray-600 mb-4 line-clamp-3" 
              dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }} 
            />
            <div className="flex justify-end">
              <span className="text-indigo-600 font-medium hover:text-indigo-800">
                Read more →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
