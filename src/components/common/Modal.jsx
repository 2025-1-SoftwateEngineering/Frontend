export default function Modal({ title, message, confirmText, cancelText, onConfirm, onCancel, confirmDanger = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-black/40 px-6 animate-scale-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        {title && <h3 className="text-base font-bold text-app-black mb-2">{title}</h3>}
        {message && <p className="text-sm text-app-gray mb-6 leading-relaxed">{message}</p>}
        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-app-gray"
            >
              {cancelText || '취소'}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-sm font-bold text-white ${
              confirmDanger ? 'bg-red-500' : 'bg-primary-dark'
            }`}
          >
            {confirmText || '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
