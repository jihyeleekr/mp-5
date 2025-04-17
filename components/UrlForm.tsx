"use client";

import { useState } from "react";
import { Button, FormHelperText, TextField } from "@mui/material";
import Link from "next/link";
import checkURL from "@/lib/urlChecker";
import getAlias from "@/lib/getAlias";
import CheckIcon from '@mui/icons-material/Check';

export default function UrlForm() {
    const [alias, setAlias] = useState("");
    const [url, setURL] = useState("");
    const [error, setError] = useState("");
    const [shortenedURL, setShortenedURL] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShortenedURL('');
        setCopied(false);
        setError('');
        setLoading(true);

        try {
            if (!url || !alias) {
                setError("No URL or Alias provided.");
                return;
            }

            const validURL = await checkURL(url);
            if (!validURL) {
                setError("Invalid URL: Could not verify URL. Please try again.");
                return;
            }

            const checkAlias = await getAlias(alias);
            if (checkAlias) {
                setError("Invalid alias: This alias already exists");
                return;
            }

            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, alias }),
            });

            let data;
            const contentType = res.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error('Non-JSON response:', text);
                setError('Server returned invalid response.');
                return;
            }

            if (!res.ok || data.error) {
                setError(data.error || 'Something went wrong.');
            } else {
                setShortenedURL(`https://url-shortener-ac.vercel.app/${alias}`);
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <form className="w-2xl rounded-2xl p-5 bg-white" onSubmit={handleSubmit}>
                <h1 className="flex flex-col font-bold text-2xl text-black">
                    Shorten a URL
                </h1>
                <h2 className="flex flex-col font-light text-xl text-gray-500 mb-5">
                    Enter a long URL to create a shorter, shareable link
                </h2>

                <h1 className="font-light text-xl mb-2">
                    URL
                </h1>
                <TextField
                    variant="outlined"
                    sx={{ backgroundColor: "white", width: "100%" }}
                    label="https://example.com/very/long/url"
                    value={url}
                    required
                    onChange={(e) => setURL(e.target.value)}
                />

                <h1 className="font-light text-xl mt-5">
                    Custom Alias
                </h1>
                <div className="flex flex-row justify-left items-center w-full">
                    <h2 className="flex flex-row text-xl font-extralight mr-2">
                        https://url-shortener-ac.vercel.app/
                    </h2>
                    <TextField
                        variant="outlined"
                        sx={{ backgroundColor: "white", width: "50%" }}
                        label="your-custom-alias"
                        value={alias}
                        required
                        onChange={(e) => setAlias(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-full justify-center mt-5">
                    <Button type="submit" variant="contained" sx={{ width: "100%", backgroundColor: "green" }} disabled={loading}>
                        {loading ? 'Shortening...' : 'Shorten'}
                    </Button>
                </div>

                <FormHelperText sx={{ color: "red", textAlign: "center", fontSize: 14 }}>
                    {error ? error : ""}
                </FormHelperText>

                {shortenedURL && (
                    <div className="mt-4 p-4 bg-white text-black text-center border border-gray-500 rounded-2xl">
                        <h1 className="font-semibold text-left">Your Shortened URL: </h1>
                        <div className="flex flex-row justify-between items-center w-full">
                            <Link href={`/${alias}`} target="_blank" className="flex flex-col text-left hover:text-gray-500">
                                {shortenedURL}
                            </Link>
                            <Button variant="outlined" sx={{ width: "10%", backgroundColor: "white" }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(shortenedURL);
                                        setCopied(true);
                                    }}>
                                {copied ? <CheckIcon /> : "Copy"}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}