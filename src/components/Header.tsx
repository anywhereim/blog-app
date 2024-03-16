import { Link } from "react-router-dom";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { useContext } from "react";
import ThemeContext from "context/ThemeContext";

export default function Header() {
  const context = useContext(ThemeContext);

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        React Blog
      </Link>
      <div>
        <>
          {context.theme === "light" ? (
            <MdOutlineLightMode
              onClick={context.toggleMode}
              className="header__theme-btn-light"
            />
          ) : (
            <MdOutlineDarkMode
              onClick={context.toggleMode}
              className="header__theme-btn-dark"
            />
          )}
        </>

        <Link to="/posts/new">글쓰기</Link>
        <Link to="/posts">게시글</Link>
        <Link to="/profile">프로필</Link>
      </div>
    </header>
  );
}
