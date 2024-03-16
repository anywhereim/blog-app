//레이아웃 관련한 postdetail은 컴포넌트를 따로 분리해서 작성

import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Posts } from "types/posts-types";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
import Loader from "./Loader";
import Comments from "./Comments";

export default function PostDetail() {
  const [post, setPost] = useState<Posts | null>(null);
  const params = useParams();
  const postId = post?.id;
  const navigate = useNavigate();

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "post", id);
      const docSnap = await getDoc(docRef);
      setPost({ id: docSnap.id, ...(docSnap.data() as Posts) });
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm && post && postId) {
      await deleteDoc(doc(db, "post", postId));
      toast.success("게시글을 삭제했습니다.");
      navigate("/");
    }
  };

  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  return (
    <>
      <Header />
      <div className="post__detail">
        {post ? (
          <>
            <div className="post__box">
              <div className="post__title">{post?.title}</div>
              <div className="post__profile-box">
                <div className="post__profile" />
                <div className="post__author-name">{post?.email}</div>
                <div className="post__date">{post?.createAt}</div>
              </div>
              <div className="post__utils-box">
                {post?.category && (
                  <div className="post__category">{post?.category}</div>
                )}
                <div className="post__delete" onClick={handleDelete}>
                  삭제
                </div>
                <div>
                  <Link to={`/posts/edit/${postId}`} className="post__edit">
                    수정
                  </Link>
                </div>
              </div>
              <div className="post__text post__text--pre-wrap">
                {post?.content}
              </div>
            </div>
            <Comments post={post} getPost={getPost} />
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
