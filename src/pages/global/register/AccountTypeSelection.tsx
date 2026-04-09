import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import companyCardImage from "../../../assets/common/company_img.png";
import personCardImage from "../../../assets/common/seeker_img.png";
import { cn } from "../../../utils/cn";

type AccountRole = "person" | "company";

interface AccountTypeCard {
  id: AccountRole;
  title: string;
  description: string;
  imageSrc: string;
}

const accountTypeCards: AccountTypeCard[] = [
  {
    id: "person",
    title: "شخص",
    description:
      "إذا كنت شخص رائد في مجالات الاعمال أو البرمجة أو التصميم ... يمكنك بدء رحلتك في سوق الأعمال  عن طريق النقر على البطاقة",
    imageSrc: personCardImage,
  },
  {
    id: "company",
    title: "شركة",
    description:
      "إذا كنت شركة رائدة في مجالات الاعمال أو البرمجة أو الاعلانات .... انقر هنا لتسجيل المعلومات ",
    imageSrc: companyCardImage,
  },
];

function AccountTypeSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<AccountRole | null>(null);

  const handleRoleSelect = (role: AccountRole) => {
    setSelectedRole(role);
    sessionStorage.setItem("selected-account-role", role);

    if (role === "person") {
      navigate("/register/person-profile");
      return;
    }

    navigate("/register/company-profile");
  };

  return (
    <main
      dir="rtl"
      className="relative min-h-svh overflow-hidden text-white"
      style={{
        backgroundImage:
          "radial-gradient(50% 50% at 50% 50%, #385fbd 0%, #122356 100%)",
      }}
    >
      <div className="relative flex min-h-svh items-center justify-center px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="absolute left-4 top-4 inline-flex size-9 cursor-pointer items-center justify-center rounded-[10px] border border-white/18 bg-white/10 text-white transition duration-200 hover:bg-white/15 sm:left-7 sm:top-7"
          aria-label="العودة إلى إنشاء الحساب"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center justify-center gap-7 py-2 sm:gap-8">
          <div className="space-y-4 text-center">
            <h1 className="text-[2rem] font-bold leading-[1.35] text-white sm:text-[2.35rem] lg:text-[2.85rem]">
              قم باختيار نوع الحساب الخاص بك
            </h1>
            <p className="mx-auto max-w-[920px] text-[1.12rem] leading-[1.95] text-white/92 sm:text-[1.35rem] lg:text-[1.7rem]">
              يمكنك اختيار نوع الحساب الخاص بك من خلال
              <br />
              النقر على البطاقة التي تتعلق بنوع الحساب
            </p>
          </div>

          <div className="grid w-full max-w-[1180px] gap-5 md:grid-cols-2 md:justify-items-center min-[1280px]:gap-x-[240px]">
            {accountTypeCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleRoleSelect(card.id)}
                className={cn(
                  "group mx-auto w-full max-w-[420px] cursor-pointer rounded-[26px] border border-[var(--warning-color)] bg-white p-3 text-right shadow-[0_18px_58px_rgba(4,12,38,0.24)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(4,12,38,0.3)]",
                  selectedRole === card.id &&
                    "translate-y-[-4px] border-white shadow-[0_24px_76px_rgba(4,12,38,0.34)] ring-2 ring-white/90 ring-offset-2 ring-offset-[#29469c]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#223d8e]",
                )}
              >
                <div className="overflow-hidden rounded-[20px]">
                  <img
                    src={card.imageSrc}
                    alt={card.title}
                    className="h-[150px] w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:h-[168px] lg:h-[176px]"
                  />
                </div>

                <div className="space-y-2.5 px-2 pb-3 pt-4 sm:px-3.5">
                  <h2 className="text-center text-[1.55rem] font-bold leading-none text-[var(--main-color)] sm:text-[1.7rem]">
                    {card.title}
                  </h2>

                  <p className="mx-auto max-w-[300px] text-center text-[0.96rem] leading-[1.8] text-[#44474f] sm:text-[1rem]">
                    {card.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default AccountTypeSelection;
