import React from "react";
import { CardProvider } from "./context/CardContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { UserForm } from "./components/UserForm";
import { CardPreview } from "./components/CardPreview";
import { TemplateSelector } from "./components/TemplateSelector";
import { ColorSuggestions } from "./components/ColorSuggestions";
import { FontSelector } from "./components/FontSelector";
import { QRCodeSection } from "./components/QRCodeSection";
import { DownloadButtons } from "./components/DownloadButtons";
import { ShareButton } from "./components/ShareButton";

function App() {
  const EXPORT_ELEMENT_ID = "digital-business-card-element";

  return (
    <CardProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            
            {/* Left Side: Form Controls */}
            <section className="lg:col-span-7 bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-gray">Card Details</h2>
                <p className="text-xs text-slate-500 dark:text-slate-600 mt-1">
                  Fill in your details below. The card preview on the right will update instantly.
                </p>
              </div>
              <UserForm />
            </section>

            {/* Right Side: Live Preview & Configurations */}
            <section className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Preview & Style</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Customize card design, select font, template, colors, and share.
                </p>
              </div>

              {/* Card Preview Container */}
              <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center">
                <CardPreview exportId={EXPORT_ELEMENT_ID} />
              </div>

              {/* Settings Configuration Panels */}
              <div className="space-y-4">
                <TemplateSelector />
                <ColorSuggestions />
                <FontSelector />
                <QRCodeSection />
                
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-colors space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Publish & Save
                  </label>
                  <DownloadButtons exportId={EXPORT_ELEMENT_ID} />
                  <ShareButton />
                </div>
              </div>
            </section>

          </div>
        </main>

        <Footer />
      </div>
    </CardProvider>
  );
}

export default App;
