//레이아웃 관련한 postdetail은 컴포넌트를 따로 분리해서 작성

import { Link, useParams } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Posts } from "types/posts-types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";

export default function PostDetail() {
  const [post, setPost] = useState<Posts | null>(null);
  const params = useParams();

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "post", id);
      const docSnap = await getDoc(docRef);
      setPost({ id: docSnap.id, ...(docSnap.data() as Posts) });
    }
  };

  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  return (
    <>
      <Header />
      <div className="post__detail">
        <div className="post__box">
          <div className="post__title">{post?.title}</div>
          <div className="post__profile-box">
            <div className="post__profile" />
            <div className="post__author-name">{post?.email}</div>
            <div className="post__date">{post?.createAt}</div>
          </div>
          <div className="post__utils-box">
            <div className="post__delete">삭제</div>
            <div>
              <Link to={`/posts/edit/${post?.id}`} className="post__edit">
                수정
              </Link>
            </div>
          </div>
          <div className="post__text post__text--pre-wrap">{post?.content}</div>
        </div>
      </div>
    </>
  );
}
