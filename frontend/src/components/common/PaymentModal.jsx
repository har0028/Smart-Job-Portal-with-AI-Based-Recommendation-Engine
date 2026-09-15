import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, CreditCard, Smartphone, Building2, CheckCircle2, 
  ShieldCheck, Lock, Sparkles, Loader2, ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import { paymentApi } from '../../api/paymentApi'

export default function PaymentModal({ isOpen, onClose, onSuccess, planDetails }) {
  const [method, setMethod] = useState('UPI') // UPI, CARD, NETBANKING
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [bank, setBank] = useState('HDFC')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen || !planDetails) return null

  const handlePay = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate small payment gateway handshake delay for premium feel
      await new Promise((res) => setTimeout(res, 1200))

      const payload = {
        paymentType: planDetails.paymentType,
        amount: planDetails.amount,
        currency: 'INR',
        paymentMethod: method,
        relatedJobId: planDetails.relatedJobId || null,
      }

      const res = await paymentApi.processPayment(payload)

      if (res.success) {
        setSuccess(true)
        toast.success('Payment Successful! Benefits unlocked.')
        setTimeout(() => {
          setSuccess(false)
          setLoading(false)
          onSuccess && onSuccess(res.data)
          onClose()
        }, 1800)
      } else {
        toast.error(res.message || 'Payment processing failed')
        setLoading(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment transaction error')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white">
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                Secure Checkout
              </span>
            </div>
            <h3 className="text-xl font-bold">{planDetails.title}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">₹{planDetails.amount}</span>
              <span className="text-sm text-indigo-100 font-medium">INR (Inclusive of Taxes)</span>
            </div>
          </div>

          {/* Content */}
          {success ? (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Payment Verified!</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Thank you! Your transaction has completed and your feature is now active.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePay} className="p-6 space-y-6">
              {/* Payment Methods Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod('UPI')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all ${
                      method === 'UPI'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-1 text-indigo-600 dark:text-indigo-400" />
                    UPI / Apps
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('CARD')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all ${
                      method === 'CARD'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1 text-indigo-600 dark:text-indigo-400" />
                    Credit/Debit
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('NETBANKING')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium transition-all ${
                      method === 'NETBANKING'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-1 text-indigo-600 dark:text-indigo-400" />
                    NetBanking
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs based on Method */}
              {method === 'UPI' && (
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    VPA / UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="user@upi or 9876543210@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                  <p className="text-xs text-slate-500">
                    Instant authorization via UPI app callback or sandbox payment auto-capture.
                  </p>
                </div>
              )}

              {method === 'CARD' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4111 2222 3333 4444"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="***"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'NETBANKING' && (
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Select Your Bank
                  </label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Submit & Trust Badge */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay ₹{planDetails.amount} Now
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>256-bit SSL Encrypted • Instant Sandbox & Gateway Auto-Capture</span>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
