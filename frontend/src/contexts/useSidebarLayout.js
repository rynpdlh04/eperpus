import { useContext } from "react";
import SidebarLayoutContext from "./SidebarLayoutContext";

export default function useSidebarLayout() {
    return useContext(SidebarLayoutContext) ?? {
        userSidebarCollapsed: false,
        adminSidebarCollapsed: false
    };
}
