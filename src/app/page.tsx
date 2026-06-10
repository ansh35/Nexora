import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4 sm:p-8 font-sans text-white">
      <div className="w-full max-w-md bg-white/[0.05] border border-white/10 p-8 rounded-[24px] backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Nexora
          </h1>
          <h2 className="text-xl font-medium text-[#22D3EE]">
            Scalable Foundation
          </h2>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">Welcome</h3>
            <p className="text-sm text-neutral-400 mt-1">
              Your premium SaaS architecture is ready.
            </p>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-white/10">
            <Link href="/register" className="block w-full">
              <Button className="w-full bg-[#22D3EE] hover:bg-[#06B6D4] text-[#070B14] font-semibold py-6 rounded-xl transition-colors">
                Get Started
              </Button>
            </Link>
            <Link href="/login" className="block w-full">
              <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white py-6 rounded-xl transition-colors">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
