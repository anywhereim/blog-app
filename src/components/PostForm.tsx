import AuthContext from "context/AuthContext";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CATEGORIES, CategoryType, Posts } from "types/posts-types";

export default function PostForm() {
  const params = useParams();
  const [post, setPost] = useState<Posts | null>(null);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<CategoryType>("Frontend");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //useState 없이 아래처럼 작성하여 submit 가능
    //해당 컴포넌트에서는 수정과, 작성을 동시에 진행하기에 useState 필요
    // const formData = new FormData(e.currentTarget);
    // const title = formData.get("title") as string;
    // const summary = formData.get("summary") as string;
    // const content = formData.get("content") as string;

    //post가 있는 경우 해당 post 수정하여 firebase로 업데이트

    try {
      //post id 가 있다면 해당 post를 firebase에 없데이트
      if (post && post?.id) {
        const postRef = doc(db, "post", post?.id);
        await updateDoc(postRef, {
          title,
          summary,
          content,
          createAt: new Date()?.toLocaleString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
        toast?.success("게시글을 수정했습니다.");
        navigate(`/posts/${post.id}`);
      } else {
        //firebase로 데이터 업데이트
        await addDoc(collection(db, "post"), {
          title,
          summary,
          content,
          createAt: new Date()?.toLocaleString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
          category,
        });
        toast?.success(`게시글을 생성했습니다.`);
        navigate("/");
      }
    } catch (error: any) {
      console.log("failed to newPost");
      toast?.error(error.code);
    }
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {
      target: { name, value },
    } = e;

    if (name === "title") {
      setTitle(value);
    }

    if (name === "summary") {
      setSummary(value);
    }

    if (name === "content") {
      setContent(value);
    }

    if (name === "category") {
      setCategory(value as CategoryType);
    }
  };

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "post", id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap.data() as Posts), id: docSnap.id });
    }
  };

  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  //id를 이용해 수정 상태로 넘어왔을 때 값을 넣어 줄 수 있도록 세팅 해주는 역할
  useEffect(() => {
    if (post) {
      setTitle(post?.title);
      setSummary(post?.summary);
      setContent(post?.content);
      setCategory(post?.category as CategoryType);
    }
  }, [post]);

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form__block">
        <label htmlFor="title">제목</label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={title}
          onChange={onChange}
        />
        <label htmlFor="category">카테고리</label>
        <select
          name="category"
          id="category"
          defaultValue={category}
          value={category}
          onChange={onChange}
        >
          <option value="">카테고리를 선택해주세요</option>
          {CATEGORIES?.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="form__block">
        <label htmlFor="summary">요약</label>
        <input
          type="text"
          name="summary"
          id="summary"
          required
          value={summary}
          onChange={onChange}
        />
      </div>
      <div className="form__block">
        <label htmlFor="content">내용</label>
        <textarea
          name="content"
          id="content"
          required
          value={content}
          onChange={onChange}
        />
      </div>
      <div className="form__block">
        <input type="submit" value="제출" className="form__btn--submit" />
      </div>
    </form>
  );
}
