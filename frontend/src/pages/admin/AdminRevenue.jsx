import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  IndianRupee, TrendingUp, Sparkles, Zap, ShieldCheck, 
  CreditCard, ArrowUpRight, DollarSign, Calendar, RefreshCw
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts'
import toast from 'react-hot-toast'
import { paymentApi } from '../../api/paymentApi'

export default function AdminRevenue() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchRevenueStats = async () => {
    try {
      setLoading(true)
      const res = await paymentApi.getRevenueStats()
      if (res.success) {
        setStats(res.data)
      }
    } catch (err) {
      toast.error('Failed to load revenue statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRevenueStats()
  }, [])

  const pieData = stats ? [
    { name: 'Featured Job Listings', value: Number(stats.featuredJobsRevenue || 0), color: '#8b5cf6' },
    { name: 'Seeker Pro Subscriptions', value: Number(stats.seekerProRevenue || 0), color: '#ec4899' },
  ] : []

  const barData = stats ? [
    { category: 'Featured Jobs', amount: Number(stats.featuredJobsRevenue || 0) },
    { category: 'Seeker Pro', amount: Number(stats.seekerProRevenue || 0) },
    { category: 'Total Net Revenue', amount: Number(stats.totalRevenue || 0) },
  ] : []

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Monetization Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Platform Earnings & Revenue Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time financial performance, employer featured job payouts, and candidate subscriptions.
          </p>
        </div>

        <button
          onClick={fetchRevenueStats}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-semibold flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 backdrop-blur-xl relative overflow-hidden shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Total Platform Revenue</span>
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Combined gross earnings from all channels</p>
        </motion.div>

        {/* Card 2: Featured Jobs Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Featured Job Listings</span>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">
              ₹{stats?.featuredJobsRevenue ? stats.featuredJobsRevenue.toLocaleString() : 0}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Employer featured post packages</p>
        </motion.div>

        {/* Card 3: Seeker Pro Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Seeker Pro Pass</span>
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">
              ₹{stats?.seekerProRevenue ? stats.seekerProRevenue.toLocaleString() : 0}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Candidate instant alert subscriptions</p>
        </motion.div>

        {/* Card 4: Total Completed Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Paid Transactions</span>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">
              {stats?.totalTransactions || 0}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Successful completed payments</p>
        </motion.div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Revenue breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Revenue Breakdown by Stream</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(value) => [`₹${value}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#8b5cf6' : index === 1 ? '#ec4899' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Share */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Monetization Share Ratio</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100">All Recent Transactions</h3>
        {loading ? (
          <div className="py-8 text-center text-slate-500 text-sm">Loading transactions...</div>
        ) : !stats?.recentTransactions || stats.recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">No transaction records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Txn ID</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Plan Type</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-mono text-xs text-indigo-400 font-semibold">{tx.transactionId}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{tx.userName}</div>
                      <div className="text-xs text-slate-400">{tx.userEmail}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        tx.paymentType === 'JOB_FEATURE'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                      }`}>
                        {tx.paymentType}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400 text-base">₹{tx.amount}</td>
                    <td className="p-3.5 text-xs">{tx.paymentMethod}</td>
                    <td className="p-3.5 text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
