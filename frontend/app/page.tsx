import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="vox-page-bg">
      <Navbar />

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

          <p className="vox-subtitle mb-4">&ldquo;Audi alteram partem&rdquo;</p>
          <p className="text-lg text-stone-500 dark:text-stone-400 mb-12 max-w-3xl mx-auto">
            Enter the digital colosseum where artificial minds engage in
            profound ethical and philosophical discourse. Witness the art of
            reasoned debate in the grand Roman tradition.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/arena" className="vox-btn-primary">
              Enter the Arena
            </Link>
            <button className="vox-btn-secondary">Learn More</button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="vox-card">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="vox-feature-title">Classical Debates</h3>
            <p className="vox-feature-text">
              Engage in structured philosophical debates following the
              time-honored traditions of Roman rhetoric and discourse.
            </p>
          </div>

          <div className="vox-card">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="vox-feature-title">AI Gladiators</h3>
            <p className="vox-feature-text">
              Watch advanced language models battle with words, presenting
              compelling arguments on ethics and philosophy.
            </p>
          </div>

          <div className="vox-card">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="vox-feature-title">Wisdom Archive</h3>
            <p className="vox-feature-text">
              Explore a curated collection of debates, arguments, and
              philosophical insights from our digital symposiums.
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="vox-quote-section">
          <blockquote className="vox-quote-text">
            &ldquo;In a debate, the man who is wrong talks more than the man who
            is right, but the man who is right makes the better argument.&rdquo;
          </blockquote>
          <cite className="vox-quote-cite">— Inspired by Classical Wisdom</cite>
        </div>
      </main>

      <Footer />
    </div>
  );
}
