import React, { useState } from 'react';
import { Icon } from './Icons';

export function TopicCard({ topic, onSelect }) {
  return (
    <div className="glass-card interactive" onClick={() => onSelect(topic)}>
      <div className="topic-icon-wrapper">
        <Icon name={topic.icon} style={{ width: '28px', height: '28px' }} />
      </div>
      <h3 className="topic-title">{topic.title}</h3>
      <p className="topic-desc">{topic.description}</p>
      <div className="topic-footer">
        <span>Xem khung sườn ôn tập</span>
        <Icon name="ChevronRight" style={{ width: '16px', height: '16px' }} />
      </div>
    </div>
  );
}

export function TopicDetail({ topic, onBack }) {
  const [answers, setAnswers] = useState({});
  const [checkedQuestions, setCheckedQuestions] = useState({});

  const handleSelectOption = (qId, optionIdx) => {
    if (checkedQuestions[qId]) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleCheckAnswer = (qId) => {
    if (answers[qId] === undefined) {
      alert('Vui lòng chọn một đáp án trước khi kiểm tra!');
      return;
    }
    setCheckedQuestions(prev => ({ ...prev, [qId]: true }));
  };

  // Mock quiz questions for the topic skeleton
  const skeletonQuiz = [
    {
      id: `${topic.id}_sq1`,
      question: `[Câu hỏi trắc nghiệm số 1 ôn tập về ${topic.title} đang biên soạn]`,
      options: ['[Đáp án mẫu A]', '[Đáp án mẫu B]', '[Đáp án mẫu C]', '[Đáp án mẫu D]'],
      correctAnswer: 0,
      explanation: `[Nội dung giải thích chi tiết cho câu hỏi 1 về ${topic.title} đang được bổ sung].`
    },
    {
      id: `${topic.id}_sq2`,
      question: `[Câu hỏi trắc nghiệm số 2 ôn tập về ${topic.title} đang biên soạn]`,
      options: ['[Đáp án mẫu A]', '[Đáp án mẫu B]', '[Đáp án mẫu C]', '[Đáp án mẫu D]'],
      correctAnswer: 1,
      explanation: `[Nội dung giải thích chi tiết cho câu hỏi 2 về ${topic.title} đang được bổ sung].`
    }
  ];

  return (
    <div>
      <div className="back-header">
        <button className="back-btn" onClick={onBack} title="Quay lại">
          <Icon name="X" style={{ width: '18px', height: '18px' }} />
        </button>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Khung sườn kiến thức</span>
          <h1 style={{ fontSize: '1.75rem', marginTop: '2px' }}>{topic.title}</h1>
        </div>
      </div>

      <div className="topic-detail-layout">
        {/* Left: Lecture Skeleton Layout */}
        <div className="glass-card lecture-content">
          <div className="lecture-text">
            <h2>I. Tóm tắt lý thuyết cốt lõi</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
              <div style={{ height: '16px', background: 'var(--border-color)', borderRadius: '4px', width: '90%' }}></div>
              <div style={{ height: '16px', background: 'var(--border-color)', borderRadius: '4px', width: '85%' }}></div>
              <div style={{ height: '16px', background: 'var(--border-color)', borderRadius: '4px', width: '95%' }}></div>
              <div style={{ height: '16px', background: 'var(--border-color)', borderRadius: '4px', width: '40%' }}></div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              * [Phần tóm tắt lý thuyết đầy đủ của chủ đề "{topic.title}" sẽ được cập nhật tại đây] *
            </p>

            <h2>II. Ví dụ thực tế & Trực quan</h2>
            <div style={{ padding: '24px', background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', margin: '16px 0', textAlign: 'center' }}>
              <Icon name="Globe" style={{ width: '32px', height: '32px', color: 'var(--color-primary)', marginBottom: '8px' }} />
              <div style={{ height: '12px', background: 'var(--border-color)', borderRadius: '4px', width: '60%', margin: '0 auto 8px auto' }}></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                [Sơ đồ minh họa, mã nguồn ví dụ hoặc hình ảnh trực quan bổ sung sau]
              </p>
            </div>

            <h2>III. Các dạng bài tập thường gặp</h2>
            <ul>
              <li>
                <strong>Dạng 1:</strong> [Đang biên soạn tiêu đề dạng bài tập]
                <div style={{ height: '12px', background: 'var(--border-color)', borderRadius: '4px', width: '70%', marginTop: '6px' }}></div>
              </li>
              <li>
                <strong>Dạng 2:</strong> [Đang biên soạn tiêu đề dạng bài tập]
                <div style={{ height: '12px', background: 'var(--border-color)', borderRadius: '4px', width: '50%', marginTop: '6px' }}></div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Quick Quiz Skeleton Sidebar */}
        <div className="topic-quiz-sidebar">
          <div className="glass-card" style={{ position: 'sticky', top: '100px' }}>
            <div className="quick-quiz-header">
              <Icon name="BookOpenCheck" style={{ width: '22px', height: '22px', color: 'var(--color-primary)' }} />
              <span>Trắc nghiệm ôn tập nhanh</span>
            </div>

            <div>
              {skeletonQuiz.map((q, idx) => {
                const isChecked = checkedQuestions[q.id];
                const selectedIdx = answers[q.id];
                const isCorrect = selectedIdx === q.correctAnswer;

                return (
                  <div key={q.id} className="quiz-question-card">
                    <div className="quiz-question-text" style={{ fontSize: '0.9rem' }}>
                      Câu {idx + 1}: {q.question}
                    </div>
                    
                    <div className="quiz-options-list">
                      {q.options.map((opt, optIdx) => {
                        let className = 'quiz-option-btn';
                        if (selectedIdx === optIdx) {
                          className += ' selected';
                        }
                        if (isChecked) {
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
                            disabled={isChecked}
                            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                          >
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!isChecked ? (
                      <button
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: '12px', fontSize: '0.8rem', padding: '8px' }}
                        onClick={() => handleCheckAnswer(q.id)}
                      >
                        Kiểm tra kết quả
                      </button>
                    ) : (
                      <div className="quiz-explanation" style={{ fontSize: '0.8rem', padding: '8px' }}>
                        <strong>{isCorrect ? 'Chính xác! ' : 'Chưa đúng! '}</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
