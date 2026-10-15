import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Mail, 
  X, 
  CheckCircle, 
  DownloadCloud 
} from 'lucide-react';
import Logo from './Logo';

export default function Footer({ 
  canInstallPwa, 
  onInstallPwa, 
  isInstalled, 
  onNotify 
}) {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | 'contact'

  const handleInstallClick = () => {
    if (canInstallPwa && onInstallPwa) {
      onInstallPwa();
    } else if (isInstalled) {
      if (onNotify) onNotify('Text Cleanup Studio is already installed on your device!', 'info');
    } else {
      if (onNotify) onNotify('To install: click the Install icon in your browser address bar or "Add to Home Screen".', 'info');
    }
  };

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <Logo size={32} />
              <span className="font-bold text-base text-slate-900 tracking-tight">
                Text Cleanup Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Fast, privacy-first, client-side text formatter. Remove extra whitespace, deduplicate lines, format casing, and filter characters directly in your browser.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Progressive Web App</span>
              </div>

              {/* Footer Install Button */}
              {isInstalled ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>App Installed</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-all shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  title="Install Text Cleanup Studio on your device"
                  aria-label="Install App"
                >
                  <DownloadCloud className="w-3.5 h-3.5 text-blue-600" />
                  <span>Install App</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Tools & Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#editor" className="hover:text-blue-600 transition-colors">
                  Whitespace Cleaner
                </a>
              </li>
              <li>
                <a href="#editor" className="hover:text-blue-600 transition-colors">
                  Duplicate Line Remover
                </a>
              </li>
              <li>
                <a href="#editor" className="hover:text-blue-600 transition-colors">
                  Unicode Case Converter
                </a>
              </li>
              <li>
                <a href="#editor" className="hover:text-blue-600 transition-colors">
                  Emoji & Character Filter
                </a>
              </li>
              <li>
                <a href="#editor" className="hover:text-blue-600 transition-colors">
                  Text Diff & Statistics
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('contact')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Contact & Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Text Cleanup Studio. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Zero tracking cookies • 100% Client-Side Architecture
          </p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated w-full max-w-lg max-h-[85vh] flex flex-col p-6 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Privacy Policy</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 overflow-y-auto text-xs text-slate-600 space-y-3 leading-relaxed pr-1">
              <p>
                <strong>1. Zero Data Collection:</strong> Text Cleanup Studio does not collect, transmit, store, or analyze the text you paste or type. All string manipulations occur strictly within your web browser runtime.
              </p>
              <p>
                <strong>2. No Cloud Servers:</strong> There are no backend database servers or cloud text analysis APIs. If you disconnect your network connection, Text Cleanup Studio continues to function normally.
              </p>
              <p>
                <strong>3. Local Storage:</strong> If you explicitly enable Local History, recent items are saved solely in your browser's local HTML5 localStorage. You can clear this history anytime.
              </p>
              <p>
                <strong>4. Advertising Disclosure:</strong> In the event Google AdSense is active on this site, Google and third-party vendors may use cookies to serve ads based on prior visits. You can opt out of personalized advertising by visiting Google Ad Settings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated w-full max-w-lg max-h-[85vh] flex flex-col p-6 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Terms of Service</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 overflow-y-auto text-xs text-slate-600 space-y-3 leading-relaxed pr-1">
              <p>
                <strong>1. Acceptance:</strong> By accessing and using Text Cleanup Studio, you agree to these Terms. The service is provided free of charge for personal and commercial text cleaning.
              </p>
              <p>
                <strong>2. Disclaimer:</strong> The software is provided "as is", without warranty of any kind, express or implied. Always review transformed text before using it in critical production documents.
              </p>
              <p>
                <strong>3. Intellectual Property:</strong> You retain 100% ownership and copyright of any text you process through this application. We claim zero rights or ownership over your content.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated w-full max-w-md p-6 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Contact & Support</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Have suggestions, feature requests, or encountered an unexpected formatting edge case?
              </p>
              <p>
                Email us directly at:{' '}
                <a
                  href="mailto:support@textcleanupstudio.com"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  support@textcleanupstudio.com
                </a>
              </p>
              <p className="text-[11px] text-slate-400 pt-2">
                We read every message and continuously improve our Unicode and regex transformation algorithms!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
