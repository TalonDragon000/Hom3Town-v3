import "../globals.css";
import "../styles/character-creator.css";
import Login from "../login/page";
import CharacterCreatorClient from "../components/CharacterCreatorClient";
import { Avatar } from "../components/Avatar";

export default function CreateAvatar() {
    const defaultImagePath = "/images/annon.png";

    return (
      <main className="flex mt-10 flex-col items-center justify-center p-12">
        <nav className="nav-bar navbar-bg fixed top-0 inline-flex">
          <div className="nav-item-left font-bold"><a href="/">Hom3Town</a></div>
          <div className="nav-item-right mt-2">
            <Avatar 
              defaultImagePath={"/images/annon.png"} 
              size="small"
            />
          </div>
          <div className="nav-login"><Login /></div>
        </nav>
        <div className="text-center mt-5 p-4">
            <h2 className="text-center text-5xl font-bold mb-5">Create your avatar</h2>
        </div>
        <div className="container p-4 mb-20">
            <CharacterCreatorClient defaultImagePath={defaultImagePath} />
        </div>
        <div className="container-space"></div>
        <footer className="fixed bottom-0 left-0 right-0 mt-20">
          <div>&copy; 2024 Hom3Town. All rights reserved.</div>
        </footer>
      </main>
    );
  }