import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, Eye, EyeOff, Camera } from 'lucide-react';
import { useAuth } from '../../main/features/domain/auth/AuthContext';
import { MobileLayout } from '../components/MobileLayout';

export function RegisterScreen() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRegister = async () => {
    setError('');
    if (!email.trim() || !nickname.trim() || !password.trim()) {
      setError('이메일, 닉네임, 비밀번호를 모두 입력해 주세요.'); return;
    }
    if (password !== pwCheck) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }

    setLoading(true);
    try {
      await register({ email: email.trim(), nickname: nickname.trim(), password, profileImage, isAdmin });
      if (isAdmin) {
        alert('관리자 가입 요청이 전송되었습니다. 승인 후 로그인하실 수 있습니다.');
        navigate('/login');
      } else {
        alert('회원가입이 완료되었습니다! 로그인해 주세요.');
        navigate('/login/email');
      }
    } catch (e: any) {
      setError(e.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 14,
    border: '1.5px solid #e5e7eb', fontSize: 15, outline: 'none',
    background: '#fafafa', color: '#1c1c1c',
  };

  return (
    <MobileLayout>
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: '#fff' }}>
        <div className="flex items-center px-4 pt-12 pb-4 flex-shrink-0">
          <button onClick={() => navigate('/login')} style={{ color: '#737373', background: 'none', border: 'none' }}>
            <ChevronLeft size={26} />
          </button>
        </div>

        <motion.div
          className="flex flex-col px-6 pb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1c1c1c', marginBottom: 6 }}>회원가입</h1>
            <p style={{ fontSize: 14, color: '#737373' }}>정보를 입력하고 학습을 시작하세요</p>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => fileRef.current?.click()}
              className="relative flex items-center justify-center rounded-full overflow-hidden"
              style={{ width: 90, height: 90, background: '#EDE9BF', border: '3px solid #B8D0FA' }}
            >
              {profileImage ? (
                <img src={profileImage} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 36 }}>👤</span>
              )}
              <div className="absolute bottom-0 right-0 rounded-full flex items-center justify-center"
                style={{ width: 26, height: 26, background: '#B8D0FA' }}>
                <Camera size={13} color="#1c1c1c" />
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label style={{ fontSize: 13, color: '#737373', marginBottom: 6, display: 'block' }}>이메일 *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#737373', marginBottom: 6, display: 'block' }}>닉네임 *</label>
              <input value={nickname} onChange={(e) => setNickname(e.target.value)}
                placeholder="사용할 닉네임" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#737373', marginBottom: 6, display: 'block' }}>비밀번호 *</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상" style={{ ...inputStyle, paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#737373', background: 'none', border: 'none' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#737373', marginBottom: 6, display: 'block' }}>비밀번호 확인 *</label>
              <input type={showPw ? 'text' : 'password'} value={pwCheck}
                onChange={(e) => setPwCheck(e.target.value)}
                placeholder="비밀번호 재입력" style={inputStyle} />
            </div>
          </div>

          <div
            className="flex items-start gap-3 mt-5 p-4 rounded-xl"
            style={{ background: isAdmin ? '#EDE9BF' : '#f8f8f8' }}
          >
            <input
              type="checkbox"
              id="admin-check"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              style={{ width: 18, height: 18, marginTop: 2, accentColor: '#94B9F3', flexShrink: 0 }}
            />
            <label htmlFor="admin-check" style={{ fontSize: 14, color: '#1c1c1c', lineHeight: 1.6, cursor: 'pointer' }}>
              <span style={{ fontWeight: 600 }}>관리자로 가입</span><br />
              <span style={{ fontSize: 12, color: '#737373' }}>
                체크 시 관리자 승인 요청이 전송됩니다. 단어장 생성·편집 권한이 부여됩니다.
              </span>
            </label>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 13, color: '#d4183d', marginTop: 10, textAlign: 'center' }}>
              {error}
            </motion.p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-2xl py-4 mt-6 active:scale-95 transition-transform"
            style={{ background: loading ? '#c8ddf8' : '#B8D0FA', color: '#1c1c1c', fontSize: 16, fontWeight: 700 }}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
