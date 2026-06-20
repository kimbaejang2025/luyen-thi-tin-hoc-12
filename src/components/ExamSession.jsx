import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';

// Helper to extract context and statement from flattened True/False questions
const extractContextAndStatement = (questionText) => {
  const contextMatch = questionText.match(/<i>Ngữ cảnh:<\/i>\s*(.*?)(?:<br\s*\/><br\s*\/><b>Yêu cầu:<\/b>|<br\s*\/><br\s*\/>)/i);
  const context = contextMatch ? contextMatch[1] : '';
  
  const stmtMatch = questionText.match(/<b>[A-D]\.<\/b>\s*(.*)/i);
  const statement = stmtMatch ? stmtMatch[1] : questionText;
  
  return { context, statement };
};

export default function ExamSession({ exam, currentUser, onFinish, onBack }) {
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60); // seconds
  const [scoreDetails, setScoreDetails] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('cs'); // 'cs' or 'ict'
  
  const timerRef = useRef(null);
  const questionRefs = useRef({});
  const examContainerRef = useRef(null);

  // Generate 8 mock questions to represent the exam skeleton structure as fallback
  const skeletonQuestions = Array.from({ length: 8 }, (_, i) => ({
    id: `sq_${i + 1}`,
    question: `[Câu hỏi trắc nghiệm môn Tin học số ${i + 1} của đề "${exam.title}" đang biên soạn]`,
    options: [
      `[Đáp án lựa chọn A của câu ${i + 1}]`,
      `[Đáp án lựa chọn B của câu ${i + 1}]`,
      `[Đáp án lựa chọn C của câu ${i + 1}]`,
      `[Đáp án lựa chọn D của câu ${i + 1}]`
    ],
    correctAnswer: (i % 4), // cycling correct answers 0 to 3
    explanation: `[Nội dung phân tích, hướng dẫn giải chi tiết cho câu hỏi ${i + 1} đang được biên soạn và sẽ bổ sung sau]`
  }));

  const isTotNghiep = exam.id === 'exam_totnghiep_2026';

  // Extract sections if this is the official 2026 THPT exam
  const part1Questions = isTotNghiep 
    ? exam.questions.filter(q => q.id.startsWith('dt2026_p1_'))
    : [];
    
  const part2CommonQuestions = isTotNghiep
    ? exam.questions.filter(q => q.id.startsWith('dt2026_p2common_'))
    : [];

  const part2CSQuestions = isTotNghiep
    ? exam.questions.filter(q => q.id.startsWith('dt2026_p2cs_'))
    : [];

  const part2ICTQuestions = isTotNghiep
    ? exam.questions.filter(q => q.id.startsWith('dt2026_p2ict_'))
    : [];

  // Determine active questions to use for grading and question map
  const questionsToUse = isTotNghiep 
    ? [...part1Questions, ...part2CommonQuestions, ...(selectedTrack === 'cs' ? part2CSQuestions : part2ICTQuestions)]
    : (exam.questions && exam.questions.length > 0 ? exam.questions : skeletonQuestions);

  // Helper to group statements in Part II under their respective questions
  const groupPart2Questions = (questionsList) => {
    const groups = {};
    questionsList.forEach(q => {
      const match = q.id.match(/_q(\d+)_[a-d]$/);
      const qNum = match ? match[1] : 'unknown';
      
      if (!groups[qNum]) {
        const { context } = extractContextAndStatement(q.question);
        groups[qNum] = {
          qNum,
          context,
          statements: []
        };
      }
      
      const { statement } = extractContextAndStatement(q.question);
      groups[qNum].statements.push({
        ...q,
        statementText: statement,
        label: q.id.slice(-1).toUpperCase() // 'A', 'B', 'C', 'D'
      });
    });
    return Object.values(groups);
  };

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (examContainerRef.current) {
        examContainerRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          alert(`Không thể kích hoạt chế độ toàn màn hình: ${err.message}`);
        });
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isSubmitted]);

  const handleSelectOption = (qId, optionIdx) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const jumpToQuestion = (idx) => {
    const el = questionRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAutoSubmit = () => {
    alert('Hết giờ làm bài! Hệ thống tự động nộp bài thi.');
    submitExam(0);
  };

  const handleManualSubmit = () => {
    const answeredCount = Object.keys(answers).filter(qId => 
      questionsToUse.some(q => q.id === qId)
    ).length;
    const totalCount = questionsToUse.length;
    
    if (answeredCount < totalCount) {
      const confirmSubmit = window.confirm(
        `Bạn mới trả lời ${answeredCount}/${totalCount} câu hỏi. Bạn có chắc chắn muốn nộp bài không?`
      );
      if (!confirmSubmit) return;
    } else {
      const confirmSubmit = window.confirm('Bạn có muốn nộp bài thi này không?');
      if (!confirmSubmit) return;
    }
    
    submitExam(timeLeft);
  };

  const submitExam = (remainingTime) => {
    clearInterval(timerRef.current);
    setIsSubmitted(true);

    let correctCount = 0;
    questionsToUse.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = questionsToUse.length;
    const rawScore = (correctCount / totalQuestions) * 10;
    const score = Math.round(rawScore * 100) / 100; // round to 2 decimals

    const calculatedTimeSpent = exam.duration * 60 - remainingTime;
    const minutesSpent = Math.floor(calculatedTimeSpent / 60);
    const secondsSpent = calculatedTimeSpent % 60;
    const timeSpentStr = `${minutesSpent} phút ${secondsSpent} giây`;

    const details = {
      examId: exam.id,
      examTitle: exam.title,
      score,
      correctAnswers: correctCount,
      totalQuestions,
      timeSpent: timeSpentStr,
      date: new Date().toLocaleString('vi-VN')
    };

    setScoreDetails(details);
    if (currentUser && currentUser.role !== 'admin') {
      onFinish(details);
    }
  };

  // Format timer displays MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to map actual question labels in sidebar grid
  const getQuestionMapLabel = (q, idx) => {
    if (!isTotNghiep) return (idx + 1).toString();
    
    if (q.id.startsWith('dt2026_p1_')) {
      const num = q.id.replace('dt2026_p1_', '');
      return num;
    }
    
    const match = q.id.match(/_q(\d+)_([a-d])$/);
    if (match) {
      return `${match[1]}${match[2]}`;
    }
    
    return (idx + 1).toString();
  };

  // Renders True/False statement buttons
  const renderTFButtons = (stmt) => {
    const selectedIdx = answers[stmt.id];
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
        {stmt.options.map((opt, optIdx) => {
          let className = 'quiz-option-btn';
          if (selectedIdx === optIdx) {
            className += ' selected';
          }
          
          if (isSubmitted) {
            if (optIdx === stmt.correctAnswer) {
              className = 'quiz-option-btn correct';
            } else if (selectedIdx === optIdx) {
              className = 'quiz-option-btn incorrect';
            }
          }
          
          return (
            <button
              key={optIdx}
              className={className}
              onClick={() => handleSelectOption(stmt.id, optIdx)}
              disabled={isSubmitted}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '6px', 
                fontWeight: '600',
                padding: '8px 16px' 
              }}
            >
              {optIdx === 0 ? '✔ Đúng' : '✘ Sai'}
            </button>
          );
        })}
      </div>
    );
  };

  // Renders a Part II Context + Statement list Group
  const renderPart2Group = (group) => {
    return (
      <div 
        key={group.qNum} 
        className="glass-card" 
        style={{ 
          marginBottom: '24px', 
          padding: '24px',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)'
        }}
      >
        <div className="exam-question-num" style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '12px' }}>
          Câu {group.qNum}.
        </div>
        <p 
          style={{ fontWeight: '500', marginBottom: '16px', color: 'var(--text-main)', opacity: 0.9 }}
          dangerouslySetInnerHTML={{ __html: group.context }}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {group.statements.map(stmt => {
            const stmtIdx = questionsToUse.findIndex(q => q.id === stmt.id);
            return (
              <div 
                key={stmt.id} 
                ref={el => questionRefs.current[stmtIdx] = el}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <p style={{ fontWeight: '500', color: 'var(--text-main)', marginBottom: '12px' }}>
                  <strong>{stmt.label})</strong> <span dangerouslySetInnerHTML={{ __html: stmt.statementText }} />
                </p>
                {renderTFButtons(stmt)}
                {isSubmitted && stmt.explanation && (
                  <div className="quiz-explanation" style={{ marginTop: '12px' }} dangerouslySetInnerHTML={{ __html: `<strong>Giải thích chi tiết: </strong>` + stmt.explanation }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={examContainerRef} className={`exam-session-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header Panel */}
      <div className="back-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="back-btn" onClick={onBack} title="Thoát">
            <Icon name="X" style={{ width: '18px', height: '18px' }} />
          </button>
          
          <button 
            className="back-btn" 
            onClick={toggleFullscreen} 
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            )}
          </button>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isTotNghiep ? "Kỳ thi Tốt nghiệp THPT Quốc gia" : "Đang làm bài thi trực tuyến"}
            </span>
            <h1 style={{ fontSize: '1.25rem', marginTop: '2px', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exam.title}</h1>
          </div>
        </div>

        {!isSubmitted && (
          <div className={`exam-timer ${timeLeft < 300 ? 'danger' : ''}`}>
            <Icon name="Clock" style={{ width: '22px', height: '22px' }} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {isSubmitted && scoreDetails && (
        <div className="glass-card text-center" style={{ marginBottom: '24px', padding: '32px' }}>
          <div className="score-display">
            <span className="score-num">{scoreDetails.score}</span>
            <span className="score-lbl">Điểm số</span>
          </div>
          
          <h2 style={{ marginBottom: '16px' }}>Hoàn Thành Bài Thi!</h2>
          
          <div className="result-stats-row" style={{ maxWidth: '600px', margin: '0 auto 24px auto' }}>
            <div className="result-stat-box">
              <div className="result-stat-val correct">{scoreDetails.correctAnswers} / {scoreDetails.totalQuestions}</div>
              <div className="result-stat-lbl">Số câu đúng</div>
            </div>
            <div className="result-stat-box">
              <div className="result-stat-val incorrect">{scoreDetails.totalQuestions - scoreDetails.correctAnswers}</div>
              <div className="result-stat-lbl">Số câu sai/chưa làm</div>
            </div>
            <div className="result-stat-box">
              <div className="result-stat-val">{scoreDetails.timeSpent}</div>
              <div className="result-stat-lbl">Thời gian làm</div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={onBack}>
            Quay lại trang đề thi
          </button>
        </div>
      )}

      {/* Main Test Layout */}
      <div className="exam-session-layout">
        {/* Left Side: Question List */}
        {isTotNghiep ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Official Exam Header */}
            <div className="official-exam-header" style={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              color: '#ffffff',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.9 }}>BỘ GIÁO DỤC VÀ ĐÀO TẠO</h3>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0' }}>ĐỀ THI CHÍNH THỨC</h2>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>KỲ THI TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG NĂM 2026</h3>
              <p style={{ fontWeight: 'bold', color: '#fef08a', marginTop: '6px' }}>MÔN THI: TIN HỌC</p>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', opacity: 0.8 }}>Thời gian làm bài: 50 phút, không kể thời gian phát đề</p>
              <div style={{
                display: 'inline-block',
                background: '#f59e0b',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                marginTop: '8px',
                fontSize: '0.9rem'
              }}>Mã đề thi: 0537</div>
            </div>

            {/* Student Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              background: 'var(--bg-active)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Họ và tên thí sinh:</label>
                <input type="text" className="form-input" placeholder="Nhập họ tên..." style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Số báo danh:</label>
                <input type="text" className="form-input" placeholder="Nhập SBD..." style={{ width: '100%' }} />
              </div>
            </div>

            {/* PART I Section Header */}
            <div style={{ 
              background: 'var(--bg-active)', 
              padding: '12px 18px', 
              borderRadius: '6px', 
              fontWeight: 'bold',
              borderLeft: '4px solid #3b82f6',
              marginBottom: '16px',
              color: 'var(--text-main)'
            }}>
              PHẦN I. Câu trắc nghiệm nhiều lựa chọn
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Thí sinh trả lời từ câu 1 đến câu 24. Mỗi câu hỏi thí sinh chỉ chọn một phương án.
            </p>

            {/* Render Part I Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {part1Questions.map((q, idx) => {
                const selectedIdx = answers[q.id];
                return (
                  <div 
                    key={q.id} 
                    className="exam-question-item"
                    ref={el => questionRefs.current[idx] = el}
                    id={`question-num-${idx}`}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '24px',
                    }}
                  >
                    <div className="exam-question-num">
                      Câu {idx + 1}:
                    </div>
                    <p 
                      style={{ fontWeight: '500', marginBottom: '16px', color: 'var(--text-main)', opacity: 0.85 }}
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                    
                    <div className="quiz-options-list">
                      {q.options.map((opt, optIdx) => {
                        let className = 'quiz-option-btn';
                        if (selectedIdx === optIdx) {
                          className += ' selected';
                        }
                        if (isSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            className = 'quiz-option-btn correct';
                          } else if (selectedIdx === optIdx) {
                            className = 'quiz-option-btn incorrect';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            className={className}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            disabled={isSubmitted}
                          >
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && q.explanation && (
                      <div className="quiz-explanation" style={{ marginTop: '16px' }} dangerouslySetInnerHTML={{ __html: `<strong>Giải thích chi tiết: </strong>` + q.explanation }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* PART II Section Header */}
            <div style={{ 
              background: 'var(--bg-active)', 
              padding: '12px 18px', 
              borderRadius: '6px', 
              fontWeight: 'bold',
              borderLeft: '4px solid #3b82f6',
              marginTop: '36px',
              marginBottom: '16px',
              color: 'var(--text-main)'
            }}>
              PHẦN II. Câu trắc nghiệm đúng sai
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.
            </p>

            {/* Sub-section A: Phần chung */}
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              fontWeight: 'bold',
              marginBottom: '16px',
              color: 'var(--text-main)'
            }}>
              A. Phần chung dành cho tất cả các thí sinh
            </div>

            {/* Render Common Q1 & Q2 */}
            {groupPart2Questions(part2CommonQuestions).map(group => renderPart2Group(group))}

            {/* Sub-section B: Phần riêng */}
            <div style={{ margin: '24px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                fontWeight: 'bold',
                marginBottom: '12px',
                color: 'var(--text-main)'
              }}>
                B. Phần riêng
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Thí sinh chỉ được phép chọn một trong hai phần (không được tính điểm nếu làm cả hai phần):
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className={`btn ${selectedTrack === 'cs' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    if (isSubmitted) return;
                    setSelectedTrack('cs');
                  }}
                  disabled={isSubmitted}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  B1. Khoa học máy tính (Câu 3 & 4)
                </button>
                <button
                  className={`btn ${selectedTrack === 'ict' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    if (isSubmitted) return;
                    setSelectedTrack('ict');
                  }}
                  disabled={isSubmitted}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  B2. Tin học ứng dụng (Câu 5 & 6)
                </button>
              </div>
            </div>

            {/* Render track questions */}
            <div style={{ marginTop: '16px' }}>
              {selectedTrack === 'cs' ? (
                <div>
                  <div style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '8px', marginBottom: '20px', fontStyle: 'italic', fontWeight: '600', color: 'var(--color-primary)' }}>
                    B1. Khoa học máy tính (Câu 3 & 4)
                  </div>
                  {groupPart2Questions(part2CSQuestions).map(group => renderPart2Group(group))}
                </div>
              ) : (
                <div>
                  <div style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '8px', marginBottom: '20px', fontStyle: 'italic', fontWeight: '600', color: 'var(--color-primary)' }}>
                    B2. Tin học ứng dụng (Câu 5 & 6)
                  </div>
                  {groupPart2Questions(part2ICTQuestions).map(group => renderPart2Group(group))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Standard rendering for other exams */
          <div className="glass-card exam-question-box">
            {questionsToUse.map((q, idx) => {
              const selectedIdx = answers[q.id];
              return (
                <div 
                  key={q.id} 
                  className="exam-question-item"
                  ref={el => questionRefs.current[idx] = el}
                  id={`question-num-${idx}`}
                >
                  <div className="exam-question-num">
                    Câu {idx + 1}:
                  </div>
                  <p 
                    style={{ fontWeight: '500', marginBottom: '16px', color: 'var(--text-main)', opacity: 0.85 }}
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  />
                  
                  <div className="quiz-options-list">
                    {q.options.map((opt, optIdx) => {
                      let className = 'quiz-option-btn';
                      if (selectedIdx === optIdx) {
                        className += ' selected';
                      }
                      if (isSubmitted) {
                        if (optIdx === q.correctAnswer) {
                          className = 'quiz-option-btn correct';
                        } else if (selectedIdx === optIdx) {
                          className = 'quiz-option-btn incorrect';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          className={className}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          disabled={isSubmitted}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && q.explanation && (
                    <div className="quiz-explanation" style={{ marginTop: '16px' }} dangerouslySetInnerHTML={{ __html: `<strong>Giải thích chi tiết: </strong>` + q.explanation }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Right Side: Question Navigation Grid */}
        <div className="exam-sidebar">
          <div className="glass-card exam-sidebar-card">
            <div className="sidebar-title">Bản đồ câu hỏi</div>
            
            <div className="question-grid" style={{
              gridTemplateColumns: isTotNghiep ? 'repeat(4, 1fr)' : 'repeat(5, 1fr)' // 4 columns looks better for TF labels
            }}>
              {questionsToUse.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const selectedIdx = answers[q.id];
                let className = 'question-grid-btn';
                
                if (isSubmitted) {
                  if (selectedIdx === q.correctAnswer) {
                    className += ' correct';
                  } else {
                    className += ' incorrect';
                  }
                } else if (isAnswered) {
                  className += ' answered';
                }

                return (
                  <button
                    key={q.id}
                    className={className}
                    onClick={() => jumpToQuestion(idx)}
                    title={`Đi đến câu ${idx + 1}`}
                    style={{ fontSize: isTotNghiep ? '0.75rem' : '0.9rem', padding: '4px 2px' }}
                  >
                    {getQuestionMapLabel(q, idx)}
                  </button>
                );
              })}
            </div>

            {!isSubmitted && (
              <button 
                className="btn btn-primary pulse-button" 
                style={{ width: '100%', marginTop: '10px' }}
                onClick={handleManualSubmit}
              >
                Nộp bài thi thử
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
