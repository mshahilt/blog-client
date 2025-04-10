import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { BlogList } from '../components/blog/BlogList';
import { Post } from '../types';
import axiosInstance from '../api/axiosInstance';

export const Blogs: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <Layout>
      <section className="bg-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">All Blog Posts</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of articles on web development, design, and more.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogList posts={posts} isLoading={isLoading} ownBlogs={false}/>
        </div>
      </section>
    </Layout>
  );
};