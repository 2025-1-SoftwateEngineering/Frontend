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
      className="absolute inset-0 flex items-center justify-center z-50 px-6"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onCancel}
    >
      <div
        className="w-full rounded-2xl p-6 shadow-xl"
        style={{ background: '#fff', maxWidth: 360 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-center mb-2" style={{ color: '#1c1c1c' }}>{title}</h3>
        <p className="text-center mb-6" style={{ fontSize: 14, color: '#737373' }}>{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl py-3"
            style={{ background: '#f3f3f5', color: '#1c1c1c', fontSize: 15 }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl py-3"
            style={{ background: confirmColor, color: '#fff', fontSize: 15 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
