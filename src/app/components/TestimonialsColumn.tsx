import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Card, CardContent } from './Card';

export type TestimonialsColumnItem = { name: string; text: string; rating: number };

export function TestimonialsColumn(props: {
  className?: string;
  testimonials: TestimonialsColumnItem[];
  duration?: number;
}) {
  return (
    <div className={`overflow-hidden ${props.className ?? ''}`}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration: props.duration || 15,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, name, rating }, i) => (
              <Card key={i}>
                <CardContent>
                  <div className="flex gap-1 mb-3">
                    {[...Array(rating)].map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">"{text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-[#00bfb3] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {name.charAt(0)}
                    </div>
                    <div className="font-medium text-black text-sm">{name}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
