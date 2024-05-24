import GameInterface from "../components/GameInterface";
import '../index.css';
import Durov from "../components/Durov";
import GameAudioComponent from "../components/Audio";

const Main = () => {
    return (
        <div className="h-screen">
            <GameAudioComponent />
            <GameInterface />
            <Durov />
        </div>
    );
}

export default Main;