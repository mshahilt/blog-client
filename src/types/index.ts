export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export interface Post {
    _id: string;
    title: string;
    content: string;
    author: User;
    image: string;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
  