import "./globals.css";
import Login from "./login/page";
import PlayNowButton from './components/PlayNowButton';
import { Avatar } from "./components/Avatar";

export default function () {
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
    
      <div className="flex flex-col items-center justify-center flex-grow text-center max-w-5xl mx-auto mt-32">
        <center><h1 className="text-6xl font-bold mb-10">Welcome to Hom3Town!</h1>
        <h3 className="mb-8">
          Your home in the metaverse
        </h3>
        <div className="mb-12">
          <PlayNowButton />
        </div></center>
        <div className="card-grid">
          <div className="card col-1 row-1">
            <h3 className="card-title">Create</h3>
            <p className="card-content">Customize your avatar and home</p>
          </div>
          <div className="card col-2 row-1">
            <h3 className="card-title">Build</h3>
            <p className="card-content">Create your own shop and sell in the marketplace.</p>
          </div>
        </div>
        <div className="card">
            <h3 className="card-title">Explore</h3>
            <p className="card-content">Take your character to visit other homes, shops, and worlds</p>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0">
        <div>&copy; 2024 Hom3Town. All rights reserved.</div>
      </footer>
      
    </main>
  );
}
