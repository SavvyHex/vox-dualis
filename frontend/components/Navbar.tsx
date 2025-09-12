"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="vox-header">
      <div className="vox-header-container">
        <Link
          href="/"
          className={pathname === "/" ? "vox-nav-link-active" : "vox-nav-link"}
        >
          <div className="vox-header-brand">
            <div className="vox-logo">
              <span>⚖️</span>
            </div>
            <h1 className="vox-logo-text">Vox Dualis</h1>
          </div>
        </Link>
        <nav className="vox-nav">
          <Link
            href="/"
            className={
              pathname === "/" ? "vox-nav-link-active" : "vox-nav-link"
            }
          >
            Home
          </Link>
          <Link
            href="/arena"
            className={
              pathname === "/arena" ? "vox-nav-link-active" : "vox-nav-link"
            }
          >
            Arena
          </Link>
          <Link
            href="/about"
            className={
              pathname === "/about" ? "vox-nav-link-active" : "vox-nav-link"
            }
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
