import { Link } from "react-router-dom";

const Welcome = () => {
    return (
        <main className="welcome__Container">
                <article className="welcome__Message">
                    <div className="home">
                        <h1>WELCOME</h1>
                        <span>WELCOME</span>
                    </div>
                    <div className="double__Text">
                        <div className="to">
                            <h2>TO</h2>
                            <span>TO</span>
                        </div>
                        <div className="bit">
                            <h3>8-BIT</h3>
                            <span>8-BIT</span>
                        </div>
                    </div>
                </article>
                <article className="play__Buttons">
                    <h4 className="pink__Gradient">EXIT</h4>
                    <div className="separation__line"></div>
                    <h4 className="blue__Gradient">PLAY</h4>
                </article>
        </main>
    );
}

export default Welcome;