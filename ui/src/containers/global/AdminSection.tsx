import { FC } from 'react';
import { useQuery } from '@apollo/client';
import SignUpApprovalIcon from '../../components/atoms/Icons/SignUpApprovalIcon';
import AdminDashboardIcon from '../../components/atoms/Icons/AdminDashboardIcon';
import NavAdminQuery from '../../gql/queries/NavAdminQuery';
import { NavAdmin } from '../../gql/generated/NavAdmin';
import { buildAdminButtonProps } from '../../utils/BreadcrumbButtonsUtils';
import { Section, SectionProps } from '../abstractions/Section';
import { SectionKey } from '../SectionsDetails';
import { ChildrenOnlyProps } from '../../types/props/ChildrenOnlyProps';
import { toAdmin, toSignupApproval } from '../../utils/NavigationPaths';
import { useRouter } from 'next/router';

const AdminSection: FC<ChildrenOnlyProps> = (props: ChildrenOnlyProps) => {
    const router = useRouter();

    const sectionProps: SectionProps<NavAdmin> = {
        // Admin = all permissions
        extractOrgUserDetails: () => ({
            id: '',
            name: '',
            is_paid: false,
            tag_manager_account: null,
            data_manager_account: null,
            me: {
                id: '',
                owner: false,
                permissions: {
                    can_view: true,
                    can_create: true,
                    can_edit: true,
                    can_delete: true,
                    is_admin: true,
                },
                can_create_tag_manager_trial: true,
                can_create_data_manager_trial: true,
            },
        }),
        sectionKey: SectionKey.admin,
        queryResult: useQuery<NavAdmin>(NavAdminQuery),
        buildButtonsProps: (data) => [buildAdminButtonProps(router, data.me.orgs)],
        buildMenuItemsProps: () => [
            {
                icon: <AdminDashboardIcon />,
                label: 'Dashboard',
                link: toAdmin,
            },
            {
                icon: <SignUpApprovalIcon />,
                label: 'Signup Approval',
                link: toSignupApproval,
            },
        ],
        children: props.children,
    };

    return <Section<NavAdmin> {...sectionProps} />;
};

export default AdminSection;
