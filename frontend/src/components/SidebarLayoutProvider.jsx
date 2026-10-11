import { useState } from "react";
import SidebarLayoutContext from "../contexts/SidebarLayoutContext";

export default function SidebarLayoutProvider({ children }) {
    const [userSidebarCollapsed, setUserSidebarCollapsed] = useState(false);
    const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useState(false);

    return (
        <SidebarLayoutContext.Provider
            value={{
                userSidebarCollapsed,
                setUserSidebarCollapsed,
                adminSidebarCollapsed,
                setAdminSidebarCollapsed
            }}
        >
            {children}
        </SidebarLayoutContext.Provider>
    );
}
