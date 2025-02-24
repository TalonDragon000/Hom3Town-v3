import "./globals.css";
import Login from "./login/page";
import PlayNowButton from './components/PlayNowButton';
import { Avatar } from "./components/Avatar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
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
      <div className="flex flex-col items-center text-center justify-center">
        <h1 className="text-6xl font-bold mb-10">Welcome to Hom3Town!</h1>
        <p className="text-xl mb-5">
          Your home in the metaverse!
        </p>
        <div className="flex justify-center gap-20">
          <div className="flex justify-center"><PlayNowButton /></div>
        </div>
        <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 border border-gray-300 rounded-lg shadow-md hover:shadow-[0_0_5px_rgba(26,161,240,1)]">
            <h3 className="text-xl font-bold mb-2">Create</h3>
            <p>Customize your avatar and home</p>
          </div>
          <div className="max-w-2xl p-6 border border-gray-300 rounded-lg shadow-md hover:shadow-[0_0_5px_rgba(26,161,240,1)]">
            <h3 className="text-xl font-bold mb-2">Build</h3>
            <p>Create your own shop and sell in the marketplace.</p>
          </div>
        </div>
        <div className="mt-6 p-6 border border-gray-300 rounded-lg shadow-md hover:shadow-[0_0_5px_rgba(26,161,240,1)] min-w-[672px]">
          <h3 className="text-xl font-bold mb-2">Explore</h3>
          <p>Take your character to visit other homes, shops, and worlds</p>
          <p> -- play games, and more!</p>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0">
        <div>&copy; 2024 Hom3Town. All rights reserved.</div>
      </footer>
    </main>
  );
}
