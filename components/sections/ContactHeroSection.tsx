'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';
import { type ContactFormData, contactSchema } from '@/lib/schemas/contact';

export default function ContactHeroSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${backendUrl}/leads/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          service: data.companyName || '', // Map company name to service field
          message: data.message || '',
          phone: '', // Optional empty phone
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full rounded-md border bg-white px-4 py-3.5 font-inter text-[15px] text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#606c38]/40 transition-shadow';
  const labelClass = 'block font-inter text-[13px] font-medium text-text mb-2';
  const errorClass = 'mt-1.5 font-inter text-[12px] text-red-600';

  return (
    <section
      id="contact-hero"
      className="w-full pt-28 pb-12 desktop:pt-40 desktop:pb-24"
    >
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="grid gap-[60px] desktop:grid-cols-2 desktop:gap-[100px] tablet:gap-20 items-start">
          {/* LEFT — heading + body + form */}
          <div className="flex flex-col gap-10 desktop:gap-[60px]">
            {/* Heading group */}
            <div className="flex flex-col gap-5">
              <ScrollFadeUp>
                <BarLabel>Contact Us</BarLabel>
              </ScrollFadeUp>
              <BlurInWords
                text="Let's Talk About Your Next Project"
                as="h1"
                className="type-hero text-text"
                stagger={0.05}
                duration={0.8}
              />
              <ParagraphBlurIn
                className="font-inter text-text-muted text-[15px] leading-[1.6em] opacity-80 max-w-md"
                delay={0.2}
              >
                Join over 100 companies using clean, affordable energy from Balaji &amp; Co.
                Contact our team for a free assessment.
              </ParagraphBlurIn>
            </div>

            {/* Form */}
            <ScrollFadeUp delay={0.25}>
              {status === 'success' ? (
                <div
                  className="rounded-md p-8 text-center"
                  style={{ backgroundColor: 'rgb(240, 240, 240)' }}
                >
                  <p className="font-karma text-[24px] font-medium text-text mb-3">Message sent!</p>
                  <p className="font-inter text-[15px] text-text-muted opacity-80 mb-6">
                    Thank you for reaching out. We&apos;ll get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white font-inter font-medium text-[14px] hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#606c38' }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
                  {/* Honeypot fields */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="one-time-code"
                    aria-hidden="true"
                    className="absolute scale-0 pointer-events-none"
                    style={{ position: 'absolute', transform: 'scale(0)' }}
                  />

                  {/* Name + Email row */}
                  <div className="grid gap-4 tablet:grid-cols-2 mobile:grid-cols-1">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        className={inputClass}
                        style={{ borderColor: 'rgba(0,0,0,0.2)' }}
                        {...register('name')}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p className={errorClass} role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Your Email Address"
                        className={inputClass}
                        style={{ borderColor: 'rgba(0,0,0,0.2)' }}
                        {...register('email')}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className={errorClass} role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyName" className={labelClass}>
                      Company name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="Your Company Name"
                      className={inputClass}
                      style={{ borderColor: 'rgba(0,0,0,0.2)' }}
                      {...register('companyName')}
                      aria-invalid={!!errors.companyName}
                    />
                    {errors.companyName && (
                      <p className={errorClass} role="alert">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder="Type a message...."
                      className={`${inputClass} resize-none min-h-[150px]`}
                      style={{ borderColor: 'rgba(0,0,0,0.2)' }}
                      {...register('message')}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className={errorClass} role="alert">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {status === 'error' && (
                    <p className="font-inter text-[13px] text-red-600" role="alert">
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-md text-white font-inter font-medium text-[14px] hover:opacity-90 transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#606c38', height: 48 }}
                  >
                    {status === 'loading' ? 'Sending…' : 'Submit'}
                  </button>
                </form>
              )}
            </ScrollFadeUp>
          </div>

          {/* RIGHT — two images stacked */}
          <div className="hidden desktop:flex flex-col gap-5">
            <ScrollFadeUp distance={40}>
              <div className="relative w-full aspect-square overflow-hidden rounded-md">
                <FadeInScale className="absolute inset-0">
                  <Image
                    src="https://framerusercontent.com/images/i6eny5lygrLdpq5Gqvme29j7Yhw.webp"
                    alt="Renewable energy team"
                    fill
                    className="object-cover"
                    sizes="50vw"
                    priority
                  />
                </FadeInScale>
              </div>
            </ScrollFadeUp>
            <ScrollFadeUp distance={40} delay={0.15}>
              <div className="relative w-full aspect-[623/735] overflow-hidden rounded-md">
                <FadeInScale className="absolute inset-0">
                  <Image
                    src="https://framerusercontent.com/images/I9dRVlQULmDqNAJpZOkuncGfE.jpg"
                    alt="Wind and solar project site"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </FadeInScale>
              </div>
            </ScrollFadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
