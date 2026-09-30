import type { Locale } from "@/content/types";

/**
 * Admin UI dictionary — every string the dashboard shows, in both site
 * languages. Kept out of the public messages files so the admin surface
 * evolves independently.
 */

export interface Bi {
  ar: string;
  en: string;
}

export const dict = {
  // shell / nav
  panelTitle: { ar: "لوحة التحكم", en: "Dashboard" },
  dashboard: { ar: "الرئيسية", en: "Overview" },
  inbox: { ar: "الرسائل", en: "Inbox" },
  profile: { ar: "بياناتي", en: "My profile" },
  sections: { ar: "أقسام الصفحة", en: "Page sections" },
  content: { ar: "المحتوى", en: "Content" },
  logout: { ar: "تسجيل الخروج", en: "Log out" },
  viewSite: { ar: "معاينة الموقع", en: "View site" },
  langSwitch: { ar: "English", en: "العربية" },

  // login
  loginTitle: { ar: "مرحباً بعودتك", en: "Welcome back" },
  loginSubtitle: {
    ar: "سجّلي الدخول لإدارة محتوى موقعك",
    en: "Sign in to manage your site content",
  },
  loginEmail: { ar: "البريد الإلكتروني", en: "Email" },
  loginPassword: { ar: "كلمة المرور", en: "Password" },
  loginSubmit: { ar: "دخول", en: "Sign in" },
  loginWorking: { ar: "جارٍ الدخول…", en: "Signing in…" },
  loginError: {
    ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    en: "Incorrect email or password",
  },
  loginTooMany: {
    ar: "محاولات كثيرة — انتظري 15 دقيقة ثم حاولي مجدداً",
    en: "Too many attempts — wait 15 minutes and try again",
  },
  loginDemoHint: {
    ar: "بيانات تجريبية: admin@toothfairysworld.com / ToothFairy2027!",
    en: "Demo credentials: admin@toothfairysworld.com / ToothFairy2027!",
  },

  // dashboard
  welcome: { ar: "أهلاً", en: "Hi" },
  unreadMessages: { ar: "رسائل غير مقروءة", en: "Unread messages" },
  publishedItems: { ar: "عناصر منشورة", en: "Published items" },
  draftItems: { ar: "مسودات", en: "Drafts" },
  visits30: { ar: "زيارات (30 يوماً)", en: "Visits (30 days)" },
  visitsToday: { ar: "زيارات اليوم", en: "Views today" },
  visitsSection: { ar: "زيارات الموقع", en: "Site visits" },
  visitsLast14: { ar: "آخر 14 يوماً", en: "Last 14 days" },
  topPages: { ar: "الأكثر مشاهدة", en: "Most viewed" },
  noVisits: {
    ar: "لا زيارات مسجّلة بعد — ستظهر هنا تلقائياً بعد أول زيارة.",
    en: "No visits recorded yet — they'll appear here automatically.",
  },
  visitsNote: {
    ar: "أرقام مجمّعة بدون كوكيز أو معرّفات — التفاصيل في صفحة الخصوصية.",
    en: "Aggregate counts only — no cookies or identifiers (see privacy page).",
  },
  home: { ar: "الرئيسية /", en: "Home /" },
  recentMessages: { ar: "أحدث الرسائل", en: "Recent messages" },
  noMessages: {
    ar: "لا رسائل بعد — ستظهر هنا فور وصولها.",
    en: "No messages yet — they'll appear here.",
  },
  quickActions: { ar: "إجراءات سريعة", en: "Quick actions" },
  tipTitle: { ar: "نصيحة", en: "Tip" },
  tips: [
    {
      ar: "كل قسم في الصفحة الرئيسية يمكن إخفاؤه أو ترتيبه من «أقسام الصفحة».",
      en: "Every homepage section can be hidden or reordered from “Page sections”.",
    },
    {
      ar: "المسودات لا تظهر للزوار حتى تنشريها — جرّبي بحرية.",
      en: "Drafts are invisible to visitors until you publish — experiment freely.",
    },
    {
      ar: "لا تنسي الحقل الإنجليزي بجانب العربي؛ الزوار الإنجليز يرون نسختهم.",
      en: "Don't skip the English field beside the Arabic one — EN visitors see their copy.",
    },
  ],

  // generic list
  addItem: { ar: "إضافة عنصر", en: "Add item" },
  edit: { ar: "تعديل", en: "Edit" },
  del: { ar: "حذف", en: "Delete" },
  confirmDelete: {
    ar: "هل تريدين حذف هذا العنصر نهائياً؟",
    en: "Permanently delete this item?",
  },
  published: { ar: "منشور", en: "Published" },
  draft: { ar: "مسودة", en: "Draft" },
  moveUp: { ar: "تقديم", en: "Move up" },
  moveDown: { ar: "تأخير", en: "Move down" },
  emptyList: {
    ar: "لا عناصر بعد — أضيفي أول واحدة.",
    en: "Nothing here yet — add your first item.",
  },
  itemCount: { ar: "عنصر", en: "items" },

  // form
  save: { ar: "حفظ التغييرات", en: "Save changes" },
  saving: { ar: "جارٍ الحفظ…", en: "Saving…" },
  saved: { ar: "تم الحفظ ✓", en: "Saved ✓" },
  saveError: {
    ar: "تعذر الحفظ — راجعي الحقول المطلوبة",
    en: "Couldn't save — check the required fields",
  },
  cancel: { ar: "إلغاء", en: "Cancel" },
  back: { ar: "رجوع للقائمة", en: "Back to list" },
  newTitle: { ar: "عنصر جديد", en: "New item" },
  editTitle: { ar: "تعديل عنصر", en: "Edit item" },
  arSection: { ar: "النسخة العربية", en: "Arabic version" },
  enSection: { ar: "النسخة الإنجليزية", en: "English version" },
  sharedSection: { ar: "إعدادات عامة", en: "Shared settings" },
  required: { ar: "مطلوب", en: "required" },
  slugTaken: {
    ar: "المعرّف مستخدم — اختاري غيره",
    en: "Slug already used — pick another",
  },
  consentGate: {
    ar: "لا يمكن نشر حالة سريرية دون تأكيد موافقة المريض الكتابية.",
    en: "A clinical case can't be published without confirming the patient's written consent.",
  },

  // pairs / lists editors
  addRow: { ar: "إضافة سطر", en: "Add row" },
  removeRow: { ar: "حذف السطر", en: "Remove row" },
  addBlock: { ar: "إضافة فقرة", en: "Add block" },
  removeBlock: { ar: "حذف الفقرة", en: "Remove block" },
  blockP: { ar: "نص", en: "Paragraph" },
  blockH2: { ar: "عنوان فرعي", en: "Subheading" },
  blockUl: { ar: "قائمة نقاط", en: "Bullet list" },
  blockUlHelp: {
    ar: "كل سطر = نقطة واحدة",
    en: "One line per bullet",
  },
  statsValue: { ar: "الرقم", en: "Value" },
  statSuffix: { ar: "لاحقة (اختياري)", en: "Suffix (optional)" },

  // upload
  upload: { ar: "رفع صورة", en: "Upload image" },
  uploading: { ar: "جارٍ الرفع…", en: "Uploading…" },
  uploadError: { ar: "فشل رفع الصورة", en: "Upload failed" },
  imagePath: { ar: "مسار الصورة", en: "Image path" },

  // inbox
  from: { ar: "من", en: "From" },
  newMsg: { ar: "جديدة", en: "new" },
  received: { ar: "وصلت", en: "Received" },
  open: { ar: "قراءة", en: "Open" },
  markRead: { ar: "تعليم كمقروء", en: "Mark as read" },
  markUnread: { ar: "تعليم كغير مقروء", en: "Mark as unread" },
  archive: { ar: "أرشفة", en: "Archive" },
  unarchive: { ar: "إلغاء الأرشفة", en: "Unarchive" },
  deleteMsg: { ar: "حذف", en: "Delete" },
  archivedTab: { ar: "المؤرشفة", en: "Archived" },
  activeTab: { ar: "الواردة", en: "Active" },
  noArchived: { ar: "لا رسائل مؤرشفة.", en: "No archived messages." },
  replyByEmail: { ar: "الرد عبر البريد", en: "Reply by email" },

  // settings / password
  changePassword: { ar: "تغيير كلمة المرور", en: "Change password" },
  currentPassword: { ar: "كلمة المرور الحالية", en: "Current password" },
  newPassword: { ar: "كلمة المرور الجديدة", en: "New password" },
  confirmPassword: { ar: "تأكيد كلمة المرور", en: "Confirm password" },
  passwordMismatch: {
    ar: "كلمتا المرور غير متطابقتين",
    en: "Passwords don't match",
  },
  passwordWrong: {
    ar: "كلمة المرور الحالية غير صحيحة",
    en: "Current password is incorrect",
  },
  passwordShort: {
    ar: "كلمة المرور الجديدة 8 أحرف على الأقل",
    en: "New password needs 8+ characters",
  },
  passwordChanged: {
    ar: "تم تغيير كلمة المرور ✓",
    en: "Password changed ✓",
  },

  // misc
  loading: { ar: "جارٍ التحميل…", en: "Loading…" },
  heroPreview: { ar: "هكذا يظهر في الموقع", en: "How it appears on the site" },
} satisfies Record<string, Bi | Bi[]>;

export type DictKey = keyof typeof dict;

/** Pick the locale variant. */
export function al(key: DictKey, locale: Locale): string {
  const entry = dict[key] as { ar: string; en: string } | { ar: string; en: string }[];
  if (Array.isArray(entry)) {
    // Day-based rotation — stable within a day, consistent SSR/client.
    const day = Math.floor(Date.now() / 86_400_000);
    return entry[day % entry.length][locale];
  }
  return entry[locale];
}

export function bi(value: Bi, locale: Locale): string {
  return value[locale];
}
