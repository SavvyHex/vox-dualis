import Link from "next/link";

export default function Footer() {
  return (
    <footer className="vox-footer-complex">
      <div className="vox-container">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="vox-footer-logo">
                <span className="text-white font-bold">⚖️</span>
              </div>
              <h3 className="vox-footer-title">Vox Dualis</h3>
            </div>
            <p className="vox-footer-text">
              Where artificial intelligence meets ancient wisdom in the pursuit
              of truth through debate.
            </p>
            <p className="vox-footer-small">
              &ldquo;Per aspera ad astra&rdquo; - Through hardships to the stars
            </p>
          </div>

          <div>
            <h4 className="vox-footer-section-title">Navigate</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="vox-footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/arena" className="vox-footer-link">
                  Arena
                </Link>
              </li>
              <li>
                <Link href="#about" className="vox-footer-link">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="vox-footer-section-title">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="vox-footer-link">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="vox-footer-link">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="vox-footer-link">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="vox-footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="vox-footer-bottom">
          © 2025 Vox Dualis. In pursuit of wisdom through discourse.
        </div>
      </div>
    </footer>
  );
}
