import type { PortalRole } from "../components/layout/PortalLayout";

export interface PortalProfile {
  name: string;
  tagline: string;
  avatarLabel: string;
}

export interface PortalPageDefinition {
  id: string;
  path: string;
  role: PortalRole;
  title: string;
  eyebrow: string;
  description: string;
  highlights: string[];
}

export const portalProfilesByRole: Record<PortalRole, PortalProfile> = {
  user: {
    name: "أحمد الرسول",
    tagline: "باحث عن فرصة مناسبة",
    avatarLabel: "أر",
  },
  company: {
    name: "Google",
    tagline: "لوحة إدارة الشركة",
    avatarLabel: "GO",
  },
};

export const userPortalPages: PortalPageDefinition[] = [
  {
    id: "home",
    path: "/",
    role: "user",
    title: "الرئيسية",
    eyebrow: "واجهة المستخدم",
    description:
      "هذه الصفحة هي الصفحة الرئيسية للمستخدم، ومنها يبدأ التنقل لباقي صفحات البحث عن الوظائف والشركات والإرشاد الوظيفي.",
    highlights: [
      "ضعي هنا Hero section أو آخر الوظائف أو الإحصائيات الأساسية.",
      "أي محتوى تضعيه هنا سيظهر تلقائيًا داخل نفس الـ header والـ footer.",
      "إذا أردتِ تقسيم الصفحة إلى أقسام، أبقي كل شيء داخل هذا المكوّن فقط.",
    ],
  },
  {
    id: "jobs",
    path: "/jobs",
    role: "user",
    title: "الوظائف",
    eyebrow: "وظائف المستخدم",
    description:
      "هذه صفحة عامة للوظائف، مناسبة لعرض ملخص سريع أو فلاتر رئيسية قبل الذهاب إلى كل الوظائف أو التصنيفات.",
    highlights: [
      "يمكنك وضع فلاتر البحث الأساسية هنا.",
      "يمكن تحويلها لاحقًا إلى صفحة landing خاصة بالوظائف.",
      "روابط الهيدر والفوتر ستبقى كما هي بدون أي تكرار في الصفحة.",
    ],
  },
  {
    id: "jobs-all",
    path: "/jobs/all",
    role: "user",
    title: "كافة الوظائف",
    eyebrow: "وظائف المستخدم",
    description:
      "هذه صفحة عرض كل الوظائف المتاحة للمستخدم، وهي المكان الطبيعي للـ table أو الـ cards الخاصة بقوائم الوظائف.",
    highlights: [
      "استبدلي هذا المحتوى بقائمة الوظائف الحقيقية.",
      "يمكنك ربطها مع pagination أو filters أو search bar.",
      "الـ layout لا يتغير مهما تغيّر محتوى الصفحة.",
    ],
  },
  {
    id: "jobs-categories",
    path: "/jobs/categories",
    role: "user",
    title: "كافة تصنيفات الوظائف",
    eyebrow: "وظائف المستخدم",
    description:
      "صفحة مخصصة لتصنيفات الوظائف، ويمكن استخدامها لعرض المجالات أو الأقسام أو الكلمات المفتاحية الرئيسية.",
    highlights: [
      "مناسبة لبطاقات التصنيفات أو الـ tags.",
      "يمكن منها التوجيه إلى صفحات فرعية أكثر تخصصًا.",
      "يبقى الـ header مفعّلًا على تبويب الوظائف تلقائيًا.",
    ],
  },
  {
    id: "internships",
    path: "/jobs/internships",
    role: "user",
    title: "فرص التدريب",
    eyebrow: "وظائف المستخدم",
    description:
      "صفحة فرص التدريب للمستخدم، ويمكن استخدامها لعرض فرص التدريب الصيفي أو العملي أو الداخلي.",
    highlights: [
      "أضيفي قائمة trainings أو بطاقات مستقلة.",
      "ممكن لاحقًا تستخدمي نفس الـ components الموجودة للوظائف مع اختلاف البيانات.",
      "الصفحة تبقى child داخل الـ user layout تلقائيًا.",
    ],
  },
  {
    id: "internship-details",
    path: "/jobs/internships/details",
    role: "user",
    title: "كافة التدريبات",
    eyebrow: "وظائف المستخدم",
    description:
      "اكتشف أفضل فرص التدريب وقم ببناء تجربة عملية داخل إحدى الشركات الكبرى",
    highlights: [
      "صفحة مستقلة لتفاصيل التدريب مع الحفاظ على نفس لغة التصميم العامة.",
      "مناسبة لعرض المعلومات الموسعة، المهارات، والمتطلبات والتدريبات المشابهة.",
      "يبقى تبويب التدريبات مفعّلًا في الهيدر عند دخول هذه الصفحة.",
    ],
  },
  {
    id: "watchlist",
    path: "/jobs/watchlist",
    role: "user",
    title: "مراقبة",
    eyebrow: "وظائف المستخدم",
    description:
      "صفحة متابعة الوظائف أو الإشعارات أو العناصر التي يريد المستخدم مراقبتها بشكل مستمر.",
    highlights: [
      "مناسبة للقوائم المراقبة أو saved alerts.",
      "يمكنك لاحقًا إضافة إعدادات الإشعارات هنا.",
      "يكفي استبدال محتوى هذه الصفحة بدون المساس بالـ layout.",
    ],
  },
  {
    id: "saved-jobs",
    path: "/jobs/saved",
    role: "user",
    title: "الوظائف المحفوظة",
    eyebrow: "وظائف المستخدم",
    description:
      "صفحة الوظائف التي قام المستخدم بحفظها، وتناسب عرض البطاقات أو الـ shortlist الخاصة به.",
    highlights: [
      "ضعي هنا الوظائف المفضلة أو المحفوظة.",
      "يمكن ربطها مع local state أو API بسهولة.",
      "ما زال الـ layout يدار مركزيًا من الـ route wrapper.",
    ],
  },
  {
    id: "companies",
    path: "/companies",
    role: "user",
    title: "الشركات",
    eyebrow: "صفحات الشركات",
    description:
      "هذه صفحة عامة للشركات، مناسبة لعرض الشركات المميزة أو فلاتر البحث أو أقسام الشركات.",
    highlights: [
      "يمكنك بناء cards للشركات أو قائمة نتائج.",
      "يمكن لاحقًا إضافة صفحة تفاصيل شركة مستقلة.",
      "تبويب الشركات في الهيدر سيتفعّل تلقائيًا لهذه الصفحة.",
    ],
  },
  {
    id: "companies-all",
    path: "/companies/all",
    role: "user",
    title: "عرض كافة الشركات",
    eyebrow: "صفحات الشركات",
    description:
      "صفحة جميع الشركات، مناسبة للنتائج الكاملة أو الـ directory الخاص بالشركات.",
    highlights: [
      "ضعي هنا شبكة cards أو table للشركات.",
      "يمكن إضافة فرز حسب المجال أو الموقع أو الحجم.",
      "الـ layout نفسه يظل مشتركًا مع بقية صفحات المستخدم.",
    ],
  },
  {
    id: "career-guidance",
    path: "/career-guidance",
    role: "user",
    title: "الإرشاد الوظيفي",
    eyebrow: "الإرشاد والتطوير",
    description:
      "صفحة الإرشاد الوظيفي للمستخدم، ويمكن استخدامها لعرض نصائح أو مقالات أو جلسات إرشادية.",
    highlights: [
      "مناسبة للمقالات أو النصائح أو التوصيات.",
      "يمكن تحويلها لاحقًا إلى blog أو knowledge center.",
      "لا حاجة لإعادة كتابة الـ header أو الـ footer داخلها.",
    ],
  },
  {
    id: "profile",
    path: "/profile",
    role: "user",
    title: "عرض الملف الشخصي",
    eyebrow: "الملف الشخصي",
    description:
      "هذه صفحة عرض الملف الشخصي للمستخدم، وهي المكان المناسب لعرض البيانات والخبرات والسيرة الذاتية.",
    highlights: [
      "ضعي هنا معلومات الحساب الأساسية.",
      "يمكنك تقسيمها إلى tabs أو cards بسهولة.",
      "إدارة الـ layout تبقى خارج الصفحة نفسها.",
    ],
  },
  {
    id: "profile-edit",
    path: "/profile/edit",
    role: "user",
    title: "تعديل الملف الشخصي",
    eyebrow: "الملف الشخصي",
    description:
      "صفحة تعديل الملف الشخصي للمستخدم، ومناسبة لحقول الإدخال والفورمات الخاصة بالخبرات والمهارات.",
    highlights: [
      "استفيدي هنا من مكونات form الموجودة عندك.",
      "ممكن تضعي stepper أو sections متعددة داخلها.",
      "كلها ستظهر ضمن نفس الـ user layout.",
    ],
  },
  {
    id: "profile-settings",
    path: "/profile/settings",
    role: "user",
    title: "الإعدادات الشخصية",
    eyebrow: "الملف الشخصي",
    description:
      "صفحة الإعدادات الشخصية للحساب، مثل كلمات المرور وتفضيلات الإشعارات وإعدادات الخصوصية.",
    highlights: [
      "مناسبة لإعدادات الحساب العامة.",
      "يمكن تنظيمها على شكل cards أو accordion.",
      "هذه الصفحة مثال إضافي على صفحات المستخدم داخل نفس الـ wrapper.",
    ],
  },
];

export const companyPortalPages: PortalPageDefinition[] = [
  {
    id: "company-home",
    path: "/company",
    role: "company",
    title: "الرئيسية",
    eyebrow: "واجهة الشركة",
    description:
      "الصفحة الرئيسية للشركة، ومنها يمكن عرض مؤشرات التوظيف أو آخر الوظائف أو طلبات التوظيف الجديدة.",
    highlights: [
      "ضعي هنا dashboard أو overview للشركة.",
      "هذه هي الصفحة الأساسية لكل صفحات الشركة.",
      "الـ layout سيختلف تلقائيًا عن صفحات المستخدم.",
    ],
  },
  {
    id: "company-jobs",
    path: "/company/jobs",
    role: "company",
    title: "وظائفي",
    eyebrow: "وظائف الشركة",
    description:
      "صفحة الوظائف الخاصة بالشركة، ويمكن عرض جميع الوظائف المنشورة أو المسودات أو الحالات المختلفة فيها.",
    highlights: [
      "مناسبة لجدول الوظائف التي أنشأتها الشركة.",
      "يمكن إضافة status filters أو actions لكل وظيفة.",
      "تبويب وظائفي في الهيدر سيتفعّل تلقائيًا.",
    ],
  },
  {
    id: "company-all-jobs",
    path: "/company/jobs/all",
    role: "company",
    title: "عرض كافة الوظائف",
    eyebrow: "وظائف الشركة",
    description:
      "صفحة تفصيلية لجميع الوظائف الخاصة بالشركة، مناسبة لقوائم أكثر تفصيلًا أو لإدارة كاملة للوظائف.",
    highlights: [
      "ممكن تستخدميها كصفحة listing تفصيلية.",
      "يمكن لاحقًا دمجها مع الفرز والفلترة والبحث.",
      "تبقى ضمن نفس layout الخاص بالشركة.",
    ],
  },
  {
    id: "company-create-job",
    path: "/company/jobs/create",
    role: "company",
    title: "إنشاء وظيفة",
    eyebrow: "إنشاءات الشركة",
    description:
      "هذه صفحة إنشاء وظيفة جديدة للشركة، وهي المكان المناسب للفورم الكامل الخاص بالنشر.",
    highlights: [
      "ضعي هنا form إنشاء الوظيفة.",
      "يمكن لاحقًا إعادة استخدام نفس الصفحة للتعديل أيضًا.",
      "تبويب إنشاء في الهيدر سيقود مباشرة لهذه الصفحة.",
    ],
  },
  {
    id: "company-create-training",
    path: "/company/trainings/create",
    role: "company",
    title: "إنشاء تدريب",
    eyebrow: "إنشاءات الشركة",
    description:
      "صفحة إنشاء تدريب للشركة، مناسبة لفورم النشر الخاص بالتدريبات أو فرص التدريب الداخلية.",
    highlights: [
      "يمكنك استخدام نفس بنية form الخاصة بالوظائف مع تعديلات بسيطة.",
      "مرتبطة مباشرة من dropdown إنشاء.",
      "لا تحتاج هذه الصفحة لأي header/footer خاص بها.",
    ],
  },
  {
    id: "company-applications",
    path: "/company/applications",
    role: "company",
    title: "الطلبات",
    eyebrow: "إدارة الطلبات",
    description:
      "صفحة إدارة طلبات التوظيف الواردة إلى الشركة، ويمكن تنظيمها حسب الحالة أو الوظيفة أو التاريخ.",
    highlights: [
      "مناسبة لجدول أو Kanban للطلبات.",
      "يمكن لاحقًا إضافة فلترة حسب الوظيفة أو المرشح.",
      "الهيدر يبقى موحّدًا لبقية صفحات الشركة.",
    ],
  },
  {
    id: "company-studies",
    path: "/company/studies",
    role: "company",
    title: "دراسات",
    eyebrow: "محتوى الشركة",
    description:
      "صفحة الدراسات أو المحتوى الذي تنشره الشركة، ويمكن استخدامها للمقالات أو التقارير أو الأبحاث.",
    highlights: [
      "يمكن تحويلها إلى listing للمقالات أو الدراسات.",
      "مناسبة للـ cards أو الجداول حسب نوع المحتوى.",
      "تندرج تحت نفس بنية الشركة بالكامل.",
    ],
  },
  {
    id: "company-guidance",
    path: "/company/guidance",
    role: "company",
    title: "إرشاد وظيفي",
    eyebrow: "محتوى الشركة",
    description:
      "صفحة الإرشاد الوظيفي من جهة الشركة، مناسبة لنشر النصائح أو المعلومات الموجهة للمتقدمين.",
    highlights: [
      "يمكن استخدامها لمحتوى تثقيفي أو معلوماتي.",
      "ممكن ربطها لاحقًا بنظام مقالات أو منشورات.",
      "تظل الصفحة child داخل company layout.",
    ],
  },
  {
    id: "company-training-list",
    path: "/company/trainings",
    role: "company",
    title: "عرض كافة التدريبات",
    eyebrow: "تدريبات الشركة",
    description:
      "صفحة جميع التدريبات التي تعرضها الشركة، وهي مناسبة للقوائم والإدارة والمتابعة.",
    highlights: [
      "ضعي هنا قائمة التدريبات المنشورة.",
      "يمكن إضافة filter حسب الحالة أو القسم.",
      "مرتبطة أيضًا من الفوتر مباشرة.",
    ],
  },
  {
    id: "company-training-applications",
    path: "/company/trainings/applications",
    role: "company",
    title: "عرض طلبات التدريب",
    eyebrow: "تدريبات الشركة",
    description:
      "صفحة طلبات التدريب، وهي مخصصة لإدارة المتقدمين على فرص التدريب التابعة للشركة.",
    highlights: [
      "مثالية لعرض طلبات التدريب في table أو board.",
      "يمكن لاحقًا إضافة تقييم أو قبول ورفض مباشر.",
      "تظهر داخل نفس layout للشركة تلقائيًا.",
    ],
  },
  {
    id: "company-profile",
    path: "/company/profile",
    role: "company",
    title: "عرض الملف الشخصي",
    eyebrow: "ملف الشركة",
    description:
      "صفحة الملف الشخصي للشركة، ويمكن أن تعرض بيانات الشركة وشعارها ووصفها ومعلومات التواصل.",
    highlights: [
      "مناسبة لبيانات الشركة الأساسية.",
      "يمكن ربطها لاحقًا مع صفحة public profile.",
      "ستبقى ضمن نفس layout بدون تكرار.",
    ],
  },
  {
    id: "company-profile-edit",
    path: "/company/profile/edit",
    role: "company",
    title: "تعديل الملف الشخصي",
    eyebrow: "ملف الشركة",
    description:
      "صفحة تعديل بيانات الشركة، مثل الاسم والشعار والوصف وبيانات التواصل والموقع.",
    highlights: [
      "ضعي هنا form خاص ببيانات الشركة.",
      "يمكن تقسيمه إلى sections واضحة.",
      "لا حاجة لتكرار أي عناصر layout داخله.",
    ],
  },
  {
    id: "company-account",
    path: "/company/account",
    role: "company",
    title: "إعدادات الحساب",
    eyebrow: "ملف الشركة",
    description:
      "صفحة إعدادات الحساب للشركة، مثل أمان الحساب والأذونات وتفضيلات الإشعارات.",
    highlights: [
      "مناسبة لإعدادات الحساب والإشعارات والصلاحيات.",
      "يمكن لاحقًا فصلها إلى تبويبات فرعية إذا كبرت.",
      "هذه صفحة أخرى تندرج تلقائيًا تحت company layout.",
    ],
  },
];

export const portalPagesByRole: Record<PortalRole, PortalPageDefinition[]> = {
  user: userPortalPages,
  company: companyPortalPages,
};

export function getPortalPageByPath(role: PortalRole, path: string) {
  return portalPagesByRole[role].find((page) => page.path === path);
}

export function getPortalPageById(role: PortalRole, pageId: string) {
  return portalPagesByRole[role].find((page) => page.id === pageId);
}

export function getPortalPathByPageId(role: PortalRole, pageId: string) {
  return getPortalPageById(role, pageId)?.path;
}
