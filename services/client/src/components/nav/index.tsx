import {
    Button,
    Header,
    HeaderGlobalAction,
    HeaderGlobalBar,
    HeaderName,
    HeaderPanel,
    Switcher,
    SwitcherDivider,
    SwitcherItem,
} from "carbon-components-react"
import {Login16, UserAvatar20} from "@carbon/icons-react"
import {Link} from "react-router-dom"
import styles from "./index.module.scss"
import React, {useContext, useEffect} from "react"
import {AuthContext} from "~/contexts"
import {auth} from "~/firebase"

export const Navbar: React.FC = () => {
    const {currentUser} = useContext(AuthContext)
    const [isExpanded, setIsExpanded] = React.useState(false)

    useEffect(() => {
        setIsExpanded(false)
    }, [Boolean(currentUser)])

    return (
        <Header>
            <Link to="/" className={`${styles.headerNameLink}`}>
                <HeaderName prefix="Pill">AID</HeaderName>
            </Link>
            {currentUser && (
                <>
                    <Button as={Link} to="/form" kind="ghost" tooltipPosition="left">
                        Drug Sign-up
                    </Button>
                    <Button as={Link} to="/drugview" kind="ghost" tooltipPosition="left">
                        View Drug Inventory
                    </Button>
                </>
            )}
            <HeaderGlobalBar>
                {currentUser ? (
                    <HeaderGlobalAction
                        aria-label={currentUser.displayName ?? currentUser.email ?? "Profile"}
                        tooltipAlignment="end"
                        isActive={isExpanded}
                        onClick={() => setIsExpanded((_isExpanded) => !_isExpanded)}
                    >
                        <UserAvatar20 />
                    </HeaderGlobalAction>
                ) : (
                    <Button as={Link} to="/login" kind="primary" renderIcon={Login16}>
                        Log In
                    </Button>
                )}
            </HeaderGlobalBar>

            {currentUser && (
                <HeaderPanel expanded={isExpanded}>
                    <Switcher>
                        <li className={`bx--switcher__item ${styles.displaySwitcherItem}`}>
                            {currentUser.displayName ?? currentUser.email ?? ""}
                        </li>
                        <SwitcherDivider />
                        <SwitcherItem>Profile</SwitcherItem>
                        <SwitcherItem>Preferences</SwitcherItem>
                        <SwitcherDivider />
                        <SwitcherItem onClick={() => auth.signOut()}>Log Out</SwitcherItem>
                    </Switcher>
                </HeaderPanel>
            )}
        </Header>
    )
}

export default Navbar
