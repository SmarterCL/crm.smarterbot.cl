import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a1525] text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
        <p className="text-gray-400 mb-8">Lo sentimos, la página que estás buscando no existe.</p>
        <Link href="/" passHref>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}