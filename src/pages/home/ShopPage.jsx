export default function ShopPage() {
  const categories = [
    { label: '미니게임 아이템', icon: '🎮' },
    { label: '프로필 배경', icon: '🖼️' },
    { label: '프로필 프레임', icon: '✨' },
    { label: '프로필 사진', icon: '🐣' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white px-6 pt-14 pb-5 border-b border-gray-100">
        <h1 className="text-xl font-black text-app-black">상점</h1>
        <p className="text-sm text-app-gray mt-1">포인트로 아이템을 구매해보세요.</p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        {categories.map((cat) => (
          <div key={cat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{cat.icon}</span>
              <p className="font-bold text-app-black">{cat.label}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <span className="text-[10px] text-app-gray font-medium">준비중</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-5 mb-5 p-4 bg-primary/10 rounded-2xl text-center">
        <p className="text-sm font-bold text-primary-dark">🎁 더 많은 아이템 준비중!</p>
        <p className="text-xs text-app-gray mt-1">곧 다양한 아이템이 추가될 예정입니다.</p>
      </div>
    </div>
  );
}
