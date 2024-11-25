import { Link } from "react-router-dom";

const Welcome = () => {
    return ( 
        <main className="welcome__Container">
            <Link className="welcome__Message__remove-underline" to="start">
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
            </Link>
        </main>
     );
}
 
export default Welcome;