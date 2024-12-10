import Inventory from "../components/Inventory Components/Inventory";

const Room = () => {
    return ( 
        <main className="room__Container">
            <p>this is a room</p>
            <button>item button</button>
            <button>item 2 button</button>
            <Inventory/>
        </main>
     );
}
 
export default Room;