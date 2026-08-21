import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { clearAuthSession, useLogout } from "../../api/auth"
import { Button } from "../global/ui/button"

export default function PortalAccountLogoutButton() {
    const navigate = useNavigate()
    const logoutMutation = useLogout({
        onSettled: () => {
            clearAuthSession()
            navigate("/login", { replace: true })
        },
    })

    return (
        <Button
            type="button"
            variant="panel"
            size="normal"
            loading={logoutMutation.isPending}
            onClick={() => {
                logoutMutation.mutate()
            }}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[14px] border border-[#d7b4b1] bg-[#fff7f6] !px-5 !py-2.5 !text-size15 !font-bold !text-[#b52f2f] transition duration-200 hover:!bg-[#ffecea]"
        >
            {!logoutMutation.isPending ? <LogOut className="ms-2 size-4" /> : null}
            تسجيل الخروج
        </Button>
    )
}
