import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Blogs } from './pages/Blogs';
import { BlogDetail } from './pages/BlogDetail';
import { Toaster } from 'sonner';
import { AddPost } from './pages/AddBlog';
import { MyBlogs } from './pages/MyBlogs';
import EditBlog from './pages/EditBlog';

const App: React.FC = () => {
  return (
    <>
    <Toaster theme='light'/>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-post" element={<AddPost />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
          <Route path="/edit-blog/:postId" element={<EditBlog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
    </>
  );
};

export default App;