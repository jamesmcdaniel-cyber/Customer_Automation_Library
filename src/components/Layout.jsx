import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TooltipProvider } from './ui/Tooltip';
import { Header } from './Header';
import { BrandMark } from './BrandMark';

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <TooltipProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="mt-10 border-t border-ac-light-gray">
        <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-x-6 gap-y-2 px-4 py-6 text-[13px] sm:px-8">
          <span className="flex items-center gap-2 font-medium text-ac-dark">
            <BrandMark /> Backstory
          </span>
          <span className="text-ac-med-gray">Public starter guide. For account-specific help, contact your Backstory team.</span>
        </div>
      </footer>
    </TooltipProvider>
  );
}
