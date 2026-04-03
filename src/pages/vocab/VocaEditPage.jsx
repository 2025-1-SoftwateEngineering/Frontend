import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoca } from '../../context/VocaContext';
import Modal from '../../components/common/Modal';
import BackHeader from '../../components/common/BackHeader';

const emptyWord = () => ({ id: Date.now() + Math.random(), word: '', meaning: '', example: '' });

export default function VocaEditPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { getVocaBook, addVocaBook, updateVocaBook, deleteVocaBook } = useVoca();

  const isEdit = !!bookId && bookId !== 'new';
  const existing = isEdit ? getVocaBook(bookId) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [words, setWords] = useState(
    existing?.words?.length
      ? existing.words.map((w) => ({ ...w }))
      : [emptyWord()]
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});

  const setWord = (idx, field, val) => {
    setWords((prev) => prev.map((w, i) => (i === idx ? { ...w, [field]: val } : w)));
  };

  const addRow = () => setWords((prev) => [...prev, emptyWord()]);

  const removeRow = (idx) => {
    if (words.length === 1) return;
    setWords((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = '단어장 제목을 입력하세요.';
    const invalidIdx = words.findIndex((w) => !w.word.trim() || !w.meaning.trim());
    if (invalidIdx !== -1) errs.words = `${invalidIdx + 1}번 단어의 단어와 뜻은 필수입니다.`;
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const cleanWords = words.map((w, i) => ({
      id: w.id || Date.now() + i,
      word: w.word.trim(),
      meaning: w.meaning.trim(),
      example: w.example?.trim() || '',
    }));
    if (isEdit) {
      updateVocaBook(Number(bookId), { title: title.trim(), description: description.trim(), words: cleanWords });
    } else {
      addVocaBook({ title: title.trim(), description: description.trim(), words: cleanWords });
    }
    navigate('/voca');
  };

  const handleDelete = () => {
    deleteVocaBook(Number(bookId));
    navigate('/voca', { replace: true });
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <BackHeader
        title={isEdit ? '단어장 편집' : '단어장 만들기'}
        rightElement={
          isEdit ? (
            <button onClick={() => setShowDeleteModal(true)} className="text-xs font-bold text-red-500">
              삭제
            </button>
          ) : null
        }
      />

      <div className="flex flex-col gap-5 px-5 py-5 pb-28">
        {/* 단어장 정보 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-app-black">단어장 제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: TOEIC 필수 단어 1"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-gray-50 ${
                errors.title ? 'border-red-400' : 'border-gray-200 focus:border-primary-dark focus:ring-2 focus:ring-primary/30'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-app-black">설명</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="단어장 설명 (선택)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 text-sm outline-none bg-gray-50"
            />
          </div>
        </div>

        {/* 단어 목록 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-app-black">단어 목록</p>
            <span className="text-xs text-app-gray">{words.length}개</span>
          </div>

          <div className="flex flex-col gap-3">
            {words.map((w, idx) => (
              <div key={w.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-primary-dark">#{idx + 1}</span>
                  <button
                    onClick={() => removeRow(idx)}
                    disabled={words.length === 1}
                    className="p-1 text-app-gray disabled:opacity-20 active:text-red-500"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={w.word}
                    onChange={(e) => setWord(idx, 'word', e.target.value)}
                    placeholder="영단어 *"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 text-sm outline-none bg-gray-50"
                  />
                  <input
                    type="text"
                    value={w.meaning}
                    onChange={(e) => setWord(idx, 'meaning', e.target.value)}
                    placeholder="뜻 *"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 text-sm outline-none bg-gray-50"
                  />
                  <input
                    type="text"
                    value={w.example}
                    onChange={(e) => setWord(idx, 'example', e.target.value)}
                    placeholder="예문 (선택)"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-dark focus:ring-2 focus:ring-primary/30 text-sm outline-none bg-gray-50"
                  />
                </div>
              </div>
            ))}
          </div>

          {errors.words && (
            <p className="text-xs text-red-500 mt-2">{errors.words}</p>
          )}

          {/* + 단어 추가 */}
          <button
            onClick={addRow}
            className="mt-3 w-full py-3.5 rounded-xl border-2 border-dashed border-primary/50 text-sm font-semibold text-primary-dark flex items-center justify-center gap-2 active:bg-primary/5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
            단어 추가
          </button>
        </div>
      </div>

      {/* 하단 저장 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-6 pt-4 bg-white border-t border-gray-100">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl bg-primary-dark text-white font-bold text-sm active:opacity-80"
        >
          저장하기
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <Modal
          title="단어장 삭제"
          message="정말 단어장을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
          confirmDanger
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
