'use client';

import { useEffect, useState } from 'react';
import { Button, TextField, FormHelperText } from '@mui/material';
import Link from 'next/link';

export default function ShortenerForm() {
    const [url, setUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [shortenedURL, setShortenedURL] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShortenedURL('');
        setCopied(false);
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, alias }),
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                setError(data.error || 'Something went wrong.');
            } else {
                setShortenedURL(`${baseUrl}/${alias}`);
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (shortenedURL) {
            navigator.clipboard.writeText(shortenedURL).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-4">
            <form
                className="text-black p-8 rounded-2xl max-w-xl w-full bg-white shadow-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-2">Shorten a URL</h2>
                <p className="text-gray-600 mb-4">
                    Enter a long URL to create a shorter, shareable link
                </p>

                <label className="block text-sm font-medium mb-1">URL</label>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="https://example.com/very/long/url"
                    value={url}
                    required
                    onChange={(e) => setUrl(e.target.value)}
                    className="mb-4"
                />

                <label className="block text-sm font-medium mb-1">Custom Alias</label>
                <div className="flex items-center mb-6">
          <span className="text-sm pr-2 text-gray-500 whitespace-nowrap">
            {baseUrl ? `${baseUrl}/` : ''}
          </span>
                    <TextField
                        variant="outlined"
                        placeholder="your-alias"
                        value={alias}
                        required
                        onChange={(e) => setAlias(e.target.value)}
                        fullWidth
                    />
                </div>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        backgroundColor: 'mediumseagreen',
                        '&:hover': { backgroundColor: 'seagreen' },
                        fontWeight: 'bold',
                        py: 1.5,
                    }}
                    disabled={loading}
                >
                    {loading ? 'Shortening...' : 'Shorten'}
                </Button>

                {error && (
                    <FormHelperText sx={{ color: 'red', textAlign: 'center', mt: 2 }}>
                        {error}
                    </FormHelperText>
                )}

                {shortenedURL && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-black-700 font-semibold mb-1">
                            Your shortened URL:
                        </p>
                        <div className="flex justify-between items-center">
                            <Link
                                href={shortenedURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black font-medium underline break-all"
                            >
                                {shortenedURL}
                            </Link>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="ml-4 text-sm border px-3 py-1 rounded hover:bg-gray-100"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
