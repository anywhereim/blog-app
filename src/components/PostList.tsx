import AuthContext from "context/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Posts } from "types/posts-types";

interface PostListProps {
  hasNavigation?: boolean;
  defaultTab?: TabType;
}

type TabType = "all" | "my";

export default function PostList({
  hasNavigation = true,
  defaultTab = "all",
}: PostListProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [posts, setPosts] = useState<Posts[]>([]);
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    setPosts([]);
    let postRef = collection(db, "post");
    let postsQuery;

    if (activeTab === "my") {
      //나의글만 필터링
      postsQuery = query(
        postRef,
        //firebase에서 주는 메서드로 uid가 같은 값만 필터링 할 수 있음
        where("uid", "==", user?.uid),
        //firebase에서 주는 매서드로 오름차순&내림차순 정렬을 줄 수 있음.
        orderBy("createAt", "asc")
      );
    } else {
      //전체글
      postsQuery = query(postRef, orderBy("createAt", "asc"));
    }

    const datas = await getDocs(postsQuery);
    datas?.forEach((doc) => {
      const dataObj = { ...doc.data(), id: doc.id };
      setPosts((prev) => [...prev, dataObj as Posts]);
    });
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm && id) {
      await deleteDoc(doc(db, "post", id));

      toast.success("게시글을 삭제했습니다.");
      getPosts();
    }
  };

  useEffect(() => {
    getPosts();
  }, [activeTab]);

  return (
    <>
      {hasNavigation && (
        <div className="post__navigation">
          <div
            role="presentation"
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "post__navigation--active" : ""}
          >
            전체
          </div>
          <div
            role="presentation"
            onClick={() => setActiveTab("my")}
            className={activeTab === "my" ? "post__navigation--active" : ""}
          >
            나의 글
          </div>
        </div>
      )}
      <div className="post__list">
        {posts?.length > 0 ? (
          posts?.map((post) => (
            <div key={post?.id} className="post__box">
              <Link to={`/posts/${post?.id}`}>
                <div className="post__profile-box">
                  <div className="post__profile" />
                  <div className="post__author-name">{post?.email}</div>
                  <div className="post__date">{post?.createAt}</div>
                </div>
                <div className="post__title">{post?.title}</div>
                <div className="post__text">{post?.summary}</div>
              </Link>
              {post?.email === user?.email && (
                <div className="post__utils-box">
                  <Link to={`/posts/edit/${post?.id}`} className="post__edit">
                    수정
                  </Link>
                  <div
                    className="post__delete"
                    role="presentation"
                    onClick={() => handleDelete(post?.id as string)}
                  >
                    삭제
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="post__no-post">게시글이 없습니다.</div>
        )}
      </div>
    </>
  );
}
