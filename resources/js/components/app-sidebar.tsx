import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, UserPlus, BookCheck, ReceiptText, UsersRound,ScanSearch,ContactRound } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Students',
        href: '/students',
        icon: UserPlus,
    },
    {
        title: 'Courses',
        href: '/courses',
        icon: BookCheck,
    },
    {
        title: 'Batches',
        href: '/batch',
        icon: ScanSearch,
    },
];

const footerNavItems: NavItem[] = [
    
    {
        title: 'Billings ',
        href: '/billings',
        icon: ReceiptText,
    },
     {
        title: 'Lead Management', 
        href: '/leads',
        icon: ContactRound,
    },
    {
        title: 'Website User',
        href: '/users',
        icon: UsersRound,
    },{
        title: 'Users & Permissions',
        href: '/userspermissions',
        icon: LayoutGrid,
    }, {
        title: 'Verify Certificate',
        href: '/',
        icon: ScanSearch,
    }
];

export function AppSidebar() {
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
