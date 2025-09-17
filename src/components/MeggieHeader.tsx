import { ChefHat, Heart } from "lucide-react";

export const MeggieHeader = () => {
  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-warm-peach/10 to-soft-sage/20 py-6 px-4 border-b border-warm-peach/20">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-warm-peach to-warm-orange flex items-center justify-center shadow-warm">
            <ChefHat className="w-6 h-6 text-creamy-white" />
          </div>
          <Heart className="w-4 h-4 text-warm-peach animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-cozy-brown mb-1">Hi, I'm Meggie! 🌸</h1>
        <p className="text-sm text-cozy-brown/70 max-w-md">
          Your caring kitchen buddy for quick, tasty, and budget-friendly hostel meals
        </p>
      </div>
    </div>
  );
};