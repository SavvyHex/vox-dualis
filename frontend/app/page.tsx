import Link from 'next/link';

export default function Home() {
  return (
    <div className="vox-page-bg">
      {/* Header */}
      <header className="vox-header">
        <div className="vox-container flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="vox-logo">
              <span className="text-white dark:text-stone-900 font-bold text-xl">V</span>
            </div>
            <h1 className="vox-logo-text">Vox Dualis</h1>
          </div>
          <nav className="vox-nav">
            <a href="#arena" className="vox-nav-link">Arena</a>
            <a href="#about" className="vox-nav-link">About</a>
            <a href="#philosophy" className="vox-nav-link">Philosophy</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="vox-container py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="vox-icon-container mb-6">
              <div className="vox-icon-large">
                <span className="text-4xl">⚖️</span>
              </div>
            </div>
          </div>
          
          <h1 className="vox-title-huge">
            <span className="vox-text-accent">Vox</span> Dualis
          </h1>
          
          <p className="vox-subtitle mb-4">
            &ldquo;Audi alteram partem&rdquo;
          </p>
          <p className="text-lg text-stone-500 dark:text-stone-400 mb-12 max-w-3xl mx-auto">
            Enter the digital colosseum where artificial minds engage in profound ethical and philosophical discourse. 
            Witness the art of reasoned debate in the grand Roman tradition.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/arena" className="vox-btn-primary">
              Enter the Arena
            </Link>
            <button className="vox-btn-secondary">
              Learn More
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="vox-card">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="vox-feature-title">Classical Debates</h3>
            <p className="vox-feature-text">
              Engage in structured philosophical debates following the time-honored traditions of Roman rhetoric and discourse.
            </p>
          </div>

          <div className="vox-card">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="vox-feature-title">AI Gladiators</h3>
            <p className="vox-feature-text">
              Watch advanced language models battle with words, presenting compelling arguments on ethics and philosophy.
            </p>
          </div>

          <div className="vox-card">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="vox-feature-title">Wisdom Archive</h3>
            <p className="vox-feature-text">
              Explore a curated collection of debates, arguments, and philosophical insights from our digital symposiums.
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="vox-quote-section">
          <blockquote className="vox-quote-text">
            &ldquo;In a debate, the man who is wrong talks more than the man who is right, 
            but the man who is right makes the better argument.&rdquo;
          </blockquote>
          <cite className="vox-quote-cite">— Inspired by Classical Wisdom</cite>
        </div>
      </main>

      {/* Footer */}
      <footer className="vox-footer-complex">
        <div className="vox-container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="vox-footer-logo">
                  <span className="text-white font-bold">V</span>
                </div>
                <h3 className="vox-footer-title">Vox Dualis</h3>
              </div>
              <p className="vox-footer-text">
                Where artificial intelligence meets ancient wisdom in the pursuit of truth through debate.
              </p>
              <p className="vox-footer-small">
                &ldquo;Per aspera ad astra&rdquo; - Through hardships to the stars
              </p>
            </div>
            
            <div>
              <h4 className="vox-footer-section-title">Navigate</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="vox-footer-link">Arena</a></li>
                <li><a href="#" className="vox-footer-link">Debates</a></li>
                <li><a href="#" className="vox-footer-link">Philosophy</a></li>
                <li><a href="#" className="vox-footer-link">About</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="vox-footer-section-title">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="vox-footer-link">Community</a></li>
                <li><a href="#" className="vox-footer-link">Discord</a></li>
                <li><a href="#" className="vox-footer-link">GitHub</a></li>
                <li><a href="#" className="vox-footer-link">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="vox-footer-bottom">
            © 2025 Vox Dualis. In pursuit of wisdom through discourse.
          </div>
        </div>
      </footer>
    </div>
  );
}
