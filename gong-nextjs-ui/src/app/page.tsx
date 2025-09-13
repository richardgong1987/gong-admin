import {redirect} from "next/navigation";
import {PAGES} from "@/lib/constant";

export default function Page() {
    redirect(PAGES.HOME);
}