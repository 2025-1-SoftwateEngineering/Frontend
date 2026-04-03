export default function FriendsPage() {
  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white px-6 pt-14 pb-5 border-b border-gray-100">
        <h1 className="text-xl font-black text-app-black">친구</h1>
        <p className="text-sm text-app-gray mt-1">친구와 함께 공부해보세요.</p>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 gap-5 px-6 py-20">
        <div className="w-24 h-24 bg-primary/15 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#94B9F3" strokeWidth={1.5} className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0zM22 20v-2a4 4 0 00-3-3.87" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-bold text-app-black text-base">준비중입니다</p>
          <p className="text-sm text-app-gray mt-2 leading-relaxed">
            친구 기능이 곧 추가될 예정입니다.<br />조금만 기다려주세요!
          </p>
        </div>
      </div>
    </div>
  );
}
