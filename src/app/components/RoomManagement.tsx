import { useState } from 'react';
import { Plus, Trash2, Edit, DoorOpen, Users, Shield, Bath, X } from 'lucide-react';

export interface Room {
  id: string;
  name: string;
  type: 'private' | 'shared' | 'bed_in_shared';
  capacity: number;
  genderPolicy: 'female_only' | 'male_only' | 'mixed';
  bathroomIds: string[];
}

export interface Bathroom {
  id: string;
  type: 'private' | 'shared';
  genderPolicy: 'female_only' | 'male_only' | 'mixed';
  roomIds: string[];
}

interface RoomManagementProps {
  rooms: Room[];
  bathrooms: Bathroom[];
  onUpdateRooms: (rooms: Room[]) => void;
  onUpdateBathrooms: (bathrooms: Bathroom[]) => void;
}

export function RoomManagement({ rooms, bathrooms, onUpdateRooms, onUpdateBathrooms }: RoomManagementProps) {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingBathroom, setEditingBathroom] = useState<Bathroom | null>(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showBathroomForm, setShowBathroomForm] = useState(false);

  const [newRoom, setNewRoom] = useState<Omit<Room, 'id'>>({
    name: '',
    type: 'shared',
    capacity: 1,
    genderPolicy: 'mixed',
    bathroomIds: []
  });

  const [newBathroom, setNewBathroom] = useState<Omit<Bathroom, 'id'>>({
    type: 'shared',
    genderPolicy: 'mixed',
    roomIds: []
  });

  const handleAddRoom = () => {
    if (!newRoom.name || newRoom.capacity < 1) {
      alert('Please enter room name and valid capacity');
      return;
    }

    const room: Room = {
      ...newRoom,
      id: `room-${Date.now()}`
    };

    onUpdateRooms([...rooms, room]);
    setNewRoom({
      name: '',
      type: 'shared',
      capacity: 1,
      genderPolicy: 'mixed',
      bathroomIds: []
    });
    setShowRoomForm(false);
  };

  const handleUpdateRoom = () => {
    if (!editingRoom) return;

    onUpdateRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r));
    setEditingRoom(null);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (!confirm('Delete this room? This cannot be undone.')) return;

    onUpdateRooms(rooms.filter(r => r.id !== roomId));

    // Remove room from bathrooms
    onUpdateBathrooms(bathrooms.map(b => ({
      ...b,
      roomIds: b.roomIds.filter(id => id !== roomId)
    })));
  };

  const handleAddBathroom = () => {
    if (newBathroom.roomIds.length === 0) {
      alert('Please select at least one room for this bathroom');
      return;
    }

    const bathroom: Bathroom = {
      ...newBathroom,
      id: `bath-${Date.now()}`
    };

    onUpdateBathrooms([...bathrooms, bathroom]);
    setNewBathroom({
      type: 'shared',
      genderPolicy: 'mixed',
      roomIds: []
    });
    setShowBathroomForm(false);
  };

  const handleUpdateBathroom = () => {
    if (!editingBathroom) return;

    onUpdateBathrooms(bathrooms.map(b => b.id === editingBathroom.id ? editingBathroom : b));
    setEditingBathroom(null);
  };

  const handleDeleteBathroom = (bathroomId: string) => {
    if (!confirm('Delete this bathroom? This cannot be undone.')) return;

    onUpdateBathrooms(bathrooms.filter(b => b.id !== bathroomId));
  };

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case 'private': return 'Private Room';
      case 'shared': return 'Shared Room';
      case 'bed_in_shared': return 'Bed in Shared Room';
      default: return type;
    }
  };

  const getGenderPolicyLabel = (policy: string) => {
    switch (policy) {
      case 'female_only': return 'Female Only';
      case 'male_only': return 'Male Only';
      case 'mixed': return 'Mixed / Any Gender';
      default: return policy;
    }
  };

  const getBathroomTypeLabel = (type: string) => {
    return type === 'private' ? 'Private Bathroom' : 'Shared Bathroom';
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room?.name || 'Unknown Room';
  };

  const getTotalCapacity = () => {
    return rooms.reduce((sum, room) => sum + room.capacity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Property Summary</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {rooms.length} room{rooms.length !== 1 ? 's' : ''} • {getTotalCapacity()} total spot{getTotalCapacity() !== 1 ? 's' : ''} • {bathrooms.length} bathroom{bathrooms.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DoorOpen className="w-5 h-5" />
            Rooms
          </h3>
          <button
            onClick={() => setShowRoomForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </button>
        </div>

        {rooms.length === 0 && (
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
            <DoorOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">No rooms added yet. Add your first room to continue.</p>
          </div>
        )}

        <div className="space-y-3">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              {editingRoom?.id === room.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room Name</label>
                    <input
                      type="text"
                      value={editingRoom.name}
                      onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                      placeholder="e.g., Room 1, Girls Room, Room A"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room Type</label>
                      <select
                        value={editingRoom.type}
                        onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value as Room['type'] })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="private">Private Room</option>
                        <option value="shared">Shared Room</option>
                        <option value="bed_in_shared">Bed in Shared Room</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Capacity</label>
                      <input
                        type="number"
                        min="1"
                        value={editingRoom.capacity}
                        onChange={(e) => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender Policy</label>
                      <select
                        value={editingRoom.genderPolicy}
                        onChange={(e) => setEditingRoom({ ...editingRoom, genderPolicy: e.target.value as Room['genderPolicy'] })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="female_only">Female Only</option>
                        <option value="male_only">Male Only</option>
                        <option value="mixed">Mixed / Any Gender</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleUpdateRoom}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingRoom(null)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{room.name}</h4>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                        {getRoomTypeLabel(room.type)}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                        {room.capacity} {room.capacity === 1 ? 'spot' : 'spots'}
                      </span>
                      <span className={`px-3 py-1 rounded-full ${
                        room.genderPolicy === 'female_only' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400' :
                        room.genderPolicy === 'male_only' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400'
                      }`}>
                        {getGenderPolicyLabel(room.genderPolicy)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingRoom(room)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Room Form */}
        {showRoomForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Room</h3>
                <button
                  onClick={() => setShowRoomForm(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Room Name *</label>
                  <input
                    type="text"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    placeholder="e.g., Room 1, Girls Room, Room A"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Room Type *</label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as Room['type'] })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="private">Private Room</option>
                    <option value="shared">Shared Room</option>
                    <option value="bed_in_shared">Bed in Shared Room</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    {newRoom.type === 'private' && 'Entire room for one person only'}
                    {newRoom.type === 'shared' && 'Multiple people share this room'}
                    {newRoom.type === 'bed_in_shared' && 'Individual bed in a shared room'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Number of Beds / Spots *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender Policy *</label>
                  <select
                    value={newRoom.genderPolicy}
                    onChange={(e) => setNewRoom({ ...newRoom, genderPolicy: e.target.value as Room['genderPolicy'] })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="female_only">Female Only</option>
                    <option value="male_only">Male Only</option>
                    <option value="mixed">Mixed / Any Gender</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddRoom}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Add Room
                  </button>
                  <button
                    onClick={() => setShowRoomForm(false)}
                    className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bathrooms Section */}
      {rooms.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bath className="w-5 h-5" />
              Bathrooms
            </h3>
            <button
              onClick={() => setShowBathroomForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Bathroom
            </button>
          </div>

          {bathrooms.length === 0 && (
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
              <Bath className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">No bathrooms added yet. Add bathroom information.</p>
            </div>
          )}

          <div className="space-y-3">
            {bathrooms.map((bathroom) => (
              <div key={bathroom.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                {editingBathroom?.id === bathroom.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bathroom Type</label>
                        <select
                          value={editingBathroom.type}
                          onChange={(e) => setEditingBathroom({ ...editingBathroom, type: e.target.value as Bathroom['type'] })}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="private">Private Bathroom</option>
                          <option value="shared">Shared Bathroom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender Policy</label>
                        <select
                          value={editingBathroom.genderPolicy}
                          onChange={(e) => setEditingBathroom({ ...editingBathroom, genderPolicy: e.target.value as Bathroom['genderPolicy'] })}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="female_only">Female Only</option>
                          <option value="male_only">Male Only</option>
                          <option value="mixed">Mixed / Shared by All</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Used by Rooms</label>
                      <div className="space-y-2">
                        {rooms.map((room) => (
                          <label key={room.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editingBathroom.roomIds.includes(room.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditingBathroom({
                                    ...editingBathroom,
                                    roomIds: [...editingBathroom.roomIds, room.id]
                                  });
                                } else {
                                  setEditingBathroom({
                                    ...editingBathroom,
                                    roomIds: editingBathroom.roomIds.filter(id => id !== room.id)
                                  });
                                }
                              }}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{room.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleUpdateBathroom}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingBathroom(null)}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 text-sm mb-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                          {getBathroomTypeLabel(bathroom.type)}
                        </span>
                        <span className={`px-3 py-1 rounded-full ${
                          bathroom.genderPolicy === 'female_only' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400' :
                          bathroom.genderPolicy === 'male_only' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400' :
                          'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400'
                        }`}>
                          {getGenderPolicyLabel(bathroom.genderPolicy)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Used by: {bathroom.roomIds.map(id => getRoomName(id)).join(', ')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingBathroom(bathroom)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBathroom(bathroom.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Bathroom Form */}
          {showBathroomForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Bathroom</h3>
                  <button
                    onClick={() => setShowBathroomForm(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bathroom Type *</label>
                    <select
                      value={newBathroom.type}
                      onChange={(e) => setNewBathroom({ ...newBathroom, type: e.target.value as Bathroom['type'] })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="private">Private Bathroom</option>
                      <option value="shared">Shared Bathroom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender Policy *</label>
                    <select
                      value={newBathroom.genderPolicy}
                      onChange={(e) => setNewBathroom({ ...newBathroom, genderPolicy: e.target.value as Bathroom['genderPolicy'] })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="female_only">Female Only</option>
                      <option value="male_only">Male Only</option>
                      <option value="mixed">Mixed / Shared by All Genders</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Used by Rooms * (select at least one)
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg p-3">
                      {rooms.map((room) => (
                        <label key={room.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newBathroom.roomIds.includes(room.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewBathroom({
                                  ...newBathroom,
                                  roomIds: [...newBathroom.roomIds, room.id]
                                });
                              } else {
                                setNewBathroom({
                                  ...newBathroom,
                                  roomIds: newBathroom.roomIds.filter(id => id !== room.id)
                                });
                              }
                            }}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{room.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAddBathroom}
                      className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Add Bathroom
                    </button>
                    <button
                      onClick={() => setShowBathroomForm(false)}
                      className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
