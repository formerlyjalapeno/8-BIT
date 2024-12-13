import { Link } from "react-router-dom";

const More = () => {
  return (
    <main className="credits">
      <div className="credits__header">
        <h1>CREATORS</h1>
        <p>made by yours truly,</p>
      </div>
      <section className="credits__section">
        <article className="credits__section__creators">
          <div className="credits__section__creators__nova">
            <h3>@NOVA</h3>
          </div>
          <div className="credits__section__creators__nova__socials">
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
        </article>
        <div className="credits__section__creators__separation-line"></div>
        <article className="credits__section__creators">
          <div className="credits__section__creators__sovz">
            <h3>@SOVZ</h3>
          </div>
          <div className="credits__section__creators__sovz__socials">
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
        </article>
      </section>
      <section className="credits__second-section">
        <h2>CREDITS</h2>
        <article className="credits__second-section__music-credits">
          <h3>MUSIC</h3>
          <div className="credits__second-section__music-credits__text">
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
          </div>
        </article>
        <article className="credits__second-section__art-credits">
          <h3>ART</h3>
          <div className="credits__second-section__art-credits__text">
            <p>@Sovz</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
          </div>
        </article>
      </section>
      <div className="credits__copyright-text">
        <p>All rights reserved.</p>
        <p>© 8BIT</p>
      </div>
      <div className="credits__back-button">
        <Link to="/welcome" style={{ textDecoration: "none" }}>
          <h4>BACK</h4>
        </Link>
      </div>
    </main>
  );
};

export default More;
