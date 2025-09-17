import { MeggieHeader } from "@/components/MeggieHeader";
import { MeggieChat } from "@/components/MeggieChat";
import kitchenBackground from "@/assets/kitchen-background.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kitchenBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-creamy-white/90 via-creamy-white/95 to-soft-sage/80"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col max-w-4xl mx-auto bg-creamy-white/80 backdrop-blur-sm border-x border-warm-peach/20">
        <MeggieHeader />
        <div className="flex-1 flex flex-col min-h-0">
          <MeggieChat />
        </div>
      </div>
    </div>
  );
};

export default Index;
