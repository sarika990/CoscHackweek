import { motion } from "framer-motion";
import {
  File,
  HardDrive,
  Calendar,
  Clock,
  Tag,
  Layers,
  Hash,
} from "lucide-react";
import type { UploadedFile } from "../types/metadata";
import { formatBytes, formatDate } from "../utils/formatters";
import { getMimeLabel } from "../utils/fileHelpers";

interface FileInformationProps {
  file: UploadedFile;
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}

function InfoRow({ icon: Icon, label, value, mono }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-surface-700/40 last:border-0">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface-700/60 shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-surface-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-surface-500 mb-0.5">{label}</p>
        <p
          className={`text-sm text-surface-200 break-all leading-snug ${mono ? "font-mono text-xs" : ""}`}
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function FileInformation({ file }: FileInformationProps) {
  const { fileInfo } = file;

  return (
    <motion.div
      className="rounded-2xl bg-surface-800/50 border border-surface-700/50 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-5 py-4 border-b border-surface-700/40">
        <div className="flex items-center gap-2">
          <File className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-semibold text-surface-200">File Information</h3>
        </div>
      </div>

      <div className="px-5">
        <InfoRow icon={Hash} label="File Name" value={fileInfo.name} />
        <InfoRow icon={HardDrive} label="File Size" value={formatBytes(fileInfo.size)} />
        <InfoRow icon={Tag} label="MIME Type" value={getMimeLabel(fileInfo.mimeType)} mono />
        <InfoRow icon={Layers} label="Extension" value={fileInfo.extension.toUpperCase()} />
        <InfoRow icon={Calendar} label="Last Modified" value={formatDate(fileInfo.lastModified)} />
        <InfoRow icon={Clock} label="Uploaded At" value={formatDate(fileInfo.createdAt)} />
      </div>
    </motion.div>
  );
}
