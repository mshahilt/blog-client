import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { BlogList } from '../components/blog/BlogList';
import { Post } from '../types';
import axiosInstance from '../api/axiosInstance';

export const MyBlogs: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/posts/my');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePostDeleted = (deletedPostId: string) => {
    console.log("handdle post inside my blogs worked : ", deletedPostId);
    setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
  };
  
  return (
    <Layout>
      <section className="bg-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Blog Posts</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your published articles and content.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-600">You haven't posted any blogs yet.</p>
          ) : (
            <BlogList 
              posts={posts} 
              isLoading={isLoading} 
              ownBlogs={true}
              onPostDeleted={handlePostDeleted}
            />
          )}
        </div>
      </section>
    </Layout>
  );
};