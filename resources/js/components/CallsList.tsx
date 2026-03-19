import React from "react";

type Call = {
  id: number;
  lead_id: number;
  user_id: number;
  called_at: string;
  remarks: string;
  result: string;
  created_at: string | null;
  updated_at: string | null;
};

type Props = {
  calls: Call[];
};

const CallsList: React.FC<Props> = ({ calls }) => {
  if (!calls || calls.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        No calls available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {calls.map((call) => (
        <div
          key={call.id}
          className="p-4 border rounded-xl bg-white shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">
              Call ID: {call.id}
            </span>

            <span
              className={`text-xs px-2 py-1 rounded ${
                call.result === "answered"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {call.result}
            </span>
          </div>

          <div className="text-sm text-gray-700">
            <p>
              <strong>Remarks:</strong> {call.remarks}
            </p>

            <p className="mt-1">
              <strong>Called Time:</strong>{" "}
              {new Date(call.called_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CallsList;