import React from 'react';
import { History, Search, Trash2, ArrowRight, Calendar, Building2, MapPin, Briefcase, Hash } from 'lucide-react';
import { SearchQueryRecord } from '../types';

interface SearchHistoryProps {
  history: SearchQueryRecord[];
  onRerunSearch: (record: SearchQueryRecord) => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onRerunSearch,
  onDeleteHistoryItem,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Search History Log
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View past client search parameters and re-run lead extraction in one click.
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-indigo-300 font-semibold border border-slate-700">
          {history.length} Saved Searches
        </span>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <History className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Search History Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Whenever you search for business leads on the dashboard, your query parameters and results count will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => (
            <div
              key={record.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    {record.businessType}
                  </span>

                  <span className="text-xs font-medium text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {record.location}
                  </span>

                  <span className="text-xs font-medium text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    {record.freelancerService}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(record.timestamp).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                    <Hash className="w-3.5 h-3.5" />
                    {record.resultsCount} leads generated
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onRerunSearch(record)}
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-900/20 transition-all"
                >
                  <span>Re-run Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteHistoryItem(record.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Delete from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
