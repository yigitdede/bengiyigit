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

/* ---- Sevgi Notları (Love Notes) Yardımcı Fonksiyonlar ---- */

/**
 * Firebase Realtime Database'deki lovenotes verilerini gerçek zamanlı dinler.
 * Veri string dizisi veya obje şeklinde gelse de hepsini düz metin array'ine çevirir.
 * @param {function} callback - String dizisi şeklinde sevgi notları ile çağrılır.
 */
function dbListenLoveNotes(callback) {
  db.ref(LOVENOTES_PATH).on('value', (snapshot) => {
    const raw = snapshot.val();
    let notes = [];
    if (raw) {
      if (Array.isArray(raw)) {
        notes = raw.filter(n => typeof n === 'string' || (n && n.text));
      } else if (typeof raw === 'object') {
        notes = Object.values(raw).map(val => (typeof val === 'string' ? val : val.text || val.note || JSON.stringify(val)));
      }
    }
    callback(notes);
  });
}