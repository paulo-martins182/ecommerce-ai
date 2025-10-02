import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "CartWeb. - Store Dashboard",
    description: "CartWeb. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
