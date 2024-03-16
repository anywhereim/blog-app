import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const { user } = useContext(AuthContext);

  const onSingout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("로그아웃 되었습니다.");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };

  return (
    <div className="profile__box">
      <div className="flex__box-lg">
        <div className="profile__image" />
        <div>
          <div className="profile__email">{user?.email}</div>
          <div className="profile__name">{user?.displayName || "사용자"}</div>
        </div>
      </div>
      <Link to="/" className="profile__logout" onClick={onSingout}>
        로그아웃
      </Link>
    </div>
  );
}
