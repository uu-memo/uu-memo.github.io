
/**
 * Admin Utilities for UU-MEMO
 * Type-safe helpers for UI and data operations
 */

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast(message, type);
    } else {
        console.log(`[Toast ${type}] ${message}`);
    }
};

export interface ModalOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    icon?: string;
    theme?: 'main' | 'danger';
}

// Global state for CustomModal resolution
let modalResolve: ((value: boolean) => void) | null = null;

export const CustomModalLogic = {
    // This is a bridge to the DOM implementation in the component
    init(modalElements: any) {
        // Elements would be passed from the script block
        return {
            confirm: async (options: ModalOptions): Promise<boolean> => {
                const { title = "確認", message = "", confirmText = "確定", cancelText = "取消", icon = "help", theme = "main" } = options;

                return new Promise<boolean>((resolve) => {
                    const { container, titleEl, messageEl, confirmBtn, cancelBtn, iconEl, iconBg } = modalElements;
                    if (!container || !titleEl || !messageEl || !confirmBtn || !cancelBtn || !iconEl) return resolve(false);

                    titleEl.textContent = title;
                    messageEl.textContent = message;
                    confirmBtn.textContent = confirmText;
                    cancelBtn.textContent = cancelText;
                    iconEl.textContent = icon;
                    cancelBtn.classList.remove('hidden');

                    if (theme === 'danger') {
                        iconEl.className = "material-symbols-outlined text-3xl text-uu-dark";
                        iconBg?.classList.replace('bg-uu-sub/5', 'bg-uu-sub/20');
                        confirmBtn.className = "flex-1 py-4 bg-uu-dark text-white rounded-2xl text-[11px] font-black tracking-widest uppercase hover:opacity-90 hover:shadow-lg hover:shadow-uu-dark/20 transition-all active:scale-95";
                    } else {
                        iconEl.className = "material-symbols-outlined text-3xl text-uu-main";
                        iconBg?.classList.replace('bg-uu-sub/20', 'bg-uu-sub/5');
                        confirmBtn.className = "flex-1 py-4 bg-uu-dark text-white rounded-2xl text-[11px] font-black tracking-widest uppercase hover:opacity-90 hover:shadow-lg hover:shadow-uu-dark/20 transition-all active:scale-95";
                    }

                    modalResolve = resolve;
                    container.classList.remove("pointer-events-none", "opacity-0");
                });
            },
            resolve(value: boolean) {
                if (modalResolve) {
                    modalResolve(value);
                    modalResolve = null;
                }
            }
        };
    }
};
