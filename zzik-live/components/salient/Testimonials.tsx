// src/components/salient/Testimonials.tsx
// Salient 템플릿 스타일의 Testimonials 섹션

'use client';

import { motion } from 'framer-motion';
import { Star, Instagram, VerifiedIcon } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: '김지은',
    handle: '@jieun_daily',
    followers: '342',
    avatar: 'JE',
    content: '대학생인데 용돈벌이로 시작했어요. 카페 가는 김에 사진 찍고 올리면 돈이 들어오니까 너무 좋아요! 이번 달에만 12만원 벌었어요.',
    rating: 5,
    earnings: '₩120,000',
    missions: 8,
    verified: true,
  },
  {
    id: 2,
    name: '박서준',
    handle: '@seojun_cafe',
    followers: '1,248',
    avatar: 'SJ',
    content: '처음엔 GPS 검증이 번거로울 줄 알았는데, 오히려 허위 리뷰가 없어서 신뢰가 가요. 매장 사장님들도 좋아하시고, 저도 꾸준히 수익을 올리고 있습니다.',
    rating: 5,
    earnings: '₩280,000',
    missions: 19,
    verified: true,
  },
  {
    id: 3,
    name: '이하늘',
    handle: '@haneul_style',
    followers: '567',
    avatar: 'HN',
    content: '팔로워 100명부터 시작할 수 있다는 게 정말 좋았어요. 다른 플랫폼은 최소 1만명은 있어야 하는데... 여기는 진짜 나노 크리에이터를 위한 곳이에요.',
    rating: 5,
    earnings: '₩195,000',
    missions: 13,
    verified: true,
  },
  {
    id: 4,
    name: '최유나',
    handle: '@yuna_eats',
    followers: '892',
    avatar: 'YN',
    content: '성수동 카페 투어하면서 돈도 벌고 일석이조예요! 친구들이랑 놀러가는 김에 미션 수행하면 카페값이 나와요. 정산도 바로바로 되고요.',
    rating: 5,
    earnings: '₩165,000',
    missions: 11,
    verified: true,
  },
  {
    id: 5,
    name: '정민수',
    handle: '@minsu_daily',
    followers: '445',
    avatar: 'MS',
    content: '회사 점심시간에 잠깐 나가서 미션하고 오면 15,000원! 한 달이면 점심값이 해결돼요. 부담 없이 할 수 있어서 좋습니다.',
    rating: 4,
    earnings: '₩90,000',
    missions: 6,
    verified: true,
  },
  {
    id: 6,
    name: '송예진',
    handle: '@yejin_mood',
    followers: '1,567',
    avatar: 'YJ',
    content: '인스타그램 운영하는 사람이라면 무조건 해야 해요. 어차피 사진 찍고 올릴 거, 돈까지 받으면서 하니까 완전 꿀이죠!',
    rating: 5,
    earnings: '₩315,000',
    missions: 21,
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20 mb-8"
          >
            <Star className="w-4 h-4 mr-2 fill-teal-600" />
            크리에이터 후기
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            실제 크리에이터들의 생생한 후기
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-gray-600"
          >
            매달 500명 이상의 크리에이터가 ZZIK LIVE로 수익을 창출하고 있습니다
          </motion.p>
        </div>

        {/* Testimonials 그리드 */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200 transition-all hover:shadow-xl hover:ring-teal-200">
                {/* 인증 뱃지 */}
                {testimonial.verified && (
                  <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg">
                    <VerifiedIcon className="h-4 w-4" />
                  </div>
                )}

                {/* 프로필 섹션 */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <Instagram className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">{testimonial.handle}</p>
                    <p className="text-xs text-gray-500">팔로워 {testimonial.followers}명</p>
                  </div>
                </div>

                {/* 평점 */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* 후기 내용 */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* 수익 정보 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">총 수익</p>
                    <p className="font-semibold text-teal-600">{testimonial.earnings}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">완료 미션</p>
                    <p className="font-semibold text-gray-900">{testimonial.missions}개</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 하단 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-600 mb-4">
            더 많은 후기를 보고 싶으신가요?
          </p>
          <a
            href="#more-reviews"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-teal-500 transition-colors"
          >
            전체 후기 보기
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}