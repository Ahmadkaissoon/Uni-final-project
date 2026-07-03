# 1. نبذة عن المشروع

هذا المشروع هو Frontend لمنصة توظيف مبنية بـ React. الواجهات الظاهرة في الكود تدعم ثلاث فئات رئيسية من المستخدمين:

- الباحث عن عمل: تصفح الوظائف، التصنيفات، التدريبات، الشركات، الإرشاد الوظيفي، الوظائف المحفوظة، وقسم الملف الشخصي.
- الشركة: لوحة خاصة بالشركة، عرض وظائفها وتدريباتها، إنشاء وظيفة أو تدريب، متابعة الطلبات، وإدارة ملف الشركة.
- admin: لوحة إدارة تحتوي على نظرة عامة، الباحثين عن عمل، الشركات، الوظائف، التدريبات، ومشرفي المنصة.

أهم الميزات الظاهرة من الملفات: تسجيل الدخول والتسجيل، اختيار نوع الحساب، استكمال ملف شخصي للباحث أو الشركة، حماية بعض المسارات عند عدم وجود جلسة، عرض بيانات من API للوظائف والتدريبات والشركات والمحفوظات، واستخدام بيانات mock داخل صفحات admin. الأدلة الأساسية: `src/App.tsx`, `src/router/portalPages.ts`, `src/router/adminPages.ts`, `src/api/*`, `src/pages/*`.

# 2. التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---|---:|---|
| TypeScript | `~5.9.3` | لغة التطوير وإعدادات التحقق في `package.json` و`tsconfig.app.json`. |
| React | `^19.2.4` | بناء الواجهات، مثبت في `package.json` ومستخدم في `src/main.tsx`. |
| React DOM | `^19.2.4` | ربط التطبيق بعنصر `root` في `src/main.tsx`. |
| Vite | `^8.0.1` | أداة البناء والتشغيل، مثبتة في `package.json` ومضبوطة في `vite.config.ts`. |
| @vitejs/plugin-react | `^6.0.1` | إضافة React لـ Vite في `vite.config.ts`. |
| Tailwind CSS | `^4.2.2` | تنسيق الواجهات عبر `tailwindcss` و`@tailwindcss/vite` في `package.json` و`vite.config.ts`. |
| Radix UI | عدة حزم مثل `@radix-ui/react-dialog ^1.1.14` | مكونات UI أساسية، مستخدمة في `src/components/global/ui/*`. |
| lucide-react | `^1.7.0` | أيقونات React، مثبت في `package.json`. |
| react-icons | `^5.5.0` | أيقونات إضافية، مثبت في `package.json`. |
| @tanstack/react-query | `^5.80.7` | إدارة طلبات API وحالة loading/error/cache، مستخدم في `src/main.tsx`, `src/api/queryClient.ts`, `src/api/useQueries.ts`. |
| @tanstack/react-query-devtools | `^5.80.7` | أدوات المطور لـ React Query في `src/main.tsx`. |
| @tanstack/react-table | `^8.21.3` | بناء الجداول، مثبت في `package.json` وموجود مكوّن جدول في `src/components/global/table`. |
| axios | `^1.10.0` | الاتصال بالـ API عبر `src/api/axiosClient.ts`. |
| react-router-dom | `^7.6.2` | تعريف Routes والتنقل، مستخدم في `src/App.tsx` و`src/router/*`. |
| sonner | `^2.0.5` | Toast notifications لطلبات API، مستخدم في `src/api/apiToast.ts` و`src/components/global/toast/SonnerToast.tsx`. |
| sweetalert2 | `^11.22.0` | تنبيهات/حوارات، مثبت في `package.json`. |
| react-slick / slick-carousel | `^0.31.0` / `^1.8.1` | carousel، ملفات CSS مستوردة في `src/main.tsx`. |
| swiper | `^11.2.10` | slider/carousel، مثبت في `package.json`. |
| apexcharts / chart.js / chartjs-plugin-datalabels | `^5.3.5` / `^4.5.0` / `^2.2.0` | الرسوم البيانية، مثبتة في `package.json` ومكوّن charts موجود في `src/components/portal/PortalCompanyChartsSection.tsx`. |
| class-variance-authority | `^0.7.1` | تنظيم variants لبعض مكونات UI، مستخدم في `src/components/global/ui/button.tsx`. |
| tailwind-merge | `^3.4.0` | دمج classes، مستخدم عبر `src/utils/cn.ts`. |
| react-secure-storage | `^1.3.2` | مثبت في `package.json`، ولم يظهر استخدامه داخل `src` حسب الملفات الحالية. |

لا توجد مكتبة نماذج مثل Formik أو React Hook Form في `package.json`. النماذج مبنية بمكونات وحالة React محلية، والتحقق من البيانات يظهر كمنطق TypeScript/دوال محلية مثل `src/utils/portalProfileSchemas.ts` وصفحات التسجيل.

# 3. الأدوات الخارجية

- npm: يوجد `package-lock.json` وسكربتات npm داخل `package.json`.
- Git: يوجد مجلد `.git`.
- GitHub: remote باسم `origin` يشير إلى GitHub، تم التحقق منه عبر إعدادات Git المحلية.
- Postman: يوجد ملف `src/assets/job-entry.postman_collection.json`.
- ESLint: موجود في `package.json` و`eslint.config.js` مع سكربت `npm run lint`.
- TypeScript compiler: مستخدم في سكربت `build` داخل `package.json`.
- Swagger/OpenAPI: لا يوجد دليل على ملفات Swagger أو OpenAPI داخل المستودع.
- Docker: لا يوجد دليل على Dockerfile أو docker-compose داخل المستودع.
- Prettier: لا يوجد ملف إعداد أو dependency لـ Prettier داخل `package.json`.
- أدوات النشر: لا يوجد دليل على إعداد نشر مثل Vercel/Netlify/GitHub Actions داخل المستودع.

# 4. بنية المشروع

```text
.
├─ public/
├─ src/
│  ├─ api/
│  ├─ assets/
│  ├─ components/
│  │  ├─ global/
│  │  ├─ layout/
│  │  └─ portal/
│  ├─ pages/
│  │  ├─ admin/
│  │  ├─ global/
│  │  └─ portal/
│  ├─ router/
│  ├─ utils/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ .env
├─ eslint.config.js
├─ package.json
├─ tsconfig*.json
└─ vite.config.ts
```

- `src/api`: إعداد Axios، hooks مبنية على React Query، وملفات التعامل مع endpoints.
- `src/router`: تعريف صفحات portal/admin وحماية layouts.
- `src/pages`: صفحات التطبيق مقسمة إلى صفحات عامة، admin، وportal.
- `src/components`: مكونات عامة، مكونات layout، ومكونات خاصة ببوابة التوظيف.
- `src/utils`: أدوات مساعدة ومخططات بيانات محلية للملفات الشخصية.
- `src/assets`: صور وأيقونات وملف Postman collection.
- `public`: ملفات عامة مثل favicon وملف icons.
- ملفات الإعداد: `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `.env`, `package.json`.

# 5. الصفحات وأنواع المستخدمين

المسارات العامة من `src/App.tsx`:

| Route | الصفحة | نوع المستخدم |
|---|---|---|
| `/login` | Login | عام |
| `/register` | Register | عام |
| `/register/account-type` | AccountTypeSelection | عام |
| `/register/company-profile` | CompanyProfileWizard | عام/تسجيل شركة |
| `/register/person-profile` | PersonProfileWizard | عام/تسجيل باحث |
| `/reset-otp` | ResetOtp | عام |
| `/verify-password` | VerifyPassword | عام |
| `*` | RouterNotFoundPage | عام |

مسارات الباحث عن عمل من `src/router/portalPages.ts` و`UserLayoutRoute.tsx`:

| Route | id | نوع المستخدم |
|---|---|---|
| `/` | `home` | user |
| `/jobs` | `jobs` | user |
| `/jobs/all` | `jobs-all` | user |
| `/jobs/categories` | `jobs-categories` | user |
| `/jobs/categories/:id` | `category-jobs` | user |
| `/jobs/internships` | `internships` | user |
| `/jobs/internships/details` | `internship-details` | user |
| `/jobs/watchlist` | `watchlist` | user |
| `/jobs/saved` | `saved-jobs` | user |
| `/companies` | `companies` | user |
| `/companies/all` | `companies-all` | user |
| `/career-guidance` | `career-guidance` | user |
| `/profile` | `profile` | user |
| `/profile/edit` | `profile-edit` | user |
| `/profile/settings` | `profile-settings` | user |

مسارات الشركة من `src/router/portalPages.ts` و`CompanyLayoutRoute.tsx`:

| Route | id | نوع المستخدم |
|---|---|---|
| `/company` | `company-home` | company |
| `/company/jobs` | `company-jobs` | company |
| `/company/jobs/all` | `company-all-jobs` | company |
| `/company/jobs/create` | `company-create-job` | company |
| `/company/trainings/create` | `company-create-training` | company |
| `/company/applications` | `company-applications` | company |
| `/company/studies` | `company-studies` | company |
| `/company/guidance` | `company-guidance` | company |
| `/company/trainings` | `company-training-list` | company |
| `/company/trainings/applications` | `company-training-applications` | company |
| `/company/profile` | `company-profile` | company |
| `/company/profile/edit` | `company-profile-edit` | company |
| `/company/account` | `company-account` | company |

مسارات admin من `src/router/adminPages.ts` و`AdminLayoutRoute.tsx`:

| Route | id | نوع المستخدم |
|---|---|---|
| `/admin` | `admin-overview` | admin |
| `/admin/seekers` | `admin-seekers` | admin |
| `/admin/companies` | `admin-companies` | admin |
| `/admin/jobs` | `admin-jobs` | admin |
| `/admin/trainings` | `admin-trainings` | admin |
| `/admin/managers` | `admin-managers` | admin |

# 6. الربط مع الـ Backend

- مكتبة الطلبات: Axios عبر `src/api/axiosClient.ts`.
- مكان `baseURL`: داخل `src/api/axiosClient.ts` باستخدام `import.meta.env.VITE_API_URL`، مع fallback مضمّن في الكود. يوجد المتغير `VITE_API_URL` في `.env`، ولم يتم عرض قيمته هنا.
- إرسال Token: `axiosClient` يقرأ من `localStorage` و`sessionStorage` بالمفاتيح `access_token`, `token`, `auth_token`، ثم يرسل `Authorization: Bearer <token>` داخل interceptor.
- Refresh token: عند 401 يحاول `POST /auth/refresh` باستخدام `refresh_token`، ثم يخزن tokens الجديدة أو يمسح الجلسة ويعيد التوجيه إلى `/login`.
- Loading وErrors: React Query يعطي حالات مثل `isLoading`, `isFetching`, `isPending`. رسائل الأخطاء تعرض عبر `withApiToast` في `src/api/apiToast.ts` باستخدام `sonner`.
- React Query: الإعداد العام في `src/api/queryClient.ts` مع `retry: 1`, `refetchOnWindowFocus: false`, و`staleTime` دقيقة واحدة.
- رفع الملفات و`FormData`: موجود في التسجيل `buildSeekerSignupPayload` و`buildCompanySignupPayload` داخل `src/api/auth.ts`، وتحديث ملف الباحث في `src/api/portalSeekerProfile.ts`. `useUpdateData` يضيف `Content-Type: multipart/form-data` عند `isFormData = true`.

# 7. مسارات API المستخدمة

| Method | Endpoint | الاستخدام | الملف |
|---|---|---|---|
| POST | `/auth/login` | تسجيل الدخول وتخزين tokens | `src/api/auth.ts` |
| POST | `/auth/signup` | إنشاء حساب باحث أو شركة باستخدام `FormData` | `src/api/auth.ts` |
| POST | `/auth/logout` | تسجيل الخروج | `src/api/auth.ts` |
| POST | `/auth/refresh` | تجديد access token عند 401 | `src/api/axiosClient.ts` |
| GET | `/auth/profile` | جلب بيانات المستخدم الحالي للـ layout والملف الشخصي | `src/api/portalAuthProfile.ts`, `src/api/portalSeekerProfile.ts` |
| PUT | `/users/profile/seeker` | تحديث ملف الباحث مع صورة اختيارية | `src/api/portalSeekerProfile.ts` |
| GET | `/users/companies` | جلب قائمة الشركات | `src/api/portalCompanies.ts` |
| GET | `/jobs` | جلب الوظائف | `src/api/portalJobs.ts` |
| GET | `/jobs/nearby` | جلب وظائف قريبة/مقترحة | `src/api/portalJobs.ts` |
| GET | `/jobs/:jobId` | جلب تفاصيل وظيفة | `src/api/portalJobs.ts` |
| GET | `/job-categories` | جلب تصنيفات الوظائف | `src/api/portalJobs.ts` |
| GET | `/job-categories/:categoryId/jobs` | جلب وظائف تصنيف محدد | `src/api/portalJobs.ts` |
| GET | `/trainings` | جلب فرص التدريب | `src/api/portalTrainings.ts` |
| GET | `/trainings/:trainingId` | جلب تفاصيل تدريب | `src/api/portalTrainings.ts` |
| GET | `/trainings/:trainingId/similar` | جلب تدريبات مشابهة | `src/api/portalTrainings.ts` |
| GET | `/saved/jobs` | جلب الوظائف المحفوظة | `src/api/portalSaved.ts` |
| POST | `/saved/jobs` | حفظ وظيفة | `src/api/portalSaved.ts` |
| DELETE | `/saved/jobs/:savedId` | إزالة وظيفة محفوظة | `src/components/portal/usePortalSavedJobs.ts` |
| GET | `/saved/trainings` | جلب التدريبات المحفوظة | `src/api/portalSaved.ts` |
| POST | `/saved/trainings` | حفظ تدريب | `src/api/portalSaved.ts` |
| DELETE | `/saved/trainings/:savedId` | إزالة تدريب محفوظ | `src/components/portal/usePortalSavedTrainings.ts` |

ملفات `src/api/adminCompanies.ts`, `src/api/adminJobs.ts`, `src/api/adminSeekers.ts`, `src/api/adminTrainings.ts`, و`src/api/adminManagers.ts` تستخدم mock data محلية ولا تحتوي على طلبات API.

# 8. المصادقة والصلاحيات

- تسجيل الدخول: يتم عبر hook `useLogin` في `src/api/auth.ts`، ويستدعي `POST /auth/login`.
- تخزين Token: `storeAuthTokens` يخزن `accessToken` في `localStorage` تحت `access_token` و`refreshToken` تحت `refresh_token`.
- تسجيل الخروج: `useLogout` يستدعي `POST /auth/logout`. بعدها تستدعي layouts `clearAuthSession` لمسح المفاتيح ثم التوجيه إلى `/login`.
- حماية Routes: `AdminLayoutRoute.tsx` و`PortalRoleLayoutRoute.tsx` يستخدمان `hasAuthSession()`. عند عدم وجود جلسة يتم التوجيه إلى `/login?redirect=...`.
- التحقق من Roles: `resolveAuthRedirect` في `src/api/auth.ts` يقرأ role من استجابة login/signup ويوجه `admin` إلى `/admin` و`company` إلى `/company` وغير ذلك إلى `/`. لا يوجد في `AdminLayoutRoute.tsx` تحقق صريح من role، بل يتحقق فقط من وجود جلسة. `UserLayoutRoute` و`CompanyLayoutRoute` يمرران role للـ layout وعرض القوائم، لكن الحماية الفعلية في `PortalRoleLayoutRoute.tsx` تعتمد على وجود الجلسة.
- إعادة التوجيه: عند login/signup يتم تحديد المسار بـ `resolveAuthRedirect`. عند انتهاء الصلاحية أو فشل refresh في `axiosClient.ts` يتم مسح الجلسة والتوجيه إلى `/login`.

# 9. تشغيل المشروع

المتطلبات المستنتجة من المشروع:

- Node.js وnpm.
- تثبيت الحزم باستخدام `npm install` لأن المشروع يحتوي على `package-lock.json`.
- ضبط `.env` بمتغير `VITE_API_URL` عند الحاجة، بدون تضمين قيم سرية في التوثيق.

الأوامر من `package.json`:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

- `npm run dev`: تشغيل Vite للتطوير.
- `npm run build`: تشغيل `tsc -b` ثم `vite build`.
- `npm run preview`: معاينة build محليًا.
- `npm run lint`: تشغيل ESLint.

# 10. ملخص لفريق التوثيق

- لغة البرمجة: TypeScript، مثبتة في `package.json` ومضبوطة في `tsconfig.app.json`.
- Framework/Library: React مع React Router، مثبتة في `package.json` ومستخدمة في `src/main.tsx` و`src/App.tsx`.
- أهم المكتبات: Axios، TanStack React Query، Tailwind CSS، Radix UI، sonner، react-slick، swiper، chart.js، apexcharts.
- أداة البناء: Vite، مثبتة في `package.json` ومضبوطة في `vite.config.ts`.
- مدير الحزم: npm، والدليل `package-lock.json`.
- طريقة الربط مع API: Axios client مركزي في `src/api/axiosClient.ts` مع `baseURL` من `VITE_API_URL` وAuthorization Bearer token.
- الأدوات الخارجية: Git وGitHub موجودان، Postman collection موجود في `src/assets/job-entry.postman_collection.json`، ESLint موجود. لا يوجد دليل على Swagger/OpenAPI أو Docker أو Prettier أو أدوات نشر.
- أدوات الاختبار أو النشر: لا توجد سكربتات test أو إعدادات نشر في `package.json` أو ملفات المشروع الحالية.
