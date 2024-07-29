import { BarChart2, Clock, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <main className="min-h-screen text-center flex-grow flex flex-col justify-center items-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mt-[120px] pt-5 md:mt-0 mb-6">
        Your Asset Management System
      </h1>
      <p className="text-xl md:text-2xl mb-10 text-gray-600 p-2">
        Manage your assets and departments with ease.
        <br />
        Keep track of your assets and departments with ease.
      </p>
      <div className="flex flex-row justify-center gap-4">
        <a href="/assets">
          <Button size="lg" className="rounded bg-zinc-900 text-white hover:bg-zinc-700 select-none">
            Check Assets
          </Button>
        </a>

        <a href="/report">
          <Button size="lg" className="rounded bg-zinc-900 text-white hover:bg-zinc-700 select-none">
            Report
          </Button>
        </a>
      </div>

      <div className="flex flex-col md:flex-row justify-around mt-16 mb-10 w-full">
        {[
          { Icon: Clipboard, title: 'Easy Inventory', description: 'Log and track assets with just a few clicks' },
          { Icon: BarChart2, title: 'Insightful Analytics', description: 'Get detailed reports on asset utilization and maintenance' },
          { Icon: Clock, title: 'Maintenance Scheduling', description: 'Set up automated reminders for asset upkeep' }
        ].map(({ Icon, title, description }, index) => (
          <div key={index} className="text-center max-w-[200px] mx-auto md:mx-0 mb-8 md:mb-0">
            <Icon className="mx-auto text-4xl mb-2" size={48} />
            <h3 className="font-bold mb-2 text-[#2c3e50]">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </main>
    
  );
}