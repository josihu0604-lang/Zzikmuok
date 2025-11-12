// src/components/salient/FAQ.tsx
// Salient 템플릿 스타일의 FAQ 섹션

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

const faqs = [
  {
    id: 1,
    category: '시작하기',
    question: '정말 팔로워 100명만 있어도 되나요?',
    answer: '네, 맞습니다! ZZIK LIVE는 나노 크리에이터를 위한 플랫폼이에요. 팔로워 100명 이상이면 바로 미션을 수행하고 수익을 창출할 수 있습니다. 대형 인플루언서와 경쟁할 필요 없이, 여러분만의 작은 커뮤니티와 함께 시작하세요.',
  },
  {
    id: 2,
    category: '수익',
    question: '미션당 15,000원은 고정인가요?',
    answer: '기본 미션은 15,000원이지만, 미션 난이도와 요구사항에 따라 10,000원~50,000원까지 다양합니다. 프리미엄 브랜드 미션의 경우 더 높은 보상을 제공하며, 여러분의 활동 이력과 퀄리티에 따라 더 좋은 미션을 받을 수 있어요.',
  },
  {
    id: 3,
    category: 'GPS 검증',
    question: 'GPS 검증은 어떻게 이루어지나요?',
    answer: '3단계 검증 시스템을 사용합니다. 1) 실시간 GPS 위치 확인 2) 체크인 시간 검증 3) 사진 메타데이터 확인. 이 모든 과정은 자동으로 이루어지며, 매장에 실제로 방문했을 때만 미션을 완료할 수 있어요. 가짜 체크인은 불가능합니다.',
  },
  {
    id: 4,
    category: '정산',
    question: '정산은 언제, 어떻게 받나요?',
    answer: '미션 완료 즉시 포인트가 적립되며, 10,000원 이상부터 출금 가능합니다. 출금 신청 후 영업일 기준 1-2일 내에 계좌로 입금됩니다. 수수료는 첫 달 무료, 이후 10%의 플랫폼 수수료가 있어요.',
  },
  {
    id: 5,
    category: '미션',
    question: '하루에 몇 개의 미션을 할 수 있나요?',
    answer: '하루 최대 3개까지 가능합니다. 같은 매장은 일주일에 1번만 방문 가능하고, 다양한 매장을 방문하도록 권장하고 있어요. 퀄리티 높은 콘텐츠를 만들어주시는 것이 중요합니다.',
  },
  {
    id: 6,
    category: '콘텐츠',
    question: '어떤 콘텐츠를 만들어야 하나요?',
    answer: '30초 이내의 짧은 릴스나 스토리, 또는 피드 포스트를 올리시면 됩니다. 매장 분위기, 메뉴, 특별한 포인트 등을 자연스럽게 소개해주세요. 템플릿과 가이드라인을 제공하니 처음이어도 쉽게 만들 수 있어요.',
  },
  {
    id: 7,
    category: '지역',
    question: '서울 외 지역에서도 가능한가요?',
    answer: '현재는 서울(성수, 홍대, 이태원, 강남) 중심으로 운영되고 있지만, 곧 경기도와 부산으로 확장 예정입니다. 2025년 내에 전국 주요 도시로 서비스를 확대할 계획이에요.',
  },
  {
    id: 8,
    category: '계정',
    question: '인스타그램 계정이 꼭 필요한가요?',
    answer: '네, 현재는 인스타그램 계정이 필요합니다. 팔로워 수 확인과 콘텐츠 업로드를 인스타그램을 통해 진행하기 때문이에요. 추후 틱톡, 유튜브 쇼츠 등도 지원할 예정입니다.',
  },
];

const categories = ['전체', '시작하기', '수익', 'GPS 검증', '정산', '미션', '콘텐츠', '지역', '계정'];

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFaqs = selectedCategory === '전체' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section id="faq" className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20 mb-8"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            자주 묻는 질문
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            궁금한 점이 있으신가요?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-gray-600"
          >
            ZZIK LIVE에 대해 자주 묻는 질문들을 모았습니다
          </motion.p>
        </div>

        {/* 카테고리 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 ring-1 ring-gray-200'
              }`}
            >
              {category}
              {category !== '전체' && (
                <span className="ml-1 text-xs opacity-70">
                  ({faqs.filter(faq => faq.category === category).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* FAQ 리스트 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-12 max-w-3xl"
        >
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="flex w-full items-start justify-between rounded-xl bg-white p-6 text-left shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-teal-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 mt-6 flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                        {faq.id === 1 && (
                          <div className="mt-4 flex items-center gap-2 text-xs text-teal-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>인증된 정보</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 추가 도움 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-600">
            찾으시는 답변이 없으신가요?
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-500"
            >
              고객센터 문의하기
              <span aria-hidden="true">→</span>
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="#guide"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-500"
            >
              시작 가이드 보기
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}