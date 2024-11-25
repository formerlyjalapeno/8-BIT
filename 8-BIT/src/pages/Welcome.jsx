import { Link } from "react-router-dom";

const Welcome = () => {
    return ( 
        <main className="welcome__Container">
            <section>
                <article className="welcome__Message">
                    <h1>WELCOME</h1>
                    <div className="double__Text">
                        <h2>TO</h2>
                        <div className="bit">
                            <h3>8-BIT</h3>
                            <span>8-BIT</span>
                        </div>
                    </div>
                </article>
            </section>
        </main>
     );
}
 
export default Welcome;