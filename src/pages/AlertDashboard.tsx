import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AIDetectionDashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [probability, setProbability] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = oldProgress + 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setProbability(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const fakeProbability = Math.random();
      setProbability(fakeProbability);
    } catch (err) {
      setError('An error occurred during detection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (): string => {
    if (probability === null) return 'text-gray-400';
    if (probability < 0.3) return 'text-green-400';
    if (probability < 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <Card className="max-w-2xl mx-auto shadow-lg bg-gray-800 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-2xl font-semibold text-white">
            AI Content Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-sm text-gray-400">PDF, DOC, TXT (MAX. 10MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            {file && (
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              style={{
                backgroundColor: file && !isLoading ? '#4f46e5' : '#374151',
                color: file && !isLoading ? 'white' : '#9ca3af',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                if (file && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#4338ca';
                }
              }}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                if (file && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#4f46e5';
                }
              }}
              className="w-full p-3 rounded-md font-semibold flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Analyzing...
                </>
              ) : (
                'Detect AI Content'
              )}
            </button>
            {isLoading && (
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-200 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            {probability !== null && !isLoading && (
              <div className="text-center">
                <span className={`text-5xl font-bold ${getStatusColor()}`}>
                  {(probability * 100).toFixed(1)}%
                </span>
                <p className="mt-2 text-gray-300">AI Content Probability</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-800 text-red-300">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDetectionDashboard;