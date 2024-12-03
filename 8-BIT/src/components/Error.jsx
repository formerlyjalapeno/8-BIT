import { forwardRef } from 'react';

const Error = forwardRef(({ onClick }, ref) => {
  return (
    <>
      <section className="Error__Box Error__Box__Invisible" ref={ref}>
        <img className="Error__Box__Image" src="/warning.png" alt="" />
        <article className="Error__Box__Container">
          <p className="Error__Box__Container__Text">
          an error occured, <br/> please try again later.
          </p>
        </article>
        <img className="Error__Box__Close-button" onClick={onClick} src="/close-button.svg"></img>
      </section>
    </>
  );
});

export default Error;
