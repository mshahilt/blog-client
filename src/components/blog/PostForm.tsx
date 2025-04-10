import React, { useEffect, useState } from 'react';
import { Layout } from '../layout/Layout';
import { Button } from '../ui/Button';
import TextEditor from '../textEditor/TextEditor';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { Category,Post } from '../../types';
interface PostFormProps {
  mode: 'create' | 'edit';
  initialData?: Post;
  postId?: string;
}

export const PostForm: React.FC<PostFormProps> = ({ mode = 'create', initialData, postId}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(mode === 'edit' && !initialData);

  useEffect(() => {
    const fetchPostData = async () => {
        console.log("postId : ", postId);
      if (mode === 'edit' && !initialData) {
        try {
          setIsLoading(true);
          const response = await axiosInstance.get(`/posts/${postId}`);
          const postData = response.data;
          
          setTitle(postData.title);
          setContent(postData.content);
          setCategory(postData.category);
          setImagePreview(postData.image);
        } catch (error) {
          console.error('Error fetching post data:', error);
          setError('Failed to load post data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchPostData();
  }, [mode, initialData, postId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        console.log('Fetched categories:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please refresh the page.');
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'add-new') {
      setIsAddingNew(true);
      setCategory('');
    } else {
      setIsAddingNew(false);
      setCategory(value);
    }
  };

  const handleNewCategorySubmit = async () => {
    if (!newCategory.trim()) return;
    
    try {
      const response = await axiosInstance.post('/categories', { name: newCategory.trim() });
      console.log('Added category:', response.data);
      setCategories(prev => [...prev, response.data]);
      setCategory(response.data._id);
      setNewCategory('');
      setIsAddingNew(false);
    } catch (error: any) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      let imageUrl = imagePreview;
      
      if (image) {
        try {
          const signatureResponse = await axiosInstance.get("/posts/cloudinary-sign");
          const { signature, timestamp, upload_url, api_key } = signatureResponse.data;
          
          if (!signature || !timestamp || !upload_url || !api_key) {
            throw new Error("Invalid upload credentials received");
          }
          
          const cloudinaryData = new FormData();
          cloudinaryData.append('file', image);
          cloudinaryData.append('signature', signature);
          cloudinaryData.append('timestamp', timestamp);
          cloudinaryData.append('api_key', api_key);

          const uploadResponse = await fetch(upload_url, {
            method: 'POST',
            body: cloudinaryData
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image to Cloudinary');
          }
          
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.secure_url;
          
          console.log('Image uploaded to Cloudinary:', imageUrl);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          setError('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
      
      const postData = {
        author: user?._id,
        title: title,
        content: content,
        category: category,
        image: imageUrl
      };
      
      let response;
      
      if (mode === 'edit' && postId) {
        response = await axiosInstance.put(`/posts/${postId}`, postData);
        toast.success('Post updated successfully!');
      } else {
        response = await axiosInstance.post('/posts', postData);
        toast.success('Post published successfully!');
      }
      
      console.log(`Post ${mode === 'edit' ? 'updated' : 'created'}:`, response.data);
      navigate('/');
    } catch (err) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'publishing'} post:`, err);
      setError(`Failed to ${mode === 'edit' ? 'update' : 'publish'} post. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = mode === 'edit' ? 'Edit Post' : 'Create New Post';
  const submitButtonText = isSubmitting 
    ? (mode === 'edit' ? 'Updating...' : 'Publishing...') 
    : (mode === 'edit' ? 'Update Post' : 'Publish Post');
  
  if (isLoading) {
    return (
      <Layout>
        <div className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <p className="text-gray-600">Loading post data...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>

                <select
                  id="category"
                  value={isAddingNew ? 'add-new' : typeof category === 'string' ? category : category._id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="add-new">Add New Category</option>
                </select>

                {isAddingNew && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={handleNewCategorySubmit}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="mb-4 w-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 rounded-md mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500">
                        Drag and drop an image, or{" "}
                        <label
                          htmlFor="image-upload"
                          className="text-teal-600 hover:text-teal-800 cursor-pointer"
                        >
                          browse
                        </label>
                      </p>
                    </>
                  )}
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Recommended: 1200 × 630 pixels (16:9 ratio)
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content*
                </label>
                <TextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your post content here..."
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-teal-700 border-teal-300 hover:bg-teal-50"
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-700 hover:bg-teal-800 text-white"
                    disabled={isSubmitting}
                  >
                    {submitButtonText}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};