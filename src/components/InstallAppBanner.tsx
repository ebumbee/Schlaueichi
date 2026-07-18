import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Smartphone, X, Check, Share, Plus, AlertCircle } from 'lucide-react';

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [deviceOS, setDeviceOS] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // OS erkennen
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setDeviceOS('ios');
    } else if (/android/.test(ua)) {
      setDeviceOS('android');
    } else {
      setDeviceOS('desktop');
    }

    // Prüfen ob im Iframe
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

    // Standalone Modus prüfen (ob die App bereits als PWA läuft)
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 6000);
    };

    // Globaler Event Listener für den Header-Install-Button
    const handleTriggerGuide = () => {
      setShowGuideModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('show-pwa-install-guide', handleTriggerGuide);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('show-pwa-install-guide', handleTriggerGuide);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      // Wenn kein systemseitiger Prompt da ist (z.B. Safari iOS, iframe), Anleitung anzeigen
      setShowGuideModal(true);
    }
  };

  // Wenn bereits als App installiert, blenden wir das Banner aus (außer direkt nach der Installation)
  if (isStandalone && !installSuccess) {
    return null;
  }

  return (
    <>
      <div className="w-full">
        <AnimatePresence>
          {installSuccess && (
            <motion.div
              id="install-success-banner"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-emerald-500 text-white p-6 rounded-[2rem] kid-shadow flex flex-col items-center gap-2 border-4 border-white text-center mb-6"
            >
              <div className="w-12 h-12 bg-white text-emerald-500 rounded-full flex items-center justify-center kid-shadow">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-display text-xl font-extrabold">Super! SchlauEichi ist bereit! 🎉</h4>
              <p className="text-sm font-medium opacity-90">
                Die App wurde auf deinem Startbildschirm hinzugefügt. Du kannst jetzt jederzeit direkt von dort spielen!
              </p>
            </motion.div>
          )}

          {!isStandalone && (
            <motion.div
              id="pwa-install-banner-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-brand-blue/20 p-3 sm:p-4 rounded-2xl sm:rounded-3xl kid-shadow text-left flex flex-row flex-wrap sm:flex-nowrap items-center justify-between gap-3 relative overflow-hidden mb-4"
            >
              {/* Dekorative Hintergrundelemente - subtle */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-brand-blue/5 rounded-full pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10 min-w-0">
                <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shrink-0 kid-shadow-sm rotate-[-4deg]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-sm sm:text-base font-extrabold text-gray-800 leading-tight truncate">
                    SchlauEichi als App 📱
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-tight truncate">
                    Schneller & offline spielen!
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 relative z-10 shrink-0 ml-auto sm:ml-0">
                <button
                  id="install-pwa-banner-action-btn"
                  onClick={handleInstallClick}
                  className="flex items-center justify-center gap-1.5 bg-brand-blue text-white font-extrabold px-3.5 py-2 rounded-xl kid-shadow text-xs sm:text-sm hover:bg-brand-blue/95 transition-transform hover:scale-105 border-b-2 border-blue-800 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Installieren</span>
                </button>
                
                <button
                  id="install-pwa-banner-guide-btn"
                  onClick={() => setShowGuideModal(true)}
                  className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold px-2.5 py-2 rounded-xl transition-colors cursor-pointer border border-gray-200 text-xs sm:text-sm"
                  title="Anleitung anzeigen"
                >
                  <span>Anleitung</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Anleitung Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuideModal(false)}
              className="absolute inset-0 bg-[#8B4513]/40 backdrop-blur-md"
            />

            {/* Modal-Karte */}
            <motion.div
              id="pwa-install-guide-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 kid-shadow border-4 border-brand-blue/30 relative z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Schließen Button */}
              <button
                id="close-install-modal-btn"
                onClick={() => setShowGuideModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center mx-auto mb-3 kid-shadow rotate-[-4deg]">
                  <Smartphone className="w-9 h-9" />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-gray-800">
                  Zum Startbildschirm hinzufügen 🚀
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Speichere SchlauEichi als vollwertige App auf deinem Gerät!
                </p>
              </div>

              {/* Iframe-spezifischer Hinweis */}
              {isInIframe && (
                <div id="iframe-pwa-warning" className="bg-amber-50 p-4 rounded-2xl border-2 border-brand-yellow/30 text-[#8B4513] text-xs sm:text-sm font-bold mb-6 leading-relaxed flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 shrink-0 text-brand-orange mt-0.5" />
                  <div>
                    <span className="text-brand-orange font-extrabold uppercase text-xs block mb-1">⚠️ Wichtiger Hinweis für die Vorschau</span>
                    Du spielst gerade in der Vorschau-Ansicht des Editors. Browser blockieren hier die direkte App-Installation.<br />
                    <span className="font-extrabold text-brand-blue">Klicke bitte ganz oben rechts auf das "In neuem Tab öffnen"-Symbol ↗️</span>, um SchlauEichi im vollen Browser zu öffnen. Dort erscheint der Installieren-Button sofort! 🐿️
                  </div>
                </div>
              )}

              {/* Anleitungs-Inhalt nach OS */}
              <div className="space-y-6">
                {deviceOS === 'ios' && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-3 rounded-2xl border-2 border-brand-orange/20 text-brand-orange text-xs sm:text-sm font-bold text-center">
                      Auf Apple iPhone & iPad wird Safari empfohlen!
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shrink-0 kid-shadow-sm">
                        1
                      </div>
                      <div className="text-sm text-gray-600 font-medium leading-relaxed">
                        Tippe unten in der Safari-Menüleiste auf das <span className="font-bold text-brand-blue inline-flex items-center gap-1">Teilen-Symbol <Share className="w-4 h-4 inline" /></span> (Rechteck mit Pfeil nach oben).
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shrink-0 kid-shadow-sm">
                        2
                      </div>
                      <div className="text-sm text-gray-600 font-medium leading-relaxed">
                        Scrolle etwas nach unten und tippe auf den Eintrag <span className="font-bold text-brand-blue inline-flex items-center gap-1">"Zum Home-Bildschirm" <Plus className="w-4 h-4 inline bg-gray-200 rounded p-0.5" /></span>.
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shrink-0 kid-shadow-sm">
                        3
                      </div>
                      <div className="text-sm text-gray-600 font-medium leading-relaxed">
                        Tippe oben rechts auf <span className="font-bold text-emerald-500">"Hinzufügen"</span>. Geschafft! SchlauEichi wohnt jetzt auf deinem Startbildschirm! 🐿️
                      </div>
                    </div>
                  </div>
                )}

                {deviceOS === 'android' && (
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shrink-0 kid-shadow-sm">
                        1
                      </div>
                      <div className="text-sm text-gray-600 font-medium leading-relaxed">
                        Tippe oben rechts im Browser (z.B. Google Chrome) auf die <span className="font-bold text-gray-800">drei Punkte (⋮)</span>, um das Menü zu öffnen.
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shrink-0 kid-shadow-sm">
                        2
                      </div>
                      <div className="text-sm text-gray-600 font-medium leading-relaxed">
                        Tippe auf den Menüpunkt <span className="font-bold text-brand-blue">"App installieren"</span> oder <span className="font-bold text-brand-blue">"Zum Startbildschirm hinzufügen"</span>.
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shrink-0 kid-shadow-sm">
                        3
                      </div>
                      <div className="text-sm text-gray-600 font-medium leading-relaxed">
                        Bestätige die Installation. SchlauEichi wird nun im Startmenü/Startbildschirm abgelegt! Viel Spaß! 🎉
                      </div>
                    </div>
                  </div>
                )}

                {deviceOS === 'desktop' && (
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shrink-0 kid-shadow-sm">
                        1
                      </div>
                      <div className="text-sm text-gray-600 font-medium leading-relaxed">
                        Klicke oben in der Adressleiste deines Browsers (z.B. Chrome oder Edge) auf das kleine <span className="font-bold text-brand-blue">Installations-Symbol</span> (Kreis mit Plus-Zeichen oder ein Monitor mit Pfeil) rechts neben der Webadresse.
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shrink-0 kid-shadow-sm">
                        2
                      </div>
                      <div className="text-sm text-gray-600 font-medium leading-relaxed">
                        Klicke im angezeigten Popup-Fenster auf <span className="font-bold text-emerald-500">"Installieren"</span>.
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-extrabold text-sm flex items-center justify-center shrink-0 kid-shadow-sm">
                        3
                      </div>
                      <div className="text-sm text-gray-600 font-medium leading-relaxed">
                        SchlauEichi öffnet sich sofort in einem schicken, eigenen Fenster und steht dir als App auf deinem Desktop zur Verfügung! 💻
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Schließen-Knopf unten */}
              <button
                id="modal-guide-confirm-btn"
                onClick={() => setShowGuideModal(false)}
                className="w-full mt-8 bg-brand-orange text-white font-extrabold py-3.5 rounded-2xl kid-shadow hover:bg-brand-orange/95 transition-transform hover:scale-102 border-b-4 border-orange-700 cursor-pointer text-center"
              >
                Alles klar!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
