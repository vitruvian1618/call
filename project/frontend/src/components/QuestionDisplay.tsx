import { Question } from '../types';

const QuestionDisplay = ({ question }: { question: Question }) => {
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3>{question.text}</h3>
      {question.tts_error ? <p className="warning">TTS opozorilo: {question.tts_error}</p> : null}
      {question.options && (
        <ul>
          {question.options.map((opt) => (
            <li key={opt.code}>
              {opt.label} ({opt.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionDisplay;
