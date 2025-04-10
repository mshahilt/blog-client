import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { FeaturedPosts } from '../components/blog/FeaturedPosts';
import { BlogList } from '../components/blog/BlogList';
import { Button } from '../components/ui/Button';
import { Post } from '../types';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axiosInstance';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthenticated, user } = useAuth();
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
  
  const renderAuthButtons = () => {
    if (isAuthenticated && user) {
      return (
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/blogs">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-700">
              Explore Blogs
            </Button>
          </Link>
          <Link to="/create-post">
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-700">
              Create Post
            </Button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/blogs">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-700">
              Explore Blogs
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        </div>
      );
    }
  };

  const renderCTA = () => {
    if (!isAuthenticated) {
      return (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white md:text-3xl">Ready to start sharing your ideas?</h2>
                  <p className="mt-4 text-teal-100 max-w-xl">
                    Join our community of writers and readers. Create an account to start publishing your own stories.
                  </p>
                </div>
                <div className="mt-8 md:mt-0 md:ml-8">
                  <Link to="/signup">
                    <Button size="lg" className="bg-white text-teal-700 hover:bg-gray-100 shadow-md">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return null;
  };
  
  return (
    <Layout>
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to BlogSpace</h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover stories, thoughts, and insights from writers on any topic.
            </p>
            {renderAuthButtons()}
          </div>
        </div>
      </section>
      
      {isLoading ? (
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <FeaturedPosts posts={posts} />
      )}
      
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
            <Link to="/blogs" className="text-teal-600 hover:text-teal-800 font-medium">
              View all →
            </Link>
          </div>
          
          <BlogList posts={posts.slice(0, 3)} isLoading={isLoading} />
        </div>
      </section>
      {renderCTA()}
    </Layout>
  );
};