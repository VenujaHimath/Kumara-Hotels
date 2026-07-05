"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { reviews } from '@/data/hotelsData';
import HotelEditor from '@/components/admin/HotelEditor';
import { 
  BarChart3, 
  Hotel, 
  Bed, 
  CalendarCheck, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Edit3, 
  Check, 
  XCircle, 
  RotateCcw,
  Sparkles,
  Plus,
  ShieldAlert,
  Lock,
  Loader2,
  RefreshCw,
  KeyRound,
  UserCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'hotels' | 'rooms' | 'bookings' | 'customers' | 'access-control' | 'profile'>('overview');

  // Live Data from DB
  const [hotels, setHotels] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [roomStatusUpdating, setRoomStatusUpdating] = useState<string | null>(null);
  const [bookingStatusUpdating, setBookingStatusUpdating] = useState<string | null>(null);

  // Auth & Account Management States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string>('');

  // Profile / Change Password States
  const [profileCurrentPwd, setProfileCurrentPwd] = useState('');
  const [profileNewPwd, setProfileNewPwd] = useState('');
  const [profileConfirmPwd, setProfileConfirmPwd] = useState('');
  const [profilePwdLoading, setProfilePwdLoading] = useState(false);
  const [profilePwdError, setProfilePwdError] = useState('');
  const [profilePwdSuccess, setProfilePwdSuccess] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('kumara_admin_user');
    if (!userStr) {
      setIsAuthorized(false);
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      if (!parsedUser || !parsedUser.hasAccess) {
        localStorage.removeItem('kumara_admin_user');
        setIsAuthorized(false);
        router.push('/login');
        return;
      }
      setCurrentUser(parsedUser);
      setIsAuthorized(true);
    } catch (e) {
      localStorage.removeItem('kumara_admin_user');
      setIsAuthorized(false);
      router.push('/login');
    }
  }, [router]);

  // Fetch live hotels + rooms from DB
  const fetchHotels = useCallback(async () => {
    setHotelsLoading(true);
    try {
      const res = await fetch('/api/hotels');
      const json = await res.json();
      if (res.ok && json.success) {
        setHotels(json.data);
      }
    } catch (e) {
      console.error('Error fetching hotels:', e);
    } finally {
      setHotelsLoading(false);
    }
  }, []);

  // Fetch live bookings from DB
  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const json = await res.json();
      if (res.ok && json.success) {
        setBookings(json.data);
      }
    } catch (e) {
      console.error('Error fetching bookings:', e);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchHotels();
      fetchBookings();
    }
  }, [isAuthorized, fetchHotels, fetchBookings]);

  // Fetch administrator accounts if tab is access-control and user role is admin
  useEffect(() => {
    if (activeTab === 'access-control' && currentUser?.role === 'admin') {
      fetchAccounts();
    }
  }, [activeTab, currentUser]);

  const fetchAccounts = async () => {
    setAccountsLoading(true);
    setActionError('');
    try {
      const res = await fetch('/api/admin/accounts');
      const json = await res.json();
      if (res.ok && json.success) {
        setAccounts(json.data);
      } else {
        setActionError(json.error || 'Failed to load executive staff accounts.');
      }
    } catch (e) {
      setActionError('Error connecting to staff database.');
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleToggleAccess = async (targetId: string, currentAccess: boolean) => {
    setActionError('');
    setActionSuccess('');
    
    if (targetId === currentUser?.id) {
      setActionError('Safety Lock: You cannot suspend your own access dashboard permissions.');
      return;
    }

    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetId,
          hasAccess: !currentAccess,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setActionSuccess(`Successfully updated access permission for ${json.data.name}.`);
        setAccounts(prev => prev.map(acc => acc.id === targetId ? { ...acc, hasAccess: !currentAccess } : acc));
      } else {
        setActionError(json.error || 'Failed to update access status.');
      }
    } catch (e) {
      setActionError('Error communicating status update to server.');
    }
  };

  const handleUpdateRole = async (targetId: string, newRole: string) => {
    setActionError('');
    setActionSuccess('');

    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetId,
          role: newRole,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setActionSuccess(`Successfully updated role for ${json.data.name} to ${newRole}.`);
        setAccounts(prev => prev.map(acc => acc.id === targetId ? { ...acc, role: newRole } : acc));
      } else {
        setActionError(json.error || 'Failed to update role.');
      }
    } catch (e) {
      setActionError('Error communicating role update to server.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kumara_admin_user');
    router.push('/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilePwdError('');
    setProfilePwdSuccess('');

    if (profileNewPwd !== profileConfirmPwd) {
      setProfilePwdError('New passwords do not match. Please re-enter.');
      return;
    }
    if (profileNewPwd.length < 6) {
      setProfilePwdError('New password must be at least 6 characters long.');
      return;
    }

    setProfilePwdLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser?.id,
          currentPassword: profileCurrentPwd,
          newPassword: profileNewPwd,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setProfilePwdSuccess('Password updated successfully! Use your new password next time you sign in.');
        setProfileCurrentPwd('');
        setProfileNewPwd('');
        setProfileConfirmPwd('');
      } else {
        setProfilePwdError(json.error || 'Failed to update password.');
      }
    } catch {
      setProfilePwdError('Unable to connect to server. Please try again.');
    } finally {
      setProfilePwdLoading(false);
    }
  };

  // Update room status in DB and reflect locally
  const handleUpdateRoomStatus = async (hotelId: string, roomId: string, newStatus: 'Available' | 'Booked' | 'Maintenance') => {
    setRoomStatusUpdating(roomId);
    try {
      const res = await fetch('/api/rooms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, status: newStatus }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        // Update local state immediately
        setHotels(prev =>
          prev.map(h => {
            if (h.id === hotelId) {
              return {
                ...h,
                rooms: h.rooms.map((r: any) =>
                  r.id === roomId ? { ...r, status: newStatus } : r
                )
              };
            }
            return h;
          })
        );
      } else {
        console.error('Failed to update room status:', json.error);
      }
    } catch (e) {
      console.error('Error updating room status:', e);
    } finally {
      setRoomStatusUpdating(null);
    }
  };

  // Update booking status in DB and reflect locally
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    setBookingStatusUpdating(bookingId);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        // Update local state
        setBookings(prev =>
          prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
        );
      } else {
        console.error('Failed to update booking status:', json.error);
      }
    } catch (e) {
      console.error('Error updating booking status:', e);
    } finally {
      setBookingStatusUpdating(null);
    }
  };

  // Stats calculation from live DB data
  const allRooms = hotels.flatMap(h => (h.rooms || []).map((r: any) => ({ ...r, hotelName: h.name, hotelId: h.id })));
  const totalHotels = hotels.length;
  const totalRooms = allRooms.length;
  const bookedRoomsCount = allRooms.filter(r => r.status === 'Booked').length;
  const maintenanceRoomsCount = allRooms.filter(r => r.status === 'Maintenance').length;
  const occupancyRate = totalRooms > 0 ? Math.round((bookedRoomsCount / totalRooms) * 100) : 0;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Render a loading state during auth check
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-luxury-obsidian flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-luxury-gold animate-spin" />
        <span className="text-xs text-luxury-silver-muted font-sans tracking-widest uppercase">Verifying Authorization...</span>
      </div>
    );
  }

  // Render access denied page if checking fails
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-luxury-obsidian flex flex-col items-center justify-center space-y-6">
        <div className="bg-red-500/10 p-5 rounded-full border border-red-500/30">
          <Lock className="h-12 w-12 text-red-400" />
        </div>
        <h1 className="text-2xl font-serif text-white">Access Unauthorized</h1>
        <p className="text-sm text-luxury-silver-muted max-w-sm text-center">
          You must log in to an executive or staff account to access the dashboard workspace.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-luxury-gold text-black rounded text-xs uppercase font-sans tracking-wider font-bold hover:bg-luxury-gold-dark transition-colors duration-200"
        >
          Return to Portal Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-obsidian py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Sparkles className="h-4.5 w-4.5 text-luxury-gold" />
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Kumara Group Management</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white font-extrabold">Executive Dashboard</h1>
          </div>

          {/* Quick Stats Pill & Logout */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => { fetchHotels(); fetchBookings(); }}
              title="Refresh live data"
              className="flex items-center space-x-2 bg-luxury-obsidian-card border border-white/10 hover:border-luxury-gold px-3 py-2 rounded text-white text-xs transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded text-emerald-400 text-xs">
              <TrendingUp className="h-4 w-4" />
              <span>Live Database Connected</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs tracking-wider uppercase font-sans font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'hotels', label: 'Hotels', icon: <Hotel className="h-4 w-4" /> },
            { id: 'rooms', label: 'Rooms Inventory', icon: <Bed className="h-4 w-4" /> },
            { id: 'bookings', label: 'Bookings Log', icon: <CalendarCheck className="h-4 w-4" /> },
            { id: 'customers', label: 'Customers', icon: <Users className="h-4 w-4" /> },
            ...(currentUser?.role === 'admin' ? [{ id: 'access-control', label: 'Access Control', icon: <Lock className="h-4 w-4" /> }] : []),
            { id: 'profile', label: 'My Profile', icon: <UserCircle2 className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded text-xs tracking-wider font-sans transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-luxury-gold text-black font-bold'
                  : 'bg-luxury-obsidian-card hover:bg-white/5 border border-white/5 text-luxury-silver-muted hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: "Total Hotels", val: hotelsLoading ? '...' : totalHotels, icon: <Hotel className="h-5 w-5 text-luxury-gold" />, desc: "Active properties" },
                { title: "Total Suites", val: hotelsLoading ? '...' : totalRooms, icon: <Bed className="h-5 w-5 text-luxury-gold" />, desc: "All room types" },
                { title: "Active Bookings", val: bookingsLoading ? '...' : bookings.length, icon: <CalendarCheck className="h-5 w-5 text-emerald-400" />, desc: `${confirmedBookings.length} confirmed stays` },
                { title: "Gross Income", val: bookingsLoading ? '...' : `Rs. ${totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5 text-emerald-400" />, desc: "Confirmed revenue" },
                { title: "Avg Occupancy", val: hotelsLoading ? '...' : `${occupancyRate}%`, icon: <TrendingUp className="h-5 w-5 text-luxury-gold" />, desc: `${bookedRoomsCount} suites filled` },
              ].map((kpi, i) => (
                <div key={i} className="bg-luxury-obsidian-card border border-luxury-obsidian-border p-6 rounded-lg space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-sans tracking-widest text-luxury-silver-muted font-bold">{kpi.title}</span>
                    {kpi.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl md:text-3xl font-serif text-white font-bold">{kpi.val}</h3>
                    <p className="text-[10px] text-luxury-silver-muted">{kpi.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick overview layout split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Recent Reservations */}
              <div className="lg:col-span-2 bg-luxury-obsidian-card border border-luxury-obsidian-border p-6 rounded-lg space-y-6 shadow-xl">
                <h3 className="text-lg font-serif text-white border-b border-white/5 pb-2">Recent Reservations Log</h3>
                {bookingsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-luxury-gold" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/5 text-luxury-silver-muted uppercase tracking-wider">
                          <th className="pb-3 font-medium">Customer</th>
                          <th className="pb-3 font-medium">Sanctuary</th>
                          <th className="pb-3 font-medium">Dates</th>
                          <th className="pb-3 font-medium">Revenue</th>
                          <th className="pb-3 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                            <td className="py-4 font-semibold text-white">{b.customerName}</td>
                            <td className="py-4 text-luxury-silver-muted">{b.hotel?.name || b.hotelName || '—'}</td>
                            <td className="py-4 text-luxury-silver-muted">
                              {b.checkIn ? new Date(b.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
                            </td>
                            <td className="py-4 font-semibold text-luxury-gold">Rs. {(b.totalAmount || 0).toLocaleString()}</td>
                            <td className="py-4 text-right">
                              <span className={`px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-bold ${
                                b.status === 'Confirmed' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : b.status === 'Pending' 
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-luxury-silver-muted text-xs">
                              No bookings found in the database yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right Column: Room Inventory distribution overview */}
              <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border p-6 rounded-lg space-y-6 shadow-xl">
                <h3 className="text-lg font-serif text-white border-b border-white/5 pb-2">Rooms Overview</h3>
                {hotelsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-luxury-gold" /></div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-luxury-silver-muted">Available Suites</span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold">
                        {allRooms.filter(r => r.status === 'Available').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-luxury-silver-muted">Occupied/Booked</span>
                      <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold">
                        {bookedRoomsCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-luxury-silver-muted">Maintenance Stays</span>
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-bold">
                        {maintenanceRoomsCount}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t border-white/5 pt-6 space-y-2">
                  <h4 className="text-[10px] font-sans tracking-widest text-luxury-gold uppercase font-bold">Quick Hint</h4>
                  <p className="text-[11px] text-luxury-silver-muted leading-relaxed">
                    Toggle room conditions under "Rooms Inventory" — changes are saved directly to the database and reflected on the public site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hotels List */}
        {activeTab === 'hotels' && (
          <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-lg p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xl font-serif text-white">Resorts & Lodges</h3>
              <span className="text-[10px] text-luxury-silver-muted">Click Manage to edit photos, prices, rooms & details</span>
            </div>
            
            {hotelsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-luxury-gold" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotels.map((h) => (
                  <div key={h.id} className="border border-white/5 rounded-lg p-4 flex gap-4 bg-luxury-obsidian">
                    <img src={h.image} alt={h.name} className="w-28 h-28 object-cover rounded shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div>
                        <h4 className="text-sm font-semibold text-white font-serif">{h.name}</h4>
                        <p className="text-[11px] text-luxury-silver-muted">{h.location}</p>
                      </div>
                      <p className="text-[10px] text-luxury-silver-muted/80 line-clamp-2">{h.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] font-sans text-luxury-gold font-bold">
                          {(h.rooms || []).length} Rooms
                        </span>
                        <button
                          onClick={() => setEditingHotel(h)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-luxury-gold hover:bg-luxury-gold-dark text-black rounded text-[10px] uppercase font-bold tracking-wider"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Manage</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {hotels.length === 0 && (
                  <p className="col-span-2 text-center text-luxury-silver-muted text-xs py-8">No hotels found. Please seed the database.</p>
                )}
              </div>
            )}
          </div>
        )}

        {editingHotel && (
          <HotelEditor
            hotel={editingHotel}
            onClose={() => setEditingHotel(null)}
            onSaved={async () => {
              const res = await fetch('/api/hotels');
              const json = await res.json();
              if (res.ok && json.success) {
                setHotels(json.data);
                const updated = json.data.find((h: any) => h.id === editingHotel.id);
                if (updated) setEditingHotel(updated);
              }
            }}
          />
        )}

        {/* Tab 3: Rooms Inventory */}
        {activeTab === 'rooms' && (
          <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-lg p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xl font-serif text-white">Suites Inventory</h3>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded">
                ✓ Changes saved to database
              </span>
            </div>

            {hotelsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-luxury-gold" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-luxury-silver-muted uppercase tracking-wider">
                      <th className="pb-3 font-medium">Hotel Destination</th>
                      <th className="pb-3 font-medium">Suite Name</th>
                      <th className="pb-3 font-medium">Capacity</th>
                      <th className="pb-3 font-medium">Rate/Night</th>
                      <th className="pb-3 font-medium">Live Status</th>
                      <th className="pb-3 font-medium text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRooms.map((room) => (
                      <tr key={room.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                        <td className="py-4 text-white font-medium">{room.hotelName}</td>
                        <td className="py-4 text-luxury-silver-muted font-bold">{room.roomName}</td>
                        <td className="py-4 text-luxury-silver-muted">{room.capacity} Guests</td>
                        <td className="py-4 font-semibold text-luxury-gold">Rs. {room.price?.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            room.status === 'Available'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : room.status === 'Booked'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {room.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                const fullHotel = hotels.find((h) => h.id === room.hotelId);
                                if (fullHotel) setEditingHotel(fullHotel);
                                else setActiveTab('hotels');
                              }}
                              title="Edit room details"
                              className="p-1.5 hover:bg-luxury-gold/20 rounded border border-white/5 hover:border-luxury-gold/40 text-luxury-gold transition-colors duration-200"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            {roomStatusUpdating === room.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-luxury-gold" />
                            ) : (
                              <select
                                value={room.status}
                                onChange={(e) => handleUpdateRoomStatus(room.hotelId, room.id, e.target.value as any)}
                                className="bg-luxury-obsidian border border-white/10 text-[11px] text-white px-2 py-1.5 rounded focus:outline-none focus:border-luxury-gold cursor-pointer"
                              >
                                <option value="Available">Available</option>
                                <option value="Booked">Booked</option>
                                <option value="Maintenance">Maintenance</option>
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {allRooms.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-luxury-silver-muted">No rooms in database. Please seed the database first.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Bookings Log */}
        {activeTab === 'bookings' && (
          <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-lg p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xl font-serif text-white">Active Stays Log</h3>
              <span className="text-xs text-luxury-silver-muted">{bookings.length} total reservations</span>
            </div>
            
            {bookingsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-luxury-gold" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-luxury-silver-muted uppercase tracking-wider">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Customer Details</th>
                      <th className="pb-3 font-medium">Hotel & Room</th>
                      <th className="pb-3 font-medium">Check-In / Out</th>
                      <th className="pb-3 font-medium">Total Rate</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                        <td className="py-4 font-mono text-luxury-gold font-bold text-[10px]">{b.reservationId || b.id?.slice(0, 8)}</td>
                        <td className="py-4">
                          <div className="font-semibold text-white">{b.customerName}</div>
                          <div className="text-[10px] text-luxury-silver-muted">{b.email} • {b.phone}</div>
                        </td>
                        <td className="py-4">
                          <div className="text-white">{b.hotel?.name || '—'}</div>
                          <div className="text-[10px] text-luxury-silver-muted">{b.room?.roomName || '—'}</div>
                        </td>
                        <td className="py-4 text-luxury-silver-muted">
                          <div>{b.checkIn ? new Date(b.checkIn).toLocaleDateString('en-GB') : '—'}</div>
                          <div className="text-[10px]">to {b.checkOut ? new Date(b.checkOut).toLocaleDateString('en-GB') : '—'}</div>
                        </td>
                        <td className="py-4 font-semibold text-luxury-gold">Rs. {(b.totalAmount || 0).toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : b.status === 'Pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-1">
                          {bookingStatusUpdating === b.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-luxury-gold ml-auto" />
                          ) : (
                            <>
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                                title="Confirm Reservation"
                                className="p-1.5 hover:bg-emerald-500/20 rounded border border-white/5 hover:border-emerald-500/40 text-emerald-400 transition-colors duration-200"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}
                                title="Cancel Reservation"
                                className="p-1.5 hover:bg-red-500/20 rounded border border-white/5 hover:border-red-500/40 text-red-400 transition-colors duration-200"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-luxury-silver-muted">
                          No reservations found. Customer bookings will appear here automatically.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Customers */}
        {activeTab === 'customers' && (
          <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-lg p-6 shadow-xl space-y-6">
            <h3 className="text-xl font-serif text-white border-b border-white/5 pb-2">Customer Profiles</h3>
            
            {bookingsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-luxury-gold" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-luxury-silver-muted uppercase tracking-wider">
                      <th className="pb-3 font-medium">Customer Name</th>
                      <th className="pb-3 font-medium">Contact Details</th>
                      <th className="pb-3 font-medium text-center">Reservation ID</th>
                      <th className="pb-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                        <td className="py-4 font-semibold text-white">{b.customerName}</td>
                        <td className="py-4 text-luxury-silver-muted">{b.email} • {b.phone}</td>
                        <td className="py-4 text-center font-mono text-luxury-gold text-[10px]">{b.reservationId}</td>
                        <td className="py-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : b.status === 'Pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-luxury-silver-muted">No customers found yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Access Control */}
        {activeTab === 'access-control' && currentUser?.role === 'admin' && (
          <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-lg p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <h3 className="text-xl font-serif text-white">Console Access Management</h3>
                <p className="text-xs text-luxury-silver-muted">Manage executive accounts, roles, and suspension rights</p>
              </div>
              <button
                onClick={fetchAccounts}
                className="px-3 py-1.5 bg-luxury-obsidian border border-white/10 hover:border-luxury-gold text-white text-xs rounded transition-all duration-350"
              >
                Reload Accounts
              </button>
            </div>

            {actionError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {actionSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded flex items-center space-x-2">
                <Check className="h-4 w-4 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {accountsLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-6 w-6 animate-spin text-luxury-gold" />
                <span className="text-xs text-luxury-silver-muted">Retrieving access lists...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-luxury-silver-muted uppercase tracking-wider">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Email / ID</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => {
                      const isSelf = acc.id === currentUser?.id;
                      return (
                        <tr key={acc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                          <td className="py-4 font-semibold text-white">
                            {acc.name} {isSelf && <span className="text-[9px] bg-luxury-gold/10 text-luxury-gold px-1.5 py-0.5 rounded font-normal font-sans ml-1.5">You</span>}
                          </td>
                          <td className="py-4 text-luxury-silver-muted">
                            <div>{acc.email}</div>
                            <div className="text-[10px] text-white/50">{acc.employeeId}</div>
                          </td>
                          <td className="py-4">
                            <select
                              value={acc.role}
                              onChange={(e) => handleUpdateRole(acc.id, e.target.value)}
                              disabled={isSelf}
                              className="bg-luxury-obsidian border border-white/10 text-[11px] text-white px-2 py-1 rounded focus:outline-none focus:border-luxury-gold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="admin">Administrator</option>
                              <option value="manager">Manager</option>
                              <option value="staff">Staff</option>
                            </select>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              acc.hasAccess
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {acc.hasAccess ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleToggleAccess(acc.id, acc.hasAccess)}
                              disabled={isSelf}
                              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                                isSelf
                                  ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                  : acc.hasAccess
                                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                              }`}
                            >
                              {acc.hasAccess ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: My Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-lg p-6 shadow-xl space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-4 pt-2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-luxury-gold/30 to-luxury-gold/5 border-2 border-luxury-gold/40 flex items-center justify-center shadow-lg shadow-luxury-gold/10">
                      <UserCircle2 className="h-10 w-10 text-luxury-gold" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-luxury-obsidian-card" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-serif text-white font-semibold">{currentUser?.name}</h3>
                    <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      currentUser?.role === 'admin'
                        ? 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30'
                        : currentUser?.role === 'manager'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    }`}>
                      {currentUser?.role}
                    </span>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold font-sans">Email Address</p>
                    <p className="text-xs text-white bg-luxury-obsidian border border-white/5 rounded px-3 py-2.5 break-all">{currentUser?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold font-sans">Employee ID</p>
                    <p className="text-xs text-white font-mono bg-luxury-obsidian border border-white/5 rounded px-3 py-2.5">{currentUser?.employeeId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold font-sans">Access Status</p>
                    <p className="text-xs">
                      <span className="inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active &amp; Authorized</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Change Password Form */}
            <div className="lg:col-span-2">
              <div className="bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-lg p-6 shadow-xl space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-luxury-gold/10 border border-luxury-gold/20 rounded-lg">
                      <KeyRound className="h-5 w-5 text-luxury-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-white">Change Password</h3>
                      <p className="text-[11px] text-luxury-silver-muted mt-0.5">Update your account password. You will use the new password on your next sign-in.</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">

                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="current-pwd" className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-bold">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
                      <input
                        id="current-pwd"
                        type={showCurrentPwd ? 'text' : 'password'}
                        value={profileCurrentPwd}
                        onChange={(e) => setProfileCurrentPwd(e.target.value)}
                        required
                        placeholder="Enter your current password"
                        className="w-full bg-luxury-obsidian border border-white/10 rounded pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPwd(p => !p)}
                        className="absolute right-3 top-3.5 text-luxury-silver-muted hover:text-luxury-gold transition-colors duration-200"
                        tabIndex={-1}
                      >
                        {showCurrentPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="new-pwd" className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-bold">
                      New Password
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
                      <input
                        id="new-pwd"
                        type={showNewPwd ? 'text' : 'password'}
                        value={profileNewPwd}
                        onChange={(e) => setProfileNewPwd(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Minimum 6 characters"
                        className="w-full bg-luxury-obsidian border border-white/10 rounded pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(p => !p)}
                        className="absolute right-3 top-3.5 text-luxury-silver-muted hover:text-luxury-gold transition-colors duration-200"
                        tabIndex={-1}
                      >
                        {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {/* Strength indicator */}
                    {profileNewPwd.length > 0 && (
                      <div className="flex items-center space-x-2 pt-1">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 w-8 rounded-full transition-all duration-300 ${
                                profileNewPwd.length >= level * 3
                                  ? level <= 1 ? 'bg-red-400'
                                    : level <= 2 ? 'bg-amber-400'
                                    : level <= 3 ? 'bg-blue-400'
                                    : 'bg-emerald-400'
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-[10px] font-sans ${
                          profileNewPwd.length < 4 ? 'text-red-400'
                          : profileNewPwd.length < 7 ? 'text-amber-400'
                          : profileNewPwd.length < 10 ? 'text-blue-400'
                          : 'text-emerald-400'
                        }`}>
                          {profileNewPwd.length < 4 ? 'Weak' : profileNewPwd.length < 7 ? 'Fair' : profileNewPwd.length < 10 ? 'Good' : 'Strong'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="confirm-pwd" className="text-[10px] font-sans tracking-widest uppercase text-luxury-gold font-bold">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-luxury-silver-muted" />
                      <input
                        id="confirm-pwd"
                        type={showConfirmPwd ? 'text' : 'password'}
                        value={profileConfirmPwd}
                        onChange={(e) => setProfileConfirmPwd(e.target.value)}
                        required
                        placeholder="Re-enter new password"
                        className={`w-full bg-luxury-obsidian border rounded pl-10 pr-10 py-3 text-xs text-white focus:outline-none transition-colors duration-200 ${
                          profileConfirmPwd.length > 0
                            ? profileConfirmPwd === profileNewPwd
                              ? 'border-emerald-500/50 focus:border-emerald-400'
                              : 'border-red-500/50 focus:border-red-400'
                            : 'border-white/10 focus:border-luxury-gold'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(p => !p)}
                        className="absolute right-3 top-3.5 text-luxury-silver-muted hover:text-luxury-gold transition-colors duration-200"
                        tabIndex={-1}
                      >
                        {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {profileConfirmPwd.length > 0 && profileConfirmPwd !== profileNewPwd && (
                      <p className="text-[10px] text-red-400 font-sans">Passwords do not match.</p>
                    )}
                    {profileConfirmPwd.length > 0 && profileConfirmPwd === profileNewPwd && (
                      <p className="text-[10px] text-emerald-400 font-sans flex items-center space-x-1">
                        <Check className="h-3 w-3" /><span>Passwords match</span>
                      </p>
                    )}
                  </div>

                  {/* Error & Success */}
                  {profilePwdError && (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans flex items-center space-x-2">
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>{profilePwdError}</span>
                    </div>
                  )}
                  {profilePwdSuccess && (
                    <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-sans flex items-center space-x-2">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>{profilePwdSuccess}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={profilePwdLoading}
                    id="change-password-submit"
                    className="w-full py-3.5 bg-luxury-gold hover:bg-luxury-gold-dark disabled:opacity-60 disabled:cursor-not-allowed text-black rounded font-sans font-bold tracking-widest text-xs uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-luxury-gold/15"
                  >
                    {profilePwdLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /><span>Updating Password...</span></>
                    ) : (
                      <><KeyRound className="h-4 w-4" /><span>Update Password</span></>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
