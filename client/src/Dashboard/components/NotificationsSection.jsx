import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, CheckCircle, Bell } from "lucide-react";

const API_BASE = "https://exotic-felipa-studentofsoftware-ceffa507.koyeb.app";

export default function NotificationsSection() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/notifications?userId=${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("GET /notifications error:", err.response?.data || err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_BASE}/notifications/${id}`);
      fetchNotifications();
      toast.success("Marked as read");
    } catch (err) {
      console.error("Mark read error:", err);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Delete notification?")) return;
    try {
      await axios.delete(`${API_BASE}/notifications/${id}`);
      toast.success("Deleted");
      fetchNotifications();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Bell className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--accent)" }}>
        Notifications
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: "var(--border)" }}>
          <thead style={{ backgroundColor: "var(--bg-secondary)" }}>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Message</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No notifications yet
                </td>
              </tr>
            ) : (
              notifications.map(notif => (
                <tr key={notif._id} className={`hover:bg-[var(--bg-card-hover)] transition ${notif.isRead ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-primary)" }}>{notif.type}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-primary)" }}>{notif.message}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)" }}>{new Date(notif.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {!notif.isRead && (
                        <button onClick={() => markAsRead(notif._id)} className="p-1 rounded hover:bg-[var(--bg-secondary)]" title="Mark as read">
                          <CheckCircle className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        </button>
                      )}
                      <button onClick={() => deleteNotification(notif._id)} className="p-1 rounded hover:bg-red-500/10" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}