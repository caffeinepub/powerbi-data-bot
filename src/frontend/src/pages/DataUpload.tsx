import { useState } from 'react';
import { useAddDataSource, useGetAllDataSources } from '../hooks/useQueries';
import DataSourceList from '../components/DataSourceList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function DataUpload() {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const { mutate: addDataSource, isPending } = useAddDataSource();
  const { data: dataSources, isLoading } = useGetAllDataSources();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = [
      'text/csv',
      'application/json',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|json|xlsx|xls)$/i)) {
      toast.error('Invalid file type. Please upload CSV, JSON, or Excel files.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.');
      return;
    }

    setFile(selectedFile);
    if (!name) {
      setName(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!name.trim() || !file) {
      toast.error('Please provide a name and select a file.');
      return;
    }

    try {
      // Simulate upload progress
      setUploadProgress(10);

      // Read file as data URL for storage
      const reader = new FileReader();
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 80) + 10;
          setUploadProgress(progress);
        }
      };

      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUploadProgress(90);

        // Add data source to backend with data URL
        addDataSource(
          {
            id: `ds-${Date.now()}`,
            name: name.trim(),
            url: dataUrl,
          },
          {
            onSuccess: () => {
              toast.success('Data source uploaded successfully!');
              setName('');
              setFile(null);
              setUploadProgress(0);
            },
            onError: (error) => {
              toast.error(`Upload failed: ${error.message}`);
              setUploadProgress(0);
            },
          }
        );
      };

      reader.onerror = () => {
        toast.error('Failed to read file.');
        setUploadProgress(0);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to process file.');
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Data Upload</h1>
        <p className="text-muted-foreground">
          Upload your data sources to enable AI-powered analytics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Upload New Data Source</CardTitle>
            <CardDescription>Supports CSV, JSON, and Excel files (max 10MB)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Data Source Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sales Data Q4 2024"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label>File Upload</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-emerald bg-emerald/10'
                    : 'border-border/40 hover:border-emerald/50'
                } ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-2">
                    <FileText className="h-12 w-12 mx-auto text-emerald" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFile(null)}
                      disabled={isPending}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your file here, or
                    </p>
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".csv,.json,.xlsx,.xls"
                      onChange={handleFileChange}
                      disabled={isPending}
                    />
                  </div>
                )}
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!name.trim() || !file || isPending}
              className="w-full bg-emerald hover:bg-emerald/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Data Source
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Data Sources List */}
        <DataSourceList dataSources={dataSources} isLoading={isLoading} />
      </div>
    </div>
  );
}
