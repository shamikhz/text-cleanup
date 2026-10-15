import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  FileCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  HelpCircle, 
  Lock, 
  Zap, 
  Database 
} from 'lucide-react';

export default function InfoSections() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does Text Cleanup Studio process my text privately?',
      a: 'Text Cleanup Studio executes 100% locally in your web browser using JavaScript string transformations and regular expressions. Your content is never transmitted across any network or stored on any server. Even if your internet connection is disconnected, the cleanup features function normally.'
    },
    {
      q: 'How does duplicate line removal treat blank lines?',
      a: 'You have three flexible options in the Advanced Settings: Deduplicate (keeps only one blank line to separate content), Keep All (preserves every blank line as-is), or Remove All (strips all blank lines completely). By default, duplicate non-empty lines are eliminated while preserving their first occurrence order.'
    },
    {
      q: 'Can I remove emojis without damaging foreign language text or accents?',
      a: 'Yes! The emoji filter specifically targets Unicode emoji pictographs and presentation sequences (\\p{Extended_Pictographic}). It strictly preserves international characters, accents (é, ü, ñ, ç), Cyrillic, Greek, Japanese, Arabic, and other writing systems.'
    },
    {
      q: 'What is the rule used for counting paragraphs?',
      a: 'In Text Cleanup Studio, a paragraph is defined as a non-empty text block separated by one or more blank lines (newlines). Single lines of text are counted as one paragraph, and empty or whitespace-only inputs register as zero paragraphs.'
    },
    {
      q: 'How does Sentence case and Title Case work?',
      a: 'Sentence case capitalizes the initial letter of the text and any letter following terminal punctuation (. ? !) followed by a space or newline. Title Case capitalizes major words while preserving common English minor words (a, an, the, and, but, for, at, by, to, in, of) in lowercase unless they appear at the start of a title or sentence.'
    },
    {
      q: 'Are my custom presets and history stored in the cloud?',
      a: 'No. Custom presets and local history are stored solely in your browser\'s local HTML5 localStorage. They never synchronize to a cloud server or third-party database. Local history is completely disabled by default for privacy and only stores entries if you explicitly enable it.'
    },
    {
      q: 'Can I install this app on my phone or computer?',
      a: 'Yes! Text Cleanup Studio is a fully progressive web app (PWA). Click "Install App" in the header or use your browser\'s "Add to Home Screen" feature to install it as a standalone desktop or mobile app.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Paste Messy Text',
      desc: 'Paste or type text from PDFs, emails, databases, or documents into the original text editor.',
      icon: <FileTextIcon className="w-5 h-5 text-blue-600" />
    },
    {
      step: '02',
      title: 'Select Cleanup Rules',
      desc: 'Choose a quick preset or customize granular whitespace, duplicate line, case, and character filters.',
      icon: <Sparkles className="w-5 h-5 text-indigo-600" />
    },
    {
      step: '03',
      title: 'Clean & Compare',
      desc: 'Click Clean Text to view instantaneous results alongside visual diff highlights and live stats.',
      icon: <Cpu className="w-5 h-5 text-teal-600" />
    },
    {
      step: '04',
      title: 'Copy or Download',
      desc: 'Copy the polished text directly to your clipboard or download it as a clean UTF-8 text file.',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />
    }
  ];

  return (
    <div className="space-y-16 py-12">
      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
            Simple Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            How Text Cleanup Studio Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Powerful client-side text processing designed to make messy copy immaculate in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {st.step}
                  </span>
                  {st.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-elevated">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Privacy Promise</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              100% In-Browser. Zero Data Uploads.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              We believe your text is your business. Unlike typical AI or online web tools that send your documents to third-party cloud servers, Text Cleanup Studio operates entirely inside your local browser sandbox.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-blue-800/80">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-800/80 text-blue-300">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">No Server Logs</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Nothing is transmitted or recorded over HTTP.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-800/80 text-blue-300">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Client Execution</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Instant processing inside your browser sandbox.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-800/80 text-blue-300">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Opt-In Storage</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Local history is strictly opt-in and easily cleared.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Clear, honest answers about our text transformation mechanics and data safety.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/90 bg-white shadow-subtle overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-slate-800">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function FileTextIcon(props) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" x2="8" y1="13" y2="13"/>
      <line x1="16" x2="8" y1="17" y2="17"/>
      <line x1="10" x2="8" y1="9" y2="9"/>
    </svg>
  );
}
