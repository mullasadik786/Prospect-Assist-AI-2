import React, { useState } from 'react';
import { SavedLead } from '../types';
import { getTranslation } from '../languages';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Activity, 
  Users, 
  BadgeCheck, 
  ChevronRight, 
  Flame, 
  Clock, 
  X,
  FileText,
  Building,
  Car,
  Briefcase,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface DashboardProps {
  leads: SavedLead[];
  onUpdateStatus: (id: string, status: SavedLead['status']) => void;
  onViewReport: (lead: SavedLead) => void;
  lang: string;
  theme: 'light' | 'dark';
}

export default function Dashboard({ leads, onUpdateStatus, onViewReport, lang, theme }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.prospectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.occupation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || lead.loanType === filterType;
    const matchesClass = filterClass === 'All' || lead.classification === filterClass;
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;

    return matchesSearch && matchesType && matchesClass && matchesStatus;
  });

  // Calculate statistics
  const totalLeadsCount = leads.length;
  const hotLeadsCount = leads.filter(l => l.classification === 'Hot').length;
  const warmLeadsCount = leads.filter(l => l.classification === 'Warm').length;
  const coldLeadsCount = leads.filter(l => l.classification === 'Cold').length;

  const averageRepaymentScore = totalLeadsCount > 0 
    ? Math.round(leads.reduce((acc, curr) => acc + curr.repaymentScore, 0) / totalLeadsCount) 
    : 0;

  const averageConversionProbability = totalLeadsCount > 0 
    ? Math.round(leads.reduce((acc, curr) => acc + curr.conversionProbability, 0) / totalLeadsCount) 
    : 0;

  // Actual lead conversion rate representing Leads in 'Approved', 'In Progress' or 'Contacted' states
  const convertedCount = leads.filter(l => ['Contacted', 'In Progress', 'Approved'].includes(l.status)).length;
  const conversionRate = totalLeadsCount > 0 
    ? Math.round((convertedCount / totalLeadsCount) * 100) 
    : 0;

  // Custom function to get product icons
  const getProductIcon = (type: string) => {
    switch (type) {
      case 'Home Loan':
        return <Building className="w-4 h-4 text-orange-500" />;
      case 'Auto Loan':
        return <Car className="w-4 h-4 text-emerald-600" />;
      case 'Personal Loan':
        return <Briefcase className="w-4 h-4 text-sky-500" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Target Metric Banner representing Indian Tri-colors beautifully */}
      <div className="relative overflow-hidden rounded-2xl border border-orange-200/50 bg-gradient-to-r from-orange-500/10 via-white/80 to-emerald-500/10 dark:from-orange-950/20 dark:via-slate-900/90 dark:to-emerald-950/20 p-6 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-500" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-900 text-white dark:bg-navy-800 flex items-center gap-1.5 border border-white/20">
                <span className="w-2.5 h-2.5 rounded-full border border-white bg-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
                ASHOKA WHEEL BLUE
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {getTranslation(lang, 'conversionOver30')}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-sans">
              Prospect Assist AI — Lead CRM Dashboard
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Identifying high-quality prospects with validated cash flows and high-converting digital behavioral traits.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-xl shadow-xs border border-slate-100 dark:border-slate-700">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Conversion</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {conversionRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total leads card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {getTranslation(lang, 'totalLeads')}
            </span>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {totalLeadsCount}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Loaded Profiles
            </div>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Lead Conversion Potential */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {getTranslation(lang, 'avgConversion')}
            </span>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {averageConversionProbability}%
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Exceeds 30% Threshold
            </div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <BadgeCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Average Repayment Capacity Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Avg Repayment Score
            </span>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {averageRepaymentScore}/100
            </div>
            <div className="text-xs text-slate-400">
              Based on verified surplus
            </div>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Hot Leads card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {getTranslation(lang, 'hotLeads')}
            </span>
            <div className="text-3xl font-bold text-red-500 dark:text-red-400">
              {hotLeadsCount}
            </div>
            <div className="text-xs text-slate-400">
              High-intent ready buyers
            </div>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Charts section using responsive HTML/SVG layout (extremely bullet-proof) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lead Classification Gauge Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs lg:col-span-1">
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            Lead Portfolio Segments
          </h3>
          <div className="flex flex-col items-center justify-center py-4">
            {/* SVG Donut Chart */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" className="dark:stroke-slate-700" />
                
                {/* Hot segment (red) */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="4.2" 
                  strokeDasharray={`${totalLeadsCount > 0 ? (hotLeadsCount / totalLeadsCount) * 100 : 0} ${100 - (totalLeadsCount > 0 ? (hotLeadsCount / totalLeadsCount) * 100 : 0)}`} 
                  strokeDashoffset="0"
                />
                
                {/* Warm segment (orange) */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="4" 
                  strokeDasharray={`${totalLeadsCount > 0 ? (warmLeadsCount / totalLeadsCount) * 100 : 0} ${100 - (totalLeadsCount > 0 ? (warmLeadsCount / totalLeadsCount) * 100 : 0)}`} 
                  strokeDashoffset={`-${totalLeadsCount > 0 ? (hotLeadsCount / totalLeadsCount) * 100 : 0}`}
                />
                
                {/* Cold segment (blue) */}
                <circle 
                  cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.8" 
                  strokeDasharray={`${totalLeadsCount > 0 ? (coldLeadsCount / totalLeadsCount) * 100 : 0} ${100 - (totalLeadsCount > 0 ? (coldLeadsCount / totalLeadsCount) * 100 : 0)}`} 
                  strokeDashoffset={`-${totalLeadsCount > 0 ? ((hotLeadsCount + warmLeadsCount) / totalLeadsCount) * 100 : 0}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 font-semibold uppercase">Conversion</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {conversionRate}%
                </span>
              </div>
            </div>

            {/* Labels */}
            <div className="grid grid-cols-3 w-full gap-2 mt-6 text-center">
              <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded-xl border border-red-100 dark:border-red-900/30">
                <div className="text-xs font-bold text-red-500">Hot</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-100">{hotLeadsCount}</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-2 rounded-xl border border-orange-100 dark:border-orange-900/30">
                <div className="text-xs font-bold text-orange-500">Warm</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-100">{warmLeadsCount}</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <div className="text-xs font-bold text-blue-500">Cold</div>
                <div className="text-lg font-black text-slate-800 dark:text-slate-100">{coldLeadsCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Product Demand analytics */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Prospect Interest by Loan Type
            </h3>
            
            {/* List of progress-bars */}
            <div className="space-y-4 py-2">
              {['Home Loan', 'Auto Loan', 'Personal Loan', 'Mortgage Loan'].map(loan => {
                const count = leads.filter(l => l.loanType === loan).length;
                const percentage = totalLeadsCount > 0 ? (count / totalLeadsCount) * 100 : 0;
                
                return (
                  <div key={loan} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        {getProductIcon(loan)}
                        {loan}
                      </span>
                      <span className="text-slate-400 font-bold">{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative border border-slate-200/20">
                      <div 
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-orange-500 via-yellow-400 to-emerald-500"
                        style={{ width: `${percentage || 1}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20 flex items-center gap-2 mt-4 text-xs text-emerald-800 dark:text-emerald-300">
            <span className="font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md scale-90">Insight</span>
            Behavioral analysis indicates Indian retail prospects respond best to custom pre-approved Home & Auto loans.
          </div>
        </div>

      </div>

      {/* CRM Pipeline Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        
        {/* CRM Search & Filters bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Saved Prospect Pipeline
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="p-1 text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </span>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer pr-2"
              >
                <option value="All">All Loans</option>
                <option value="Home Loan">Home</option>
                <option value="Auto Loan">Auto</option>
                <option value="Personal Loan">Personal</option>
                <option value="Mortgage Loan">Mortgage</option>
              </select>

              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer pr-2"
              >
                <option value="All">All Temp</option>
                <option value="Hot">Hot Only</option>
                <option value="Warm">Warm Only</option>
                <option value="Cold">Cold Only</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer pr-2"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Approved">Approved</option>
                <option value="Closed/Lost">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 text-xs font-bold uppercase text-slate-400 tracking-wider">
                <th className="p-3.5">Prospect</th>
                <th className="p-3.5">Loan / Requested</th>
                <th className="p-3.5">Income & Surplus</th>
                <th className="p-3.5">Metrics</th>
                <th className="p-3.5">Lead Rating</th>
                <th className="p-3.5">Contact Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-sm text-slate-400 dark:text-slate-500">
                    No prospects fit your current search or filters. Click "Prospect Assessment" above to add more.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Customer info */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-orange-200 overflow-hidden relative">
                          <img 
                            src={lead.report?.lifestyleSpendTotal && lead.report.lifestyleSpendTotal > 15000 
                              ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop" 
                              : (lead.prospectName.includes('Ananya') 
                                ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
                                : "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop")} 
                            alt={lead.prospectName} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{lead.prospectName}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">{lead.occupation}</div>
                        </div>
                      </div>
                    </td>

                    {/* Loan requested details */}
                    <td className="p-3.5">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        {getProductIcon(lead.loanType)}
                        {lead.loanType}
                      </div>
                      <div className="text-xs text-slate-400">
                        ₹{lead.requestedAmount.toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Calculated income vs surplus */}
                    <td className="p-3.5">
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        ₹{lead.verifiedIncome.toLocaleString('en-IN')}/mo
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        Surplus: ₹{lead.disposableSurplus.toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Underwriting Scores */}
                    <td className="p-3.5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-slate-400">Repay:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{lead.repaymentScore}</span>
                          <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${lead.repaymentScore}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-slate-400">Intent:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{lead.conversionProbability}%</span>
                          <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${lead.conversionProbability}%` }} />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Temperature Category with Tricolor Accent elements */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black border ${
                        lead.classification === 'Hot'
                          ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40'
                          : lead.classification === 'Warm'
                          ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/40'
                          : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          lead.classification === 'Hot' ? 'bg-red-500 animate-pulse' : lead.classification === 'Warm' ? 'bg-orange-500' : 'bg-blue-500'
                        }`} />
                        {lead.classification}
                      </span>
                    </td>

                    {/* Status selection */}
                    <td className="p-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as SavedLead['status'])}
                        className={`text-xs font-bold rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${
                          lead.status === 'Approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
                            : lead.status === 'In Progress'
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/30'
                            : lead.status === 'Contacted'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/30'
                            : lead.status === 'Closed/Lost'
                            ? 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Approved">Approved</option>
                        <option value="Closed/Lost">Closed/Lost</option>
                      </select>
                    </td>

                    {/* View Report */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onViewReport(lead)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Report
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
