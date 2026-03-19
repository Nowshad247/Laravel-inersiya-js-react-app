import React from "react";

type Reminder = {
  id: number;
  lead_id: number;
  user_id: number;
  is_call: number;
  is_completed: number;
  remind_at: string;
  created_at: string;
  updated_at: string;
};

type Props = {
  reminders: Reminder[];
};

const RemindersList: React.FC<Props> = ({ reminders }) => {
  if (!reminders || reminders.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        No reminders available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reminders.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-xl bg-white shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">
              Reminder ID: {item.id}
            </span>

            <span
              className={`text-xs px-2 py-1 rounded ${
                item.is_completed
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {item.is_completed ? "Completed" : "Pending"}
            </span>
          </div>

          <div className="text-sm text-gray-700">
            <p>
              <strong>Remind At:</strong>{" "}
              {new Date(item.remind_at).toLocaleString()}
            </p>

            <p className="mt-1">
              <strong>Type:</strong>{" "}
              {item.is_call ? "Call Reminder" : "General Reminder"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              User ID: {item.user_id} | Lead ID: {item.lead_id}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RemindersList;