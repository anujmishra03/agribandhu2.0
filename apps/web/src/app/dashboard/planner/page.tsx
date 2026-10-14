'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CalendarRange,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Filter,
  Compass,
  Check,
  ChevronRight,
  X,
  Droplets,
  Sprout,
  Shield,
  Layers,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, Heading, Button, Input, Textarea, Label } from '@agribandhu/ui';

interface Farm {
  id: string;
  name: string;
  village: string;
  crop?: {
    cropName: string;
    growthStage: string;
  } | null;
}

interface CalendarEvent {
  id: string;
  farmId: string;
  title: string;
  description?: string | null;
  eventType: string;
  priority: string;
  status: string;
  startDate: string;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
  notes?: string | null;
  farm?: {
    id: string;
    name: string;
    village: string;
  };
}

const EVENT_TYPE_COLORS: Record<string, { bg: string; text: string; icon: any }> = {
  IRRIGATION: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Droplets },
  FERTILIZER: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Layers },
  PESTICIDE: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Shield },
  SEEDING: { bg: 'bg-green-50', text: 'text-green-700', icon: Sprout },
  HARVEST: { bg: 'bg-orange-50', text: 'text-orange-700', icon: CheckCircle2 },
  AI_RECOMMENDATION: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Sparkles },
  CUSTOM: { bg: 'bg-neutral-50', text: 'text-neutral-700', icon: CalendarIcon },
};

const PRIORITY_BADGES: Record<string, string> = {
  Low: 'bg-neutral-100 text-neutral-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-amber-100 text-amber-800',
  Critical: 'bg-red-100 text-red-700',
};

export default function FarmPlannerPage() {
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [farms, setFarms] = React.useState<Farm[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedFarmFilter, setSelectedFarmFilter] = React.useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [aiGenerating, setAiGenerating] = React.useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = React.useState({
    farmId: '',
    title: '',
    description: '',
    eventType: 'CUSTOM',
    priority: 'Medium',
    status: 'Upcoming',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    notes: '',
  });

  // AI Schedule Form
  const [selectedAiFarmId, setSelectedAiFarmId] = React.useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, farmsRes] = await Promise.all([
        fetch('/api/calendar'),
        fetch('/api/farms'),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      }

      if (farmsRes.ok) {
        const farmsData = await farmsRes.json();
        setFarms(Array.isArray(farmsData) ? farmsData : []);
        if (farmsData.length > 0 && !newEvent.farmId) {
          setNewEvent((prev) => ({ ...prev, farmId: farmsData[0].id }));
          setSelectedAiFarmId(farmsData[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading planner data:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.farmId || !newEvent.title || !newEvent.startDate) {
      alert('Please fill all required fields (Farm, Title, Date)');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create event');
      }

      setIsCreateModalOpen(false);
      setNewEvent({
        farmId: farms[0]?.id || '',
        title: '',
        description: '',
        eventType: 'CUSTOM',
        priority: 'Medium',
        status: 'Upcoming',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        notes: '',
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error creating task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateAiSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAiFarmId) {
      alert('Please select a farm');
      return;
    }

    try {
      setAiGenerating(true);
      const res = await fetch('/api/calendar/generate-ai-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmId: selectedAiFarmId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate schedule');
      }

      setIsAiModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error generating schedule');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleToggleStatus = async (event: CalendarEvent) => {
    const newStatus = event.status === 'Completed' ? 'Upcoming' : 'Completed';
    try {
      const res = await fetch(`/api/calendar/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((item) => (item.id === event.id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const filteredEvents = events.filter((evt) => {
    if (selectedFarmFilter !== 'ALL' && evt.farmId !== selectedFarmFilter) return false;
    if (selectedStatusFilter !== 'ALL' && evt.status !== selectedStatusFilter) return false;
    return true;
  });

  const totalTasks = events.length;
  const completedTasks = events.filter((e) => e.status === 'Completed').length;
  const upcomingTasks = events.filter((e) => e.status === 'Upcoming' || e.status === 'Today').length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
              Farm Planner & Crop Calendar
            </Heading>
            <p className="text-neutral-500 text-sm mt-1">
              Organize sowing schedules, irrigation cycles, fertilizers, and AI-recommended farming routines.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAiModalOpen(true)}
              className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 bg-white"
            >
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span>AI Crop Schedule</span>
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-neutral-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Tasks</p>
                <p className="text-2xl font-black text-neutral-900 mt-1">{totalTasks}</p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-xl text-neutral-600">
                <CalendarRange className="h-5 w-5" />
              </div>
            </div>
          </Card>
          <Card className="bg-white border-neutral-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Upcoming</p>
                <p className="text-2xl font-black text-blue-600 mt-1">{upcomingTasks}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </Card>
          <Card className="bg-white border-neutral-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{completedTasks}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </Card>
          <Card className="bg-white border-neutral-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Registered Farms</p>
                <p className="text-2xl font-black text-neutral-900 mt-1">{farms.length}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                <Compass className="h-5 w-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Filters:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedFarmFilter}
              onChange={(e) => setSelectedFarmFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 bg-white text-neutral-700 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All Farms ({farms.length})</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name} ({farm.village})
                </option>
              ))}
            </select>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 bg-white text-neutral-700 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Today">Today</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
        </div>

        {/* Tasks List Content */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="h-8 w-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-3" />
            <p className="text-neutral-400 text-sm font-semibold">Loading farm schedule...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="border border-dashed border-neutral-200 py-16 text-center bg-white">
            <CardContent className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                <CalendarRange className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-900 text-lg">No tasks planned yet</h3>
                <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                  Start by adding your first field activity or generate a full AI crop schedule based on your farm’s soil and crops.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add First Task</span>
                </Button>
                {farms.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setIsAiModalOpen(true)}
                    className="gap-2 border-primary-300 text-primary-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Auto-Generate with AI</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((evt) => {
              const typeConfig = EVENT_TYPE_COLORS[evt.eventType] || EVENT_TYPE_COLORS.CUSTOM;
              const TypeIcon = typeConfig.icon;
              const isDone = evt.status === 'Completed';

              return (
                <div
                  key={evt.id}
                  className={`bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDone ? 'border-neutral-100 opacity-75 bg-neutral-50/50' : 'border-neutral-100 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => handleToggleStatus(evt)}
                      className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-neutral-300 hover:border-emerald-500 text-transparent'
                      }`}
                      title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </button>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            isDone ? 'line-through text-neutral-400' : 'text-neutral-900'
                          }`}
                        >
                          {evt.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeConfig.bg} ${typeConfig.text} flex items-center gap-1`}>
                          <TypeIcon className="h-2.5 w-2.5" />
                          {evt.eventType.replace('_', ' ')}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORITY_BADGES[evt.priority] || 'bg-neutral-100 text-neutral-600'}`}>
                          {evt.priority}
                        </span>
                      </div>
                      {evt.description && (
                        <p className="text-xs text-neutral-500 font-medium max-w-xl">{evt.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-semibold pt-1">
                        <span className="flex items-center gap-1 text-neutral-600">
                          <Compass className="h-3.5 w-3.5 text-primary-600" />
                          {evt.farm?.name || 'Assigned Farm'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {evt.startDate} {evt.startTime ? `at ${evt.startTime}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="text-neutral-400 hover:text-red-600 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Create Event */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-bold text-neutral-900">Add Field Task / Event</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-neutral-700">Select Farm *</Label>
                  <select
                    value={newEvent.farmId}
                    onChange={(e) => setNewEvent({ ...newEvent, farmId: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  >
                    {farms.length === 0 && <option value="">No farms available. Add farm first.</option>}
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.village})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-bold text-neutral-700">Task Title *</Label>
                  <Input
                    placeholder="e.g. Irrigation Cycle 2 or Apply Urea"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-neutral-700">Task Type</Label>
                    <select
                      value={newEvent.eventType}
                      onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                      className="w-full mt-1.5 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="CUSTOM">Custom Task</option>
                      <option value="IRRIGATION">Irrigation</option>
                      <option value="FERTILIZER">Fertilizer Application</option>
                      <option value="PESTICIDE">Pesticide Spray</option>
                      <option value="SEEDING">Seeding / Sowing</option>
                      <option value="HARVEST">Harvesting</option>
                      <option value="SOIL_TEST">Soil Testing</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-neutral-700">Priority</Label>
                    <select
                      value={newEvent.priority}
                      onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
                      className="w-full mt-1.5 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-neutral-700">Scheduled Date *</Label>
                    <Input
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-neutral-700">Scheduled Time</Label>
                    <Input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold text-neutral-700">Instructions / Notes</Label>
                  <Textarea
                    placeholder="Specific details, dosage quantity, pump hours, etc."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving Task...' : 'Schedule Task'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: AI Schedule Generator */}
        {isAiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 leading-tight">AI Crop Schedule</h3>
                    <p className="text-xs text-neutral-500">Auto-generate customized seasonal tasks</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleGenerateAiSchedule} className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-neutral-700">Target Farm</Label>
                  <select
                    value={selectedAiFarmId}
                    onChange={(e) => setSelectedAiFarmId(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  >
                    {farms.length === 0 && <option value="">No farms found. Please create a farm first.</option>}
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} {f.crop?.cropName ? `(${f.crop.cropName})` : ''} - {f.village}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-primary-50/60 border border-primary-100 rounded-xl p-3 text-xs text-primary-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary-700" />
                    How it works:
                  </p>
                  <p className="text-neutral-600 leading-relaxed">
                    Our agronomy AI analyzes your farm's crop variety, current growth stage, and soil properties to generate a recommended irrigation and nutrient schedule.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsAiModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={aiGenerating || farms.length === 0} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    {aiGenerating ? 'Generating...' : 'Generate Schedule'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
