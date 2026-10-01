'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Camera, ShieldAlert, Sparkles, CheckCircle2, AlertCircle, Eye, Trash2, Filter, ArrowUpRight, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button, Card, CardContent, Heading, Label } from '@agribandhu/ui';

interface Farm {
  id: string;
  name: string;
  village: string;
}

interface ReportItem {
  id: string;
  prediction: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  imageUrl: string;
  farm: {
    name: string;
  };
}

export default function DiseaseDetectionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [farms, setFarms] = React.useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = React.useState<string>('');
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const [analyzing, setAnalyzing] = React.useState(false);
  const [scanStep, setScanStep] = React.useState(0);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // History states
  const [reports, setReports] = React.useState<ReportItem[]>([]);
  const [severityFilter, setSeverityFilter] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('newest');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loadingHistory, setLoadingHistory] = React.useState(true);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load farms on mount
  React.useEffect(() => {
    async function loadFarms() {
      try {
        const res = await fetch('/api/farms');
        if (res.ok) {
          const data = await res.json();
          setFarms(data);
          if (data.length > 0) setSelectedFarmId(data[0].id);
        }
      } catch (err) {
        console.error('Error loading farms:', err);
      }
    }
    loadFarms();
  }, []);

  // Fetch reports history
  const fetchReports = async () => {
    try {
      setLoadingHistory(true);
      let url = `/api/disease/history?sort=${sortOrder}`;
      if (severityFilter) url += `&severity=${severityFilter}`;
      if (searchQuery) url += `&disease=${searchQuery}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Error loading reports history:', err);
    } fontally: {
      setLoadingHistory(false);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, [sortOrder, severityFilter, searchQuery]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds 10 MB limit.');
      return;
    }
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(f.type)) {
      setErrorMsg('Unsupported format. Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleRunAnalysis = async () => {
    if (!file) {
      setErrorMsg('Please select or drop a crop leaf photo to analyze.');
      return;
    }
    if (!selectedFarmId) {
      setErrorMsg('Please select a farm location.');
      return;
    }

    setErrorMsg(null);
    setAnalyzing(true);
    setScanStep(1);

    // Simulate scanning animation steps
    const stepTimer1 = setTimeout(() => setScanStep(2), 800);
    const stepTimer2 = setTimeout(() => setScanStep(3), 1600);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('farmId', selectedFarmId);

    try {
      const res = await fetch('/api/disease/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI Analysis failed.');

      // Redirect to full report details page
      router.push(`/dashboard/reports/${data.report.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'AI Analysis failed. Please try again.');
      setAnalyzing(false);
      setScanStep(0);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
    }
  };

  const handleDeleteReport = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this disease report record?')) return;

    try {
      const res = await fetch(`/api/disease/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed.');
      fetchReports();
    } catch (err: any) {
      alert(err.message || 'Failed to delete report.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Flagship AI Module
            </span>
          </div>
          <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
            AI Crop Disease Scanner
          </Heading>
          <p className="text-neutral-500 text-sm sm:text-base">
            Upload leaf photos for instant neural disease diagnostics, chemical treatments, and organic remedies.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-destructive-50 border border-destructive-100 p-3.5 text-xs sm:text-sm font-semibold text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* AI Scanner Main Card */}
        <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
          <CardContent className="p-0 space-y-6">
            {/* Step 1: Select Farm */}
            <div className="space-y-2">
              <Label htmlFor="farmSelect">Select Farm Location</Label>
              {farms.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-200 p-4 text-center space-y-3 bg-neutral-50/50">
                  <p className="text-xs text-neutral-500 font-bold">
                    ⚠️ No registered farms found. You must register at least one farm before running AI crop disease scans.
                  </p>
                  <Link href="/dashboard/farms/new">
                    <Button size="sm" variant="outline" className="text-xs">
                      Register a Farm
                    </Button>
                  </Link>
                </div>
              ) : (
                <select
                  id="farmSelect"
                  className="flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus:outline-none font-medium"
                  value={selectedFarmId}
                  onChange={(e: any) => setSelectedFarmId(e.target.value)}
                  disabled={analyzing}
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.village})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Step 2: Drag & Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => !analyzing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
                previewUrl
                  ? 'border-primary-400 bg-primary-50/10'
                  : 'border-neutral-200 hover:border-primary-400 hover:bg-neutral-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                disabled={analyzing}
              />

              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-h-48 mx-auto rounded-xl shadow-md object-cover border border-neutral-100"
                  />
                  <div>
                    <p className="text-xs font-bold text-neutral-800">{file?.name}</p>
                    <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                      {file && (file.size / (1024 * 1024)).toFixed(2)} MB • Click to replace
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-extrabold text-neutral-900 text-base">
                      Drag & drop leaf photo here, or <span className="text-primary-600 underline">browse file</span>
                    </p>
                    <p className="text-xs text-neutral-400 font-medium">
                      Supports JPG, PNG, WEBP up to 10 MB.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Scanning Progress steps animation */}
            <AnimatePresence>
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-primary-100 bg-primary-50/20 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary-600 animate-spin" />
                      <span className="font-bold text-neutral-900 text-sm">Processing Neural Diagnostics...</span>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-primary-700">Vision v2.4</span>
                  </div>

                  <div className="space-y-2 text-xs font-semibold text-neutral-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${scanStep >= 1 ? 'text-primary-600' : 'text-neutral-300'}`} />
                      <span>Validating and compressing high-resolution leaf image</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${scanStep >= 2 ? 'text-primary-600' : 'text-neutral-300'}`} />
                      <span>Scanning fungal, bacterial, and viral patholeisons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${scanStep >= 3 ? 'text-primary-600' : 'text-neutral-300'}`} />
                      <span>Generating plain-language treatment & organic remedies plan</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                onClick={handleRunAnalysis}
                disabled={analyzing || !file}
                className="flex-grow flex items-center justify-center gap-2 h-12 text-base shadow-md"
              >
                <Sparkles className="h-5 w-5" />
                <span>{analyzing ? 'Analyzing Image...' : 'Run AI Disease Scanner'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History & Filter Section */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <h3 className="text-xl font-extrabold text-neutral-900">Diagnosis History</h3>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter by disease..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none w-40"
                />
              </div>

              {/* Severity Filter */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none bg-white"
              >
                <option value="">All Severities</option>
                <option value="Low">Low Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="High">High Severity</option>
                <option value="Critical">Critical Severity</option>
              </select>

              {/* Sort */}
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="confidence">Highest Confidence</option>
              </select>
            </div>
          </div>

          {loadingHistory ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-semibold">Loading diagnostic history...</div>
          ) : reports.length === 0 ? (
            <Card className="border border-neutral-100 bg-white py-12 text-center">
              <CardContent className="space-y-2">
                <ShieldAlert className="h-8 w-8 text-neutral-300 mx-auto" />
                <p className="text-neutral-500 font-semibold text-sm">No previous disease reports found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((rep) => (
                <Link key={rep.id} href={`/dashboard/reports/${rep.id}`} className="group">
                  <Card className="border border-neutral-100 bg-white hover:border-primary-100 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                    <div className="h-40 w-full bg-neutral-100 relative overflow-hidden">
                      <img
                        src={rep.imageUrl}
                        alt={rep.prediction}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className={`absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          rep.severity === 'Critical'
                            ? 'bg-destructive text-white'
                            : rep.severity === 'High'
                            ? 'bg-accent-yellow-500 text-white'
                            : rep.severity === 'Medium'
                            ? 'bg-accent-yellow-100 text-accent-yellow-800'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {rep.severity}
                      </span>
                    </div>

                    <CardContent className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                          <span>{rep.farm.name}</span>
                          <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-extrabold text-neutral-900 text-base group-hover:text-primary-600 transition-colors leading-tight">
                          {rep.prediction}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-50 text-xs font-semibold">
                        <span className="text-primary-700 bg-primary-50 px-2 py-0.5 rounded font-extrabold">
                          {rep.confidence}% Confidence
                        </span>
                        <div className="flex items-center gap-1 text-primary-600 font-bold">
                          <span>View Report</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
