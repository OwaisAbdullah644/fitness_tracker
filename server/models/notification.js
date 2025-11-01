const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'register', 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['activity', 'reminder', 'alert'] 
  },
  message: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
}, { 
  timestamps: true 
});

NotificationSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);