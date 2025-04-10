import { useParams } from "react-router-dom";
import { PostForm } from "../components/blog/PostForm"

const EditBlog = () => {
    const { postId } = useParams<{ postId: string }>();
    
  return (
    <div>
      <PostForm mode="edit" postId={postId}/>
    </div>
  )
}

export default EditBlog
