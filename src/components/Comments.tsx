import AuthContext from "context/AuthContext";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { CommentsType } from "types/comments-type";
import { Posts } from "types/posts-types";

interface CommentsProps {
  post: Posts;
  getPost: (id: string) => Promise<void>;
}

export default function Comments({ post, getPost }: CommentsProps) {
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const postComments = post.comments;

  console.log(post);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "comment") {
      setComment(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post && post?.id) {
        const postRef = doc(db, "post", post.id);

        if (user?.uid) {
          const commentObj = {
            content: comment,
            uid: user.uid,
            email: user.email,
            createAt: new Date()?.toLocaleString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          };
          await updateDoc(postRef, {
            comments: arrayUnion(commentObj),
            updateDated: new Date()?.toLocaleString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          });
          //댓글 삭제 시
          await getPost(post.id);
        }
      }
      toast.success("댓글을 생성하였습니다.");
      setComment("");
    } catch (error: any) {
      toast.error(error.code);
    }
  };

  const handleDeleteComment = async (comment: CommentsType) => {
    const confirm = window.confirm("해당 댓글을 삭제하시겠습니까?");
    if (confirm && post.id) {
      const postRef = doc(db, "post", post.id);
      await updateDoc(postRef, {
        comments: arrayRemove(comment),
      });
      toast.success("댓글을 삭제했습니다.");
      await getPost(post.id);
    }
  };

  return (
    <div className="comments">
      <form className="comments__form" onSubmit={onSubmit}>
        <div className="form__block">
          <label htmlFor="comment">댓글 입력</label>
          <textarea
            name="comment"
            id="comment"
            required
            value={comment}
            onChange={onChange}
          />
        </div>
        <div className="form__block form__block-reverse">
          <input type="submit" value="입력" className="form__btn--submit" />
        </div>
      </form>
      <div className="comment__list">
        {postComments
          //postComments를 바로 reverse하면 원본 배열의 순서가 변경되게 됨으로
          //reverse를 바로 사용할 수 없다. 때문에
          //slice를 사용해 0번째 인덱스부터 끝까지 얕은 복사 후 reverse를 사용해주었다.
          ?.slice(0)
          ?.reverse()
          .map((comment) => (
            <div key={comment.createAt} className="comment__box">
              <div className="comment__profile-box">
                <div className="comment__email">{comment.email}</div>
                <div className="comment__date">{comment.createAt}</div>
                {comment.uid === user?.uid && (
                  <div
                    className="comment__delete"
                    onClick={() => handleDeleteComment(comment)}
                  >
                    삭제
                  </div>
                )}
              </div>
              <div className="comment__text">{comment?.content}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
