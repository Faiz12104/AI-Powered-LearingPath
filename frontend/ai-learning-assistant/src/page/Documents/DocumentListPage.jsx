import React, { useState, useEffect } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;

    setDeleting(true);

    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`${selectedDoc.title} deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-100 mb-4">
            <FileText
              className="w-10 h-10 text-slate-400"
              strokeWidth={1.5}
            />
          </div>

          <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">
            No Documents Yet
          </h3>

          <p className="text-sm text-slate-500 mb-6">
            Get started by uploading your first PDF document to begin learning.
          </p>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-teal-600"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Upload Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents?.map((doc) => (
        <DocumentCard
          key={doc._id}
          document={doc}
          onDelete={handleDeleteRequest}
        />
      ))}
    </div>
  );
};

 return (
  <div className="min-h-screen">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]"></div>

    <div className="relative max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
            My Documents
          </h1>
          <p className="text-slate-500 text-sm">
            Manage and organize your learning materials
          </p>
        </div>

        {documents.length > 0 && (
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Upload Document
          </Button>
        )}
      </div>

      {renderContent()}
    </div>

   {isUploadModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 relative">

    {/* Close button */}
    <button
      onClick={() => setIsUploadModalOpen(false)}
      className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
    >
      <X className="w-5 h-5" strokeWidth={2} />
    </button>

    {/* Modal Header */}
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Upload New Document
      </h2>
      <p className="text-sm text-slate-500">
        Add a PDF document to your library
      </p>
    </div>

    {/* Form */}
    <form onSubmit={handleUpload} className="space-y-5">

      {/* Title Input */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Document Title
        </label>
        <input
          type="text"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
          required
          placeholder="e.g., React Interview Prep"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2">
          PDF File
        </label>

        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-400 transition cursor-pointer relative">
          <input
            id="file-upload"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".pdf"
          />

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-100">
              <Upload className="w-6 h-6 text-emerald-600" strokeWidth={2} />
            </div>

            <p className="text-sm text-slate-600">
              {uploadFile ? (
                <span className="font-medium text-slate-800">
                  {uploadFile.name}
                </span>
              ) : (
                <>
                  <span className="text-emerald-600 font-medium">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </>
              )}
            </p>

            <p className="text-xs text-slate-400">
              PDF up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => setIsUploadModalOpen(false)}
          disabled={uploading}
          className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={uploading}
          className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:from-emerald-600 hover:to-teal-600"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </span>
          ) : (
            "Upload"
          )}
        </button>
      </div>

    </form>
  </div>
</div>)}

{isDeleteModalOpen&& (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">

    {/* Close button */}
    <button
      onClick={() => setIsDeleteModalOpen(false)}
      className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
    >
      <X className="w-5 h-5" strokeWidth={2} />
    </button>

    {/* Modal Header */}
    <div className="flex flex-col items-center text-center mb-5">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-100 mb-3">
        <Trash2 className="w-6 h-6 text-red-500" strokeWidth={2} />
      </div>

      <h2 className="text-lg font-semibold text-slate-900">
        Confirm Deletion
      </h2>
    </div>

    {/* Content */}
    <p className="text-sm text-slate-600 text-center mb-6">
      Are you sure you want to delete the document:{" "}
      <span className="font-semibold text-slate-900">
        {selectedDoc?.title}
      </span>
      ? This action cannot be undone.
    </p>

    {/* Action Buttons */}
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => setIsDeleteModalOpen(false)}
        disabled={deleting}
        className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
      >
        Cancel
      </button>

      <button
        onClick={handleConfirmDelete}
        disabled={deleting}
        className="px-5 py-2 text-sm rounded-lg bg-red-500 text-white shadow-md hover:bg-red-600"
      >
        {deleting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Deleting...
          </span>
        ) : (
          "Delete"
        )}
      </button>
    </div>

  </div>
</div>)}
  </div>
);
};

export default DocumentListPage;