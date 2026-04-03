import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    isAdmin: false,
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [adminRequested, setAdminRequested] = useState(false);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = '이메일을 입력하세요.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = '올바른 이메일 형식이 아닙니다.';
    if (!form.nickname) errs.nickname = '닉네임을 입력하세요.';
    if (!form.password) errs.password = '비밀번호를 입력하세요.';
    else if (form.password.length < 4) errs.password = '비밀번호는 4자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm) errs.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const result = await signup({ ...form, profileImage: profileFile });
      if (form.isAdmin) {
        setAdminRequested(true);
      } else {
        navigate('/home', { replace: true });
      }
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (adminRequested) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen bg-white px-6 gap-6 animate-fade-up">
        <div className="w-20 h-20 bg-yellow-pale rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#776A77" strokeWidth={1.8} className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-bold text-app-black text-lg">관리자 가입 요청 완료</p>
          <p className="text-sm text-app-gray mt-2 leading-relaxed">관리자 검토 후 승인되면<br />로그인이 가능합니다.</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => navigate('/login', { replace: true })}>
          로그인 화면으로
        </Button>
      </div>
    );
  }

  return (
    <div className="app-container flex flex-col min-h-screen bg-white px-6 pb-10">
      <button
        onClick={() => navigate(-1)}
        className="mt-12 mb-6 self-start p-1 text-app-black active:opacity-60"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-app-black">회원가입</h1>
        <p className="text-sm text-app-gray mt-1">정보를 입력하고 시작하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 프로필 사진 */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center border-2 border-dashed border-primary-dark active:opacity-70"
          >
            {profilePreview ? (
              <img src={profilePreview} alt="프로필" className="w-full h-full object-cover" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="#94B9F3" strokeWidth={1.5} className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary-dark rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth={2.5} strokeLinecap="round" />
              </svg>
            </div>
          </button>
          <span className="text-xs text-app-gray">프로필 사진 (선택)</span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImage} />
        </div>

        <Input label="이메일 *" type="email" value={form.email} onChange={set('email')} placeholder="example@email.com" error={errors.email} />
        <Input label="닉네임 *" value={form.nickname} onChange={set('nickname')} placeholder="사용할 닉네임을 입력하세요" error={errors.nickname} />
        <Input label="비밀번호 *" type="password" value={form.password} onChange={set('password')} placeholder="4자 이상 입력하세요" error={errors.password} />
        <Input label="비밀번호 확인 *" type="password" value={form.passwordConfirm} onChange={set('passwordConfirm')} placeholder="비밀번호를 한 번 더 입력하세요" error={errors.passwordConfirm} />

        {/* 관리자 체크박스 */}
        <label className="flex items-center gap-3 p-4 bg-yellow-pale/50 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={form.isAdmin}
            onChange={(e) => setForm((prev) => ({ ...prev, isAdmin: e.target.checked }))}
            className="w-4 h-4 accent-[#94B9F3]"
          />
          <div>
            <p className="text-sm font-semibold text-app-black">관리자로 가입</p>
            <p className="text-xs text-app-gray mt-0.5">체크 시 관리자 승인 요청이 발송됩니다.</p>
          </div>
        </label>

        {errors.general && <p className="text-sm text-red-500 text-center">{errors.general}</p>}

        <Button type="submit" variant="primary" size="lg" disabled={loading} className="mt-2">
          {loading ? '가입 중...' : '회원가입'}
        </Button>
      </form>
    </div>
  );
}
