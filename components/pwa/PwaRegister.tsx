"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw, Download, X } from "lucide-react";

export function PwaRegister() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);

  useEffect(() => {
    // 1. Online / Offline status monitoring
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // 2. Service Worker Registration & Update Detection
      if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // Check for waiting worker
            if (registration.waiting) {
              setWaitingWorker(registration.waiting);
              setIsUpdateAvailable(true);
            }

            // Listen for new installing workers
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    setWaitingWorker(newWorker);
                    setIsUpdateAvailable(true);
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });

        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      }

      // 3. BeforeInstallPrompt handling for subtle install affordance
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-950/90 text-amber-200 border-b border-amber-800/60 px-4 py-2 text-xs font-mono flex items-center justify-between z-50 sticky top-0 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Working in Offline Mode — Serving Cached Current Affairs Library</span>
          </div>
          <span className="text-[10px] opacity-80">Local Storage Active</span>
        </div>
      )}

      {/* Update Available Toast Banner */}
      {isUpdateAvailable && (
        <aside aria-label="Update Notification" className="fixed bottom-4 right-4 z-50 p-4 rounded-2xl bg-[var(--surface-primary)] border border-emerald-500/80 shadow-xl max-w-sm space-y-2 animate-fadeIn font-mono">
          <div className="flex items-center justify-between text-xs text-[var(--text-primary)] font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>CA Library Update Ready</span>
            </span>
            <button
              onClick={() => setIsUpdateAvailable(false)}
              className="text-[var(--text-subtle)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            A newer validated Current Affairs release is ready to activate.
          </p>
          <button
            onClick={handleUpdate}
            className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Update Now</span>
          </button>
        </aside>
      )}

      {/* Subtle Install App Toast */}
      {showInstallPrompt && (
        <aside aria-label="Install Prompt" className="fixed bottom-4 left-4 z-50 p-3.5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-lg max-w-xs space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Download className="w-3.5 h-3.5" />
              <span>Install Study App</span>
            </span>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="text-[var(--text-subtle)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Install Banking CA Mentor on your home screen for quick offline access.
          </p>
          <button
            onClick={handleInstall}
            className="w-full py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-emerald-400 text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <span>Add to Home Screen</span>
          </button>
        </aside>
      )}
    </>
  );
}
