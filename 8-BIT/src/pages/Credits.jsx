import { Link } from "react-router-dom";

const More = () => {
  return (
    <main className="more__Container">
      <div className="creators__Text">
        <h1>CREATORS</h1>
        <p>made by yours truly,</p>
      </div>
      <section className="creators__section">
        <article className="creator">
          <div className="nova">
            <h3>@NOVA</h3>
            <span>@NOVA</span>
          </div>
          <div className="socials">
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
        </article>
        <div className="separation__line"></div>
        <article className="creator">
          <div className="sovz">
            <h3>@SOVZ</h3>
            <span>@SOVZ</span>
          </div>
          <div className="socials">
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
        </article>
      </section>
      <section className="credits__Container">
        <h2>CREDITS</h2>
        <article className="music__Credits">
          <h3>MUSIC</h3>
          <div className="music__Container">
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
          </div>
        </article>
        <article className="art__Credits">
          <h3>ART</h3>
          <div className="art__Container">
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
            <p>Lorem</p>
          </div>
        </article>
      </section>
      <div className="copyright__Text">
        <p>All rights reserved.</p>
        <p>© 8BIT</p>
      </div>
      <Link to="/welcome" style={{ textDecoration: "none" }}>
        <div className="back__Button">
          <h4>BACK</h4>
          <span>BACK</span>
        </div>
      </Link>
    </main>
  );
}

export default More;