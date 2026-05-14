interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen, title, message,
  confirmLabel = '확인', cancelLabel = '취소',
  confirmColor = '#d4183d',
  onConfirm, onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50 px-6 bg-black/45"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[360px] rounded-2xl p-6 shadow-xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-center mb-2 text-text-main">{title}</h3>
        <p className="text-center mb-6 text-sm text-text-sub">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl py-3 bg-surface-muted text-text-main text-[15px]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl py-3 text-white text-[15px]"
            style={{ background: confirmColor }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
