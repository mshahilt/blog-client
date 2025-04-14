import React, { useState } from 'react';
import { Post } from '../../types';
import { BlogCard } from './BlogCard';
import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

interface BlogListProps {
  posts: Post[];
  isLoading?: boolean;
  ownBlogs?: boolean;
  onPostDeleted?: (deletedPostId: string) => void;
}

export const BlogList: React.FC<BlogListProps> = ({ 
  posts, 
  isLoading = false, 
  ownBlogs = false,
  onPostDeleted 
}) => {
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  
  const handleDeleteClick = (postId: string) => {
    setDeletingPostId(postId);
    setShowConfirmation(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!deletingPostId) return;
    
    try {
      await axiosInstance.delete(`/posts/${deletingPostId}`);
      if (onPostDeleted) {
        console.log("response :", onPostDeleted);
        onPostDeleted(deletingPostId);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setShowConfirmation(false);
      setDeletingPostId(null);
    }
  };
  
  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setDeletingPostId(null);
  };

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
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post._id} className="relative">
            {ownBlogs && (
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <Link 
                  to={`/edit-blog/${post._id}`} 
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  title="Edit blog post"
                >
                  <Edit size={18} className="text-blue-600" />
                </Link>
                <button
                  onClick={() => handleDeleteClick(post._id)}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  title="Delete blog post"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            )}
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};