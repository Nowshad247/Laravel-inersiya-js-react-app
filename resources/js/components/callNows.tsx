import React from "react";

type Status = {
  id: number;
  name: string;
};

type Source = {
  id: number;
  name: string;
};

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  status_id: number;
  source_id: number;
  assigned_to: number | null;
  town: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  profile: string | null;
  calls: any[];
  notes: any[];
  reminders: any[];
  status: Status;
  source: Source;
};

type Props = {
  data: Lead;
};

const CallNows: React.FC<Props> = ({ data }) => {
  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <tr className="border-b">
      <td className="p-3 font-medium bg-gray-50 w-1/3">{label}</td>
      <td className="p-3">{value}</td>
    </tr>
  );

  return (
    <div className="max-w-2xl mx-auto border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          <Row label="Name" value={data.name} />
          <Row label="Email" value={data.email} />
          <Row label="Phone" value={data.phone} />
          <Row label="WhatsApp" value={data.whatsapp_number} />
          <Row label="Town" value={data.town} />
          <Row label="Address" value={data.address || "N/A"} />

          <Row
            label="Status"
            value={
              <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                {data.status?.name}
              </span>
            }
          />

          <Row
            label="Source"
            value={
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                {data.source?.name}
              </span>
            }
          />

          <Row
            label="Assigned To"
            value={data.assigned_to || "Not Assigned"}
          />

          <Row label="Calls" value={data.calls.length} />
          <Row label="Notes" value={data.notes.length} />
          <Row label="Reminders" value={data.reminders.length} />

          <Row
            label="Created At"
            value={new Date(data.created_at).toLocaleString()}
          />

          <Row
            label="Updated At"
            value={new Date(data.updated_at).toLocaleString()}
          />
        </tbody>
      </table>
    </div>
  );
};

export default CallNows;