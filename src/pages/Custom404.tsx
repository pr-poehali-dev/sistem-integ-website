import { Button } from "@/components/ui/button";

const Custom404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-4">
        <img 
          src="https://cdn.poehali.dev/files/LOGO TEXT SYSTEMCRAFT.png" 
          alt="СистемКрафт" 
          className="h-20 w-auto mx-auto mb-8"
        />
        <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-8">
          Извините, но такой страницы не существует.
        </p>
        <Button asChild size="lg">
          <a href="/">
            Вернуться на главную
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Custom404;
