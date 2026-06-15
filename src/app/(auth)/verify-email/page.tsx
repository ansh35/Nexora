import { verifyEmail } from "@/actions/auth"
import Link from "next/link"
import { Shield, CheckCircle, XCircle } from "lucide-react"

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="bg-white/[0.05] border border-white/10 p-8 rounded-[24px] max-w-md w-full text-center backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.12)]">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Missing Verification Token</h1>
        <p className="text-neutral-400 mb-8">No token was provided in the link. Please check your email and try again.</p>
        <Link href="/login" className="inline-block w-full bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
          Back to Login
        </Link>
      </div>
    )
  }

  const result = await verifyEmail(token);

  return (
    <div className="bg-white/[0.05] border border-white/10 p-8 rounded-[24px] max-w-md w-full text-center backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.12)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22D3EE] to-[#06B6D4]"></div>
      
      {result.success ? (
        <>
          <CheckCircle className="w-16 h-16 text-[#22D3EE] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          <h1 className="text-2xl font-bold text-white mb-2">Email Verified</h1>
          <p className="text-neutral-400 mb-8">{result.success}</p>
          <Link href="/dashboard" className="inline-block w-full bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            Go to Dashboard
          </Link>
        </>
      ) : (
        <>
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
          <p className="text-neutral-400 mb-8">{result.error}</p>
          <Link href="/login" className="inline-block w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold py-3 rounded-xl transition-colors">
            Back to Login
          </Link>
        </>
      )}
    </div>
  )
}
