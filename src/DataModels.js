const User = require('./user/DataModel');
const Couple = require('./couple/DataModel');
const CoupleMember = require('./couple_member/DataModel');
const Photo = require('./photo/DataModel');
const Letter = require('./letter/DataModel');
const Countdown = require('./countdown/DataModel');
const Trip = require('./trip/DataModel');
const TripEntry = require('./trip_entry/DataModel');
const TripPhoto = require('./trip_photo/DataModel');
const TimelineEvent = require('./timeline/DataModel');
const Mood = require('./mood/DataModel');
const Notification = require('./notification/DataModel');

// Relação entre User e Couple através de CoupleMember
User.belongsToMany(Couple, {
  through: CoupleMember,
  foreignKey: 'userId',
  as: 'Couples',
});
Couple.belongsToMany(User, {
  through: CoupleMember,
  foreignKey: 'coupleId',
  as: 'Members',
});

// Relação entre Couple e Photo
Couple.hasMany(Photo, { foreignKey: 'coupleId', as: 'Photos' });
Photo.belongsTo(Couple, { foreignKey: 'coupleId', as: 'Couple' });
Photo.belongsTo(User, { foreignKey: 'uploadedBy', as: 'Uploader' });

// Relação entre Couple e Letter
Couple.hasMany(Letter, { foreignKey: 'coupleId', as: 'Letters' });
Letter.belongsTo(Couple, { foreignKey: 'coupleId', as: 'Couple' });
Letter.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
Letter.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

// Relação entre Couple e Countdown
Couple.hasMany(Countdown, { foreignKey: 'coupleId', as: 'Countdowns' });
Countdown.belongsTo(Couple, { foreignKey: 'coupleId', as: 'Couple' });

// Relação entre Couple e Trip
Couple.hasMany(Trip, { foreignKey: 'coupleId', as: 'Trips' });
Trip.belongsTo(Couple, { foreignKey: 'coupleId', as: 'Couple' });

// Relação entre Trip e TripEntry
Trip.hasMany(TripEntry, { foreignKey: 'tripId', as: 'Entries' });
TripEntry.belongsTo(Trip, { foreignKey: 'tripId', as: 'Trip' });

// Relação entre Trip e TripPhoto
Trip.hasMany(TripPhoto, { foreignKey: 'tripId', as: 'Photos' });
TripPhoto.belongsTo(Trip, { foreignKey: 'tripId', as: 'Trip' });
TripPhoto.belongsTo(User, { foreignKey: 'uploadedBy', as: 'Uploader' });

// Relação entre Couple e TimelineEvent
Couple.hasMany(TimelineEvent, { foreignKey: 'coupleId', as: 'TimelineEvents' });
TimelineEvent.belongsTo(Couple, { foreignKey: 'coupleId', as: 'Couple' });

// Relação entre Couple, User e Mood
Couple.hasMany(Mood, { foreignKey: 'coupleId', as: 'Moods' });
Mood.belongsTo(Couple, { foreignKey: 'coupleId', as: 'Couple' });
Mood.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// Relação entre User e Notification
User.hasMany(Notification, { foreignKey: 'userId', as: 'Notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// Exportar todos os modelos
module.exports = {
  User,
  Couple,
  CoupleMember,
  Photo,
  Letter,
  Countdown,
  Trip,
  TripEntry,
  TripPhoto,
  TimelineEvent,
  Mood,
  Notification,
};
