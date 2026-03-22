import { useState, useEffect } from 'react';
import { useDesktop } from '../context/DesktopContext';
import { X, UserCog, Power, Calendar } from 'lucide-react';

export default function SettingsModal() {
  const { isSettingsOpen, toggleSettings, userName, setUserName, weeklySchedule, updateWeeklySchedule } = useDesktop();
  const [activeTab, setActiveTab] = useState('Profile');
  const [tempUserName, setTempUserName] = useState(userName || "System Admin");
  const [tempSchedule, setTempSchedule] = useState(weeklySchedule);

  useEffect(() => {
    setTempUserName(userName);
  }, [userName, isSettingsOpen]);

  useEffect(() => {
    setTempSchedule(weeklySchedule);
  }, [weeklySchedule, isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleSaveProfile = () => {
    if (tempUserName.trim()) setUserName(tempUserName.trim());
    toggleSettings();
  };

  const handleSaveSchedule = () => {
    updateWeeklySchedule(tempSchedule);
  };

  const handlePeriodChange = (periodIndex, field, value) => {
    setTempSchedule(prev => {
      const newPeriods = [...(prev.periods || [])];
      newPeriods[periodIndex] = { ...newPeriods[periodIndex], [field]: value };
      return { ...prev, periods: newPeriods };
    });
  };

  const handleCellChange = (dayIndex, periodIndex, value) => {
    setTempSchedule(prev => {
      const newGrid = { ...prev.grid };
      const dayData = [...(newGrid[dayIndex] || [])];
      
      while(dayData.length <= periodIndex) dayData.push({ subject: '', room: '' });
      
      dayData[periodIndex] = { ...dayData[periodIndex], subject: value };
      newGrid[dayIndex] = dayData;
      
      return { ...prev, grid: newGrid };
    });
  };

  const handleQuit = () => {
    if (window.api && window.api.quitApp) {
      window.api.quitApp();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xl p-4 transition-all">
      <div className="glass w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white tracking-tighter">시스템 설정</h2>
          <button onClick={toggleSettings} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[450px]">
          {/* Internal Sidebar */}
          <div className="w-40 border-r border-white/10 p-4 space-y-2 bg-black/20">
            <button 
              onClick={() => setActiveTab('Profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'Profile' ? 'bg-white/20 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <UserCog className="w-4 h-4" /> 프로필
            </button>
            <button 
              onClick={() => setActiveTab('Schedule')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'Schedule' ? 'bg-white/20 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" /> 시간표
            </button>
            <button 
              onClick={() => setActiveTab('System')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === 'System' ? 'bg-white/20 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <Power className="w-4 h-4" /> 시스템
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-8 bg-black/10 overflow-hidden">
            {activeTab === 'Profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-semibold text-white">허브 개인 설정</h3>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-widest">표시 이름</label>
                  <input 
                    type="text" value={tempUserName} onChange={e => setTempUserName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 shadow-inner"
                  />
                  <p className="text-[10px] text-white/40">이 이름은 우측 화면의 사이드바 상단에 표시됩니다.</p>
                </div>
                <button onClick={handleSaveProfile} className="bg-sky-500/20 hover:bg-sky-500/40 text-sky-100 font-medium px-6 py-2 rounded-xl transition-all">
                  저장
                </button>
              </div>
            )}

            {activeTab === 'Schedule' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold text-white">주간 시간표 관리</h3>
                  <button onClick={handleSaveSchedule} className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg">
                    저장하기
                  </button>
                </div>
                
                <div className="flex-1 overflow-auto custom-scrollbar bg-black/30 rounded-xl border border-white/10 p-2">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="sticky top-0 bg-black/80 backdrop-blur-md z-10 w-full">
                      <tr>
                        <th className="p-2 border-b border-white/10 text-center w-20 text-white/50 font-medium">교시</th>
                        {['월', '화', '수', '목', '금'].map(d => <th key={d} className="p-2 border-b border-white/10 text-center text-white/70 font-medium">{d}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {tempSchedule?.periods?.map((period, pIdx) => (
                        <tr key={pIdx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                          <td className="p-1.5 text-center border-r border-white/5 bg-black/20">
                            <input 
                              type="text" 
                              value={period.name || ''}
                              onChange={e => handlePeriodChange(pIdx, 'name', e.target.value)}
                              className="w-full bg-transparent text-white/70 font-medium text-center text-xs px-1 py-0.5 focus:outline-none focus:bg-white/10 rounded-md transition-all placeholder:text-white/30 truncate"
                            />
                            <input 
                              type="text" 
                              value={period.time || ''}
                              onChange={e => handlePeriodChange(pIdx, 'time', e.target.value)}
                              className="w-full bg-transparent text-white/40 text-center text-[9px] mt-0.5 px-0.5 py-0.5 focus:outline-none focus:bg-white/10 rounded-md transition-all placeholder:text-white/20 truncate"
                            />
                          </td>
                          {[1,2,3,4,5].map(dIdx => {
                            const cell = tempSchedule.grid[dIdx]?.[pIdx] || { subject: '' };
                            return (
                              <td key={dIdx} className="p-1 border-r border-white/5 last:border-0 relative">
                                <input 
                                  type="text" 
                                  value={cell.subject || ''}
                                  onChange={e => handleCellChange(dIdx, pIdx, e.target.value)}
                                  placeholder="미설정"
                                  className="w-full bg-transparent text-white/90 text-center text-[11px] p-2 focus:outline-none focus:bg-white/10 rounded-lg transition-all placeholder:text-white/20"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'System' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                <div>
                  <h3 className="text-lg font-semibold text-red-400">위험 구역</h3>
                  <p className="text-xs text-white/50 mt-1 mb-6">아래 작업을 수행하면 허브가 안전하게 종료됩니다.</p>
                </div>
                <div className="mt-auto bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-sm text-red-200">앱 완전히 종료하기</span>
                  <button onClick={handleQuit} className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg">
                    종료
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
