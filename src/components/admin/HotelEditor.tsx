'use client';

import React, { useState } from 'react';
import ImageUploadField from './ImageUploadField';
import GalleryUploadField, { GalleryItem } from './GalleryUploadField';
import { Loader2, Save, Plus, Trash2, X, Bed } from 'lucide-react';

interface HotelEditorProps {
  hotel: any;
  onClose: () => void;
  onSaved: () => void;
}

interface RoomForm {
  id?: string;
  roomName: string;
  price: string;
  dayoutPrice: string;
  capacity: string;
  status: string;
  image: string;
  facilities: string;
}

const emptyRoom = (): RoomForm => ({
  roomName: '',
  price: '',
  dayoutPrice: '',
  capacity: '2',
  status: 'Available',
  image: '',
  facilities: 'AC, WiFi, TV',
});

export default function HotelEditor({ hotel, onClose, onSaved }: HotelEditorProps) {
  const [saving, setSaving] = useState(false);
  const [roomSaving, setRoomSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    name: hotel.name || '',
    location: hotel.location || '',
    description: hotel.description || '',
    image: hotel.image || '',
    facilities: hotel.facilities || '',
    nearbyPlaces: hotel.nearbyPlaces || '',
    hasDayoutRates: hotel.hasDayoutRates || false,
  });

  const [rooms, setRooms] = useState<RoomForm[]>(
    (hotel.rooms || []).map((r: any) => ({
      id: r.id,
      roomName: r.roomName,
      price: String(r.price),
      dayoutPrice: r.dayoutPrice != null ? String(r.dayoutPrice) : '',
      capacity: String(r.capacity),
      status: r.status,
      image: r.image,
      facilities: r.facilities,
    }))
  );

  const [newRoom, setNewRoom] = useState<RoomForm>(emptyRoom());
  const [showAddRoom, setShowAddRoom] = useState(false);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    if (!hotel.gallery) return [];
    // gallery may already be a parsed array (from hotelMapper) or a JSON string (from raw DB data)
    const raw = Array.isArray(hotel.gallery)
      ? hotel.gallery
      : (() => {
          try {
            const parsed = JSON.parse(hotel.gallery);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })();
    return raw.map((g: any, i: number) => ({
      url: g.url,
      title: g.title || `Photo ${i + 1}`,
      category: g.category || 'Rooms',
    }));
  });

  const saveProfile = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const gallery = galleryItems.map((g) => ({
        url: g.url,
        title: g.title,
        category: g.category,
      }));

      const res = await fetch('/api/hotels', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel.id,
          ...profile,
          gallery: JSON.stringify(gallery),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage('Hotel profile saved successfully.');
        onSaved();
      } else {
        setError(json.error || 'Failed to save hotel profile.');
      }
    } catch {
      setError('Error saving hotel profile.');
    } finally {
      setSaving(false);
    }
  };

  const saveRoom = async (room: RoomForm, index: number) => {
    if (!room.id) return;
    setRoomSaving(room.id);
    setError('');
    try {
      const res = await fetch('/api/rooms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          roomName: room.roomName,
          price: room.price,
          dayoutPrice: room.dayoutPrice || null,
          capacity: room.capacity,
          status: room.status,
          image: room.image,
          facilities: room.facilities,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage(`Room "${room.roomName}" updated.`);
        onSaved();
      } else {
        setError(json.error || 'Failed to update room.');
      }
    } catch {
      setError('Error updating room.');
    } finally {
      setRoomSaving(null);
    }
  };

  const addRoom = async () => {
    if (!newRoom.roomName || !newRoom.price || !newRoom.image) {
      setError('New room requires name, price, and image.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel.id,
          roomName: newRoom.roomName,
          price: newRoom.price,
          dayoutPrice: newRoom.dayoutPrice || null,
          capacity: newRoom.capacity,
          status: newRoom.status,
          image: newRoom.image,
          facilities: newRoom.facilities,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setRooms((prev) => [
          ...prev,
          {
            id: json.data.id,
            roomName: json.data.roomName,
            price: String(json.data.price),
            dayoutPrice: json.data.dayoutPrice != null ? String(json.data.dayoutPrice) : '',
            capacity: String(json.data.capacity),
            status: json.data.status,
            image: json.data.image,
            facilities: json.data.facilities,
          },
        ]);
        setNewRoom(emptyRoom());
        setShowAddRoom(false);
        setMessage(`Room "${json.data.roomName}" added successfully.`);
        onSaved();
      } else {
        setError(json.error || 'Failed to add room.');
      }
    } catch {
      setError('Error adding room.');
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (roomId: string, roomName: string) => {
    if (!confirm(`Delete room "${roomName}"? This cannot be undone.`)) return;
    setRoomSaving(roomId);
    setError('');
    try {
      const res = await fetch(`/api/rooms?roomId=${roomId}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        setRooms((prev) => prev.filter((r) => r.id !== roomId));
        setMessage(`Room "${roomName}" deleted.`);
        onSaved();
      } else {
        setError(json.error || 'Failed to delete room.');
      }
    } catch {
      setError('Error deleting room.');
    } finally {
      setRoomSaving(null);
    }
  };

  const updateRoomField = (index: number, field: keyof RoomForm, value: string) => {
    setRooms((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="w-full max-w-4xl bg-luxury-obsidian-card border border-luxury-obsidian-border rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-serif text-white">Manage Hotel</h2>
            <p className="text-xs text-luxury-silver-muted mt-1">{hotel.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded text-luxury-silver-muted hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
          {message && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded">{message}</div>
          )}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded">{error}</div>
          )}

          {/* Hotel Profile */}
          <section className="space-y-4">
            <h3 className="text-sm font-serif text-luxury-gold border-b border-white/5 pb-2">Hotel Profile</h3>

            <ImageUploadField
              label="Profile / Hero Photo"
              value={profile.image}
              onChange={(url) => setProfile((p) => ({ ...p, image: url }))}
              folder={`hotel-${hotel.id}`}
              previewClassName="w-48 h-32"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Hotel Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-luxury-obsidian border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Location</label>
                <input
                  value={profile.location}
                  onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                  className="w-full bg-luxury-obsidian border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Description</label>
              <textarea
                value={profile.description}
                onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full bg-luxury-obsidian border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Facilities (comma separated)</label>
              <input
                value={profile.facilities}
                onChange={(e) => setProfile((p) => ({ ...p, facilities: e.target.value }))}
                placeholder="A/C Rooms, Free WiFi, TV, Parking"
                className="w-full bg-luxury-obsidian border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Nearby Places (comma separated)</label>
              <input
                value={profile.nearbyPlaces}
                onChange={(e) => setProfile((p) => ({ ...p, nearbyPlaces: e.target.value }))}
                placeholder="Diyatha Uyana, Diyasaru Park"
                className="w-full bg-luxury-obsidian border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
              />
            </div>

            <label className="flex items-center space-x-2 text-xs text-luxury-silver cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasDayoutRates}
                onChange={(e) => setProfile((p) => ({ ...p, hasDayoutRates: e.target.checked }))}
                className="accent-luxury-gold"
              />
              <span>This hotel offers Day-Out packages</span>
            </label>

            <GalleryUploadField
              items={galleryItems}
              onChange={setGalleryItems}
              folder={`gallery-${hotel.id}`}
            />

            <button
              onClick={saveProfile}
              disabled={saving}
              className="flex items-center space-x-2 px-5 py-2.5 bg-luxury-gold hover:bg-luxury-gold-dark text-black rounded text-xs font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Save Hotel Profile</span>
            </button>
          </section>

          {/* Rooms */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-sm font-serif text-luxury-gold flex items-center space-x-2">
                <Bed className="h-4 w-4" />
                <span>Rooms ({rooms.length})</span>
              </h3>
              <button
                onClick={() => setShowAddRoom(!showAddRoom)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[10px] uppercase font-bold tracking-wider hover:bg-emerald-500/20"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Room</span>
              </button>
            </div>

            {rooms.map((room, index) => (
              <div key={room.id} className="border border-white/5 rounded-lg p-4 space-y-3 bg-luxury-obsidian">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Room Name</label>
                    <input
                      value={room.roomName}
                      onChange={(e) => updateRoomField(index, 'roomName', e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Status</label>
                    <select
                      value={room.status}
                      onChange={(e) => updateRoomField(index, 'status', e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    >
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Night Price (Rs.)</label>
                    <input
                      type="number"
                      value={room.price}
                      onChange={(e) => updateRoomField(index, 'price', e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Day-Out Price (Rs.) — optional</label>
                    <input
                      type="number"
                      value={room.dayoutPrice}
                      onChange={(e) => updateRoomField(index, 'dayoutPrice', e.target.value)}
                      placeholder="Leave empty if N/A"
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Capacity (guests)</label>
                    <input
                      type="number"
                      value={room.capacity}
                      onChange={(e) => updateRoomField(index, 'capacity', e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Facilities (comma separated)</label>
                    <input
                      value={room.facilities}
                      onChange={(e) => updateRoomField(index, 'facilities', e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Room Photo"
                  value={room.image}
                  onChange={(url) => updateRoomField(index, 'image', url)}
                  folder={`room-${room.id}`}
                  previewClassName="w-28 h-20"
                />

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => room.id && deleteRoom(room.id, room.roomName)}
                    disabled={roomSaving === room.id}
                    className="flex items-center space-x-1 px-3 py-1.5 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded text-[10px] uppercase font-bold"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => saveRoom(room, index)}
                    disabled={roomSaving === room.id}
                    className="flex items-center space-x-1 px-4 py-1.5 bg-luxury-gold text-black rounded text-[10px] uppercase font-bold disabled:opacity-50"
                  >
                    {roomSaving === room.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    <span>Save Room</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Room Form */}
            {showAddRoom && (
              <div className="border border-emerald-500/30 rounded-lg p-4 space-y-3 bg-emerald-500/5">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">New Room</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Room Name *</label>
                    <input
                      value={newRoom.roomName}
                      onChange={(e) => setNewRoom((r) => ({ ...r, roomName: e.target.value }))}
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Night Price (Rs.) *</label>
                    <input
                      type="number"
                      value={newRoom.price}
                      onChange={(e) => setNewRoom((r) => ({ ...r, price: e.target.value }))}
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Day-Out Price (Rs.)</label>
                    <input
                      type="number"
                      value={newRoom.dayoutPrice}
                      onChange={(e) => setNewRoom((r) => ({ ...r, dayoutPrice: e.target.value }))}
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-luxury-silver-muted">Capacity</label>
                    <input
                      type="number"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom((r) => ({ ...r, capacity: e.target.value }))}
                      className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>
                <ImageUploadField
                  label="Room Photo *"
                  value={newRoom.image}
                  onChange={(url) => setNewRoom((r) => ({ ...r, image: url }))}
                  folder={`hotel-${hotel.id}-new`}
                  previewClassName="w-28 h-20"
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setShowAddRoom(false)} className="px-3 py-1.5 text-xs text-luxury-silver-muted hover:text-white">
                    Cancel
                  </button>
                  <button
                    onClick={addRoom}
                    disabled={saving}
                    className="flex items-center space-x-1 px-4 py-1.5 bg-emerald-500 text-black rounded text-[10px] uppercase font-bold disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    <span>Create Room</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
