import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  MapPin,
  Sun,
  Timer,
  Focus,
  Image as ImageIcon,
  Cpu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ImageMetadata, PdfMetadata } from "../types/metadata";
import {
  formatDate,
  formatGPS,
  formatExposureTime,
  formatAperture,
  formatFocalLength,
  formatISO,
  formatFlash,
  formatOrientation,
} from "../utils/formatters";
import { cn } from "../lib/utils";

// ─── Image metadata section ──────────────────────────────────────────────────

interface MetaGroupProps {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function MetaGroup({ title, icon: Icon, color, children, defaultOpen = true }: MetaGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-surface-700/50 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-4 py-3 bg-surface-800/60 hover:bg-surface-800/80 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className={cn("flex items-center justify-center w-7 h-7 rounded-lg", color)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold text-surface-200">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-surface-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-surface-500" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 space-y-0 bg-surface-800/20">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  const isNA = value === "Not Available";
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-surface-700/30 last:border-0">
      <span className="text-xs text-surface-500 shrink-0 w-32">{label}</span>
      <span className={cn("text-xs text-right leading-snug", isNA ? "text-surface-600 italic" : "text-surface-200")}>
        {value}
      </span>
    </div>
  );
}

// ─── ImageMetadataPanel ───────────────────────────────────────────────────────

interface ImageMetadataPanelProps {
  metadata: ImageMetadata;
}

export function ImageMetadataPanel({ metadata }: ImageMetadataPanelProps) {
  const { exif, width, height, aspectRatio, resolution } = metadata;

  return (
    <div className="space-y-3">
      <MetaGroup title="Image Properties" icon={ImageIcon} color="bg-brand-500/20 border border-brand-500/30 text-brand-400">
        <MetaRow label="Dimensions" value={`${width} × ${height} px`} />
        <MetaRow label="Resolution" value={resolution ?? "Not Available"} />
        <MetaRow label="Aspect Ratio" value={aspectRatio} />
      </MetaGroup>

      <MetaGroup title="Camera" icon={Camera} color="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
        <MetaRow label="Make" value={exif.make ?? "Not Available"} />
        <MetaRow label="Model" value={exif.model ?? "Not Available"} />
        <MetaRow label="Lens" value={exif.lens ?? "Not Available"} />
        <MetaRow label="Software" value={exif.software ?? "Not Available"} />
      </MetaGroup>

      <MetaGroup title="Exposure" icon={Sun} color="bg-amber-500/20 border border-amber-500/30 text-amber-400">
        <MetaRow label="ISO" value={formatISO(exif.iso)} />
        <MetaRow label="Aperture" value={formatAperture(exif.aperture)} />
        <MetaRow label="Exposure Time" value={formatExposureTime(exif.exposureTime)} />
        <MetaRow label="Focal Length" value={formatFocalLength(exif.focalLength)} />
        <MetaRow label="Flash" value={formatFlash(exif.flash)} />
      </MetaGroup>

      <MetaGroup title="GPS Location" icon={MapPin} color="bg-rose-500/20 border border-rose-500/30 text-rose-400" defaultOpen={false}>
        <MetaRow
          label="Coordinates"
          value={formatGPS(exif.gpsLatitude, exif.gpsLongitude)}
        />
        {exif.gpsLatitude !== undefined && exif.gpsLongitude !== undefined && (
          <div className="pt-2 pb-1">
            <a
              href={`https://maps.google.com/?q=${exif.gpsLatitude},${exif.gpsLongitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              Open in Google Maps
            </a>
          </div>
        )}
      </MetaGroup>

      <MetaGroup title="Other EXIF" icon={Cpu} color="bg-purple-500/20 border border-purple-500/30 text-purple-400" defaultOpen={false}>
        <MetaRow label="Date Taken" value={exif.dateTaken ? formatDate(exif.dateTaken) : "Not Available"} />
        <MetaRow label="Orientation" value={formatOrientation(exif.orientation)} />
        <MetaRow label="Color Space" value={exif.colorSpace ?? "Not Available"} />
        <MetaRow label="White Balance" value={exif.whiteBalance ?? "Not Available"} />
      </MetaGroup>
    </div>
  );
}

// ─── PdfMetadataPanel ─────────────────────────────────────────────────────────

interface PdfMetadataPanelProps {
  metadata: PdfMetadata;
}

export function PdfMetadataPanel({ metadata }: PdfMetadataPanelProps) {
  return (
    <div className="space-y-3">
      <MetaGroup title="Document Info" icon={Focus} color="bg-amber-500/20 border border-amber-500/30 text-amber-400">
        <MetaRow label="Title" value={metadata.title ?? "Not Available"} />
        <MetaRow label="Author" value={metadata.author ?? "Not Available"} />
        <MetaRow label="Subject" value={metadata.subject ?? "Not Available"} />
        <MetaRow label="Keywords" value={metadata.keywords ?? "Not Available"} />
      </MetaGroup>

      <MetaGroup title="Technical" icon={Cpu} color="bg-brand-500/20 border border-brand-500/30 text-brand-400">
        <MetaRow label="Pages" value={String(metadata.pageCount)} />
        <MetaRow label="PDF Version" value={metadata.pdfVersion ?? "Not Available"} />
        <MetaRow label="Creator" value={metadata.creator ?? "Not Available"} />
        <MetaRow label="Producer" value={metadata.producer ?? "Not Available"} />
      </MetaGroup>

      <MetaGroup title="Dates" icon={Timer} color="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
        <MetaRow label="Created" value={formatDate(metadata.creationDate)} />
        <MetaRow label="Modified" value={formatDate(metadata.modificationDate)} />
      </MetaGroup>
    </div>
  );
}
