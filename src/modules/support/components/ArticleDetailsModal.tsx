import { Modal } from "./Modal";
import type { KnowledgeArticle } from "../types";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { User, Calendar, Clock, History, Edit3 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ArticleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: KnowledgeArticle;
  onEdit: () => void;
}

export function ArticleDetailsModal({ isOpen, onClose, article, onEdit }: ArticleDetailsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Knowledge Article Viewer">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[450px]">
        {/* Left Side: Article Content */}
        <div className="md:col-span-8 space-y-4 pr-0 md:pr-4 overflow-y-auto max-h-[70vh]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold border border-slate-200">
              {article.category.replace("_", " ").toUpperCase()}
            </span>
            <StatusBadge variant={article.status === "published" ? "success" : "warning"}>
              {article.status.toUpperCase()}
            </StatusBadge>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h2>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs rounded-lg cursor-pointer shrink-0 ml-2"
            >
              <Edit3 className="h-3 w-3" />
              Edit
            </Button>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-slate-400" />
              By {article.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Updated {article.lastUpdated}
            </span>
            <span>•</span>
            <span className="bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded-md">
              v{article.version}
            </span>
          </div>

          {/* Body Content */}
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap pt-2">
            {article.content}
          </div>
        </div>

        {/* Right Side: Version History Panel */}
        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-slate-500" />
            Revision History
          </h4>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
              <div className="flex justify-between items-center font-bold text-blue-900">
                <span>Version {article.version} (Latest)</span>
                <span>Active</span>
              </div>
              <p className="text-slate-600 mt-1 italic">Current active release published by {article.author}</p>
            </div>

            {article.history && article.history.length > 0 ? (
              article.history.map((rev, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between items-center font-semibold text-slate-700">
                    <span>Version {rev.version}</span>
                    <span className="text-slate-400 text-[10px]">{rev.date}</span>
                  </div>
                  <p className="text-slate-500">{rev.notes}</p>
                  <div className="text-[10px] text-slate-400">By {rev.updatedBy}</div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-semibold italic text-center py-6">
                No older revisions recorded.
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
