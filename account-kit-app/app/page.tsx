import "./globals.css";
import PlayNowButton from './components/PlayNowButton';

export default function Home() {
  return (
    <main className="items-center text-center justify-center">
      <div>  
        <h1 className="text-6xl font-bold m-10">Welcome to Hom3Town!</h1>
        <h2 className="text-2xl mb-5">Your home in the metaverse!</h2>
      </div>
      <div className="flex justify-center"><PlayNowButton /></div>
      <div className="two-column-grid mt-50">
          <div className="container-raised container-raised-hover cursor-default">
            <h3 className="text-xl font-bold mb-2">Create</h3>
            <p>Customize your avatar and home</p>
          </div>
          <div className="container-raised container-raised-hover cursor-default">
            <h3 className="text-xl font-bold mb-2">Build</h3>
            <p>Create your own shop and sell in the marketplace.</p>
          </div>
        </div>
        <div className="container-raised container-raised-hover cursor-default">
          <h3 className="text-xl font-bold mb-2">Explore</h3>
          <p>Take your character to visit other homes, shops, and worlds</p>
          <p> -- play games, and more!</p>
        </div>
    </main>
  );  
}
