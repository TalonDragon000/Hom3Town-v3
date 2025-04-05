'use client';

import { Avatar } from "./Avatar";
import Login from "../login/page";

export default function Navbar() {
  return (
    <nav className="navbar navbar-home">
      <div className="nav-item-left"><a href="/">Hom3Town</a></div>
      <div className="nav-item-right">
        <div className="nav-avatar"><Avatar 
          defaultImagePath={"/images/anon.png"} 
          size="small"
        /></div>
        <div className="nav-login btn"><Login /></div>
      </div>
    </nav>
  );        
}