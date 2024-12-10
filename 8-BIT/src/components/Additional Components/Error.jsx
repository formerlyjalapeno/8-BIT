import { forwardRef } from "react";

const Error = forwardRef(({ onClick }, ref) => {
  return (
    <>
      <section className="error__box error__box__invisible" ref={ref}>
        <img className="error__box__image" src="/warning.png" alt="" />
        <article className="error__box__container">
          <p className="error__box__container__text">
            an error occured, <br /> please try again later.
          </p>
        </article>
        <img
          className="error__box__close-button"
          onClick={onClick}
          src="/close-button.svg"
        ></img>
      </section>
    </>
  );
});

export default Error;
