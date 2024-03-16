import { useState } from "react";

export default function Carousel() {
  const [activeImage, setActiveImage] = useState(1);

  return (
    <div>
      <div className="carousel">
        <ul className="carousel__slides">
          <input
            type="radio"
            name="radio-button"
            id="img-1"
            checked={activeImage === 1}
            readOnly
          />
          <li className="carousel__slide-container">
            <div className="carousel__slide-img">
              <img
                alt="scenery 1"
                src={process.env.PUBLIC_URL + "/image/first.jpg"}
              />
            </div>
            <div className="carousel__controls">
              <label
                onClick={() => setActiveImage(3)}
                className="carousel__slide-prev"
              >
                {/* &lsaquo; 엔터티 참조 : Html 태그와 충돌할 수 있어 사용하는 방법 (&lsaquo; : <) 모양 */}
                <span>&lsaquo;</span>
              </label>
              <label
                onClick={() => setActiveImage(2)}
                className="carousel__slide-next"
              >
                {/* &rsaquo; 엔터티 참조 : Html 태그와 충돌할 수 있어 사용하는 방법 (&lsaquo; : >) 모양 */}
                <span>&rsaquo;</span>
              </label>
            </div>
          </li>
          <input
            type="radio"
            name="radio-button"
            id="img-1"
            checked={activeImage === 2}
            readOnly
          />
          <li className="carousel__slide-container">
            <div className="carousel__slide-img">
              <img
                alt="scenery 2"
                src={process.env.PUBLIC_URL + "/image/second.jpg"}
              />
            </div>
            <div className="carousel__controls">
              <label
                onClick={() => setActiveImage(1)}
                className="carousel__slide-prev"
              >
                <span>&lsaquo;</span>
              </label>
              <label
                onClick={() => setActiveImage(3)}
                className="carousel__slide-next"
              >
                <span>&rsaquo;</span>
              </label>
            </div>
          </li>
          <input
            type="radio"
            name="radio-button"
            id="img-1"
            checked={activeImage === 3}
            readOnly
          />
          <li className="carousel__slide-container">
            <div className="carousel__slide-img">
              <img
                alt="scenery 3"
                src={process.env.PUBLIC_URL + "/image/third.jpg"}
              />
            </div>
            <div className="carousel__controls">
              <label
                onClick={() => setActiveImage(2)}
                className="carousel__slide-prev"
              >
                <span>&lsaquo;</span>
              </label>
              <label
                onClick={() => setActiveImage(1)}
                className="carousel__slide-next"
              >
                <span>&rsaquo;</span>
              </label>
            </div>
          </li>
          <div className="carousel__dots">
            <label
              onClick={() => setActiveImage(1)}
              className="carousel__dot"
              id="img-dot-1"
            />
            <label
              onClick={() => setActiveImage(2)}
              className="carousel__dot"
              id="img-dot-2"
            />
            <label
              onClick={() => setActiveImage(3)}
              className="carousel__dot"
              id="img-dot-3"
            />
          </div>
        </ul>
      </div>
    </div>
  );
}
