import React, { useState, useEffect } from 'react';
import { getNotes, createNote, deleteNote, updateNote } from '../../services/api';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Loader from '../Loader/Loader';
import { Trash2, Edit2, Check, X } from 'lucide-react';

const Notes = ({ leadId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [leadId]);

  const fetchNotes = async () => {
    try {
      const { data } = await getNotes(leadId);
      setNotes(data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)));
    } catch (error) {
      console.error('Failed to fetch notes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const noteData = {
        leadId,
        note: newNote,
        createdDate: new Date().toISOString(),
        createdBy: 'Admin User' // Mock user
      };
      const { data } = await createNote(noteData);
      setNotes([data, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        setNotes(notes.filter(n => n.id !== id));
      } catch (error) {
        console.error('Failed to delete note', error);
      }
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditNoteText(note.note);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNoteText('');
  };

  const saveEdit = async (id) => {
    if (!editNoteText.trim()) return;
    try {
      const { data } = await updateNote(id, { note: editNoteText });
      setNotes(notes.map(n => n.id === id ? { ...n, note: data.note } : n));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update note', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
      
      <form onSubmit={handleAddNote} className="mb-6 flex gap-2 items-start">
        <div className="flex-1">
          <Input 
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-0"
          />
        </div>
        <Button type="submit" disabled={!newNote.trim()}>Add Note</Button>
      </form>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-gray-500 italic text-sm">No notes added yet.</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {note.createdBy}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(note.createdDate).toLocaleString()}
                </span>
              </div>
              
              {editingId === note.id ? (
                <div className="flex gap-2 items-center mt-2">
                  <Input 
                    value={editNoteText}
                    onChange={(e) => setEditNoteText(e.target.value)}
                    className="mb-0 flex-1"
                  />
                  <button onClick={() => saveEdit(note.id)} className="text-green-600 hover:text-green-800 p-1">
                    <Check size={18} />
                  </button>
                  <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 p-1">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between group">
                  <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{note.note}</p>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(note)} className="text-blue-500 hover:text-blue-700">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
