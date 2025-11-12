'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet } from 'lucide-react';
import { Button, Badge } from '@/components/design-system';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

/**
 * Rewards Screen - ZZIK LIVE
 * 
 * Shows user's earnings and transactions:
 * - Total balance
 * - Pending rewards
 * - Transaction history
 * - Withdrawal options
 */

interface Transaction {
  id: string;
  type: 'earn' | 'withdraw';
  amount: number;
  description: string;
  status: 'completed' | 'pending';
  createdAt: Date;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'earn',
    amount: 18000,
    description: '강남 디저트 카페 미션 완료',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    type: 'earn',
    amount: 20000,
    description: '홍대 레스토랑 미션 완료',
    status: 'pending',
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    type: 'withdraw',
    amount: -50000,
    description: '계좌 출금',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '4',
    type: 'earn',
    amount: 15000,
    description: '성수 카페 미션 완료',
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000),
  },
];

export default function RewardsPage() {
  const [balance] = useState(83000);
  const [pending] = useState(20000);

  const totalEarned = mockTransactions
    .filter((t) => t.type === 'earn' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleWithdraw = () => {
    console.log('Withdraw funds');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-500 to-purple-600 text-white">
        <div className="px-6 py-8">
          <h1 className="text-lg font-semibold mb-6">내 보상</h1>

          {/* Balance Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">출금 가능 금액</span>
            </div>
            <div className="text-4xl font-bold mb-4">
              ₩{balance.toLocaleString()}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div>
                <div className="text-xs opacity-75">대기 중</div>
                <div className="text-lg font-semibold">₩{pending.toLocaleString()}</div>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={handleWithdraw}
                className="bg-white text-primary-600 border-white hover:bg-white/90"
              >
                출금하기
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="px-6 -mt-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success-600" />
              <span className="text-xs text-gray-600">총 수익</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₩{totalEarned.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-warning-600" />
              <span className="text-xs text-gray-600">완료 미션</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {mockTransactions.filter((t) => t.type === 'earn' && t.status === 'completed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <main className="px-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">거래 내역</h2>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {mockTransactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              variants={staggerItemVariants}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                {/* Left: Icon + Info */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earn'
                        ? 'bg-success-50'
                        : 'bg-error-50'
                    }`}
                  >
                    {transaction.type === 'earn' ? (
                      <ArrowDownLeft className="w-5 h-5 text-success-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-error-600" />
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Amount + Status */}
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      transaction.type === 'earn'
                        ? 'text-success-600'
                        : 'text-error-600'
                    }`}
                  >
                    {transaction.type === 'earn' ? '+' : ''}
                    ₩{Math.abs(transaction.amount).toLocaleString()}
                  </div>
                  <div className="mt-1">
                    <Badge
                      variant={
                        transaction.status === 'completed' ? 'success' : 'warning'
                      }
                      size="sm"
                    >
                      {transaction.status === 'completed' ? '완료' : '대기'}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {mockTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Coins className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              거래 내역이 없습니다
            </h3>
            <p className="text-gray-500">
              미션을 완료하면 거래 내역이 표시됩니다
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
