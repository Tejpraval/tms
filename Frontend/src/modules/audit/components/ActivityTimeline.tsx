//D:\resumeproject\Frontend\src\modules\audit\components\ActivityTimeline.tsx
import type { AuditLog } from "../api";

interface Props {
  audits: AuditLog[];
}

export const AuditTimeline = ({ audits }: Props) => {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 space-y-4 border border-zinc-800">
      <h3 className="text-lg font-semibold">
        Activity Stream
      </h3>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {audits.map((log) => (
          <div
            key={log._id}
            className="border-l-2 border-zinc-700 pl-3"
          >
            <p className="text-sm font-medium">
              {log.action}
            </p>
            <p className="text-xs text-zinc-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
