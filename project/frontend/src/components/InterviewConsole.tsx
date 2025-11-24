import { useInterview } from '../hooks/useInterview';
import AudioRecorder from './AudioRecorder';
import QuestionDisplay from './QuestionDisplay';
import ResultsTable from './ResultsTable';

const InterviewConsole = () => {
  const { interview, currentQuestion, loading, error, answers, start, submitAnswer } = useInterview();

  return (
    <div className="card">
      <p>Začnite testni intervju in odgovorite na vsako vprašanje z zvočnim posnetkom.</p>
      {!interview && (
        <button onClick={start} disabled={loading}>
          {loading ? 'Pripravljam...' : 'Start Test Interview'}
        </button>
      )}

      {currentQuestion && <QuestionDisplay question={currentQuestion} />}

      {interview && currentQuestion && (
        <AudioRecorder onSubmit={submitAnswer} disabled={loading} />
      )}

      {error && <div className="error">{error}</div>}

      {answers.length > 0 && <ResultsTable answers={answers} />}

      {interview && !currentQuestion && <div className="status">Intervju je zaključen.</div>}
    </div>
  );
};

export default InterviewConsole;
