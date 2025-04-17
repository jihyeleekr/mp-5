import Header from "@/components/Header";
import  UrlForm  from "@/components/UrlForm";

export default function HomePage() {
    return (
        <main className="bg-gradient-to-b from-green-100 via-lime-100 to-teal-100 text-black min-h-screen">
            <Header />
            <div className="flex flex-col items-center pt-10 px-4">
                <h2 className="text-3xl font-semibold mb-6">URL Shortener</h2>
                <p className="text-gray-700 mb-6">Shorten your long URLs into compact, shareable links</p>
                <UrlForm />
            </div>
        </main>
    );
}
