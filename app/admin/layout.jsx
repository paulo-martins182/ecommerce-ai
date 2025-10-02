import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "CartWeb. - Admin",
    description: "CartWeb. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
