"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSpreadsheet,
  FileText,
  Mail,
  MessageSquare,
  Upload,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

const acceptedTypes = [
  { type: "pdf", label: "PDF Statement", icon: FileText, accept: ".pdf" },
  { type: "csv", label: "CSV Export", icon: FileSpreadsheet, accept: ".csv" },
  { type: "excel", label: "Excel File", icon: FileSpreadsheet, accept: ".xlsx,.xls" },
  { type: "sms", label: "SMS Export", icon: MessageSquare, accept: ".txt,.json" },
  { type: "email", label: "Email Export", icon: Mail, accept: ".eml,.mbox" },
];

interface UploadCenterProps {
  onUploadComplete?: (transactionCount: number) => void;
}

export function UploadCenter({ onUploadComplete }: UploadCenterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const processUpload = useCallback(async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);
    setUploading(true);
    setProgress(0);
    setCompleted(false);

    try {
      setProgress(20);
      const results = await Promise.all(selectedFiles.map((file) => api.uploadFile(file)));
      setProgress(85);
      const transactionCount = results.reduce((total, result) => total + result.transactions_extracted, 0);
      setProgress(100);
      setCompleted(true);
      toast.success(`Processed ${selectedFiles.length} file(s) — ${transactionCount} transactions extracted`);
      onUploadComplete?.(transactionCount);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't process that file.");
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processUpload(e.dataTransfer.files);
      }
    },
    [processUpload]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUpload(e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? "rgba(99, 102, 241, 0.5)" : "rgba(255,255,255,0.08)",
        }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragging && "border-indigo-500 bg-indigo-500/5"
          )}
        >
          <CardContent className="flex flex-col items-center justify-center py-16 px-8">
            <AnimatePresence mode="wait">
              {completed ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analysis Complete!</h3>
                  <p className="text-muted-foreground text-sm">
                    47 transactions extracted, 12 subscriptions detected
                  </p>
                </motion.div>
              ) : uploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-md text-center"
                >
                  <Loader2 className="h-12 w-12 text-indigo-400 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold mb-2">Processing with AI...</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Extracting transactions, detecting patterns, categorizing merchants
                  </p>
                  <Progress value={progress} className="h-2" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="rounded-2xl bg-indigo-500/10 p-4 inline-block mb-4">
                    <Upload className="h-10 w-10 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Drop your files here
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                    Upload bank statements, CSV exports, SMS/email notifications.
                    AI will extract and analyze all recurring payments.
                  </p>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.csv,.xlsx,.xls,.txt,.json,.eml,.mbox"
                      onChange={handleFileSelect}
                    />
                    <Button variant="gradient" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {acceptedTypes.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:border-indigo-500/30 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <Icon className="h-6 w-6 text-indigo-400 mb-2" />
                  <p className="text-xs font-medium">{item.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
