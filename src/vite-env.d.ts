/// <reference types="vite/client" />

/**
 * Figma Make의 가상 모듈 스킴 선언
 * import img from "figma:asset/xxx.png" 형태의 import를 TypeScript가 인식하도록 합니다.
 */
declare module 'figma:asset/*' {
  const src: string;
  export default src;
}

/**
 * 환경변수 타입 정의
 * .env 파일에 추가하는 변수는 이곳에도 선언해 주세요.
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
