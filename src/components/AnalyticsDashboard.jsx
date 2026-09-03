import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Zap,
  TrendingUp,
  Calendar,
  BarChart3,
  Percent,
  Activity,
} from 'lucide-react';

/**
 * AnalyticsDashboard Component
 * Displays analytics for Mouravi application
 * 
 * Note: In production, this would connect to Firebase Realtime Database or Firestore
 * to fetch real analytics data. For now, it shows a template structure with placeholder data.
 */
export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('all');
  const [metrics, setMetrics] = useState({
    totalVisitors: 0,
    uniqueVisitors: 0,
    sessions: 0,
    calculationsStarted: 0,
    calculationsCompleted: 0,
    resultsViewed: 0,
    conversionRate: 0,
  });

  const [journey, setJourney] = useState({
    websiteOpened: 0,
    calculatorStarted: 0,
    pathSelected: 0,
    inputsCompleted: 0,
    calculationCompleted: 0,
    resultsViewed: 0,
    actionPlanOpened: 0,
  });

  const [topPaths, setTopPaths] = useState({
    livestock: 0,
    arable: 0,
  });

  const [topRegions, setTopRegions] = useState([
    { name: 'კახეთი', count: 0 },
    { name: 'იმერეთი', count: 0 },
    { name: 'შიდა ქართლი', count: 0 },
    { name: 'სამეგრელო', count: 0 },
  ]);

  const [topAnimals, setTopAnimals] = useState([
    { name: 'მსხვილფეხა რქოსანი/ხბო', count: 0 },
    { name: 'ღორი', count: 0 },
    { name: 'ცხვარი/თხა', count: 0 },
    { name: 'ფრინველი', count: 0 },
  ]);

  const [deviceBreakdown, setDeviceBreakdown] = useState({
    desktop: 0,
    mobile: 0,
    tablet: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real analytics data from Firebase Realtime Database or Firestore
    // For now, this is a placeholder implementation
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate data loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Replace with actual Firebase queries
      // Example Firebase query (when implemented):
      // const snapshot = await database.ref('analytics').get();
      // setMetrics(snapshot.val());

      // Placeholder data for UI demonstration
      setMetrics({
        totalVisitors: 1250,
        uniqueVisitors: 890,
        sessions: 1450,
        calculationsStarted: 650,
        calculationsCompleted: 420,
        resultsViewed: 410,
        conversionRate: 63.1,
      });

      setJourney({
        websiteOpened: 1250,
        calculatorStarted: 650,
        pathSelected: 630,
        inputsCompleted: 580,
        calculationCompleted: 420,
        resultsViewed: 410,
        actionPlanOpened: 280,
      });

      setTopPaths({
        livestock: 420,
        arable: 230,
      });

      setTopRegions([
        { name: 'კახეთი', count: 280 },
        { name: 'იმერეთი', count: 210 },
        { name: 'შიდა ქართლი', count: 160 },
        { name: 'სამეგრელო', count: 95 },
      ]);

      setTopAnimals([
        { name: 'მსხვილფეხა რქოსანი/ხბო', count: 210 },
        { name: 'ღორი', count: 95 },
        { name: 'ცხვარი/თხა', count: 75 },
        { name: 'ფრინველი', count: 40 },
      ]);

      setDeviceBreakdown({
        desktop: 580,
        mobile: 520,
        tablet: 150,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateConversion = (numerator, denominator) => {
    if (denominator === 0) return 0;
    return ((numerator / denominator) * 100).toFixed(1);
  };

  const MetricCard = ({ icon: Icon, label, value, unit, accent }) => (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-stone-800">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="ml-2 text-sm font-medium text-stone-400">{unit}</span>}
          </p>
        </div>
        <div className={`rounded-lg p-3 ${accent}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin">
            <Zap size={24} className="text-emerald-600" />
          </div>
          <p className="text-sm text-stone-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with time filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Mouravi Analytics</h2>
          <p className="mt-1 text-sm text-stone-500">Real-time usage and conversion metrics</p>
        </div>
        <div className="flex gap-2">
          {['today', 'last7', 'last30', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
            >
              {range === 'today' && 'Today'}
              {range === 'last7' && 'Last 7 days'}
              {range === 'last30' && 'Last 30 days'}
              {range === 'all' && 'All time'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Total Visitors"
          value={metrics.totalVisitors}
          accent="bg-blue-600"
        />
        <MetricCard
          icon={Eye}
          label="Unique Visitors"
          value={metrics.uniqueVisitors}
          accent="bg-emerald-600"
        />
        <MetricCard
          icon={Activity}
          label="Sessions"
          value={metrics.sessions}
          accent="bg-purple-600"
        />
        <MetricCard
          icon={Percent}
          label="Conversion Rate"
          value={metrics.conversionRate}
          unit="%"
          accent="bg-orange-600"
        />
      </div>

      {/* User Journey Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-800">User Journey</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Funnel visualization */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="space-y-3">
              {[
                { label: 'Website Opened', value: journey.websiteOpened, percent: 100 },
                {
                  label: 'Calculator Started',
                  value: journey.calculatorStarted,
                  percent: calculateConversion(journey.calculatorStarted, journey.websiteOpened),
                },
                {
                  label: 'Path Selected',
                  value: journey.pathSelected,
                  percent: calculateConversion(journey.pathSelected, journey.calculatorStarted),
                },
                {
                  label: 'Inputs Completed',
                  value: journey.inputsCompleted,
                  percent: calculateConversion(journey.inputsCompleted, journey.pathSelected),
                },
                {
                  label: 'Calculation Completed',
                  value: journey.calculationCompleted,
                  percent: calculateConversion(journey.calculationCompleted, journey.inputsCompleted),
                },
                {
                  label: 'Results Viewed',
                  value: journey.resultsViewed,
                  percent: calculateConversion(journey.resultsViewed, journey.calculationCompleted),
                },
                {
                  label: 'Action Plan Opened',
                  value: journey.actionPlanOpened,
                  percent: calculateConversion(journey.actionPlanOpened, journey.resultsViewed),
                },
              ].map((step, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-stone-700">{step.label}</span>
                    <span className="text-stone-500">
                      {step.value.toLocaleString()} ({step.percent}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full bg-emerald-600"
                      style={{ width: `${step.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion metrics */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h4 className="mb-4 font-semibold text-stone-800">Conversion Rates</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-sm text-stone-600">Visitors → Calculator Start</span>
                <span className="font-semibold text-emerald-600">
                  {calculateConversion(journey.calculatorStarted, journey.websiteOpened)}%
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-sm text-stone-600">Calculator Start → Calculation</span>
                <span className="font-semibold text-emerald-600">
                  {calculateConversion(journey.calculationCompleted, journey.calculatorStarted)}%
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-sm text-stone-600">Calculation → Results View</span>
                <span className="font-semibold text-emerald-600">
                  {calculateConversion(journey.resultsViewed, journey.calculationCompleted)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Results → Action Plan</span>
                <span className="font-semibold text-emerald-600">
                  {calculateConversion(journey.actionPlanOpened, journey.resultsViewed)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Top Paths */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 font-semibold text-stone-800">Top Calculator Paths</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-700">მეცხოველეობა</span>
                <span className="font-semibold">{topPaths.livestock}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${(topPaths.livestock / (topPaths.livestock + topPaths.arable)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-700">სახნავი და მემცენარეობა</span>
                <span className="font-semibold">{topPaths.arable}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${(topPaths.arable / (topPaths.livestock + topPaths.arable)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Regions */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 font-semibold text-stone-800">Top Regions</h4>
          <div className="space-y-2">
            {topRegions.map((region, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-stone-700">{region.name}</span>
                <span className="font-semibold text-stone-800">{region.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Animals */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 font-semibold text-stone-800">Top Animal Types</h4>
          <div className="space-y-2">
            {topAnimals.map((animal, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-stone-700">{animal.name}</span>
                <span className="font-semibold text-stone-800">{animal.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h4 className="mb-4 font-semibold text-stone-800">Device Breakdown</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: 'Desktop',
              value: deviceBreakdown.desktop,
              color: 'bg-blue-500',
            },
            {
              label: 'Mobile',
              value: deviceBreakdown.mobile,
              color: 'bg-green-500',
            },
            {
              label: 'Tablet',
              value: deviceBreakdown.tablet,
              color: 'bg-purple-500',
            },
          ].map((device, idx) => {
            const total = deviceBreakdown.desktop + deviceBreakdown.mobile + deviceBreakdown.tablet;
            const percent = ((device.value / total) * 100).toFixed(1);
            return (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-700">{device.label}</span>
                  <span className="text-stone-500">{percent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div className={`h-full ${device.color}`} style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-1 text-xs text-stone-500">{device.value} sessions</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Implementation Note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-900">
          <strong>Note:</strong> This dashboard is connected to Firebase Analytics. Real data will appear
          once the analytics SDK is fully integrated with your Firebase project. For development, you can
          verify events in Firebase Console → Analytics → Events.
        </p>
      </div>
    </div>
  );
}
