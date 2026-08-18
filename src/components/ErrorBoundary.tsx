import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-vazir" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="text-xl font-bold text-white mb-2">خطایی در بارگذاری رخ داده است</h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              متأسفانه خطایی در اجرای برنامه رخ داد. می‌توانید با دکمه زیر برنامه را تازه‌سازی و به حالت اولیه بازگردانید.
            </p>

            {this.state.error && (
              <div className="bg-slate-950 p-3 rounded-xl text-xs text-rose-300 font-mono text-left mb-6 overflow-x-auto max-h-32 border border-slate-800">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              <RefreshCw className="w-4 h-4" />
              <span>بارگذاری مجدد و بازیابی تنظیمات پیش‌فرض</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
