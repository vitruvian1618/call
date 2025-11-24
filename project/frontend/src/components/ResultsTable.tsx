import { AnswerResponse } from '../types';

const ResultsTable = ({ answers }: { answers: AnswerResponse[] }) => {
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3>Rezultati</h3>
      <table width="100%">
        <thead>
          <tr>
            <th>Transkript</th>
            <th>Kode</th>
            <th>Zaupanje</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((ans, idx) => (
            <tr key={idx}>
              <td>{ans.transcript}</td>
              <td>{ans.codes.join(', ')}</td>
              <td>{ans.confidence?.toFixed(2) ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
