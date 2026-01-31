
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', accidents: 4, snacks: 12 },
  { name: 'Tue', accidents: 2, snacks: 15 },
  { name: 'Wed', accidents: 8, snacks: 10 },
  { name: 'Thu', accidents: 1, snacks: 22 },
  { name: 'Fri', accidents: 12, snacks: 5 },
  { name: 'Sat', accidents: 5, snacks: 18 },
  { name: 'Sun', accidents: 3, snacks: 20 },
];

const COLORS = ['#ef4444', '#3b82f6'];

const StatsOverview: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Weekly Performance</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs font-bold text-slate-500 uppercase">Accidents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-bold text-slate-500 uppercase">Snack Consumption</span>
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="accidents" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="snacks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-black text-red-500">35</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Incidents</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-blue-500">102</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Snacks</p>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
