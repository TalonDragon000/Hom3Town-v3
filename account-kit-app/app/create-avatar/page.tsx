import "../globals.css";
import "../styles/character-creator.css";
import Login from "../login/page";
import CharacterCreatorClient from "../components/CharacterCreatorClient";
import { Avatar } from "../components/Avatar";

export default function CreateAvatar() {
    const defaultImagePath = "/images/annon.png";

    return (
      <main className="page-container">

      <nav className="nav-bar fixed top-0 inline-flex">
        <div className="nav-item-left font-bold"><a href="/">Hom3Town</a></div>
        <div className="nav-item-right mt-2">
            <Avatar 
              defaultImagePath={"/images/annon.png"} 
              size="small"
            />
        </div>
        <div><Login /></div>
      </nav>

        <div className="content-container">
          <center><h1 className="title-large">Create your avatar</h1></center>
          <div className="flex justify-center w-full mx-auto">
            <CharacterCreatorClient defaultImagePath={defaultImagePath} />
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 right-0">
        <div>&copy; 2024 Hom3Town. All rights reserved.</div>
      </footer>

      </main>
    );
}