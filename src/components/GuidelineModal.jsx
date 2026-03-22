import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Calendar, CheckSquare, FolderSymlink, LayoutGrid, Settings, BookOpen, MonitorPlay, MousePointer2, ClipboardList, Link2 } from 'lucide-react';
import { useDesktop } from '../context/DesktopContext';

const TABS = [
  { id: 1, title: '화면 및 시스템 제어', icon: Lock },
  { id: 2, title: '시간표 자동 설정', icon: Calendar },
  { id: 3, title: '할 일 & 스케줄링', icon: CheckSquare },
  { id: 4, title: '라이브 폴더 뷰어', icon: FolderSymlink },
  { id: 5, title: '우측 패널 메모장', icon: ClipboardList },
  { id: 6, title: '바탕화면 퀵링크', icon: Link2 },
];

export default function GuidelineModal() {
  const { isGuidelineOpen, toggleGuideline } = useDesktop();
  const [activeTab, setActiveTab] = useState(1);

  if (!isGuidelineOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={toggleGuideline}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl p-8 flex flex-col h-[70vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-2xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">기능 사용 가이드</h2>
            </div>
            <button
              onClick={toggleGuideline}
              className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Layout */}
          <div className="flex flex-1 gap-6 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-64 flex flex-col gap-2 border-r border-white/10 pr-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/15 text-white shadow-inner font-semibold' 
                        : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-sky-400' : ''}`} />
                    <span>{tab.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pl-2 pr-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {/* --- Tab 1 Content --- */}
                  {activeTab === 1 && (
                    <>
                      <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-6">
                        <div className="relative w-32 h-24 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
                           <Lock className="w-10 h-10 text-rose-400" />
                           <MousePointer2 className="w-6 h-6 text-white absolute bottom-2 right-2" />
                        </div>
                        <div className="text-white/40 text-2xl">➔</div>
                        <div className="relative w-32 h-24 bg-rose-500/10 rounded-xl border border-rose-500/30 flex items-center justify-center flex-col">
                           <Lock className="w-8 h-8 text-rose-300 mb-1" />
                           <span className="text-[10px] text-rose-200">읽기 전용 모드</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">화면 제어 및 잠금 (Lock & System)</h3>
                        <p className="text-white/70 leading-relaxed">
                          데스크톱 내 데이터를 실수로 수정하거나 지우는 일을 방지합니다.<br/><br/>
                          • <strong>화면 잠금:</strong> 우측 하단이나 설정 옆의 자물쇠 아이콘을 누르면, 모든 위젯(할 일, 시간표 등)이 읽기 전용 상태로 잠겨 안전하게 화면을 띄워둘 수 있습니다.<br/>
                          • <strong>글꼴 크기 조절:</strong> 상단의 톱니바퀴(설정) 메뉴에서 화면 전체의 확대/축소 비율(Zoom)과 글씨 크기를 조절합니다.<br/>
                          • <strong>자동 저장:</strong> 앱에서 일어나는 모든 변경사항은 백그라운드에서 실시간 저장되므로 따로 저장 버튼을 누를 필요가 없습니다.
                        </p>
                      </div>
                    </>
                  )}

                  {/* --- Tab 2 Content --- */}
                  {activeTab === 2 && (
                    <>
                      <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-6">
                        <div className="relative w-40 h-24 bg-white/10 rounded-xl border border-white/20 p-2 grid grid-cols-2 grid-rows-2 gap-1">
                           <div className="bg-sky-500/20 rounded flex items-center justify-center"><span className="text-sky-300 text-xs">국어</span></div>
                           <div className="bg-emerald-500/20 rounded flex items-center justify-center"><span className="text-emerald-300 text-xs">수학</span></div>
                           <div className="bg-purple-500/20 rounded flex items-center justify-center"><span className="text-purple-300 text-xs">체육</span></div>
                           <div className="bg-amber-500/20 rounded flex items-center justify-center"><span className="text-amber-300 text-xs">영어</span></div>
                        </div>
                        <div className="text-white/40 text-2xl">➔</div>
                        <div className="relative w-40 h-24 bg-white/10 rounded-xl border border-sky-500/50 p-3 flex flex-col justify-center">
                           <div className="w-full h-1 bg-white/20 mb-2 rounded-full"></div>
                           <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
                             <span className="text-sky-300 font-bold text-sm">현재: 3교시 국어</span>
                           </div>
                           <div className="w-2/3 h-1 bg-white/10 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">주간 시간표 기반 자동화</h3>
                        <p className="text-white/70 leading-relaxed">
                          매번 직접 오늘의 시간표를 짤 필요 없이, 학기 초에 주간 시간표만 입력하세요.<br/><br/>
                          • <strong>주간 시간표 셋팅:</strong> 우측 상단의 톱니바퀴를 눌러 '주간 시간표' 탭에서 월요일부터 금요일까지 과목과 교실을 셋팅합니다.<br/>
                          • <strong>자동 교체:</strong> 앱이 그 날짜의 요일을 인식하여 '오늘의 시간표' 위젯과 상단바에 현재 교시 정보를 자동으로 뿌려줍니다.
                        </p>
                      </div>
                    </>
                  )}

                  {/* --- Tab 3 Content --- */}
                  {activeTab === 3 && (
                    <>
                      <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-6">
                        <div className="relative w-32 h-24 bg-white/10 rounded-xl border border-white/20 flex flex-col p-2 gap-2">
                           <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-white/50"/><span className="text-[9px] text-white/50">24일 (수)</span></div>
                           <div className="w-full flex-1 bg-white/5 rounded p-1"><span className="text-[10px] text-white">학부모 상담 준비</span></div>
                        </div>
                        <div className="text-white/40 text-2xl">➔</div>
                        <div className="relative w-32 h-24 bg-white/10 rounded-xl border border-white/20 flex flex-col p-2 gap-2">
                           <div className="flex items-center gap-1"><CheckSquare className="w-3 h-3 text-emerald-400"/><span className="text-[9px] text-white/50">오늘의 할 일</span></div>
                           <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 p-1 rounded">
                             <div className="w-2 h-2 rounded-full border border-emerald-400"></div>
                             <span className="text-[10px] text-emerald-200">학부모 상담 준비</span>
                           </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">할 일 및 캘린더 통합</h3>
                        <p className="text-white/70 leading-relaxed">
                          일상 업무부터 미래 업무까지 날짜별로 확실하게 추적합니다.<br/><br/>
                          • <strong>미니 캘린더 연동:</strong> 바탕화면 우측 하단의 캘린더에서 특정 날짜를 딱 누르면, '미래 일정 예약 모달'이 뜹니다. 해당 날짜에 할 일을 쫙 적어두세요.<br/>
                          • <strong>알아서 렌더링:</strong> 예약한 날짜 당일이 되면, 데스크톱 좌측의 '오늘의 할 일' 목록에 마법처럼 나타납니다.<br/>
                          • <strong>인라인 완료:</strong> 할 일을 클릭하면 줄이 그어지며 완료 처리되고, 우측 쓰레기통을 누르면 깔끔하게 지워집니다.
                        </p>
                      </div>
                    </>
                  )}

                  {/* --- Tab 4 Content --- */}
                  {activeTab === 4 && (
                    <>
                      <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center">
                          <FolderSymlink className="w-12 h-12 text-amber-400 mb-2" />
                          <span className="text-xs text-amber-200">로컬 PC 폴더 연결</span>
                        </div>
                        <div className="text-white/40 text-2xl">➔</div>
                        <div className="bg-white/10 rounded-xl border border-white/20 p-3 w-40 flex flex-col gap-2">
                          <div className="flex items-center gap-2 bg-white/5 p-1 rounded cursor-pointer transform hover:scale-105 transition-all">
                            <MonitorPlay className="w-4 h-4 text-blue-400"/>
                            <span className="text-[10px] text-white">수업자료.hwp</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/5 p-1 rounded cursor-pointer transform hover:scale-105 transition-all">
                            <MonitorPlay className="w-4 h-4 text-rose-400"/>
                            <span className="text-[10px] text-white">성적표.pdf</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">라이브 싱크 폴더 (실시간 뷰어)</h3>
                        <p className="text-white/70 leading-relaxed">
                          파일을 일일이 앱에 등록하지 말고, 폴더 하나만 탁 연결하세요.<br/><br/>
                          • <strong>실시간 동기화:</strong> 내 바탕화면이나 USB에 있는 업무용 폴더를 사이드바에서 연결해두면, 앱 안에서 폴더 내부의 모든 파일이 즉시 렌더링됩니다.<br/>
                          • <strong>네이티브 파일 실행:</strong> 앱 안에서 한글 파일(.hwp)이나 엑셀 파일을 클릭하면, PC에 설치된 '한컴 오피스'나 '엑셀'이 알아서 팝업되며 바로 열고 작업할 수 있습니다.
                        </p>
                      </div>
                    </>
                  )}

                  {/* --- Tab 5 Content --- */}
                  {activeTab === 5 && (
                    <>
                      <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-6">
                        <div className="flex flex-col gap-2 p-3 bg-white/10 rounded-2xl border border-white/20 w-48 shrink-0 shadow-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <ClipboardList className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white">클립보드 & 메모</span>
                          </div>
                          <div className="flex bg-black/40 p-2 rounded-lg items-center justify-between border border-white/10 group cursor-pointer hover:bg-black/60 transition-colors">
                            <span className="text-[10px] text-white/90 truncate mr-2">학생 아이디: test1234</span>
                            <X className="w-3 h-3 text-white/60 group-hover:text-rose-400" />
                          </div>
                          <div className="flex bg-black/40 p-2 rounded-lg items-center justify-between border border-white/10 group cursor-pointer hover:bg-black/60 transition-colors">
                            <span className="text-[10px] text-white/90 truncate mr-2">학부모님 전화: 010...</span>
                            <X className="w-3 h-3 text-white/60 group-hover:text-rose-400" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">사이드 패널 퀵 클립보드 (메모장)</h3>
                        <p className="text-white/70 leading-relaxed">
                          일회성으로 임시 기록해두어야 할 정보들은 우측 사이드 패널 메모 기능을 적극 활용하세요.<br/><br/>
                          • <strong>우측 패널 배치:</strong> 화면 우측의 사이드 메뉴에 위치하여 바탕화면 공간을 차지하지 않으며 언제든 빠르게 내용을 메모할 수 있습니다.<br/>
                          • <strong>쉬운 인라인 추가 및 삭제:</strong> 복사한 텍스트 등을 붙여넣고 엔터를 치면 즉시 항목이 추가됩니다. 쓰고 나서 지우고 싶을 땐 항목 우측의 '삭제(X)' 아이콘을 누르면 바로 없어져서 깔끔하게 유지할 수 있습니다.
                        </p>
                      </div>
                    </>
                  )}

                  {/* --- Tab 6 Content --- */}
                  {activeTab === 6 && (
                    <>
                      <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center">
                          <div className="flex gap-2 bg-white/10 p-2 rounded-full border border-white/20 shadow-lg mb-4">
                             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"><Link2 className="w-4 h-4 text-emerald-300"/></div>
                          </div>
                          <span className="text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/10">추가 플로팅 메뉴</span>
                        </div>
                        <div className="text-white/40 text-2xl">➔</div>
                        <div className="relative w-24 h-24 bg-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-xl group">
                           <X className="w-4 h-4 text-rose-400 absolute -top-2 -right-2 opacity-50 bg-black/50 rounded-full" />
                           <Link2 className="w-8 h-8 text-emerald-300 mb-2" />
                           <span className="text-[10px] text-white">업무 메일</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">바탕화면 퀵링크 바로가기</h3>
                        <p className="text-white/70 leading-relaxed">
                          자주 가는 웹사이트나 주요 시스템을 바탕화면에 아이콘으로 꺼내두세요.<br/><br/>
                          • <strong>쉬운 추가:</strong> 우측 하단 플로팅 메뉴(Floating Action Bar)에서 '웹 링크 추가'를 눌러 이름과 URL을 입력하면 즉시 바탕화면에 나이스(NEIS), 유튜브, 구글 등 바로가기가 생성됩니다.<br/>
                          • <strong>원클릭 실행 및 삭제:</strong> 생성된 아이콘을 더블클릭하면 PC 기본 브라우저로 열리며, 더 이상 필요 없을 땐 마우스를 올려 나타나는 'X' 버튼을 클릭하여 즉시 지울 수 있습니다.
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
