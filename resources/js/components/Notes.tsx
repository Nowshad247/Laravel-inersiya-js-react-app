import React from "react";

type Note = {
  id: number;
  lead_id: number;
  user_id: number;
  note: string;
  created_at: string | null;
  updated_at: string | null;
};

type Props = {
  notes: Note[];
};

const Notes: React.FC<Props> = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        No notes available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-xl bg-white shadow-sm hover:bg-gray-50 transition"
        >
          <div className="text-sm font-medium text-gray-800">
            {item.note}
          </div>
            <div className="mt-2 text-xs text-gray-500">
                <span>Created at: {new Date(item.created_at || '').toLocaleString()}</span>
                {item.updated_at && (
                    <span className="ml-4">Updated at: {new Date(item.updated_at).toLocaleString()}</span>
                )}
            </div>
          
        </div>
      ))}
    </div>
  );
};

export default Notes;