"use client";
import React, { useState } from 'react';
import { format, addDays, startOfToday, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Users, CreditCard, CheckCircle2 } from 'lucide-react';

export default function BookingPage() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [step, setStep] = useState<'select' | 'checkout' | 'success'>('select');
  
  // Mock data for availability
  const availability = {
    '2023-10-24': 12, // 12 slots taken, 18 left
    '2023-10-25': 29, // 29 slots taken, 1 left
    '2023-10-26': 5,   // 5 slots taken, 25 left
  };

  const MAX_SLOTS = 30;

  const toggleDate = (date: Date) => {
    if (selectedDates.find(d => isSameDay(d, date))) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const dateString = (date: Date) => format(date, 'yyyy-MM-dd');
  const today = startOfToday();
  const next14Days = eachDayOfInterval({
    start: today,
    end: addDays(today, 13),
  });

  const totalPrice = selectedDates.length * 15; // Assuming £15 per day

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">After School Club Bookings</h1>
          <p className="text-lg text-slate-600">Secure your child's spot. Max 30 children per day.</p>
        </div>

        {step === 'select' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6 text-slate-700 font-semibold text-xl">
              <CalendarIcon className="w-5 h-5" />
              <h2>Select Dates</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {next14Days.map((date) => {
                const ds = dateString(date);
                const taken = availability[ds] || 0;
                const remaining = MAX_SLOTS - taken;
                const isSelected = selectedDates.find(d => isSameDay(d, date));
                const isFull = remaining <= 0;

                return (
                  <button
                    key={ds}
                    disabled={isFull}
                    onClick={() => toggleDate(date)}
                    className={`
                      p-4 rounded-xl border transition-all text-left relative
                      ${isFull ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed' : 
                        isSelected ? 'bg-blue-600 border-blue-700 text-white shadow-md' : 'bg-white border-slate-200 hover:border-blue-400'}
                    `}
                  >
                    <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                    <div className="text-lg font-bold">{format(date, 'do')}</div>
                    <div className={`text-xs mt-2 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {remaining} slots left
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm text-slate-500">Selected: {selectedDates.length} days</p>
                <p className="text-2xl font-bold text-slate-900">Total: £{totalPrice}</p>
              </div>
              <button
                disabled={selectedDates.length === 0}
                onClick={() => setStep('checkout')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        )}

        {step === 'checkout' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6 text-slate-700 font-semibold text-xl">
              <CreditCard className="w-5 h-5" />
              <h2>Payment Details</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              {selectedDates.map(date => (
                <div key={dateString(date)} className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-700">{format(date, 'EEEE, do MMMM')}</span>
                  <span className="font-semibold">£15.00</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-200 flex justify-between text-xl font-bold">
                <span>Total to Pay</span>
                <span>£{totalPrice}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setStep('success')}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
              >
                Pay with Stripe
              </button>
              <button 
                onClick={() => setStep('select')}
                className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 transition-colors"
              >
                Back to Calendar
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h2>
            <p className="text-lg text-slate-600 mb-8">
              Thank you! We've sent a confirmation email to your inbox. 
              We look forward to seeing your child at the club.
            </p>
            <button 
              onClick={() => {
                setSelectedDates([]);
                setStep('select');
              }}
              className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Make Another Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
