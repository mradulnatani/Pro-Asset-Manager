import MaintenanceAnalyzer from "@/components/MaintenanceAnalyzer";
import Navbar from "@/components/Navbar";

export default function Maintenance() {
    return (
        <div className="min-h-screen p-10 pt-[120px]">
            <div className="absolute top-0 left-0 w-full">
                <Navbar />
            </div>
            <MaintenanceAnalyzer />
        </div>
    );
}