export interface AdminPageDefinition {
  id: string;
  path: string;
  label: string;
  title: string;
  description: string;
}

export const adminPages: AdminPageDefinition[] = [
  {
    id: "admin-overview",
    path: "/admin",
    label: "نظرة عامة",
    title: "لوحة تحكم الأدمن",
    description: "مساحة متابعة وإدارة بيانات المنصة من مكان واحد.",
  },
  {
    id: "admin-seekers",
    path: "/admin/seekers",
    label: "الباحثون عن عمل",
    title: "إدارة الباحثين عن عمل",
    description: "عرض حسابات الباحثين عن عمل ومراجعة تفاصيلهم وإدارة الحظر.",
  },
  {
    id: "admin-companies",
    path: "/admin/companies",
    label: "الشركات",
    title: "إدارة الشركات",
    description: "عرض الشركات المسجلة ومراجعة بياناتها وإدارة الحظر.",
  },
  {
    id: "admin-jobs",
    path: "/admin/jobs",
    label: "فرص العمل",
    title: "فرص العمل المنشورة",
    description: "متابعة فرص العمل المنشورة من الشركات وإدارة حالتها.",
  },
  {
    id: "admin-trainings",
    path: "/admin/trainings",
    label: "فرص التدريب",
    title: "فرص التدريب المنشورة",
    description: "متابعة فرص التدريب المنشورة من الشركات وإدارة حالتها.",
  },
  {
    id: "admin-managers",
    path: "/admin/managers",
    label: "مشرفو المنصة",
    title: "إدارة مشرفي المنصة",
    description: "إدارة حسابات الأدمن القادرة على الدخول إلى لوحة التحكم.",
  },
];

export function getAdminPageByPath(path: string) {
  return adminPages.find((page) => page.path === path);
}

export function getAdminPageById(pageId: string) {
  return adminPages.find((page) => page.id === pageId);
}
