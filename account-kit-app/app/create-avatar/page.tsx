import "../globals.css";
import "../styles/character-creator.css";
import CharacterCreatorClient from "../components/CharacterCreatorClient";

export default function CreateAvatar() {
    const defaultImagePath = "/images/anon.png";

    return (
      <main className="items-center text-center justify-center">
        <h2 className="text-center text-5xl font-bold mb-10">Create your avatar</h2>
        <CharacterCreatorClient defaultImagePath={defaultImagePath} />
      </main>
    );
  }