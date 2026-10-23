"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Calendar, Download, LogOut } from 'lucide-react';
import { format } from 'date-fns';

export default function StaffDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchBookings();
  }, [filterDate]);

  async function fetchBookings() {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_date', filterDate)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching bookings:', error);
    else setBookings(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Staff Dashboard</h1>
            <p className="text-slate-600">Manage after-school club attendance</p>
          </div>
          <button className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-medium">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Calendar className="w-5 h-5" />
            <span>View Date:</span>
          </div>
          <input 
            type="date" 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-500">Occupancy</p>
              <p className="text-xl font-bold text-slate-900">{bookings.length} / 30</p>
            </div>
            <div className="w-24 h-4 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all" 
                style={{ width: `${(bookings.length / 30) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-xl">
              <Users className="w-5 h-5" />
              <h2>Attendee List</h2>
            </div>
            <button className="flex items-center gap-2 text-sm bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No bookings found for this date.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 text-sm uppercase font-semibold">
                  <tr>
                    <th className="p-4 border-b border-slate-200">Child Name</th>
                    <th className="p-4 border-b border-slate-200">Parent Name</th>
                    <th className="p-4 border-b border-slate-200">Email</th>
                    <th className="p-4 border-b border-slate-200">Payment</th>
                    <th className="p-4 border-b border-slate-200">Booked At</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold">{booking.child_name}</td>
                      <td className="p-4">{booking.parent_name}</td>
                      <td className="p-4">{booking.parent_email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          booking.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.payment_status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-sm">
                        {format(new Date(booking.created_at), 'PPpp')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
