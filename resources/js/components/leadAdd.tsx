import { LeadSource } from '@/lib/data';
import { LeadStatus, User } from '@/types/Lead';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function AddLead({
    leadSources,
    leadStatuses,
    assignedTos,
    townNames,
    interests: initialInterests,
}: {
    leadSources: LeadSource[];
    leadStatuses: LeadStatus[];
    assignedTos: User[];
    townNames: string[];
    interests: string[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        whatsapp_number: '',
        gender: '',
        status_id: '',
        source_id: '',
        assigned_to: '',
        lead_notes: '',
        town: '',
        address: '',
        company: '',
        lead_sources: '',
        lead_statuses: '',
        lead_profiles: '',
        lead_calls: '',
        lead_reminders: '',
        lead_activities: '',
        occupation: '',
        interest: '',
        reminder_at: '',
    });

    const [interests, setInterests] = useState<string[]>(initialInterests);
    const [statuses, setStatuses] = useState<LeadStatus[]>(leadStatuses);
    const [sources, setSources] = useState<LeadSource[]>(leadSources);
    const [towns, setTowns] = useState<string[]>(townNames);

    const [showAddModal, setShowAddModal] = useState<
        'interest' | 'status' | 'source' | 'town' | null
    >(null);
    const [newValue, setNewValue] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/leads/create', {
            onSuccess: () => reset(),
        });
    };

    const handleFieldChange = (
        field: 'interest' | 'status' | 'source' | 'town',
    ) => {
        return (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            if (value === 'add_new') {
                setShowAddModal(field);
            } else if (field === 'status') {
                setData('status_id', value);
            } else if (field === 'source') {
                setData('source_id', value);
            } else if (field === 'town') {
                setData('town', value);
            } else if (field === 'interest') {
                setData('interest', value);
            }
        };
    };

    const handleAddNewValue = () => {
        if (!newValue.trim()) return;

        if (showAddModal === 'interest') {
            const updatedInterests = [...interests, newValue.trim()];
            setInterests(updatedInterests);
            setData('interest', newValue.trim());
        }

        setNewValue('');
        setShowAddModal(null);
    };

    return (
        <>
            <form method="post" onSubmit={submit} className="space-y-6">
                {/* Basic info */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            required={true}
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Gender field (optional) */}
                    <div>
                        <Label htmlFor="gender">Gender</Label>
                        <select
                            id="gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="other">other</option>
                        </select>
                        {errors.gender && (
                            <p className="text-sm text-red-600">
                                {errors.gender}
                            </p>
                        )}
                    </div>
                </div>

                {/* Phone numbers */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                            required={true}
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-600">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="whatsapp_number">WhatsApp</Label>
                        <Input
                            id="whatsapp_number"
                            placeholder="+88017-XXX-XXXX"
                            value={data.whatsapp_number}
                            onChange={(e) =>
                                setData('whatsapp_number', e.target.value)
                            }
                        />
                        {errors.whatsapp_number && (
                            <p className="text-sm text-red-600">
                                {errors.whatsapp_number}
                            </p>
                        )}
                    </div>
                </div>

                {/* Selects – side by side */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <Label>Status *</Label>
                        <select
                            required={true}
                            className="w-full rounded-md border px-3 py-2"
                            value={data.status_id}
                            onChange={handleFieldChange('status')}
                        >
                            <option value="">Select Status</option>
                            {statuses.map((status) => (
                                <option key={status.id} value={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                        {errors.status_id && (
                            <p className="text-sm text-red-600">
                                {errors.status_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Source</Label>
                        <select
                            className="w-full rounded-md border px-3 py-2"
                            value={data.source_id}
                            onChange={handleFieldChange('source')}
                        >
                            <option value="">Select Source</option>
                            {sources.map((source) => (
                                <option key={source.id} value={source.id}>
                                    {source.name}
                                </option>
                            ))}
                        </select>
                        {errors.source_id && (
                            <p className="text-sm text-red-600">
                                {errors.source_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Assigned To</Label>
                        <select
                            className="w-full rounded-md border px-3 py-2"
                            value={data.assigned_to}
                            onChange={(e) =>
                                setData('assigned_to', e.target.value)
                            }
                        >
                            {assignedTos.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        {errors.assigned_to && (
                            <p className="text-sm text-red-600">
                                {errors.assigned_to}
                            </p>
                        )}
                        {errors.assigned_to && (
                            <p className="text-sm text-red-600">
                                {errors.assigned_to}
                            </p>
                        )}
                    </div>
                </div>
                {/* Town */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                    <div>
                        <Label>Town</Label>
                        <select
                            className="w-full rounded-md border px-3 py-2"
                            value={data.town}
                            onChange={handleFieldChange('town')}
                        >
                            <option value="">Select Town</option>
                            {towns.map((town) => (
                                <option key={town} value={town}>
                                    {town}
                                </option>
                            ))}
                            <option value="add_new">Add New Town</option>
                        </select>
                        {errors.town && (
                            <p className="text-sm text-red-600">
                                {errors.town}
                            </p>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-600">
                                {errors.address}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                            id="occupation"
                            value={data.occupation}
                            onChange={(e) =>
                                setData('occupation', e.target.value)
                            }
                        />
                        {errors.occupation && (
                            <p className="text-sm text-red-600">
                                {errors.occupation}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="interest">Interest</Label>
                        <select
                            id="interest"
                            className="w-full rounded-md border px-3 py-2"
                            value={data.interest}
                            onChange={handleFieldChange('interest')}
                        >
                            <option value="">Select Interest</option>
                            {interests.map((interest) => (
                                <option key={interest} value={interest}>
                                    {interest}
                                </option>
                            ))}
                            <option value="add_new">Add New Interest</option>
                        </select>
                        {errors.interest && (
                            <p className="text-sm text-red-600">
                                {errors.interest}
                            </p>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <Label htmlFor="lead_notes">Lead Notes</Label>
                    <textarea
                        id="lead_notes"
                        rows={4}
                        className="w-full rounded-md border px-3 py-2"
                        value={data.lead_notes}
                        onChange={(e) => setData('lead_notes', e.target.value)}
                    />
                    {errors.lead_notes && (
                        <p className="text-sm text-red-600">
                            {errors.lead_notes}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full md:w-auto"
                    >
                        {processing ? 'Submitting…' : 'Submit Lead'}
                    </Button>
                </div>
            </form>

            {/* Add New Modal */}
            {showAddModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold">
                            {showAddModal === 'interest' && 'Add New Interest'}
                            {showAddModal === 'status' && 'Add New Status'}
                            {showAddModal === 'source' && 'Add New Source'}
                            {showAddModal === 'town' && 'Add New Town'}
                        </h2>
                        <Input
                            type="text"
                            placeholder={`Enter new ${showAddModal}`}
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddNewValue();
                                }
                            }}
                        />
                        <div className="mt-6 flex gap-2">
                            <Button
                                onClick={handleAddNewValue}
                                className="flex-1"
                            >
                                Add
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowAddModal(null);
                                    setNewValue('');
                                }}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
