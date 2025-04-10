import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { BlogDetail as BlogDetailComponent } from '../components/blog/BlogDetail';
import { Post } from '../types';
import axiosInstance from '../api/axiosInstance';

export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const foundPost = await axiosInstance.get(`/posts/${id}`);
        
        if (foundPost.data) {
          setPost(foundPost.data);
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [id]);
  
  return (
    <Layout>
      {isLoading || !post ? (
        <BlogDetailComponent isLoading={true} post={{} as Post} />
      ) : (
        <BlogDetailComponent post={post} />
      )}
    </Layout>
  );
};