import { useEffect, useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

const AudioRecorder = ({ onSubmit, disabled }: { onSubmit: (blob: Blob | null) => void; disabled?: boolean }) => {
  const { start, stop, isRecording, error } = useAudioRecorder();
  const [status, setStatus] = useState('');

  useEffect(() => {
    setStatus(isRecording ? 'Snemanje v teku...' : '');
  }, [isRecording]);

  const handleStart = async () => {
    await start();
  };

  const handleStop = async () => {
    const blob = await stop();
    onSubmit(blob);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div>
        <button onClick={handleStart} disabled={isRecording || disabled}>
          Začni snemanje
        </button>
        <button onClick={handleStop} disabled={!isRecording} style={{ marginLeft: 8 }}>
          Končaj in pošlji
        </button>
      </div>
      {status && <div className="status">{status}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default AudioRecorder;
