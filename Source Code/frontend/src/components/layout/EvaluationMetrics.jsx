import React from 'react';
import { ChevronDown, Grid2X2, ListChecks } from 'lucide-react';

const metricLabels = {
  accuracy: 'Accuracy',
  precision: 'Precision (macro)',
  recall: 'Recall (macro)',
  f1_score: 'F1-score (macro)',
  mae: 'MAE',
  mse: 'MSE',
  rmse: 'RMSE',
  r2: 'R²',
};

const formatMetric = (value) =>
  value == null ? 'Not available' : Number(value).toFixed(4);

export default function EvaluationMetrics({ evaluation, taskType, title = 'Held-out evaluation' }) {
  if (!evaluation) {
    return (
      <div className="rounded-xl p-4 text-sm" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
        {title}: no labeled evaluation data is available.
      </div>
    );
  }

  const keys = taskType === 'regression'
    ? ['mae', 'mse', 'rmse', 'r2']
    : ['accuracy', 'precision', 'recall', 'f1_score'];
  const primaryMetric = taskType === 'regression' ? 'mse' : 'accuracy';

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{title}</h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {taskType === 'regression' ? 'Regression metrics' : 'Classification metrics'}
          </p>
        </div>
        {evaluation.rows != null && (
          <span className="rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
            {evaluation.rows.toLocaleString()} labeled rows
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {keys.map((key) => (
          <div key={key} className="rounded-xl p-3 sm:p-4"
            style={{
              background: key === primaryMetric ? 'rgba(124,58,237,0.07)' : 'var(--color-bg)',
              border: `1px solid ${key === primaryMetric ? 'rgba(124,58,237,0.22)' : 'var(--color-border)'}`,
            }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              {metricLabels[key]}
            </p>
            <p className="mt-1.5 text-base sm:text-lg font-mono font-bold tabular-nums"
              style={{ color: key === primaryMetric ? '#7C3AED' : 'var(--color-text)' }}>
              {formatMetric(evaluation[key])}
            </p>
            {key === primaryMetric && (
              <p className="mt-0.5 text-[10px] font-medium" style={{ color: '#7C3AED' }}>Primary metric</p>
            )}
          </div>
        ))}
      </div>

      {taskType !== 'regression' && evaluation.confusion_matrix && (
        <details className="group overflow-hidden rounded-xl" style={{ border: '1px solid var(--color-border)' }}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            style={{ color: 'var(--color-text)', background: 'var(--color-bg)' }}>
            <span className="flex items-center gap-2"><Grid2X2 className="h-4 w-4 text-primary" />Confusion matrix</span>
            <span className="flex items-center gap-2 text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>
              Actual rows · predicted columns
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-xs text-center">
              <thead>
                <tr style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface)' }}>
                  <th className="sticky left-0 px-4 py-2.5 text-left font-medium" style={{ background: 'var(--color-surface)' }}>Actual ↓ / Predicted →</th>
                  {(evaluation.class_labels ?? []).map((label) => <th key={label} className="px-4 py-2.5 font-medium">{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {evaluation.confusion_matrix.map((row, index) => (
                  <tr key={evaluation.class_labels?.[index] ?? index}
                    style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                    <th className="sticky left-0 px-4 py-2.5 text-left font-semibold"
                      style={{ background: 'var(--color-surface)' }}>
                      {evaluation.class_labels?.[index] ?? index}
                    </th>
                    {row.map((count, colIndex) => {
                      const isCorrect = index === colIndex;
                      return (
                        <td key={colIndex} className="px-4 py-2.5 font-mono tabular-nums"
                          style={{ background: isCorrect ? 'rgba(34,197,94,0.07)' : undefined }}>
                          {count}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {taskType !== 'regression' && evaluation.class_metrics?.length > 0 && (
        <details className="group overflow-hidden rounded-xl" style={{ border: '1px solid var(--color-border)' }}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            style={{ color: 'var(--color-text)', background: 'var(--color-bg)' }}>
            <span className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary" />Per-class performance</span>
            <span className="flex items-center gap-2 text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>
              {evaluation.class_metrics.length} classes
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface)' }}>
                <tr>
                  {['Class', 'Precision', 'Recall', 'F1-score', 'Support'].map((label) => (
                    <th key={label} className="px-4 py-2.5 font-medium">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {evaluation.class_metrics.map((row) => (
                  <tr key={row.class} style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                    <td className="px-4 py-2.5 font-semibold">{row.class}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums">{formatMetric(row.precision)}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums">{formatMetric(row.recall)}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums">{formatMetric(row.f1_score)}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums">{row.support}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  );
}
