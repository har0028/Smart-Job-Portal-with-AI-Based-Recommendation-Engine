import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, Check, ShieldCheck, Sparkles, BellRing, Star, Award, 
  ArrowRight, CreditCard, History, Clock, Crown
} from 'lucide-react'
import toast from 'react-hot-toast'
import PaymentModal from '../../components/common/PaymentModal'
import { paymentApi } from '../../api/paymentApi'
import { useAuth } from '../../context/AuthContext'

export default function SeekerProUpgrade() {
  const { user } = useAuth()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await paymentApi.getMyHistory()
      if (res.success) {
        setHistory(res.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const planDetails = {
    title: '👑 VIP Career Pass & Instant Alerts',
    amount: 199,
    paymentType: 'SEEKER_PRO',
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-slate-900 border border-amber-500/40 p-8 sm:p-12 text-white shadow-2xl"
      >
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md shadow-lg">
            <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>VIP Exclusive Candidate Pass</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Accelerate Your Career with <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300 bg-clip-text text-transparent">👑 VIP Career Pass</span>
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
            Get instant priority job alerts, 100% recruiter visibility, and a verified VIP Gold Candidate Badge on all your applications!
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {user?.isProUser ? (
              <div className="px-6 py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Active VIP Membership (Expires: {user?.proExpiryDate ? new Date(user.proExpiryDate).toLocaleDateString() : 'Active'})
              </div>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-600 hover:from-amber-600 hover:to-pink-700 text-white font-black text-lg shadow-2xl shadow-amber-500/30 flex items-center gap-3 transition-all hover:scale-105 cursor-pointer"
              >
                Get 👑 VIP Pass (₹199/mo)
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
            <BellRing className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Instant Company Post Alerts</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            As soon as any company or recruiter posts a new job in your target domain, you get an immediate priority notification alert.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Priority Application Badge</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Your job applications are highlighted to recruiters with a verified Pro badge, positioning you at the top of candidate pools.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">AI Match Engine Priority</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Get personalized smart recommendations with deep score breakdowns and tailored skill gap advice.
          </p>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-lg">
          <History className="w-5 h-5 text-indigo-400" />
          Payment History
        </div>

        {loading ? (
          <div className="text-center py-6 text-slate-500 text-sm">Loading transactions...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No previous payments found. Upgrade now to view receipts here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="p-3 rounded-l-xl">Transaction ID</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono text-xs text-indigo-300">{tx.transactionId}</td>
                    <td className="p-3 font-medium text-white">{tx.paymentType}</td>
                    <td className="p-3 font-bold text-emerald-400">₹{tx.amount}</td>
                    <td className="p-3 text-xs">{tx.paymentMethod}</td>
                    <td className="p-3 text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          fetchHistory()
          window.location.reload()
        }}
        planDetails={planDetails}
      />
    </div>
  )
}
