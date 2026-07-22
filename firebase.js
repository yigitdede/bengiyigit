/* ==========================================
   BENGİSİTE - FIREBASE REALTIME DATABASE
   ========================================== */

// Firebase yapılandırma sabiti
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDyVAyEcTMlYzE69Ebysh25CreO10jb-so",
  authDomain: "bengisite.firebaseapp.com",
  databaseURL: "https://bengisite-default-rtdb.firebaseio.com",
  projectId: "bengisite",
  storageBucket: "bengisite.firebasestorage.app",
  messagingSenderId: "657611573744",
  appId: "1:657611573744:web:56766e6fc77dcd9ea2b535"
};

// Firebase'i başlat (CDN compat versiyonu)
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.database();

// Veritabanı yolu sabitleri
const COMPLAINTS_PATH = 'complaints';
const PLANS_PATH = 'datePlans';
const LOVENOTES_PATH = 'lovenotes';
const BOARDNOTES_PATH = 'shared_board_notes';

/* ---- Şikayet (Complaints) Yardımcı Fonksiyonlar ---- */

/**
 * Şikayetleri gerçek zamanlı dinler. Veri değişince callback çağrılır.
 * @param {function} callback - Şikayet array'i ile çağrılır.
 */
function dbListenComplaints(callback) {
  db.ref(COMPLAINTS_PATH).on('value', (snapshot) => {
    const raw = snapshot.val();
    const list = raw ? Object.values(raw) : [];
    callback(list);
  });
}

/**
 * Yeni şikayet ekler. Firebase push key otomatik ID olarak kullanılır.
 * @param {object} complaint - id alanı hariç şikayet objesi.
 */
function dbAddComplaint(complaint) {
  const newRef = db.ref(COMPLAINTS_PATH).push();
  return newRef.set({ ...complaint, id: newRef.key });
}

/**
 * Şikayet durumunu günceller (ör: 'resolved' yapar).
 * @param {string} id - Firebase push key (şikayetin id alanı).
 * @param {object} updates - Güncellenecek alanlar.
 */
function dbUpdateComplaint(id, updates) {
  return db.ref(`${COMPLAINTS_PATH}/${id}`).update(updates);
}

/* ---- Date Planları Yardımcı Fonksiyonlar ---- */

/**
 * Planları gerçek zamanlı dinler. Veri değişince callback çağrılır.
 * @param {function} callback - Plan array'i ile çağrılır.
 */
function dbListenPlans(callback) {
  db.ref(PLANS_PATH).on('value', (snapshot) => {
    const raw = snapshot.val();
    const list = raw ? Object.values(raw) : [];
    callback(list);
  });
}

/**
 * Yeni plan ekler. Firebase push key otomatik ID olarak kullanılır.
 * @param {object} plan - id alanı hariç plan objesi.
 */
function dbAddPlan(plan) {
  const newRef = db.ref(PLANS_PATH).push();
  return newRef.set({ ...plan, id: newRef.key });
}

/**
 * Planı siler.
 * @param {string} id - Firebase push key (planın id alanı).
 */
function dbDeletePlan(id) {
  return db.ref(`${PLANS_PATH}/${id}`).remove();
}

const NOTE_AUTHORS = {
  BENGI: 'Bengi',
  YIGIT: 'Yiğit'
};

/* ---- Sürpriz Notlar Havuzu (Love Notes) Yardımcı Fonksiyonlar ---- */

/**
 * Firebase Realtime Database'deki lovenotes (sürpriz notlar havuzu) verilerini dinler.
 * @param {function} callback - [{ id, text, author }] nesne dizisi ile çağrılır.
 */
function dbListenLoveNotes(callback) {
  db.ref(LOVENOTES_PATH).on('value', (snapshot) => {
    const raw = snapshot.val();
    let notes = [];
    if (raw) {
      if (Array.isArray(raw)) {
        notes = raw
          .filter(n => Boolean(n))
          .map((n, idx) => typeof n === 'string' ? { id: String(idx), text: n, author: NOTE_AUTHORS.YIGIT } : { id: n.id || String(idx), text: n.text || '', author: n.author || NOTE_AUTHORS.YIGIT });
      } else if (typeof raw === 'object') {
        notes = Object.entries(raw).map(([key, val]) => {
          if (typeof val === 'string') {
            return { id: key, text: val, author: NOTE_AUTHORS.YIGIT };
          }
          return {
            id: key,
            text: val.text || val.note || '',
            author: val.author || NOTE_AUTHORS.YIGIT
          };
        });
      }
    }
    callback(notes);
  });
}

/* ---- Canlı Ortak Aşk Panosu (shared_board_notes) Yardımcı Fonksiyonlar ---- */

/**
 * Realtime Database'deki shared_board_notes (ortak aşk panosu) verilerini gerçek zamanlı dinler.
 * @param {function} callback - [{ id, text, author, timestamp }] nesne dizisi ile çağrılır.
 */
function dbListenBoardNotes(callback) {
  db.ref(BOARDNOTES_PATH).on('value', (snapshot) => {
    const raw = snapshot.val();
    let notes = [];
    if (raw) {
      if (Array.isArray(raw)) {
        notes = raw
          .filter(n => Boolean(n))
          .map((n, idx) => typeof n === 'string' ? { id: String(idx), text: n, author: NOTE_AUTHORS.YIGIT, timestamp: Date.now() } : { id: n.id || String(idx), text: n.text || '', author: n.author || NOTE_AUTHORS.YIGIT, timestamp: n.timestamp || Date.now() });
      } else if (typeof raw === 'object') {
        notes = Object.entries(raw).map(([key, val]) => {
          if (typeof val === 'string') {
            return { id: key, text: val, author: NOTE_AUTHORS.YIGIT, timestamp: Date.now() };
          }
          return {
            id: key,
            text: val.text || val.note || '',
            author: val.author || NOTE_AUTHORS.YIGIT,
            timestamp: val.timestamp || Date.now()
          };
        });
      }
    }
    callback(notes);
  });
}

/**
 * Ortak aşk panosuna (shared_board_notes) yeni not ekler.
 * @param {object} noteData - { text, author, timestamp }
 */
function dbAddBoardNote(noteData) {
  const newRef = db.ref(BOARDNOTES_PATH).push();
  return newRef.set(noteData);
}

/**
 * Ortak aşk panosundan (shared_board_notes) not siler.
 * @param {string} id - Firebase push key.
 */
function dbDeleteBoardNote(id) {
  if (!id) return;
  return db.ref(`${BOARDNOTES_PATH}/${id}`).remove();
}