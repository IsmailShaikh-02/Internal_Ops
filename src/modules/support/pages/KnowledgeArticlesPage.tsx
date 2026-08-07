import { useState, useMemo } from "react";
import { useSupportStore } from "../hooks/useSupportState";
import type { KnowledgeArticle } from "../types";
import { ArticleDetailsModal } from "../components/ArticleDetailsModal";
import { CreateArticleModal } from "../components/CreateArticleModal";
import { Search, BookOpen, Tag } from "lucide-react";
import { toast } from "sonner";

export function KnowledgeArticlesPage() {
  const { articles, updateArticle } = useSupportStore();

  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "getting_started", "hrms", "billing", "security", "integrations", "troubleshooting", "faqs"];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCategory = selectedCategory === "all" || art.category.toLowerCase() === selectedCategory.replace("_", " ");
      const matchSearch =
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch && art.status !== "archived";
    });
  }, [articles, selectedCategory, searchTerm]);

  const handleEditSubmit = (data: any) => {
    if (!selectedArticle) return;
    updateArticle(
      selectedArticle.id,
      data.title,
      data.content,
      data.category,
      data.notes,
      "Ada Turing" // logged in user name
    );
    toast.success("Knowledge article revised successfully!");
    setIsEditorOpen(false);
    setIsViewerOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Category Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search knowledge base articles..."
            className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto min-w-max pb-1 md:pb-0">
          <Tag className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of articles matching the screenshot styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-400 font-semibold bg-white border border-slate-200 rounded-xl">
            No articles found matching the criteria.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => {
                setSelectedArticle(art);
                setIsViewerOpen(true);
              }}
              className="bg-white border border-slate-200 hover:border-slate-350 p-6 rounded-2xl shadow-xs transition duration-150 cursor-pointer space-y-4 hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {art.category}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-800 tracking-tight leading-snug line-clamp-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {art.content}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-50">
                <span>Updated {art.lastUpdated}</span>
                <span>•</span>
                <span>{art.readTime}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Viewer Modal */}
      {selectedArticle && (
        <ArticleDetailsModal
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedArticle(null);
          }}
          article={selectedArticle}
          onEdit={() => setIsEditorOpen(true)}
        />
      )}

      {/* Editor Modal */}
      {selectedArticle && (
        <CreateArticleModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          editingArticle={selectedArticle}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
export default KnowledgeArticlesPage;
