import Image from "next/image";

function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <div className="">
            {children}
        </div>
    );
}

export default AuthLayout;