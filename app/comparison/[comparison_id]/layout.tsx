
interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ comparison_id: string }>
}
export default async function Layout({children}: LayoutProps) {
    return (
        <div className="w-full flex items-center h-full justify-center flex-col relative">
            {children}
        </div>
    )
}
