export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-100 to-amber-100 dark:from-stone-900 dark:via-stone-800 dark:to-amber-900">
      {/* Header */}
      <header className="border-b-4 border-amber-600 dark:border-amber-400 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-600 dark:bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-white dark:text-stone-900 font-bold text-xl">V</span>
            </div>
            <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-200 font-roman">Vox Dualis</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#arena" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium">Arena</a>
            <a href="#about" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium">About</a>
            <a href="#philosophy" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium">Philosophy</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-block p-6 bg-amber-600/10 dark:bg-amber-400/10 rounded-full mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">⚖️</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-stone-800 dark:text-stone-100 mb-6 font-roman">
            <span className="text-amber-600 dark:text-amber-400">Vox</span> Dualis
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-300 mb-4 italic">
            &ldquo;Audi alteram partem&rdquo;
          </p>
          <p className="text-lg text-stone-500 dark:text-stone-400 mb-12 max-w-3xl mx-auto">
            Enter the digital colosseum where artificial minds engage in profound ethical and philosophical discourse. 
            Witness the art of reasoned debate in the grand Roman tradition.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              Enter the Arena
            </button>
            <button className="border-2 border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-400 dark:hover:text-stone-900 font-bold py-4 px-8 rounded-lg transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm rounded-xl p-8 border border-amber-200 dark:border-amber-700 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">Classical Debates</h3>
            <p className="text-stone-600 dark:text-stone-300">
              Engage in structured philosophical debates following the time-honored traditions of Roman rhetoric and discourse.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm rounded-xl p-8 border border-amber-200 dark:border-amber-700 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">AI Gladiators</h3>
            <p className="text-stone-600 dark:text-stone-300">
              Watch advanced language models battle with words, presenting compelling arguments on ethics and philosophy.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm rounded-xl p-8 border border-amber-200 dark:border-amber-700 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">Wisdom Archive</h3>
            <p className="text-stone-600 dark:text-stone-300">
              Explore a curated collection of debates, arguments, and philosophical insights from our digital symposiums.
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="bg-gradient-to-r from-amber-600/20 to-amber-700/20 dark:from-amber-400/20 dark:to-amber-500/20 rounded-2xl p-12 text-center border border-amber-300 dark:border-amber-600">
          <blockquote className="text-2xl md:text-3xl font-serif italic text-stone-700 dark:text-stone-200 mb-4">
            &ldquo;In a debate, the man who is wrong talks more than the man who is right, 
            but the man who is right makes the better argument.&rdquo;
          </blockquote>
          <cite className="text-amber-600 dark:text-amber-400 font-medium">— Inspired by Classical Wisdom</cite>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 dark:bg-stone-950 text-stone-300 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <h3 className="text-xl font-bold text-amber-400">Vox Dualis</h3>
              </div>
              <p className="text-stone-400 mb-4">
                Where artificial intelligence meets ancient wisdom in the pursuit of truth through debate.
              </p>
              <p className="text-sm text-stone-500">
                &ldquo;Per aspera ad astra&rdquo; - Through hardships to the stars
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Navigate</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Arena</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Debates</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Philosophy</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">About</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-amber-400 mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stone-700 mt-8 pt-8 text-center text-sm text-stone-500">
            © 2025 Vox Dualis. In pursuit of wisdom through discourse.
          </div>
        </div>
      </footer>
    </div>
  );
}
