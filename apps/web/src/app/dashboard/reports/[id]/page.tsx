'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, Download, Trash2, Sprout, Leaf, Activity, Stethoscope, Compass, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button, Card, CardContent, Heading } from '@agribandhu/ui';

interface DiseaseReportDetail {
  id: string;
  prediction: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  symptoms: string; // JSON string
  causes: string;
  treatment: string;
  organicRemedy: string;
  prevention: string;
  imageUrl: string;
  thumbnailUrl: string;
  status: string;
  createdAt: string;
  farm: {
    id: string;
    name: string;
    village: string;
    district: string;
    state: string;
  };
  history: {
    processingTime: number;
    modelVersion: string;
  }[];
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = React.useState<DiseaseReportDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/disease/${reportId}`);
        if (!res.ok) throw new Error('Disease report not found.');
        const data = await res.json();
        setReport(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    }
    if (reportId) fetchReport();
  }, [reportId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this disease report record?')) return;
    try {
      const res = await fetch(`/api/disease/${reportId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed.');
      router.push('/dashboard/disease-detection');
    } catch (err: any) {
      alert(err.message || 'Error deleting report.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-3" />
          <p className="text-neutral-400 text-sm font-semibold">Generating disease report...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center space-y-4 max-w-md mx-auto">
          <Heading level="h2">Report Not Found</Heading>
          <p className="text-neutral-500">The requested disease diagnostic report could not be loaded.</p>
          <Link href="/dashboard/disease-detection">
            <Button>Back to Scanner</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Parse symptoms JSON safely
  let visibleSymptoms: string[] = [];
  let hiddenSymptoms: string[] = [];
  try {
    const parsed = JSON.parse(report.symptoms);
    visibleSymptoms = parsed.visible || [];
    hiddenSymptoms = parsed.hidden || [];
  } catch (e) {
    visibleSymptoms = [report.symptoms];
  }

  const isLowConfidence = report.confidence < 70;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Back Link & Top Bar Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/dashboard/disease-detection"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to AI Scanner & History</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute('href', dataStr);
                downloadAnchor.setAttribute('download', `agribandhu-disease-report-${report.id}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:bg-destructive-50 gap-2">
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Low Confidence Warning Banner */}
        {isLowConfidence && (
          <div className="rounded-xl border border-accent-yellow-200 bg-accent-yellow-50 p-4 text-accent-yellow-900 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-accent-yellow-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm font-semibold">
              <p className="font-extrabold text-accent-yellow-950">Low Confidence Warning ({report.confidence}%)</p>
              <p className="leading-relaxed">
                The prediction confidence score is below the 70% safety threshold. We strongly advise confirming with a local Krishi Vigyan Kendra (KVK) agricultural officer before spraying chemical fungicides.
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm">
          <CardContent className="p-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Image Column */}
              <div className="md:col-span-5 space-y-3">
                <div className="rounded-2xl border border-neutral-100 overflow-hidden bg-neutral-50 shadow-md">
                  <img src={report.imageUrl} alt={report.prediction} className="w-full h-64 object-cover" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-bold px-1">
                  <span>Detected: {new Date(report.createdAt).toLocaleDateString()}</span>
                  <span>Engine: {report.history[0]?.modelVersion || 'v2.4'}</span>
                </div>
              </div>

              {/* Title & Badge Column */}
              <div className="md:col-span-7 space-y-6 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        report.severity === 'Critical'
                          ? 'bg-destructive text-white'
                          : report.severity === 'High'
                          ? 'bg-accent-yellow-500 text-white'
                          : report.severity === 'Medium'
                          ? 'bg-accent-yellow-100 text-accent-yellow-800'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {report.severity} Severity
                    </span>
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                      {report.confidence}% Confidence
                    </span>
                  </div>

                  <Heading level="h1" className="text-3xl font-extrabold text-neutral-900 leading-tight">
                    {report.prediction}
                  </Heading>

                  <p className="text-sm font-medium text-neutral-500 flex items-center gap-1.5 pt-1">
                    <Compass className="h-4 w-4 text-primary-600 shrink-0" />
                    <span>
                      Farm: <strong className="text-neutral-900">{report.farm.name}</strong> ({report.farm.village}, {report.farm.district})
                    </span>
                  </p>
                </div>

                {/* Farmer Friendly Summary */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-xs font-bold text-primary-700 uppercase tracking-wider">Farmer Diagnosis Summary</p>
                  <p className="text-sm font-semibold text-neutral-700 leading-relaxed">{report.summary}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tabs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Card 1: Symptoms */}
          <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-50 pb-2 text-primary-600">
                <Stethoscope className="h-5 w-5" />
                <h3 className="font-extrabold text-neutral-900 text-lg">Key Symptoms to Monitor</h3>
              </div>

              <div className="space-y-3">
                {visibleSymptoms.map((sym, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-semibold text-neutral-700 leading-relaxed">{sym}</p>
                  </div>
                ))}

                {hiddenSymptoms.map((sym, i) => (
                  <div key={i} className="flex items-start gap-2.5 opacity-80">
                    <Activity className="h-4 w-4 text-accent-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-semibold text-neutral-700 leading-relaxed">{sym}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Pathogen Causes */}
          <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-50 pb-2 text-primary-600">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-extrabold text-neutral-900 text-lg">Infection Triggers & Causes</h3>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-700 leading-relaxed">
                {report.causes}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Chemical Treatments */}
          <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-50 pb-2 text-primary-600">
                <Activity className="h-5 w-5" />
                <h3 className="font-extrabold text-neutral-900 text-lg">Recommended Chemical Spray</h3>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-700 leading-relaxed">
                {report.treatment}
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Organic Remedies */}
          <Card className="border border-neutral-100 bg-white p-6 shadow-sm">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-50 pb-2 text-emerald-600">
                <Leaf className="h-5 w-5" />
                <h3 className="font-extrabold text-neutral-900 text-lg">Eco-Friendly Organic Remedies</h3>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-700 leading-relaxed">
                {report.organicRemedy}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Full Prevention Guidance Card */}
        <Card className="border border-neutral-100 bg-white p-6 sm:p-8 shadow-sm text-left">
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-50 pb-2 text-primary-600">
              <Sprout className="h-5 w-5" />
              <h3 className="font-extrabold text-neutral-900 text-xl">Long-Term Preventive Measures</h3>
            </div>
            <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
              {report.prevention}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
